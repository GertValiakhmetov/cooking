import { db } from "../../db/client";
import { inventoryItems } from "../../db/schema";
import { inventoryCreateSchema } from "../../domain/inventory";
import type { ToolSpec } from "../types";
import { zodToToolSchema } from "./schema";

export const addInventoryItemTool: ToolSpec = {
  name: "add_inventory_item",
  description:
    "Добавляет ингредиент на склад пользователя — например, когда он говорит, что купил продукты. Количество в метрических единицах (г, мл, шт); срок годности в формате YYYY-MM-DD.",
  inputSchema: zodToToolSchema(inventoryCreateSchema),
  handler: async (input, ctx) => {
    const parsed = inventoryCreateSchema.safeParse(input);
    if (!parsed.success) {
      return { content: `Невалидные данные: ${parsed.error.message}`, isError: true };
    }
    const v = parsed.data;
    const [row] = await db
      .insert(inventoryItems)
      .values({
        userId: ctx.userId,
        name: v.name,
        quantity: v.quantity == null ? null : String(v.quantity),
        unit: v.unit ?? null,
        category: v.category ?? null,
        expiresOn: v.expiresOn ?? null,
      })
      .returning();
    if (!row) return { content: "Не удалось добавить ингредиент.", isError: true };
    const amount = row.quantity ? ` — ${row.quantity} ${row.unit ?? ""}`.trimEnd() : "";
    return { content: `Добавлено: ${row.name}${amount} (id: ${row.id}).` };
  },
};
