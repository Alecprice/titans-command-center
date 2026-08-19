# Historical Titans Analytics

The play-by-play warehouse is designed around nflverse data and the Tennessee Titans era (1999-present).

## Single season

```bash
DATABASE_URL='...' npm run import:pbp -- 2026
```

## Historical backfill

```bash
DATABASE_URL='...' npm run import:history -- 1999 2026
```

The importer streams each NFL season CSV and discards non-Titans games before database writes. Existing provider play IDs are upserted so interrupted/repeated runs are safe.

The Stats Lab `/api/analytics` endpoint supports Titans offense/defense and optional season filtering. It currently returns:

- EPA/play
- success rate
- explosive-play rate
- total WPA
- CPOE hook where present
- pressure-event hook where present
- game-by-game EPA/WPA
- down splits
- quarter splits
- pass/rush splits

Player profile endpoints combine roster context, normalized game-stat rows, injury snapshots, and current Titans player-prop rows.
