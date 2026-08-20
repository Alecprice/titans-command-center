# Cloudflare deployment status

- Status: **deployed + full production + browser navigation regression passed**
- Source commit: `e3476ca884dc88c9766265e3b0844fca14f47706`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T21:15:14Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v28",
  "precachePaths": 41,
  "pwaIcons": {
    "icon192": {
      "width": 192,
      "height": 192,
      "bytes": 2854
    },
    "icon512": {
      "width": 512,
      "height": 512,
      "bytes": 5724
    }
  },
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
  "statsRosterMode": "live-database",
  "statsRosterSource": "Tennessee Titans official roster · latest audited snapshot",
  "completedPreseasonGames": 1,
  "marketStatus": 200,
  "marketRows": 6,
  "marketMode": "published-reference",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "0.8.0",
    "commit": "e3476ca884dc88c9766265e3b0844fca14f47706",
    "builtAt": "2026-08-20T21:14:29.500Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 33,
    "health": 156,
    "data": 163,
    "stats": 103,
    "market": 1177
  },
  "testedAt": "2026-08-20T21:14:52.341Z"
}```

## Browser navigation regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktopRounds": 3,
  "transactionChecks": 12,
  "mobileChecks": 12,
  "smallPhoneChecks": 2,
  "searchQuickJump": true,
  "mobileDrawerInert": true,
  "teamRoomChecks": 4,
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
  "maxLongTaskMs": 96,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 16.25,
  "testedAt": "2026-08-20T21:15:14Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
