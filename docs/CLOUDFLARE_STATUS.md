# Cloudflare deployment status

- Status: **deployed + Ticket Center browser regression failure**
- Source commit: `9ecafcee088c2896e06d0c2ab02e652432c81728`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `9ecafcee088c2896e06d0c2ab02e652432c81728`
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
- Market Pulse browser regression: success
- Ticket Center browser regression: failure
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
- Recorded: 2026-09-02T21:34:00Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "deployedCommit": "9ecafcee088c2896e06d0c2ab02e652432c81728",
  "version": "1.0.0",
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
    "requestId": "_T8bhGfYPRyE27ZmT9_mrhm1U5cxRBoGvsRnA2LIdqWrPryveioLEw==",
    "pop": "IAD55-P2",
    "via": "1.1 d835a04e842d9117fd810e7c8479dad4.cloudfront.net (CloudFront)",
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
    "status": "degraded",
    "databaseProvider": "cloudflare-d1",
    "databaseConfigured": true,
    "snapshotFresh": false
  },
  "responseMs": {
    "canonicalMeta": 464,
    "originMeta": 347,
    "canonicalRoot": 168,
    "originRoot": 115,
    "health": 247
  },
  "testedAt": "2026-09-02T21:32:32.657Z"
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
  "serviceWorkerCache": "titans-cc-brand-2026-v83",
  "precachePaths": 143,
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
  "marketRows": 0,
  "marketMode": "no-current-source",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "9ecafcee088c2896e06d0c2ab02e652432c81728",
    "builtAt": "2026-09-02T21:32:15.682Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 117,
    "health": 254,
    "data": 614,
    "stats": 272,
    "market": 2678,
    "analytics": 463
  },
  "testedAt": "2026-09-02T21:32:59.455Z",
  "healthTruth": {
    "ok": true,
    "mode": "d1-snapshot",
    "status": 200,
    "healthStatus": "healthy",
    "contentAudit": "2026-08-31",
    "dataAudit": "2026-09-02",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": true,
    "edgeCacheStatus": "HIT",
    "responseMs": 196,
    "testedAt": "2026-09-02T21:32:59.865Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "MISS",
    "finalStatus": "HIT",
    "attempts": 2,
    "coldOrInitialMs": 768,
    "warmHitMs": 37,
    "rows": 0,
    "sequence": [
      {
        "status": "MISS",
        "durationMs": 768,
        "rows": 0
      },
      {
        "status": "HIT",
        "durationMs": 37,
        "rows": 0
      }
    ],
    "testedAt": "2026-09-02T21:33:01.048Z"
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
  "fetchedAt": "2026-09-02T21:33:01.861Z",
  "testedAt": "2026-09-02T21:33:02.189Z"
}```

## Player headshot production regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "season": 2026,
  "generatedAt": "2026-09-02T15:18:26.534763+00:00",
  "rosterRows": 94,
  "headshotCount": 92,
  "coveragePct": 97.9,
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
  "durationMs": 169,
  "testedAt": "2026-09-02T21:33:01.738Z"
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
      "height": 56,
      "label": "Home",
      "width": 69.796875
    },
    {
      "height": 56,
      "label": "Roster",
      "width": 69.796875
    },
    {
      "height": 56,
      "label": "Game",
      "width": 69.796875
    },
    {
      "height": 56,
      "label": "Search",
      "width": 69.796875
    },
    {
      "height": 56,
      "label": "More",
      "width": 69.8125
    }
  ],
  "maxLongTaskMs": 271,
  "longTasksOver250ms": 1,
  "browserWarnings": [],
  "durationSeconds": 23.95,
  "testedAt": "2026-09-02T21:33:32Z"
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
      "iframeSrc": "https://www.youtube.com/embed/7klfQpwgprk?autoplay=0&playsinline=1&rel=0&origin=https%3A%2F%2Ftitans.alecjprice.com&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Ftitans.alecjprice.com%2F%23media&aoriginsup=1&vf=1",
      "videoId": "7klfQpwgprk"
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
      "message": "https://www.youtube.com/s/player/e937390a/www-widgetapi.vflset/www-widgetapi.js 146 Unrecognized feature: 'web-share'.",
      "source": "other",
      "timestamp": 1788384815765
    }
  ],
  "durationSeconds": 3.6,
  "testedAt": "2026-09-02T21:33:36Z"
}```

## Market Pulse browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "initial": {
      "state": {
        "quality": "Unavailable",
        "provider": "No verified current market source",
        "shown": null,
        "total": 0,
        "renderedRows": 0
      },
      "summary": {
        "controls": [],
        "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
        "errorVisible": false,
        "overflow": false,
        "provider": "No verified current market source",
        "quality": "Unavailable",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "",
        "resultTotal": null,
        "rowCount": 0,
        "rowSample": [],
        "scrollWidth": 1265,
        "shown": null,
        "title": "Titans market status",
        "total": 0,
        "viewport": 1265
      }
    },
    "refresh": {
      "state": {
        "quality": "Unavailable",
        "provider": "No verified current market source",
        "shown": null,
        "total": 0,
        "renderedRows": 0
      },
      "summary": {
        "controls": [],
        "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
        "errorVisible": false,
        "overflow": false,
        "provider": "No verified current market source",
        "quality": "Unavailable",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "",
        "resultTotal": null,
        "rowCount": 0,
        "rowSample": [],
        "scrollWidth": 1265,
        "shown": null,
        "title": "Titans market status",
        "total": 0,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Unavailable",
      "provider": "No verified current market source",
      "shown": null,
      "total": 0,
      "renderedRows": 0
    },
    "summary": {
      "controls": [],
      "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
      "errorVisible": false,
      "overflow": false,
      "provider": "No verified current market source",
      "quality": "Unavailable",
      "referenceNotice": "",
      "refreshHeight": 44,
      "result": "",
      "resultTotal": null,
      "rowCount": 0,
      "rowSample": [],
      "scrollWidth": 375,
      "shown": null,
      "title": "Titans market status",
      "total": 0,
      "viewport": 375
    },
    "rowGeometry": []
  },
  "browserWarnings": [],
  "durationSeconds": 2.12,
  "testedAt": "2026-09-02T21:33:38Z"
}```

## Ticket Center browser regression

```json
{
  "ok": false,
  "base": "https://titans.alecjprice.com",
  "desktop": {},
  "mobile": {},
  "browserWarnings": [],
  "stage": "desktop:wait",
  "error": "TimeoutException: Message: \n",
  "state": null,
  "durationSeconds": 21.29,
  "testedAt": "2026-09-02T21:34:00Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
