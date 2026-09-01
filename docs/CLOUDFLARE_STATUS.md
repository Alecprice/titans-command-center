# Cloudflare deployment status

- Status: **deployed + canonical front door + full production + browser + media + market + command intelligence + player intelligence + game day + Ask Titans + change intelligence + 365 mode + freshness + account + analytics + player headshot regressions passed**
- Source commit: `308bc822da05858375d60d1b0a755226ce87f941`
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
- Recorded: 2026-09-01T15:12:02Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "deployedCommit": "308bc822da05858375d60d1b0a755226ce87f941",
  "version": "1.0.0",
  "revisionAttempts": 1,
  "cloudFront": {
    "requestId": "AxS62VCS6-0TxH7W2qFJ2jNeG96jv1ggeumz4Fj3SJr4XxZ26kpVfA==",
    "pop": "ORD51-P2",
    "via": "1.1 33b192d45ee9750732dc09754b79e122.cloudfront.net (CloudFront)",
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
    "canonicalMeta": 280,
    "originMeta": 204,
    "canonicalRoot": 49,
    "originRoot": 53,
    "health": 265
  },
  "testedAt": "2026-09-01T15:10:36.759Z"
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
    "commit": "308bc822da05858375d60d1b0a755226ce87f941",
    "builtAt": "2026-09-01T15:10:19.063Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 144,
    "health": 165,
    "data": 414,
    "stats": 185,
    "market": 2498,
    "analytics": 233
  },
  "testedAt": "2026-09-01T15:10:55.907Z",
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
    "responseMs": 560,
    "testedAt": "2026-09-01T15:10:56.976Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "MISS",
    "finalStatus": "HIT",
    "attempts": 2,
    "coldOrInitialMs": 934,
    "warmHitMs": 57,
    "rows": 608,
    "sequence": [
      {
        "status": "MISS",
        "durationMs": 934,
        "rows": 608
      },
      {
        "status": "HIT",
        "durationMs": 57,
        "rows": 608
      }
    ],
    "testedAt": "2026-09-01T15:10:58.351Z"
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
  "durationMs": 202,
  "testedAt": "2026-09-01T15:10:58.858Z"
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
  "durationSeconds": 9.36,
  "testedAt": "2026-09-01T15:11:13Z"
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
      "timestamp": 1788275483843
    }
  ],
  "durationSeconds": 10.65,
  "testedAt": "2026-09-01T15:11:24Z"
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
  "durationSeconds": 6.51,
  "testedAt": "2026-09-01T15:11:31Z"
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
  "durationSeconds": 2.41,
  "testedAt": "2026-09-01T15:11:33Z"
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
  "gameDayFastPassText": "NEXT GAME FAST PASS\nNew York Jets at Titans\nWEEK 1\nWHEN\nSun, Sep 13, 12:00 PM CDT \u00b7 12d 1h\nWATCH / LISTEN\nCBS \u00b7 WGFX 104.5 FM The Zone\nWHERE\nHome \u00b7 Nissan Stadium\nOpen Listen / Watch\nOfficial schedule \u2197\nStadium guide \u2197\nSchedule facts: TennesseeTitans.com",
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
  "durationSeconds": 4.93,
  "testedAt": "2026-09-01T15:11:39Z"
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
    "viewport": 375,
    "width": 357
  },
  "mobileFantasyHandoff": {
    "actionHeight": 46,
    "left": 24,
    "overflow": false,
    "right": 351,
    "viewport": 375
  },
  "browserWarnings": [],
  "durationSeconds": 2.39,
  "testedAt": "2026-09-01T15:11:41Z"
}```

## Change Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "detectedBeforeReview": 68,
  "categories": [
    "Roster",
    "Transaction"
  ],
  "favoritePriority": "Added to loaded roster",
  "rosterFilterVisible": 61,
  "clearedAfterReview": true,
  "mobileTargets": {
    "filters": [
      {
        "h": 44,
        "label": "All"
      },
      {
        "h": 44,
        "label": "Roster \u00b7 61"
      },
      {
        "h": 44,
        "label": "Transaction \u00b7 7"
      }
    ],
    "review": 44,
    "viewport": 375,
    "width": 357
  },
  "browserWarnings": [],
  "durationSeconds": 2.78,
  "testedAt": "2026-09-01T15:11:44Z"
}```

