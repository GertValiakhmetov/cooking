import { auth } from "./auth.svelte";
import { API_URL } from "./config";
import type { Recipe } from "./recipe";

/** SSE events from POST /chat — the taxonomy from §7.4. */
export type ChatEvent =
  | { type: "text"; text: string }
  | { type: "tool"; name: string; phase: "start" | "end" }
  | { type: "recipe"; recipe: Recipe }
  | { type: "error"; message: string }
  | { type: "done" };

/**
 * Stream POST /chat as Server-Sent Events. EventSource only does GET, so we use
 * fetch + a ReadableStream reader and parse the `data:` lines ourselves. Non-2xx
 * responses (validation/not-found/rate-limit) arrive as plain JSON before the stream.
 */
export async function* streamChat(
  conversationId: string,
  message: string,
  signal?: AbortSignal,
): AsyncGenerator<ChatEvent> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
    body: JSON.stringify({ conversationId, message }),
    signal,
  });

  if (res.status === 401) {
    auth.logout();
    throw new Error("Сессия истекла. Открой инвайт-ссылку заново.");
  }
  if (!res.ok || !res.body) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Ошибка сервера (HTTP ${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Frames are separated by a blank line. Each frame has `event:` + `data:` lines;
    // the data payload already carries `type`, so we only parse data.
    let sep = buffer.indexOf("\n\n");
    while (sep !== -1) {
      const frame = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
      if (dataLine) {
        const json = dataLine.slice(5).trim();
        if (json) {
          try {
            yield JSON.parse(json) as ChatEvent;
          } catch {
            /* ignore malformed frame */
          }
        }
      }
      sep = buffer.indexOf("\n\n");
    }
  }
}
