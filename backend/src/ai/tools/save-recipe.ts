import { db } from "../../db/client";
import { recipes } from "../../db/schema";
import { recipeSchema } from "../recipe";
import type { ToolSpec } from "../types";
import { zodToToolSchema } from "./schema";

/** Persists a validated recipe to the user's collection (hard rules #4, #5, #8). */
export const saveRecipeTool: ToolSpec = {
  name: "save_recipe",
  description:
    "Сохраняет рецепт в коллекцию пользователя. Вызывай, когда пользователь просит сохранить рецепт (обычно тот, что ты только что показал через present_recipe).",
  inputSchema: zodToToolSchema(recipeSchema),
  handler: async (input, ctx) => {
    const parsed = recipeSchema.safeParse(input);
    if (!parsed.success) {
      return { content: `Рецепт не прошёл валидацию: ${parsed.error.message}`, isError: true };
    }
    const v = parsed.data;
    const [row] = await db
      .insert(recipes)
      .values({
        userId: ctx.userId,
        title: v.title,
        servings: v.servings,
        totalMinutes: v.totalMinutes,
        ingredients: v.ingredients,
        steps: v.steps,
        notes: v.notes,
        source: "ai",
      })
      .returning({ id: recipes.id, title: recipes.title });
    if (!row) return { content: "Не удалось сохранить рецепт.", isError: true };
    return { content: `Рецепт «${row.title}» сохранён (id: ${row.id}).` };
  },
};
