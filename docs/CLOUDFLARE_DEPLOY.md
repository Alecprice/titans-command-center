# Cloudflare deployment runbook

This project can run in parallel on Vercel and Cloudflare during migration. Do **not** remove the Vercel project or switch DNS until the Cloudflare deployment passes the production checklist below.

## Target architecture

- GitHub: source of truth (`Alecprice/titans-command-center`)
- Cloudflare Workers + Static Assets: public app and `/api/*`
- Neon: existing PostgreSQL database
- Vercel: temporary fallback during cutover

Static HTML/CSS/JS/assets are served directly by Cloudflare's asset layer. Only `/api/*` is routed through Worker compute.

## Build locally

```bash
npm install
npm run check
npm run build:cloudflare
```

`dist/` is generated and intentionally ignored by Git.

## One-time Cloudflare setup

The repository contains `.github/workflows/cloudflare-deploy.yml`. On every push to `main`, GitHub runs the full Titans quality gate and then deploys through Wrangler when both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets are configured.

For a local/manual fallback deployment, sign in to Cloudflare / Wrangler:

```bash
npx wrangler@4 login
```

Then deploy with:

```bash
npm run deploy:cloudflare
```

## Worker runtime secrets

After the first Worker exists, add the existing Neon connection string as a Worker secret:

```bash
npx wrangler@4 secret put DATABASE_URL
```

Add ingestion/cron secrets if preserving the scheduled source-check automation:

```bash
npx wrangler@4 secret put INGEST_SECRET
npx wrangler@4 secret put CRON_SECRET
```

Optional market-provider secrets:

```bash
npx wrangler@4 secret put PROPLINE_API_KEY
npx wrangler@4 secret put ODDS_API_IO_KEY
```

The market UI still has its non-key fallback path when these are absent.

The Worker configuration in `wrangler.jsonc` includes the same daily `15 10 * * *` UTC source-check schedule used by the Vercel project.

## Production verification before DNS cutover

Verify the Cloudflare `workers.dev` URL before attaching a custom domain:

- `/` loads the current Titans Command Center UI.
- Current Shield image is correct in Legacy.
- `/api/health` returns HTTP 200 and reports database `ok: true` once `DATABASE_URL` is configured.
- `/api/data` returns the current roster/data warehouse payload.
- `/api/preseason-stats` returns the complete roster and preseason stat book.
- `/api/market-data` returns a safe market response without a provider-configuration crash.
- Stats Lab filters/search work on desktop, tablet and mobile.
- Market refresh works repeatedly.
- PWA/service worker updates to the current cache version.
- No secrets are present in client assets or response bodies.
- Scheduled source-check run succeeds after `CRON_SECRET` is configured.

## Cutover

Only after the Cloudflare URL passes the checklist:

1. Attach the desired custom domain in Cloudflare.
2. Verify HTTPS and API routes on the custom domain.
3. Leave Vercel online briefly as rollback insurance.
4. Remove/retire the old Vercel production deployment only after the Cloudflare deployment is stable.

## Notes

Cloudflare's `nodejs_compat` mode is enabled because the existing API uses Node-compatible modules and `process.env`. With a compatibility date after 2025-04-01, Worker text/JSON bindings and secrets are available through `process.env`, allowing the existing single API gateway to be reused rather than forked.
