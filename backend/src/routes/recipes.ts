import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { recipeSchema } from "../ai/recipe";
import { type AuthVars, requireUser } from "../auth/middleware";
import { db } from "../db/client";
import { inventoryItems, recipes } from "../db/schema";
import { diffIngredients } from "../domain/recipe-check";
import { jsonBody } from "../http/openapi";
import { rateLimit } from "../http/rate-limit";

const saveSchema = recipeSchema.extend({ source: z.enum(["ai", "manual"]) });

const idParam = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string" as const, format: "uuid" },
};

export const recipeRoutes = new Hono<{ Variables: AuthVars }>();
recipeRoutes.use("*", requireUser);
recipeRoutes.use("*", rateLimit("recipes", 120, 60_000));

recipeRoutes.get(
  "/",
  describeRoute({
    tags: ["recipes"],
    summary: "Сохранённые рецепты",
    responses: { 200: { description: "Рецепты текущего пользователя (свежие сверху)" } },
  }),
  async (c) => {
    const items = await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, c.get("userId")))
      .orderBy(desc(recipes.createdAt));
    return c.json({ recipes: items });
  },
);

recipeRoutes.get(
  "/:id",
  describeRoute({
    tags: ["recipes"],
    summary: "Один рецепт",
    parameters: [idParam],
    responses: {
      200: { description: "Рецепт целиком" },
      404: { description: "Не найден или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const [row] = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, c.req.param("id")), eq(recipes.userId, c.get("userId"))))
      .limit(1);
    if (!row) return c.json({ error: "not_found" }, 404);
    return c.json(row);
  },
);

recipeRoutes.post(
  "/",
  describeRoute({
    tags: ["recipes"],
    summary: "Сохранить рецепт",
    requestBody: jsonBody(saveSchema),
    responses: {
      201: { description: "Сохранённый рецепт" },
      400: { description: "Рецепт не прошёл валидацию схемой" },
    },
  }),
  async (c) => {
    const body = saveSchema.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "validation_error", issues: body.error.issues }, 400);
    const v = body.data;
    const [row] = await db
      .insert(recipes)
      .values({
        userId: c.get("userId"),
        title: v.title,
        servings: v.servings,
        totalMinutes: v.totalMinutes,
        ingredients: v.ingredients,
        steps: v.steps,
        notes: v.notes,
        source: v.source,
      })
      .returning();
    if (!row) return c.json({ error: "internal_error" }, 500);
    return c.json(row, 201);
  },
);

recipeRoutes.delete(
  "/:id",
  describeRoute({
    tags: ["recipes"],
    summary: "Удалить рецепт",
    parameters: [idParam],
    responses: {
      200: { description: "Удалено" },
      404: { description: "Не найден или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const [row] = await db
      .delete(recipes)
      .where(and(eq(recipes.id, c.req.param("id")), eq(recipes.userId, c.get("userId"))))
      .returning({ id: recipes.id });
    if (!row) return c.json({ error: "not_found" }, 404);
    return c.json({ ok: true });
  },
);

recipeRoutes.post(
  "/:id/check",
  describeRoute({
    tags: ["recipes"],
    summary: "Сверить рецепт со складом",
    description:
      "Best-effort диф (точное совпадение или общее слово ≥3 букв), только для отображения: без конвертации единиц и синонимов — тонкий матчинг делает ассистент.",
    parameters: [idParam],
    responses: {
      200: { description: "{ have: string[], missing: string[] }" },
      404: { description: "Не найден или принадлежит другому пользователю" },
    },
  }),
  async (c) => {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, c.req.param("id")), eq(recipes.userId, c.get("userId"))))
      .limit(1);
    if (!recipe) return c.json({ error: "not_found" }, 404);

    const stock = await db
      .select({ name: inventoryItems.name })
      .from(inventoryItems)
      .where(eq(inventoryItems.userId, c.get("userId")));

    return c.json(
      diffIngredients(
        recipe.ingredients,
        stock.map((s) => s.name),
      ),
    );
  },
);
