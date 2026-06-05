import { auth } from "./auth.svelte";
import { API_URL } from "./config";
import type { ContentBlock, Recipe } from "./recipe";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (auth.token) headers.set("Authorization", `Bearer ${auth.token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401) {
    // Сессия истекла или токен невалиден — разлогиниваем, гард покажет экран входа.
    auth.logout();
    throw new ApiError(401, "Сессия истекла. Открой инвайт-ссылку заново.");
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(res.status, body?.error ?? `Ошибка сервера (HTTP ${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type User = { id: string; email: string; displayName: string | null };
export type Conversation = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};
export type StoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: ContentBlock[];
  createdAt: string;
};
export type SavedRecipe = Recipe & {
  id: string;
  source: "ai" | "manual";
  createdAt: string;
};

export const api = {
  redeem: (token: string, displayName?: string) =>
    request<{ jwt: string }>("/auth/redeem", {
      method: "POST",
      body: JSON.stringify({ token, ...(displayName ? { displayName } : {}) }),
    }),
  me: () => request<User>("/auth/me"),

  conversations: {
    list: () => request<{ conversations: Conversation[] }>("/conversations"),
    create: () => request<Conversation>("/conversations", { method: "POST" }),
    rename: (id: string, title: string) =>
      request<Conversation>(`/conversations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
      }),
    remove: (id: string) => request<{ ok: true }>(`/conversations/${id}`, { method: "DELETE" }),
    messages: (id: string) =>
      request<{ messages: StoredMessage[] }>(`/conversations/${id}/messages`),
  },

  recipes: {
    save: (recipe: Recipe) =>
      request<SavedRecipe>("/recipes", {
        method: "POST",
        body: JSON.stringify({ ...recipe, source: "ai" }),
      }),
  },
};
