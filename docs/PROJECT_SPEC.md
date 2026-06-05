# Cooking Assistant — Project Specification

> Source of truth for the project. Read together with `CLAUDE.md`, which is the operating manual for Claude Code in this repository.
>
> Status: **draft v0.2** · Last updated: 2026-06-04

---

## 1. Overview

An AI-powered cooking assistant for a small private group (the author and a few friends). The assistant behaves like Claude focused on the cooking domain: free-form chat, on-demand **structured recipe generation** (ingredients, steps, notes), and a personal **warehouse** of the user's pantry ingredients and kitchen equipment that the assistant is aware of and reasons over.

**Primary use case:** consulting the assistant on a phone *while cooking at the stove*. Web first, native **Android** second, native **iOS** later.

This is not a public product. It is a closed, invite-only tool. Decisions favour simplicity of operation by a single maintainer over scale.

---

## 2. Goals and non-goals (v1)

**Goals**
- Free-form, streaming chat with a cooking-focused assistant.
- Generate recipes as structured data the clients render natively.
- Maintain a per-user warehouse: ingredients (consumables) and equipment (durable).
- Answer "what can I make right now?" using the user's warehouse.
- Run entirely on self-hosted infrastructure (Timeweb), no managed PaaS required.
- Be cheap and safe to operate for a handful of users.

**Non-goals (v1)**
- Public sign-up, billing for end users, or multi-tenant org features.
- Grocery ordering / store integrations.
- Nutrition tracking, calorie counting, or meal-plan scheduling (possible later).
- Offline mode.
- Voice and photo-of-ingredients input (candidate for a later phase).

---

## 3. Users and access

- **Audience:** the maintainer plus invited friends (order of ~10 users, not thousands).
- **Access model:** invite-only. No open registration. Access is granted by the maintainer minting a single-use **invite token** per person (no email delivery / allowlist needed in v1).
- **Data isolation:** every warehouse item, recipe, and conversation is owned by exactly one user. A user can only ever read or mutate their own data. This ownership check is mandatory on every authenticated endpoint and every tool handler.

---

## 4. Core features

### 4.1 Conversational assistant
- Free-form chat. Responses **stream token-by-token** to the client (see §7.4).
- The assistant is aware of the user's equipment (always) and can look up ingredients on demand (via tools, see §7.3).
- Conversation history is persisted so a session can be resumed.

### 4.2 Recipe generation (structured)
- When the user asks for a recipe, the assistant returns a **structured recipe object** (see schema in §7.5), not free-form prose.
- Clients render it natively (ingredient list, scalable servings, ordered steps, notes).
- A generated recipe can be **saved** to the user's recipe collection.
- A recipe can be **checked against the warehouse**: which ingredients the user already has, and what is missing.
- **Ingredient matching is model-led.** The assistant reasons over the inventory it fetched via tools (handling synonyms, rough amounts, "to taste"). The server-side `/recipes/:id/check` is a **best-effort** name/unit diff for display only — v1 does not attempt full unit conversion or synonym resolution.

### 4.3 Warehouse (pantry + equipment)
Two distinct concepts, modelled and used differently:

- **Ingredients (consumables):** change often, have quantity + unit, may have an expiry. Constrain *what* can be cooked. Can be large; fetched on demand via tools.
- **Equipment (durable):** pans, pots, oven, air fryer, blender, etc. Stable and small. Constrains *how* one can cook (no oven → no roasting). Summarised compactly into the system prompt so it is always in context.

The user can list, add, update, and remove items in both categories from any client.

### 4.4 "What can I make?"
Falls out of 4.2 + 4.3: the assistant reads the current ingredients (tool call) and the equipment (system prompt), proposes dishes achievable with what is on hand, and flags anything that would need to be bought.

---

## 5. Architecture

Three layers. All clients are **thin** and talk to a **fat backend** over HTTPS (JSON + SSE). The backend is the only component that talks to Claude and the only owner of the database. All domain logic (prompts, tool definitions, recipe schema, warehouse rules) lives server-side **once**, so maintaining multiple native clients stays cheap.

