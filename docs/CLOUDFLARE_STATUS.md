# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `2c671569b36099135d8758a10ed628f339dfd8ff`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: failure
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T17:58:10Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v23",
  "precachePaths": 39,
  "healthStatus": 200,
  "appStatus": "healthy",
  "databaseConfigured": true,
  "databaseOk": true,
  "dataStatus": 200,
  "dataRosterCount": 95,
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
    "commit": "2c671569b36099135d8758a10ed628f339dfd8ff",
    "builtAt": "2026-08-20T17:57:10.086Z"
  },
  "deploymentPropagationAttempts": 9,
  "responseMs": {
    "root": 23,
    "health": 315,
    "data": 683,
    "stats": 485,
    "market": 105
  },
  "testedAt": "2026-08-20T17:57:49.227Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "round-1:transactions:wait-hydration",
  "error": "TimeoutException: Message: \n",
  "state": {
    "appChildren": 2,
    "appText": "PERSONNEL MOVEMENT\nTRANSACTIONS\n\nLatest structured Titans roster transactions from Neon.\n\nTRANSACTIONS \u00b7 0\nT\nNo transaction rows available yet.",
    "hash": "#transactions",
    "href": "https://titans-command-center.alecjordanprice.workers.dev/#transactions",
    "marketLoading": null,
    "rows": 0,
    "statsLoading": null,
    "title": "Transactions",
    "transactionTools": false
  },
  "durationSeconds": 17.58,
  "testedAt": "2026-08-20T17:58:10Z",
  "browserWarnings": [
    {
      "level": "WARNING",
      "message": "https://titans-command-center.alecjordanprice.workers.dev/#home - Error while trying to use the following icon from the Manifest: https://titans-command-center.alecjordanprice.workers.dev/assets/icon-192.png (Download error or resource isn't a valid image)",
      "source": "other",
      "timestamp": 1787248681935
    }
  ]
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
