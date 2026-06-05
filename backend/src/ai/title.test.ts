import { describe, expect, it } from "vitest";
import { env } from "../env";
import { type CompleteText, generateConversationTitle, truncatedTitle } from "./title";

const completeWith =
  (raw: string): CompleteText =>
  async () =>
    raw;

describe("generateConversationTitle", () => {
  it("returns the model's title stripped of quotes and a trailing period", async () => {
    const title = await generateConversationTitle(
      "что приготовить из курицы и риса?",
      completeWith("  «Ужин из курицы и риса».\n"),
    );
    expect(title).toBe("Ужин из курицы и риса");
  });

  it("asks the cheap model with the user's message", async () => {
    let seen: Parameters<CompleteText>[0] | undefined;
    await generateConversationTitle("борщ на завтра", async (req) => {
      seen = req;
      return "Борщ на завтра";
    });
    expect(seen?.model).toBe(env.ANTHROPIC_MODEL_CHEAP);
    expect(seen?.user).toContain("борщ");
  });

  it("falls back to truncation when the model call fails", async () => {
    const message = "очень длинное сообщение про ужин ".repeat(4);
    const title = await generateConversationTitle(message, async () => {
      throw new Error("api down");
    });
    expect(title).toBe(truncatedTitle(message));
    expect(title.endsWith("…")).toBe(true);
  });

  it("falls back when the model returns empty or rambling output", async () => {
    expect(await generateConversationTitle("привет", completeWith("   "))).toBe("привет");
    expect(await generateConversationTitle("привет", completeWith("ну ".repeat(60)))).toBe(
      "привет",
    );
  });
});
