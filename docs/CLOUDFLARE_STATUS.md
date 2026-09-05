# Cloudflare deployment status

- Status: **deployed + canonical front door + full production + browser + media + market + tickets + command intelligence + fan events + player intelligence + game day + Ask Titans + change intelligence + 365 mode + freshness + account + analytics + player headshot regressions passed**
- Source commit: `264015d021bc32cb93c9701b574cf230c1ceea60`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `264015d021bc32cb93c9701b574cf230c1ceea60`
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
- Ticket Center browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: success
- Ask Titans browser regression: success
- Change Intelligence browser regression: success
- Runtime / 365 Mode browser regression: success
- Data freshness browser regression: success
- Account / Guest browser regression: success
- Advanced analytics browser regression: success
- Player headshot browser regression: success
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-09-05T01:52:24Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "expectedCommit": "264015d021bc32cb93c9701b574cf230c1ceea60",
  "deployedCommit": "264015d021bc32cb93c9701b574cf230c1ceea60",
  "rollbackCommit": "264015d021bc32cb93c9701b574cf230c1ceea60",
  "rollbackCurrent": true,
  "version": "1.0.0",
  "rollbackVersion": "1.0.0",
  "revisionAttempts": 2,
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
    "requestId": "Vvgm0Mj-KYkeLjG_M66zZkZwvXanX-FmU9G-NcDhxX3Eh0M2eoo1Mg==",
    "pop": "ORD51-P2",
    "via": "1.1 c655876185acbbe972af35853e66f8d0.cloudfront.net (CloudFront)",
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
    "canonicalMeta": 42,
    "originMeta": 118,
    "canonicalRoot": 48,
    "originRoot": 41,
    "health": 163,
    "originHealth": 158
  },
  "testedAt": "2026-09-05T01:51:02.743Z"
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
    "commit": "264015d021bc32cb93c9701b574cf230c1ceea60",
    "builtAt": "2026-09-05T01:50:35.626Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 28,
    "health": 126,
    "data": 126,
    "stats": 222,
    "market": 2572,
    "analytics": 233
  },
  "testedAt": "2026-09-05T01:51:12.143Z",
  "healthTruth": {
    "ok": true,
    "mode": "d1-snapshot",
    "status": 200,
    "healthStatus": "healthy",
    "contentAudit": "2026-09-02",
    "dataAudit": "2026-09-05",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": true,
    "edgeCacheStatus": "HIT",
    "responseMs": 233,
    "testedAt": "2026-09-05T01:51:12.597Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 130,
    "warmHitMs": 130,
    "rows": 608,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 130,
        "rows": 608
      }
    ],
    "testedAt": "2026-09-05T01:51:12.794Z"
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
  "events": 5,
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
  "fetchedAt": "2026-09-05T01:51:13.463Z",
  "testedAt": "2026-09-05T01:51:13.901Z"
}```

## Player headshot production regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "season": 2026,
  "generatedAt": "2026-09-04T15:06:28.372623+00:00",
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
  "durationMs": 176,
  "testedAt": "2026-09-05T01:51:13.332Z"
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
  "maxLongTaskMs": 169,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 28.46,
  "testedAt": "2026-09-05T01:51:47Z"
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
      "iframeSrc": "https://www.youtube.com/embed/Fibv3eA6y-M?autoplay=0&playsinline=1&rel=0&origin=https%3A%2F%2Ftitans.alecjprice.com&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Ftitans.alecjprice.com%2F%23media&aoriginsup=1&vf=1",
      "videoId": "Fibv3eA6y-M"
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
      "timestamp": 1788573110586
    }
  ],
  "durationSeconds": 3.59,
  "testedAt": "2026-09-05T01:51:51Z"
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
        "shown": 82,
        "total": 608,
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
        "result": "Matching 82 of 608 rows",
        "resultTotal": 608,
        "rowCount": 72,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine0Price+102Implied49.5%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine0Price+100Implied50.0%",
          "New York Jets at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideNew York JetsLine0Price+107Implied48.3%"
        ],
        "scrollWidth": 1265,
        "shown": 82,
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
        "before": "Matching 82 of 608 rows",
        "after": "Matching 74 of 608 rows"
      },
      "book": {
        "available": true,
        "options": 13,
        "selectedValue": "betonlineag",
        "before": "Matching 82 of 608 rows",
        "after": "Matching 6 of 608 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Matching 82 of 608 rows",
        "after": "Matching 82 of 608 rows"
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
        "shown": 608,
        "total": 608,
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
        "result": "Matching 608 of 608 rows",
        "resultTotal": 608,
        "rowCount": 72,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine0Price+102Implied49.5%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine0Price+100Implied50.0%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetRivers \u2197SideNew York JetsLine2Price-112Implied52.8%"
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
      "result": "Matching 608 of 608 rows",
      "resultTotal": 608,
      "rowCount": 72,
      "rowSample": [
        "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine0Price+102Implied49.5%",
        "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine0Price+100Implied50.0%",
        "New York Jets at Tennessee Titans Spread \u00b7 BetRivers \u2197SideNew York JetsLine2Price-112Implied52.8%"
      ],
      "scrollWidth": 375,
      "shown": 608,
      "title": "Live Titans market board",
      "total": 608,
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
  "browserWarnings": [],
  "durationSeconds": 5.52,
  "testedAt": "2026-09-05T01:51:56Z"
}```

