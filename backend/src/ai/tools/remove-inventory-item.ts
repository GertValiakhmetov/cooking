import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/client";
import { inventoryItems } from "../../db/schema";
import type { ToolSpec } from "../types";
import { zodToToolSchema } from "./schema";

const inputSchema = z.object({ id: z.string().uuid() });

export const removeInventoryItemTool: ToolSpec = {
  name: "remove_inventory_item",
  description:
    "Удаляет ингредиент со склада по id — продукт закончился, испортился или добавлен по ошибке. id бери из get_inventory / search_inventory.",
  inputSchema: zodToToolSchema(inputSchema),
  handler: async (input, ctx) => {
    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) {
      return { content: `Невалидные данные: ${parsed.error.message}`, isError: true };
    }
    const [row] = await db
      .delete(inventoryItems)
      .where(and(eq(inventoryItems.id, parsed.data.id), eq(inventoryItems.userId, ctx.userId)))
      .returning({ name: inventoryItems.name });
    if (!row) {
      return { content: "Ингредиент с таким id не найден на складе пользователя.", isError: true };
    }
    return { content: `Удалено со склада: ${row.name}.` };
  },
};
