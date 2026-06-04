import { describe, expect, it } from "vitest";
import { recipeSchema } from "./recipe";

describe("recipeSchema", () => {
  it("accepts a valid recipe and defaults notes to []", () => {
    const r = recipeSchema.parse({
      title: "Омлет",
      servings: 2,
      totalMinutes: 10,
      ingredients: [{ name: "Яйца", amount: 3, unit: null }],
      steps: [{ title: "Взбить", content: "Взбей яйца и пожарь", timerSeconds: null }],
    });
    expect(r.notes).toEqual([]);
    expect(r.servings).toBe(2);
  });

  it("rejects empty ingredients", () => {
    const res = recipeSchema.safeParse({
      title: "X",
      servings: 1,
      totalMinutes: null,
      ingredients: [],
      steps: [{ title: "a", content: "b", timerSeconds: null }],
    });
    expect(res.success).toBe(false);
  });

  it("rejects non-positive servings", () => {
    const res = recipeSchema.safeParse({
      title: "X",
      servings: 0,
      totalMinutes: null,
      ingredients: [{ name: "a", amount: null, unit: null }],
      steps: [{ title: "a", content: "b", timerSeconds: null }],
    });
    expect(res.success).toBe(false);
  });
});
