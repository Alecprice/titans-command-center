# Free-tier deployment strategy

Titans Command Center is intentionally designed to remain usable on no-card/free infrastructure where practical.

## Current production strategy

- GitHub `main` is the release source.
- GitHub Actions runs the complete quality gate before production deployment.
- Cloudflare Worker + Static Assets hosts the app and API.
- Cloudflare D1 is the production data authority.
- Cloudflare cache and materialized D1 snapshots keep request-time work bounded.
- Optional provider integrations remain optional; loss of a provider must not break the core app or create fabricated data.
- Neon Auth remains a temporary, isolated auth HTTP service only; it is not the application database.

## D1 usage model

The application avoids per-user high-frequency database polling. Shared scheduled jobs and materializers write bounded snapshots that are reused across clients.

Examples:

- near-live scoreboard refresh is centralized;
- Advanced Analytics is precomputed by the nflreadpy workflow and published as compact D1 snapshots;
- bootstrap/Fan Intel/Player reads use materialized D1 records and explicit stale/audited behavior;
- sync audit and final-score reconciliation writes are bounded and D1-only.

Raw full-season play-by-play is not copied into D1 just to serve request-time analytics when compact derived payloads are sufficient.

## Release workflow

1. Stage related changes on a branch.
2. Run/verify the repository Quality Gate.
3. Merge one contained green PR to `main`.
4. Let GitHub Actions deploy the exact merge SHA to Cloudflare.
5. Require the production API audit and all browser gates to pass.
6. Treat `docs/CLOUDFLARE_STATUS.md` as the generated release record.

## Credentials

Core production deployment requires the Cloudflare API token/account ID already configured in GitHub Actions. Optional provider keys are server-only. No Postgres `DATABASE_URL` is required or supported by the production runtime.

The optional AWS custom-domain front door does not receive database or auth credentials. It forwards HTTPS to the Cloudflare Worker origin only.

## Retired Vercel context

Earlier versions optimized around Vercel Hobby build-rate constraints and routed API URLs through a single `api/index.js` gateway. `vercel.json` is intentionally absent now and Vercel is not a release target.

`api/index.js` remains only because the Cloudflare Worker still imports it as a compatibility module for a small set of non-native routes. As those routes move to dedicated Worker handlers, that gateway can be reduced further without restoring Vercel hosting configuration.

The public API URLs remain stable because Cloudflare owns the live `/api/*` routes.