## Ticket Center browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "state": {
      "mode": "comparison",
      "fallbackCards": 0,
      "comparisonCards": 16
    },
    "summary": {
      "comparison": [
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-new-york-jets-nashville-tennessee-09-13-2026/event/1B006470D213F665"
          ],
          "right": 1217,
          "text": "CHEAPEST TITANS TICKET NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. New York Jets Sun, Sep 13, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 MARKETPLACE AVAILABLEVERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-philadelphia-eagles-nashville-tennessee-09-20-2026/event/1B006470D219F66B"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Philadelphia Eagles Sun, Sep 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/new-york-giants-vs-tennessee-titans-east-rutherford-new-jersey-09-27-2026/event/00006491C2E8E049"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS New York Giants vs. Tennessee Titans Sun, Sep 27, 1:00 PMMetLife Stadium \u00b7 East Rutherford \u00b7 NJ TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/baltimore-ravens-v-tennessee-titans-baltimore-maryland-10-04-2026/event/1500648DB7AD9D7D"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace TITANS1 SOURCE WITH OFFERS Baltimore Ravens v Tennessee Titans Sun, Oct 4, 1:00 PMM&T Bank Stadium \u00b7 Baltimore \u00b7 MD TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-houston-texans-nashville-tennessee-10-11-2026/event/1B006470D200F645"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Houston Texans Sun, Oct 11, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/indianapolis-colts-vs-tennessee-titans-indianapolis-indiana-10-18-2026/event/05006474BEDEA72C"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Indianapolis Colts vs. Tennessee Titans Sun, Oct 18, 1:00 PMLucas Oil Stadium \u00b7 Indianapolis \u00b7 IN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-cleveland-browns-nashville-tennessee-10-25-2026/event/1B006470D1F8F636"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Cleveland Browns Sun, Oct 25, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/cincinnati-bengals-vs-tennessee-titans-cincinnati-ohio-11-01-2026/event/16006469BBD893F2"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Cincinnati Bengals vs. Tennessee Titans Sun, Nov 1, 1:00 PMPaycor Stadium \u00b7 Cincinnati \u00b7 OH TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-jacksonville-jaguars-nashville-tennessee-11-15-2026/event/1B006470D20DF658"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Jacksonville Jaguars Sun, Nov 15, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/dallas-cowboys-vs-tennessee-titans-arlington-texas-11-22-2026/event/0C00646CBC939043"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Dallas Cowboys vs. Tennessee Titans Sun, Nov 22, 12:00 PMAT&T Stadium \u00b7 Arlington \u00b7 TX TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/jacksonville-jaguars-vs-tennessee-titans-jacksonville-florida-11-29-2026/event/2200646A920D4DA3"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Jacksonville Jaguars vs. Tennessee Titans Sun, Nov 29, 4:05 PMEverBank Stadium \u00b7 Jacksonville \u00b7 FL TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-washington-commanders-nashville-tennessee-12-06-2026/event/1B006470D232F684"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Washington Commanders Sun, Dec 6, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/detroit-lions-vs-tennessee-titans-detroit-michigan-12-13-2026/event/080064718D7239E3"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Detroit Lions vs. Tennessee Titans Sun, Dec 13, 1:00 PMFord Field \u00b7 Detroit \u00b7 MI TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-indianapolis-colts-nashville-tennessee-12-20-2026/event/1B006470D206F655"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Indianapolis Colts Sun, Dec 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/las-vegas-raiders-vs-tennessee-titans-las-vegas-nevada-12-27-2026/event/1700646CC3A0C3A4"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Las Vegas Raiders vs. Tennessee Titans Sun, Dec 27, 1:05 PMAllegiant Stadium \u00b7 Las Vegas \u00b7 NV TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-pittsburgh-steelers-nashville-tennessee-01-03-2027/event/1B006470D21FF66E"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Pittsburgh Steelers Sun, Jan 3, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        }
      ],
      "fallback": [],
      "filters": [
        {
          "height": 44,
          "pressed": "true",
          "value": "all",
          "width": 86.703125
        },
        {
          "height": 44,
          "pressed": "false",
          "value": "home",
          "width": 63.34375
        },
        {
          "height": 44,
          "pressed": "false",
          "value": "away",
          "width": 61.140625
        }
      ],
      "heading": "Titans Ticket Finder",
      "mode": "comparison",
      "offline": false,
      "overflow": false,
      "refreshHeight": 44,
      "scrollWidth": 1265,
      "upcoming": false,
      "viewport": 1265
    },
    "savedCompare": {
      "savedKeys": [
        "tix-18wddhd",
        "tix-xbdd08"
      ],
      "initialCompareCards": 2,
      "finalistsOnlyVerified": true,
      "groupBudgetVerified": true,
      "signalLensVerified": true,
      "signalFocusKey": "tix-1vuqqqg",
      "partySize": 3,
      "sharePlanVerified": true,
      "shareMode": "native",
      "shareDestinationVerified": true,
      "viewOffersFocused": true,
      "removeLifecycle": true,
      "clearLifecycle": true,
      "mobileViewportChecked": false
    }
  },
  "mobile": {
    "state": {
      "mode": "comparison",
      "fallbackCards": 0,
      "comparisonCards": 16
    },
    "summary": {
      "comparison": [
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-new-york-jets-nashville-tennessee-09-13-2026/event/1B006470D213F665"
          ],
          "right": 363,
          "text": "CHEAPEST TITANS TICKET NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. New York Jets Sun, Sep 13, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 MARKETPLACE AVAILABLEVERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-philadelphia-eagles-nashville-tennessee-09-20-2026/event/1B006470D219F66B"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Philadelphia Eagles Sun, Sep 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/new-york-giants-vs-tennessee-titans-east-rutherford-new-jersey-09-27-2026/event/00006491C2E8E049"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS New York Giants vs. Tennessee Titans Sun, Sep 27, 1:00 PMMetLife Stadium \u00b7 East Rutherford \u00b7 NJ TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/baltimore-ravens-v-tennessee-titans-baltimore-maryland-10-04-2026/event/1500648DB7AD9D7D"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace TITANS1 SOURCE WITH OFFERS Baltimore Ravens v Tennessee Titans Sun, Oct 4, 1:00 PMM&T Bank Stadium \u00b7 Baltimore \u00b7 MD TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-houston-texans-nashville-tennessee-10-11-2026/event/1B006470D200F645"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Houston Texans Sun, Oct 11, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/indianapolis-colts-vs-tennessee-titans-indianapolis-indiana-10-18-2026/event/05006474BEDEA72C"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Indianapolis Colts vs. Tennessee Titans Sun, Oct 18, 1:00 PMLucas Oil Stadium \u00b7 Indianapolis \u00b7 IN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-cleveland-browns-nashville-tennessee-10-25-2026/event/1B006470D1F8F636"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Cleveland Browns Sun, Oct 25, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/cincinnati-bengals-vs-tennessee-titans-cincinnati-ohio-11-01-2026/event/16006469BBD893F2"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Cincinnati Bengals vs. Tennessee Titans Sun, Nov 1, 1:00 PMPaycor Stadium \u00b7 Cincinnati \u00b7 OH TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-jacksonville-jaguars-nashville-tennessee-11-15-2026/event/1B006470D20DF658"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Jacksonville Jaguars Sun, Nov 15, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/dallas-cowboys-vs-tennessee-titans-arlington-texas-11-22-2026/event/0C00646CBC939043"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Dallas Cowboys vs. Tennessee Titans Sun, Nov 22, 12:00 PMAT&T Stadium \u00b7 Arlington \u00b7 TX TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/jacksonville-jaguars-vs-tennessee-titans-jacksonville-florida-11-29-2026/event/2200646A920D4DA3"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Jacksonville Jaguars vs. Tennessee Titans Sun, Nov 29, 4:05 PMEverBank Stadium \u00b7 Jacksonville \u00b7 FL TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-washington-commanders-nashville-tennessee-12-06-2026/event/1B006470D232F684"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Washington Commanders Sun, Dec 6, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/detroit-lions-vs-tennessee-titans-detroit-michigan-12-13-2026/event/080064718D7239E3"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Detroit Lions vs. Tennessee Titans Sun, Dec 13, 1:00 PMFord Field \u00b7 Detroit \u00b7 MI TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-indianapolis-colts-nashville-tennessee-12-20-2026/event/1B006470D206F655"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Indianapolis Colts Sun, Dec 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/las-vegas-raiders-vs-tennessee-titans-las-vegas-nevada-12-27-2026/event/1700646CC3A0C3A4"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Las Vegas Raiders vs. Tennessee Titans Sun, Dec 27, 1:05 PMAllegiant Stadium \u00b7 Las Vegas \u00b7 NV TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 12,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-pittsburgh-steelers-nashville-tennessee-01-03-2027/event/1B006470D21FF66E"
          ],
          "right": 363,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Pittsburgh Steelers Sun, Jan 3, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        }
      ],
      "fallback": [],
      "filters": [
        {
          "height": 44,
          "pressed": "true",
          "value": "all",
          "width": 351
        },
        {
          "height": 44,
          "pressed": "false",
          "value": "home",
          "width": 351
        },
        {
          "height": 44,
          "pressed": "false",
          "value": "away",
          "width": 351
        }
      ],
      "heading": "Titans Ticket Finder",
      "mode": "comparison",
      "offline": false,
      "overflow": false,
      "refreshHeight": 44,
      "scrollWidth": 375,
      "upcoming": false,
      "viewport": 375
    },
    "savedCompare": {
      "savedKeys": [
        "tix-18wddhd",
        "tix-xbdd08"
      ],
      "initialCompareCards": 2,
      "finalistsOnlyVerified": true,
      "groupBudgetVerified": true,
      "signalLensVerified": true,
      "signalFocusKey": "tix-1vuqqqg",
      "partySize": 3,
      "sharePlanVerified": true,
      "shareMode": "clipboard",
      "shareDestinationVerified": true,
      "viewOffersFocused": true,
      "removeLifecycle": true,
      "clearLifecycle": true,
      "mobileViewportChecked": true
    }
  },
  "browserWarnings": [],
  "eligibleFallbackGames": 17,
  "durationSeconds": 2.34,
  "testedAt": "2026-09-05T01:51:59Z"
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
  "mobileViewportState": {
    "clientWidth": 390,
    "innerHeight": 844,
    "innerWidth": 390,
    "mobile": true
  },
  "mobileTabTargets": [
    {
      "h": 177.5,
      "label": "Changes"
    },
    {
      "h": 177.5,
      "label": "Press Room"
    },
    {
      "h": 177.5,
      "label": "Scheme Lab"
    },
    {
      "h": 177.5,
      "label": "Global Fans"
    },
    {
      "h": 177.5,
      "label": "Stadium"
    },
    {
      "h": 177.5,
      "label": "Fan GM"
    },
    {
      "h": 177.5,
      "label": "Time Machine"
    }
  ],
  "mobileViewport": 390,
  "browserWarnings": [],
  "durationSeconds": 1.42,
  "testedAt": "2026-09-05T01:52:00Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "playerRoute": "#player?name=Cam%20Ward",
  "playerRouteHydrated": true,
  "playerRouteMode": "audited-name",
  "playerTabs": [
    "overview",
    "games",
    "trends",
    "career",
    "timeline"
  ],
  "favoriteToggle": [
    "false",
    "true",
    "false"
  ],
  "playerMobileTargets": [
    {
      "h": 44,
      "label": "Overview"
    },
    {
      "h": 44,
      "label": "Game Log"
    },
    {
      "h": 44,
      "label": "Trends"
    },
    {
      "h": 44,
      "label": "Career + Contract"
    },
    {
      "h": 44,
      "label": "Timeline"
    }
  ],
  "playerHeadshotLoaded": true,
  "rosterEnhancementState": {
    "cutdownButtons": 1,
    "cutdownPanels": 1,
    "injuryBanners": 1,
    "switchers": 1
  },
  "cutdownCommand": true,
  "cutdownCommandText": "53-MAN CUTDOWN COMMAND\nDeadline tracker\n\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\n\nLEAGUE DEADLINE\nDeadline reached\nSun, Aug 30, 6:00 PM EDT\nLoaded roster\n60\nAll current rows\nActive rows\n53\nLoaded status = Active\nReserve / other\n7\nNot counted as active rows here\nFinal active limit\n53\nLoaded active count is at or below 53\nPOSITION SHAPE\nActive rows by position\nFull roster \u2192\n5\nDE\n5\nLB\n5\nWR\n4\nCB\n4\nDT\n4\nG\n4\nRB\n4\nS\n4\nT\n4\nTE\n2\nC\n2\nDL\n2\nQB\n1\nDB\n1\nK\n1\nLS\n1\nP\nMOVEMENT WIRE\nLatest loaded transactions\nAll moves \u2192\n2026-09-02\n\nOn Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.\n\n2026-09-01\n\nThe official transaction log records CB Shemar Bartholomew signed to the practice squad, CB Mario Goodrich III released from the practice squad, and C Andre James waived from injured reserve with an injury settlement.\n\n2026-08-31\n\nTennessee announced 16 practice-squad signings on Aug. 31. This item is retained as dated history; Sept. 1\u20132 official transactions control the current practice-squad membership.\n\n2026-08-31\n\nTennessee added LB Owen Pappoe, DB Melvin Smith Jr., DT Nazir Stackhouse, S Terrell Burgess and T James Hudson III on Aug. 31, while five players from the initial 53 were removed.\n\n2026-08-30\n\nTennessee completed the Aug. 30 cutdown, including the departures of Will Levis and Cordell Volson from the Active roster and reserve-list designations for Dorian Mausi and Joshua Williams. Hendon Hooker and Kalel Mullings later joined the practice squad.\n\n2026-08-25\n\nTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. This item is dated history; the Sept. 2 audited roster controls current fallback status.\n\nMY 53 \u00b7 FAN BOARD\nBuild your own Titans 53\n\nYour picks stay on this device. This is a fan roster exercise\u2014not an official roster projection or report.\n\n0 / 53\nClear picks\nNo fan picks yet.\nFIND PLAYER\nPOSITION\nAll positions\nC\nCB\nDB\nDE\nDL\nDT\nG\nK\nLB\nLS\nP\nQB\nRB\nS\nT\nTE\nWR\nSelected only\nShare / Copy My 53\n53 shown \u00b7 0 selected\nSelect players to see unit composition.\n#29\nTony Adams\nS \u00b7 Defense\n+\n#5\nElic Ayomanor\nWR \u00b7 Offense\n+\n#50\nCody Barton\nLB \u00b7 Defense\n+\n#82\nDaniel Bellinger\nTE \u00b7 Offense\n+\n#38\nTerrell Burgess\nS \u00b7 Defense\n+\n#66\nFernando Carmona Jr.\nG \u00b7 Offense\n+\n#36\nJulius Chestnut\nRB \u00b7 Offense\n+\n#79\nPat Coogan\nC \u00b7 Offense\n+\n#46\nMorgan Cox\nLS \u00b7 Special Teams\n+\n#78\nBrandon Crenshaw-Dickson\nT \u00b7 Offense\n+\n#71\nGarrett Dellinger\nG \u00b7",
  "cutdownMobileTargets": [
    {
      "h": 48,
      "label": "Full roster \u2192"
    },
    {
      "h": 48,
      "label": "All moves \u2192"
    },
    {
      "h": 48,
      "label": "NFL roster deadline \u2197"
    },
    {
      "h": 48,
      "label": "Official Titans transactions \u2197"
    }
  ],
  "my53Interaction": {
    "before": {
      "count": "0 / 53",
      "key": "Tony Adams",
      "pressed": "false"
    },
    "added": {
      "count": "1 / 53",
      "note": "Pick saved on this device.",
      "pressed": "true",
      "stored": 1
    },
    "removed": {
      "count": "0 / 53",
      "note": "Pick removed. Your fan board stays on this device.",
      "stored": 0
    }
  },
  "my53MobileTargets": [
    {
      "h": 48,
      "label": "Clear picks"
    },
    {
      "h": 48,
      "label": "Selected only"
    },
    {
      "h": 48,
      "label": "Share / Copy My 53"
    },
    {
      "h": 57.6875,
      "label": "#29Tony AdamsS \u00b7 Defense+"
    },
    {
      "h": 57.6875,
      "label": "#5Elic AyomanorWR \u00b7 Offense+"
    },
    {
      "h": 57.6875,
      "label": "#50Cody BartonLB \u00b7 Defense+"
    },
    {
      "h": 57.6875,
      "label": "#82Daniel BellingerTE \u00b7 Offense+"
    },
    {
      "h": 57.6875,
      "label": "#38Terrell BurgessS \u00b7 Defense+"
    }
  ],
  "gameDayPhase": "pregame",
  "gameDayTuneLink": true,
  "gameDayMobileViewport": 375,
  "gameDayFastPass": true,
  "gameDayFastPassGameId": "wk1",
  "gameDayFastPassText": "NEXT GAME FAST PASS\nNew York Jets at Titans\nWEEK 1\nWHEN\nSun, Sep 13, 12:00 PM CDT \u00b7 8d 15h\nWATCH / LISTEN\nCBS \u00b7 WGFX 104.5 FM The Zone\nWHERE\nHome \u00b7 Nissan Stadium\nOpen Listen / Watch\nOfficial schedule \u2197\nStadium guide \u2197\nSchedule facts: TennesseeTitans.com",
  "gameDayFastPassMobileTargets": [
    {
      "h": 48,
      "label": "Open Listen / Watch"
    },
    {
      "h": 48,
      "label": "Official schedule \u2197"
    },
    {
      "h": 48,
      "label": "Stadium guide \u2197"
    }
  ],
  "browserWarnings": [],
  "durationSeconds": 3.8,
  "testedAt": "2026-09-05T01:52:05Z"
}```

## Ask Titans browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "answers": [
    {
      "question": "Who is next?",
      "action": "#live",
      "answer": "Tennessee is next scheduled to host New York Jets on Sun, Sep 13, 12:00 PM CDT (Nashville time).",
      "facts": 4,
      "sources": 1,
      "why": "That is the next non-final, non-bye game in the loaded Titans schedule. CBS is the listed network."
    },
    {
      "question": "Cam Ward",
      "action": "#roster",
      "answer": "Cam Ward is listed as QB #1 with roster status Active.",
      "facts": 2,
      "sources": 2,
      "why": "No recent structured player-game rows are loaded, so I am not treating missing stats as zero production."
    },
    {
      "question": "What is EPA?",
      "action": "#stats",
      "answer": "EPA: Expected Points Added estimates how much a play helped or hurt scoring expectation.",
      "facts": 2,
      "sources": 1,
      "why": "Advanced metrics are context tools, not standalone player grades. Command Center labels model-derived metrics and keeps them behind plain-English explanations."
    },
    {
      "question": "How do I watch?",
      "action": "#media",
      "answer": "The next game is Sun, Sep 13, 12:00 PM CDT (Nashville time) and the loaded TV listing is CBS. Open Listen / Watch for your device-local time, Eastern time, Nashville time, UTC, radio, and territory-specific viewing guidance.",
      "facts": 2,
      "sources": 1,
      "why": "Broadcast rights vary by location, so the media center keeps viewing guidance separate by Nashville, elsewhere in the U.S., and international fans."
    }
  ],
  "teamTimeVerified": [
    "Who is next?",
    "How do I watch?"
  ],
  "fantasyHandoff": {
    "actionHeight": 46,
    "href": "#fantasy",
    "text": "FANTASY HANDOFFEvidence workspaceUse Fantasy Decision Center for this one.WHY IT MATTERSStart/sit and waiver choices depend on league context. Command Center will carry this question into the fantasy workspace and compare loaded evidence without inventing a point projection or guarantee.Scoring presetPPRSleeper leagueNot connectedSaved fantasy players2SOURCE + CONTEXTFantasy CommandDevice-local scoring, roster selections and read-only Sleeper context when connectedNo projection generatedOpen Decision Center \u2192",
    "title": "Use Fantasy Decision Center for this one."
  },
  "fantasyCarried": {
    "hash": "#fantasy",
    "selected": [
      "Decision Smoke A \u00b7 WR \u00b7 TEN",
      "Decision Smoke B \u00b7 RB \u00b7 IND"
    ],
    "values": [
      "manual:0",
      "manual:1"
    ],
    "verdict": "Evidence leans Decision Smoke A, but this is not a point projection or guarantee."
  },
  "unsupportedRefused": true,
  "mobileViewport": {
    "clientWidth": 390,
    "innerHeight": 844,
    "innerWidth": 390,
    "mobile": true
  },
  "mobileTargets": {
    "askButton": 44,
    "input": 44,
    "quick": [
      {
        "h": 44,
        "label": "What changed?"
      },
      {
        "h": 44,
        "label": "Who is next?"
      },
      {
        "h": 44,
        "label": "Injuries"
      },
      {
        "h": 44,
        "label": "Watch"
      },
      {
        "h": 44,
        "label": "Cam Ward"
      },
      {
        "h": 44,
        "label": "Explain EPA"
      }
    ],
    "viewport": 390,
    "width": 366
  },
  "mobileFantasyHandoff": {
    "actionHeight": 44,
    "left": 27,
    "overflow": false,
    "right": 363,
    "viewport": 390
  },
  "browserWarnings": [],
  "durationSeconds": 1.57,
  "testedAt": "2026-09-05T01:52:06Z"
}```

