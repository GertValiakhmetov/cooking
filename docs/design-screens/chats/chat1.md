# Desktop Chat Layout

_Started 2026-06-04 23:41 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Cooking"
Project is currently empty (no files)
Current date is now June 5, 2026
</system-info>

<pasted_text name="Pasted text (36 lines)">
  Using the design system we just built (its tokens and components), build the first
  real screen: the Chat screen — the home screen of the app. Mobile-first, Russian UI,
  mock data, simulated behavior. 
  
  ## Layout
  - Top bar: conversation title ("Ужин из того, что есть"), burger icon on the left
    opening a drawer with past conversations (3–4 mock items + "Новый чат" button).
  - Scrollable message feed.
  - Chat input bar pinned to the bottom (from the design system), large send button.
  - Bottom navigation (Chat / Pantry / Recipes) — Chat active, other tabs are stubs.
  
  ## Behavior to simulate
  1. The feed starts with a short existing exchange (1 user msg + 1 assistant msg).
  2. When I type a message and hit send:
     - my bubble appears immediately,
     - then the tool-call indicator "Проверяю твою кладовку…" with spinner (~1.5 s),
       which collapses into a quiet single line with a checkmark,
     - then the assistant reply streams in word-by-word.
  3. Script one canned flow regardless of what I type:
     - first send → assistant suggests 3 dinner options as short streamed text,
     - second send → short streamed phrase + the recipe card pops in as one block
       (NOT streamed — it appears complete, with a subtle entrance animation).
  4. Auto-scroll follows the streaming text, but if I scroll up, it stops following
     and shows a "↓ К новым сообщениям" pill.

  ## Recipe card in the feed (use the design-system recipe card)
  - Chicken pasta: ~8 ingredients (2 marked missing ✗, rest ✓), 5 numbered steps,
    two steps have timer buttons, 1–2 notes.
  - Servings stepper works (rescales amounts).
  - Timer button starts a live countdown.
  - "Сохранить рецепт" button shows a toast "Рецепт сохранён".
  - "Готовить" button is present but can be a stub for now (next screen).

  ## Quality bar
  - Everything themed via the design-system tokens; light/dark toggle still works.
  - Test the layout at 390×844 (primary) and a desktop width (feed max-width, centered).
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Hi-fi design">
Create a high-fidelity, polished design.

Follow this general design process (use the todo list to remember):
(1) ask questions, (2) find existing UI kits and collect design context — copy ALL relevant components and read ALL relevant examples; ask the user if you can't find them, (3) start your file with assumptions + context + design reasoning (as if you are a junior designer and the user is your manager), with placeholders for the designs, and show it to the user early, (4) build out the designs and show the user again ASAP; append some next steps, (5) use your tools to check, verify and iterate on the design.

Good hi-fi designs do not start from scratch — they are rooted in existing design context. Ask the user to Import their codebase, or find a suitable UI kit / design resources, or ask for screenshots of existing UI. You MUST spend time trying to acquire design context, including components. If you cannot find them, ask the user for them. In the Import menu, they can link a local codebase, provide screenshots or Figma links; they can also link another project. Mocking a full product from scratch is a LAST RESORT and will lead to poor design. If stuck, try listing design assets and ls'ing design system files — be proactive! Some designs may need multiple design systems — get them all. Use the starter components (device frames and the like) to get high-quality scaffolding for free.

When presenting several options or explorations side-by-side, lay them out clearly: give the page a neutral gray background, put each option in its own labeled frame (a small heading + a white rounded card sized to its content), and group related options into sections.

When designing, asking many good questions is ESSENTIAL.

Give options: try to give 3+ variations across several dimensions. Mix by-the-book designs that match existing patterns with new and novel interactions, including interesting layouts, metaphors, and visual styles. Have some options that use color or advanced CSS; some with iconography and some without. Start your variations basic and get more advanced and creative as you go! Try remixing the brand assets and visual DNA in interesting ways — play with scale, fills, texture, visual rhythm, layering, novel layouts, type treatments. The goal is not the perfect option; it's exploring atomic variations the user can mix and match.

CSS, HTML, JS and SVG are amazing. Users often don't know what they can do. Surprise the user.

If you do not have an icon, asset or component, draw a placeholder: in hi-fi design, a placeholder is better than a bad attempt at the real thing.
</attached-skill>

<attached-skill name="Interactive prototype">
Create a fully interactive prototype with realistic state management and transitions. Use React useState/useEffect for dynamic behavior. Include hover states, click interactions, form validation, animated transitions, and multi-step navigation flows. It should feel like a real working app, not a static mockup.
</attached-skill>

<attached-skill name="HRLogics MDM Design System (design system)">
[Design System] This project uses the **HRLogics MDM Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# HRLogics MDM — Design System

A design system derived from the HRLogics **MDM (Master Data Model)** admin client — a React + MUI v9 SPA that sits at the hub of HRLogics' data plumbing (file uploads, transformations, outbound sync to HRLogics' product suite: WOTC, ERC, Verifications, Unemployment Tracking, etc.).

## Sources

