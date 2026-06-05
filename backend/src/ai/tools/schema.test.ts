import { describe, expect, it } from "vitest";
import { z } from "zod";
import { zodToToolSchema } from "./schema";

describe("zodToToolSchema", () => {
  it("produces a bare object JSON schema without $schema", () => {
    const s = zodToToolSchema(z.object({ name: z.string(), amount: z.number().nullable() }));
    expect(s.type).toBe("object");
    expect(s).not.toHaveProperty("$schema");
    expect(s.properties).toHaveProperty("name");
    expect(s.required).toContain("name");
  });

  it("treats defaulted fields as optional on the input side", () => {
    const s = zodToToolSchema(
      z.object({ title: z.string(), notes: z.array(z.string()).default([]) }),
    );
    expect(s.required).toContain("title");
    expect(s.required ?? []).not.toContain("notes");
  });
});