## Change Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "detectedBeforeReview": 69,
  "categories": [
    "Roster",
    "Transaction"
  ],
  "favoritePriority": "Added to loaded roster",
  "rosterFilterVisible": 60,
  "clearedAfterReview": true,
  "mobileViewport": {
    "clientWidth": 390,
    "innerHeight": 844,
    "innerWidth": 390,
    "mobile": true
  },
  "mobileTargets": {
    "filters": [
      {
        "h": 44,
        "label": "All"
      },
      {
        "h": 44,
        "label": "Roster \u00b7 60"
      },
      {
        "h": 44,
        "label": "Transaction \u00b7 9"
      }
    ],
    "review": 44,
    "viewport": 390,
    "width": 366
  },
  "browserWarnings": [],
  "durationSeconds": 1.96,
  "testedAt": "2026-09-05T01:52:09Z"
}```

## Runtime / 365 Mode browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "phase": "regular",
    "cards": 2,
    "mode": "season-lens",
    "runtimeVersion": "1.10.0",
    "teamTimeZone": "America/Chicago",
    "teamTimeLabel": "Nashville time",
    "routeCycle": true,
    "singlePanel": true,
    "cacheUrls": [
      "/api/data",
      "/api/fan-intel",
      "/api/social-pulse",
      "/api/tickets"
    ],
    "readiness": {
      "availability": null,
      "changes": {
        "copy": "On Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.",
        "title": "Review team changes"
      },
      "mode": "season-lens",
      "standings": {
        "copy": "No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.",
        "title": "0-0 \u00b7 Week 1 ahead"
      },
      "teamStatus": {
        "copy": "We do not assume an empty feed means no injuries",
        "title": "Report awaiting update"
      }
    },
    "panel": {
      "cards": 2,
      "display": "block",
      "height": 366.0625,
      "homeNow": true,
      "labels": [
        "AFC SOUTH",
        "WHAT CHANGED?"
      ],
      "mode": "season-lens",
      "opacity": "1",
      "text": "SEASON LENS365 MODE \u00b7 REGULAR SEASONGame week firstA tighter season view keeps the longer-horizon priorities here while the panel above handles what matters right now.Review changes \u2192AFC SOUTH0-0 \u00b7 Week 1 aheadNo Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.WHAT CHANGED?Review team changesOn Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "refresh": {
      "cache": [
        {
          "expiresAt": 1788573160713,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1788573130713,
          "url": "/api/data"
        },
        {
          "expiresAt": 1788573160784,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1788573130784,
          "url": "/api/fan-intel"
        }
      ],
      "epoch": 1,
      "last": {
        "at": "2026-09-05T01:52:10.679Z",
        "epoch": 1,
        "reason": "scoreboard-control",
        "urls": null
      }
    },
    "refreshedReadiness": {
      "availability": null,
      "changes": {
        "copy": "On Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.",
        "title": "Review team changes"
      },
      "mode": "season-lens",
      "standings": {
        "copy": "No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.",
        "title": "0-0 \u00b7 Week 1 ahead"
      },
      "teamStatus": {
        "copy": "We do not assume an empty feed means no injuries",
        "title": "Report awaiting update"
      }
    },
    "refreshedPanel": {
      "cards": 2,
      "display": "block",
      "height": 366.0625,
      "homeNow": true,
      "labels": [
        "AFC SOUTH",
        "WHAT CHANGED?"
      ],
      "mode": "season-lens",
      "opacity": "1",
      "text": "SEASON LENS365 MODE \u00b7 REGULAR SEASONGame week firstA tighter season view keeps the longer-horizon priorities here while the panel above handles what matters right now.Review changes \u2192AFC SOUTH0-0 \u00b7 Week 1 aheadNo Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.WHAT CHANGED?Review team changesOn Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "returnReadiness": {
      "availability": null,
      "changes": {
        "copy": "On Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.",
        "title": "Review team changes"
      },
      "mode": "season-lens",
      "standings": {
        "copy": "No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.",
        "title": "0-0 \u00b7 Week 1 ahead"
      },
      "teamStatus": {
        "copy": "We do not assume an empty feed means no injuries",
        "title": "Report awaiting update"
      }
    },
    "returnPanel": {
      "cards": 2,
      "display": "block",
      "height": 366.0625,
      "homeNow": true,
      "labels": [
        "AFC SOUTH",
        "WHAT CHANGED?"
      ],
      "mode": "season-lens",
      "opacity": "1",
      "text": "SEASON LENS365 MODE \u00b7 REGULAR SEASONGame week firstA tighter season view keeps the longer-horizon priorities here while the panel above handles what matters right now.Review changes \u2192AFC SOUTH0-0 \u00b7 Week 1 aheadNo Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.WHAT CHANGED?Review team changesOn Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    }
  },
  "mobile": {
    "layout": {
      "dock": {
        "display": "grid",
        "h": 72,
        "w": 465,
        "x": 10,
        "y": 621
      },
      "dockTargets": [
        {
          "h": 58,
          "label": "Home",
          "w": 89.796875
        },
        {
          "h": 58,
          "label": "Roster",
          "w": 89.796875
        },
        {
          "h": 58,
          "label": "Game",
          "w": 89.796875
        },
        {
          "h": 58,
          "label": "Search",
          "w": 89.796875
        },
        {
          "h": 58,
          "label": "More",
          "w": 89.8125
        }
      ],
      "overflow": false,
      "panelHeight": 432.890625,
      "panelWidth": 457,
      "reviewHeight": 44,
      "targets": [
        {
          "h": 186.953125,
          "label": "AFC SOUTH",
          "w": 320
        },
        {
          "h": 186.953125,
          "label": "WHAT CHANGED?",
          "w": 320
        }
      ],
      "viewport": 500
    },
    "readiness": {
      "availability": null,
      "changes": {
        "copy": "On Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.",
        "title": "Review team changes"
      },
      "mode": "season-lens",
      "standings": {
        "copy": "No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.",
        "title": "0-0 \u00b7 Week 1 ahead"
      },
      "teamStatus": {
        "copy": "We do not assume an empty feed means no injuries",
        "title": "Report awaiting update"
      }
    },
    "panelState": {
      "cards": 2,
      "display": "block",
      "height": 432.890625,
      "homeNow": true,
      "labels": [
        "AFC SOUTH",
        "WHAT CHANGED?"
      ],
      "mode": "season-lens",
      "opacity": "1",
      "text": "SEASON LENS365 MODE \u00b7 REGULAR SEASONGame week firstA tighter season view keeps the longer-horizon priorities here while the panel above handles what matters right now.Review changes \u2192AFC SOUTH0-0 \u00b7 Week 1 aheadNo Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.WHAT CHANGED?Review team changesOn Sept. 2, Tennessee added WR Xavier Restrepo, S Jerrick Reed II, S Erick Hallett II and LB Mohamoud Diabate to the practice squad while waiving WR Hank Beatty, DB Derrick Canteen and LB Mani Powell.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 457
    },
    "sheet": {
      "bottom": 611,
      "dockTop": 621,
      "height": 504.71875,
      "links": 15,
      "top": 106.28125
    },
    "smartSearch": {
      "height": 110,
      "left": 10,
      "right": 475,
      "rows": 1,
      "targets": [
        58
      ],
      "width": 465
    }
  },
  "browserWarnings": [],
  "durationSeconds": 3.56
}```