```
Clients (thin, native)            Timeweb (your server)              External
  - Web    (SvelteKit)   ──┐
  - Android(Compose)     ──┼── HTTPS+SSE ──▶  Caddy (TLS, reverse proxy)
  - iOS    (later)       ──┘                       │
                                                   ▼
                                            Backend API (TS/Node)
                                            auth · chat(SSE) · tools · recipes
                                              │                     │
                                              ▼                     ▼
                                           Postgres            Claude (Messages API)
```

**Stack**

| Layer            | Choice                              | Notes                                   |
|------------------|-------------------------------------|-----------------------------------------|
| Backend          | TypeScript / Node, **Hono**         | Fastify is an acceptable alternative    |
| DB               | **PostgreSQL**, Drizzle ORM         |                                         |
| Web client       | **SvelteKit** (TS)                  | Swappable for Next.js/React if preferred|
| Mobile (1st)     | **Android** — Kotlin + Jetpack Compose |                                      |
| Mobile (later)   | iOS — SwiftUI                       | Same backend, same API contract         |
| AI               | Claude via `@anthropic-ai/sdk`      | Pay-as-you-go API billing               |
| Reverse proxy/TLS| **Caddy**                           | Automatic HTTPS                         |
| Packaging        | Docker + Docker Compose             | Optional: Coolify for git-push deploys  |
| Host             | Timeweb Cloud VPS                   |                                         |

---

## 6. Data model (PostgreSQL)

Simplified. Final column types/constraints live in the Drizzle schema. All tables that hold user data carry `user_id` and are queried scoped to the authenticated user.

```
users
  id            uuid pk
  email         text unique
  display_name  text
  created_at    timestamptz

inventory_items            -- ingredients / consumables
  id            uuid pk
  user_id       uuid fk -> users.id
  name          text                 -- e.g. "eggs", "olive oil"
  quantity      numeric null
  unit          text null            -- g, ml, pcs, ...
  category      text null            -- dairy, produce, spice, ...
  expires_on    date null
  created_at    timestamptz
  updated_at    timestamptz

equipment                  -- durable cookware / appliances
  id            uuid pk
  user_id       uuid fk -> users.id
  name          text                 -- "cast-iron pan", "air fryer"
  type          text                 -- pan | pot | oven | appliance | tool | ...
  attributes    jsonb null           -- { sizeCm, watts, ... }
  created_at    timestamptz

recipes
  id            uuid pk
  user_id       uuid fk -> users.id
  title         text
  servings      int
  total_minutes int null
  ingredients   jsonb                -- RecipeIngredient[] (see §7.5)
  steps         jsonb                -- RecipeStep[]
  notes         jsonb                -- string[] (default '[]', never null)
  source        text                 -- "ai" | "manual"
  created_at    timestamptz

conversations
  id            uuid pk
  user_id       uuid fk -> users.id
  title         text null
  created_at    timestamptz
  updated_at    timestamptz

messages
  id            uuid pk
  conversation_id uuid fk -> conversations.id
  role          text                 -- "user" | "assistant" (tool_result rides under the user role)
  content       jsonb                -- raw Anthropic content blocks: text + tool_use + tool_result
  created_at    timestamptz
```

**Conversation replay.** `messages.content` stores the **raw Anthropic content blocks** (text, `tool_use`, `tool_result`) so history can be replayed to the model faithfully; the client-facing view is derived from these. Stale inventory tool_results are **not** replayed — inventory is live data, so they are dropped and the model re-fetches via tools when needed (see §7.6).

---

## 7. Claude integration

### 7.1 Billing / access (important)
The runtime uses an **Anthropic API key with pay-as-you-go API billing**, not subscription credentials. This is the supported path for a multi-user app. The key lives **only** on the backend (env), never in any client. (Anthropic restricted third-party/subscription access in April 2026 and split programmatic usage onto metered credits from June 15, 2026 — API billing sidesteps both.)

### 7.2 Model selection
- Main assistant + recipe generation: **`claude-sonnet-4-6`** (good quality/cost balance).
- Cheap/fast paths (e.g. short classification, title generation): **`claude-haiku-4-5-20251001`**.
- Model IDs are read from env (`ANTHROPIC_MODEL`, `ANTHROPIC_MODEL_CHEAP`) so they can be changed without code edits. Confirm current model IDs in the docs before launch (see §13).

