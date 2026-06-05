import type { OpenAPIV3_1 } from "openapi-types";
import { z } from "zod";

/**
 * Request-body block for `describeRoute` built from a Zod schema.
 * Zod v4 converts to JSON Schema natively; `io: "input"` documents what the client sends.
 */
export function jsonBody(schema: z.ZodType) {
  return {
    required: true,
    content: {
      "application/json": {
        schema: z.toJSONSchema(schema, { io: "input" }) as OpenAPIV3_1.SchemaObject,
      },
    },
  };
}
