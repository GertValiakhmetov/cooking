import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "./jwt";

describe("session jwt", () => {
  it("round-trips a user id", async () => {
    const token = await signSession("user-123");
    expect(await verifySession(token)).toBe("user-123");
  });

  it("rejects a tampered token", async () => {
    const token = await signSession("user-123");
    await expect(verifySession(`${token}tamper`)).rejects.toThrow();
  });
});
