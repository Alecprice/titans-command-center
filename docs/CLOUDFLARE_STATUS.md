# Cloudflare deployment status

- Status: **deployed + production regression failure**
- Source commit: `4b05ca14850fd00ee301663aef6ba3b18221d399`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `4b05ca14850fd00ee301663aef6ba3b18221d399`
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers staged in GitHub: SeatGeek=false, Ticketmaster=false, StubHub=false
- Fan Event secrets staged in GitHub: Eventbrite=false, Eventbrite org IDs=false, Skiddle=false
- Fan Event runtime readiness: see the production regression evidence below; direct Worker secrets may be configured even when GitHub staging is false
- Deploy outcome: success
- Canonical front door: success
- Production regression: failure
- Fan Events production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Market Pulse browser regression: skipped
- Ticket Center browser regression: skipped
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-10-15T15:46:20Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "expectedCommit": "4b05ca14850fd00ee301663aef6ba3b18221d399",
  "deployedCommit": "4b05ca14850fd00ee301663aef6ba3b18221d399",
  "rollbackCommit": "30e553f8328d8d909943b3c2fb1f006a8d0b91c2",
  "rollbackCurrent": false,
  "version": "1.0.0",
  "rollbackVersion": "1.0.0",
  "revisionAttempts": 1,
  "shellPropagationAttempts": 1,
  "shellPaths": [
    "/",
    "/index.html",
    "/sw.js",
    "/app.js",
    "/tickets-price-fallback-v58.js",
    "/tickets-tenx-v123.js",
    "/tickets-compare-v125.js",
    "/tickets-compare-cache-bridge-v141.js"
  ],
  "shellCacheControl": {
    "/": {
      "canonical": "no-store, max-age=0, must-revalidate",
      "origin": "no-store, max-age=0, must-revalidate"
    },
    "/index.html": {
      "canonical": "no-store, max-age=0, must-revalidate",
      "origin": "no-store, max-age=0, must-revalidate"
    },
    "/sw.js": {
      "canonical": "public, max-age=0, must-revalidate, no-store, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate, no-store, max-age=0, must-revalidate"
    },
    "/app.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    },
    "/tickets-price-fallback-v58.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    },
    "/tickets-tenx-v123.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    },
    "/tickets-compare-v125.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    },
    "/tickets-compare-cache-bridge-v141.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    }
  },
  "cloudFront": {
    "requestId": "oPLbSpiv6QOQgSSy6iG2csRpIiZYzUhpcRFXtfvs7TDdArnyDv8wrw==",
    "pop": "IAD55-P2",
    "via": "1.1 edc440dfdd4dccb638ead805c7f4dbfe.cloudfront.net (CloudFront)",
    "cache": "Miss from cloudfront"
  },
  "canonicalSecurity": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com https://i.ytimg.com https://d1plawd8huk6hh.cloudfront.net; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "",
    "csp": true
  },
  "originRobots": "noindex, nofollow",
  "health": {
    "status": "healthy",
    "databaseProvider": "cloudflare-d1",
    "databaseConfigured": true,
    "snapshotFresh": true
  },
  "rollbackHealth": {
    "status": "healthy",
    "databaseProvider": "cloudflare-d1",
    "databaseConfigured": true,
    "snapshotFresh": true
  },
  "responseMs": {
    "canonicalMeta": 517,
    "originMeta": 358,
    "canonicalRoot": 243,
    "originRoot": 135,
    "health": 268,
    "originHealth": 235
  },
  "testedAt": "2026-10-15T15:45:53.637Z"
}```

## Production regression

```json
{
  "ok": false,
  "base": "https://titans.alecjprice.com",
  "rootStatus": 200,
  "securityHeaders": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com https://i.ytimg.com https://d1plawd8huk6hh.cloudfront.net; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v87",
  "precachePaths": 151,
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
  "databaseProvider": "cloudflare-d1",
  "databaseConfigured": true,
  "databaseOk": true,
  "snapshotFresh": true,
  "dataMode": "audited-fallback",
  "databaseAvailable": false,
  "dataStatus": 200,
  "dataRosterCount": 60,
  "transactionCount": 9,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 60,
  "statsRosterMode": "d1-snapshot",
  "statsRosterSource": "Tennessee Titans official roster / transaction snapshot · Cloudflare D1",
  "completedPreseasonGamebooks": 3,
  "completedPreseasonGames": 3,
  "completedPreseasonGamesWithPlayerStats": 3,
  "completedPreseasonGamesMissingPlayerStats": 0,
  "marketStatus": 200,
  "marketRows": 1200,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "4b05ca14850fd00ee301663aef6ba3b18221d399",
    "builtAt": "2026-10-15T15:45:33.743Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 188,
    "health": 217,
    "data": 203,
    "stats": 271,
    "market": 2535
  },
  "testedAt": "2026-10-15T15:46:18.913Z",
  "healthTruth": {
    "ok": true,
    "mode": "d1-snapshot",
    "status": 200,
    "healthStatus": "healthy",
    "contentAudit": "2026-09-02",
    "dataAudit": "2026-10-15",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": true,
    "edgeCacheStatus": "HIT",
    "responseMs": 531,
    "testedAt": "2026-10-15T15:46:19.942Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 278,
    "warmHitMs": 278,
    "rows": 1200,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 278,
        "rows": 1200
      }
    ],
    "testedAt": "2026-10-15T15:46:20.255Z"
  },
  "analyticsError": "Personnel package analytics are missing",
  "analyticsTestedAt": "2026-10-15T15:46:20.563Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
