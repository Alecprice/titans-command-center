# Cloudflare deployment status

- Status: **deployed + smoke-tested**
- Source commit: `39b1f41d5af6251ed16eb7849526c952cf2a67c1`
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T13:12:11Z

## Smoke test

```json
{
  "rootStatus": 200,
  "shieldStatus": 200,
  "healthStatus": 200,
  "appStatus": "degraded",
  "databaseOk": false,
  "databaseConfigured": false,
  "statsStatus": 200,
  "rosterCount": 95,
  "completedPreseasonGames": 1,
  "marketStatus": 200,
  "marketOk": true,
  "marketRows": 6,
  "marketMode": "published-reference",
  "testedAt": "2026-08-20T13:12:11.109Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml` after a successful Cloudflare deployment and regression smoke test.
