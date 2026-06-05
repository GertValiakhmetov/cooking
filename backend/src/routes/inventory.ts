import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { type AuthVars, requireUser } from "../auth/middleware";
import { db } from "../db/client";
import { inventoryItems } from "../db/schema";
import { jsonBody } from "../http/openapi";
import { rateLimit } from "../http/rate-limit";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

const createSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().nonnegative().nullish(),
  unit: z.string().min(1).nullish(),
  category: z.string().min(1).nullish(),
  expiresOn: dateString.nullish(),
});
const updateSchema = createSchema.partial();

const idParam = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string" as const, format: "uuid" },
};

export const inventoryRoutes = new Hono<{ Variables: AuthVars }>();
inventoryRoutes.use("*", requireUser);
inventoryRoutes.use("*", rateLimit("inventory", 120, 60_000));

inventoryRoutes.get(
  "/",
  describeRoute({
    tags: ["inventory"],
    summary: "Список ингредиентов (склад)",
    responses: { 200: { description: "Все ингредиенты текущего пользователя" } },
  }),
  async (c) => {
    const items = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.userId, c.get("userId")));
    return c.json({ items });
  },
);

inventoryRoutes.post(
  "/",
  describeRoute({
    tags: ["inventory"],
    summary: "Добавить ингредиент",
    requestBody: jsonBody(createSchema),
    responses: {
      201: { description: "Созданный ингредиент" },
      400: { description: "Ошибка валидации" },
    },
  }),
  async (c) => {
    const body = createSchema.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "validation_error", issues: body.error.issues }, 400);
    const v = body.data;
    const [row] = await db
      .insert(inventoryItems)
      .values({
        userId: c.get("userId"),
        name: v.name,
        quantity: v.quantity == null ? null : String(v.quantity),
        unit: v.unit ?? null,
        category: v.category ?? null,
        expiresOn: v.expiresOn ?? null,
      })
      .returning();
    if (!row) return c.json({ error: "internal_error" }, 500);
    return c.json(row, 201);
  },
);

inventoryRoutes.patch(
  "/:id",
  describeRoute({
    tags: ["inventory"],
    summary: "Изменить ингредиент (количество/единицу/срок)",
    parameters: [idParam],
    requestBody: jsonBody(updateSchema),
    responses: {
      200: { description: "Обновлённый ингредиент" },
      400: { description: "Ошибка валидации" },
      404: { description: "Не найден или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const body = updateSchema.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "validation_error", issues: body.error.issues }, 400);
    const v = body.data;
    const [row] = await db
      .update(inventoryItems)
      .set({
        ...(v.name !== undefined ? { name: v.name } : {}),
        ...(v.quantity !== undefined
          ? { quantity: v.quantity == null ? null : String(v.quantity) }
          : {}),
        ...(v.unit !== undefined ? { unit: v.unit ?? null } : {}),
        ...(v.category !== undefined ? { category: v.category ?? null } : {}),
        ...(v.expiresOn !== undefined ? { expiresOn: v.expiresOn ?? null } : {}),
        updatedAt: new Date(),
      })
      .where(
        and(eq(inventoryItems.id, c.req.param("id")), eq(inventoryItems.userId, c.get("userId"))),
      )
      .returning();
    if (!row) return c.json({ error: "not_found" }, 404);
    return c.json(row);
  },
);

inventoryRoutes.delete(
  "/:id",
  describeRoute({
    tags: ["inventory"],
    summary: "Удалить ингредиент",
    parameters: [idParam],
    responses: {
      200: { description: "Удалено" },
      404: { description: "Не найден или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const [row] = await db
      .delete(inventoryItems)
      .where(
        and(eq(inventoryItems.id, c.req.param("id")), eq(inventoryItems.userId, c.get("userId"))),
      )
      .returning({ id: inventoryItems.id });
    if (!row) return c.json({ error: "not_found" }, 404);
    return c.json({ ok: true });
  },
);
