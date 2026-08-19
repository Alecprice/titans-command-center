# Free-tier deployment strategy

Titans Command Center is intentionally designed to remain usable on no-card/free infrastructure.

## Vercel Hobby build-rate rule

Vercel documents a Hobby rate limit of 32 builds per rolling 3600-second window. Vercel also documents that each Vercel Function is classed as a build for this limit. A project with many separate files under `/api` can therefore consume several build slots from one Git deployment.

## Project response

Starting with v0.6.3:

- All public/admin API paths route through one `api/index.js` serverless gateway.
- Existing URLs remain stable via `vercel.json` rewrites.
- Local development routes through that same gateway in `server.mjs`.
- Releases are batched into one atomic Git commit rather than many small `main` commits.
- GitHub Actions runs `npm run check` on `main` and pull requests.
- API/auth responses remain excluded from the PWA service-worker cache.

## Release workflow

1. Stage related code changes without moving `main` repeatedly.
2. Run/verify the quality gate.
3. Move `main` once for the completed release.
4. Let GitHub → Vercel create one production deployment.
5. Verify `/api/health`, `/api/data`, a player profile, and one method/auth guard.
6. If Vercel reports `build-rate-limit`, do not upgrade or add a card. Wait for the rolling Hobby window to reset, then trigger one deployment only.

## API routes preserved

- `/api/health`
- `/api/data`
- `/api/player`
- `/api/analytics`
- `/api/odds`
- `/api/bluesky-search`
- `/api/espn-scoreboard`
- `/api/provider-health`
- `/api/sync`
- `/api/cron-refresh`

The gateway refactor is infrastructure-only: callers should not need to change URLs.
