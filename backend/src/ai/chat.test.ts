import { describe, expect, it } from "vitest";
import { runChat } from "./chat";
import { presentRecipeTool } from "./tools/present-recipe";
import type { ChatEvent, ChatModel, ConversationMessage, ModelStreamEvent } from "./types";

/** A ChatModel that replays a fixed script of turns (one array of events per loop step). */
function scriptedModel(turns: ModelStreamEvent[][]): ChatModel {
  let i = 0;
  return {
    async *streamTurn() {
      const turn = turns[i++] ?? [{ type: "turn_end", stopReason: "end_turn" }];
      yield* turn;
    },
  };
}

const validRecipe = {
  title: "Омлет",
  servings: 2,
  totalMinutes: 10,
  ingredients: [{ name: "Яйца", amount: 3, unit: null }],
  steps: [{ title: "Взбить", content: "Взбей и пожарь", timerSeconds: 120 }],
  notes: [],
};

async function drain(gen: AsyncGenerator<ChatEvent>): Promise<ChatEvent[]> {
  const out: ChatEvent[] = [];
  for await (const ev of gen) out.push(ev);
  return out;
}

describe("runChat", () => {
  it("streams plain text then done", async () => {
    const model = scriptedModel([
      [
        { type: "text_delta", text: "При" },
        { type: "text_delta", text: "вет" },
        { type: "turn_end", stopReason: "end_turn" },
      ],
    ]);
    const history: ConversationMessage[] = [
      { role: "user", content: [{ type: "text", text: "привет" }] },
    ];
    const events = await drain(
      runChat(history, { model, tools: [], toolContext: { userId: "u1" }, system: [] }),
    );
    expect(events.map((e) => e.type)).toEqual(["text", "text", "done"]);
    const text = events.reduce((acc, e) => (e.type === "text" ? acc + e.text : acc), "");
    expect(text).toBe("Привет");
  });

  it("runs a tool call and emits a validated recipe, persisting raw blocks", async () => {
    const model = scriptedModel([
      [
        { type: "tool_use", id: "t1", name: "present_recipe", input: validRecipe },
        { type: "turn_end", stopReason: "tool_use" },
      ],
      [
        { type: "text_delta", text: "Готово!" },
        { type: "turn_end", stopReason: "end_turn" },
      ],
    ]);
    const persisted: ConversationMessage[] = [];
    const history: ConversationMessage[] = [
      { role: "user", content: [{ type: "text", text: "омлет" }] },
    ];
    const events = await drain(
      runChat(history, {
        model,
        tools: [presentRecipeTool],
        toolContext: { userId: "u1" },
        system: [],
        onMessage: (m) => {
          persisted.push(m);
        },
      }),
    );

    expect(events.map((e) => e.type)).toEqual(["tool", "recipe", "tool", "text", "done"]);
    const recipeEv = events.find((e) => e.type === "recipe");
    expect(recipeEv?.type === "recipe" && recipeEv.recipe.title).toBe("Омлет");

    // assistant(tool_use) -> user(tool_result) -> assistant(text)
    expect(persisted).toHaveLength(3);
    expect(persisted[0]?.role).toBe("assistant");
    expect(persisted[1]?.role).toBe("user");
    expect(persisted[1]?.content[0]?.type).toBe("tool_result");
    expect(persisted[2]?.role).toBe("assistant");
  });

  it("announces a tool while its input is still streaming, without duplicating start", async () => {
    const model = scriptedModel([
      [
        { type: "tool_pending", name: "present_recipe" },
        { type: "tool_use", id: "t1", name: "present_recipe", input: validRecipe },
        { type: "turn_end", stopReason: "tool_use" },
      ],
      [
        { type: "text_delta", text: "Готово!" },
        { type: "turn_end", stopReason: "end_turn" },
      ],
    ]);
    const history: ConversationMessage[] = [
      { role: "user", content: [{ type: "text", text: "омлет" }] },
    ];
    const events = await drain(
      runChat(history, {
        model,
        tools: [presentRecipeTool],
        toolContext: { userId: "u1" },
        system: [],
      }),
    );
    const toolEvents = events.filter((e) => e.type === "tool");
    expect(toolEvents).toEqual([
      { type: "tool", name: "present_recipe", phase: "start" },
      { type: "tool", name: "present_recipe", phase: "end" },
    ]);
    // the early start precedes the recipe block
    expect(events.map((e) => e.type)).toEqual(["tool", "recipe", "tool", "text", "done"]);
  });

  it("returns a tool error (not a recipe) when present_recipe input is invalid", async () => {
    const model = scriptedModel([
      [
        { type: "tool_use", id: "t1", name: "present_recipe", input: { title: "bad" } },
        { type: "turn_end", stopReason: "tool_use" },
      ],
      [{ type: "turn_end", stopReason: "end_turn" }],
    ]);
    const history: ConversationMessage[] = [
      { role: "user", content: [{ type: "text", text: "омлет" }] },
    ];
    const events = await drain(
      runChat(history, {
        model,
        tools: [presentRecipeTool],
        toolContext: { userId: "u1" },
        system: [],
      }),
    );
    expect(events.some((e) => e.type === "recipe")).toBe(false);
  });
});