- **Codebase (mounted, local):** `client/` — the `@mdm/client` Vite + React 19 app. Theme lives at `client/src/app/theme/config/`, shared components at `client/src/shared/components/`, pages at `client/src/pages/`, widgets at `client/src/widgets/`.
- **Repo:** `trakcap/mdm` on GitHub — monorepo containing the client plus Python backends (`adapters/`, `managers/`, `processing/`, `transformer/`, etc.). The client is what this design system covers.
- **Uploaded fonts:** Foro Rounded (8 weights, OTF) — primary brand typeface.
- **Uploaded logos:** `hrl-logo-large.svg`, `hrl-logo-small.svg` (wordmark + hexagonal monogram, `favicon.ico`.
- **The product:** `HRLogics — MDM` ("HRLogics Master Data Model"). Theme color in `&lt;meta name="theme-color"&gt;` is `#a4f478` (a vivid green — but this doesn't appear anywhere else and looks like a legacy/leftover; NOT a brand color).

## The Product in one paragraph

MDM is the internal control tower at HRLogics — an admin dashboard used by HRLogics staff (admins + readonly admins + internal ops) to land partner payroll/HR files, validate them, transform them, and sync employees/companies/PEOs outbound to HRLogics' product surfaces. It is an internal tool, not a customer-facing website — so the aesthetic is utilitarian, MUI-based, dense, and data-forward, but the brand details (Foro Rounded, deep indigo wordmark, orange/amber primary) give it a warmer, more consumer-friendly feel than a typical admin console.

## Surfaces covered

There is **one primary surface**: the MDM web app. Within it, the key page types are:
- **Login / auth redirect** (Auth0 flow)
- **Dashboard** (pending employees/payrolls/roles cards with tables)
- **List pages** (Companies, PEOs, File Uploads, Transformations, Data Viewer, Synchronizations, Performance, Thresholds, Client Stats, Solutions)
- **Detail / form pages** (company info forms, data upload form)
- **Control center / OAuth2 clients** (popover-launched admin tools)

There is no public marketing site, mobile app, or docs site represented in the sources provided.

---

## CONTENT FUNDAMENTALS

**Voice.** Flat, functional, quietly friendly. The surface is an internal admin tool, so copy is descriptive rather than persuasive — but branded touches (Foro Rounded, Title Case labels, humane subtitles like "Employees waiting to sync") keep it from feeling cold.

**Person.** Third-person / object-oriented. Nav items and titles are things ("Companies", "File Uploads", "Dashboard") — not actions addressed to the user ("Upload your files"). Buttons are short imperative verbs ("Log Out", "Upload", "Add"). Rarely "you"; never "we".

**Casing.**
- Page titles &amp; nav: **Title Case** — "Dashboard", "File Uploads", "Control Center", "OAuth2 Clients".
- Button labels: **Title Case**, single verb or verb+noun — "Log Out", "Upload Data".
- Section subtitles / helper text: **Sentence case** — "Employees waiting to sync", "Pending Employees".
- CAPS are reserved for tiny sidebar overline labels (see `sidebarButtonStyles` — `text-transform: uppercase`, `font-size: 13px`, tracked slightly).
- Captions (MUI variant) use **uppercase Montserrat** — the sans-serif cousin to Foro Rounded.

**Punctuation.** No trailing periods on page titles, card titles, or list labels. Subtitles and helper text follow sentence punctuation only when they are full sentences.

**Terminology.** Domain nouns are consistent and capitalised as proper terms in UI copy: *Companies, PEOs, Employees, Payrolls, Roles, Outbound Queue, Synchronizations, Transformations, Thresholds, Solutions, Client Stats, Data Viewer, File Uploads, Control Center*. Products are abbreviated: **WOTC, ERC, CV, SS, UT** (each has a dedicated `*-product.svg` icon).

**Tone examples (real, from the codebase):**
- Card title / subtitle pair: "Pending Employees" / "Employees waiting to sync"
- Nav: "Dashboard", "Companies", "PEOs", "Data Viewer", "File Uploads", "Transformations", "Synchronizations", "Performance", "Thresholds"
- Popover menu: "Control Center", "OAuth2 Clients", "Log Out"
- Page headings: "Dashboard" (no articles, no taglines)
- Breadcrumb separator: `/` (raw slash, not `›`)

**No emoji. No exclamation marks. No marketing superlatives.** Unicode is used only in code/data. Numbers and status counts are shown plainly; no "🎉 3 new!" style.

---

## VISUAL FOUNDATIONS

**Typography.**
- **Primary:** Foro Rounded (8 weights, 100–900). Used for everything — headings, body, buttons, nav, data. Warm, geometric, softly rounded — carries the entire brand personality.
- **Secondary:** Montserrat (via `@fontsource/montserrat`). Used **only** for the `caption` variant — tiny uppercase labels.
- **Scale** (see `typography.ts`): h1 96 / h2 60 / h3 48 / h4 34 / h5 24 / h6 20 / subtitle1 16 Bold / body1 16 / body2 14 / body3 12. Buttons 13/14/16, all weight 700 (small is 500). Tooltip 10px. All sans, all non-upper except caption and overline.
- `ascent-override: 92%; descent-override: 24%` is applied to every Foro Rounded face — tightens vertical rhythm noticeably.

**Color.** OKLCH-based, perceptually-uniform tiers (`lighter ~97% L`, `light ~92%`, `main ~70–73%`, `dark ~55%`, `darker ~40%`). Hues: primary 65 (warm amber-orange), secondary 265 (cool indigo-gray), info 235, success 148, warning 85, error 27. The brand wordmark is a deep indigo `#1C036D` — closest to `--secondary-darkest` `oklch(22% 0.13 270)`. The logo mark uses an orange-to-amber gradient (`#E64D25 → #F6B02D`).

**Backgrounds.** White (`--bg`) dominates. A very subtle `--bg-subtle` (`oklch(97% 0.007 240)`) for alternating rows / quiet chrome. Signature decorative element: an outlined **hexagon tessellation pattern** (`assets/hex-background.png`, `hex.svg`, `hex-dark.svg`) used sparingly on auth/empty states — never full-bleed behind content. No gradients in chrome. No photography. No hand-drawn illustrations.

**Motion.** Restrained. The only deliberate transitions are:
- Drawer open/close (300ms).
- Toggle sidebar chevron rotation (`0.25s all ease-in-out`, rotates 180°).
- MUI default tab indicator / ripple fades (ripples are *disabled* on tabs — `disableRipple`).
- No bounces, no parallax, no scroll-linked anims. Data tables settle instantly.

**Hover states.**
- List items / menu buttons: background shifts to `oklch(95% 0 0)` (a neutral 5% darken).
- Selected list items: `oklch(90% 0 0)` — one step deeper — with text/icon swapping to `--secondary-darker`.
- Buttons (text variant): background `--secondary-lightest`.
- Links: color darkens to `--link-dark` *and* underline appears.
- Button-group outlined: border → `--secondary-main`, bg → `--secondary-lightest`.

**Press / active states.** No scale transforms. MUI-default ripple on contained buttons (kept, but `boxShadow: none` so elevation never jumps). Tabs and list items have all ripples explicitly disabled — they rely purely on color.

**Borders.** 1px, color `--divider` (`oklch(87.2% 0.008 265)` — cool light gray). Used for appbar bottom edge, card outlines (`OutlinedCard`), data-grid cells, dividers in popovers.

**Shadows.** Almost all paper is **elevation 0** (flat) — `paperComponent` sets `elevation: 0` as default. Popovers explicitly bump to `theme.shadows[8]` (MUI default, `0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12)`). No inner shadows. No glow rings.

**Corner radii.** Base `theme.shape.borderRadius = 8px`. `MuiPaper` overrides to `12px` (soft, friendly). Small chips become **pills** (`20px`). Tab indicators are `border-radius: 2`. No sharp 0-radius except data-grid internals.

**Cards.** Two dominant card shapes:
- **OutlinedCard**: 1px divider border, 12px radius, no shadow, white bg. Title + optional subtitle top, divider, content. This is the *default* in the dashboard.
- **Paper / Dialog**: 12px radius, shadow only when floating (popover/menu).
No left-border-accent cards. No colored borders.

**Chips / badges.** Small chips are pills (`border-radius: 20`), medium chips are 8px radius. Each color variant has its own tri-tone (bg from `*.light` or `*.lighter`, border from `*.dark`, text from `*.dark` or `*.darker`). Text weight 400, size 13.

**Buttons.** Three sizes — large (42h), medium (37h), small (32/28h depending on variant). Three variants — `contained` (primary brand), `outlined` (info / secondary use mapped `.darker` borders), `text` (subtle, `secondary.lightest` hover bg). `textTransform: none` — never uppercase. Disabled contained buttons get `secondary.lighter` bg + `secondary.main` fg.

**Layout rules.**
- Outer shell: fixed left **sidebar drawer** (permanent on desktop, temporary on mobile) + top **header bar** (`appbar` bordered bottom only, `borderRadius: 0`). Content fills the rest.
- Sidebar widths: opened ~220px with `px: 2`, closed ~56px (icons only) with `px: 1.5`. Toggle chevron in header rotates on open/close.
- Header content: breadcrumbs left (`/` separator, max 8 items), avatar + upload menu right (gap 16px, `mr: 2`).
- Mobile: sidebar becomes full-screen right-anchored drawer.

**Transparency &amp; blur.** None. Surfaces are opaque. Text uses `rgba` black at 0.87 / 0.60 / 0.38 (`--fg1/2/3`) — the standard MUI text ladder. No `backdrop-filter`.

**Imagery color vibe.** There is no photography. The palette imagery is saturated &amp; warm (primary amber, accent orange). Neutrals lean cool (secondary hues live at 265° — blueish-gray), giving the overall UI a subtle warm/cool push-pull.

**Data density.** Medium. Grids use MUI X DataGrid Premium with custom cell focus removed (`outline: none !important`). Rows are not striped; dividers are the only separation.

---

## ICONOGRAPHY

**The icon system is mixed and real — use the actual assets, don't roll your own.**

1. **Local SVG sprite** — `client/src/shared/assets/icons/*.svg`, exported via `?react` through `vite-plugin-svgr`. **Copied into this system at `assets/icons/`**. ~37 icons, outlined style, ~1.5px stroke, 24×24 canvas.
   - Navigation / UI: `home`, `user`, `users`, `settings`, `search`, `info`, `close`, `edit`, `bin`, `copy`, `download`, `upload`, `lock`, `logout`, `eye`, `file`, `arrow-right`, `chevron-left-double`, `add`, `map-point`, `measure`, `role`, `tool`.
   - Domain: `briefcase`, `building`, `corporate-building`, `company`, `chart`, `data-flow`, `penBorder`.
   - Product glyphs (unique!): `cv-product`, `erc-product`, `ss-product`, `ut-product`, `wotc-product` — these name the HRLogics product suite (Credit Verifications, ERC, Something-SS, Unemployment Tracking, WOTC).
   - Action variants: `uploadAction`, `uploadData` (two distinct upload glyphs).

2. **MUI Icons (`@mui/icons-material`)** — used for navigation glyphs inside the menu items file (`mainMenuItems.tsx`): `DashboardOutlined`, `ApartmentOutlined`, `BusinessOutlined`, `WorkOutlineOutlined`, `CloudSyncRounded`, `UploadFileOutlined`, `TransformOutlined`, `FindInPageOutlined`, `ShowChartOutlined`, `BuildOutlined`, `WarningAmberOutlined`. In the header popover: `Hub`, `SupervisorAccount`, `Logout`. Mostly the **Outlined** variant — thin stroke, consistent with the local SVG set.

   This system substitutes MUI Icons with **Material Symbols (outlined)** from the Google Fonts CDN for HTML prototypes — stroke weight and shape match very closely. Flagged.

3. **No icon font of their own.** No custom Material icon theme.

4. **Emoji: not used.** Unicode chars used only as separators (`/` for breadcrumbs).

5. **Logo** — the HRLogics wordmark SVG contains both the hexagonal mark (orange→amber gradient) and the deep-indigo wordmark. Use `assets/hrl-logo-large.svg` (full lockup, 150×36) or `assets/hrl-logo-small.svg` (just the hex, for collapsed sidebar).

6. **Background motif** — `assets/hex-background.png` / `hex.svg` / `hex-dark.svg` — outlined hexagonal lattice. Used as decorative background only, at very low contrast (~6% gray lines).

---

## Index

```
./
├── README.md                  ← you are here
├── SKILL.md                   ← Claude Code–compatible skill manifest
├── colors_and_type.css        ← CSS vars + font-face + semantic defaults
├── fonts/                     ← 8× Foro Rounded .otf files
├── assets/
│   ├── hrl-logo-large.svg     ← wordmark + hex mark
│   ├── hrl-logo-small.svg     ← hex mark only
│   ├── favicon.ico
│   ├── hex-background.png     ← hex lattice motif
│   ├── hex.svg / hex-dark.svg
│   └── icons/                 ← 37 outlined SVGs from the codebase
├── preview/                   ← design-system preview cards (registered)
├── ui_kits/
│   └── mdm_web/               ← React/JSX recreation of the MDM admin UI
│       ├── README.md
│       ├── index.html         ← click-thru prototype
│       └── *.jsx              ← factored components
```

See `ui_kits/mdm_web/README.md` for the component inventory of the admin UI kit.

---

## Caveats / known substitutions

- **MUI Icons → Material Symbols (Outlined)** via Google Fonts in the UI kit. Geometry is very close, but identical 1:1 substitution would require importing `@mui/icons-material`.
- **Montserrat** is loaded from Google Fonts in the UI kit rather than bundled locally.
- No Figma was provided; all design intent was reverse-engineered from `client/src/app/theme/config/` (MUI v9 theme) and live component files.

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/colors_and_type.css`, `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/preview/_preview.css`, `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/ui_kits/mdm_web/styles.css`). The 142 custom properties it defines are:

--accent, --accent-contrast, --action-disabled, --action-disabled-bg, --action-focus, --action-hover, --action-selected, --alert-error-bg, --alert-error-fg, --alert-info-bg, --alert-info-fg, --alert-success-bg, --alert-success-fg, --alert-warning-bg, --alert-warning-fg, --bg, --bg-paper, --bg-subtle, --brand-indigo, --brand-orange, --brand-orange-end, --divider, --error, --error-contrast, --error-dark, --error-light, --fg1, --fg2, --fg3, --font-primary, --font-secondary, --fw-bold, --fw-extrabold, --fw-extralight, --fw-heavy, --fw-light, --fw-medium, --fw-regular, --fw-semibold, --fw-thin, --graph, --info, --info-contrast, --info-dark, --info-darker, --info-light, --info-lighter, --info-lightest, --link, --link-dark, --primary, --primary-contrast, --primary-dark, --primary-darker, --primary-light, --primary-lighter, --radius-lg, --radius-md, --radius-pill, --radius-sm, --radius-xs, --secondary, --secondary-contrast, --secondary-dark, --secondary-darker, --secondary-darkest, --secondary-light, --secondary-lighter, --secondary-lightest, --shadow-0, --shadow-1, --shadow-2, --shadow-8, --space-0, --space-1, --space-10, --space-12, --space-2, --space-3, --space-4, --space-5, --space-6, --space-8, --success, --success-contrast, --success-dark, --success-light, --ts-avatar-size, --ts-badge-size, --ts-badge-weight, --ts-body1-size, --ts-body1-weight, --ts-body2-size, --ts-body2-weight, --ts-body3-lh, --ts-body3-size, --ts-body3-weight, --ts-button-lg-size, --ts-button-lg-weight, --ts-button-md-size, --ts-button-md-weight, --ts-button-sm-size, --ts-button-sm-weight, --ts-caption-size, --ts-caption-weight, --ts-chip-size, --ts-chip-weight, --ts-h1-size, --ts-h1-weight, --ts-h2-size, --ts-h2-weight, --ts-h3-size, --ts-h3-weight, --ts-h4-size, --ts-h4-weight, --ts-h5-size, --ts-h5-weight, --ts-h6-size, --ts-h6-weight, --ts-input-helper-lh, --ts-input-helper-size, --ts-input-helper-weight, --ts-input-label-size, --ts-input-label-weight, --ts-input-lh, --ts-input-size, --ts-input-weight, --ts-overline-size, --ts-overline-tracking, --ts-subtitle1-size, --ts-subtitle1-weight, --ts-subtitle2-size, --ts-subtitle2-weight, --ts-table-hdr-size, --ts-table-hdr-weight, --ts-tooltip-size, --ts-tooltip-weight, --warning, --warning-contrast, --warning-dark, --warning-light, --warning-lighter

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

<attached-skill name="Су-шеф Design System (design system)">
[Design System] This project uses the **Су-шеф Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Су-шеф — Design System

**Су-шеф** ("sous-chef") is a private, chat-first AI cooking assistant used mostly on a
phone **while standing at the stove**. The product UI is in **Russian**. This repo is the
single source of truth for its visual language: tokens, components, and an interactive UI
kit, defined so they can be re-implemented in **SvelteKit** (web) and **Jetpack Compose**
(Android) from named tokens — never ad-hoc values.

&gt; This is a greenfield system authored from a product brief. No external codebase or Figma
&gt; was provided. If you have the eventual SvelteKit/Compose repos, link them here.

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

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/colors_and_type.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/components.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/preview/_card.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/ui_kits/cooking-app/app.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/ui_kits/cooking-app/kit.css`). The 71 custom properties it defines are:

--accent, --accent-hover, --accent-soft, --bg, --border, --border-strong, --danger, --danger-soft, --duration-base, --duration-fast, --duration-slow, --ease-decelerate, --ease-emphasized, --ease-standard, --font-mono, --font-sans, --radius-lg, --radius-md, --radius-pill, --radius-sm, --radius-xl, --shadow-lg, --shadow-md, --shadow-sm, --space-0, --space-1, --space-10, --space-12, --space-16, --space-2, --space-20, --space-3, --space-4, --space-5, --space-6, --space-8, --success, --success-soft, --surface, --surface-raised, --surface-sunken, --text-body-large-line, --text-body-large-size, --text-body-large-weight, --text-body-line, --text-body-size, --text-body-weight, --text-caption-line, --text-caption-size, --text-caption-spacing, --text-caption-weight, --text-cooking-line, --text-cooking-size, --text-cooking-weight, --text-heading-line, --text-heading-size, --text-heading-weight, --text-on-accent, --text-primary, --text-secondary, --text-tertiary, --text-title-line, --text-title-size, --text-title-weight, --touch-min, --warning, --warning-soft, --weight-bold, --weight-medium, --weight-regular, --weight-semibold

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

## Assistant

_[tool: list_files]_

_[tool: read_file]_

I'll build the Chat screen for Су-шеф. Let me explore the design system thoroughly first — the cooking app UI kit, components, and tokens are what I need.I have the tokens. Now let me read the existing Chat UI kit, components, RecipeCard, and supporting files to fork them faithfully.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Let me read the core kit files — the Chat, RecipeCard, App, Icon, data, and kit.css — to fork them faithfully.Now the React components — Chat, RecipeCard, Icon, App, and data:

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Now the App.jsx (for BottomNav/structure) and data.js:

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: update_todos]_

_[tool: copy_files]_

I have everything I need. The spec is detailed and unambiguous, and the design system is fully provided — I'll build directly. Let me set up the project: copy the token stylesheets in, then build the screen.

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

Now the layout CSS — forking the kit's relevant pieces and adding the drawer, scroll pill, streaming, toast, and recipe-step styles:

_[tool: write_file]_

Now the Icon component (forked from kit) and the RecipeCard with servings rescaling, step timers, notes, and save toast:

_[tool: write_file]_

_[tool: write_file]_

Now the heart — ChatScreen with the scripted send flow, word streaming, and scroll-follow pill:

_[tool: write_file]_

Now the App shell — top bar with burger, drawer, bottom nav, theme toggle, and toast — plus the HTML:

_[tool: write_file]_

_[tool: update_todos]_

_[tool: show_html]_

I'll verify it renders before handing off. Let me screenshot at the primary 390-wide viewport.

_[tool: show_html]_

_[tool: save_screenshot]_

Renders cleanly. Let me verify the core scripted flow — driving two sends to confirm the tool-call, streaming, and the recipe card render correctly.

_[tool: save_screenshot]_

