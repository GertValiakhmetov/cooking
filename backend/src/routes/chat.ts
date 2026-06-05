import { and, asc, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { createAnthropicModel } from "../ai/anthropic";
import { runChat } from "../ai/chat";
import { pruneInventoryResults } from "../ai/replay";
import { buildSystemPrompt } from "../ai/system-prompt";
import { tools } from "../ai/tools";
import type { ConversationMessage } from "../ai/types";
import { type AuthVars, requireUser } from "../auth/middleware";
import { db } from "../db/client";
import { conversations, equipment, messages as messagesTable } from "../db/schema";
import { jsonBody } from "../http/openapi";
import { rateLimit } from "../http/rate-limit";

async function loadOwnedConversation(id: string, userId: string) {
  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
    .limit(1);
  return conv ?? null;
}

async function equipmentSummary(userId: string): Promise<string> {
  const rows = await db.select().from(equipment).where(eq(equipment.userId, userId));
  return rows.map((r) => `- ${r.name} (${r.type})`).join("\n");
}

async function persistMessage(conversationId: string, m: ConversationMessage): Promise<void> {
  await db.insert(messagesTable).values({ conversationId, role: m.role, content: m.content });
}

// ---- /conversations ----------------------------------------------------------
export const conversationRoutes = new Hono<{ Variables: AuthVars }>();
conversationRoutes.use("*", requireUser);

conversationRoutes.post(
  "/",
  describeRoute({
    tags: ["conversations"],
    summary: "Создать диалог",
    responses: { 201: { description: "Новый диалог" } },
  }),
  async (c) => {
    const [row] = await db
      .insert(conversations)
      .values({ userId: c.get("userId") })
      .returning();
    if (!row) return c.json({ error: "internal_error" }, 500);
    return c.json(row, 201);
  },
);

conversationRoutes.get(
  "/",
  describeRoute({
    tags: ["conversations"],
    summary: "Список диалогов",
    responses: { 200: { description: "Диалоги текущего пользователя (свежие сверху)" } },
  }),
  async (c) => {
    const rows = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, c.get("userId")))
      .orderBy(desc(conversations.updatedAt));
    return c.json({ conversations: rows });
  },
);

conversationRoutes.get(
  "/:id/messages",
  describeRoute({
    tags: ["conversations"],
    summary: "История диалога",
    description: "Сообщения как сырые Anthropic content-блоки (text / tool_use / tool_result).",
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        schema: { type: "string" as const, format: "uuid" },
      },
    ],
    responses: {
      200: { description: "Сообщения по возрастанию времени" },
      404: { description: "Диалог не найден или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const conv = await loadOwnedConversation(c.req.param("id"), c.get("userId"));
    if (!conv) return c.json({ error: "not_found" }, 404);
    const rows = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, conv.id))
      .orderBy(asc(messagesTable.createdAt));
    return c.json({ messages: rows });
  },
);

const renameSchema = z.object({ title: z.string().min(1).max(200) });
const idParam = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string" as const, format: "uuid" },
};

conversationRoutes.patch(
  "/:id",
  describeRoute({
    tags: ["conversations"],
    summary: "Переименовать диалог",
    parameters: [idParam],
    requestBody: jsonBody(renameSchema),
    responses: {
      200: { description: "Обновлённый диалог" },
      404: { description: "Не найден или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const body = renameSchema.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "validation_error" }, 400);
    const [row] = await db
      .update(conversations)
      .set({ title: body.data.title, updatedAt: new Date() })
      .where(
        and(eq(conversations.id, c.req.param("id")), eq(conversations.userId, c.get("userId"))),
      )
      .returning();
    if (!row) return c.json({ error: "not_found" }, 404);
    return c.json(row);
  },
);

conversationRoutes.delete(
  "/:id",
  describeRoute({
    tags: ["conversations"],
    summary: "Удалить диалог",
    parameters: [idParam],
    responses: {
      200: { description: "Удалено" },
      404: { description: "Не найден или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const [row] = await db
      .delete(conversations)
      .where(
        and(eq(conversations.id, c.req.param("id")), eq(conversations.userId, c.get("userId"))),
      )
      .returning({ id: conversations.id });
    if (!row) return c.json({ error: "not_found" }, 404);
    return c.json({ ok: true });
  },
);

// ---- /chat (SSE) -------------------------------------------------------------
const chatSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1),
});

export const chatRoutes = new Hono<{ Variables: AuthVars }>();
chatRoutes.use("*", requireUser);
chatRoutes.use("*", rateLimit("chat", 30, 60_000));

chatRoutes.post(
  "/",
  describeRoute({
    tags: ["chat"],
    summary: "Сообщение ассистенту (SSE-стрим)",
    description:
      "Стримит ответ по Server-Sent Events. События: `text` (дельта токенов), `tool` (вызов инструмента начат/завершён), `recipe` (валидированный рецепт одним блоком), `error`, `done`. Прозa стримится по токенам; рецепт приходит целиком.",
    requestBody: jsonBody(chatSchema),
    responses: {
      200: {
        description:
          "SSE-поток (text/event-stream) с событиями text | tool | recipe | error | done",
      },
      400: { description: "Ошибка валидации" },
      404: { description: "Диалог не найден или принадлежит другому пользователю" },
      429: { description: "Превышен лимит запросов" },
    },
  }),
  async (c) => {
    const parsed = chatSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success)
      return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
    const userId = c.get("userId");
    const { conversationId, message } = parsed.data;

    const conv = await loadOwnedConversation(conversationId, userId);
    if (!conv) return c.json({ error: "not_found" }, 404);

    const priorRows = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, conv.id))
      .orderBy(asc(messagesTable.createdAt));
    const prior: ConversationMessage[] = priorRows.map((r) => ({
      role: r.role === "assistant" ? "assistant" : "user",
      content: r.content,
    }));

    const userMessage: ConversationMessage = {
      role: "user",
      content: [{ type: "text", text: message }],
    };
    await persistMessage(conv.id, userMessage);

    // Auto-title a fresh conversation from its first message (cheap, no extra model call).
    if (!conv.title) {
      const title = message.length > 48 ? `${message.slice(0, 48).trimEnd()}…` : message;
      await db.update(conversations).set({ title }).where(eq(conversations.id, conv.id));
    }

    const history = pruneInventoryResults([...prior, userMessage]);
    const system = buildSystemPrompt(await equipmentSummary(userId));
    const model = createAnthropicModel();

    return streamSSE(c, async (stream) => {
      try {
        for await (const ev of runChat(history, {
          model,
          tools,
          toolContext: { userId },
          system,
          onMessage: (m) => persistMessage(conv.id, m),
        })) {
          await stream.writeSSE({ event: ev.type, data: JSON.stringify(ev) });
        }
      } catch (err) {
        await stream.writeSSE({
          event: "error",
          data: JSON.stringify({ type: "error", message: (err as Error).message }),
        });
      }
      await db
        .update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, conv.id));
    });
  },
);
