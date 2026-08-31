# Titans Command Center — completed pre-cutover record

> Historical migration record. The Cloudflare cutover described here is complete; this is not the current deployment runbook.

Titans Command Center now deploys from GitHub `main` to Cloudflare Worker + Static Assets with Cloudflare D1 as the production data authority. The former Vercel/Neon warehouse rollback path is retired.

## Gate that completed the cutover

The migration required the exact deployed Git revision to pass production API and browser checks before Cloudflare could be treated as authoritative. That release-gate philosophy remains active today and now covers:

- static/PWA asset integrity and exact `build-meta.json` SHA;
- security headers and service-worker behavior;
- D1-authoritative health and bootstrap truth;
- D1/audited preseason roster provenance;
- Player, Fan Intel and Advanced Analytics data truth;
- navigation, Listen/Watch, Market Pulse, Command Intelligence, Player/Game Day, Ask Titans, Change Intelligence, 365 Mode, freshness, Account/Guest, analytics and headshots.

## Current architecture

```text
GitHub main
    ↓
GitHub Actions
    ↓
Cloudflare Worker + Static Assets
    ↓
Cloudflare D1 (TITANS_DB)
```

Neon Auth remains temporarily as an isolated authentication HTTP service. It is not the production database and does not require `DATABASE_URL`.

## Historical rollback note

During the original host migration, Vercel and Neon were retained briefly as rollback insurance. That rollback is no longer supported: production must not restore the retired Postgres adapter, `@neondatabase/serverless`, or `DATABASE_URL`.

For current operations use `docs/CLOUDFLARE_DEPLOY.md`. For the completed data migration state use `docs/CLOUDFLARE_D1_MIGRATION.md`.
