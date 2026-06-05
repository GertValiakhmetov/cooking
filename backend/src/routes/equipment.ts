import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { type AuthVars, requireUser } from "../auth/middleware";
import { db } from "../db/client";
import { equipment } from "../db/schema";
import { jsonBody } from "../http/openapi";
import { rateLimit } from "../http/rate-limit";

const createSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  attributes: z.record(z.string(), z.unknown()).nullish(),
});
const updateSchema = createSchema.partial();

const idParam = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string" as const, format: "uuid" },
};

export const equipmentRoutes = new Hono<{ Variables: AuthVars }>();
equipmentRoutes.use("*", requireUser);
equipmentRoutes.use("*", rateLimit("equipment", 120, 60_000));

equipmentRoutes.get(
  "/",
  describeRoute({
    tags: ["equipment"],
    summary: "Список оборудования",
    responses: { 200: { description: "Всё оборудование текущего пользователя" } },
  }),
  async (c) => {
    const items = await db
      .select()
      .from(equipment)
      .where(eq(equipment.userId, c.get("userId")));
    return c.json({ items });
  },
);

equipmentRoutes.post(
  "/",
  describeRoute({
    tags: ["equipment"],
    summary: "Добавить оборудование",
    requestBody: jsonBody(createSchema),
    responses: {
      201: { description: "Созданная единица оборудования" },
      400: { description: "Ошибка валидации" },
    },
  }),
  async (c) => {
    const body = createSchema.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "validation_error", issues: body.error.issues }, 400);
    const v = body.data;
    const [row] = await db
      .insert(equipment)
      .values({
        userId: c.get("userId"),
        name: v.name,
        type: v.type,
        attributes: v.attributes ?? null,
      })
      .returning();
    if (!row) return c.json({ error: "internal_error" }, 500);
    return c.json(row, 201);
  },
);

equipmentRoutes.patch(
  "/:id",
  describeRoute({
    tags: ["equipment"],
    summary: "Изменить оборудование",
    parameters: [idParam],
    requestBody: jsonBody(updateSchema),
    responses: {
      200: { description: "Обновлённая единица оборудования" },
      400: { description: "Ошибка валидации" },
      404: { description: "Не найдено или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const body = updateSchema.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "validation_error", issues: body.error.issues }, 400);
    const v = body.data;
    const [row] = await db
      .update(equipment)
      .set({
        ...(v.name !== undefined ? { name: v.name } : {}),
        ...(v.type !== undefined ? { type: v.type } : {}),
        ...(v.attributes !== undefined ? { attributes: v.attributes ?? null } : {}),
      })
      .where(and(eq(equipment.id, c.req.param("id")), eq(equipment.userId, c.get("userId"))))
      .returning();
    if (!row) return c.json({ error: "not_found" }, 404);
    return c.json(row);
  },
);

equipmentRoutes.delete(
  "/:id",
  describeRoute({
    tags: ["equipment"],
    summary: "Удалить оборудование",
    parameters: [idParam],
    responses: {
      200: { description: "Удалено" },
      404: { description: "Не найдено или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const [row] = await db
      .delete(equipment)
      .where(and(eq(equipment.id, c.req.param("id")), eq(equipment.userId, c.get("userId"))))
      .returning({ id: equipment.id });
    if (!row) return c.json({ error: "not_found" }, 404);
    return c.json({ ok: true });
  },
);
