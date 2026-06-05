import { z } from "zod";

/**
 * Validated environment. Dev-friendly defaults keep local runs and tests working
 * without a .env; production should set real values (especially JWT_SECRET and
 * ANTHROPIC_API_KEY). The Anthropic key is backend-only and never shipped to clients.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),

  DATABASE_URL: z.string().default("postgres://postgres:postgres@localhost:5433/cooking"),

  JWT_SECRET: z.string().min(16).default("dev-only-secret-change-me-0123456789abcdef"),
  JWT_TTL: z.string().default("30d"),
  PUBLIC_APP_URL: z.string().url().default("http://localhost:5173"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  ANTHROPIC_API_KEY: z.string().default(""),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-6"),
  ANTHROPIC_MODEL_CHEAP: z.string().default("claude-haiku-4-5-20251001"),
});

export const env = schema.parse(process.env);
export type Env = z.infer<typeof schema>;
