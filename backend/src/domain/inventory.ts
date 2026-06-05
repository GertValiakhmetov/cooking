import { z } from "zod";

/** Shared inventory validation — one source of truth for HTTP routes and assistant tools. */
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

export const inventoryCreateSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().nonnegative().nullish(),
  unit: z.string().min(1).nullish(),
  category: z.string().min(1).nullish(),
  expiresOn: dateString.nullish(),
});

export const inventoryUpdateSchema = inventoryCreateSchema.partial();
