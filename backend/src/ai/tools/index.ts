import type { ToolSpec } from "../types";
import { addInventoryItemTool } from "./add-inventory-item";
import { getEquipmentTool } from "./get-equipment";
import { getInventoryTool } from "./get-inventory";
import { presentRecipeTool } from "./present-recipe";
import { removeInventoryItemTool } from "./remove-inventory-item";
import { saveRecipeTool } from "./save-recipe";
import { searchInventoryTool } from "./search-inventory";
import { updateInventoryItemTool } from "./update-inventory-item";

/** The full toolset from §7.3 — every handler is user-scoped and Zod-validated. */
export const tools: ToolSpec[] = [
  getInventoryTool,
  searchInventoryTool,
  addInventoryItemTool,
  updateInventoryItemTool,
  removeInventoryItemTool,
  getEquipmentTool,
  presentRecipeTool,
  saveRecipeTool,
];
