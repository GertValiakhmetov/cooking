import { describe, expect, it } from "vitest";
import { diffIngredients } from "./recipe-check";

const ing = (name: string) => ({ name, amount: null, unit: null });

describe("diffIngredients", () => {
  it("matches exact names ignoring case and whitespace", () => {
    const r = diffIngredients([ing("Яйца ")], ["яйца"]);
    expect(r.have).toEqual(["Яйца "]);
    expect(r.missing).toEqual([]);
  });

  it("matches by a shared word (≥3 chars)", () => {
    const r = diffIngredients([ing("оливковое масло")], ["масло"]);
    expect(r.have).toEqual(["оливковое масло"]);
  });

  it("does not false-positive on substrings inside words", () => {
    const r = diffIngredients([ing("соль")], ["фасоль"]);
    expect(r.missing).toEqual(["соль"]);
  });

  it("splits have and missing", () => {
    const r = diffIngredients(
      [ing("яйца"), ing("мука"), ing("шафран")],
      ["Яйца", "мука пшеничная"],
    );
    expect(r.have).toEqual(["яйца", "мука"]);
    expect(r.missing).toEqual(["шафран"]);
  });

  it("ignores empty inventory names", () => {
    const r = diffIngredients([ing("яйца")], ["", "  "]);
    expect(r.missing).toEqual(["яйца"]);
  });
});
