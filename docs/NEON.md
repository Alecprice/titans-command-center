# Neon Postgres Operations

## Production project

A dedicated Neon project named `titans-command-center` is used so Titans ingestion and schema evolution stay isolated from unrelated apps.

Current schema version: **0.6.0**.

The PWA never receives the Neon connection string. Browser requests go to same-origin serverless routes; those routes query Neon with `@neondatabase/serverless`.

## Environment

Use a pooled Neon connection string in the server-side `DATABASE_URL` variable. Also configure long random values for `INGEST_SECRET` and `CRON_SECRET`.

Provider secrets are optional and should only exist in server environments:

- `X_BEARER_TOKEN`
- `THREADS_ACCESS_TOKEN`
- `YOUTUBE_API_KEY`
- `PROPLINE_API_KEY` (free/no-card odds + props/futures)
- `ODDS_API_IO_KEY` (optional second free/no-card odds source)

NWS does not require an API key but requires an identifying User-Agent. Configure `NWS_USER_AGENT`.

## Data lifecycle

1. Provider adapter fetches raw content.
2. A `sync_runs` row records start/status/counts/errors.
3. Provider identifiers are resolved into canonical teams/players/games.
4. Raw provider payload is retained in the relevant normalized record.
5. Normalized rows power the PWA.
6. Derived analytics are written separately from source facts.

This separation lets us replace a provider without rewriting the app or losing provenance.

## Sync jobs

Protected `/api/sync` jobs:

- `espn` — Titans scoreboard/game-state reconciliation.
- `bluesky` — recent public Titans social posts.
- `nflverse-roster` — current-season Titans roster snapshot.
- `nflverse-stats` — weekly player/team stats.
- `nws-weather` — next Titans home-game kickoff forecast when inside NWS's seven-day forecast window.
- `odds` — Titans market snapshot from PropLine when a free key is configured.

Example selective request after deployment:

```bash
curl -X POST -H "Authorization: Bearer $INGEST_SECRET" \
  "https://YOUR_DOMAIN/api/sync?job=espn,nws-weather"
```

## Play-by-play

The NFLverse full-season PBP CSV becomes too large to treat like a small serverless JSON request. `npm run import:pbp -- 2026` uses a streaming parser and discards non-Titans rows while reading. The importer stores:

- provider game IDs
- drives
- plays
- offense/defense team relationships
- play type, down/distance, clock, yards
- EPA, WP, WPA, success
- derived explosive-play flag
- raw source row for provenance

Run this from a CI job or other execution environment with enough duration for the full release file rather than placing it in the default daily Vercel cron.

## Schema change policy

For subsequent production schema changes, prefer a Neon branch first, test queries against that branch, then apply the migration to `main`. Keep `db/schema.sql` updated so a fresh environment can be recreated.

## Current warehouse families

Core identity: teams, players, aliases, games, provider IDs.

Snapshots: roster, depth chart, injury, standings, weather, detailed sportsbook market odds, season futures.

Football facts: drives, plays, player game stats, team game metrics.

Intel: normalized events, event-player/game joins, source accounts.

Operations/user: sources, sync runs, saved filters, schema metadata.

## Historical Titans backfill

Use `npm run import:history -- 1999 2026` from a long-running machine/CI worker to stream each nflverse season into the same canonical `games`, `drives`, and `plays` tables. The `/api/analytics` read model then powers offense/defense historical splits without changing the client schema.
