import type { ToolSpec } from "../types";
import { getInventoryTool } from "./get-inventory";
import { presentRecipeTool } from "./present-recipe";

export const tools: ToolSpec[] = [getInventoryTool, presentRecipeTool];
