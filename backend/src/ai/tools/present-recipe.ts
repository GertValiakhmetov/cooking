import { recipeSchema } from "../recipe";
import type { ToolSpec } from "../types";
import { zodToToolSchema } from "./schema";

/**
 * Emits a recipe as structured data. The model's input is validated against the recipe
 * schema before anything is shown or saved (hard rules #4 and #8). The validated recipe
 * is returned so the chat loop can stream it to the client as a `recipe` event.
 */
export const presentRecipeTool: ToolSpec = {
  name: "present_recipe",
  description:
    "Показывает пользователю готовый рецепт в структурированном виде (ингредиенты, шаги, заметки). Используй это вместо описания рецепта прозой.",
  inputSchema: zodToToolSchema(recipeSchema),
  handler: async (input) => {
    const parsed = recipeSchema.safeParse(input);
    if (!parsed.success) {
      return {
        content: `Рецепт не прошёл валидацию: ${parsed.error.message}. Исправь поля и вызови present_recipe снова.`,
        isError: true,
      };
    }
    return { content: "Рецепт показан пользователю.", recipe: parsed.data };
  },
};