## Runtime / 365 Mode browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "phase": "regular",
    "cards": 4,
    "runtimeVersion": "1.10.0",
    "teamTimeZone": "America/Chicago",
    "teamTimeLabel": "Nashville time",
    "routeCycle": true,
    "singlePanel": true,
    "cacheUrls": [
      "/api/data",
      "/api/fan-intel",
      "/api/social-pulse"
    ],
    "readiness": {
      "availability": {
        "copy": "Kickoff is 13 days away. Weekly availability will replace this readiness state when structured report rows are loaded.",
        "title": "Week 1 prep window"
      },
      "standings": {
        "copy": "No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.",
        "title": "0-0 \u00b7 Week 1 ahead"
      }
    },
    "panel": {
      "cards": 4,
      "display": "block",
      "height": 427.890625,
      "opacity": "1",
      "text": "365 MODE \u00b7 REGULAR SEASONGame week firstNext opponent, availability, standings and what changed lead the experience.Review changes \u2192NEXT GAMEvs New York JetsSun, Sep 13, 12:00 PM CDT \u00b7 CBSAVAILABILITYWeek 1 prep windowKickoff is 13 days away. Weekly availability will replace this readiness state when structured report rows are loaded.AFC SOUTH0-0 \u00b7 Week 1 aheadNo Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.WHAT CHANGED?Review team changesTennessee announced 16 practice-squad signings on Aug. 31, with one standard practice-squad spot still open. Practice-squad players remain separate from the 53-player Active roster and the reserve lists.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "refresh": {
      "cache": [
        {
          "expiresAt": 1788275536730,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1788275506730,
          "url": "/api/data"
        },
        {
          "expiresAt": 1788275536820,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1788275506820,
          "url": "/api/fan-intel"
        }
      ],
      "epoch": 1,
      "last": {
        "at": "2026-09-01T15:11:46.673Z",
        "epoch": 1,
        "reason": "scoreboard-control",
        "urls": null
      }
    },
    "refreshedReadiness": {
      "availability": {
        "copy": "Kickoff is 13 days away. Weekly availability will replace this readiness state when structured report rows are loaded.",
        "title": "Week 1 prep window"
      },
      "standings": {
        "copy": "No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.",
        "title": "0-0 \u00b7 Week 1 ahead"
      }
    },
    "refreshedPanel": {
      "cards": 4,
      "display": "block",
      "height": 427.890625,
      "opacity": "1",
      "text": "365 MODE \u00b7 REGULAR SEASONGame week firstNext opponent, availability, standings and what changed lead the experience.Review changes \u2192NEXT GAMEvs New York JetsSun, Sep 13, 12:00 PM CDT \u00b7 CBSAVAILABILITYWeek 1 prep windowKickoff is 13 days away. Weekly availability will replace this readiness state when structured report rows are loaded.AFC SOUTH0-0 \u00b7 Week 1 aheadNo Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.WHAT CHANGED?Review team changesTennessee announced 16 practice-squad signings on Aug. 31, with one standard practice-squad spot still open. Practice-squad players remain separate from the 53-player Active roster and the reserve lists.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "returnReadiness": {
      "availability": {
        "copy": "Kickoff is 13 days away. Weekly availability will replace this readiness state when structured report rows are loaded.",
        "title": "Week 1 prep window"
      },
      "standings": {
        "copy": "No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.",
        "title": "0-0 \u00b7 Week 1 ahead"
      }
    },
    "returnPanel": {
      "cards": 4,
      "display": "block",
      "height": 427.890625,
      "opacity": "1",
      "text": "365 MODE \u00b7 REGULAR SEASONGame week firstNext opponent, availability, standings and what changed lead the experience.Review changes \u2192NEXT GAMEvs New York JetsSun, Sep 13, 12:00 PM CDT \u00b7 CBSAVAILABILITYWeek 1 prep windowKickoff is 13 days away. Weekly availability will replace this readiness state when structured report rows are loaded.AFC SOUTH0-0 \u00b7 Week 1 aheadNo Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.WHAT CHANGED?Review team changesTennessee announced 16 practice-squad signings on Aug. 31, with one standard practice-squad spot still open. Practice-squad players remain separate from the 53-player Active roster and the reserve lists.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
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
      "menu": {
        "display": "grid",
        "h": 46,
        "w": 46,
        "x": 10,
        "y": 8
      },
      "overflow": false,
      "panelHeight": 844.734375,
      "panelWidth": 461,
      "reviewHeight": 48,
      "targets": [
        {
          "h": 112,
          "label": "NEXT GAME",
          "w": 427
        },
        {
          "h": 124.4375,
          "label": "AVAILABILITY",
          "w": 427
        },
        {
          "h": 145.3125,
          "label": "AFC SOUTH",
          "w": 427
        },
        {
          "h": 166.1875,
          "label": "WHAT CHANGED?",
          "w": 427
        }
      ],
      "viewport": 500
    },
    "readiness": {
      "availability": {
        "copy": "Kickoff is 13 days away. Weekly availability will replace this readiness state when structured report rows are loaded.",
        "title": "Week 1 prep window"
      },
      "standings": {
        "copy": "No Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.",
        "title": "0-0 \u00b7 Week 1 ahead"
      }
    },
    "panelState": {
      "cards": 4,
      "display": "block",
      "height": 844.734375,
      "opacity": "1",
      "text": "365 MODE \u00b7 REGULAR SEASONGame week firstNext opponent, availability, standings and what changed lead the experience.Review changes \u2192NEXT GAMEvs New York JetsSun, Sep 13, 12:00 PM CDT \u00b7 CBSAVAILABILITYWeek 1 prep windowKickoff is 13 days away. Weekly availability will replace this readiness state when structured report rows are loaded.AFC SOUTH0-0 \u00b7 Week 1 aheadNo Titans regular-season result is complete yet. Division rank will appear when a current AFC South standings snapshot is loaded.WHAT CHANGED?Review team changesTennessee announced 16 practice-squad signings on Aug. 31, with one standard practice-squad spot still open. Practice-squad players remain separate from the 53-player Active roster and the reserve lists.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 461
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
  "durationSeconds": 4.41
}```

## Data freshness browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "detail": "Roster verified Aug 31 \u00b7 Moves 19 hours ago \u00b7 Intel 19 hours ago",
    "overflow": false,
    "rect": {
      "bottom": 1296.1875,
      "height": 139.578125,
      "left": 915.328125,
      "right": 1216.984375,
      "top": 1156.609375,
      "width": 301.65625
    },
    "state": "fallback",
    "strong": "Verified backup \u00b7 Aug 31",
    "text": "DATA FRESHNESSVerified backup \u00b7 Aug 31Roster verified Aug 31 \u00b7 Moves 19 hours ago \u00b7 Intel 19 hours agoSee sources \u2192",
    "title": "Live roster updates are temporarily unavailable. Showing the verified roster backup audited Aug 31.",
    "viewport": {
      "height": 757,
      "width": 1280
    }
  },
  "mobile": {
    "detail": "Roster verified Aug 31 \u00b7 Moves 19 hours ago \u00b7 Intel 19 hours ago",
    "overflow": false,
    "rect": {
      "bottom": 2334.46875,
      "height": 117.1875,
      "left": 9,
      "right": 366,
      "top": 2217.28125,
      "width": 357
    },
    "state": "fallback",
    "strong": "Verified backup \u00b7 Aug 31",
    "text": "DATA FRESHNESSVerified backup \u00b7 Aug 31Roster verified Aug 31 \u00b7 Moves 19 hours ago \u00b7 Intel 19 hours agoSee sources \u2192",
    "title": "Live roster updates are temporarily unavailable. Showing the verified roster backup audited Aug 31.",
    "viewport": {
      "height": 701,
      "width": 390
    }
  },
  "browserWarnings": [],
  "durationSeconds": 1.92,
  "testedAt": "2026-09-01T15:11:51Z"
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
      "h": 72,
      "top": 621,
      "w": 465
    },
    "more": {
      "bottom": 686,
      "h": 58,
      "top": 628,
      "w": 89.8125
    },
    "runtime": "1.10.0",
    "sidebarHidden": "true",
    "sidebarInert": true
  },
  "sheet": {
    "bottom": 611,
    "dockTop": 621,
    "top": 106.28125
  },
  "accountEntry": {
    "bottom": 290.53125,
    "h": 44,
    "parent": "sidebar",
    "top": 246.53125,
    "visibleBottom": 611,
    "visibleTop": 106.28125,
    "w": 390
  },
  "panel": {
    "bottom": 701,
    "h": 602.859375,
    "text": "\u00d7OPTIONAL ACCOUNTWelcome backEverything is still available as a guest. Sign in only if you want favorites and selected preferences to sync when account storage is available.Log inSign upEmailPasswordLog inContinue as guestGUEST DATAThese settings exist only on this device.Export this deviceImport backupReset this deviceReset clears favorite, alert, display, home-layout, and saved-media preferences from this device. Your account status is unaffected.",
    "vh": 701,
    "w": 485
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
    "text": "PersonnelRosterSearch the latest verified Titans roster by name, number, position, or unit.Roster \u00b7 freshness unknownRos"
  },
  "durationSeconds": 2.33
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
  "durationSeconds": 2.57,
  "testedAt": "2026-09-01T15:11:57Z"
}```

## Player headshot browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "expectedCurrentRoster": 61,
  "minimumCurrentRosterHeadshots": 52,
  "minimumHeadshotCoveragePct": 85.0,
  "rosterCards": 61,
  "rosterDecoratedHeadshots": 56,
  "rosterHeadshotCoveragePct": 91.8,
  "rosterLoadedHeadshots": 39,
  "statsPlayerRows": 61,
  "statsDecoratedHeadshots": 56,
  "statsHeadshotCoveragePct": 91.8,
  "statsLoadedHeadshots": 46,
  "formerPreseasonParticipantRows": 29,
  "mobileLoadedHeadshots": 48,
  "richPlayer": "Tony Adams",
  "richPlayerHeadshotLoaded": true,
  "browserWarnings": [],
  "durationSeconds": 3.98,
  "testedAt": "2026-09-01T15:12:01Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
