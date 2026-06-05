export type LayoutMode = "mobile" | "rail" | "desktop";

/** Режим раскладки по брейкпоинтам прототипа: <768 mobile, 768–1023 rail, ≥1024 desktop. */
class UiStore {
  mode = $state<LayoutMode>("mobile");
  drawerOpen = $state(false); // мобильный дровер списка диалогов
}

export const ui = new UiStore();

export function modeForWidth(width: number): LayoutMode {
  if (width >= 1024) return "desktop";
  if (width >= 768) return "rail";
  return "mobile";
}
