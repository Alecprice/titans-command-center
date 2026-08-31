# Cloudflare D1 migration

## Status

**Production data cutover is complete.** Titans Command Center now runs its production data plane on Cloudflare D1 through the `TITANS_DB` binding.

The staged migration removed the former request-time and scheduled-write dependence on Neon Postgres, then deleted the Neon warehouse runtime adapter and `@neondatabase/serverless` package after production verification. The retired Postgres schema, seed, and migration files were subsequently removed from the active working tree; Git history preserves them for historical review.

## Current production data plane

```text
GitHub main
    ↓
GitHub Actions quality + release gates
    ↓
Cloudflare Worker + Static Assets
    ↓
Cloudflare D1 (TITANS_DB)
```

D1 currently owns:

- `bootstrap:v1` and other API snapshots;
- signed-in `fan_user_preferences`;
- Fan Intel materialized snapshots;
- Player Profile materialized snapshots;
- Advanced Analytics nflreadpy materialized snapshots;
- scheduled source-audit records;
- bounded final-score reconciliation writes.

Public APIs use fresh D1, documented stale-D1 behavior where allowed, or explicit audited/unavailable states. They do not open a Postgres connection as a fallback.

## Current schema

The portable production schema lives under:

```text
db/d1/migrations/
```

Apply it remotely with:

```bash
npm run d1:migrate
```

The configured production database is named `titans-command-center` and is bound to the Worker as `TITANS_DB` in `wrangler.jsonc`.

There is no active `db/schema.sql`, `db/seed.sql`, or `db/migrations/` Postgres tree. Those retired artifacts remain recoverable from Git history only and must not be restored as a production rollback mechanism.

## Analytics materialization

Advanced Analytics is built outside the request path:

```text
nflreadpy + Polars
      ↓
compact API snapshot builder
      ↓
D1 api_snapshots
      ↓
Cloudflare Worker
      ↓
Stats Lab
```

The workflow requires complete snapshot coverage before publishing so a partial league bundle cannot replace the last good D1 state. nflverse provider team codes are normalized at the provider boundary before calculations.

## Bootstrap and resilience

`/api/data` uses the D1 bootstrap snapshot first. If a usable snapshot is unavailable, the API may serve the repository's dated audited fallback where that contract explicitly allows it. Health remains D1-authoritative and does not call a warehouse fallback.

Fan Intel, Player Profile, and Advanced Analytics similarly own their D1 snapshot/fallback behavior directly. Missing data never authorizes invented metrics or facts.

## Authentication remains a separate phase

Neon Auth still provides the managed authentication HTTP service behind `/api/account/auth/*`. This is intentionally separate from the retired Neon Postgres warehouse:

- account preference persistence is already D1-only;
- `DATABASE_URL` is not required for authentication;
- `@neondatabase/serverless` is not present;
- auth migration can be handled later without reopening a second production database path.

A future phase may replace Neon Auth with Better Auth + D1 while preserving the current frontend endpoint contract.

## Deployment secrets

The Cloudflare deployment requires the Cloudflare API token/account ID. Optional media/market integrations may have their own server-only credentials. The deployment workflow does **not** require or upload `DATABASE_URL`.

## Free-tier operating model

The application uses central scheduled refreshes, materialized snapshots, and Cloudflare cache rather than per-user database polling. This keeps request-time database work bounded and avoids copying raw play-by-play data into D1 when compact derived snapshots are sufficient.

## Rollback policy

The old Postgres rollback path has been intentionally retired. Production must not regain warehouse access by toggling an environment flag, restoring `DATABASE_URL`, or restoring the retired Postgres schema files.

If a D1-backed feature fails, the supported recovery path is to repair the D1 binding/data/materializer or use the explicit audited/unavailable behavior already defined by that API—not to reconnect the retired warehouse.
