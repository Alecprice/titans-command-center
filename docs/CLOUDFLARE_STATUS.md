# Cloudflare deployment status

- Status: **deployed + Ask Titans browser regression failure**
- Source commit: `a9be0b562082340a4bdbce1dbafc26a5f2a1fb15`
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
- Ticket Center browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: success
- Ask Titans browser regression: failure
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-09-01T20:00:32Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "deployedCommit": "4e3b132c5a62b5ae5f0081207b2e03b52bbeca85",
  "version": "1.0.0",
  "revisionAttempts": 2,
  "cloudFront": {
    "requestId": "MUNkS5-OaKTLKsbYz33j1j7COhN0uLJ16A1gdNqSgvm5l3OGWZbtqA==",
    "pop": "ORD51-P2",
    "via": "1.1 6cb03ad529b99ef54866d7ba6041dd04.cloudfront.net (CloudFront)",
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
    "status": "healthy",
    "databaseProvider": "cloudflare-d1",
    "databaseConfigured": true,
    "snapshotFresh": true
  },
  "responseMs": {
    "canonicalMeta": 180,
    "originMeta": 203,
    "canonicalRoot": 124,
    "originRoot": 205,
    "health": 465
  },
  "testedAt": "2026-09-01T19:58:05.096Z"
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
  "appStatus": "healthy",
  "databaseProvider": "cloudflare-d1",
  "databaseConfigured": true,
  "databaseOk": true,
  "snapshotFresh": true,
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
    "commit": "a9be0b562082340a4bdbce1dbafc26a5f2a1fb15",
    "builtAt": "2026-09-01T19:57:45.861Z"
  },
  "deploymentPropagationAttempts": 4,
  "responseMs": {
    "root": 781,
    "health": 575,
    "data": 1102,
    "stats": 1228,
    "market": 9255,
    "analytics": 530
  },
  "testedAt": "2026-09-01T19:59:18.181Z",
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
    "responseMs": 1044,
    "testedAt": "2026-09-01T19:59:19.921Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 1903,
    "warmHitMs": 1903,
    "rows": 608,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 1903,
        "rows": 608
      }
    ],
    "testedAt": "2026-09-01T19:59:21.854Z"
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
  "durationMs": 272,
  "testedAt": "2026-09-01T19:59:22.727Z"
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
  "maxLongTaskMs": 83,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 16.63,
  "testedAt": "2026-09-01T19:59:44Z"
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
      "timestamp": 1788292788390
    }
  ],
  "durationSeconds": 4.37,
  "testedAt": "2026-09-01T19:59:48Z"
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
        "shown": 73,
        "total": 608,
        "renderedRows": 73
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
        "result": "Showing 73 of 608 rows",
        "resultTotal": 608,
        "rowCount": 73,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine1.5Price-108Implied51.9%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine1.5Price-105Implied51.2%",
          "New York Jets at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideNew York JetsLine1.5Price-103Implied50.7%"
        ],
        "scrollWidth": 1265,
        "shown": 73,
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
        "before": "Showing 73 of 608 rows",
        "after": "Showing 65 of 608 rows"
      },
      "book": {
        "available": true,
        "options": 11,
        "selectedValue": "betonlineag",
        "before": "Showing 73 of 608 rows",
        "after": "Showing 6 of 608 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 73 of 608 rows",
        "after": "Showing 73 of 608 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 73,
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
  "durationSeconds": 8.97,
  "testedAt": "2026-09-01T19:59:58Z"
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
          "text": "CHEAPEST TITANS TICKET NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. New York Jets Sun, Sep 13, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-philadelphia-eagles-nashville-tennessee-09-20-2026/event/1B006470D219F66B"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Philadelphia Eagles Sun, Sep 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/new-york-giants-vs-tennessee-titans-east-rutherford-new-jersey-09-27-2026/event/00006491C2E8E049"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS New York Giants vs. Tennessee Titans Sun, Sep 27, 1:00 PMMetLife Stadium \u00b7 East Rutherford \u00b7 NJ TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/baltimore-ravens-v-tennessee-titans-baltimore-maryland-10-04-2026/event/1500648DB7AD9D7D"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace TITANS1 SOURCE WITH OFFERS Baltimore Ravens v Tennessee Titans Sun, Oct 4, 1:00 PMM&T Bank Stadium \u00b7 Baltimore \u00b7 MD TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-houston-texans-nashville-tennessee-10-11-2026/event/1B006470D200F645"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Houston Texans Sun, Oct 11, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/indianapolis-colts-vs-tennessee-titans-indianapolis-indiana-10-18-2026/event/05006474BEDEA72C"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Indianapolis Colts vs. Tennessee Titans Sun, Oct 18, 1:00 PMLucas Oil Stadium \u00b7 Indianapolis \u00b7 IN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-cleveland-browns-nashville-tennessee-10-25-2026/event/1B006470D1F8F636"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Cleveland Browns Sun, Oct 25, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/cincinnati-bengals-vs-tennessee-titans-cincinnati-ohio-11-01-2026/event/16006469BBD893F2"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Cincinnati Bengals vs. Tennessee Titans Sun, Nov 1, 1:00 PMPaycor Stadium \u00b7 Cincinnati \u00b7 OH TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-jacksonville-jaguars-nashville-tennessee-11-15-2026/event/1B006470D20DF658"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Jacksonville Jaguars Sun, Nov 15, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/dallas-cowboys-vs-tennessee-titans-arlington-texas-11-22-2026/event/0C00646CBC939043"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Dallas Cowboys vs. Tennessee Titans Sun, Nov 22, 12:00 PMAT&T Stadium \u00b7 Arlington \u00b7 TX TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/jacksonville-jaguars-vs-tennessee-titans-jacksonville-florida-11-29-2026/event/2200646A920D4DA3"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Jacksonville Jaguars vs. Tennessee Titans Sun, Nov 29, 4:05 PMEverBank Stadium \u00b7 Jacksonville \u00b7 FL TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-washington-commanders-nashville-tennessee-12-06-2026/event/1B006470D232F684"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Washington Commanders Sun, Dec 6, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/detroit-lions-vs-tennessee-titans-detroit-michigan-12-13-2026/event/080064718D7239E3"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Detroit Lions vs. Tennessee Titans Sun, Dec 13, 1:00 PMFord Field \u00b7 Detroit \u00b7 MI TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-indianapolis-colts-nashville-tennessee-12-20-2026/event/1B006470D206F655"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Indianapolis Colts Sun, Dec 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/las-vegas-raiders-vs-tennessee-titans-las-vegas-nevada-12-27-2026/event/1700646CC3A0C3A4"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Las Vegas Raiders vs. Tennessee Titans Sun, Dec 27, 1:05 PMAllegiant Stadium \u00b7 Las Vegas \u00b7 NV TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-pittsburgh-steelers-nashville-tennessee-01-03-2027/event/1B006470D21FF66E"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Pittsburgh Steelers Sun, Jan 3, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
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
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-new-york-jets-nashville-tennessee-09-13-2026/event/1B006470D213F665"
          ],
          "right": 366,
          "text": "CHEAPEST TITANS TICKET NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. New York Jets Sun, Sep 13, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-philadelphia-eagles-nashville-tennessee-09-20-2026/event/1B006470D219F66B"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Philadelphia Eagles Sun, Sep 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/new-york-giants-vs-tennessee-titans-east-rutherford-new-jersey-09-27-2026/event/00006491C2E8E049"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS New York Giants vs. Tennessee Titans Sun, Sep 27, 1:00 PMMetLife Stadium \u00b7 East Rutherford \u00b7 NJ TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/baltimore-ravens-v-tennessee-titans-baltimore-maryland-10-04-2026/event/1500648DB7AD9D7D"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace TITANS1 SOURCE WITH OFFERS Baltimore Ravens v Tennessee Titans Sun, Oct 4, 1:00 PMM&T Bank Stadium \u00b7 Baltimore \u00b7 MD TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-houston-texans-nashville-tennessee-10-11-2026/event/1B006470D200F645"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Houston Texans Sun, Oct 11, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/indianapolis-colts-vs-tennessee-titans-indianapolis-indiana-10-18-2026/event/05006474BEDEA72C"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Indianapolis Colts vs. Tennessee Titans Sun, Oct 18, 1:00 PMLucas Oil Stadium \u00b7 Indianapolis \u00b7 IN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-cleveland-browns-nashville-tennessee-10-25-2026/event/1B006470D1F8F636"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Cleveland Browns Sun, Oct 25, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/cincinnati-bengals-vs-tennessee-titans-cincinnati-ohio-11-01-2026/event/16006469BBD893F2"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Cincinnati Bengals vs. Tennessee Titans Sun, Nov 1, 1:00 PMPaycor Stadium \u00b7 Cincinnati \u00b7 OH TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-jacksonville-jaguars-nashville-tennessee-11-15-2026/event/1B006470D20DF658"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Jacksonville Jaguars Sun, Nov 15, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/dallas-cowboys-vs-tennessee-titans-arlington-texas-11-22-2026/event/0C00646CBC939043"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Dallas Cowboys vs. Tennessee Titans Sun, Nov 22, 12:00 PMAT&T Stadium \u00b7 Arlington \u00b7 TX TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/jacksonville-jaguars-vs-tennessee-titans-jacksonville-florida-11-29-2026/event/2200646A920D4DA3"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Jacksonville Jaguars vs. Tennessee Titans Sun, Nov 29, 4:05 PMEverBank Stadium \u00b7 Jacksonville \u00b7 FL TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-washington-commanders-nashville-tennessee-12-06-2026/event/1B006470D232F684"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Washington Commanders Sun, Dec 6, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/detroit-lions-vs-tennessee-titans-detroit-michigan-12-13-2026/event/080064718D7239E3"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Detroit Lions vs. Tennessee Titans Sun, Dec 13, 1:00 PMFord Field \u00b7 Detroit \u00b7 MI TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-indianapolis-colts-nashville-tennessee-12-20-2026/event/1B006470D206F655"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Indianapolis Colts Sun, Dec 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/las-vegas-raiders-vs-tennessee-titans-las-vegas-nevada-12-27-2026/event/1700646CC3A0C3A4"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Las Vegas Raiders vs. Tennessee Titans Sun, Dec 27, 1:05 PMAllegiant Stadium \u00b7 Las Vegas \u00b7 NV TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        },
        {
          "left": 9,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-pittsburgh-steelers-nashville-tennessee-01-03-2027/event/1B006470D21FF66E"
          ],
          "right": 366,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Pittsburgh Steelers Sun, Jan 3, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197"
        }
      ],
      "fallback": [],
      "filters": [
        {
          "height": 44,
          "pressed": "true",
          "value": "all",
          "width": 114.328125
        },
        {
          "height": 44,
          "pressed": "false",
          "value": "home",
          "width": 114.328125
        },
        {
          "height": 44,
          "pressed": "false",
          "value": "away",
          "width": 114.34375
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
    }
  },
  "browserWarnings": [],
  "eligibleFallbackGames": 17,
  "durationSeconds": 4.15,
  "testedAt": "2026-09-01T20:00:02Z"
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
  "durationSeconds": 3.57,
  "testedAt": "2026-09-01T20:00:06Z"
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
  "cutdownCommandText": "53-MAN CUTDOWN COMMAND\nDeadline tracker\n\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\n\nLEAGUE DEADLINE\nDeadline reached\nSun, Aug 30, 6:00 PM EDT\nLoaded roster\n61\nAll current rows\nActive rows\n53\nLoaded status = Active\nReserve / other\n8\nNot counted as active rows here\nFinal active limit\n53\nLoaded active count is at or below 53\nPOSITION SHAPE\nActive rows by position\nFull roster \u2192\n5\nDE\n5\nLB\n5\nWR\n4\nCB\n4\nDT\n4\nG\n4\nRB\n4\nS\n4\nT\n4\nTE\n2\nC\n2\nDL\n2\nQB\n1\nDB\n1\nK\n1\nLS\n1\nP\nMOVEMENT WIRE\nLatest loaded transactions\nAll moves \u2192\n2026-08-31\n\nTennessee announced 16 practice-squad signings on Aug. 31, with one standard practice-squad spot still open. Practice-squad players remain separate from the 53-player Active roster and the reserve lists.\n\n2026-08-31\n\nTennessee added LB Owen Pappoe, DB Melvin Smith Jr., DT Nazir Stackhouse, S Terrell Burgess and T James Hudson III on Aug. 31, while five players from the initial 53 were removed.\n\n2026-08-30\n\nTennessee completed the Aug. 30 cutdown, including the departures of Will Levis, Hendon Hooker, Cordell Volson and Kalel Mullings from the Active roster and reserve-list designations for Dorian Mausi and Joshua Williams.\n\n2026-08-25\n\nTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. This item is retained as dated transaction history; the Aug. 31 audited roster controls current fallback status.\n\n2026-08-24\n\nThe Titans announced the move Aug. 24. This item is retained as dated transaction history; the Aug. 31 audited roster controls current fallback status.\n\n2026-08-21\n\nOn Aug. 21, Tennessee signed DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, placed DB Nazeeh Johnson on Reserve/Injured, and later waived LB Sean Brown from injured reserve with an injury settlement.\n\nMY 53 \u00b7 FAN BOARD\nBuild your own Titans 53\n\nYour picks stay on this device. This is a fan roster exercise\u2014not an official roster projection or report.\n\n0 / 53\nClear picks\nNo fan picks yet.\nFIND PLAYER\nPOSITION\nAll positions\nC\nCB\nDB\nDE\nDL\nDT\nG\nK\nLB\nLS\nP\nQB\nRB\nS\nT\nTE\nWR\nSelected only\nShare / Copy My 53\n53 shown \u00b7 0 selected\nSelect players to see unit composition.\n#38\nTony Adams\nS \u00b7 Defense\n+\n#5\nElic Ayomanor\nWR \u00b7 Offense\n+\n#50\nCody Barton\nLB \u00b7 Defense\n+\n#82\nDaniel Bellinger\nTE \u00b7 Offense\n+\n#\u2014\nTerrell Burgess\nS \u00b7 Defense\n+\n#66\nFernando Carmona Jr.\nG \u00b7 Offense\n+\n#36\nJulius Chestnut\nRB \u00b7 Offense\n+\n#79\nPat Coogan\nC \u00b7 Offense\n+\n#46\nMorgan Cox\nLS \u00b7 Special Teams\n+\n#78\nBrandon Crenshaw-Dickson\nT \u00b7 Offense\n+\n#71\nGarrett Dellinger\nG \u00b7 Offense\n+\n#17\nChimere Dike\nWR \u00b7 Of",
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
      "h": 56.6875,
      "label": "#38Tony AdamsS \u00b7 Defense+"
    },
    {
      "h": 56.6875,
      "label": "#5Elic AyomanorWR \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#50Cody BartonLB \u00b7 Defense+"
    },
    {
      "h": 56.6875,
      "label": "#82Daniel BellingerTE \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#\u2014Terrell BurgessS \u00b7 Defense+"
    }
  ],
  "gameDayPhase": "pregame",
  "gameDayTuneLink": true,
  "gameDayMobileViewport": 375,
  "gameDayFastPass": true,
  "gameDayFastPassGameId": "wk1",
  "gameDayFastPassText": "NEXT GAME FAST PASS\nNew York Jets at Titans\nWEEK 1\nWHEN\nSun, Sep 13, 12:00 PM CDT \u00b7 11d 20h\nWATCH / LISTEN\nCBS \u00b7 WGFX 104.5 FM The Zone\nWHERE\nHome \u00b7 Nissan Stadium\nOpen Listen / Watch\nOfficial schedule \u2197\nStadium guide \u2197\nSchedule facts: TennesseeTitans.com",
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
  "durationSeconds": 6.41,
  "testedAt": "2026-09-01T20:00:13Z"
}```

## Ask Titans browser regression

```json
{
  "ok": false,
  "base": "https://titans.alecjprice.com",
  "stage": "ask:Who is next?",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 18.38,
  "testedAt": "2026-09-01T20:00:31Z",
  "hash": "#fan",
  "pageText": "FAN HUB\nEverything Titans.\nEasy to use.\n\nStart simple. Open more detail only when you want it.\n\nSimple view\nToday\nGame\nTeam\nSeason\nOffseason\nHistory\nToday\n\nThe important stuff first. No hunting around.\n\nNext game\nVS New York Jets\nSep 13, 12:00 PM\nCBS \u00b7 Nissan Stadium\nGame Day\nWhat changed?\nNo major tracked changes since your last Fan Hub visit\nRoster moves\nYour players\nPick a favorite player\n\nOpen the roster and favorite a player. Their updates will show here.\n\nRoster\nLatest move\n\nTennessee announced 16 practice-squad signings on Aug. 31, with one standard practice-squad spot still open. Practice-squad players remain separate from the 53-player Active roster and the reserve lists.\n\nAug 31, 2:57 PM\nFan pulse\nroster\n9 recent mentions\ntransactions\n7 recent mentions\npreseason\n5 recent mentions\ngames\n3 recent mentions\ncoach\n3 recent mentions\nMarket pulse\nMarket pulse waiting\n\nNo current cached market row is available.\n\nMarkets\nFan picks\nSeason MVP\nChoose\n#38 Tony Adams \u00b7 S\n#5 Elic Ayomanor \u00b7 WR\n#50 Cody Barton \u00b7 LB\n#82 Daniel Bellinger \u00b7 TE\n#\u2014 Terrell Burgess \u00b7 S\n#66 Fernando Carmona Jr. \u00b7 G\n#36 Julius Chestnut \u00b7 RB\n#79 Pat Coogan \u00b7 C\n#46 Morgan Cox \u00b7 LS\n#78 Brandon Crenshaw-Dickson \u00b7 T\n#71 Garrett Dellinger \u00b7 G\n#17 Chimere Dike \u00b7 WR\n#95 Jordan Elliott \u00b7 DL\n#15 Keldric Faulk \u00b7 DE\n#18 Cor'Dale Flott \u00b7 CB\n#91 John Franklin-Myers \u00b7 DL\n#86 Kylen Granson \u00b7 TE\n#33 Cedric Gray \u00b7 LB\n#26 Marcus Harris \u00b7 CB\n#84 Gunnar Helm \u00b7 TE\n#53 Anthony Hill Jr. \u00b7 LB\n#37 Amani Hooker \u00b7 S\n#\u2014 James Hudson \u00b7 T\n#11 Jermaine Johnson II \u00b7 DE\n#56 Truman Jones \u00b7 DE\n#55 JC Latham \u00b7 T\n#96 Jackie Marshall \u00b7 DT\n#88 David Martin-Robinson \u00b7 TE\n#57 Jacob Martin \u00b7 DE\n#75 Dan Moore Jr. \u00b7 T\n#7 Oluwafemi Oladejo \u00b7 DE\n#\u2014 Owen Pappoe \u00b7 LB\n#20 Tony Pollard \u00b7 RB\n#0 Calvin Ridley \u00b7 WR\n#21 Micah Robinson \u00b7 CB\n#4 Wan'Dale Robinson \u00b7 WR\n#51 Austin Schlottmann \u00b7 C\n#98 Jeffery Simmons \u00b7 DT\n#32 Nicholas Singleton \u00b7 RB\n#77 Peter Skoronski \u00b7 G\n#64 Jackson Slater \u00b7 G\n#6 Joey Slye \u00b7 K\n#\u2014 Melvin Smith Jr. \u00b7 DB\n#2 Tyjae Spears \u00b7 RB\n#\u2014 Nazir Stackhouse \u00b7 DT\n#14 Carnell Tate \u00b7 WR\n#24 Alontae Taylor \u00b7 CB\n#90 Solomon Thomas \u00b7 DT\n#3 Tommy Townsend \u00b7 P\n#10 Mitchell Trubisky \u00b7 QB\n#1 Cam Ward \u00b7 QB\n#52 James Williams Sr. \u00b7 LB\n#23 Kevi",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
