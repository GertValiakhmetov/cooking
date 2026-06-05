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

  const withStep = (content: string) => ({
    title: "X",
    servings: 2,
    totalMinutes: null,
    ingredients: [{ name: "a", amount: null, unit: null }],
    steps: [{ title: "Шаг", content, timerSeconds: null }],
  });

  it("accepts quantity markers in step content", () => {
    const res = recipeSchema.safeParse(
      withStep("К {{300 г}} творога добавь {{1 шт}} яйцо, {{1,5 ст.л.}} сахара и жарь 3–4 мин."),
    );
    expect(res.success).toBe(true);
  });

  it("accepts steps without any markers (old-style content)", () => {
    expect(recipeSchema.safeParse(withStep("Взбей яйца и пожарь.")).success).toBe(true);
  });

  it("rejects malformed quantity markers", () => {
    expect(recipeSchema.safeParse(withStep("Добавь {{соль по вкусу}}.")).success).toBe(false);
    expect(recipeSchema.safeParse(withStep("Добавь {{300 г муки.")).success).toBe(false);
    expect(recipeSchema.safeParse(withStep("Добавь 300 г}} муки.")).success).toBe(false);
  });
});