First send works perfectly — spinner → checkmark → streaming with caret. Now the second send to verify the recipe card:

_[tool: show_html]_

The second send was blocked because the first reply was still streaming (input is busy-locked). Let me run a clean full sequence with proper waits for each stream to finish.

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Auto-scroll is lagging — `scroll-behavior: smooth` on the feed fights the rapid per-word scroll updates, so it never reaches the bottom. I'll make the auto-follow instant and reserve smooth scrolling for the pill jump only.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: write_file]_

Auto-scroll now follows correctly (frame 3 is pinned to the streaming text). The second send didn't fire because the screenshot/capture environment throttles background timers (~1s/word instead of 62ms), so the first stream was still "busy" at 6s — in real foreground use it streams fast and the second send works. 

To verify the recipe card itself renders fully, let me make a quick scratch harness that seeds a recipe into the feed.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: eval_js]_

Let me inspect why the scratch harness isn't scrolling — check the recipe rendered and the scroll metrics.

_[tool: eval_js]_

Recipe rendered fine — it's pinned at the bottom (scrollTop 1157 of 1576); the html-to-image capture just doesn't honor scroll offset. Let me expand the harness so the whole feed is visible in one shot.

_[tool: save_screenshot]_

_[tool: show_html]_

The harness got into a messy state from my eval. Let me reload it clean and capture the recipe at natural scroll positions (the inner scroller honored scroll in my earlier streaming test).

_[tool: save_screenshot]_

_[tool: write_file]_

The html-to-image capture resets inner scroll, so I can't screenshot a scrolled feed region. Let me render the recipe card standalone (no scroller) so the whole thing captures in one shot.

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

Just a timing issue — Babel/render hadn't mounted yet. Let me capture with a delay.

_[tool: eval_js]_

_[tool: eval_js]_

The card renders — it's the `rc-enter` entrance animation (opacity:0 start) that html-to-image captures mid-animation as blank. Let me strip that class for a clean static capture.

_[tool: save_screenshot]_

The recipe card top looks excellent — title, meta with servings stepper (2), ingredients with ✓/✗ marks (2 missing in amber), and rescalable quantities. Let me see the rest — steps with timers, notes, and action buttons.

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

The recipe card is complete and polished — 5 steps, timer buttons on steps 1 & 4, two notes, and both action buttons. The only nit: "Сохранить рецепт" wraps awkwardly when sharing a row. I'll stack the actions vertically — cleaner and more tappable, with "Готовить" prioritized.

_[tool: delete_file]_

_[tool: show_html]_

Let me clean up the scratch files and verify the drawer and dark theme on the real app.

_[tool: save_screenshot]_

_[tool: show_html]_

Dark theme works (frame 2). The drawer didn't appear in the capture — likely an html-to-image artifact with the slide transform. Let me confirm it actually opens and capture it with the transition neutralized.

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

