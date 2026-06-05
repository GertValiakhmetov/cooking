/**
 * Call `fn` when the user returns to the app — the window regains focus or the
 * tab becomes visible again (phone unlocked, switched back from another app).
 * Returns a cleanup function, so it can be returned straight from an $effect.
 */
export function onAppReturn(fn: () => void): () => void {
  let last = 0;
  const run = () => {
    if (document.visibilityState !== "visible") return;
    // focus + visibilitychange часто стреляют парой — не дёргаем API дважды.
    const now = Date.now();
    if (now - last < 1000) return;
    last = now;
    fn();
  };
  window.addEventListener("focus", run);
  document.addEventListener("visibilitychange", run);
  return () => {
    window.removeEventListener("focus", run);
    document.removeEventListener("visibilitychange", run);
  };
}
