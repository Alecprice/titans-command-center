# Cloudflare deployment status

- Status: **deployed + full production + browser navigation regression passed**
- Source commit: `2d248537198a535caf223396dd0cc73496058338`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T20:24:22Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v25",
  "precachePaths": 42,
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
    "commit": "2d248537198a535caf223396dd0cc73496058338",
    "builtAt": "2026-08-20T20:23:25.248Z"
  },
  "deploymentPropagationAttempts": 9,
  "responseMs": {
    "root": 23,
    "health": 311,
    "data": 638,
    "stats": 278,
    "market": 268
  },
  "testedAt": "2026-08-20T20:24:03.790Z"
}```

## Browser navigation regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktopRounds": 3,
  "transactionChecks": 12,
  "mobileChecks": 5,
  "mobileTargets": [
    {
      "height": 48,
      "label": "\u2302Home",
      "width": 59.15625
    },
    {
      "height": 48,
      "label": "\u25cfGame",
      "width": 59.171875
    },
    {
      "height": 48,
      "label": "\u25ceRoster",
      "width": 59.171875
    },
    {
      "height": 48,
      "label": "\u21c4Moves",
      "width": 59.15625
    },
    {
      "height": 48,
      "label": "\u2197Stats",
      "width": 59.171875
    },
    {
      "height": 48,
      "label": "\u2630More",
      "width": 59.171875
    }
  ],
  "maxLongTaskMs": 0,
  "longTasksOver250ms": 0,
  "browserWarnings": [
    {
      "level": "WARNING",
      "message": "https://titans-command-center.alecjordanprice.workers.dev/#home - Error while trying to use the following icon from the Manifest: https://titans-command-center.alecjordanprice.workers.dev/assets/icon-192.png (Download error or resource isn't a valid image)",
      "source": "other",
      "timestamp": 1787257457549
    }
  ],
  "durationSeconds": 14.79,
  "testedAt": "2026-08-20T20:24:22Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
