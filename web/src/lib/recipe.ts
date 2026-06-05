// Recipe shape — mirrors the backend Zod schema (§7.5). Backend is canonical.
export type RecipeIngredient = { name: string; amount: number | null; unit: string | null };
export type RecipeStep = { title: string; content: string; timerSeconds: number | null };
export type Recipe = {
  title: string;
  servings: number;
  totalMinutes: number | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  notes: string[];
};

/** Raw Anthropic content blocks, as persisted by the backend (§6, §7.6). */
export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string; is_error?: boolean };

/** Light runtime guard — the recipe was Zod-validated server-side before storage. */
export function asRecipe(input: unknown): Recipe | null {
  if (!input || typeof input !== "object") return null;
  const r = input as Partial<Recipe>;
  if (typeof r.title !== "string" || !Array.isArray(r.ingredients) || !Array.isArray(r.steps)) {
    return null;
  }
  return {
    title: r.title,
    servings: typeof r.servings === "number" ? r.servings : 1,
    totalMinutes: typeof r.totalMinutes === "number" ? r.totalMinutes : null,
    ingredients: r.ingredients,
    steps: r.steps,
    notes: Array.isArray(r.notes) ? r.notes : [],
  };
}
