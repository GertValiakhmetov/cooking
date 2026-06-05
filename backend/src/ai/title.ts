import { env } from "../env";
import { getAnthropic } from "./anthropic";

const TRUNCATE_AT = 48;

/** Truncation fallback — the pre-model behaviour, used when the model call fails. */
export function truncatedTitle(message: string): string {
  return message.length > TRUNCATE_AT ? `${message.slice(0, TRUNCATE_AT).trimEnd()}…` : message;
}

/** One-shot text completion the title generator runs on — injectable for tests. */
export type CompleteText = (req: {
  model: string;
  system: string;
  user: string;
  maxTokens: number;
}) => Promise<string>;

const anthropicComplete: CompleteText = async ({ model, system, user, maxTokens }) => {
  const res = await getAnthropic().messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  let out = "";
  for (const block of res.content) {
    if (block.type === "text") out += block.text;
  }
  return out;
};

const SYSTEM =
  "Ты придумываешь названия диалогам в кулинарном ассистенте. " +
  "По первому сообщению пользователя ответь только названием: 2–5 слов, на языке сообщения, " +
  "без кавычек, без точки в конце, без эмодзи.";

/**
 * Name a fresh conversation from its first message via the cheap model
 * (ANTHROPIC_MODEL_CHEAP — haiku). Degrades to plain truncation when the model
 * is unreachable or returns something that doesn't look like a title.
 */
export async function generateConversationTitle(
  message: string,
  complete: CompleteText = anthropicComplete,
): Promise<string> {
  try {
    const raw = await complete({
      model: env.ANTHROPIC_MODEL_CHEAP,
      system: SYSTEM,
      user: message.slice(0, 1000), // дальше первой тысячи знаков модели смотреть незачем
      maxTokens: 64,
    });
    const title = raw
      .trim()
      .replace(/\s+/g, " ")
      .replace(/^["'«»„“]+|["'«»„“.]+$/g, "")
      .trim();
    // Пусто или разъехалось (рассуждения вместо названия) — модели не доверяем.
    if (!title || title.length > 80) return truncatedTitle(message);
    return title;
  } catch {
    return truncatedTitle(message);
  }
}
