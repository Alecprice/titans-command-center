# Deployment — Cloudflare production

Titans Command Center production is deployed from GitHub `main` to Cloudflare Worker + Static Assets with Cloudflare D1 persistence.

## Required deployment configuration

GitHub Actions requires:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The Worker requires the checked-in `TITANS_DB` D1 binding. Feature-specific media/market credentials are optional and are only supplied when those integrations are configured.

`DATABASE_URL` is not a current deployment variable. The former Neon/Postgres warehouse runtime has been retired.

## Verification sequence

1. Run `npm run check`.
2. Build/deploy through the normal Cloudflare workflow or an authorized `npm run deploy:cloudflare` run.
3. Confirm deployed `build-meta.json` matches the source Git SHA.
4. Confirm `/api/health` reports Cloudflare D1 and truthful snapshot freshness.
5. Confirm `/api/data`, `/api/preseason-stats`, Player, Fan Intel and Advanced Analytics use their D1/audited contracts without warehouse fallback.
6. Run the browser release gates for navigation, Listen/Watch, Market Pulse, Command Intelligence, Player/Game Day, Ask Titans, Change Intelligence, 365 Mode, freshness, Account/Guest, analytics and headshots.
7. Confirm PWA/service-worker packaging, mobile interaction floors and security headers.
8. Confirm the generated `docs/CLOUDFLARE_STATUS.md` records a fully successful release.

## Authentication

Neon Auth remains temporarily behind the narrow same-origin account auth proxy. This is not a database requirement: account preferences use D1 and an auth outage must not restore or require Postgres.

## Legacy hosts

Old Vercel configuration may remain in the repository for historical compatibility/reference, but it is not the production release authority. Cloudflare deployment status and exact-SHA browser gates decide whether a release is healthy.

See `docs/CLOUDFLARE_DEPLOY.md` for the operational runbook and `docs/CLOUDFLARE_D1_MIGRATION.md` for the completed data-cutover record.
