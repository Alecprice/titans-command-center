# Cloudflare deployment status

- Status: **deployed + Ask Titans browser regression failure**
- Source commit: `4905fe2fd8e6274f3b4b2a133c4ff35a143b7d04`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Market Pulse browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: success
- Ask Titans browser regression: failure
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-23T23:15:06Z

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
  "precachePaths": 104,
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
  "transactionCount": 27,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 95,
  "statsRosterMode": "live-database",
  "statsRosterSource": "Tennessee Titans official roster · latest audited snapshot",
  "completedPreseasonGames": 1,
  "marketStatus": 200,
  "marketRows": 268,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "4905fe2fd8e6274f3b4b2a133c4ff35a143b7d04",
    "builtAt": "2026-08-23T23:14:06.505Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 32,
    "health": 182,
    "data": 185,
    "stats": 170,
    "market": 76,
    "analytics": 338
  },
  "testedAt": "2026-08-23T23:14:28.832Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-22",
    "databaseContentAudit": "2026-08-22",
    "responseMs": 313,
    "testedAt": "2026-08-23T23:14:29.174Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 161,
    "warmHitMs": 161,
    "rows": 268,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 161,
        "rows": 268
      }
    ],
    "testedAt": "2026-08-23T23:14:29.382Z"
  },
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
  "durationMs": 120,
  "testedAt": "2026-08-23T23:14:29.897Z"
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
  "maxLongTaskMs": 0,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 15.99,
  "testedAt": "2026-08-23T23:14:49Z"
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
  "durationSeconds": 1.7,
  "testedAt": "2026-08-23T23:14:51Z"
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
        "shown": 84,
        "total": 268,
        "renderedRows": 84
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
        "result": "Showing 84 of 268 rows",
        "resultTotal": 268,
        "rowCount": 84,
        "rowSample": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine3Price-112Implied52.8%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine3Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine3Price-115Implied53.5%"
        ],
        "scrollWidth": 1265,
        "shown": 84,
        "title": "Live Titans market board",
        "total": 268,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "148033",
        "before": "Showing 84 of 268 rows",
        "after": "Showing 82 of 268 rows"
      },
      "book": {
        "available": true,
        "options": 14,
        "selectedValue": "onexbet",
        "before": "Showing 84 of 268 rows",
        "after": "Showing 6 of 268 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 84 of 268 rows",
        "after": "Showing 84 of 268 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 84,
      "afterRows": 268
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 268,
        "total": 268,
        "renderedRows": 268
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
        "result": "Showing 268 of 268 rows",
        "resultTotal": 268,
        "rowCount": 268,
        "rowSample": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine3Price-112Implied52.8%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine3Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine3Price-115Implied53.5%"
        ],
        "scrollWidth": 1265,
        "shown": 268,
        "title": "Live Titans market board",
        "total": 268,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 268,
      "total": 268,
      "renderedRows": 268
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
      "result": "Showing 268 of 268 rows",
      "resultTotal": 268,
      "rowCount": 268,
      "rowSample": [
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine3Price-112Implied52.8%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine3Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine3Price-115Implied53.5%"
      ],
      "scrollWidth": 375,
      "shown": 268,
      "title": "Live Titans market board",
      "total": 268,
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
  "durationSeconds": 4.96,
  "testedAt": "2026-08-23T23:14:56Z"
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
  "durationSeconds": 2.53,
  "testedAt": "2026-08-23T23:14:58Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "playerRoute": "#player?id=cb885a93-e510-4a22-8834-78fc4b32a54b",
  "playerRouteHydrated": true,
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
      "h": 48,
      "label": "Overview"
    },
    {
      "h": 48,
      "label": "Game Log"
    },
    {
      "h": 48,
      "label": "Trends"
    },
    {
      "h": 48,
      "label": "Career + Contract"
    },
    {
      "h": 48,
      "label": "Timeline"
    }
  ],
  "playerHeadshotLoaded": true,
  "gameDayPhase": "pregame",
  "gameDayTuneLink": true,
  "gameDayMobileViewport": 375,
  "browserWarnings": [],
  "durationSeconds": 3.96,
  "testedAt": "2026-08-23T23:15:03Z"
}```

## Ask Titans browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "fantasy-handoff:navigate",
  "error": "ElementClickInterceptedException: Message: element click intercepted: Element <a class=\"button primary v17-answer-action\" href=\"#fantasy\">...</a> is not clickable at point (401, 834). Other element would receive the click: <div class=\"v10-modal-backdrop\" data-v10-close=\"\"></div>\n  (Session info: chrome=151.0.7922.137); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception\nStacktrace:\n#0 0x559ccdcb136a <unknown>\n#1 0x559ccd624f49 <unknown>\n#2 0x559ccd681415 <unknown>\n#3 0x559ccd67f4f2 <unknown>\n#4 0x559ccd67cedc <unknown>\n#5 0x559ccd67bfd7 <unknown>\n#6 0x559ccd66fc42 <unknown>\n#7 0x559ccd66f587 <unknown>\n#8 0x559ccd6c30c3 <unknown>\n#9 0x559ccd66dc92 <unknown>\n#10 0x559ccd66eb11 <unknown>\n#11 0x559ccdc768d0 <unknown>\n#12 0x559ccdc74f3a <unknown>\n#13 0x559ccdc5f9b5 <unknown>\n#14 0x559ccdc75c0a <unknown>\n#15 0x559ccdc47740 <unknown>\n#16 0x559ccdc9c9a8 <unknown>\n#17 0x559ccdc9cb45 <unknown>\n#18 0x559ccdcaff1e <unknown>\n#19 0x7f46a169cb84 <unknown>\n#20 0x7f46a1729d6c <unknown>\n",
  "durationSeconds": 2.43,
  "testedAt": "2026-08-23T23:15:05Z",
  "hash": "#fan",
  "pageText": "FAN HUB\nEverything Titans.\nEasy to use.\n\nStart simple. Open more detail only when you want it.\n\nSimple view\nToday\nGame\nTeam\nSeason\nOffseason\nHistory\nToday\n\nThe important stuff first. No hunting around.\n\nNext game\nVS Seattle Seahawks\nAug 23, 7:00 PM\nFOX \u00b7 Nissan Stadium\nGame Day\nWhat changed?\nNo major tracked changes since your last Fan Hub visit\nRoster moves\nYour players\nPick a favorite player\n\nOpen the roster and favorite a player. Their updates will show here.\n\nRoster\nLatest move\n\nSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.\n\nAug 20, 7:00 PM\nFan pulse\nroster\n3 recent mentions\ngames\n2 recent mentions\ncam-ward\n2 recent mentions\nanalytics\n1 recent mention\ntransactions\n1 recent mention\nMarket pulse\nMarket pulse waiting\n\nNo current cached market row is available.\n\nMarkets\nFan picks\nSeason MVP\nChoose\n#61 Andre James \u00b7 C\n#51 Austin Schlottmann \u00b7 C\n#79 Pat Coogan \u00b7 C\n#73 Cordell Volson \u00b7 G\n#67 Drew Moss \u00b7 G\n#66 Fernando Carmona Jr. \u00b7 G\n#71 Garrett Dellinger \u00b7 G\n#64 Jackson Slater \u00b7 G\n#77 Peter Skoronski \u00b7 G\n#1 Cam Ward \u00b7 QB\n#16 Hendon Hooker \u00b7 QB\n#10 Mitchell Trubisky \u00b7 QB\n#8 Will Levis \u00b7 QB\n#21 D'Ernest Johnson \u00b7 RB\n#36 Julius Chestnut \u00b7 RB\n#31 Kalel Mullings \u00b7 RB\n#35 Michael Carter \u00b7 RB\n#32 Nicholas Singleton \u00b7 RB\n#20 Tony Pollard \u00b7 RB\n#2 Tyjae Spears \u00b7 RB\n#69 Aamil Wagner \u00b7 T\n#76 Austin Deculus \u00b7 T\n#78 Brandon Crenshaw-Dickson \u00b7 T\n#75 Dan Moore Jr. \u00b7 T\n#55 JC Latham \u00b7 T\n#62 Rasheed Miller \u00b7 T\n#72 Zachary Thomas \u00b7 T\n#82 Daniel Bellinger \u00b7 TE\n#88 David Martin-Robinson \u00b7 TE\n#84 Gunnar Helm \u00b7 TE\n#81 Jaren Kanak \u00b7 TE\n#83 Joel Wilson \u00b7 TE\n#86 Kylen Granson \u00b7 TE\n#80 Bryce Oliver \u00b7 WR\n#0 Calvin Ridley \u00b7 WR\n#14 Carnell Tate \u00b7 WR\n#17 Chimere Dike \u00b7 WR\n#39 Courtney Jackson \u00b7 WR\n#5 Elic Ayomanor \u00b7 WR\n#13 Hank Beatty \u00b7 WR\n#85 K.J. Osborn \u00b7 WR\n#89 Lance McCutcheon \u00b7 WR\n#12 Mason Kinsey \u00b7 WR\n#19 Tyren Montgomery \u00b7 WR\n#4 Wan'Dale Robinson \u00b7 WR\n#87 Xavier Restrepo \u00b7 WR\n#24 Alontae Taylor \u00b7 CB\n#18 Cor'Dale Flott \u00b7 CB\n#13 Corey Mayfield Jr. \u00b7 CB\n#16 Jalen McMurray \u00b7 CB\n#25 Joshua Williams \u00b7 CB\n#29 Keydrain Calligan \u00b7 CB\n#26 Marcus Harris \u00b7 CB\n#35 Mario Goodrich III \u00b7 CB\n#21 Micah Robinson \u00b7 CB\n#42 Derrick Can",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
