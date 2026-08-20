# Cloudflare deployment status

- Status: **deployed + full production + browser navigation regression passed**
- Source commit: `b1b6715302b4be06f7170847255de4cdb1b8a7ee`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T18:09:29Z

## Production regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "rootStatus": 200,
  "securityHeaders": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "noindex, nofollow",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v24",
  "precachePaths": 40,
  "healthStatus": 200,
  "appStatus": "healthy",
  "databaseConfigured": true,
  "databaseOk": true,
  "dataStatus": 200,
  "dataRosterCount": 95,
  "transactionCount": 26,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 95,
  "statsRosterSource": "Neon · latest audited Titans roster snapshot",
  "completedPreseasonGames": 1,
  "marketStatus": 200,
  "marketRows": 6,
  "marketMode": "published-reference",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "0.8.0",
    "commit": "b1b6715302b4be06f7170847255de4cdb1b8a7ee",
    "builtAt": "2026-08-20T18:08:25.550Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 21,
    "health": 370,
    "data": 594,
    "stats": 306,
    "market": 261
  },
  "testedAt": "2026-08-20T18:08:48.851Z"
}```

## Browser navigation regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "rounds": 3,
  "transactionChecks": 12,
  "maxLongTaskMs": 54,
  "longTasksOver250ms": 0,
  "browserWarnings": [
    {
      "level": "WARNING",
      "message": "https://titans-command-center.alecjordanprice.workers.dev/#home - Error while trying to use the following icon from the Manifest: https://titans-command-center.alecjordanprice.workers.dev/assets/icon-192.png (Download error or resource isn't a valid image)",
      "source": "other",
      "timestamp": 1787249364806
    }
  ],
  "durationSeconds": 35.58,
  "testedAt": "2026-08-20T18:09:29Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
