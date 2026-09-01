# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `b14e73caa853e436a2824391ab84faed792b01bd`
- Quality gate: success
- Cloudflare credentials available: true
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
- Deploy outcome: success
- Canonical front door: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Market Pulse browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: failure
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-09-01T15:39:34Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "deployedCommit": "b14e73caa853e436a2824391ab84faed792b01bd",
  "version": "1.0.0",
  "revisionAttempts": 6,
  "cloudFront": {
    "requestId": "hAKqeal8qdMwIID3qcxo5SRAqVv1s3WB_RSp_d27LCHPRBEIEBU33w==",
    "pop": "LAX54-P3",
    "via": "1.1 717030a52a6435aeb5003229c9a80e94.cloudfront.net (CloudFront)",
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
    "canonicalMeta": 204,
    "originMeta": 77,
    "canonicalRoot": 346,
    "originRoot": 86,
    "health": 669
  },
  "testedAt": "2026-09-01T15:38:06.982Z"
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
    "commit": "b14e73caa853e436a2824391ab84faed792b01bd",
    "builtAt": "2026-09-01T15:37:37.592Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 96,
    "health": 381,
    "data": 367,
    "stats": 259,
    "market": 8197,
    "analytics": 390
  },
  "testedAt": "2026-09-01T15:38:39.210Z",
  "healthTruth": {
    "ok": true,
    "mode": "d1-snapshot",
    "status": 200,
    "healthStatus": "healthy",
    "contentAudit": "2026-08-31",
    "dataAudit": "2026-09-01",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": true,
    "edgeCacheStatus": "HIT",
    "responseMs": 379,
    "testedAt": "2026-09-01T15:38:40.080Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 211,
    "warmHitMs": 211,
    "rows": 608,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 211,
        "rows": 608
      }
    ],
    "testedAt": "2026-09-01T15:38:40.321Z"
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
  "generatedAt": "2026-09-01T15:33:23.680884+00:00",
  "rosterRows": 85,
  "headshotCount": 83,
  "coveragePct": 97.6,
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
  "durationMs": 328,
  "testedAt": "2026-09-01T15:38:41.131Z"
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
  "maxLongTaskMs": 55,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 14.69,
  "testedAt": "2026-09-01T15:39:00Z"
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
      "iframeSrc": "https://www.youtube.com/embed/WDfCsnILy-Q?autoplay=0&playsinline=1&rel=0&origin=https%3A%2F%2Ftitans.alecjprice.com&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Ftitans.alecjprice.com%2F%23media&aoriginsup=1&vf=1",
      "videoId": "WDfCsnILy-Q"
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
  "mobileYoutubeCards": 6,
  "browserWarnings": [
    {
      "level": "WARNING",
      "message": "https://www.youtube.com/s/player/e937390a/www-widgetapi.vflset/www-widgetapi.js 146 Unrecognized feature: 'web-share'.",
      "source": "other",
      "timestamp": 1788277143436
    }
  ],
  "durationSeconds": 3.3,
  "testedAt": "2026-09-01T15:39:03Z"
}```

## Market Pulse browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "initial": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 75,
        "total": 608,
        "renderedRows": 75
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
        "result": "Showing 75 of 608 rows",
        "resultTotal": 608,
        "rowCount": 75,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine1.5Price-108Implied51.9%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine1.5Price-105Implied51.2%",
          "New York Jets at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideNew York JetsLine1.5Price-103Implied50.7%"
        ],
        "scrollWidth": 1265,
        "shown": 75,
        "title": "Live Titans market board",
        "total": 608,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "25077",
        "before": "Showing 75 of 608 rows",
        "after": "Showing 67 of 608 rows"
      },
      "book": {
        "available": true,
        "options": 11,
        "selectedValue": "betonlineag",
        "before": "Showing 75 of 608 rows",
        "after": "Showing 6 of 608 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 75 of 608 rows",
        "after": "Showing 75 of 608 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 75,
      "afterRows": 608
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 608,
        "total": 608,
        "renderedRows": 608
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
        "result": "Showing 608 of 608 rows",
        "resultTotal": 608,
        "rowCount": 608,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine1.5Price-108Implied51.9%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine1.5Price-105Implied51.2%",
          "New York Jets at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideNew York JetsLine1.5Price-103Implied50.7%"
        ],
        "scrollWidth": 1265,
        "shown": 608,
        "title": "Live Titans market board",
        "total": 608,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 608,
      "total": 608,
      "renderedRows": 608
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
          "width": 331
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-book-filter",
          "pressed": null,
          "tag": "SELECT",
          "value": "all",
          "width": 331
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-category-filter",
          "pressed": null,
          "tag": "SELECT",
          "value": "all",
          "width": 331
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-alt-toggle",
          "pressed": "true",
          "tag": "BUTTON",
          "value": "",
          "width": 331
        }
      ],
      "empty": "",
      "errorVisible": false,
      "overflow": false,
      "provider": "PropLine",
      "quality": "Live",
      "referenceNotice": "",
      "refreshHeight": 44,
      "result": "Showing 608 of 608 rows",
      "resultTotal": 608,
      "rowCount": 608,
      "rowSample": [
        "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine1.5Price-108Implied51.9%",
        "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine1.5Price-105Implied51.2%",
        "New York Jets at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideNew York JetsLine1.5Price-103Implied50.7%"
      ],
      "scrollWidth": 375,
      "shown": 608,
      "title": "Live Titans market board",
      "total": 608,
      "viewport": 375
    },
    "rowGeometry": [
      {
        "height": 142.09375,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 142.09375,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 142.09375,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 142.09375,
        "left": 9,
        "right": 366,
        "width": 357
      }
    ]
  },
  "browserWarnings": [],
  "durationSeconds": 11.67,
  "testedAt": "2026-09-01T15:39:15Z"
}```

