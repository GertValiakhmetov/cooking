# Cooking Assistant

Private, invite-only AI cooking assistant. See [`CLAUDE.md`](./CLAUDE.md) for the build contract and [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md) for the full spec.

## Local development (backend)

```bash
pnpm install

# start local Postgres (named volume, survives restarts)
docker compose -f infra/docker-compose.yml up -d db

# apply schema
pnpm --filter @cooking/backend db:migrate

# run the API (http://localhost:8080)
pnpm --filter @cooking/backend dev
```

### Auth (v1: invite tokens, no email)

Mint an invite link for a friend, then send it to them out-of-band (e.g. Telegram):

```bash
pnpm --filter @cooking/backend invite friend@example.com "Имя Друга"
```

They open the link; the client redeems the token (`POST /auth/redeem`) for a long-lived JWT.

> Talking to Claude requires `ANTHROPIC_API_KEY` (pay-as-you-go) in the backend env. Everything else (auth, warehouse CRUD, schema, tests) works without it.

## Checks

```bash
pnpm --filter @cooking/backend typecheck   # tsc --noEmit
pnpm --filter @cooking/backend test         # vitest
pnpm lint                                    # biome
```
