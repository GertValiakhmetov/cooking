import { describe, expect, it } from "vitest";
import { addInventoryItemTool } from "./add-inventory-item";
import { removeInventoryItemTool } from "./remove-inventory-item";
import { saveRecipeTool } from "./save-recipe";
import { searchInventoryTool } from "./search-inventory";
import { updateInventoryItemTool } from "./update-inventory-item";

const ctx = { userId: "00000000-0000-0000-0000-000000000000" };

// Validation runs before any DB access, so invalid input never touches the database.
describe("tool input validation", () => {
  it("save_recipe rejects an invalid recipe", async () => {
    const res = await saveRecipeTool.handler({ title: "x" }, ctx);
    expect(res.isError).toBe(true);
  });

  it("add_inventory_item rejects negative quantity", async () => {
    const res = await addInventoryItemTool.handler({ name: "яйца", quantity: -1 }, ctx);
    expect(res.isError).toBe(true);
  });

  it("update_inventory_item requires a uuid id", async () => {
    const res = await updateInventoryItemTool.handler({ id: "not-a-uuid", quantity: 1 }, ctx);
    expect(res.isError).toBe(true);
  });

  it("remove_inventory_item requires an id", async () => {
    const res = await removeInventoryItemTool.handler({}, ctx);
    expect(res.isError).toBe(true);
  });

  it("search_inventory requires a non-empty query", async () => {
    const res = await searchInventoryTool.handler({ query: "" }, ctx);
    expect(res.isError).toBe(true);
  });
});
