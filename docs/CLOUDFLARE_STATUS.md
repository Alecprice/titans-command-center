# Cloudflare deployment status

- Status: **deployed + Market Pulse browser regression failure**
- Source commit: `7070e774f475fe67cc9d8502c87715b12dd014f0`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `7070e774f475fe67cc9d8502c87715b12dd014f0`
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
- Recorded: 2026-09-11T19:29:34Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "expectedCommit": "7070e774f475fe67cc9d8502c87715b12dd014f0",
  "deployedCommit": "7070e774f475fe67cc9d8502c87715b12dd014f0",
  "rollbackCommit": "7070e774f475fe67cc9d8502c87715b12dd014f0",
  "rollbackCurrent": true,
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
    "requestId": "q7P3sj_ic25FUqUBrHEWkqm-xkn2Vs9Am6o-lB3LAKrIJJWV3vUD8g==",
    "pop": "ORD51-P2",
    "via": "1.1 1a838178b64b3a555224c495e5136f84.cloudfront.net (CloudFront)",
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
    "canonicalMeta": 427,
    "originMeta": 111,
    "canonicalRoot": 103,
    "originRoot": 101,
    "health": 213,
    "originHealth": 121
  },
  "testedAt": "2026-09-11T19:28:38.703Z"
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
  "marketRows": 818,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "7070e774f475fe67cc9d8502c87715b12dd014f0",
    "builtAt": "2026-09-11T19:28:22.274Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 42,
    "health": 89,
    "data": 155,
    "stats": 665,
    "market": 1374,
    "analytics": 167
  },
  "testedAt": "2026-09-11T19:28:50.611Z",
  "healthTruth": {
    "ok": true,
    "mode": "d1-snapshot",
    "status": 200,
    "healthStatus": "healthy",
    "contentAudit": "2026-09-02",
    "dataAudit": "2026-09-11",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": true,
    "edgeCacheStatus": "HIT",
    "responseMs": 178,
    "testedAt": "2026-09-11T19:28:51.029Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 111,
    "warmHitMs": 111,
    "rows": 818,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 111,
        "rows": 818
      }
    ],
    "testedAt": "2026-09-11T19:28:51.173Z"
  },
  "analyticsStatus": 200,
  "analyticsMode": "cloudflare-d1-stale",
  "analyticsHealthStatus": "healthy",
  "analyticsDatabaseAvailable": true,
  "analyticsStorage": "cloudflare-d1",
  "analyticsSnapshotSource": "nflreadpy-d1-snapshot",
  "analyticsSnapshotStale": true,
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
  "events": 8,
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
  "fetchedAt": "2026-09-11T19:28:51.869Z",
  "testedAt": "2026-09-11T19:28:52.307Z"
}```

## Player headshot production regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "season": 2026,
  "generatedAt": "2026-09-11T15:12:50.893527+00:00",
  "rosterRows": 95,
  "headshotCount": 93,
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
  "durationMs": 279,
  "testedAt": "2026-09-11T19:28:51.733Z"
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
  "maxLongTaskMs": 79,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 26.21,
  "testedAt": "2026-09-11T19:29:24Z"
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
      "iframeSrc": "https://www.youtube.com/embed/nCKixynei0I?autoplay=0&playsinline=1&rel=0&origin=https%3A%2F%2Ftitans.alecjprice.com&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Ftitans.alecjprice.com%2F%23media&aoriginsup=1&vf=1",
      "videoId": "nCKixynei0I"
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
      "message": "https://www.youtube.com/s/player/8c3fda2d/www-widgetapi.vflset/www-widgetapi.js 146 Unrecognized feature: 'web-share'.",
      "source": "other",
      "timestamp": 1789154967656
    }
  ],
  "durationSeconds": 3.7,
  "testedAt": "2026-09-11T19:29:28Z"
}```

## Market Pulse browser regression

