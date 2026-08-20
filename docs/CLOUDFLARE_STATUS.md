# Cloudflare deployment status

- Status: **deployed + smoke-tested + Neon healthy**
- Source commit: `c186b53bc838ecc3171b59343589c37ec95246bf`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Smoke outcome: success
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T16:38:57Z

## Smoke test

```json
{
  "rootStatus": 200,
  "shieldStatus": 200,
  "healthStatus": 200,
  "appStatus": "healthy",
  "databaseOk": true,
  "databaseConfigured": true,
  "dataStatus": 200,
  "dataOk": true,
  "dataRosterCount": 95,
  "statsStatus": 200,
  "rosterCount": 95,
  "statsRosterSource": "Neon · latest audited Titans roster snapshot",
  "completedPreseasonGames": 1,
  "marketStatus": 200,
  "marketOk": true,
  "marketRows": 6,
  "marketMode": "published-reference",
  "testedAt": "2026-08-20T16:38:57.076Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
