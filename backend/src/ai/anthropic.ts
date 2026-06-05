import Anthropic from "@anthropic-ai/sdk";
import { env } from "../env";
import type { ChatModel, ModelStreamEvent, ModelTurnRequest } from "./types";

// The ONLY place a Claude client is constructed (hard rule #3). The API key is backend-only.
let client: Anthropic | undefined;

export function getAnthropic(): Anthropic {
  // maxRetries above the default 2: local networks flake, and a dropped chat
  // request is worse than a couple of seconds of backoff.
  if (!client) client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 4 });
  return client;
}

/** Adapts the Anthropic Messages streaming API to our SDK-agnostic ChatModel. */
export function createAnthropicModel(model: string = env.ANTHROPIC_MODEL): ChatModel {
  return {
    async *streamTurn(req: ModelTurnRequest): AsyncIterable<ModelStreamEvent> {
      try {
        const stream = getAnthropic().messages.stream({
          model,
          max_tokens: 4096,
          system: req.system as Anthropic.TextBlockParam[],
          messages: req.messages as unknown as Anthropic.MessageParam[],
          tools: req.tools.map((t) => ({
            name: t.name,
            description: t.description,
            input_schema: t.inputSchema as Anthropic.Tool.InputSchema,
          })),
        });

        // Live text tokens.
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            yield { type: "text_delta", text: event.delta.text };
          }
        }

        // Final assembled message: tool_use blocks carry fully-parsed JSON input.
        const final = await stream.finalMessage();
        for (const block of final.content) {
          if (block.type === "tool_use") {
            yield { type: "tool_use", id: block.id, name: block.name, input: block.input };
          }
        }
        yield { type: "turn_end", stopReason: final.stop_reason ?? "end_turn" };
      } catch (err) {
        // SDK error types stay inside this module; clients see a human message.
        if (err instanceof Anthropic.APIConnectionError) {
          throw new Error("Не получилось связаться с моделью. Попробуй ещё раз.", { cause: err });
        }
        if (err instanceof Anthropic.APIError && err.status === 529) {
          throw new Error("Модель перегружена. Попробуй через минуту.", { cause: err });
        }
        throw err;
      }
    },
  };
}
