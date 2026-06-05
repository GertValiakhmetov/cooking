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

/**
 * Scalable-quantity markers in step text: «{{300 г}} творога», «{{1 шт}} яйцо».
 * Inside the braces — one number (decimal comma or dot) + optional unit. Clients
 * rescale these when the user changes servings; everything else stays literal.
 */
export const QUANTITY_MARKER = /\{\{([^{}]*)\}\}/g;
const MARKER_BODY = /^\d+(?:[.,]\d+)?(?:\s+[^{}\s][^{}]*)?$/;

/** Every {{…}} parses and no stray double braces remain — malformed markers go back to the model. */
function validQuantityMarkers(content: string): boolean {
  const stripped = content.replace(QUANTITY_MARKER, (_, body: string) =>
    MARKER_BODY.test(body.trim()) ? "" : "{{bad}}",
  );
  return !/\{\{|\}\}/.test(stripped);
}

export const recipeStepSchema = z.object({
  title: z.string().min(1).describe("Короткая метка шага в 2–4 слова, например «Обжарить лук»"),
  content: z
    .string()
    .min(1)
    .refine(validQuantityMarkers, {
      message:
        "Маркеры количеств не парсятся: внутри {{…}} должно быть одно число и необязательная единица, например {{300 г}}; фигурные скобки без пары недопустимы",
    })
    .describe(
      "Полная инструкция шага: что и как делать, с температурой и признаками готовности, где уместно. " +
        "Количества, зависящие от числа порций, оборачивай в двойные фигурные скобки: «добавь {{300 г}} творога», «{{1 шт}} яйцо», «влей {{2 л}} воды» — одно число и единица внутри. " +
        "НЕ оборачивай времена, температуры, размеры нарезки и диапазоны («3–4 мин», «180°C», «кубиками 2 см» — без скобок).",
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