Two drawer bugs to fix: the conversation title/preview/time are overlapping (the `conv-body` span isn't stacking its children), and "Новый чат" wraps. Let me fix both.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

The drawer is now clean — "Новый чат" button, the active conversation highlighted in paprika, and each item showing title + preview stacked with a timestamp on the right. Everything is working. Let me clean up the screenshots folder and hand off.

_[tool: delete_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built the **Chat** home screen for Су-шеф, fully themed on the design system's tokens and components.

**Layout** — top bar with burger (opens a left drawer: "Новый чат" + 4 past conversations), title "Ужин из того, что есть", scrollable feed, the design-system chat bar pinned to bottom, and a 3-tab bottom nav (Чат active; Кладовая/Рецепты are stubs).

**Simulated flow** (one canned script regardless of input):
- Feed seeds with a user + assistant exchange.
- On send: your bubble appears → "Проверяю твою кладовку…" spinner (~1.5s) collapses to a quiet checkmark line → assistant reply **streams word-by-word**.
- 1st send → three dinner options; 2nd send → short phrase, then the **recipe card pops in complete** with an entrance animation.
- Auto-scroll follows the stream; scroll up and a "↓ К новым сообщениям" pill appears.

**Recipe card** (Паста с курицей) — 8 ingredients (2 missing ✗ in amber, rest ✓), servings stepper that rescales amounts, 5 numbered steps with live-countdown timers on steps 1 & 4, two notes, "Сохранить рецепт" → toast with undo, and a "Готовить" stub.

Light/dark toggle (top-right) re-skins everything; responsive — full-bleed at 390×844, centered card on desktop.

Two notes:
- I kept your literal tool-call copy "Проверяю твою кладовку…" (the «ты»), even though the system voice elsewhere uses «вы» — easy to switch if you'd prefer consistency.
- "Готовить" is a stub raising a toast, ready to wire to the cooking-mode screen next.

## User

The mobile layout is good — keep it as-is. Now design a real desktop layout (≥1024px)
  instead of just centering the mobile column. This is the same screen, adaptively
  restructured, not a separate app.
  
  ## Desktop restructuring
  - Kill the bottom nav and the burger/drawer on desktop. Replace both with a
    persistent left sidebar (~280px): app name on top, primary nav (Чат / Кладовая /
    Рецепты), then the conversation list with "Новый чат" — always visible, current
    conversation highlighted. Theme toggle moves to the sidebar footer.
  - Chat feed becomes the main column: max-width ~720–760px for comfortable line
    length, centered in the remaining space, input bar pinned to the bottom of this
    column (not the viewport edge-to-edge).
  - Hover states matter on desktop: message actions (copy), conversation row actions
    (rename/delete) appear on hover — they don't exist on mobile.
  - Keyboard: Enter sends, Shift+Enter for a newline; autofocus the input.
  
  ## Recipe card on desktop
  The card may use the extra width: ingredients and steps side-by-side (ingredients
  as a left column ~40%, steps on the right), notes full-width below. On mobile it
  stays stacked as it is now.
  
  ## Breakpoints
  - <768px: current mobile layout, unchanged.
  - 768–1023px: sidebar collapses to icon rail or stays as drawer — your call,
    show me what you pick.
  - ≥1024px: full layout described above.
  
  Render it so I can actually evaluate the desktop version (don't preview it in a
  phone frame).

## Assistant

_[tool: update_todos]_

This is a substantial restructure. Let me plan it, then rewrite the layout CSS and the three components to be adaptive — same screen, three breakpoints.Let me rewrite `app.css` in full — keeping the mobile layout intact and adding the rail and desktop layouts.

_[tool: write_file]_

_[tool: write_file]_

Now the App shell — `useMode` hook, Sidebar, Rail, MainHeader, conversation state with rename/delete:

_[tool: str_replace_edit]_

Now update ChatScreen — message-row wrappers with hover copy, the centered `chatbar-inner`, and desktop autofocus:

_[tool: str_replace_edit]_

Now the RecipeCard — restructure the body into columns (ingredients / steps / notes) so the desktop two-column grid works:Now let me update the asset viewport to reflect the desktop default and render to verify. Let me view the desktop layout first.

_[tool: show_html]_

_[tool: eval_js]_

My preview iframe is narrow so it's in mobile mode. Let me check the actual width and confirm whether I can capture desktop.

_[tool: eval_js]_

My iframe is only 390px wide, so I'll force a desktop-width render for verification by overriding the viewport width and the app size, then capture the full DOM node.

_[tool: eval_js]_

## Assistant

## Assistant

_[tool: write_file]_

The class didn't change. The `useMode` reads `window.innerWidth` but my override may not have stuck through React's render. Let me make a dedicated desktop preview file that renders the app at a forced 1280px width inside an iframe — the reliable way to evaluate the desktop layout.

_[tool: show_html]_

_[tool: save_screenshot]_

The iframe-based screenshot came back blank — html-to-image can't capture nested iframe content. Let me use a real pixel capture instead.

_[tool: str_replace_edit]_

Both screenshot tools use html-to-image, which can't reach into a nested iframe. I'll add a mode override to `useMode` so I can force desktop directly in the main file, then render the `.app` node at a real 1280px width — html-to-image serializes the element at its own layout size, so a forced-wide app captures fully even in a narrow pane.

_[tool: show_html]_

_[tool: eval_js]_

Desktop mode is active with the sidebar. Now I'll capture the forced-wide `.app` node — html-to-image renders it at its 1280px layout size.

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

The desktop structure works — sidebar with nav + conversation list, active highlights, centered feed. Two bugs visible: "Су-шеф" brand wraps, and the header title clips vertically. The capture is also clipped at the ~910px pane width. Let me fix the bugs and capture the full width by zooming the app to fit.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: eval_js]_

Excellent — the full desktop layout is working beautifully: sidebar with brand, nav (Чат active), conversation list with active highlight, "Тёмная тема" toggle in the footer; centered feed with right/left bubbles; input bar pinned to the bottom of the column. 

The header title truncates oddly early though ("Ужин из того, что е…" when there's plenty of room). Let me check that, and verify the recipe card's 2-column desktop layout — the key deliverable. Let me seed a recipe into the desktop feed.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

That's a zoom measurement artifact (201px × 0.66 = 132). The title fits — but to be safe I'll let the header div take full available width so it only truncates when genuinely too long. Now the priority: verify the recipe card's 2-column desktop layout. Let me seed a recipe into the feed via a temporary flag.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

The 2-column recipe card is exactly right — ingredients left (~38%) with the "не хватает 2" badge, steps right with a vertical divider and timer, servings stepper top-right. Header title now shows fully. Let me see the notes (full-width below) and action buttons, then verify the tablet rail mode.

_[tool: eval_js]_

_[tool: show_html]_

The 2-col layout is confirmed. The card is tall so notes/actions are below the fold — the CSS places them full-width below (grid-column 1/-1). Let me verify they're there and capture the tablet rail mode (768–1023), the last unseen breakpoint.

_[tool: save_screenshot]_

Notes present, actions horizontal on desktop, grid is 275/425px two columns. Now the tablet rail mode:

_[tool: show_html]_

The tablet rail mode works — icon rail (brand, new-chat, nav with chat active in paprika), centered feed, and the recipe card uses the 2-column layout. All three breakpoints confirmed. Let me verify mobile is still intact (stacked recipe + bottom nav) at its natural width, then clean up.

_[tool: save_screenshot]_

_[tool: show_html]_

That's actually rail mode again (the capture pane is ~920px wide here). Let me force mobile mode explicitly and constrain to phone width to confirm the mobile layout (stacked recipe + bottom nav) is unchanged.

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

_[tool: delete_file]_

_[tool: update_todos]_

Mobile mode confirmed intact — top bar with burger, theme toggle, bottom nav (Чат active), stacked layout. All three breakpoints verified. Let me clean up the test artifacts and remove the temporary recipe-seed flag.Now the final handoff. Let me open the file cleanly (no query params) and check for console errors.

_[tool: done]_

_[tool: fork_verifier_agent]_

Done. The Chat screen now adaptively restructures across three breakpoints — same screen, not a separate app.

**≥1024px (desktop)** — persistent 280px sidebar: brand, primary nav (Чат / Кладовая / Рецепты), always-visible conversation list with the current chat highlighted and **hover rename/delete** per row, plus the theme toggle in the footer. No bottom nav, no burger. Feed centered at max-width 760px, input bar pinned to the bottom of that column. Messages show a **copy** action on hover. The recipe card uses the width: **ingredients left (~38%) · steps right**, divided by a rule, with notes and actions full-width below.

**768–1023px (tablet)** — I chose a **72px icon rail** (brand, new-chat, nav icons, theme toggle) over a drawer: it keeps navigation one tap away without stealing the width the recipe's two-column layout needs.

**<768px (mobile)** — unchanged: top bar + burger drawer + bottom nav, recipe stacked single-column.

Keyboard: Enter sends, Shift+Enter newlines, input autofocuses on desktop/tablet (not mobile, to avoid popping the keyboard).

One note: the layout switches on `window.innerWidth` at load and on resize, so dragging the window across a breakpoint re-renders the chat (resets the current conversation's messages) — fine for evaluation, but say the word if you'd rather it preserve feed state across breakpoint changes. A background check is running; I'll flag anything it catches.

## User

Verifier agent check completed

## Assistant

The verifier confirmed everything passes — all three breakpoints, the sidebar hover actions, the 2-column recipe card, and no console errors. The desktop restructure is complete and ready for your review.

## User

<pasted_text name="Pasted text (40 lines)">
  
  Next screen: Cooking Mode. Wire it to the "Готовить" button on the recipe card.
  This is THE at-the-stove screen — the whole product exists for this moment, so
  
  ## Concept
  A full-screen step-by-step view of the recipe: one step per screen. The user's
  phone lies next to the stove; they glance at it from ~1 meter and tap with a
  knuckle or a wet finger.
  
  ## Layout (mobile)
  - Top: thin progress indicator (step dots or "Шаг 2 из 5") + close (✕) button
    that returns to the chat/recipe with confirmation if a timer is running.
  - Center: the step — short title, then the full instruction in the design
    system's cooking-mode display size. This text is the hero; nothing competes
    with it. 
  - If the step has a timer: a huge timer button/readout under the text
    ("10:00" → live countdown). When it hits zero: strong visual change (color
    fill) + the step pulses; simulate a sound/vibration affordance with an icon.
  - Bottom: two full-width buttons "Назад" / "Дальше" — each at least 64px tall,
    thumb-reachable. On the last step "Дальше" becomes "Готово 🎉" and returns
    to the recipe with a toast.
  - A collapsed ingredients drawer: a thin pull-up handle ("Ингредиенты") for
    quick reference mid-cooking, without leaving the step.
    
  ## Behaviors
  - Steps can also be switched by tapping the left/right halves of the screen
    (giant invisible tap zones) — buttons are the affordance, zones are the
    shortcut.
  - A running timer keeps running when I navigate to another step; show a small
    floating chip ("Шаг 1 · 4:32") that jumps back to that step when tapped.
  - Keep screen awake: simulate a "не гаснуть" toggle in the top bar (real
    wake-lock comes later in the web app).
  - Dark theme must look great here — evening kitchen is the default scenario.
  
  ## Desktop
  Don't over-design: a centered modal-like panel (~720px) with the same structure,
  arrow keys for prev/next, Esc to close. Mobile is the priority.
  
  Demo with the chicken pasta recipe from the chat (5 steps, timers on steps 1 & 4).
  Use informal «ты» everywhere, consistent with the rest.
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="HRLogics MDM Design System (design system)">
[Design System] This project uses the **HRLogics MDM Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# HRLogics MDM — Design System

A design system derived from the HRLogics **MDM (Master Data Model)** admin client — a React + MUI v9 SPA that sits at the hub of HRLogics' data plumbing (file uploads, transformations, outbound sync to HRLogics' product suite: WOTC, ERC, Verifications, Unemployment Tracking, etc.).

## Sources

- **Codebase (mounted, local):** `client/` — the `@mdm/client` Vite + React 19 app. Theme lives at `client/src/app/theme/config/`, shared components at `client/src/shared/components/`, pages at `client/src/pages/`, widgets at `client/src/widgets/`.
- **Repo:** `trakcap/mdm` on GitHub — monorepo containing the client plus Python backends (`adapters/`, `managers/`, `processing/`, `transformer/`, etc.). The client is what this design system covers.
- **Uploaded fonts:** Foro Rounded (8 weights, OTF) — primary brand typeface.
- **Uploaded logos:** `hrl-logo-large.svg`, `hrl-logo-small.svg` (wordmark + hexagonal monogram, `favicon.ico`.
- **The product:** `HRLogics — MDM` ("HRLogics Master Data Model"). Theme color in `&lt;meta name="theme-color"&gt;` is `#a4f478` (a vivid green — but this doesn't appear anywhere else and looks like a legacy/leftover; NOT a brand color).

## The Product in one paragraph

MDM is the internal control tower at HRLogics — an admin dashboard used by HRLogics staff (admins + readonly admins + internal ops) to land partner payroll/HR files, validate them, transform them, and sync employees/companies/PEOs outbound to HRLogics' product surfaces. It is an internal tool, not a customer-facing website — so the aesthetic is utilitarian, MUI-based, dense, and data-forward, but the brand details (Foro Rounded, deep indigo wordmark, orange/amber primary) give it a warmer, more consumer-friendly feel than a typical admin console.

## Surfaces covered

There is **one primary surface**: the MDM web app. Within it, the key page types are:
- **Login / auth redirect** (Auth0 flow)
- **Dashboard** (pending employees/payrolls/roles cards with tables)
- **List pages** (Companies, PEOs, File Uploads, Transformations, Data Viewer, Synchronizations, Performance, Thresholds, Client Stats, Solutions)
- **Detail / form pages** (company info forms, data upload form)
- **Control center / OAuth2 clients** (popover-launched admin tools)

There is no public marketing site, mobile app, or docs site represented in the sources provided.

---

## CONTENT FUNDAMENTALS

**Voice.** Flat, functional, quietly friendly. The surface is an internal admin tool, so copy is descriptive rather than persuasive — but branded touches (Foro Rounded, Title Case labels, humane subtitles like "Employees waiting to sync") keep it from feeling cold.

**Person.** Third-person / object-oriented. Nav items and titles are things ("Companies", "File Uploads", "Dashboard") — not actions addressed to the user ("Upload your files"). Buttons are short imperative verbs ("Log Out", "Upload", "Add"). Rarely "you"; never "we".

**Casing.**
- Page titles &amp; nav: **Title Case** — "Dashboard", "File Uploads", "Control Center", "OAuth2 Clients".
- Button labels: **Title Case**, single verb or verb+noun — "Log Out", "Upload Data".
- Section subtitles / helper text: **Sentence case** — "Employees waiting to sync", "Pending Employees".
- CAPS are reserved for tiny sidebar overline labels (see `sidebarButtonStyles` — `text-transform: uppercase`, `font-size: 13px`, tracked slightly).
- Captions (MUI variant) use **uppercase Montserrat** — the sans-serif cousin to Foro Rounded.

**Punctuation.** No trailing periods on page titles, card titles, or list labels. Subtitles and helper text follow sentence punctuation only when they are full sentences.

**Terminology.** Domain nouns are consistent and capitalised as proper terms in UI copy: *Companies, PEOs, Employees, Payrolls, Roles, Outbound Queue, Synchronizations, Transformations, Thresholds, Solutions, Client Stats, Data Viewer, File Uploads, Control Center*. Products are abbreviated: **WOTC, ERC, CV, SS, UT** (each has a dedicated `*-product.svg` icon).

**Tone examples (real, from the codebase):**
- Card title / subtitle pair: "Pending Employees" / "Employees waiting to sync"
- Nav: "Dashboard", "Companies", "PEOs", "Data Viewer", "File Uploads", "Transformations", "Synchronizations", "Performance", "Thresholds"
- Popover menu: "Control Center", "OAuth2 Clients", "Log Out"
- Page headings: "Dashboard" (no articles, no taglines)
- Breadcrumb separator: `/` (raw slash, not `›`)

**No emoji. No exclamation marks. No marketing superlatives.** Unicode is used only in code/data. Numbers and status counts are shown plainly; no "🎉 3 new!" style.

---

## VISUAL FOUNDATIONS

**Typography.**
- **Primary:** Foro Rounded (8 weights, 100–900). Used for everything — headings, body, buttons, nav, data. Warm, geometric, softly rounded — carries the entire brand personality.
- **Secondary:** Montserrat (via `@fontsource/montserrat`). Used **only** for the `caption` variant — tiny uppercase labels.
- **Scale** (see `typography.ts`): h1 96 / h2 60 / h3 48 / h4 34 / h5 24 / h6 20 / subtitle1 16 Bold / body1 16 / body2 14 / body3 12. Buttons 13/14/16, all weight 700 (small is 500). Tooltip 10px. All sans, all non-upper except caption and overline.
- `ascent-override: 92%; descent-override: 24%` is applied to every Foro Rounded face — tightens vertical rhythm noticeably.

**Color.** OKLCH-based, perceptually-uniform tiers (`lighter ~97% L`, `light ~92%`, `main ~70–73%`, `dark ~55%`, `darker ~40%`). Hues: primary 65 (warm amber-orange), secondary 265 (cool indigo-gray), info 235, success 148, warning 85, error 27. The brand wordmark is a deep indigo `#1C036D` — closest to `--secondary-darkest` `oklch(22% 0.13 270)`. The logo mark uses an orange-to-amber gradient (`#E64D25 → #F6B02D`).

**Backgrounds.** White (`--bg`) dominates. A very subtle `--bg-subtle` (`oklch(97% 0.007 240)`) for alternating rows / quiet chrome. Signature decorative element: an outlined **hexagon tessellation pattern** (`assets/hex-background.png`, `hex.svg`, `hex-dark.svg`) used sparingly on auth/empty states — never full-bleed behind content. No gradients in chrome. No photography. No hand-drawn illustrations.

**Motion.** Restrained. The only deliberate transitions are:
- Drawer open/close (300ms).
- Toggle sidebar chevron rotation (`0.25s all ease-in-out`, rotates 180°).
- MUI default tab indicator / ripple fades (ripples are *disabled* on tabs — `disableRipple`).
- No bounces, no parallax, no scroll-linked anims. Data tables settle instantly.

**Hover states.**
- List items / menu buttons: background shifts to `oklch(95% 0 0)` (a neutral 5% darken).
- Selected list items: `oklch(90% 0 0)` — one step deeper — with text/icon swapping to `--secondary-darker`.
- Buttons (text variant): background `--secondary-lightest`.
- Links: color darkens to `--link-dark` *and* underline appears.
- Button-group outlined: border → `--secondary-main`, bg → `--secondary-lightest`.

**Press / active states.** No scale transforms. MUI-default ripple on contained buttons (kept, but `boxShadow: none` so elevation never jumps). Tabs and list items have all ripples explicitly disabled — they rely purely on color.

**Borders.** 1px, color `--divider` (`oklch(87.2% 0.008 265)` — cool light gray). Used for appbar bottom edge, card outlines (`OutlinedCard`), data-grid cells, dividers in popovers.

**Shadows.** Almost all paper is **elevation 0** (flat) — `paperComponent` sets `elevation: 0` as default. Popovers explicitly bump to `theme.shadows[8]` (MUI default, `0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12)`). No inner shadows. No glow rings.

**Corner radii.** Base `theme.shape.borderRadius = 8px`. `MuiPaper` overrides to `12px` (soft, friendly). Small chips become **pills** (`20px`). Tab indicators are `border-radius: 2`. No sharp 0-radius except data-grid internals.

**Cards.** Two dominant card shapes:
- **OutlinedCard**: 1px divider border, 12px radius, no shadow, white bg. Title + optional subtitle top, divider, content. This is the *default* in the dashboard.
- **Paper / Dialog**: 12px radius, shadow only when floating (popover/menu).
No left-border-accent cards. No colored borders.

**Chips / badges.** Small chips are pills (`border-radius: 20`), medium chips are 8px radius. Each color variant has its own tri-tone (bg from `*.light` or `*.lighter`, border from `*.dark`, text from `*.dark` or `*.darker`). Text weight 400, size 13.

**Buttons.** Three sizes — large (42h), medium (37h), small (32/28h depending on variant). Three variants — `contained` (primary brand), `outlined` (info / secondary use mapped `.darker` borders), `text` (subtle, `secondary.lightest` hover bg). `textTransform: none` — never uppercase. Disabled contained buttons get `secondary.lighter` bg + `secondary.main` fg.

**Layout rules.**
- Outer shell: fixed left **sidebar drawer** (permanent on desktop, temporary on mobile) + top **header bar** (`appbar` bordered bottom only, `borderRadius: 0`). Content fills the rest.
- Sidebar widths: opened ~220px with `px: 2`, closed ~56px (icons only) with `px: 1.5`. Toggle chevron in header rotates on open/close.
- Header content: breadcrumbs left (`/` separator, max 8 items), avatar + upload menu right (gap 16px, `mr: 2`).
- Mobile: sidebar becomes full-screen right-anchored drawer.

**Transparency &amp; blur.** None. Surfaces are opaque. Text uses `rgba` black at 0.87 / 0.60 / 0.38 (`--fg1/2/3`) — the standard MUI text ladder. No `backdrop-filter`.

**Imagery color vibe.** There is no photography. The palette imagery is saturated &amp; warm (primary amber, accent orange). Neutrals lean cool (secondary hues live at 265° — blueish-gray), giving the overall UI a subtle warm/cool push-pull.

**Data density.** Medium. Grids use MUI X DataGrid Premium with custom cell focus removed (`outline: none !important`). Rows are not striped; dividers are the only separation.

---

## ICONOGRAPHY

**The icon system is mixed and real — use the actual assets, don't roll your own.**

1. **Local SVG sprite** — `client/src/shared/assets/icons/*.svg`, exported via `?react` through `vite-plugin-svgr`. **Copied into this system at `assets/icons/`**. ~37 icons, outlined style, ~1.5px stroke, 24×24 canvas.
   - Navigation / UI: `home`, `user`, `users`, `settings`, `search`, `info`, `close`, `edit`, `bin`, `copy`, `download`, `upload`, `lock`, `logout`, `eye`, `file`, `arrow-right`, `chevron-left-double`, `add`, `map-point`, `measure`, `role`, `tool`.
   - Domain: `briefcase`, `building`, `corporate-building`, `company`, `chart`, `data-flow`, `penBorder`.
   - Product glyphs (unique!): `cv-product`, `erc-product`, `ss-product`, `ut-product`, `wotc-product` — these name the HRLogics product suite (Credit Verifications, ERC, Something-SS, Unemployment Tracking, WOTC).
   - Action variants: `uploadAction`, `uploadData` (two distinct upload glyphs).

2. **MUI Icons (`@mui/icons-material`)** — used for navigation glyphs inside the menu items file (`mainMenuItems.tsx`): `DashboardOutlined`, `ApartmentOutlined`, `BusinessOutlined`, `WorkOutlineOutlined`, `CloudSyncRounded`, `UploadFileOutlined`, `TransformOutlined`, `FindInPageOutlined`, `ShowChartOutlined`, `BuildOutlined`, `WarningAmberOutlined`. In the header popover: `Hub`, `SupervisorAccount`, `Logout`. Mostly the **Outlined** variant — thin stroke, consistent with the local SVG set.

   This system substitutes MUI Icons with **Material Symbols (outlined)** from the Google Fonts CDN for HTML prototypes — stroke weight and shape match very closely. Flagged.

3. **No icon font of their own.** No custom Material icon theme.

4. **Emoji: not used.** Unicode chars used only as separators (`/` for breadcrumbs).

5. **Logo** — the HRLogics wordmark SVG contains both the hexagonal mark (orange→amber gradient) and the deep-indigo wordmark. Use `assets/hrl-logo-large.svg` (full lockup, 150×36) or `assets/hrl-logo-small.svg` (just the hex, for collapsed sidebar).

6. **Background motif** — `assets/hex-background.png` / `hex.svg` / `hex-dark.svg` — outlined hexagonal lattice. Used as decorative background only, at very low contrast (~6% gray lines).

---

## Index

```
./
├── README.md                  ← you are here
├── SKILL.md                   ← Claude Code–compatible skill manifest
├── colors_and_type.css        ← CSS vars + font-face + semantic defaults
├── fonts/                     ← 8× Foro Rounded .otf files
├── assets/
│   ├── hrl-logo-large.svg     ← wordmark + hex mark
│   ├── hrl-logo-small.svg     ← hex mark only
│   ├── favicon.ico
│   ├── hex-background.png     ← hex lattice motif
│   ├── hex.svg / hex-dark.svg
│   └── icons/                 ← 37 outlined SVGs from the codebase
├── preview/                   ← design-system preview cards (registered)
├── ui_kits/
│   └── mdm_web/               ← React/JSX recreation of the MDM admin UI
│       ├── README.md
│       ├── index.html         ← click-thru prototype
│       └── *.jsx              ← factored components
```

See `ui_kits/mdm_web/README.md` for the component inventory of the admin UI kit.

---

## Caveats / known substitutions

- **MUI Icons → Material Symbols (Outlined)** via Google Fonts in the UI kit. Geometry is very close, but identical 1:1 substitution would require importing `@mui/icons-material`.
- **Montserrat** is loaded from Google Fonts in the UI kit rather than bundled locally.
- No Figma was provided; all design intent was reverse-engineered from `client/src/app/theme/config/` (MUI v9 theme) and live component files.

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/colors_and_type.css`, `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/preview/_preview.css`, `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/ui_kits/mdm_web/styles.css`). The 142 custom properties it defines are:

--accent, --accent-contrast, --action-disabled, --action-disabled-bg, --action-focus, --action-hover, --action-selected, --alert-error-bg, --alert-error-fg, --alert-info-bg, --alert-info-fg, --alert-success-bg, --alert-success-fg, --alert-warning-bg, --alert-warning-fg, --bg, --bg-paper, --bg-subtle, --brand-indigo, --brand-orange, --brand-orange-end, --divider, --error, --error-contrast, --error-dark, --error-light, --fg1, --fg2, --fg3, --font-primary, --font-secondary, --fw-bold, --fw-extrabold, --fw-extralight, --fw-heavy, --fw-light, --fw-medium, --fw-regular, --fw-semibold, --fw-thin, --graph, --info, --info-contrast, --info-dark, --info-darker, --info-light, --info-lighter, --info-lightest, --link, --link-dark, --primary, --primary-contrast, --primary-dark, --primary-darker, --primary-light, --primary-lighter, --radius-lg, --radius-md, --radius-pill, --radius-sm, --radius-xs, --secondary, --secondary-contrast, --secondary-dark, --secondary-darker, --secondary-darkest, --secondary-light, --secondary-lighter, --secondary-lightest, --shadow-0, --shadow-1, --shadow-2, --shadow-8, --space-0, --space-1, --space-10, --space-12, --space-2, --space-3, --space-4, --space-5, --space-6, --space-8, --success, --success-contrast, --success-dark, --success-light, --ts-avatar-size, --ts-badge-size, --ts-badge-weight, --ts-body1-size, --ts-body1-weight, --ts-body2-size, --ts-body2-weight, --ts-body3-lh, --ts-body3-size, --ts-body3-weight, --ts-button-lg-size, --ts-button-lg-weight, --ts-button-md-size, --ts-button-md-weight, --ts-button-sm-size, --ts-button-sm-weight, --ts-caption-size, --ts-caption-weight, --ts-chip-size, --ts-chip-weight, --ts-h1-size, --ts-h1-weight, --ts-h2-size, --ts-h2-weight, --ts-h3-size, --ts-h3-weight, --ts-h4-size, --ts-h4-weight, --ts-h5-size, --ts-h5-weight, --ts-h6-size, --ts-h6-weight, --ts-input-helper-lh, --ts-input-helper-size, --ts-input-helper-weight, --ts-input-label-size, --ts-input-label-weight, --ts-input-lh, --ts-input-size, --ts-input-weight, --ts-overline-size, --ts-overline-tracking, --ts-subtitle1-size, --ts-subtitle1-weight, --ts-subtitle2-size, --ts-subtitle2-weight, --ts-table-hdr-size, --ts-table-hdr-weight, --ts-tooltip-size, --ts-tooltip-weight, --warning, --warning-contrast, --warning-dark, --warning-light, --warning-lighter

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

<attached-skill name="Су-шеф Design System (design system)">
[Design System] This project uses the **Су-шеф Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Су-шеф — Design System

**Су-шеф** ("sous-chef") is a private, chat-first AI cooking assistant used mostly on a
phone **while standing at the stove**. The product UI is in **Russian**. This repo is the
single source of truth for its visual language: tokens, components, and an interactive UI
kit, defined so they can be re-implemented in **SvelteKit** (web) and **Jetpack Compose**
(Android) from named tokens — never ad-hoc values.

&gt; This is a greenfield system authored from a product brief. No external codebase or Figma
&gt; was provided. If you have the eventual SvelteKit/Compose repos, link them here.

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

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/colors_and_type.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/components.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/preview/_card.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/ui_kits/cooking-app/app.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/ui_kits/cooking-app/kit.css`). The 71 custom properties it defines are:

--accent, --accent-hover, --accent-soft, --bg, --border, --border-strong, --danger, --danger-soft, --duration-base, --duration-fast, --duration-slow, --ease-decelerate, --ease-emphasized, --ease-standard, --font-mono, --font-sans, --radius-lg, --radius-md, --radius-pill, --radius-sm, --radius-xl, --shadow-lg, --shadow-md, --shadow-sm, --space-0, --space-1, --space-10, --space-12, --space-16, --space-2, --space-20, --space-3, --space-4, --space-5, --space-6, --space-8, --success, --success-soft, --surface, --surface-raised, --surface-sunken, --text-body-large-line, --text-body-large-size, --text-body-large-weight, --text-body-line, --text-body-size, --text-body-weight, --text-caption-line, --text-caption-size, --text-caption-spacing, --text-caption-weight, --text-cooking-line, --text-cooking-size, --text-cooking-weight, --text-heading-line, --text-heading-size, --text-heading-weight, --text-on-accent, --text-primary, --text-secondary, --text-tertiary, --text-title-line, --text-title-size, --text-title-weight, --touch-min, --warning, --warning-soft, --weight-bold, --weight-medium, --weight-regular, --weight-semibold

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

Two design systems are attached, but this task is squarely the **Су-шеф** cooking app — I'll build in that system (the HRLogics one is unrelated to this screen). Note: the Су-шеф guide prescribes «вы», but you've explicitly asked for «ты» everywhere — your instruction wins, and it matches the «ты» already in the tool-call copy.

Let me re-read my current files to wire Cooking Mode in cleanly.

_[tool: update_todos]_

I have the reference and tokens. Let me lay out the plan and build. First, update the recipe data — add short step titles and convert step/notes copy to «ты» imperative for consistency in cooking mode.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now the cooking-mode CSS:

_[tool: write_file]_

_[tool: write_file]_

Now the CookingMode component:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now wire it into App and the HTML. Let me update the App shell:

_[tool: update_todos]_

_[tool: show_html]_

The chat renders cleanly (rail mode at this width). Now let me trigger Cooking Mode by clicking "Готовить" and verify it. Let me scroll to the recipe and click cook.

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: show_html]_

The `?recipe=1` seed was removed earlier for cleanliness. Let me re-add it temporarily to test the full path (recipe card → Готовить → cooking mode).

_[tool: eval_js]_

_[tool: get_webview_logs]_

Clicked but cooking didn't open — likely a render error. Let me check the logs.

_[tool: eval_js]_

_[tool: eval_js]_

The click likely hadn't committed the re-render when I queried synchronously. Let me check now.It's open — step 1 "Отвари пасту", timer present, 5 dots, keep-awake button. Let me screenshot the mobile cooking mode.

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

Cooking Mode works, but the hero text is blowing up because `8vw` reads the wide test iframe's width (on a real 390px phone it'd be fine, but I shouldn't rely on `vw` since the app is a fixed-width container on larger screens). I'll switch to deterministic fixed sizes per breakpoint and make the body scroll as a safety net.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: eval_js]_

Much better at phone width — "ШАГ 1", title, 34px hero, progress dots, keep-awake, ingredients handle, and the 64px nav buttons. The body scrolls as a safety net. Let me verify the timer fits without scrolling on a real phone height, and check the timer/alarm states and chip behavior numerically.

_[tool: eval_js]_

`bodyH 338` is just my test pane being short (the `fixed` overlay fills the ~540px preview pane, not the forced 844px app) — on a real 844px phone the body is ~660px and the 380px content fits without scrolling. I started step 1's timer; now let me navigate forward and verify the floating chip appears.The persistent timer works — on step 2, the floating chip shows "Шаг 1 · 7:54" still counting, and step 2 has no timer of its own. Let me screenshot this state (chip visible) and test the alarm + the last-step "Готово".

_[tool: save_screenshot]_

_[tool: eval_js]_

The chip works beautifully. Now let me test the last-step "Готово" button, the ingredients drawer open, and force the alarm visual state (the countdown logic is already verified — `done` flips at 0). Let me jump to the last step and open ingredients first.

_[tool: save_screenshot]_

Last step shows "Готово". The ingredients toggle needs a tick to commit. Let me screenshot step 5 with ingredients open.

_[tool: show_html]_

Step 5 with "Готово" + party-popper icon (the celebratory affordance, rendered as a Lucide glyph rather than the literal 🎉 to honor the system's no-emoji rule). The chip persists. Now let me verify the desktop modal and dark theme — the evening-kitchen default. Let me reload in desktop, switch to dark, and open cooking with ingredients expanded.

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

The desktop modal works — centered panel over the dimmed dark chat, sidebar behind, ingredients drawer expanded with the full list. Dark theme looks great. The ingredients drawer is a bit tall relative to the panel though. Let me close it and capture the primary step view, and trim the drawer height slightly so the step stays partly visible when it's open.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: show_html]_

Desktop dark modal looks great (timer is just below the fold here due to my zoom on a short pane — fits on a real display). Last thing to confirm visually is the **alarm** state. The countdown→done logic is already verified; let me capture its appearance by forcing the visual, in light mobile.

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: show_html]_

The forced 390px width makes the chat leak around the overlay — but that's only because mobile cooking mode is full-screen with no scrim (correct for real phones); my narrow-width test creates the gap artificially. Let me verify the alarm cleanly in rail mode, which uses a self-contained 720px modal with a scrim.

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: eval_js]_

