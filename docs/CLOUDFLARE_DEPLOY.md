# Cloudflare deployment runbook

Cloudflare Worker + Static Assets is the active Titans Command Center production host. Cloudflare D1 is the production data authority.

## Production architecture

- GitHub `main`: source of truth
- GitHub Actions: quality and release gates
- Cloudflare Workers + Static Assets: public app and `/api/*`
- Cloudflare D1 `TITANS_DB`: production persistence and materialized API snapshots
- Neon Auth: temporary, isolated authentication HTTP service only
- Vercel configuration: legacy/non-authoritative

Static HTML/CSS/JS/assets are served through Cloudflare's asset layer. `/api/*` is routed through Worker compute.

## Build locally

```bash
npm install
npm run check
npm run build:cloudflare
```

`dist/` is generated and intentionally ignored by Git.

## GitHub Actions deployment

`.github/workflows/cloudflare-deploy.yml` deploys changes from `main` after the complete Titans quality gate succeeds. Deployment requires repository secrets for:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token must have the Worker/D1 permissions required by the configured workflows.

Optional provider secrets are bundled only when configured. `DATABASE_URL` is not read, required, or uploaded.

## D1

The production database is configured in `wrangler.jsonc` as the `TITANS_DB` binding.

Apply the checked-in D1 schema with:

```bash
npm run d1:migrate
```

Current migrations live under `db/d1/migrations/`. Legacy files under `db/migrations/` are retired Postgres history and must not be applied to D1.

## Optional Worker/provider secrets

Provider integrations are designed to remain optional and fail safely when not configured. Examples include YouTube and free ticket/market providers documented in `.env.example` and their feature-specific runbooks.

Do not add a Postgres `DATABASE_URL` Worker secret. The production runtime is intentionally unable to reopen the retired warehouse.

## Scheduled work

Wrangler defines the production schedules. Scheduled source checks and bounded reconciliation writes persist their audit/state through D1 and fail closed if the binding is unavailable. The scoreboard refresh is centrally scheduled so clients do not create independent high-frequency database polling.

## Production verification

Every normal production deployment must pass the automated gates for the exact deployed Git SHA. The release chain verifies at minimum:

- Worker/static deployment succeeds with the D1 binding.
- `/api/health` reports `cloudflare-d1` as the primary database provider and truthful snapshot freshness.
- `/api/data` returns D1 snapshot data or the explicit dated audited fallback contract.
- `/api/preseason-stats` reports `d1-snapshot` or audited fallback roster provenance.
- Advanced Analytics verifies D1 snapshot provenance and truthful season fallback.
- Account/Guest behavior remains guest-safe and preference persistence remains D1-backed.
- Player/Game Day, Listen/Watch, Market Pulse, Command Intelligence, Ask Titans, Change Intelligence, freshness, 365 Mode, navigation and headshots pass real browser checks.
- Static/PWA security headers, service-worker packaging, mobile touch targets and source-truth assertions remain intact.

`docs/CLOUDFLARE_STATUS.md` is generated from that workflow and records the last release result.

## Manual deployment

For an authorized manual deployment:

```bash
npm run deploy:cloudflare
```

A manual deploy should still be followed by the same production regression checks before it is considered a release.

## Recovery

The retired Neon warehouse is not a supported rollback path. If a D1-backed feature fails, repair the D1 binding/data/materializer or use the feature's explicit audited/unavailable state. Do not restore `DATABASE_URL` or a warehouse compatibility adapter.
