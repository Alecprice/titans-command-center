# Cloudflare deployment status

- Status: **deployed + smoke check failure**
- Source commit: `9f374de402b1d0d2928e0a65b8f29705a8fd8556`
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T13:20:17Z

## Smoke test

```json
{
  "rootStatus": 200,
  "shieldStatus": 200,
  "healthStatus": 200,
  "appStatus": "degraded",
  "databaseOk": false,
  "databaseConfigured": false,
  "dataStatus": 503,
  "dataOk": false,
  "dataRosterCount": 0,
  "statsStatus": 200,
  "rosterCount": 95,
  "statsRosterSource": "Audited Titans roster snapshot · 2026-08-19",
  "completedPreseasonGames": 1,
  "marketStatus": 200,
  "marketOk": true,
  "marketRows": 6,
  "marketMode": "published-reference",
  "testedAt": "2026-08-20T13:20:17.506Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml` after a Cloudflare deployment and regression smoke test.