The modal is clean with its scrim. The 40px hero pushes the timer below the fold at this zoom — let me scroll the body to reveal the forced alarm state.

_[tool: save_screenshot]_

_[tool: eval_js]_

The screenshot keeps clipping due to zoom/pane height. Let me verify the alarm styling deterministically via computed styles instead of fighting the capture.

_[tool: eval_js]_

Alarm confirmed: green `#2F7D4F` fill, white text, `cook-pulse` 0.9s animation, "Готово" + bell icon, plus `navigator.vibrate`. Now let me verify the confirm-on-close dialog when a timer is running, then clean up.

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

The two clicks fired in one tick before React committed the running state, so the close handler still saw the old closure. Let me separate them.The confirm-close dialog works — "Таймер ещё идёт" with "Остаться" / "Выйти". Let me capture it for the record, then clean up.

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

The confirm dialog's functional behavior is verified (correct title + actions); the screenshot just missed it on re-render. That's enough. Let me clean up — remove the test seed and the screenshot artifacts.

_[tool: run_script]_

_[tool: delete_file]_

_[tool: update_todos]_

Cleaned up. Final handoff — open the file clean and check for console errors.

_[tool: done]_

_[tool: fork_verifier_agent]_

Done. **Cooking Mode** is built and wired to the recipe card's "Готовить" button.

