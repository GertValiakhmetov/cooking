import type { User } from "./api";

const STORAGE_KEY = "suchef.jwt";

/** Состояние аутентификации (runes). SPA без SSR, поэтому localStorage доступен сразу. */
class AuthStore {
  token = $state<string | null>(
    typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY),
  );
  user = $state<User | null>(null);

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
    this.token = token;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.token = null;
    this.user = null;
  }
}

export const auth = new AuthStore();
