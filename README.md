# Titans Command Center

A mobile-first, installable Tennessee Titans fan HQ and data PWA. It combines official/current team information, game-day context, roster and transaction snapshots, free market-data adapters, franchise history, and a Neon Postgres warehouse behind a custom Titans-focused UI.

## Current build — v0.8.0

The project follows a **content-integrity first** model. Current facts are checked against TennesseeTitans.com first, then NFL.com where appropriate. The Pro Football Hall of Fame, Pro Football Reference, nflverse, SportsLogos.net and Wikipedia are secondary/cross-check sources by domain rather than interchangeable authorities.

### Working now

- GitHub `main` auto-deploys to the existing Vercel project through one consolidated serverless API gateway.
- Neon is the production data store; clearly labeled local data is the offline/database-failure fallback.
- Current official roster snapshot: **91 Active + 4 Reserve/Injured = 95 current players** as audited Aug. 19, 2026.
- Aug. 19 roster move is reflected: **RB D'Ernest Johnson signed; RB Dominic Richardson waived**.
- Week 9 is the 2026 bye; Week 18 at Houston remains **TBD** and the current official venue name is **Reliant Stadium**.
- Official transaction chronology is stored through Aug. 19.
- Team Room includes the dated official **UNOFFICIAL** depth-chart snapshot with ties preserved, plus current leadership and the full audited 23-role coaching staff.
- Stats Lab separates 2025 verified baseline statistics from not-yet-started 2026 regular-season totals and exposes known source conflicts.
- The 2026 visual treatment uses **The Shield** and Titans Blue-led UI; historical/reference imagery remains separately labeled.
- Phone, tablet/small-laptop, desktop and wide-desktop breakpoints are explicitly handled.
- API/auth responses are never PWA-cached.

### Source checks vs. persistence

A reachable provider is **not** the same thing as an active warehouse importer.

- The protected scheduled endpoint runs a `daily-source-check`, not a fake “deep refresh.”
- Official Titans roster/transactions/schedule/depth-chart pages receive reachability/marker checks without unverified HTML parsing into production data.
- Every source-check outcome is logged to Neon `sync_runs` as `success`, `skipped`, or `failed`, with records seen/written kept separate.
- Skipped nflverse/NWS persistence jobs do not count as successful refreshes.
- ESPN and Bluesky can be reachable while writing zero rows; their source status says so.
- Market persistence remains disabled until live provider payloads are fully verified.

## Source hierarchy

1. **Roster / schedule / transactions / staff:** TennesseeTitans.com, with NFL.com as official cross-check where applicable.
2. **Statistics:** structured Tennessee Titans team-stat tables first; NFL.com, Pro Football Reference and nflverse as cross-checks. Editorial recap copy does not override the structured table.
3. **Injuries:** official Titans injury report. Reserve/Injured roster status is separate, and “no report yet” never means zero injuries.
4. **History:** Titans official history plus the Pro Football Hall of Fame; PFR/Wikipedia are secondary.
5. **Visual identity:** Titans brand/history pages first, SportsLogos.net second. User-supplied art is reference material unless an exact mark/year is verified.

Known discrepancies are surfaced in the Sources page rather than hidden. One current example: the official Aug. 1 transaction table says “Mario Goodson III,” while the current official roster and dedicated Titans signing story identify **Mario Goodrich III**; the app keeps the roster/news identity and records the transaction-table typo.

See [`docs/CONTENT_INTEGRITY.md`](docs/CONTENT_INTEGRITY.md).

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:4173`.

## Quality checks

```bash
npm run check
```

This runs Node regression tests, factual-content assertions, credential/secret scanning, and recursive JavaScript syntax checks.

## API routes

All public routes dispatch through one Vercel function:

- `GET /api/health`
- `GET /api/provider-health` — protected diagnostics
- `GET /api/data`
- `GET /api/espn-scoreboard`
- `GET /api/bluesky-search?q=...`
- `GET /api/odds`
- `GET /api/player?id=...`
- `GET /api/analytics?...`
- `POST /api/sync?job=...` — protected; includes `official-audit`
- `GET /api/cron-refresh` — protected `daily-source-check`

## Free/no-card policy

Core dependencies must remain usable at $0 without entering a payment card. Server credentials belong only in environment configuration and must never be committed or shipped to browser JavaScript.

## Database

Live schema: **Neon v0.6.0**. Seed data is intentionally conservative and never pretends to be a live roster.

- `008_content_integrity_20260819.sql` — initial schedule/roster/transaction integrity corrections.
- `009_current_audit_20260819.sql` — Aug. 19 roster move, Reliant Stadium correction and honest integration-status metadata.

## Branding

This is an unofficial fan-built project. Team/NFL marks remain property of their respective rights holders. `docs/BRAND_UI.md` separates current official identity facts from implementation accents and historical/reference artwork.
