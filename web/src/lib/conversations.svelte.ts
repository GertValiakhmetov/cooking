import { api, type Conversation } from "./api";
import { auth } from "./auth.svelte";

/** Shared conversation list — the sidebar/rail render it, the chat page mutates it. */
class ConversationsStore {
  list = $state<Conversation[]>([]);

  async reload(): Promise<void> {
    if (!auth.token) {
      this.list = [];
      return;
    }
    try {
      this.list = (await api.conversations.list()).conversations;
    } catch {
      /* keep stale list on transient errors */
    }
  }

  async create(): Promise<Conversation> {
    const conv = await api.conversations.create();
    this.list = [conv, ...this.list];
    return conv;
  }

  async remove(id: string): Promise<void> {
    await api.conversations.remove(id);
    this.list = this.list.filter((c) => c.id !== id);
  }

  async rename(id: string, title: string): Promise<void> {
    const updated = await api.conversations.rename(id, title);
    this.list = this.list.map((c) => (c.id === id ? updated : c));
  }

  /** Reflect a server-side title/order change (e.g. auto-title after first message). */
  patchLocal(conv: Conversation): void {
    const rest = this.list.filter((c) => c.id !== conv.id);
    this.list = [conv, ...rest];
  }
}

export const conversations = new ConversationsStore();