## Data freshness browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "detail": "Roster verified Sep 2 \u00b7 Moves 2 days ago \u00b7 Intel 2 days ago",
    "overflow": false,
    "rect": {
      "bottom": 1729.5,
      "height": 139.578125,
      "left": 915.328125,
      "right": 1216.984375,
      "top": 1589.921875,
      "width": 301.65625
    },
    "state": "fallback",
    "strong": "Verified backup \u00b7 Sep 2",
    "text": "DATA FRESHNESSVerified backup \u00b7 Sep 2Roster verified Sep 2 \u00b7 Moves 2 days ago \u00b7 Intel 2 days agoSee sources \u2192",
    "title": "Live roster updates are temporarily unavailable. Showing the verified roster backup audited Sep 2.",
    "viewport": {
      "height": 757,
      "width": 1280
    }
  },
  "mobile": {
    "detail": "Roster verified Sep 2 \u00b7 Moves 2 days ago \u00b7 Intel 2 days ago",
    "overflow": false,
    "rect": {
      "bottom": 2997.515625,
      "height": 130.96875,
      "left": 12,
      "right": 378,
      "top": 2866.546875,
      "width": 366
    },
    "state": "fallback",
    "strong": "Verified backup \u00b7 Sep 2",
    "text": "DATA FRESHNESSVerified backup \u00b7 Sep 2Roster verified Sep 2 \u00b7 Moves 2 days ago \u00b7 Intel 2 days agoSee sources \u2192",
    "title": "Live roster updates are temporarily unavailable. Showing the verified roster backup audited Sep 2.",
    "viewport": {
      "height": 844,
      "width": 390
    }
  },
  "mobileViewportState": {
    "clientWidth": 390,
    "innerHeight": 844,
    "innerWidth": 390,
    "mobile": true
  },
  "browserWarnings": [],
  "durationSeconds": 1.76,
  "testedAt": "2026-09-05T01:52:14Z"
}```

## Account / Guest browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "browserWarnings": [],
  "guest": {
    "accountGuest": true,
    "route": "#home",
    "text": "VIEWING AS GUESTNo account requiredSettings stay on this device.Sign in / Sign up"
  },
  "mobileShell": {
    "dock": {
      "h": 68,
      "top": 770,
      "w": 363
    },
    "more": {
      "bottom": 832,
      "h": 56,
      "top": 776,
      "w": 69.8125
    },
    "runtime": "1.10.0",
    "sidebarHidden": "true",
    "sidebarInert": true
  },
  "sheet": {
    "bottom": 754,
    "dockTop": 770,
    "top": 146.328125
  },
  "accountEntry": {
    "bottom": 330.578125,
    "h": 44,
    "parent": "sidebar",
    "top": 286.578125,
    "visibleBottom": 754,
    "visibleTop": 146.328125,
    "w": 284
  },
  "panel": {
    "bottom": 844,
    "h": 725.828125,
    "text": "\u00d7OPTIONAL ACCOUNTWelcome backEverything is still available as a guest. Sign in only if you want favorites and selected preferences to sync when account storage is available.Log inSign upEmailPasswordShowLog inContinue as guestGUEST DATAThese settings exist only on this device.Export this deviceImport backupReset this deviceReset clears favorite, alert, display, home-layout, and saved-media preferences from this device. Your account status is unaffected.",
    "vh": 844,
    "w": 375
  },
  "passwordInitial": {
    "autocomplete": "current-password",
    "controls": "account-password-input",
    "fieldLabel": "Password",
    "height": 48,
    "inputId": "account-password-input",
    "name": "Show password",
    "pressed": null,
    "text": "Show",
    "type": "password",
    "valueLength": 13,
    "width": 70
  },
  "passwordRevealed": {
    "autocomplete": "current-password",
    "controls": "account-password-input",
    "fieldLabel": "Password",
    "height": 48,
    "inputId": "account-password-input",
    "name": "Hide password",
    "pressed": null,
    "text": "Hide",
    "type": "text",
    "valueLength": 13,
    "width": 70
  },
  "passwordHidden": {
    "autocomplete": "current-password",
    "controls": "account-password-input",
    "fieldLabel": "Password",
    "height": 48,
    "inputId": "account-password-input",
    "name": "Show password",
    "pressed": null,
    "text": "Show",
    "type": "password",
    "valueLength": 13,
    "width": 70
  },
  "passwordSignup": {
    "autocomplete": "new-password",
    "controls": "account-password-input",
    "fieldLabel": "Password",
    "height": 48,
    "inputId": "account-password-input",
    "name": "Show password",
    "pressed": null,
    "text": "Show",
    "type": "password",
    "valueLength": 0,
    "width": 70
  },
  "passwordSignin": {
    "autocomplete": "current-password",
    "controls": "account-password-input",
    "fieldLabel": "Password",
    "height": 48,
    "inputId": "account-password-input",
    "name": "Show password",
    "pressed": null,
    "text": "Show",
    "type": "password",
    "valueLength": 0,
    "width": 70
  },
  "portabilityTools": {
    "exportHeight": 50,
    "exportLabel": "Export this device",
    "guest": true,
    "importHeight": 50,
    "importLabel": "Import backup",
    "resetHeight": 50,
    "resetLabel": "Reset this device"
  },
  "importPreview": {
    "applyHeight": 46,
    "favorite": null,
    "pending": {
      "accountEmail": "",
      "exportedAt": "2026-08-22T12:00:00Z",
      "keys": [
        "titans:v15MyTitans"
      ],
      "preferences": {
        "titans:v15MyTitans": {
          "favorite": "Browser Smoke"
        }
      },
      "scope": "guest-device"
    },
    "text": "READY TO RESTORE1 setting groupAug 22, 2026, 12:00 PM \u00b7 guest-deviceNothing has changed yet. Applying restores only recognized Titans preferences from this file.Apply imported settingsCancel"
  },
  "resetArmed": {
    "guest": true,
    "hash": "#home",
    "hint": "Tap Confirm reset again within 6 seconds.",
    "label": "Confirm reset"
  },
  "authOutage": {
    "guest": true,
    "text": "VIEWING AS GUESTNo account requiredSettings stay on this device.Sign in / Sign up"
  },
  "roster": {
    "route": "#roster",
    "text": "PersonnelRosterSearch the latest verified Titans roster by name, number, position, or unit.Roster \u00b7 freshness unknown202"
  },
  "durationSeconds": 2.13
}```

