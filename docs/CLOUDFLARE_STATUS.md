# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `ee48b9a26c253b8c22279f47d9f5ef98c03b1b62`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
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
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-23T17:12:05Z

## Production regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "rootStatus": 200,
  "securityHeaders": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "noindex, nofollow",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v59",
  "precachePaths": 103,
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
  "databaseConfigured": true,
  "databaseOk": true,
  "dataStatus": 200,
  "dataRosterCount": 95,
  "transactionCount": 26,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 95,
  "statsRosterMode": "live-database",
  "statsRosterSource": "Tennessee Titans official roster · latest audited snapshot",
  "completedPreseasonGames": 1,
  "marketStatus": 200,
  "marketRows": 264,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "ee48b9a26c253b8c22279f47d9f5ef98c03b1b62",
    "builtAt": "2026-08-23T17:10:46.304Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 44,
    "health": 175,
    "data": 240,
    "stats": 215,
    "market": 2369,
    "analytics": 522
  },
  "testedAt": "2026-08-23T17:11:12.444Z",
  "analyticsStatus": 200,
  "analyticsDataSeason": 2025,
  "analyticsSeasonFallback": true,
  "analyticsWarehousePlays": 48771,
  "analyticsPersonnelPlays": 45184,
  "analyticsRecentPlays": 80,
  "analyticsPersonnelRows": 20,
  "analyticsOffensiveEpaPerPlay": -0.14842680811935147,
  "analyticsDefensiveEpaPerPlayAllowed": 0.10385631037224918,
  "analyticsPaceSecondsPerPlay": 28.914001158972834,
  "analyticsLatestRestDays": 7
}```

## Player headshot production regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "season": 2026,
  "generatedAt": "2026-08-23T12:03:19.225157+00:00",
  "rosterRows": 91,
  "headshotCount": 88,
  "coveragePct": 96.7,
  "omittedCount": 3,
  "omissionReasons": {
    "no-approved-headshot-url": 3
  },
  "omittedPlayers": [
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
  "durationMs": 164,
  "testedAt": "2026-08-23T17:11:13.204Z"
}```

## Browser navigation regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktopRounds": 3,
  "transactionChecks": 12,
  "mobileChecks": 14,
  "smallPhoneChecks": 2,
  "smartSearchQuickJump": true,
  "mobileDrawerInert": true,
  "fiveActionDock": true,
  "teamRoomChecks": 4,
  "rosterFilterReset": true,
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
  "maxLongTaskMs": 263,
  "longTasksOver250ms": 1,
  "browserWarnings": [],
  "durationSeconds": 18.56,
  "testedAt": "2026-08-23T17:11:37Z"
}```

## Listen Watch browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "territoryChecks": [
    "Elsewhere in U.S.",
    "International",
    "Nashville / Middle Tennessee"
  ],
  "officialTitansAudio": true,
  "official1045Player": true,
  "rawEmbeddedAudio": false,
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
  "browserWarnings": [],
  "durationSeconds": 2.01,
  "testedAt": "2026-08-23T17:11:39Z"
}```