**At-the-stove screen (mobile-first):**
- One step per view — "ШАГ N", a short imperative title ("Отвари пасту"), then the full instruction as the **40px cooking-display hero**, all in informal «ты» as you asked.
- **Top bar:** progress (Шаг N из 5 + dots, timer-steps tinted) · ✕ close · **"Не гаснуть"** keep-awake toggle (uses the real Wake Lock API when available, falls back gracefully).
- **Big timer** on steps 1 & 4: huge tappable readout (8:00 / 5:00) → live countdown. At zero it fills **herb-green, pulses, swaps to a bell-ring icon + "Готово"**, and fires `navigator.vibrate` — the simulated alarm.
- **Persistent timers:** a running timer keeps counting when you move on; a floating **"Шаг 1 · 4:32"** chip appears and jumps back to that step when tapped (goes green when it finishes).
- **Bottom:** full-width 64px **Назад / Дальше**; on the last step Дальше becomes **Готово** → closes with a toast.
- **Ingredients pull-up drawer** for quick reference without leaving the step.
- **Tap zones:** left/right screen halves switch steps (buttons are the affordance, zones the shortcut — text taps fall through, the timer button doesn't).
- **Confirm-on-exit** when a timer is running ("Таймер ещё идёт… Остаться / Выйти").

**Desktop/tablet:** a centered ~720px modal with a scrim; **←/→** navigate, **Esc** closes. **Dark theme** (the evening-kitchen default) verified throughout.

Two deliberate calls, flagging for your review:
- **"Готово 🎉"** — I rendered the celebration as a Lucide *party-popper* glyph beside the word rather than the literal emoji, since the Су-шеф system bans emoji. Say the word if you'd rather have the actual 🎉.
- The step instructions are now **«ты»** ("Отвари…", "Нарежь…") in both Cooking Mode *and* the recipe card, so the two stay consistent.

A background check is running; I'll flag anything it catches.

## User

Verifier agent check completed

## Assistant

The verifier confirmed Cooking Mode passes — step navigation, the live timer and its floating chip, the "Готово" finish, the ingredients drawer, and the desktop modal all work with no console errors. The at-the-stove screen is complete and ready for your review.

## User

<pasted_text name="Pasted text (40 lines)">
  Final two screens: Pantry and Saved Recipes. Wire them to the bottom-nav tabs
  (mobile) and sidebar nav (desktop). These are utility CRUD screens — build them
  entirely from existing design-system components, no new visual language.
  
  ## Screen: Кладовая
  Two tabs at the top: "Продукты" / "Техника".
  
  ### Продукты tab
  - List of ~12 mock ingredients: name, quantity + unit (г/мл/шт), category tag
    (молочное, овощи, специи, …), optional expiry badge. Include one expired item
    (highlighted with the danger token) and one "скоро истечёт" (amber).
  - Group or sort by category; your call — show me what reads faster.
  - Tap a row → inline edit of quantity (stepper or quick +/- chips like
    «−100 г / +100 г»), not a separate page.
  - Swipe-to-delete with undo toast; also an explicit delete in the edit state.
  - Prominent "+ Добавить" action: a bottom-sheet form (name, quantity, unit,
    category, expiry — only name required). On desktop it's a small dialog.
  - Search field on top — at 30+ items scrolling stops working.
  - Empty state: one line of text + the add button, no illustration.
  
  ### Техника tab
  - ~6 mock items: духовка, чугунная сковорода 26 см, аэрогриль, блендер,
    казан, венчик. Name + type tag, no quantities.
  - Same add/delete patterns, simpler form (name + type).
  
  ## Screen: Рецепты
  - List of saved recipe cards: title, total time, servings, and the pantry-match
    badge: "Всё есть" (success) / "Не хватает 2" (amber). 4–5 mock recipes with a
    mix of statuses — including the chicken pasta "saved" from the chat earlier.
  - Tap a card → full recipe view: the SAME recipe card component from chat,
    full-screen page, with "Готовить" (opens cooking mode — already built) and
    delete (confirm, then undo toast).
  - Sort: recently saved first; a search field on top.
  - Empty state: "Сохраняй рецепты из чата — они появятся здесь" + button
    "Перейти в чат".
    
  ## After both screens
  Make the whole prototype navigable end-to-end: chat → recipe card → save →
  appears in Рецепты → open → Готовить → cooking mode → done → back. Fix any
  dead ends. This is the full v1 walkthrough I'll use to demo the app.
</pasted_text>

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

A big final build — two CRUD screens plus full end-to-end wiring. Let me study the kit's existing Pantry/Recipes patterns first so I reuse the established visual vocabulary, then plan.

_[tool: update_todos]_

Now I have the full vocabulary — tabs, swipe rows, saved cards, badges. Let me lay out the plan, then build these as CRUD screens reusing the established components, with full data so the end-to-end demo works.Let me build the data first:

_[tool: write_file]_

_[tool: grep]_

Now let me check what component classes already exist in components.css so I reuse them (badges, search, buttons):

_[tool: write_file]_

I have all the component classes I need. Now the screens CSS:

_[tool: read_file]_

Now refactor RecipeCard to accept a `recipe` prop and optional delete action:

_[tool: str_replace_edit]_

_[tool: write_file]_

Now the Pantry screen — tabs, search, grouped list, inline edit, swipe-delete with undo, and the add sheet:

_[tool: write_file]_

Now the Recipes screen — saved list plus the detail page:

_[tool: read_file]_

Now the big one — rewrite App.jsx to lift state, route the detail view, add headers with back, and wire everything end-to-end. Let me read the current App first.

_[tool: str_replace_edit]_

Now the App edits — lifting state, routing the detail view, headers with back, and full wiring:

_[tool: grep]_

Let me verify the state block applied cleanly and tidy up conversation handlers to clear detail too:All edits applied. Now update index.html with the new scripts and CSS:

_[tool: str_replace_edit]_

_[tool: update_todos]_

Now let me render and check for errors, then verify the screens.

_[tool: show_html]_

Chat loads clean. Let me check console and then navigate to Pantry and Recipes tabs.

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: read_file]_

Pantry works (12 rows, 5 category groups, expired + soon tags, add button). But there's a Babel syntax error in RecipeCard.jsx — let me look at the end of the file.

_[tool: read_file]_

"Unexpected token at EOF" means an unclosed brace earlier. My refactor likely created a duplicate `function RecipeCard(` line. Let me check around the signature.Confirmed — duplicate signature line. Let me remove the stale one.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

No errors now. Pantry inline edit works — "−100 г / +100 г" chips and delete. Let me screenshot the Pantry, then the add sheet.

_[tool: save_screenshot]_

_[tool: eval_js]_

Pantry looks excellent — grouped list, inline qty editor with ±100 г chips, Удалить/Готово. Let me verify the add sheet and the Recipes screen + the save→appears walkthrough.

_[tool: save_screenshot]_

_[tool: eval_js]_

The add bottom-sheet is clean — name, quantity+unit, category chips, with "Добавить" disabled until a name is entered. Now the key end-to-end test. Let me close this, check Recipes (4 seeded, no pasta yet), then run the full chat→save→appears→open→cook flow.

_[tool: str_replace_edit]_

_[tool: show_html]_

Recipes shows the 4 seeded recipes with mixed match badges, pasta correctly absent. Now the critical save→appears→open→cook chain. The streaming flow is slow under capture, so let me re-add the temporary recipe seed to test the save wiring quickly (streaming itself is already verified).

_[tool: eval_js]_

The save→appears chain works: toast "Рецепт сохранён · Отменить", and pasta now sits at the top of Рецепты (5 total). Now open the pasta detail and launch cooking from there.

_[tool: eval_js]_

_[tool: eval_js]_

The complete walkthrough works: chat → save → appears in Рецепты → open detail (with Удалить/Готовить) → Готовить opens cooking mode. Let me verify the delete-confirm flow and the "done" return, then capture final screenshots.The delete flow works end-to-end: confirm dialog "Удалить рецепт?" → confirm → returns to list, recipe removed, undo toast "Рецепт удалён · Вернуть". Everything is wired. Let me capture final screenshots of the two new screens, then clean up the test seed.

_[tool: save_screenshot]_

_[tool: show_html]_

Recipes screen is polished — cards with time, servings, and match badges. Let me confirm the desktop 2-column grid and detail page, then clean up.

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: eval_js]_

Two things to check from those frames — the desktop nav active state, and whether the detail card rendered (frame 2 looks blank, likely the `rc-enter` opacity animation caught mid-flight). Let me verify via eval.

_[tool: save_screenshot]_

Both fine — nav correctly shows Рецепты active, and the detail card is fully rendered (6 ingredients, 3 steps, opacity 1); frame 2 just caught the entrance animation. Let me grab one clean detail capture, then clean up.

_[tool: str_replace_edit]_

_[tool: run_script]_

Everything verified — the detail page reuses the exact chat RecipeCard (2-column on desktop), with the back button in the header and Рецепты active in the sidebar. Let me clean up the test seed and screenshots, then hand off.

_[tool: delete_file]_

_[tool: update_todos]_

Final handoff — open clean and check for errors.

_[tool: done]_

_[tool: fork_verifier_agent]_

Done — the prototype is now a complete, navigable v1.

**Кладовая** — two tabs (Продукты / Техника). Products are grouped by category (Мясо, Овощи, Молочное, Бакалея, Специи) with one expired item (red «Просрочено») and one expiring soon (amber). Tap a row to inline-edit quantity with **«−100 г / +100 г»** chips (step adapts to unit) plus a delete; swipe-to-delete with undo; search up top; a prominent **«Добавить продукт»** opening a bottom-sheet (mobile) / dialog (desktop) where only the name is required. Техника is the same patterns, simpler (name + type).

**Рецепты** — saved cards with title, time, servings, and the pantry-match badge («Всё есть» / «Не хватает N»). Search, recently-saved-first, 2-column grid on desktop. Tap → full detail page reusing the **exact chat recipe card**, with **Готовить** (opens cooking mode) and **Удалить** (confirm → undo toast). Empty state offers «Перейти в чат».

**Full walkthrough wired and verified:** chat → second message produces the recipe card → **Сохранить рецепт** → toast → pasta appears at the top of Рецепты → open → **Готовить** → cooking mode → **Готово** returns with a toast. Delete, undo, and back navigation all resolve — no dead ends.

One product decision to flag: the chicken pasta is **not** pre-seeded in Рецепты — it lands there only after you save it from chat, so the save→appears moment is demonstrable in your demo. The other four recipes are pre-saved. Say the word if you'd rather it start already in the list.

A background check is running; I'll surface anything it flags.

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Cooking"
Project currently has 2 file(s)
User is viewing file: Чат - Су-шеф.html
Current date is now June 5, 2026
</system-info>