### 7.3 System prompt + tools
- **System prompt** = assistant persona/instructions **+ a compact summary of the user's equipment**. Equipment is small and almost always relevant, so it stays in context. Mark the stable prefix with **prompt caching** to cut cost.
- **Persona & locale (system prompt):** a concise, practical cooking assistant — short answers and clear numbered steps (optimised for reading at the stove), expanding detail on request. Speaks **Russian** by default; recipes use **metric units and °C**.
- **Ingredients are exposed via tool use (function calling)**, fetched only when relevant rather than dumped into every request.

Planned tools (names indicative):

| Tool                    | Purpose                                                  |
|-------------------------|----------------------------------------------------------|
| `get_inventory`         | Return the user's current ingredients                    |
| `search_inventory`      | Look up whether/how much of an ingredient is on hand     |
| `add_inventory_item`    | Add an ingredient                                        |
| `update_inventory_item` | Change quantity/unit/expiry                              |
| `remove_inventory_item` | Remove an ingredient (or mark used up)                   |
| `get_equipment`         | Return equipment (also summarised in system prompt)      |
| `present_recipe`        | Emit a recipe as the structured schema (§7.5)            |
| `save_recipe`           | Persist a recipe to the user's collection                |

Every tool handler runs **scoped to the authenticated user** and validates its input with Zod.

### 7.4 Streaming
- Chat responses stream end-to-end: backend calls the Messages API with streaming and **proxies the token stream to the client over SSE**. The backend must not buffer the full response before replying.
- **Tool-use loop.** The model may pause mid-turn to call a tool; the backend runs it (user-scoped, Zod-validated), feeds the result back, and continues with another streamed request — repeating until the model emits its final answer. This all happens inside one `/chat` SSE connection.
- **SSE event taxonomy:** distinct event types — `text` (token delta), `tool` (a tool call started/finished, so the client can show "checking your pantry…"), `recipe` (a validated `Recipe` object, emitted as one block), `error`, `done`.
- **A recipe is not token-streamed.** It arrives as the input to `present_recipe` (partial JSON) and is emitted only once complete and Zod-validated. Prose streams token-by-token; the recipe pops in as a finished structured block. Consistent with "stream, don't buffer", which governs chat *text*.
- A long-lived Node server (Timeweb) is well suited to holding streaming connections.

### 7.5 Recipe schema
Recipes are structured data, validated by a Zod schema on the backend.

```ts
type RecipeIngredient = {
  name: string;
  amount: number | null;   // null for "to taste"
  unit: string | null;     // g, ml, tsp, pcs, ... (null for countable/to-taste)
};

type RecipeStep = {
  title: string;           // short label, e.g. "Sear the chicken"
  content: string;         // full instruction
  timerSeconds: number | null;
};

type Recipe = {
  title: string;
  servings: number;
  totalMinutes: number | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  notes: string[];
};
```

The assistant returns recipes through the `present_recipe` tool (or equivalent structured output) so the backend can validate, persist, scale servings, and diff against the warehouse — without parsing prose.

### 7.6 Context management & cost
Conversation history is replayed to Claude on every turn, so unbounded history means unbounded cost. Controls:
- **Prompt caching** covers the stable system prefix (persona + equipment summary), so the bulk of fixed tokens are cached. The cache is short-lived (minutes) and per-user (each equipment summary differs), so hit rate tracks usage frequency — a real saving, not a guarantee.
- **Don't replay stale tool results.** Inventory fetched via `get_inventory`/`search_inventory` is live data; old results are dropped from the replayed history and the model re-fetches when needed. This also keeps large inventory dumps out of every subsequent turn.
- **Trim or summarize** turns beyond a threshold so long at-the-stove sessions don't grow without bound.

---

## 8. Backend API (contract)

All endpoints are authenticated except where noted. Request/response bodies are JSON and validated with Zod. `POST /chat` streams via SSE; everything else is plain JSON.