## Market Pulse browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "initial": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 82,
        "total": 264,
        "renderedRows": 82
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
            "width": 352
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
            "width": 177.390625
          }
        ],
        "empty": "",
        "errorVisible": false,
        "overflow": false,
        "provider": "PropLine",
        "quality": "Live",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "Showing 82 of 264 rows",
        "resultTotal": 264,
        "rowCount": 82,
        "rowSample": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine4Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%"
        ],
        "scrollWidth": 1265,
        "shown": 82,
        "title": "Live Titans market board",
        "total": 264,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "148033",
        "before": "Showing 82 of 264 rows",
        "after": "Showing 80 of 264 rows"
      },
      "book": {
        "available": true,
        "options": 14,
        "selectedValue": "onexbet",
        "before": "Showing 82 of 264 rows",
        "after": "Showing 6 of 264 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 82 of 264 rows",
        "after": "Showing 82 of 264 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 82,
      "afterRows": 264
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 264,
        "total": 264,
        "renderedRows": 264
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
            "width": 352
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
            "width": 171.390625
          }
        ],
        "empty": "",
        "errorVisible": false,
        "overflow": false,
        "provider": "PropLine",
        "quality": "Live",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "Showing 264 of 264 rows",
        "resultTotal": 264,
        "rowCount": 264,
        "rowSample": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine4Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%"
        ],
        "scrollWidth": 1265,
        "shown": 264,
        "title": "Live Titans market board",
        "total": 264,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 264,
      "total": 264,
      "renderedRows": 264
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
      "result": "Showing 264 of 264 rows",
      "resultTotal": 264,
      "rowCount": 264,
      "rowSample": [
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine4Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%"
      ],
      "scrollWidth": 375,
      "shown": 264,
      "title": "Live Titans market board",
      "total": 264,
      "viewport": 375
    },
    "rowGeometry": [
      {
        "height": 125,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 125,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 125,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 125,
        "left": 9,
        "right": 366,
        "width": 357
      }
    ]
  },
  "browserWarnings": [],
  "durationSeconds": 5.72,
  "testedAt": "2026-08-23T17:11:45Z"
}```

## Command Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
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
      "h": 48,
      "label": "Changes"
    },
    {
      "h": 48,
      "label": "Press Room"
    },
    {
      "h": 48,
      "label": "Scheme Lab"
    },
    {
      "h": 48,
      "label": "Global Fans"
    },
    {
      "h": 48,
      "label": "Stadium"
    },
    {
      "h": 48,
      "label": "Fan GM"
    },
    {
      "h": 48,
      "label": "Time Machine"
    }
  ],
  "mobileViewport": 375,
  "browserWarnings": [],
  "durationSeconds": 2.32,
  "testedAt": "2026-08-23T17:11:48Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "player:tab:trends",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 16.53,
  "testedAt": "2026-08-23T17:12:05Z",
  "hash": "#player?id=cb885a93-e510-4a22-8834-78fc4b32a54b",
  "pageText": "\u2190 BACK TO ROSTER\nOFFICIAL ROSTER SOURCE \u2197\n\u2606 Favorite\n\u21c4 Compare\n\u2197 Share player\n\u2606 Favorite\n\u21c4 Compare\n\u2197 Share player\n\u2606 Favorite\n\u21c4 Compare\n\u2197 Share player\n1\nPLAYER INTELLIGENCE \u00b7 ACTIVE\nCAM WARD\n\nQB \u00b7 OFFENSE\n\nTENNESSEE TITANS OFFICIAL ROSTER \u00b7 AUG 19, 2026\nPLAYER PHOTO \u00b7 NFL ROSTER HEADSHOT VIA NFLVERSE\n1\nPOSITION\nQB\nUNIT\nOffense\nSTATUS\nActive\nEXPERIENCE\n2 yrs\nCOLLEGE\nMiami\nAGE\n24\nHEIGHT\n6-2\nWEIGHT\n219 lb\nCURRENT ROSTER CONTEXT\nVERIFIED ROSTER\n\nCam Ward is currently listed as Active at QB wearing No. 1. Player details come from the latest audited Titans roster snapshot.\n\nSNAPSHOT AUG 19, 2026\nUNOFFICIAL FAN-BUILT PRESENTATION\nGAME STATS\nWarehouse\nStats awaiting ingest\n\nNo player-game stat rows are loaded yet. This does not mean the player has zero production.\n\nINJURY REPORTS\nOfficial-first\nNo injury rows loaded\n\nThe injury warehouse has no current rows for this player. Treat this as \u201cnot reported here,\u201d not a medical clearance.\n\nPLAYER MARKET PULSE\nInformational\nNo current player markets\n\nNo free-provider player prop rows are loaded for this player right now.\n\nMarket information is presented for comparison/context only and is not wagering advice.\n\nPLAYER COMMAND CENTER\nCam Ward\n\nQuick answer first. Game logs, trends and deeper football context stay one tap away.\n\n\u2606 Make favorite\nROSTER STATUS\nActive\nNo newer injury or depth-change row is loaded for this player.\nLAST LOADED GAME\nAwaiting stats\nNo game-stat row loaded\nWHAT CHANGED?\nLatest player movement\nVerified loaded data only\nNO DETECTED CHANGE\nRoster profile is stable in the currently loaded datasets.\nCurrent load\nOverview\nGame Log\nTrends\nCareer + Contract\nTimeline\nSEASON SNAPSHOT\nWhat the loaded numbers say\nSeason production is awaiting ingest.\nNo zeroes are invented.\nROLE + AVAILABILITY\nActive\n\nNo newer injury or depth",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
