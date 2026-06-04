import { describe, expect, it } from "vitest";
import { hashToken } from "./invite";

describe("hashToken", () => {
  it("is deterministic", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
  });

  it("differs for different tokens", () => {
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });

  it("produces a sha256 hex digest", () => {
    expect(hashToken("abc")).toMatch(/^[0-9a-f]{64}$/);
  });
});
