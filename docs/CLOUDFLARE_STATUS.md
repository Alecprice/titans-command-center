# Cloudflare deployment status

- Status: **deployed + Market Pulse browser regression failure**
- Source commit: `1b8a83d502a06fb08770125301c268750bb65361`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `1b8a83d502a06fb08770125301c268750bb65361`
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers staged in GitHub: SeatGeek=false, Ticketmaster=false, StubHub=false
- Fan Event secrets staged in GitHub: Eventbrite=false, Eventbrite org IDs=false, Skiddle=false
- Fan Event runtime readiness: see the production regression evidence below; direct Worker secrets may be configured even when GitHub staging is false
- Deploy outcome: success
- Canonical front door: success
- Production regression: success
- Fan Events production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Market Pulse browser regression: failure
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
- Recorded: 2026-09-06T12:03:13Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "expectedCommit": "1b8a83d502a06fb08770125301c268750bb65361",
  "deployedCommit": "1b8a83d502a06fb08770125301c268750bb65361",
  "rollbackCommit": "b34852eb8e014764238abeaa576628d1f3141bc2",
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
    "requestId": "AG22-Jmo9a6t2wwD9_I2padOm76wdruF3UAQhjSaX5ahflzxshTFJw==",
    "pop": "DFW57-P1",
    "via": "1.1 71ab92edd02bc8ec941d842529d753d0.cloudfront.net (CloudFront)",
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
    "canonicalMeta": 358,
    "originMeta": 198,
    "canonicalRoot": 73,
    "originRoot": 180,
    "health": 167,
    "originHealth": 213
  },
  "testedAt": "2026-09-06T12:01:59.637Z"
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
  "marketRows": 608,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "1b8a83d502a06fb08770125301c268750bb65361",
    "builtAt": "2026-09-06T12:01:40.384Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 33,
    "health": 139,
    "data": 201,
    "stats": 135,
    "market": 760,
    "analytics": 196
  },
  "testedAt": "2026-09-06T12:02:07.163Z",
  "healthTruth": {
    "ok": true,
    "mode": "d1-snapshot",
    "status": 200,
    "healthStatus": "healthy",
    "contentAudit": "2026-09-02",
    "dataAudit": "2026-09-06",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": true,
    "edgeCacheStatus": "HIT",
    "responseMs": 228,
    "testedAt": "2026-09-06T12:02:07.608Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 122,
    "warmHitMs": 122,
    "rows": 608,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 122,
        "rows": 608
      }
    ],
    "testedAt": "2026-09-06T12:02:07.757Z"
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

## Fan Events production regression

```json
{
  "ok": true,
  "endpoint": "https://titans.alecjprice.com/api/fan-events",
  "events": 6,
  "providersConfigured": 3,
  "providersAvailable": 3,
  "providersContributing": 1,
  "providerFailures": 0,
  "configuredProviders": {
    "ticketmaster": true,
    "seatgeek": false,
    "eventbrite": true,
    "skiddle": true
  },
  "providers": [
    "Ticketmaster",
    "Eventbrite",
    "Skiddle"
  ],
  "fetchedAt": "2026-09-06T12:02:08.359Z",
  "testedAt": "2026-09-06T12:02:08.753Z"
}```

