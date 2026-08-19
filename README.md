# Titans Command Center

A mobile-first, installable Tennessee Titans fan HQ and data PWA. The project combines official/current team information, game-day context, roster and transaction snapshots, free market-data adapters, franchise history, and a Neon Postgres warehouse behind a custom Titans-focused UI.

## Current build — v0.6.1

This release is the first **content-integrity audited** build. On 2026-08-19, current and historical claims were checked against TennesseeTitans.com, NFL.com, the Pro Football Hall of Fame, Pro Football Reference, and Wikipedia. Current team sources outrank secondary references.

### Working now

- GitHub `main` auto-deploys to the existing Vercel `titans-command-center` project.
- Neon Postgres is the production data store; the UI falls back to clearly labeled local data if Neon is unavailable.
- Production Neon contains a dated official-roster snapshot audited 2026-08-19: **91 Active + 4 Reserve/Injured = 95 player records**.
- 2026 schedule data is source-audited. Week 9 is the bye; Week 18 at Houston remains genuinely TBD rather than using a fabricated placeholder kickoff.
- Official Titans transaction history is stored through 2026-08-17 and linked back to the team transaction page.
- Current personnel metadata includes controlling owner Amy Adams Strunk, GM Mike Borgonzi, President/CEO Burke Nihill, and head coach Robert Saleh.
- The current 2026 brand treatment uses **The Shield** and Titans Blue-led UI; legacy sections separately cover the Oilers, original Titans/fireball identity, 2018 uniform era, and 2026 Shield era.
- ESPN near-live scoreboard adapter is isolated behind a same-origin API route and treated as unofficial/replaceable.
- PropLine is the primary free/no-card market provider; Odds-API.io is the free/no-card secondary/fallback; ESPN basic lines are an emergency no-key fallback.
- Bluesky public search is available as a free social signal.
- API/auth responses are never stored in the PWA cache.
- Protected sync endpoints are POST-only where they change state.

### Built but not yet fully populated/automated

- The Neon warehouse has tables for play-by-play, drives, advanced metrics, injuries, depth charts, contracts, standings, weather and market snapshots, but several of these datasets are not yet populated.
- `syncNflverseRoster`, `syncNflverseStats`, and stored NWS weather synchronization are currently explicit **skipped/stub** jobs. They must not be described as active ingestion until implemented and verified.
- The current 95-player roster was loaded from an audited official Titans roster snapshot; automated official-roster refresh is the next data-quality task.
- Recent official transactions are accurate as of the content audit; automated official transaction-page ingestion is still pending.
- Play-level historical analytics remain empty until the historical importer is restored/run against the current v0.6 schema.

## Source hierarchy

For current/frequently changing facts:

1. TennesseeTitans.com — roster, front office, coaching, schedule, transactions, brand and team news.
2. NFL.com — official league/schedule cross-check.
3. Open structured sources such as nflverse — data enrichment after identity/date validation.
4. Reputable secondary references.
5. Wikipedia — historical cross-check/discovery, not authority for live personnel.

For stable historical facts, official Titans history, the Pro Football Hall of Fame and NFL historical records come first; Pro Football Reference and Wikipedia are secondary checks.

See [`docs/CONTENT_INTEGRITY.md`](docs/CONTENT_INTEGRITY.md) for the full policy and audit notes.

## Local development

```bash
npm install
cp .env.example .env.local
# Put DATABASE_URL and server-only secrets in your environment.
npm run dev
```

Open `http://localhost:4173`.

The app can open without `DATABASE_URL`; it should visibly behave as fallback data rather than silently pretending the database is connected.

## Quality checks

```bash
npm run check
```

That runs:

- Node regression tests
- Titans factual-content assertions
- credential/secret scan
- recursive JavaScript syntax checks

The content audit specifically protects facts such as the 1959 franchise grant vs. 1960 first season, the Week 9 bye, Week 18 TBD status, current team colors, and the fallback-roster disclosure.

## API routes

- `GET /api/health` — app version, content-audit date, Neon health and provider configuration booleans.
- `GET /api/provider-health` — protected free-provider diagnostics; never returns credentials.
- `GET /api/data` — normalized bootstrap from Neon.
- `GET /api/espn-scoreboard` — read-only near-live ESPN proxy.
- `GET /api/bluesky-search?q=...` — read-only Bluesky public search.
- `GET /api/odds` — canonical cached Titans odds endpoint; arbitrary query parameters are rejected to protect free quotas.
- `GET /api/player?id=...` — player profile scaffold from Neon.
- `GET /api/analytics?...` — analytics scaffold/coverage endpoint; meaningful play-level output depends on PBP backfill.
- `POST /api/sync` — protected state-changing sync endpoint.
- `GET /api/cron-refresh` — protected Vercel Cron refresh endpoint.

## Free/no-card policy

Core dependencies must remain usable at $0 without entering a payment card. Server credentials belong only in Vercel/environment configuration and must never be committed to GitHub or shipped to browser JavaScript.

Current data/provider strategy:

- Tennessee Titans / NFL public pages — official facts
- nflverse — open football datasets
- ESPN consumer JSON — isolated unofficial live fallback
- Bluesky public API — social signals
- NWS / weather.gov — weather
- PropLine — primary free/no-card market API
- Odds-API.io — secondary free/no-card market API

## Database

The repository schema is aligned to the live **Neon schema v0.6.0**. `db/seed.sql` is intentionally conservative: it seeds source metadata, the Titans team record, a clearly labeled featured fallback player sample, and a small dated official transaction snapshot rather than fabricating a complete live dataset.

`db/migrations/008_content_integrity_20260819.sql` records the schedule, roster-position and official-transaction corrections from the 2026-08-19 audit.

## Branding

This is an unofficial fan-built project. Team/NFL marks remain property of their respective rights holders. `docs/BRAND_UI.md` separates official current-team color/identity facts from implementation-only UI accent colors and from throwback/reference artwork.
