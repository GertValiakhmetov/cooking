import { z } from "zod";
import type { JsonSchema } from "../types";

/**
 * Tool input schema derived from a Zod schema (Zod v4 native JSON Schema conversion) —
 * the same schema validates the tool's input at runtime, so docs and validation can't drift.
 * `$schema` is stripped: the Anthropic tools API expects a bare JSON Schema object.
 */
export function zodToToolSchema(schema: z.ZodType): JsonSchema {
  const { $schema: _ignored, ...json } = z.toJSONSchema(schema, { io: "input" }) as Record<
    string,
    unknown
  >;
  return json as unknown as JsonSchema;
}
