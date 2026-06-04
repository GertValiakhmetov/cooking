import { z } from "zod";

/** Structured recipe (§7.5). Recipes are always validated against this — never free-form prose. */
export const recipeIngredientSchema = z.object({
  name: z.string().min(1),
  amount: z.number().nullable(), // null for "to taste"
  unit: z.string().nullable(), // g, ml, tsp, pcs, ... (null for countable / to-taste)
});

export const recipeStepSchema = z.object({
  title: z.string().min(1), // short label, e.g. "Обжарить лук"
  content: z.string().min(1), // full instruction
  timerSeconds: z.number().int().nonnegative().nullable(),
});

export const recipeSchema = z.object({
  title: z.string().min(1),
  servings: z.number().int().positive(),
  totalMinutes: z.number().int().positive().nullable(),
  ingredients: z.array(recipeIngredientSchema).min(1),
  steps: z.array(recipeStepSchema).min(1),
  notes: z.array(z.string()).default([]),
});

export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
