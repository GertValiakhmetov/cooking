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

/** Scale a base amount by `ratio`, formatted the Russian way (comma decimals). */
export function scaleAmount(amount: number | null, unit: string | null, ratio: number): string {
  if (amount == null) return "по вкусу";
  const v = amount * ratio;
  let out: number;
  if (unit === "г" || unit === "мл") {
    // round grams/ml to a tidy step
    out = v >= 100 ? Math.round(v / 10) * 10 : Math.round(v);
  } else {
    out = Math.round(v * 2) / 2;
  }
  const str = Number.isInteger(out) ? String(out) : String(out).replace(".", ",");
  return unit ? `${str} ${unit}` : str;
}

/** {{300 г}} markers in step text — mirrors the backend recipeStepSchema contract. */
const QUANTITY_MARKER = /\{\{([^{}]*)\}\}/g;

export type StepSegment = { text: string; qty: boolean };

/**
 * Split step content into plain-text and quantity segments, scaling {{…}} markers
 * by `ratio`. Quantity segments get emphasised in the UI so amounts are scannable.
 */
export function scaleStepSegments(content: string, ratio: number): StepSegment[] {
  const out: StepSegment[] = [];
  let lastIndex = 0;
  for (const m of content.matchAll(QUANTITY_MARKER)) {
    if (m.index > lastIndex) out.push({ text: content.slice(lastIndex, m.index), qty: false });
    const parsed = /^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(m[1].trim());
    if (parsed) {
      const amount = Number(parsed[1].replace(",", "."));
      out.push({ text: scaleAmount(amount, parsed[2] || null, ratio), qty: true });
    } else {
      // не парсится — показываем без скобок, не врём числом
      out.push({ text: m[1].trim(), qty: false });
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < content.length) out.push({ text: content.slice(lastIndex), qty: false });
  return out;
}

/** True if any step carries scalable {{…}} markers (старые рецепты их не имеют). */
export function hasScalableSteps(recipe: Recipe): boolean {
  return recipe.steps.some((s) => /\{\{[^{}]*\}\}/.test(s.content));
}

/** «на 1 порцию / 2 порции / 5 порций» */
export function portionsWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "порцию";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "порции";
  return "порций";
}

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
