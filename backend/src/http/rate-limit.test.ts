import { describe, expect, it } from "vitest";
import { RateLimiter } from "./rate-limit";

describe("RateLimiter", () => {
  it("allows up to the limit then blocks within the window", () => {
    const rl = new RateLimiter(2, 1000);
    expect(rl.tryConsume("k", 0)).toBe(true);
    expect(rl.tryConsume("k", 100)).toBe(true);
    expect(rl.tryConsume("k", 200)).toBe(false);
  });

  it("resets after the window elapses", () => {
    const rl = new RateLimiter(1, 1000);
    expect(rl.tryConsume("k", 0)).toBe(true);
    expect(rl.tryConsume("k", 500)).toBe(false);
    expect(rl.tryConsume("k", 1000)).toBe(true);
  });

  it("tracks keys independently", () => {
    const rl = new RateLimiter(1, 1000);
    expect(rl.tryConsume("a", 0)).toBe(true);
    expect(rl.tryConsume("b", 0)).toBe(true);
    expect(rl.tryConsume("a", 0)).toBe(false);
  });
});
