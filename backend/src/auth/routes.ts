import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";
import { db } from "../db/client";
import { users } from "../db/schema";
import { jsonBody } from "../http/openapi";
import { InviteError, redeemInvite } from "./invite";
import { signSession } from "./jwt";
import { type AuthVars, requireUser } from "./middleware";

export const authRoutes = new Hono<{ Variables: AuthVars }>();

const redeemSchema = z.object({
  token: z.string().min(1),
  displayName: z.string().min(1).max(80).optional(),
});

authRoutes.post(
  "/redeem",
  describeRoute({
    tags: ["auth"],
    summary: "Обменять инвайт-токен на JWT-сессию",
    security: [],
    requestBody: jsonBody(redeemSchema),
    responses: {
      200: {
        description: "JWT-сессия (~30 дней)",
        content: { "application/json": { schema: resolver(z.object({ jwt: z.string() })) } },
      },
      400: { description: "Невалидный, использованный или просроченный инвайт" },
    },
  }),
  async (c) => {
    const parsed = redeemSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "validation_error" }, 400);
    try {
      const { userId } = await redeemInvite(parsed.data.token, parsed.data.displayName);
      return c.json({ jwt: await signSession(userId) });
    } catch (err) {
      if (err instanceof InviteError) return c.json({ error: err.message }, 400);
      throw err;
    }
  },
);

authRoutes.get(
  "/me",
  describeRoute({
    tags: ["auth"],
    summary: "Текущий пользователь",
    responses: {
      200: { description: "Профиль (id, email, displayName)" },
      401: { description: "Нет или невалидный Bearer-токен" },
    },
  }),
  requireUser,
  async (c) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, c.get("userId")))
      .limit(1);
    if (!user) return c.json({ error: "not_found" }, 404);
    return c.json({ id: user.id, email: user.email, displayName: user.displayName });
  },
);
