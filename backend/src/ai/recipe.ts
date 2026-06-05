import { z } from "zod";

/**
 * Structured recipe (§7.5). Recipes are always validated against this — never free-form prose.
 * The .describe() texts feed the present_recipe/save_recipe tool schema, so they are written
 * for the model: they define field semantics the JSON types alone can't carry.
 */
export const recipeIngredientSchema = z.object({
  name: z.string().min(1).describe("Название ингредиента, например «Куриное филе»"),
  amount: z.number().nullable().describe("Количество в единицах из unit; null означает «по вкусу»"),
  unit: z
    .string()
    .nullable()
    .describe(
      "Единица измерения: предпочитай «г» и «мл», допустимы «шт», «ст.л.», «ч.л.», «головка»; null для штучных без меры или «по вкусу»",
    ),
});

export const recipeStepSchema = z.object({
  title: z.string().min(1).describe("Короткая метка шага в 2–4 слова, например «Обжарить лук»"),
  content: z
    .string()
    .min(1)
    .describe(
      "Полная инструкция шага: что и как делать, с температурой и признаками готовности, где уместно",
    ),
  timerSeconds: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .describe(
      "Таймер в секундах — только если на шаге реально ждут по времени (варка, выпечка, маринование); иначе null",
    ),
});

export const recipeSchema = z.object({
  title: z.string().min(1).describe("Название блюда"),
  servings: z.number().int().positive().describe("Число порций, на которое рассчитаны количества"),
  totalMinutes: z
    .number()
    .int()
    .positive()
    .nullable()
    .describe("Общее время приготовления в минутах, включая ожидание; null, если оценить нельзя"),
  ingredients: z
    .array(recipeIngredientSchema)
    .min(1)
    .describe("Все ингредиенты с количествами в метрических единицах"),
  steps: z.array(recipeStepSchema).min(1).describe("Шаги приготовления по порядку выполнения"),
  notes: z
    .array(z.string())
    .default([])
    .describe("Необязательные короткие заметки: замены ингредиентов, хранение, подача"),
});

export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
