import type { RecipeIngredient } from "../ai/recipe";

const normalize = (s: string) => s.trim().toLowerCase();

const tokenize = (s: string) =>
  normalize(s)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= 3);

/**
 * Best-effort diff of recipe ingredients against inventory names — display only (v1).
 * Match = normalized string equality OR a shared word of ≥3 chars ("оливковое масло" ~ "масло",
 * but "соль" ≠ "фасоль"). No unit conversion or synonym resolution: nuanced matching is the
 * model's job (§4.2, decisions log).
 */
export function diffIngredients(
  ingredients: RecipeIngredient[],
  inventoryNames: string[],
): { have: string[]; missing: string[] } {
  const entries = inventoryNames
    .map((n) => ({ full: normalize(n), words: new Set(tokenize(n)) }))
    .filter((e) => e.full.length > 0);

  const have: string[] = [];
  const missing: string[] = [];
  for (const ingredient of ingredients) {
    const full = normalize(ingredient.name);
    const words = tokenize(ingredient.name);
    const matched = entries.some((e) => e.full === full || words.some((w) => e.words.has(w)));
    (matched ? have : missing).push(ingredient.name);
  }
  return { have, missing };
}
