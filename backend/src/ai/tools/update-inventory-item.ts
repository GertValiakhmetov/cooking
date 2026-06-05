import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/client";
import { inventoryItems } from "../../db/schema";
import { inventoryUpdateSchema } from "../../domain/inventory";
import type { ToolSpec } from "../types";
import { zodToToolSchema } from "./schema";

const inputSchema = inventoryUpdateSchema.extend({ id: z.string().uuid() });

export const updateInventoryItemTool: ToolSpec = {
  name: "update_inventory_item",
  description:
    "Изменяет ингредиент на складе по id — количество, единицу, срок годности или название. Используй, когда пользователь израсходовал часть продукта или уточняет данные. id бери из get_inventory / search_inventory.",
  inputSchema: zodToToolSchema(inputSchema),
  handler: async (input, ctx) => {
    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) {
      return { content: `Невалидные данные: ${parsed.error.message}`, isError: true };
    }
    const v = parsed.data;
    const [row] = await db
      .update(inventoryItems)
      .set({
        ...(v.name !== undefined ? { name: v.name } : {}),
        ...(v.quantity !== undefined
          ? { quantity: v.quantity == null ? null : String(v.quantity) }
          : {}),
        ...(v.unit !== undefined ? { unit: v.unit ?? null } : {}),
        ...(v.category !== undefined ? { category: v.category ?? null } : {}),
        ...(v.expiresOn !== undefined ? { expiresOn: v.expiresOn ?? null } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(inventoryItems.id, v.id), eq(inventoryItems.userId, ctx.userId)))
      .returning();
    if (!row) {
      return { content: "Ингредиент с таким id не найден на складе пользователя.", isError: true };
    }
    const amount = row.quantity ? `${row.quantity} ${row.unit ?? ""}`.trimEnd() : "—";
    return { content: `Обновлено: ${row.name}, теперь ${amount}.` };
  },
};
