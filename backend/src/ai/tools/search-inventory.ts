import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/client";
import { inventoryItems } from "../../db/schema";
import type { ToolSpec } from "../types";
import { zodToToolSchema } from "./schema";

const inputSchema = z.object({ query: z.string().min(1) });

export const searchInventoryTool: ToolSpec = {
  name: "search_inventory",
  description:
    "Ищет ингредиент на складе по части названия. Возвращает совпадения с id и количеством — быстрее и точнее, чем полный get_inventory, когда нужен один продукт.",
  inputSchema: zodToToolSchema(inputSchema),
  handler: async (input, ctx) => {
    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) {
      return { content: `Невалидный запрос: ${parsed.error.message}`, isError: true };
    }
    const rows = await db
      .select()
      .from(inventoryItems)
      .where(
        and(
          eq(inventoryItems.userId, ctx.userId),
          ilike(inventoryItems.name, `%${parsed.data.query}%`),
        ),
      );
    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      quantity: r.quantity,
      unit: r.unit,
      expiresOn: r.expiresOn,
    }));
    return { content: JSON.stringify({ items }) };
  },
};