## Player headshot production regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "season": 2026,
  "generatedAt": "2026-09-05T14:00:53.017490+00:00",
  "rosterRows": 93,
  "headshotCount": 91,
  "coveragePct": 97.8,
  "omittedCount": 2,
  "omissionReasons": {
    "no-approved-headshot-url": 2
  },
  "omittedPlayers": [
    {
      "name": "Corey Mayfield Jr.",
      "number": "13",
      "position": "DB",
      "status": "CUT",
      "reason": "no-approved-headshot-url"
    },
    {
      "name": "Keydrain Calligan",
      "number": "29",
      "position": "DB",
      "status": "CUT",
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
  "durationMs": 137,
  "testedAt": "2026-09-06T12:02:08.208Z"
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
  "rosterTotal": 60,
  "mobileViewportState": {
    "clientWidth": 390,
    "innerHeight": 844,
    "innerWidth": 390,
    "mobile": true
  },
  "smallPhoneViewportState": {
    "clientWidth": 320,
    "innerHeight": 760,
    "innerWidth": 320,
    "mobile": true
  },
  "mobileTargets": [
    {
      "height": 56,
      "label": "Home",
      "width": 72.796875
    },
    {
      "height": 56,
      "label": "Roster",
      "width": 72.796875
    },
    {
      "height": 56,
      "label": "Game",
      "width": 72.796875
    },
    {
      "height": 56,
      "label": "Search",
      "width": 72.796875
    },
    {
      "height": 56,
      "label": "More",
      "width": 72.8125
    }
  ],
  "maxLongTaskMs": 161,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 29.26,
  "testedAt": "2026-09-06T12:02:49Z"
}```

## Listen Watch browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "shellLoadRetries": 0,
  "transientShellAssetFailures": 0,
  "territoryChecks": [
    "Elsewhere in U.S.",
    "International",
    "Nashville / Middle Tennessee"
  ],
  "quickStart": {
    "cards": 2,
    "labels": [
      "Watch Titans coverage: Set up your stream",
      "Listen to Titans coverage: Listen to Titans Radio"
    ],
    "listenHref": "https://www.tennesseetitans.com/broadcast/titans-radio/live-game-day-audio",
    "phase": "upcoming",
    "present": true,
    "result": "",
    "watchHref": "https://www.paramountplus.com/shows/nfl-on-cbs/"
  },
  "officialTitansAudio": true,
  "official1045Player": true,
  "rawEmbeddedAudio": false,
  "youtube": {
    "configured": true,
    "available": true,
    "videos": 10,
    "liveRightsExcluded": true,
    "lazyBeforePlay": true,
    "iframeAfterPlay": {
      "attempted": true,
      "fallback": false,
      "fallbackText": "",
      "iframe": true,
      "iframeApiScript": true,
      "iframeSrc": "https://www.youtube.com/embed/CAtJg6U-qKM?autoplay=0&playsinline=1&rel=0&origin=https%3A%2F%2Ftitans.alecjprice.com&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Ftitans.alecjprice.com%2F%23media&aoriginsup=1&vf=1",
      "videoId": "CAtJg6U-qKM"
    }
  },
  "mobileAreaTargets": [
    {
      "h": 44,
      "label": "Nashville / Middle Tennessee"
    },
    {
      "h": 44,
      "label": "Elsewhere in U.S."
    },
    {
      "h": 44,
      "label": "International"
    }
  ],
  "mobileTimeRows": 4,
  "mobileQuickStart": {
    "phase": "upcoming",
    "cards": 2,
    "targets": [
      186.34375,
      258.34375
    ],
    "labels": [
      "Watch Titans coverage: Set up your stream",
      "Listen to Titans coverage: Listen to Titans Radio"
    ]
  },
  "mobileYoutubeCards": 12,
  "browserWarnings": [
    {
      "level": "WARNING",
      "message": "https://www.youtube.com/s/player/f572e43c/www-widgetapi.vflset/www-widgetapi.js 146 Unrecognized feature: 'web-share'.",
      "source": "other",
      "timestamp": 1788696172952
    }
  ],
  "durationSeconds": 3.83,
  "testedAt": "2026-09-06T12:02:53Z"
}```

## Market Pulse browser regression

```json
{
  "ok": false,
  "base": "https://titans.alecjprice.com",
  "desktop": {},
  "mobile": {},
  "browserWarnings": [],
  "stage": "desktop:load",
  "error": "TimeoutException: Message: \n",
  "state": null,
  "durationSeconds": 18.83,
  "testedAt": "2026-09-06T12:03:12Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