## Advanced analytics browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "mode": "cloudflare-d1",
  "healthStatus": "healthy",
  "analyticsStorage": "cloudflare-d1",
  "analyticsSnapshotSource": "nflreadpy-d1-snapshot",
  "analyticsSnapshotStale": false,
  "seasonContext": {
    "bannerRole": "note",
    "bannerText": "2025 regular-season baselineNot 2026 performance. These metrics stay historical until completed 2026 regular-season play-by-play is available.",
    "bannerVisible": true,
    "dataSeason": "2025",
    "heading": "2025 advanced analytics baseline",
    "requestedSeason": "2026",
    "seasonFallback": "true"
  },
  "mobileSeasonContext": {
    "fallback": "true",
    "text": "2025 regular-season baselineNot 2026 performance. These metrics stay historical until completed 2026 regular-season play-by-play is available.",
    "visible": true
  },
  "metricCount": 4,
  "metricValues": [
    {
      "detail": "#30 of 32",
      "label": "Offensive EPA / play",
      "value": "-0.148"
    },
    {
      "detail": "#28 of 32",
      "label": "Defensive EPA / play allowed",
      "value": "+0.104"
    },
    {
      "detail": "#11 of 32",
      "label": "Pace",
      "value": "28.9 sec/play"
    },
    {
      "detail": "Latest loaded week: 18",
      "label": "Rest days",
      "value": "7 days"
    }
  ],
  "situationFields": [
    "Down & distance",
    "Field position",
    "Formation",
    "Personnel",
    "Score diff",
    "TEN EPA",
    "Time remaining"
  ],
  "initialPlayCards": 60,
  "offenseFilteredPlayCards": 39,
  "mobileMetricCount": 4,
  "browserWarnings": [],
  "durationSeconds": 1.53,
  "testedAt": "2026-09-05T01:52:18Z"
}```

## Player headshot browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "expectedCurrentRoster": 60,
  "minimumCurrentRosterHeadshots": 51,
  "minimumHeadshotCoveragePct": 85.0,
  "rosterCards": 60,
  "rosterDecoratedHeadshots": 60,
  "rosterHeadshotCoveragePct": 100.0,
  "rosterLoadedHeadshots": 1,
  "statsPlayerRows": 60,
  "statsDecoratedHeadshots": 60,
  "statsHeadshotCoveragePct": 100.0,
  "statsLoadedHeadshots": 51,
  "formerPreseasonParticipantRows": 29,
  "mobileLoadedHeadshots": 52,
  "richPlayer": "Tony Adams",
  "richPlayerHeadshotLoaded": true,
  "browserWarnings": [],
  "durationSeconds": 4.61,
  "testedAt": "2026-09-05T01:52:23Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
