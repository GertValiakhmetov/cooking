import { and, asc, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
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

conversationRoutes.post("/", async (c) => {
  const [row] = await db
    .insert(conversations)
    .values({ userId: c.get("userId") })
    .returning();
  if (!row) return c.json({ error: "internal_error" }, 500);
  return c.json(row, 201);
});

conversationRoutes.get("/", async (c) => {
  const rows = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, c.get("userId")))
    .orderBy(desc(conversations.updatedAt));
  return c.json({ conversations: rows });
});

conversationRoutes.get("/:id/messages", async (c) => {
  const conv = await loadOwnedConversation(c.req.param("id"), c.get("userId"));
  if (!conv) return c.json({ error: "not_found" }, 404);
  const rows = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conv.id))
    .orderBy(asc(messagesTable.createdAt));
  return c.json({ messages: rows });
});

// ---- /chat (SSE) -------------------------------------------------------------
const chatSchema = z.object({
  conversationId: z.string().uuid(),
  message: z.string().min(1),
});

export const chatRoutes = new Hono<{ Variables: AuthVars }>();
chatRoutes.use("*", requireUser);
chatRoutes.use("*", rateLimit("chat", 30, 60_000));

chatRoutes.post("/", async (c) => {
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
});
