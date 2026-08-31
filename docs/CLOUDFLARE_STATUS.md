# Cloudflare deployment status

- Status: **deployed + browser navigation regression cancelled**
- Source commit: `f02ea7514a2147fa4c7d01a0ce3e0b59a71483c9`
- Quality gate: success
- Cloudflare credentials available: true
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
- Deploy outcome: success
- Canonical front door: success
- Production regression: success
- Browser navigation regression: cancelled
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
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-31T22:31:53Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "deployedCommit": "f02ea7514a2147fa4c7d01a0ce3e0b59a71483c9",
  "version": "1.0.0",
  "cloudFront": {
    "requestId": "nC1jC49iE5r1yt4jh0s6NROJs6m8bHN0edXvg6dHcxAlIPLy-l_bUg==",
    "pop": "ORD51-P2",
    "via": "1.1 b35909f0d8c90a899749b6603124ca90.cloudfront.net (CloudFront)",
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
    "canonicalMeta": 262,
    "originMeta": 77,
    "canonicalRoot": 221,
    "originRoot": 210,
    "health": 367
  },
  "testedAt": "2026-08-31T22:31:30.936Z"
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
  "databaseProvider": "cloudflare-d1",
  "databaseConfigured": true,
  "databaseOk": false,
  "snapshotFresh": false,
  "dataMode": "audited-fallback",
  "databaseAvailable": false,
  "dataStatus": 200,
  "dataRosterCount": 95,
  "transactionCount": 4,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 95,
  "statsRosterMode": "d1-snapshot",
  "statsRosterSource": "Tennessee Titans official roster / transaction snapshot · Cloudflare D1",
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
    "commit": "f02ea7514a2147fa4c7d01a0ce3e0b59a71483c9",
    "builtAt": "2026-08-31T22:31:16.031Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 29,
    "health": 89,
    "data": 84,
    "stats": 225,
    "market": 1137,
    "analytics": 224
  },
  "testedAt": "2026-08-31T22:31:37.407Z",
  "healthTruth": {
    "ok": true,
    "mode": "audited-fallback",
    "status": 200,
    "healthStatus": "degraded",
    "contentAudit": "2026-08-27",
    "fallbackContentAudit": "2026-08-29",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": false,
    "responseMs": 186,
    "testedAt": "2026-08-31T22:31:37.632Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 108,
    "warmHitMs": 108,
    "rows": 608,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 108,
        "rows": 608
      }
    ],
    "testedAt": "2026-08-31T22:31:37.774Z"
  },
  "analyticsStatus": 200,
  "analyticsMode": "cloudflare-d1",
  "analyticsHealthStatus": "degraded",
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
  "durationMs": 173,
  "testedAt": "2026-08-31T22:31:38.279Z"
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
  "rosterTotal": 95,
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
  "maxLongTaskMs": 563,
  "longTasksOver250ms": 1,
  "browserWarnings": [],
  "durationSeconds": 10.47,
  "testedAt": "2026-08-31T22:31:52Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