```json
{
  "ok": false,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "initial": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 94,
        "total": 818,
        "renderedRows": 72
      },
      "summary": {
        "controls": [
          {
            "disabled": false,
            "height": 44,
            "id": "mh-event-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 423
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-book-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 160
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-category-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 160
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-alt-toggle",
            "pressed": "false",
            "tag": "BUTTON",
            "value": "",
            "width": 189.671875
          }
        ],
        "empty": "",
        "errorVisible": false,
        "overflow": false,
        "provider": "PropLine",
        "quality": "Live",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "Matching 94 of 818 rows",
        "resultTotal": 818,
        "rowCount": 72,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine0Price-104Implied51.0%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine0Price+100Implied50.0%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetMGM \u2197SideNew York JetsLine1.5Price-108Implied51.9%"
        ],
        "scrollWidth": 1265,
        "shown": 94,
        "title": "Live Titans market board",
        "total": 818,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "25077",
        "before": "Matching 94 of 818 rows",
        "after": "Matching 48 of 818 rows"
      },
      "book": {
        "available": true,
        "options": 14,
        "selectedValue": "betmgm",
        "before": "Matching 94 of 818 rows",
        "after": "Matching 6 of 818 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Matching 94 of 818 rows",
        "after": "Matching 94 of 818 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 72,
      "afterRows": 72
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 818,
        "total": 818,
        "renderedRows": 72
      },
      "summary": {
        "controls": [
          {
            "disabled": false,
            "height": 44,
            "id": "mh-event-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 423
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-book-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 160
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-category-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 160
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-alt-toggle",
            "pressed": "true",
            "tag": "BUTTON",
            "value": "",
            "width": 183.171875
          }
        ],
        "empty": "",
        "errorVisible": false,
        "overflow": false,
        "provider": "PropLine",
        "quality": "Live",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "Matching 818 of 818 rows",
        "resultTotal": 818,
        "rowCount": 72,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine0Price-104Implied51.0%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine0Price+100Implied50.0%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetMGM \u2197SideNew York JetsLine1.5Price-108Implied51.9%"
        ],
        "scrollWidth": 1265,
        "shown": 818,
        "title": "Live Titans market board",
        "total": 818,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 818,
      "total": 818,
      "renderedRows": 72
    },
    "summary": {
      "controls": [
        {
          "disabled": false,
          "height": 44,
          "id": "mh-event-filter",
          "pressed": null,
          "tag": "SELECT",
          "value": "all",
          "width": 325
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-book-filter",
          "pressed": null,
          "tag": "SELECT",
          "value": "all",
          "width": 325
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-category-filter",
          "pressed": null,
          "tag": "SELECT",
          "value": "all",
          "width": 325
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-alt-toggle",
          "pressed": "true",
          "tag": "BUTTON",
          "value": "",
          "width": 325
        }
      ],
      "empty": "",
      "errorVisible": false,
      "overflow": false,
      "provider": "PropLine",
      "quality": "Live",
      "referenceNotice": "",
      "refreshHeight": 44,
      "result": "Matching 818 of 818 rows",
      "resultTotal": 818,
      "rowCount": 72,
      "rowSample": [
        "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine0Price-104Implied51.0%",
        "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine0Price+100Implied50.0%",
        "New York Jets at Tennessee Titans Spread \u00b7 BetMGM \u2197SideNew York JetsLine1.5Price-108Implied51.9%"
      ],
      "scrollWidth": 375,
      "shown": 818,
      "title": "Live Titans market board",
      "total": 818,
      "viewport": 375
    },
    "rowGeometry": [
      {
        "height": 165.765625,
        "left": 12,
        "right": 363,
        "width": 351
      },
      {
        "height": 165.765625,
        "left": 12,
        "right": 363,
        "width": 351
      },
      {
        "height": 165.765625,
        "left": 12,
        "right": 363,
        "width": 351
      },
      {
        "height": 165.765625,
        "left": 12,
        "right": 363,
        "width": 351
      }
    ]
  },
  "browserWarnings": [
    "https://titans.alecjprice.com/legacy-heritage-v3.js - Failed to load resource: net::ERR_FAILED",
    "https://titans.alecjprice.com/legacy-trails-v4.js - Failed to load resource: net::ERR_FAILED"
  ],
  "desktopLoadAttempts": 1,
  "stage": "console",
  "error": "RuntimeError: Market browser console errors: ['https://titans.alecjprice.com/legacy-heritage-v3.js - Failed to load resource: net::ERR_FAILED', 'https://titans.alecjprice.com/legacy-trails-v4.js - Failed to load resource: net::ERR_FAILED']",
  "state": {
    "controls": [
      {
        "disabled": false,
        "height": 44,
        "id": "mh-event-filter",
        "pressed": null,
        "tag": "SELECT",
        "value": "all",
        "width": 325
      },
      {
        "disabled": false,
        "height": 44,
        "id": "mh-book-filter",
        "pressed": null,
        "tag": "SELECT",
        "value": "all",
        "width": 325
      },
      {
        "disabled": false,
        "height": 44,
        "id": "mh-category-filter",
        "pressed": null,
        "tag": "SELECT",
        "value": "all",
        "width": 325
      },
      {
        "disabled": false,
        "height": 44,
        "id": "mh-alt-toggle",
        "pressed": "true",
        "tag": "BUTTON",
        "value": "",
        "width": 325
      }
    ],
    "empty": "",
    "errorVisible": false,
    "overflow": false,
    "provider": "PropLine",
    "quality": "Live",
    "referenceNotice": "",
    "refreshHeight": 44,
    "result": "Matching 818 of 818 rows",
    "resultTotal": 818,
    "rowCount": 72,
    "rowSample": [
      "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine0Price-104Implied51.0%",
      "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine0Price+100Implied50.0%",
      "New York Jets at Tennessee Titans Spread \u00b7 BetMGM \u2197SideNew York JetsLine1.5Price-108Implied51.9%"
    ],
    "scrollWidth": 375,
    "shown": 818,
    "title": "Live Titans market board",
    "total": 818,
    "viewport": 375
  },
  "durationSeconds": 5.66,
  "testedAt": "2026-09-11T19:29:34Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
