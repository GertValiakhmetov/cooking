const STORAGE_KEY = "suchef.theme";
type Theme = "light" | "dark";

/** Тема: системная по умолчанию, ручной выбор перекрывает и запоминается. */
class ThemeStore {
  choice = $state<Theme | null>(
    typeof localStorage === "undefined"
      ? null
      : (localStorage.getItem(STORAGE_KEY) as Theme | null),
  );
  system = $state<Theme>("light");

  get current(): Theme {
    return this.choice ?? this.system;
  }

  toggle(): void {
    const next: Theme = this.current === "light" ? "dark" : "light";
    this.choice = next;
    localStorage.setItem(STORAGE_KEY, next);
  }
}

export const theme = new ThemeStore();
