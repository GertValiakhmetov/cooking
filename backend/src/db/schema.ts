import { sql } from "drizzle-orm";
import { date, integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { RecipeIngredient, RecipeStep } from "../ai/recipe";
import type { ContentBlock } from "../ai/types";

const createdAt = () =>
  timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow();

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  createdAt: createdAt(),
});

export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  quantity: numeric("quantity"),
  unit: text("unit"),
  category: text("category"),
  expiresOn: date("expires_on"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  attributes: jsonb("attributes").$type<Record<string, unknown>>(),
  createdAt: createdAt(),
});

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  servings: integer("servings").notNull(),
  totalMinutes: integer("total_minutes"),
  ingredients: jsonb("ingredients").$type<RecipeIngredient[]>().notNull(),
  steps: jsonb("steps").$type<RecipeStep[]>().notNull(),
  notes: jsonb("notes").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  source: text("source").notNull(), // "ai" | "manual"
  createdAt: createdAt(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" | "assistant"
  // Raw Anthropic content blocks (text/tool_use/tool_result) for faithful replay (§6, §7.6).
  content: jsonb("content").$type<ContentBlock[]>().notNull(),
  createdAt: createdAt(),
});

// Invite tokens (v1 auth). The maintainer mints one per friend; redeeming it issues a JWT.
// Only the token hash is stored.
export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true, mode: "date" }),
  createdUserId: uuid("created_user_id").references(() => users.id),
  createdAt: createdAt(),
});
