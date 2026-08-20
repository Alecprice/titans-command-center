# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `9d03650781788d9deb888d8fb0a2e7b3920896ce`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: failure
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T17:52:37Z

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
    "commit": "9d03650781788d9deb888d8fb0a2e7b3920896ce",
    "builtAt": "2026-08-20T17:51:47.014Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 80,
    "health": 336,
    "data": 557,
    "stats": 217,
    "market": 145
  },
  "testedAt": "2026-08-20T17:52:13.140Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "round-1:transactions:wait-heading",
  "error": "TimeoutException: Message: \n",
  "state": {
    "appChildren": 7,
    "appText": "PERFORMANCE\nSTATS LAB\n\nA football-first analytics room ready for the historical play-by-play backfill.\n\nSEASON SEPARATION\n2025 verified baseline \u2014 not 2026 stats\n\n2026 regular-season statistics have not started. These cards are a clearly labeled prior-season reference, not current-season totals.\n\n2025 REG\nQB\nCam Ward\n323/540 passing\n3,169 pass yds\n15 TD \u00b7 7 INT\n80.2 rating\nTITANS STATS \u2197\nRB\nTony Pollard\n242 rush att\n1,082 rush yds\n4.5 yds/att\n5 rush TD\nTITANS STATS \u2197\nDT\nJeffery Simmons\n15 games\n",
    "hash": "#transactions",
    "href": "https://titans-command-center.alecjordanprice.workers.dev/#transactions",
    "marketLoading": null,
    "rows": 0,
    "statsLoading": null,
    "title": "Stats Lab",
    "transactionTools": false
  },
  "durationSeconds": 19.43,
  "testedAt": "2026-08-20T17:52:37Z",
  "browserWarnings": [
    {
      "level": "WARNING",
      "message": "https://titans-command-center.alecjordanprice.workers.dev/#home - Error while trying to use the following icon from the Manifest: https://titans-command-center.alecjordanprice.workers.dev/assets/icon-192.png (Download error or resource isn't a valid image)",
      "source": "other",
      "timestamp": 1787248348982
    },
    {
      "level": "SEVERE",
      "message": "https://titans-command-center.alecjordanprice.workers.dev/app.js 7:91 Uncaught RangeError: Invalid time value",
      "source": "javascript",
      "timestamp": 1787248349243
    }
  ]
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
