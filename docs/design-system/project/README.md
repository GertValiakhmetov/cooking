# Су-шеф — Design System

**Су-шеф** ("sous-chef") is a private, chat-first AI cooking assistant used mostly on a
phone **while standing at the stove**. The product UI is in **Russian**. This repo is the
single source of truth for its visual language: tokens, components, and an interactive UI
kit, defined so they can be re-implemented in **SvelteKit** (web) and **Jetpack Compose**
(Android) from named tokens — never ad-hoc values.

> This is a greenfield system authored from a product brief. No external codebase or Figma
> was provided. If you have the eventual SvelteKit/Compose repos, link them here.

## Design principles
1. **Readable at arm's length.** Generous type, high contrast, no thin grey-on-white.
2. **Operable with messy hands.** ≥48px touch targets, full-width primary actions, no
   precision gestures for core flows.
3. **Calm utility.** Warm and kitchen-y but restrained — a tool, not a food blog. No
   decorative illustrations, no hero imagery.
4. **Content is king.** Chat text and recipe steps are the product; chrome stays quiet.

---

## Content fundamentals
The product speaks **Russian**, in a **warm, plain, competent** register — like a calm
sous-chef next to you, not a chirpy app.

- **Address:** formal-friendly **«вы»** ("Давайте сделаем плов", "Спросите что-нибудь…").
  Never the cutesy «ты»; never corporate-stiff.
- **Voice:** the assistant is a helpful peer. Short declaratives, action-first
  ("Обжарьте лук до золотистого цвета"). Recipe steps are **imperative verbs**.
- **Casing:** **Sentence case** everywhere — buttons ("Сохранить"), titles
  ("Плов с курицей"), nav ("Кладовая"). Only `caption`/eyebrow labels use UPPERCASE,
  sparingly (e.g. "ШАГ 1").
- **Numbers:** real quantities with units ("600 г", "2 ст.", "45 мин"). Tabular/mono
  figures for quantities, timers, and step numbers.
- **No emoji.** Status is carried by tokenized color + a Lucide icon, never an emoji.
- **Tone of system copy:** quietly factual. Toasts confirm + offer undo
  ("Рецепт сохранён" · "Отменить"). Empty states are one plain line, no jokes, no
  illustration ("Здесь пока пусто. Добавьте первый ингредиент."). Errors are direct
  ("Не удалось загрузить кладовую").

---

## Visual foundations
- **Color:** a **warm, calm** palette on warm paper (`--bg #FBF6EF`), not stark white.
  Accent is **paprika/terracotta** (`--accent #C7522B`); semantics are **herb green**
  (success), **amber** (warning / expires-soon), **clay red** (danger). Everything is a
  **semantic token** (`bg, surface, surface-raised, surface-sunken, text-primary/
  secondary/tertiary, accent, success, warning, danger, border`) defined in **both light
  and dark** themes. Dark is first-class — kitchens at night — on `#181410`.
- **Type:** one workhorse family, **Golos Text** — a humanist sans designed for Cyrillic
  with a tall x-height that holds up at arm's length. Mono is **JetBrains Mono** for
  quantities, timers, and token labels. Roles: `caption 13/18`, `body 16/24`,
  `body-large 18/28` (chat), `title 22/28`, `heading 28/34`, and a dedicated
  **cooking-display 40/50** for a single full-screen recipe step readable from ~1 m.
  Line heights are loose enough to scan numbered steps fast.
- **Spacing:** strict **4px base** scale, named `space-1`…`space-20`, plus a `--touch-min`
  floor of **48px**.
- **Radii:** **soft but not bubbly** — `sm 8 / md 12 / lg 16 / xl 24 / pill`. Cards use
  `lg`; bubbles use mixed corners; pills for chips and the send button.
- **Elevation:** three **warm-tinted** shadows (`sm/md/lg`) — brown-toned, not neutral
  grey. Cards separate from the warm bg with `shadow-md` + a hairline `--border`. Dark
  theme leans on stronger shadows + raised surfaces.
- **Backgrounds:** flat warm fills only. **No gradients, no textures, no photography, no
  illustrations.** Imagery, where unavoidable (saved-recipe thumb), is a tinted
  `accent-soft` tile with a line icon — a placeholder, not a hero shot.
- **Borders:** 1px hairline `--border` for separation; `--border-strong` for input
  outlines and dividers that need presence. Inputs are 1.5px, focusing to `--accent`.
- **Cards:** `--surface` fill, 1px `--border`, `radius-lg`, `shadow-md`. Quiet.
- **Motion:** subtle by design. Durations `fast 120 / base 200 / slow 320`, standard ease
  `cubic-bezier(0.2,0,0,1)`. The **only "alive" elements** are streaming-text/typing dots
  and timer countdowns. Press state is a quick **`scale(0.97)`**; hover is a darker accent
  or a `surface-sunken` wash — no bounce, no parallax.
- **Transparency/blur:** essentially none — the aesthetic is opaque and flat for max
  legibility in a bright kitchen.

---

## Iconography
- **System:** [**Lucide**](https://lucide.dev) — clean 2px line icons, rounded joins. Matches
  the calm, content-first tone. Loaded from CDN (`unpkg.com/lucide`) in previews and the UI
  kit; in the SvelteKit/Compose builds use `lucide-svelte` / a Compose Lucide port or the
  bundled SVGs.
- **Default size** 24px (20–22 in dense rows), `stroke-width: 2`, inherits `currentColor` so
  icons pick up the active theme token.
- **Common glyphs:** `message-circle` (Chat), `refrigerator` (Pantry), `book-open` (Recipes),
  `timer/pause`, `clock` (time/expiry), `check` (have/done), `plus` (add/missing),
  `alert-triangle` (expired), `chef-hat`, `flame`, `users`, `arrow-up` (send),
  `search`, `trash-2`, `bookmark`, `x`, `chevron-left/right`.
- **No emoji, no unicode-as-icon.** Status = token color + Lucide glyph.
- **Substitution flag:** Lucide is a CDN substitute chosen to fit the brand; there is no
  proprietary icon set. Swap freely if a house set is later commissioned.
- Brand wordmark/avatar is a typographic **«С»** tile (`--accent` on white) — see the Chat
  top bar — not a bespoke logo. Replace with a real mark when available.

---

## Index — what's in this repo
| Path | What it is |
|---|---|
| `colors_and_type.css` | **All design tokens** — color (light+dark), type scale + roles, spacing, radii, elevation, motion. Start here. |
| `components.css` | Reusable component classes built on the tokens (buttons, inputs, chat, badges, cards, timer, skeleton, toast). |
| `preview/` | Small specimen cards that populate the **Design System** tab (colors, type, spacing, components). |
| `ui_kits/cooking-app/` | **Interactive UI kit** — the full phone app (chat / pantry / recipes / cooking mode) with a theme toggle. See its `README.md`. |
| `assets/` | Brand + icon notes. |
| `SKILL.md` | Agent Skill manifest for using this system in Claude Code. |

There is **one product** (the mobile app), so there is one UI kit. No slide template was
provided, so `slides/` is intentionally absent.
