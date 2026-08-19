# Titans Command Center

A mobile-first, installable Tennessee Titans fan HQ and data PWA. The project combines official/current team information, game-day context, roster and transaction snapshots, free market-data adapters, franchise history, and a Neon Postgres warehouse behind a custom Titans-focused UI.

## Current build — v0.6.5

The project follows a **content-integrity first** model. Current/frequently changing claims are checked against TennesseeTitans.com first, then NFL.com when appropriate. The Pro Football Hall of Fame, Pro Football Reference, nflverse, SportsLogos.net and Wikipedia are secondary/cross-check sources by domain rather than interchangeable authorities.

### Working now

- GitHub `main` auto-deploys to the existing Vercel `titans-command-center` project through one consolidated serverless API gateway.
- Neon Postgres is the production data store; the UI falls back to clearly labeled local data if Neon is unavailable.
- Current official roster snapshot: **91 Active + 4 Reserve/Injured = 95 current players** as audited Aug. 19, 2026.
- The Aug. 19 roster move is reflected in production: **RB D'Ernest Johnson signed; RB Dominic Richardson waived**.
- 2026 schedule data is source-audited. Week 9 is the bye; Week 18 at Houston remains genuinely **TBD** and the current official venue name is **Reliant Stadium**.
- Official Titans transaction history is stored through Aug. 19 and linked back to the team transaction page.
- Team Room includes the dated official **UNOFFICIAL** depth-chart snapshot with ties preserved, plus current football leadership and the full audited 23-role coaching staff.
- Current personnel includes Amy Adams Strunk (Controlling Owner/Co-Chairman, Board of Directors), GM Mike Borgonzi, President/CEO Burke Nihill and head coach Robert Saleh.
- Stats Lab clearly separates 2025 verified baseline statistics from not-yet-started 2026 regular-season totals and records known source conflicts instead of silently blending values.
- The current 2026 brand treatment uses **The Shield** and Titans Blue-led UI; legacy sections separately cover the Oilers, fireball era, 2018 uniform era and 2026 Shield era.
- ESPN near-live scoreboard remains an isolated unofficial fallback; it is not treated as authoritative roster/injury data.
- PropLine is the primary free/no-card market provider; Odds-API.io is the free/no-card secondary/fallback.
- API/auth responses are never stored in the PWA cache.
- Phone, tablet/small-laptop, desktop and wide-desktop breakpoints are explicitly handled rather than relying on one mobile breakpoint.

### Source checks vs. persistence

A reachable provider is **not** the same thing as an active warehouse importer.

- The scheduled Vercel job is a `daily-source-check` until persistence importers are individually verified.
- The official Titans roster/transactions/schedule/depth-chart pages are checked for reachability/expected page markers without scraping unverified data into production.
- ESPN and Bluesky checks can succeed while writing zero rows; their status is shown honestly.
- `syncNflverseRoster`, `syncNflverseStats`, and NWS persistence remain explicit skipped jobs. Skipped work is counted separately and is never reported as a successful refresh.
- Market persistence remains disabled until real provider payloads are fully verified.

## Source hierarchy

Source authority changes by data type:

1. **Roster / schedule / transactions / staff:** TennesseeTitans.com, with NFL.com as official cross-check where applicable.
2. **Statistics:** structured Tennessee Titans team-stat tables first; NFL.com, Pro Football Reference and nflverse as cross-checks. Editorial recap copy does not override the structured table.
3. **Injuries:** official Titans injury report. Reserve/Injured roster status is a separate dataset and “no report yet” never means zero injuries.
4. **History:** Titans official history plus the Pro Football Hall of Fame; PFR/Wikipedia are secondary.
5. **Visual identity:** Titans brand/history pages first, SportsLogos.net second. User-supplied art is reference material unless an exact mark/year is verified.

Known discrepancies are surfaced in the Sources page rather than hidden. See [`docs/CONTENT_INTEGRITY.md`](docs/CONTENT_INTEGRITY.md).

## Local development

```bash
npm install
cp .env.example .env.local
# Put DATABASE_URL and server-only secrets in your environment.
npm run dev
```

Open `http://localhost:4173`.

## Quality checks

```bash
npm run check
```

This runs Node regression tests, factual-content assertions, the credential/secret scan, and recursive JavaScript syntax checks. The tests specifically protect schedule TBD/bye behavior, current venue naming, source arbitration, mobile/tablet/wide responsive contracts, skipped-vs-success refresh semantics, current personnel and verified baseline statistics.

## API routes

All public routes are dispatched through one Vercel serverless gateway to reduce Hobby build-rate usage.

- `GET /api/health`
- `GET /api/provider-health` — protected provider diagnostics
- `GET /api/data`
- `GET /api/espn-scoreboard`
- `GET /api/bluesky-search?q=...`
- `GET /api/odds`
- `GET /api/player?id=...`
- `GET /api/analytics?...`
- `POST /api/sync?job=...` — protected; includes `official-audit`
- `GET /api/cron-refresh` — protected `daily-source-check`

## Free/no-card policy

Core dependencies must remain usable at $0 without entering a payment card. Server credentials belong only in Vercel/environment configuration and must never be committed to GitHub or shipped to browser JavaScript.

## Database

The repository schema is aligned to live **Neon schema v0.6.0**. Seed data is intentionally conservative and does not pretend to be a live roster.

Key audit migrations:

- `008_content_integrity_20260819.sql` — initial schedule/roster/transaction integrity corrections.
- `009_current_audit_20260819.sql` — current Aug. 19 roster move, Reliant Stadium correction and honest integration-status metadata.

## Branding

This is an unofficial fan-built project. Team/NFL marks remain property of their respective rights holders. `docs/BRAND_UI.md` separates official current-team identity facts from UI-only accents and historical/reference artwork.
