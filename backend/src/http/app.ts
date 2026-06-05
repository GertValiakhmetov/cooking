import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";
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

  app.get(
    "/health",
    describeRoute({ tags: ["meta"], summary: "Health check", security: [] }),
    (c) => c.json({ ok: true }),
  );

  app.route("/auth", authRoutes);
  app.route("/conversations", conversationRoutes);
  app.route("/chat", chatRoutes);
  app.route("/inventory", inventoryRoutes);
  app.route("/equipment", equipmentRoutes);

  // API docs — dev only: OpenAPI generated from the Zod schemas, Scalar UI on /docs.
  if (env.NODE_ENV !== "production") {
    app.get(
      "/openapi.json",
      openAPIRouteHandler(app, {
        documentation: {
          info: {
            title: "Cooking Assistant API",
            version: "0.1.0",
            description:
              "Приватный API кулинарного ассистента. Авторизация: одноразовый инвайт-токен → POST /auth/redeem → Bearer JWT (вставь его в Auth здесь, в Scalar).",
          },
          components: {
            securitySchemes: {
              bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            },
          },
          security: [{ bearerAuth: [] }],
        },
        exclude: ["/openapi.json", "/docs"],
      }),
    );
    app.get("/docs", Scalar({ url: "/openapi.json", pageTitle: "Cooking Assistant API" }));
  }

  app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "internal_error" }, 500);
  });

  return app;
}