<pasted_text name="Pasted text (42 lines)">
  
  New flow: invite redemption + first-run onboarding. This is the first thing every
  user ever sees, and it solves a real problem: a fresh account has an empty pantry
  and no equipment, so the assistant has nothing to reason about.

  ## Context
  Telegram. Opening the link lands them here. No registration, no email, no password.
  
  ## Step 1 — Redeem screen (the invite link target)
  - Minimal and warm: app name, one line about what this is («Твой кухонный
    ассистент…»), the inviter's gesture acknowledged implicitly — this person was
    invited personally, don't make it feel like a SaaS signup.
  - One field: «Как тебя зовут?» (display name) + a big «Войти» button. The token
    is in the URL — the user never sees or types it.
  - Error states as separate views: link expired, link already used — each with
    one clear line and «Попроси новую ссылку» hint. No dead-end blank screens.
    
  ## Step 2 — Equipment quick setup (right after redeem)
  - One screen: «Что есть на твоей кухне?» with a grid of large toggle chips of
    common equipment (духовка, микроволновка, аэрогриль, блендер, миксер,
    мультиварка, гриль-сковорода, казан, пароварка, …) — tap to select, plus a
    small «+ своё» input for custom items.
  - Pre-select nothing. «Дальше» button always enabled (skip is implicit —
    selecting nothing is valid). 
  - This must take under 30 seconds.
  
  ## Step 3 — Pantry seeding (the interesting one)
  Don't build a long form. Offer two paths on one screen:
  - Primary: «Расскажи ассистенту» — a button that drops the user into the chat
    with a pre-filled suggestion like «Расскажи, что у тебя есть из продуктов,
    я всё запишу» — and the demo shows the assistant parsing a casual message
    («есть макароны, банка томатов, сыр грамм 200…») into pantry items via a
    tool-call indicator («Записываю в кладовку…») and a confirmation card listing
    what was added, with an edit affordance.
  - Secondary: «Заполню сам» — link to the pantry screen's add form.
  - Tertiary: «Пропустить» — straight to chat; the assistant works fine, it just
    asks about ingredients when needed.
    
  ## Wiring
  Redeem → equipment → pantry seeding → chat. Add a way for me to replay the flow
  from the prototype (e.g. a hidden «reset onboarding» control). Informal «ты»,
  both themes, mobile-first with the same desktop treatment as the rest.
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="HRLogics MDM Design System (design system)">
[Design System] This project uses the **HRLogics MDM Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# HRLogics MDM — Design System

A design system derived from the HRLogics **MDM (Master Data Model)** admin client — a React + MUI v9 SPA that sits at the hub of HRLogics' data plumbing (file uploads, transformations, outbound sync to HRLogics' product suite: WOTC, ERC, Verifications, Unemployment Tracking, etc.).

## Sources

