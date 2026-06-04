import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { AuthVars } from "../auth/middleware";
import { authRoutes } from "../auth/routes";
import { env } from "../env";
import { chatRoutes, conversationRoutes } from "../routes/chat";
import { equipmentRoutes } from "../routes/equipment";
import { inventoryRoutes } from "../routes/inventory";

export function createApp() {
  const app = new Hono<{ Variables: AuthVars }>();

  app.use("*", logger());
  app.use(
    "*",
    cors({
      origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    }),
  );

  app.get("/health", (c) => c.json({ ok: true }));

  app.route("/auth", authRoutes);
  app.route("/conversations", conversationRoutes);
  app.route("/chat", chatRoutes);
  app.route("/inventory", inventoryRoutes);
  app.route("/equipment", equipmentRoutes);

  app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "internal_error" }, 500);
  });

  return app;
}
