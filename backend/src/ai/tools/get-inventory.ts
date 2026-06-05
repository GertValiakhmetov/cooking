import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { inventoryItems } from "../../db/schema";
import type { ToolSpec } from "../types";

/** User-scoped read of the pantry. Ownership enforced via the user_id filter (hard rule #5). */
export const getInventoryTool: ToolSpec = {
  name: "get_inventory",
  description:
    "Возвращает текущие ингредиенты пользователя (склад): id, название, количество, единицу, категорию, срок годности. Вызывай, когда нужно знать, что есть в наличии; id используй для update/remove_inventory_item.",
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  handler: async (_input, ctx) => {
    const rows = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.userId, ctx.userId));
    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      quantity: r.quantity,
      unit: r.unit,
      category: r.category,
      expiresOn: r.expiresOn,
    }));
    return { content: JSON.stringify({ items }) };
  },
};
