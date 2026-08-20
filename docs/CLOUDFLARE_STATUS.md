# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `b09118314fdd2110bb8c4294b659853bde36bd81`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: failure
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T17:50:14Z

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
    "commit": "b09118314fdd2110bb8c4294b659853bde36bd81",
    "builtAt": "2026-08-20T17:49:14.499Z"
  },
  "deploymentPropagationAttempts": 7,
  "responseMs": {
    "root": 165,
    "health": 138,
    "data": 138,
    "stats": 114,
    "market": 205
  },
  "testedAt": "2026-08-20T17:49:48.377Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 20.73,
  "testedAt": "2026-08-20T17:50:14Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