## Command Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "tabsVisited": [
    "changes",
    "press",
    "scheme",
    "global",
    "stadium",
    "gm",
    "history"
  ],
  "addonsVerified": [
    "changes",
    "scheme",
    "global",
    "gm"
  ],
  "spoilerToggle": true,
  "mediaTuneGuideAfterPushState": true,
  "mobileTabTargets": [
    {
      "h": 44,
      "label": "Changes"
    },
    {
      "h": 44,
      "label": "Press Room"
    },
    {
      "h": 44,
      "label": "Scheme Lab"
    },
    {
      "h": 44,
      "label": "Global Fans"
    },
    {
      "h": 44,
      "label": "Stadium"
    },
    {
      "h": 44,
      "label": "Fan GM"
    },
    {
      "h": 44,
      "label": "Time Machine"
    }
  ],
  "mobileViewport": 375,
  "browserWarnings": [],
  "durationSeconds": 2.02,
  "testedAt": "2026-09-01T15:39:18Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans.alecjprice.com",
  "stage": "player:find",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 14.7,
  "testedAt": "2026-09-01T15:39:33Z",
  "hash": "#roster",
  "pageText": "",
  "cutdownAriaTrace": [],
  "browserWarnings": [
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/app.js - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158897
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/legacy-polish.js?v=21 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158897
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/account-v112.js?v=3 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158901
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/account-sync-v112.js?v=2 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/usability-runtime.js?v=26 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/smart-search-v111.js?v=1 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/mobile-navigation-v112.js?v=2 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/fact-polish.js?v=21 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/ux-polish.js?v=29 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/player-polish.js - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/headshot-polish.js?v=31 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/team-room-state-repair-v54.js?v=1 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158902
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/fan-polish.js?v=27 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158903
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/team-room.js?v=28 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158903
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/source-activity.js?v=27 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158903
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/transactions-hub.js?v=24 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158903
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/stats-hub.js?v=22 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158903
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/analytics-hub.js?v=30 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158903
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/market-hub.js?v=27 - Failed to load resource: net::ERR_CERT_VERIFIER_CHANGED",
      "source": "network",
      "timestamp": 1788277158903
    },
    {
      "level": "SEVERE",
      "message": "https://titans.alecjprice.com/accessibility-runtime.js - Failed to load resource: net::ERR_FAILED",
      "source": "network",
      "timestamp": 1788277158903
    }
  ]
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
