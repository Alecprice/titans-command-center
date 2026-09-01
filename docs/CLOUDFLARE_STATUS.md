# Cloudflare deployment status

- Status: **deployed + Listen Watch browser regression failure**
- Source commit: `385ec34bf698f99bcf59ecba94d6709996696e12`
- Quality gate: success
- Cloudflare credentials available: true
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
- Deploy outcome: success
- Canonical front door: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: failure
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
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-09-01T14:52:43Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "deployedCommit": "385ec34bf698f99bcf59ecba94d6709996696e12",
  "version": "1.0.0",
  "revisionAttempts": 1,
  "cloudFront": {
    "requestId": "W25Sa9MD0AkAnEL-8sq3hbtevoV6-bYfYL5eMSYzYrKC9DSYrUU5Lw==",
    "pop": "IAD55-P2",
    "via": "1.1 640e1fde1214554c9f15c8cb85df826a.cloudfront.net (CloudFront)",
    "cache": "Miss from cloudfront"
  },
  "canonicalSecurity": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com https://i.ytimg.com; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "",
    "csp": true
  },
  "originRobots": "noindex, nofollow",
  "health": {
    "status": "degraded",
    "databaseProvider": "cloudflare-d1",
    "databaseConfigured": true,
    "snapshotFresh": false
  },
  "responseMs": {
    "canonicalMeta": 227,
    "originMeta": 150,
    "canonicalRoot": 34,
    "originRoot": 27,
    "health": 366
  },
  "testedAt": "2026-09-01T14:52:04.856Z"
}```

## Production regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "rootStatus": 200,
  "securityHeaders": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com https://i.ytimg.com; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v76",
  "precachePaths": 131,
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
  "databaseProvider": "cloudflare-d1",
  "databaseConfigured": true,
  "databaseOk": false,
  "snapshotFresh": false,
  "dataMode": "audited-fallback",
  "databaseAvailable": false,
  "dataStatus": 200,
  "dataRosterCount": 61,
  "transactionCount": 7,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 61,
  "statsRosterMode": "d1-snapshot",
  "statsRosterSource": "Tennessee Titans official roster / transaction snapshot · Cloudflare D1",
  "completedPreseasonGamebooks": 3,
  "completedPreseasonGames": 3,
  "completedPreseasonGamesWithPlayerStats": 3,
  "completedPreseasonGamesMissingPlayerStats": 0,
  "marketStatus": 200,
  "marketRows": 608,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "385ec34bf698f99bcf59ecba94d6709996696e12",
    "builtAt": "2026-09-01T14:51:48.090Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 43,
    "health": 144,
    "data": 318,
    "stats": 152,
    "market": 1778,
    "analytics": 251
  },
  "testedAt": "2026-09-01T14:52:12.784Z",
  "healthTruth": {
    "ok": true,
    "mode": "d1-primary-cached-fallback",
    "status": 200,
    "healthStatus": "healthy",
    "contentAudit": "2026-08-31",
    "dataAudit": "2026-08-31",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": true,
    "edgeCacheStatus": "HIT",
    "responseMs": 219,
    "testedAt": "2026-09-01T14:52:13.235Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 109,
    "warmHitMs": 109,
    "rows": 608,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 109,
        "rows": 608
      }
    ],
    "testedAt": "2026-09-01T14:52:13.376Z"
  },
  "analyticsStatus": 200,
  "analyticsMode": "cloudflare-d1",
  "analyticsHealthStatus": "healthy",
  "analyticsDatabaseAvailable": true,
  "analyticsStorage": "cloudflare-d1",
  "analyticsSnapshotSource": "nflreadpy-d1-snapshot",
  "analyticsSnapshotStale": false,
  "analyticsDataSeason": 2025,
  "analyticsSeasonFallback": true,
  "analyticsWarehousePlays": 48771,
  "analyticsPersonnelPlays": 45184,
  "analyticsRecentPlays": 80,
  "analyticsPersonnelRows": 20,
  "analyticsOffensiveEpaPerPlay": -0.14842680811935152,
  "analyticsDefensiveEpaPerPlayAllowed": 0.10385631037224925,
  "analyticsPaceSecondsPerPlay": 28.914001158972834,
  "analyticsLatestRestDays": 7
}```

## Player headshot production regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "season": 2026,
  "generatedAt": "2026-08-31T18:09:01.918664+00:00",
  "rosterRows": 103,
  "headshotCount": 99,
  "coveragePct": 96.1,
  "omittedCount": 4,
  "omissionReasons": {
    "no-approved-headshot-url": 4
  },
  "omittedPlayers": [
    {
      "name": "Corey Mayfield Jr.",
      "number": "13",
      "position": "DB",
      "status": "ACT",
      "reason": "no-approved-headshot-url"
    },
    {
      "name": "Keydrain Calligan",
      "number": "29",
      "position": "DB",
      "status": "ACT",
      "reason": "no-approved-headshot-url"
    },
    {
      "name": "Latrell McCutchin",
      "number": "36",
      "position": "DB",
      "status": "ACT",
      "reason": "no-approved-headshot-url"
    },
    {
      "name": "Shad Banks",
      "number": "40",
      "position": "LB",
      "status": "ACT",
      "reason": "no-approved-headshot-url"
    }
  ],
  "allowedHosts": [
    "static.clubs.nfl.com",
    "static.www.nfl.com",
    "static.nfl.com",
    "a.espncdn.com",
    "a1.espncdn.com"
  ],
  "durationMs": 129,
  "testedAt": "2026-09-01T14:52:13.860Z"
}```

## Browser navigation regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktopRounds": 3,
  "transactionChecks": 12,
  "mobileChecks": 14,
  "smallPhoneChecks": 2,
  "smartSearchQuickJump": true,
  "mobileDrawerInert": true,
  "fiveActionDock": true,
  "teamRoomChecks": 4,
  "rosterFilterReset": true,
  "rosterTotal": 61,
  "mobileTargets": [
    {
      "height": 58,
      "label": "Home",
      "width": 69.796875
    },
    {
      "height": 58,
      "label": "Roster",
      "width": 69.796875
    },
    {
      "height": 58,
      "label": "Game",
      "width": 69.796875
    },
    {
      "height": 58,
      "label": "Search",
      "width": 69.796875
    },
    {
      "height": 58,
      "label": "More",
      "width": 69.8125
    }
  ],
  "maxLongTaskMs": 143,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 14.04,
  "testedAt": "2026-09-01T14:52:31Z"
}```

## Listen Watch browser regression

```json
{
  "ok": false,
  "base": "https://titans.alecjprice.com",
  "stage": "desktop:home",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 10.94,
  "testedAt": "2026-09-01T14:52:42Z",
  "hash": "#home",
  "pageText": "",
  "browserWarnings": [
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/usability-runtime.js?v=26 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/smart-search-v111.js?v=1 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/mobile-navigation-v112.js?v=2 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/account-sync-v112.js?v=2 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/account-v112.js?v=3 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/app.js - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/legacy-polish.js?v=21 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/fact-polish.js?v=21 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/ux-polish.js?v=29 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/player-polish.js - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352470
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/headshot-polish.js?v=31 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352477
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/fan-polish.js?v=27 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352477
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/team-room.js?v=28 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352477
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/team-room-state-repair-v54.js?v=1 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352477
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/source-activity.js?v=27 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352477
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/transactions-hub.js?v=24 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352477
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/stats-hub.js?v=22 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352481
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/analytics-hub.js?v=30 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352481
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/market-hub.js?v=27 - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352481
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/accessibility-runtime.js - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788274352481
    }
  ]
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
