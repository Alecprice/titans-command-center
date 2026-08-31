# Retired Neon warehouse

> Historical document. Neon Postgres is **not** part of the Titans Command Center production data runtime anymore.

## Current state

Production data storage is Cloudflare D1 through the `TITANS_DB` binding. The former Postgres warehouse adapter (`src/db.mjs`) and `@neondatabase/serverless` package were removed after the D1 cutover was proven in production.

Current production code must not require, read, or upload `DATABASE_URL`. Bootstrap data, account preferences, materialized fan/player/analytics snapshots, sync audits, and scheduled reconciliation writes use D1 or the explicitly documented audited fallback behavior.

## Neon Auth is separate

The account authentication proxy still talks to the existing Neon Auth HTTP service. That dependency is intentionally isolated from data persistence:

- public browsing remains guest-first;
- `/api/account/auth/*` is a narrow same-origin proxy;
- preference data is stored in D1, not Neon Postgres;
- an auth-provider outage must degrade guest session lookup safely and keep sign-in failures fail-closed;
- restoring a Postgres `DATABASE_URL` is not an auth recovery mechanism.

Authentication may be migrated to Better Auth + D1 in a later, separate phase.

## Historical Postgres artifacts

The former Postgres schema, seed, and migration files were removed from the active working tree after the D1-only runtime was proven in production. Their historical contents remain available in Git history for archaeology or migration review; they are not shipped as current schema instructions.

Current portable schema changes belong only under `db/d1/migrations/`. Do not recreate `db/schema.sql`, `db/seed.sql`, or `db/migrations/` as an application rollback path.

## Historical architecture

Before the D1 migration, the application used a normalized Neon/Postgres warehouse for roster, schedule, transactions, source audits, analytics, and account preference storage. That architecture was replaced in staged TENX cutovers so each public read/write plane could be verified on D1 before the warehouse runtime was removed.

This file remains only to preserve that migration context. For current operations use:

- `README.md`
- `docs/CLOUDFLARE_DEPLOY.md`
- `docs/CLOUDFLARE_D1_MIGRATION.md`
- `db/d1/migrations/`
