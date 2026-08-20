# Analytics data sources

## Primary: nflverse / nflfastR through nflreadpy

The automated analytics warehouse uses `nflreadpy` as the Python client for nflverse data. The ingestion job loads schedules, weekly team stats, and play-by-play. Historical participation data is joined when available to add offensive formation and offensive/defensive personnel packages.

Stored play context includes down, distance, field position (`yardline_100` plus the human-readable yard line), score differential, game time remaining, EPA/WPA, and personnel fields when the upstream dataset supplies them.

Team-week metrics include:

- offensive EPA per play;
- defensive EPA per play allowed (lower is better);
- observed game-clock pace in seconds per offensive play;
- offensive and defensive play counts;
- schedule rest days;
- the nflverse weekly team-stat row preserved as JSON for additional analysis.

The scheduled job defaults to the current analytics season. Initial/manual runs can request multiple seasons back to 1999 for play-by-play backfills. Personnel/participation data is only loaded for seasons nflverse currently exposes through `load_participation()`.

## Cross-check sources

- **NFL Savant** — secondary processed play-by-play CSV cross-check. It is not allowed to silently overwrite nflverse rows.
- **Pro-Football-Reference** — historical box-score/career reference and advanced-stat cross-check. Prefer `nflreadpy.load_pfr_advstats()` where possible rather than brittle page scraping.
- **Kaggle** — optional, disabled by default. A specific dataset must be reviewed for provenance, license, update cadence, and schema before it can enter the warehouse.

## Source arbitration

For current Titans roster, schedule, transactions, team announcements, and branding, TennesseeTitans.com / NFL.com remain authoritative. nflverse is the primary analytics source. Secondary datasets may flag discrepancies but do not overwrite primary rows without an explicit audited rule.
