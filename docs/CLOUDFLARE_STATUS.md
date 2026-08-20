# Cloudflare deployment status

- Status: **deployed + smoke check failure**
- Source commit: `1bd38a2138ff1c13ca66bd6a4ad5478aa35f63ea`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Smoke outcome: failure
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T16:36:06Z

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
  "testedAt": "2026-08-20T16:36:06.188Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