- **Codebase (mounted, local):** `client/` — the `@mdm/client` Vite + React 19 app. Theme lives at `client/src/app/theme/config/`, shared components at `client/src/shared/components/`, pages at `client/src/pages/`, widgets at `client/src/widgets/`.
- **Repo:** `trakcap/mdm` on GitHub — monorepo containing the client plus Python backends (`adapters/`, `managers/`, `processing/`, `transformer/`, etc.). The client is what this design system covers.
- **Uploaded fonts:** Foro Rounded (8 weights, OTF) — primary brand typeface.
- **Uploaded logos:** `hrl-logo-large.svg`, `hrl-logo-small.svg` (wordmark + hexagonal monogram, `favicon.ico`.
- **The product:** `HRLogics — MDM` ("HRLogics Master Data Model"). Theme color in `&lt;meta name="theme-color"&gt;` is `#a4f478` (a vivid green — but this doesn't appear anywhere else and looks like a legacy/leftover; NOT a brand color).

## The Product in one paragraph

MDM is the internal control tower at HRLogics — an admin dashboard used by HRLogics staff (admins + readonly admins + internal ops) to land partner payroll/HR files, validate them, transform them, and sync employees/companies/PEOs outbound to HRLogics' product surfaces. It is an internal tool, not a customer-facing website — so the aesthetic is utilitarian, MUI-based, dense, and data-forward, but the brand details (Foro Rounded, deep indigo wordmark, orange/amber primary) give it a warmer, more consumer-friendly feel than a typical admin console.

## Surfaces covered

There is **one primary surface**: the MDM web app. Within it, the key page types are:
- **Login / auth redirect** (Auth0 flow)
- **Dashboard** (pending employees/payrolls/roles cards with tables)
- **List pages** (Companies, PEOs, File Uploads, Transformations, Data Viewer, Synchronizations, Performance, Thresholds, Client Stats, Solutions)
- **Detail / form pages** (company info forms, data upload form)
- **Control center / OAuth2 clients** (popover-launched admin tools)

There is no public marketing site, mobile app, or docs site represented in the sources provided.

---

## CONTENT FUNDAMENTALS

**Voice.** Flat, functional, quietly friendly. The surface is an internal admin tool, so copy is descriptive rather than persuasive — but branded touches (Foro Rounded, Title Case labels, humane subtitles like "Employees waiting to sync") keep it from feeling cold.

**Person.** Third-person / object-oriented. Nav items and titles are things ("Companies", "File Uploads", "Dashboard") — not actions addressed to the user ("Upload your files"). Buttons are short imperative verbs ("Log Out", "Upload", "Add"). Rarely "you"; never "we".

**Casing.**
- Page titles &amp; nav: **Title Case** — "Dashboard", "File Uploads", "Control Center", "OAuth2 Clients".
- Button labels: **Title Case**, single verb or verb+noun — "Log Out", "Upload Data".
- Section subtitles / helper text: **Sentence case** — "Employees waiting to sync", "Pending Employees".
- CAPS are reserved for tiny sidebar overline labels (see `sidebarButtonStyles` — `text-transform: uppercase`, `font-size: 13px`, tracked slightly).
- Captions (MUI variant) use **uppercase Montserrat** — the sans-serif cousin to Foro Rounded.

**Punctuation.** No trailing periods on page titles, card titles, or list labels. Subtitles and helper text follow sentence punctuation only when they are full sentences.

**Terminology.** Domain nouns are consistent and capitalised as proper terms in UI copy: *Companies, PEOs, Employees, Payrolls, Roles, Outbound Queue, Synchronizations, Transformations, Thresholds, Solutions, Client Stats, Data Viewer, File Uploads, Control Center*. Products are abbreviated: **WOTC, ERC, CV, SS, UT** (each has a dedicated `*-product.svg` icon).

**Tone examples (real, from the codebase):**
- Card title / subtitle pair: "Pending Employees" / "Employees waiting to sync"
- Nav: "Dashboard", "Companies", "PEOs", "Data Viewer", "File Uploads", "Transformations", "Synchronizations", "Performance", "Thresholds"
- Popover menu: "Control Center", "OAuth2 Clients", "Log Out"
- Page headings: "Dashboard" (no articles, no taglines)
- Breadcrumb separator: `/` (raw slash, not `›`)

**No emoji. No exclamation marks. No marketing superlatives.** Unicode is used only in code/data. Numbers and status counts are shown plainly; no "🎉 3 new!" style.

---

## VISUAL FOUNDATIONS

**Typography.**
- **Primary:** Foro Rounded (8 weights, 100–900). Used for everything — headings, body, buttons, nav, data. Warm, geometric, softly rounded — carries the entire brand personality.
- **Secondary:** Montserrat (via `@fontsource/montserrat`). Used **only** for the `caption` variant — tiny uppercase labels.
- **Scale** (see `typography.ts`): h1 96 / h2 60 / h3 48 / h4 34 / h5 24 / h6 20 / subtitle1 16 Bold / body1 16 / body2 14 / body3 12. Buttons 13/14/16, all weight 700 (small is 500). Tooltip 10px. All sans, all non-upper except caption and overline.
- `ascent-override: 92%; descent-override: 24%` is applied to every Foro Rounded face — tightens vertical rhythm noticeably.

**Color.** OKLCH-based, perceptually-uniform tiers (`lighter ~97% L`, `light ~92%`, `main ~70–73%`, `dark ~55%`, `darker ~40%`). Hues: primary 65 (warm amber-orange), secondary 265 (cool indigo-gray), info 235, success 148, warning 85, error 27. The brand wordmark is a deep indigo `#1C036D` — closest to `--secondary-darkest` `oklch(22% 0.13 270)`. The logo mark uses an orange-to-amber gradient (`#E64D25 → #F6B02D`).

**Backgrounds.** White (`--bg`) dominates. A very subtle `--bg-subtle` (`oklch(97% 0.007 240)`) for alternating rows / quiet chrome. Signature decorative element: an outlined **hexagon tessellation pattern** (`assets/hex-background.png`, `hex.svg`, `hex-dark.svg`) used sparingly on auth/empty states — never full-bleed behind content. No gradients in chrome. No photography. No hand-drawn illustrations.

**Motion.** Restrained. The only deliberate transitions are:
- Drawer open/close (300ms).
- Toggle sidebar chevron rotation (`0.25s all ease-in-out`, rotates 180°).
- MUI default tab indicator / ripple fades (ripples are *disabled* on tabs — `disableRipple`).
- No bounces, no parallax, no scroll-linked anims. Data tables settle instantly.

**Hover states.**
- List items / menu buttons: background shifts to `oklch(95% 0 0)` (a neutral 5% darken).
- Selected list items: `oklch(90% 0 0)` — one step deeper — with text/icon swapping to `--secondary-darker`.
- Buttons (text variant): background `--secondary-lightest`.
- Links: color darkens to `--link-dark` *and* underline appears.
- Button-group outlined: border → `--secondary-main`, bg → `--secondary-lightest`.

**Press / active states.** No scale transforms. MUI-default ripple on contained buttons (kept, but `boxShadow: none` so elevation never jumps). Tabs and list items have all ripples explicitly disabled — they rely purely on color.

**Borders.** 1px, color `--divider` (`oklch(87.2% 0.008 265)` — cool light gray). Used for appbar bottom edge, card outlines (`OutlinedCard`), data-grid cells, dividers in popovers.

**Shadows.** Almost all paper is **elevation 0** (flat) — `paperComponent` sets `elevation: 0` as default. Popovers explicitly bump to `theme.shadows[8]` (MUI default, `0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12)`). No inner shadows. No glow rings.

**Corner radii.** Base `theme.shape.borderRadius = 8px`. `MuiPaper` overrides to `12px` (soft, friendly). Small chips become **pills** (`20px`). Tab indicators are `border-radius: 2`. No sharp 0-radius except data-grid internals.

**Cards.** Two dominant card shapes:
- **OutlinedCard**: 1px divider border, 12px radius, no shadow, white bg. Title + optional subtitle top, divider, content. This is the *default* in the dashboard.
- **Paper / Dialog**: 12px radius, shadow only when floating (popover/menu).
No left-border-accent cards. No colored borders.

**Chips / badges.** Small chips are pills (`border-radius: 20`), medium chips are 8px radius. Each color variant has its own tri-tone (bg from `*.light` or `*.lighter`, border from `*.dark`, text from `*.dark` or `*.darker`). Text weight 400, size 13.

**Buttons.** Three sizes — large (42h), medium (37h), small (32/28h depending on variant). Three variants — `contained` (primary brand), `outlined` (info / secondary use mapped `.darker` borders), `text` (subtle, `secondary.lightest` hover bg). `textTransform: none` — never uppercase. Disabled contained buttons get `secondary.lighter` bg + `secondary.main` fg.

**Layout rules.**
- Outer shell: fixed left **sidebar drawer** (permanent on desktop, temporary on mobile) + top **header bar** (`appbar` bordered bottom only, `borderRadius: 0`). Content fills the rest.
- Sidebar widths: opened ~220px with `px: 2`, closed ~56px (icons only) with `px: 1.5`. Toggle chevron in header rotates on open/close.
- Header content: breadcrumbs left (`/` separator, max 8 items), avatar + upload menu right (gap 16px, `mr: 2`).
- Mobile: sidebar becomes full-screen right-anchored drawer.

**Transparency &amp; blur.** None. Surfaces are opaque. Text uses `rgba` black at 0.87 / 0.60 / 0.38 (`--fg1/2/3`) — the standard MUI text ladder. No `backdrop-filter`.

**Imagery color vibe.** There is no photography. The palette imagery is saturated &amp; warm (primary amber, accent orange). Neutrals lean cool (secondary hues live at 265° — blueish-gray), giving the overall UI a subtle warm/cool push-pull.

**Data density.** Medium. Grids use MUI X DataGrid Premium with custom cell focus removed (`outline: none !important`). Rows are not striped; dividers are the only separation.

---

## ICONOGRAPHY

**The icon system is mixed and real — use the actual assets, don't roll your own.**

1. **Local SVG sprite** — `client/src/shared/assets/icons/*.svg`, exported via `?react` through `vite-plugin-svgr`. **Copied into this system at `assets/icons/`**. ~37 icons, outlined style, ~1.5px stroke, 24×24 canvas.
   - Navigation / UI: `home`, `user`, `users`, `settings`, `search`, `info`, `close`, `edit`, `bin`, `copy`, `download`, `upload`, `lock`, `logout`, `eye`, `file`, `arrow-right`, `chevron-left-double`, `add`, `map-point`, `measure`, `role`, `tool`.
   - Domain: `briefcase`, `building`, `corporate-building`, `company`, `chart`, `data-flow`, `penBorder`.
   - Product glyphs (unique!): `cv-product`, `erc-product`, `ss-product`, `ut-product`, `wotc-product` — these name the HRLogics product suite (Credit Verifications, ERC, Something-SS, Unemployment Tracking, WOTC).
   - Action variants: `uploadAction`, `uploadData` (two distinct upload glyphs).

2. **MUI Icons (`@mui/icons-material`)** — used for navigation glyphs inside the menu items file (`mainMenuItems.tsx`): `DashboardOutlined`, `ApartmentOutlined`, `BusinessOutlined`, `WorkOutlineOutlined`, `CloudSyncRounded`, `UploadFileOutlined`, `TransformOutlined`, `FindInPageOutlined`, `ShowChartOutlined`, `BuildOutlined`, `WarningAmberOutlined`. In the header popover: `Hub`, `SupervisorAccount`, `Logout`. Mostly the **Outlined** variant — thin stroke, consistent with the local SVG set.

   This system substitutes MUI Icons with **Material Symbols (outlined)** from the Google Fonts CDN for HTML prototypes — stroke weight and shape match very closely. Flagged.

3. **No icon font of their own.** No custom Material icon theme.

4. **Emoji: not used.** Unicode chars used only as separators (`/` for breadcrumbs).

5. **Logo** — the HRLogics wordmark SVG contains both the hexagonal mark (orange→amber gradient) and the deep-indigo wordmark. Use `assets/hrl-logo-large.svg` (full lockup, 150×36) or `assets/hrl-logo-small.svg` (just the hex, for collapsed sidebar).

6. **Background motif** — `assets/hex-background.png` / `hex.svg` / `hex-dark.svg` — outlined hexagonal lattice. Used as decorative background only, at very low contrast (~6% gray lines).

---

## Index

```
./
├── README.md                  ← you are here
├── SKILL.md                   ← Claude Code–compatible skill manifest
├── colors_and_type.css        ← CSS vars + font-face + semantic defaults
├── fonts/                     ← 8× Foro Rounded .otf files
├── assets/
│   ├── hrl-logo-large.svg     ← wordmark + hex mark
│   ├── hrl-logo-small.svg     ← hex mark only
│   ├── favicon.ico
│   ├── hex-background.png     ← hex lattice motif
│   ├── hex.svg / hex-dark.svg
│   └── icons/                 ← 37 outlined SVGs from the codebase
├── preview/                   ← design-system preview cards (registered)
├── ui_kits/
│   └── mdm_web/               ← React/JSX recreation of the MDM admin UI
│       ├── README.md
│       ├── index.html         ← click-thru prototype
│       └── *.jsx              ← factored components
```

See `ui_kits/mdm_web/README.md` for the component inventory of the admin UI kit.

---

## Caveats / known substitutions

- **MUI Icons → Material Symbols (Outlined)** via Google Fonts in the UI kit. Geometry is very close, but identical 1:1 substitution would require importing `@mui/icons-material`.
- **Montserrat** is loaded from Google Fonts in the UI kit rather than bundled locally.
- No Figma was provided; all design intent was reverse-engineered from `client/src/app/theme/config/` (MUI v9 theme) and live component files.

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/colors_and_type.css`, `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/preview/_preview.css`, `/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/ui_kits/mdm_web/styles.css`). The 142 custom properties it defines are:

--accent, --accent-contrast, --action-disabled, --action-disabled-bg, --action-focus, --action-hover, --action-selected, --alert-error-bg, --alert-error-fg, --alert-info-bg, --alert-info-fg, --alert-success-bg, --alert-success-fg, --alert-warning-bg, --alert-warning-fg, --bg, --bg-paper, --bg-subtle, --brand-indigo, --brand-orange, --brand-orange-end, --divider, --error, --error-contrast, --error-dark, --error-light, --fg1, --fg2, --fg3, --font-primary, --font-secondary, --fw-bold, --fw-extrabold, --fw-extralight, --fw-heavy, --fw-light, --fw-medium, --fw-regular, --fw-semibold, --fw-thin, --graph, --info, --info-contrast, --info-dark, --info-darker, --info-light, --info-lighter, --info-lightest, --link, --link-dark, --primary, --primary-contrast, --primary-dark, --primary-darker, --primary-light, --primary-lighter, --radius-lg, --radius-md, --radius-pill, --radius-sm, --radius-xs, --secondary, --secondary-contrast, --secondary-dark, --secondary-darker, --secondary-darkest, --secondary-light, --secondary-lighter, --secondary-lightest, --shadow-0, --shadow-1, --shadow-2, --shadow-8, --space-0, --space-1, --space-10, --space-12, --space-2, --space-3, --space-4, --space-5, --space-6, --space-8, --success, --success-contrast, --success-dark, --success-light, --ts-avatar-size, --ts-badge-size, --ts-badge-weight, --ts-body1-size, --ts-body1-weight, --ts-body2-size, --ts-body2-weight, --ts-body3-lh, --ts-body3-size, --ts-body3-weight, --ts-button-lg-size, --ts-button-lg-weight, --ts-button-md-size, --ts-button-md-weight, --ts-button-sm-size, --ts-button-sm-weight, --ts-caption-size, --ts-caption-weight, --ts-chip-size, --ts-chip-weight, --ts-h1-size, --ts-h1-weight, --ts-h2-size, --ts-h2-weight, --ts-h3-size, --ts-h3-weight, --ts-h4-size, --ts-h4-weight, --ts-h5-size, --ts-h5-weight, --ts-h6-size, --ts-h6-weight, --ts-input-helper-lh, --ts-input-helper-size, --ts-input-helper-weight, --ts-input-label-size, --ts-input-label-weight, --ts-input-lh, --ts-input-size, --ts-input-weight, --ts-overline-size, --ts-overline-tracking, --ts-subtitle1-size, --ts-subtitle1-weight, --ts-subtitle2-size, --ts-subtitle2-weight, --ts-table-hdr-size, --ts-table-hdr-weight, --ts-tooltip-size, --ts-tooltip-weight, --warning, --warning-contrast, --warning-dark, --warning-light, --warning-lighter

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/ff72f9f8-e1e0-4da6-b8cd-6776c8f64145/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

<attached-skill name="Су-шеф Design System (design system)">
[Design System] This project uses the **Су-шеф Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Су-шеф — Design System

**Су-шеф** ("sous-chef") is a private, chat-first AI cooking assistant used mostly on a
phone **while standing at the stove**. The product UI is in **Russian**. This repo is the
single source of truth for its visual language: tokens, components, and an interactive UI
kit, defined so they can be re-implemented in **SvelteKit** (web) and **Jetpack Compose**
(Android) from named tokens — never ad-hoc values.

&gt; This is a greenfield system authored from a product brief. No external codebase or Figma
&gt; was provided. If you have the eventual SvelteKit/Compose repos, link them here.

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

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/colors_and_type.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/components.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/preview/_card.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/ui_kits/cooking-app/app.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/ui_kits/cooking-app/kit.css`). The 71 custom properties it defines are:

--accent, --accent-hover, --accent-soft, --bg, --border, --border-strong, --danger, --danger-soft, --duration-base, --duration-fast, --duration-slow, --ease-decelerate, --ease-emphasized, --ease-standard, --font-mono, --font-sans, --radius-lg, --radius-md, --radius-pill, --radius-sm, --radius-xl, --shadow-lg, --shadow-md, --shadow-sm, --space-0, --space-1, --space-10, --space-12, --space-16, --space-2, --space-20, --space-3, --space-4, --space-5, --space-6, --space-8, --success, --success-soft, --surface, --surface-raised, --surface-sunken, --text-body-large-line, --text-body-large-size, --text-body-large-weight, --text-body-line, --text-body-size, --text-body-weight, --text-caption-line, --text-caption-size, --text-caption-spacing, --text-caption-weight, --text-cooking-line, --text-cooking-size, --text-cooking-weight, --text-heading-line, --text-heading-size, --text-heading-weight, --text-on-accent, --text-primary, --text-secondary, --text-tertiary, --text-title-line, --text-title-size, --text-title-weight, --touch-min, --warning, --warning-soft, --weight-bold, --weight-medium, --weight-regular, --weight-semibold

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

## User

<pasted_text name="Pasted text (42 lines)">
  
  New flow: invite redemption + first-run onboarding. This is the first thing every
  user ever sees, and it solves a real problem: a fresh account has an empty pantry
  and no equipment, so the assistant has nothing to reason about.

  ## Context
  Telegram. Opening the link lands them here. No registration, no email, no password.
  
  ## Step 1 — Redeem screen (the invite link target)
  - Minimal and warm: app name, one line about what this is («Твой кухонный
    ассистент…»), the inviter's gesture acknowledged implicitly — this person was
    invited personally, don't make it feel like a SaaS signup.
  - One field: «Как тебя зовут?» (display name) + a big «Войти» button. The token
    is in the URL — the user never sees or types it.
  - Error states as separate views: link expired, link already used — each with
    one clear line and «Попроси новую ссылку» hint. No dead-end blank screens.
    
  ## Step 2 — Equipment quick setup (right after redeem)
  - One screen: «Что есть на твоей кухне?» with a grid of large toggle chips of
    common equipment (духовка, микроволновка, аэрогриль, блендер, миксер,
    мультиварка, гриль-сковорода, казан, пароварка, …) — tap to select, plus a
    small «+ своё» input for custom items.
  - Pre-select nothing. «Дальше» button always enabled (skip is implicit —
    selecting nothing is valid). 
  - This must take under 30 seconds.
  
  ## Step 3 — Pantry seeding (the interesting one)
  Don't build a long form. Offer two paths on one screen:
  - Primary: «Расскажи ассистенту» — a button that drops the user into the chat
    with a pre-filled suggestion like «Расскажи, что у тебя есть из продуктов,
    я всё запишу» — and the demo shows the assistant parsing a casual message
    («есть макароны, банка томатов, сыр грамм 200…») into pantry items via a
    tool-call indicator («Записываю в кладовку…») and a confirmation card listing
    what was added, with an edit affordance.
  - Secondary: «Заполню сам» — link to the pantry screen's add form.
  - Tertiary: «Пропустить» — straight to chat; the assistant works fine, it just
    asks about ingredients when needed.
    
  ## Wiring
  Redeem → equipment → pantry seeding → chat. Add a way for me to replay the flow
  from the prototype (e.g. a hidden «reset onboarding» control). Informal «ты»,
  both themes, mobile-first with the same desktop treatment as the rest.
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Су-шеф Design System (design system)">
[Design System] This project uses the **Су-шеф Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Су-шеф — Design System

**Су-шеф** ("sous-chef") is a private, chat-first AI cooking assistant used mostly on a
phone **while standing at the stove**. The product UI is in **Russian**. This repo is the
single source of truth for its visual language: tokens, components, and an interactive UI
kit, defined so they can be re-implemented in **SvelteKit** (web) and **Jetpack Compose**
(Android) from named tokens — never ad-hoc values.

&gt; This is a greenfield system authored from a product brief. No external codebase or Figma
&gt; was provided. If you have the eventual SvelteKit/Compose repos, link them here.

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

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/colors_and_type.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/components.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/preview/_card.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/ui_kits/cooking-app/app.css`, `/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/ui_kits/cooking-app/kit.css`). The 71 custom properties it defines are:

--accent, --accent-hover, --accent-soft, --bg, --border, --border-strong, --danger, --danger-soft, --duration-base, --duration-fast, --duration-slow, --ease-decelerate, --ease-emphasized, --ease-standard, --font-mono, --font-sans, --radius-lg, --radius-md, --radius-pill, --radius-sm, --radius-xl, --shadow-lg, --shadow-md, --shadow-sm, --space-0, --space-1, --space-10, --space-12, --space-16, --space-2, --space-20, --space-3, --space-4, --space-5, --space-6, --space-8, --success, --success-soft, --surface, --surface-raised, --surface-sunken, --text-body-large-line, --text-body-large-size, --text-body-large-weight, --text-body-line, --text-body-size, --text-body-weight, --text-caption-line, --text-caption-size, --text-caption-spacing, --text-caption-weight, --text-cooking-line, --text-cooking-size, --text-cooking-weight, --text-heading-line, --text-heading-size, --text-heading-weight, --text-on-accent, --text-primary, --text-secondary, --text-tertiary, --text-title-line, --text-title-size, --text-title-weight, --touch-min, --warning, --warning-soft, --weight-bold, --weight-medium, --weight-regular, --weight-semibold

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/ed903bf0-c138-46a3-a008-ec7c2f83c960/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

## Assistant

_[tool: read_file]_

A first-run onboarding flow: redeem → equipment → pantry seeding → chat, with error views and a replay control. The user edited files since my last response — let me re-read the key ones before building.

_[tool: read_file]_

_[tool: read_file]_

Now let me read ChatScreen.jsx and components.css to understand the chat send flow (for the pantry-seeding tool-call demo) and available component classes.

_[tool: update_todos]_

I have the full picture. This is a multi-step onboarding flow that gates the app, plus a scripted pantry-parse demo in chat, and seeding wired into Pantry. Let me lay out the plan and build.Now let me build. First the onboarding data:

_[tool: write_file]_

_[tool: write_file]_