```
Auth
  POST   /auth/redeem              { token }            -> { jwt }   (public; redeems an invite)
  GET    /auth/me                                        -> current user
  # invites minted by the maintainer via backend CLI (`invite <email>`) — no email/registration in v1
  # email magic-link is a later drop-in that reuses the same token -> JWT flow (see §9)

Chat
  POST   /conversations                                  -> new conversation
  GET    /conversations                                  -> list
  GET    /conversations/:id/messages                     -> history
  POST   /chat            { conversationId, message }    -> SSE token stream
                                                            (may include tool calls
                                                             and a structured recipe)

Inventory (ingredients)
  GET    /inventory
  POST   /inventory                { name, quantity?, unit?, category?, expiresOn? }
  PATCH  /inventory/:id
  DELETE /inventory/:id

Equipment
  GET    /equipment
  POST   /equipment                { name, type, attributes? }
  PATCH  /equipment/:id
  DELETE /equipment/:id

Recipes
  GET    /recipes
  GET    /recipes/:id
  POST   /recipes                  { ...Recipe, source }   -> save
  DELETE /recipes/:id
  POST   /recipes/:id/check        -> diff against current inventory (have / missing)
```

---

## 9. Auth and security

- **Auth (v1): invite tokens, no email.** The maintainer mints a single-use **invite token** per friend (backend CLI) and shares the redeem link out-of-band (e.g. Telegram). The client redeems it (`POST /auth/redeem`) for a **long-lived JWT session** (~30 days), so no one re-authenticates mid-cooking; the invite token is single-use and expires (~7 days) if unredeemed. Issuing the invite *is* the access gate — no open registration, no allowlist. **Email magic-link** (Resend + domain) is kept as a later drop-in upgrade (§10) that reuses the same token→JWT machinery, just delivered by email.
- **API key:** `ANTHROPIC_API_KEY` is backend-only. It must never appear in the web bundle, the Android app, or any client-visible config.
- **No direct model calls from clients.** All Claude traffic goes through the backend.
- **CORS:** the web client calls the API cross-origin, so restrict CORS to the known web origin(s) (`CORS_ORIGIN`). Native apps are unaffected.
- **Ownership checks** on every authenticated endpoint and tool handler (a user only ever touches their own rows).
- **Rate limiting** per user on chat and write endpoints, to bound API spend. At this scale an **in-memory limiter on the single backend instance is sufficient — no Redis**.
- **Spend cap** configured in the Anthropic Console as a backstop.
- **Secrets** via env / Docker secrets; `.env` is git-ignored and never committed.

---

## 10. Hosting and infrastructure (Timeweb)

