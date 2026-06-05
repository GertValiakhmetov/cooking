# Iconography — Су-шеф

**Icon system:** [Lucide](https://lucide.dev) — 2px line icons, rounded joins.
Loaded from CDN (`https://unpkg.com/lucide@latest`) in the preview cards and the UI kit.

- Default size **24px** (20–22 in dense rows), `stroke-width: 2`.
- Icons inherit `currentColor`, so they pick up the active theme token automatically.
- **No emoji, no unicode-as-icon.** Status is always token color + a Lucide glyph.
- **Substitution flag:** Lucide is a deliberate CDN substitute — there is no proprietary
  house icon set in the brief. If one is later commissioned, swap it in and update this file.

For production: use `lucide-svelte` (web) and a Lucide Compose port / bundled SVGs (Android).

## Brand mark
There is no bespoke logo yet. The app uses a typographic **«С»** tile — `--accent` on white,
`radius` 10 — as the avatar/wordmark in the Chat top bar. Replace with a real mark when
available; this folder is where logo SVGs/PNGs should land.
