import { recipeSchema } from "../recipe";
import type { JsonSchema, ToolSpec } from "../types";

const inputSchema: JsonSchema = {
  type: "object",
  required: ["title", "servings", "ingredients", "steps"],
  properties: {
    title: { type: "string" },
    servings: { type: "integer", minimum: 1 },
    totalMinutes: { type: ["integer", "null"] },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "amount", "unit"],
        properties: {
          name: { type: "string" },
          amount: { type: ["number", "null"] },
          unit: { type: ["string", "null"] },
        },
      },
    },
    steps: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "content", "timerSeconds"],
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          timerSeconds: { type: ["integer", "null"] },
        },
      },
    },
    notes: { type: "array", items: { type: "string" } },
  },
};

/**
 * Emits a recipe as structured data. The model's input is validated against the recipe
 * schema before anything is shown or saved (hard rules #4 and #8). The validated recipe
 * is returned so the chat loop can stream it to the client as a `recipe` event.
 */
export const presentRecipeTool: ToolSpec = {
  name: "present_recipe",
  description:
    "Показывает пользователю готовый рецепт в структурированном виде (ингредиенты, шаги, заметки). Используй это вместо описания рецепта прозой.",
  inputSchema,
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
