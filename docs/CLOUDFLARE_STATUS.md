# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `b2bebc973851f61365378f3151f7d4b855d43ec2`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- YouTube Data API configured: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
- Deploy outcome: success
- Production regression: failure
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Market Pulse browser regression: skipped
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-30T03:51:26Z

## Production regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "rootStatus": 200,
  "securityHeaders": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com https://i.ytimg.com; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "noindex, nofollow",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v75",
  "precachePaths": 130,
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
  "appStatus": "degraded",
  "databaseConfigured": true,
  "databaseOk": false,
  "dataMode": "audited-fallback",
  "databaseAvailable": false,
  "dataStatus": 200,
  "dataRosterCount": 95,
  "transactionCount": 4,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 95,
  "statsRosterMode": "audited-fallback",
  "statsRosterSource": "Tennessee Titans official roster + newer official transactions · audited 2026-08-27",
  "completedPreseasonGamebooks": 2,
  "completedPreseasonGames": 2,
  "completedPreseasonGamesWithPlayerStats": 2,
  "completedPreseasonGamesMissingPlayerStats": 0,
  "marketStatus": 200,
  "marketRows": 608,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "b2bebc973851f61365378f3151f7d4b855d43ec2",
    "builtAt": "2026-08-30T03:51:00.096Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 24,
    "health": 410,
    "data": 113,
    "stats": 60,
    "market": 4485
  },
  "testedAt": "2026-08-30T03:51:25.387Z",
  "healthTruth": {
    "ok": true,
    "mode": "audited-fallback",
    "status": 200,
    "healthStatus": "degraded",
    "contentAudit": null,
    "databaseContentAudit": null,
    "fallbackContentAudit": "2026-08-27",
    "databaseAvailable": false,
    "responseMs": 259,
    "testedAt": "2026-08-30T03:51:25.685Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 151,
    "warmHitMs": 151,
    "rows": 608,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 151,
        "rows": 608
      }
    ],
    "testedAt": "2026-08-30T03:51:25.870Z"
  },
  "analyticsError": "Degraded analytics API returned unexpected 503",
  "analyticsTestedAt": "2026-08-30T03:51:26.185Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
