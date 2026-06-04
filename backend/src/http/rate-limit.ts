import { createMiddleware } from "hono/factory";
import type { AuthVars } from "../auth/middleware";

type Bucket = { count: number; resetAt: number };

/**
 * Pure in-memory fixed-window limiter. At ~10 users a single instance is enough — no Redis (§9).
 * Kept as a class so the logic is unit-testable without HTTP.
 */
export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  tryConsume(key: string, now: number): boolean {
    const bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (bucket.count >= this.limit) return false;
    bucket.count += 1;
    return true;
  }
}

export function rateLimit(name: string, limit: number, windowMs: number) {
  const limiter = new RateLimiter(limit, windowMs);
  return createMiddleware<{ Variables: AuthVars }>(async (c, next) => {
    const key = `${name}:${c.get("userId") ?? "anon"}`;
    if (!limiter.tryConsume(key, Date.now())) return c.json({ error: "rate_limited" }, 429);
    await next();
  });
}
