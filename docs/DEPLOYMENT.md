# Deployment — v0.5.2

The application is ready for Vercel or another Node/serverless host. Core operation remains free-only and does not require a credit card.

## Required server-only variables

- `DATABASE_URL`
- `PROPLINE_API_KEY`
- `ODDS_API_IO_KEY`
- `INGEST_SECRET`
- `CRON_SECRET`

Optional tuning variables are documented in `.env.example`. Never prefix secrets with `NEXT_PUBLIC_`, never place them in browser JavaScript, and never commit `.env` files.

## Verification sequence

1. Run `npm run check`.
2. Deploy with the server-only variables above.
3. Open `/api/health` and confirm the database is healthy and both free odds providers are configured.
4. Call protected `/api/provider-health` with `Authorization: Bearer $INGEST_SECRET` to make a minimal server-side request to both free odds feeds. No key values are returned.
5. Open canonical `/api/odds`. Query parameters are intentionally rejected to protect the free daily quota. Use the protected `POST /api/sync?job=odds` job for a deep two-provider/period-market snapshot.
6. Verify the PWA in a mobile viewport and install/offline behavior.
7. Confirm `GET /api/sync` returns 405, unauthorized `POST /api/sync` returns 401, an authorized POST works, and the Vercel cron bearer secret is accepted.

## Current external blocker

The connected Vercel session was rejected with HTTP 403 for both preview and production deployment creation before a build existed. The audit confirmed the connector could see only the `Tower Defense2` team and `eifs-quotes` project, while the ChatGPT-side Vercel permission was already set to allow all actions. This points to Vercel OAuth/account/team scope or team role, not an application route. See `VERCEL_403.md`.
