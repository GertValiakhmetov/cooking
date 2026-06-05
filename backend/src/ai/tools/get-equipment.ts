import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { equipment } from "../../db/schema";
import type { ToolSpec } from "../types";

export const getEquipmentTool: ToolSpec = {
  name: "get_equipment",
  description:
    "Возвращает кухонное оборудование пользователя с деталями (attributes: размеры, мощность и т.п.). Краткий список уже есть в системном промпте — вызывай только когда нужны детали.",
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  handler: async (_input, ctx) => {
    const rows = await db.select().from(equipment).where(eq(equipment.userId, ctx.userId));
    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      attributes: r.attributes,
    }));
    return { content: JSON.stringify({ items }) };
  },
};
