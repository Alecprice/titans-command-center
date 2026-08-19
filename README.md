# Titans Command Center

A mobile-first, installable Tennessee Titans intelligence PWA. The app combines durable football data, official/team information, near-live game state, social signals, weather, and derived analytics behind one normalized Neon Postgres data model.

## Current build — v0.5.2

- Neon Postgres is the system of record.
- Database-first bootstrap with verified local fallback data when Neon is unavailable.
- 2026 Titans games, roster snapshots, official transaction history, ranked intelligence feed, source metadata, and sync history.
- 27-table Neon warehouse covering games, players, rosters, events, plays, drives, player stats, derived team metrics, injuries, depth charts, transactions, contracts, standings, weather, detailed market odds, futures snapshots, saved filters, and ingestion provenance.
- ESPN near-live scoreboard adapter behind a same-origin API route. ESPN remains an unofficial/replaceable source.
- NFLverse roster + weekly stats ingestion.
- Streaming NFLverse play-by-play importer that only writes Titans games instead of holding the full season in memory.
- Bluesky public-search ingestion.
- NWS kickoff-hour weather + active alert ingestion for Titans home games inside the seven-day forecast window.
- Source confidence tiers: official → media → reporter → community.
- Database-backed Stats Lab plus a 1999-present Titans historical explorer for offense/defense EPA, WPA, success rate, explosive rate, down/quarter/play-type splits. Unpopulated analytics show zero/awaiting-ingest rather than demo values.
- Dedicated Transactions screen with official-source move-type and text filters.
- Dedicated Markets screen for live/pregame moneyline, spread, total, Titans team props, Titans player props, alternate lines, best-book prices, and line movement metadata.
- Free/no-card PropLine market adapter as the primary feed; fully integrated Odds-API.io cross-check/fallback; ESPN basic-line emergency fallback when neither free feed returns usable data.
- Player intelligence pages combine roster context, game-stat history, injury history, and active player props.
- Vercel Cron-compatible daily refresh plus protected manual selective sync endpoint.
- Installable PWA manifest, icons, service worker, responsive desktop/tablet/mobile navigation.

## Local development

```bash
npm install
cp .env.example .env.local
# Add DATABASE_URL and secrets to your shell/environment.
npm run dev
```

Open `http://localhost:4173`.

The app still opens without `DATABASE_URL`; it clearly labels the data as fallback mode instead of silently pretending a database connection exists.

## Quality checks

```bash
npm run check
```

To run the streaming Titans-only play-by-play import from a machine/CI runner with enough runtime for a season file:

```bash
DATABASE_URL='...' npm run import:pbp -- 2026
# Full Titans era backfill:
DATABASE_URL='...' npm run import:history -- 1999 2026
```

Do not put `DATABASE_URL`, `INGEST_SECRET`, `CRON_SECRET`, or provider keys in browser code.

## API routes

- `GET /api/health` — app + Neon health/configuration.
- `GET /api/provider-health` — **protected admin diagnostic** for the configured free odds feeds; requires the ingest/cron bearer secret and never returns credentials.
- `GET /api/data` — normalized app bootstrap from Neon.
- `GET /api/espn-scoreboard` — read-only near-live ESPN proxy.
- `GET /api/bluesky-search?q=...` — read-only public Bluesky search.
- `GET /api/odds` — canonical public current-Titans market refresh. PropLine is primary, Odds-API.io is quota-aware fallback, and ESPN is the no-key emergency basic-line fallback. Query parameters are rejected so cache-busting traffic cannot exhaust free quotas. Deep cross-check/period refreshes run through the protected odds sync job.
- `GET /api/player?id=...` — player intelligence profile from Neon.
- `GET /api/analytics?season=2026&side=offense` — historical/play-level Titans analytics explorer.
- `POST /api/sync` — protected state-changing ingestion. Optional `?job=espn,nws-weather` selects jobs. GET is intentionally rejected.
- `GET /api/cron-refresh` — protected Vercel Cron daily deep refresh.

For a server-side provider diagnostic without exposing credentials, run `npm run test:providers`.

Available protected sync jobs: `espn`, `bluesky`, `nflverse-roster`, `nflverse-stats`, `nws-weather`, `odds`.

## Deployment

The project is Vercel-ready. Set environment variables from `.env.example`, especially `DATABASE_URL`, `INGEST_SECRET`, and `CRON_SECRET`. `CRON_SECRET` is used to authenticate Vercel Cron requests. The default cron runs once per day to stay compatible with Vercel Hobby scheduling limits; live scoreboard/social reads remain available on demand.

See `docs/NEON.md` for database/ingestion operations, `docs/SOURCE_PLAN.md` for provider/trust strategy, `docs/ODDS.md` for live market integration, `docs/HISTORICAL_ANALYTICS.md` for the Titans-era backfill, and `docs/VERCEL_403.md` for deployment-permission diagnostics.

## Provider policy

Official team/NFL/NWS facts outrank media reports; curated reporters are fast signals; community content is discovery/trend data only. Raw payloads are preserved alongside normalized records so conflicts and provider changes can be audited and reprocessed later.
