import type { Recipe } from "./recipe";

/** Raw Anthropic-style content blocks we persist and replay (§6, §7.6). */
export type TextBlock = { type: "text"; text: string };
export type ToolUseBlock = { type: "tool_use"; id: string; name: string; input: unknown };
export type ToolResultBlock = {
  type: "tool_result";
  tool_use_id: string;
  content: string;
  is_error?: boolean;
};
export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

export type ConversationMessage = {
  role: "user" | "assistant";
  content: ContentBlock[];
};

/** System prompt as cacheable text blocks; the stable prefix is marked for prompt caching (§7.3). */
export type SystemBlock = {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" };
};
export type SystemPrompt = SystemBlock[];

/** Minimal hand-written JSON Schema for tool inputs. */
export type JsonSchema = {
  type: "object";
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
};

export type ToolContext = { userId: string };
export type ToolResult = { content: string; recipe?: Recipe; isError?: boolean };
export type ToolSpec = {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  handler: (input: unknown, ctx: ToolContext) => Promise<ToolResult>;
};

/** Low-level model stream the chat loop consumes — decoupled from the SDK for testability. */
export type ModelStreamEvent =
  | { type: "text_delta"; text: string }
  /** The model began emitting a tool call — its input is still streaming. */
  | { type: "tool_pending"; name: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "turn_end"; stopReason: string };

export type ModelTurnRequest = {
  system: SystemPrompt;
  messages: ConversationMessage[];
  tools: ToolSpec[];
};

export interface ChatModel {
  streamTurn(req: ModelTurnRequest): AsyncIterable<ModelStreamEvent>;
}

/** SSE events the backend emits to clients (taxonomy from §7.4). */
export type ChatEvent =
  | { type: "text"; text: string }
  | { type: "tool"; name: string; phase: "start" | "end" }
  | { type: "recipe"; recipe: Recipe }
  | { type: "error"; message: string }
  | { type: "done" };
