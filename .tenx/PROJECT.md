# Titans Command Center Project State

Product: Tennessee Titans fan command center with roster, schedule, stats, odds/market views, and PWA experience.

Priorities:
- P0: production outage, broken API/data path, failed deploy, failed CI.
- P1: incorrect roster/schedule/stats content, broken mobile/PWA flow, reliability regressions.
- P2: fan-facing features and data depth.
- P3: polish and refactors.

Critical release checks:
- `npm run check`
- Cloudflare build verification
- Production/content regression scripts when runtime or source data changes
- Core pages load without fatal console/network errors

Tracked work should live in GitHub Issues and pull requests. Update this file when priorities or release assumptions materially change.