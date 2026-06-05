---
name: sushef-design
description: Use this skill to generate well-branded interfaces and assets for Су-шеф (Sous-chef), a chat-first AI cooking assistant (Russian-language mobile app), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

Key files:
- `colors_and_type.css` — all design tokens (color light+dark, type scale, spacing, radii, elevation, motion). Import this first.
- `components.css` — reusable component classes built on the tokens.
- `ui_kits/cooking-app/` — interactive React UI kit (chat, pantry, recipes, cooking mode) with a theme toggle; reuse its JSX components.
- `preview/` — token + component specimen cards.
- `assets/ICONOGRAPHY.md` — icon system (Lucide) and brand-mark guidance.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and
create static HTML files for the user to view. If working on production code, copy assets and
read the rules here to become an expert in designing with this brand.

Core rules to honor: Russian copy in sentence case with formal-friendly «вы»; warm calm
palette with paprika accent; one workhorse font (Golos Text) + JetBrains Mono for numerals;
≥48px touch targets and full-width primary actions; dark theme is first-class; Lucide line
icons, never emoji; subtle motion (only streaming text + timers feel alive).

If the user invokes this skill without any other guidance, ask them what they want to build or
design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.
