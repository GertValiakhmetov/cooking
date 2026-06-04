import { createMiddleware } from "hono/factory";
import { verifySession } from "./jwt";

export type AuthVars = { userId: string };

/** Resolves the user from a Bearer JWT and enforces auth. Every protected route uses this. */
export const requireUser = createMiddleware<{ Variables: AuthVars }>(async (c, next) => {
  const header = c.req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return c.json({ error: "unauthorized" }, 401);
  try {
    c.set("userId", await verifySession(token));
  } catch {
    return c.json({ error: "unauthorized" }, 401);
  }
  await next();
});
