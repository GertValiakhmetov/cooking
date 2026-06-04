import type { ConversationMessage } from "./types";

const LIVE_TOOLS = new Set(["get_inventory", "search_inventory"]);
const PLACEHOLDER =
  "(устаревшие данные склада опущены — при необходимости вызови get_inventory заново)";

/**
 * Inventory is live data, so we don't replay old inventory tool results verbatim (§7.6).
 * The tool_use/tool_result pairing is kept intact (required by the API); only the payload
 * of inventory results is shrunk, and only in turns older than the most recent one.
 */
export function pruneInventoryResults(messages: ConversationMessage[]): ConversationMessage[] {
  const toolNameById = new Map<string, string>();
  for (const m of messages) {
    for (const b of m.content) {
      if (b.type === "tool_use") toolNameById.set(b.id, b.name);
    }
  }

  let lastLiveResultIdx = -1;
  messages.forEach((m, i) => {
    for (const b of m.content) {
      if (b.type === "tool_result" && LIVE_TOOLS.has(toolNameById.get(b.tool_use_id) ?? "")) {
        lastLiveResultIdx = i;
      }
    }
  });

  return messages.map((m, i) => {
    if (i === lastLiveResultIdx) return m;
    let changed = false;
    const content = m.content.map((b) => {
      if (b.type === "tool_result" && LIVE_TOOLS.has(toolNameById.get(b.tool_use_id) ?? "")) {
        changed = true;
        return { ...b, content: PLACEHOLDER };
      }
      return b;
    });
    return changed ? { role: m.role, content } : m;
  });
}
