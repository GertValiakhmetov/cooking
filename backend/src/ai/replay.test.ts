import { describe, expect, it } from "vitest";
import { pruneInventoryResults } from "./replay";
import type { ConversationMessage } from "./types";

describe("pruneInventoryResults", () => {
  const big = JSON.stringify({ items: [{ name: "eggs" }, { name: "milk" }] });

  const messages: ConversationMessage[] = [
    { role: "user", content: [{ type: "text", text: "что есть?" }] },
    {
      role: "assistant",
      content: [{ type: "tool_use", id: "a", name: "get_inventory", input: {} }],
    },
    { role: "user", content: [{ type: "tool_result", tool_use_id: "a", content: big }] },
    { role: "assistant", content: [{ type: "text", text: "яйца, молоко" }] },
    { role: "user", content: [{ type: "text", text: "а теперь?" }] },
    {
      role: "assistant",
      content: [{ type: "tool_use", id: "b", name: "get_inventory", input: {} }],
    },
    { role: "user", content: [{ type: "tool_result", tool_use_id: "b", content: big }] },
  ];

  it("shrinks stale inventory results but keeps the most recent one", () => {
    const out = pruneInventoryResults(messages);
    const stale = out[2]?.content[0];
    const fresh = out[6]?.content[0];
    expect(stale?.type === "tool_result" && stale.content !== big).toBe(true);
    expect(fresh?.type === "tool_result" && fresh.content === big).toBe(true);
  });

  it("preserves tool_use/tool_result pairing (still a tool_result block)", () => {
    const out = pruneInventoryResults(messages);
    const stale = out[2]?.content[0];
    expect(stale?.type).toBe("tool_result");
  });
});