- **Timeweb Cloud VPS** running everything via **Docker Compose**: backend container + Postgres container + Caddy. Postgres data lives on a **named Docker volume** (never inside the container layer) so it survives redeploys.
- **Caddy** terminates TLS and reverse-proxies to the backend (automatic HTTPS via Let's Encrypt).
- **Egress to the Anthropic API — deploy in a Timeweb EU region.** The backend's one hard external dependency is reaching `api.anthropic.com`. **Russia is not an Anthropic-supported region** (verified 2026-06-04 against `anthropic.com/supported-countries`; Belarus is also excluded), so a backend in a Russian DC cannot reach the Claude API. Timeweb's EU locations — **Germany, Netherlands, Poland** — are supported; deploy there. (Account eligibility / payment method is a separate matter handled on the Anthropic side.)
- **Optional:** run **Coolify** on the VPS for Vercel-like `git push` deploys without a managed PaaS.
- **Backups:** scheduled `pg_dump` (warehouse + recipes are real, irreplaceable data) to off-box storage.
- **Web** is served behind Caddy on the same box (or its own container). Pick a SvelteKit adapter up front: `adapter-node` (SSR) or `adapter-static` (SPA) — both work since the API is a separate service.
- **Email (later, unused in v1):** auth is invite-token based, so no email provider is needed yet. If magic-link is enabled later, add an email provider (Resend default; swappable) and keep its key in env / Docker secrets.

---

## 11. Milestones / phasing

**Phase 1 — Backend core (~80% of the value, shared by all clients)**
- **Walking skeleton first:** auth → one conversation → streaming chat → one tool (`get_inventory`) → one `present_recipe`, working end-to-end, *before* the full CRUD. De-risks the hardest integration (streaming + the tool-use loop) in week one.
- Project skeleton, Postgres + Drizzle migrations, auth.
- Claude integration: streaming chat over SSE, tool framework, warehouse tools, `present_recipe` + recipe schema, prompt caching.
- Inventory / equipment / recipes CRUD.
- Rate limiting + spend guardrails.

**Phase 2 — Web client (SvelteKit)**
- Chat UI with streaming, recipe rendering, warehouse management screens.
- Fastest surface to validate UX.

**Phase 3 — Android client (Kotlin + Compose)**
- Same API contract; optimised for the at-the-stove use case (large text, readable steps, timers).

**Later**
- iOS (SwiftUI), voice and photo-of-ingredients input, nutrition/meal planning.

---

## 12. Decisions log

- **Backend language:** TypeScript / Node. (decided)
- **First mobile platform:** Android (Kotlin + Jetpack Compose). (decided)
- **Hosting:** self-hosted on Timeweb; no Vercel. (decided)
- **Client strategy:** native per platform (no cross-platform), enabled by a fat backend + thin clients. (decided)
- **AI billing:** pay-as-you-go API key, not subscription. (decided)
- **Backend framework:** Hono (default) — revisit vs Fastify if needed. (proposed)
- **Web framework:** SvelteKit (default) — swappable. (proposed)
- **DB toolkit:** Drizzle ORM. (proposed)
- **Auth (v1):** invite tokens minted by the maintainer (CLI), redeemed for a JWT; no email/registration. Email magic-link deferred as a later drop-in. (decided)
- **Token lifetimes:** invite/redeem token single-use (~7 days to redeem); JWT session ~30 days. (decided)
- **Ingredient ↔ recipe matching:** model-led; server `/recipes/:id/check` is best-effort display only in v1 (no unit conversion / synonym resolution). (decided)
- **Rate limiting:** in-memory per-user on the single instance; no Redis in v1. (decided)
- **Conversation persistence:** store raw Anthropic content blocks (text/tool_use/tool_result); stale inventory tool_results dropped on replay. (decided)
- **Streaming contract:** prose streams as `text` SSE events; a recipe is emitted as one validated `recipe` block, not token-streamed. (decided)
- **Deploy region:** Timeweb **EU** location (Germany / Netherlands / Poland) — Russia is not an Anthropic-supported API region (verified 2026-06-04). (decided)
- **Aeza rejected as provider:** OFAC-sanctioned (SDN list, 2025-07-01) bulletproof host actively evading sanctions — incompatible with reliably/legitimately reaching the US-based Anthropic API. (decided)
- **Language & units:** Russian by default (assistant, recipes, UI); metric + °C. (decided)
- **Assistant persona:** concise/practical — short answers, clear steps, at-the-stove friendly; elaborates on request. (decided)
- **Brand & design system:** «Су-шеф»; tokens/components/UI kit live in `docs/design-system/` (Claude Design handoff, 2026-06-04). Web and Android implement its named semantic tokens — no ad-hoc values. (decided)
- **Voice details:** assistant addresses the user as «ты»; UI chrome contains no emoji (per design guide), the assistant's chat text may use them sparingly. (decided)
- **Claude Agent SDK rejected:** evaluated migrating off the Messages API (motivation: spending a Max-subscription agent-credit pool). Rejected — official guidance for app backends with custom DB tools is Messages API + tool use; subscription credits cover the owner's own agent usage, not multi-user apps (§7.1 stands); prod API cost is negligible at our scale. Subscription credits are spent on development tooling (Claude Code) instead. (decided)

---

## 13. References

- Claude API overview: https://docs.claude.com/en/api/overview
- API docs map (tool use, streaming, prompt caching, models): https://docs.claude.com/en/docs_site_map.md
- Claude Code overview: https://docs.claude.com/en/docs/claude-code/overview

> Confirm current model IDs and SDK details against the docs above before launch — model names and limits change over time.
