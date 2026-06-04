import type {
  ChatEvent,
  ChatModel,
  ContentBlock,
  ConversationMessage,
  SystemPrompt,
  ToolContext,
  ToolResult,
  ToolSpec,
  ToolUseBlock,
} from "./types";

export type RunChatDeps = {
  model: ChatModel;
  tools: ToolSpec[];
  toolContext: ToolContext;
  system: SystemPrompt;
  /** Called for each newly appended message so the caller can persist it (raw blocks). */
  onMessage?: (message: ConversationMessage) => void | Promise<void>;
  maxSteps?: number;
};

const DEFAULT_MAX_STEPS = 8;

/**
 * The streaming tool-use loop (§7.4). `history` already includes the new user message.
 * Yields typed events; the HTTP layer forwards them as SSE. Prose streams token-by-token;
 * a recipe is emitted as one validated block once the present_recipe tool input completes.
 */
export async function* runChat(
  history: ConversationMessage[],
  deps: RunChatDeps,
): AsyncGenerator<ChatEvent> {
  const messages = [...history];
  const toolsByName = new Map(deps.tools.map((t) => [t.name, t]));
  const maxSteps = deps.maxSteps ?? DEFAULT_MAX_STEPS;

  for (let step = 0; step < maxSteps; step++) {
    const assistantContent: ContentBlock[] = [];
    let textBuffer = "";
    let stopReason = "end_turn";

    for await (const ev of deps.model.streamTurn({
      system: deps.system,
      messages,
      tools: deps.tools,
    })) {
      if (ev.type === "text_delta") {
        textBuffer += ev.text;
        yield { type: "text", text: ev.text };
      } else if (ev.type === "tool_use") {
        if (textBuffer) {
          assistantContent.push({ type: "text", text: textBuffer });
          textBuffer = "";
        }
        assistantContent.push({ type: "tool_use", id: ev.id, name: ev.name, input: ev.input });
      } else {
        stopReason = ev.stopReason;
      }
    }
    if (textBuffer) assistantContent.push({ type: "text", text: textBuffer });

    const assistantMessage: ConversationMessage = { role: "assistant", content: assistantContent };
    messages.push(assistantMessage);
    await deps.onMessage?.(assistantMessage);

    const toolUses = assistantContent.filter((b): b is ToolUseBlock => b.type === "tool_use");
    if (stopReason !== "tool_use" || toolUses.length === 0) {
      yield { type: "done" };
      return;
    }

    const toolResults: ContentBlock[] = [];
    for (const call of toolUses) {
      yield { type: "tool", name: call.name, phase: "start" };
      const spec = toolsByName.get(call.name);
      let result: ToolResult;
      if (!spec) {
        result = { content: `Unknown tool: ${call.name}`, isError: true };
      } else {
        try {
          result = await spec.handler(call.input, deps.toolContext);
        } catch (err) {
          result = { content: `Tool error: ${(err as Error).message}`, isError: true };
        }
      }
      if (result.recipe) yield { type: "recipe", recipe: result.recipe };
      yield { type: "tool", name: call.name, phase: "end" };
      toolResults.push({
        type: "tool_result",
        tool_use_id: call.id,
        content: result.content,
        ...(result.isError ? { is_error: true } : {}),
      });
    }

    const toolMessage: ConversationMessage = { role: "user", content: toolResults };
    messages.push(toolMessage);
    await deps.onMessage?.(toolMessage);
  }

  yield { type: "error", message: "Превышен лимит шагов с инструментами." };
}
