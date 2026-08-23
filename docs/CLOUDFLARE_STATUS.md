# Cloudflare deployment status

- Status: **deployed + full production + browser + media + market + command intelligence + player intelligence + game day + Ask Titans + change intelligence + 365 mode + freshness + account + analytics + player headshot regressions passed**
- Source commit: `1fe29fc4518cd6f1f864aadfe0ec97d371f944d5`
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
- Ask Titans browser regression: success
- Change Intelligence browser regression: success
- Runtime / 365 Mode browser regression: success
- Data freshness browser regression: success
- Account / Guest browser regression: success
- Advanced analytics browser regression: success
- Player headshot browser regression: success
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-23T12:23:53Z

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
    "contentSecurityPolicy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com; connect-src 'self'; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "noindex, nofollow",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v59",
  "precachePaths": 99,
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
  "marketRows": 266,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "1fe29fc4518cd6f1f864aadfe0ec97d371f944d5",
    "builtAt": "2026-08-23T12:22:54.032Z"
  },
  "deploymentPropagationAttempts": 2,
  "responseMs": {
    "root": 17,
    "health": 123,
    "data": 160,
    "stats": 147,
    "market": 462,
    "analytics": 355
  },
  "testedAt": "2026-08-23T12:23:13.826Z",
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
  "durationMs": 81,
  "testedAt": "2026-08-23T12:23:14.346Z"
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
  "maxLongTaskMs": 51,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 7.2,
  "testedAt": "2026-08-23T12:23:24Z"
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
  "durationSeconds": 1.93,
  "testedAt": "2026-08-23T12:23:26Z"
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
        "shown": 88,
        "total": 266,
        "renderedRows": 88
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
            "width": 170
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
        "result": "Showing 88 of 266 rows",
        "resultTotal": 266,
        "rowCount": 88,
        "rowSample": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-2.5Price+233Implied30.0%"
        ],
        "scrollWidth": 1265,
        "shown": 88,
        "title": "Live Titans market board",
        "total": 266,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "148033",
        "before": "Showing 88 of 266 rows",
        "after": "Showing 86 of 266 rows"
      },
      "book": {
        "available": true,
        "options": 15,
        "selectedValue": "onexbet",
        "before": "Showing 88 of 266 rows",
        "after": "Showing 6 of 266 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 88 of 266 rows",
        "after": "Showing 88 of 266 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 88,
      "afterRows": 266
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 266,
        "total": 266,
        "renderedRows": 266
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
            "width": 170
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
        "result": "Showing 266 of 266 rows",
        "resultTotal": 266,
        "rowCount": 266,
        "rowSample": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-16.5Price+1900Implied5.0%"
        ],
        "scrollWidth": 1265,
        "shown": 266,
        "title": "Live Titans market board",
        "total": 266,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 266,
      "total": 266,
      "renderedRows": 266
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
      "result": "Showing 266 of 266 rows",
      "resultTotal": 266,
      "rowCount": 266,
      "rowSample": [
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-16.5Price+1900Implied5.0%"
      ],
      "scrollWidth": 375,
      "shown": 266,
      "title": "Live Titans market board",
      "total": 266,
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
  "durationSeconds": 5.57,
  "testedAt": "2026-08-23T12:23:32Z"
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
  "durationSeconds": 1.99,
  "testedAt": "2026-08-23T12:23:34Z"
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
  "durationSeconds": 2.25,
  "testedAt": "2026-08-23T12:23:37Z"
}```

## Ask Titans browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "answers": [
    {
      "question": "Who is next?",
      "action": "#live",
      "answer": "Tennessee is next scheduled to host Seattle Seahawks on Sun, Aug 23, 7:00 PM CDT (Nashville time).",
      "facts": 4,
      "sources": 1,
      "why": "That is the next non-final, non-bye game in the loaded Titans schedule. FOX is the listed network."
    },
    {
      "question": "Cam Ward",
      "action": "#player?id=cb885a93-e510-4a22-8834-78fc4b32a54b",
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
      "answer": "The next game is Sun, Aug 23, 7:00 PM CDT (Nashville time) and the loaded TV listing is FOX. Open Listen / Watch for your device-local time, Eastern time, Nashville time, UTC, radio, and territory-specific viewing guidance.",
      "facts": 2,
      "sources": 1,
      "why": "Broadcast rights vary by location, so the media center keeps viewing guidance separate by Nashville, elsewhere in the U.S., and international fans."
    }
  ],
  "teamTimeVerified": [
    "Who is next?",
    "How do I watch?"
  ],
  "unsupportedRefused": true,
  "mobileTargets": {
    "askButton": 50,
    "input": 50,
    "quick": [
      {
        "h": 48,
        "label": "What changed?"
      },
      {
        "h": 48,
        "label": "Who is next?"
      },
      {
        "h": 48,
        "label": "Injuries"
      },
      {
        "h": 48,
        "label": "Watch"
      },
      {
        "h": 48,
        "label": "Cam Ward"
      },
      {
        "h": 48,
        "label": "Explain EPA"
      }
    ],
    "viewport": 375,
    "width": 357
  },
  "browserWarnings": [],
  "durationSeconds": 1.28,
  "testedAt": "2026-08-23T12:23:39Z"
}```

## Change Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "detectedBeforeReview": 121,
  "categories": [
    "Roster",
    "Transaction"
  ],
  "favoritePriority": "Added to loaded roster",
  "rosterFilterVisible": 95,
  "clearedAfterReview": true,
  "mobileTargets": {
    "filters": [
      {
        "h": 48,
        "label": "All"
      },
      {
        "h": 48,
        "label": "Roster \u00b7 95"
      },
      {
        "h": 48,
        "label": "Transaction \u00b7 26"
      }
    ],
    "review": 48,
    "viewport": 375,
    "width": 357
  },
  "browserWarnings": [],
  "durationSeconds": 2.0,
  "testedAt": "2026-08-23T12:23:41Z"
}```

## Runtime / 365 Mode browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "phase": "preseason",
    "cards": 4,
    "runtimeVersion": "1.10.0",
    "teamTimeZone": "America/Chicago",
    "teamTimeLabel": "Nashville time",
    "routeCycle": true,
    "singlePanel": true,
    "cacheUrls": [
      "/api/data",
      "/api/fan-intel"
    ],
    "panel": {
      "cards": 4,
      "display": "block",
      "height": 344.390625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Seattle SeahawksSun, Aug 23, 7:00 PM CDT \u00b7 FOXWHAT CHANGED?Review team changesWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.ROSTERroster-moveWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "refresh": {
      "cache": [
        {
          "expiresAt": 1787487852752,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787487822752,
          "url": "/api/data"
        },
        {
          "expiresAt": 1787487852685,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787487822685,
          "url": "/api/fan-intel"
        }
      ],
      "epoch": 1,
      "last": {
        "at": "2026-08-23T12:23:42.584Z",
        "epoch": 1,
        "reason": "scoreboard-control",
        "urls": null
      }
    },
    "refreshedPanel": {
      "cards": 4,
      "display": "block",
      "height": 344.390625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Seattle SeahawksSun, Aug 23, 7:00 PM CDT \u00b7 FOXWHAT CHANGED?Review team changesWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.ROSTERroster-moveWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "returnPanel": {
      "cards": 4,
      "display": "block",
      "height": 344.390625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Seattle SeahawksSun, Aug 23, 7:00 PM CDT \u00b7 FOXWHAT CHANGED?Review team changesWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.ROSTERroster-moveWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
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
      "panelHeight": 765.171875,
      "panelWidth": 461,
      "reviewHeight": 48,
      "targets": [
        {
          "h": 112,
          "label": "NEXT GAME",
          "w": 427
        },
        {
          "h": 122.9375,
          "label": "WHAT CHANGED?",
          "w": 427
        },
        {
          "h": 122.9375,
          "label": "ROSTER",
          "w": 427
        },
        {
          "h": 112,
          "label": "AVAILABILITY",
          "w": 427
        }
      ],
      "viewport": 500
    },
    "panelState": {
      "cards": 4,
      "display": "block",
      "height": 765.171875,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Seattle SeahawksSun, Aug 23, 7:00 PM CDT \u00b7 FOXWHAT CHANGED?Review team changesWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.ROSTERroster-moveWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 461
    },
    "sheet": {
      "bottom": 611,
      "dockTop": 621,
      "height": 504.71875,
      "links": 13,
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
  "durationSeconds": 3.06
}```

## Data freshness browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "detail": "Roster 11 hours ago \u00b7 Moves 5 days ago \u00b7 Intel 5 days ago",
    "overflow": false,
    "rect": {
      "bottom": 3234.140625,
      "height": 132.03125,
      "left": 915.328125,
      "right": 1216.984375,
      "top": 3102.109375,
      "width": 301.65625
    },
    "state": "recent",
    "strong": "Recent server snapshot",
    "text": "DATA FRESHNESSRecent server snapshotRoster 11 hours ago \u00b7 Moves 5 days ago \u00b7 Intel 5 days agoSee sources \u2192",
    "title": "The loaded roster snapshot was captured within the last 48 hours.",
    "viewport": {
      "height": 757,
      "width": 1280
    }
  },
  "mobile": {
    "detail": "Roster 11 hours ago \u00b7 Moves 5 days ago \u00b7 Intel 5 days ago",
    "overflow": false,
    "rect": {
      "bottom": 6545.078125,
      "height": 113.53125,
      "left": 9,
      "right": 366,
      "top": 6431.546875,
      "width": 357
    },
    "state": "recent",
    "strong": "Recent server snapshot",
    "text": "DATA FRESHNESSRecent server snapshotRoster 11 hours ago \u00b7 Moves 5 days ago \u00b7 Intel 5 days agoSee sources \u2192",
    "title": "The loaded roster snapshot was captured within the last 48 hours.",
    "viewport": {
      "height": 701,
      "width": 390
    }
  },
  "browserWarnings": [],
  "durationSeconds": 1.57,
  "testedAt": "2026-08-23T12:23:46Z"
}```

## Account / Guest browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
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
    "text": "PersonnelRosterSearch the latest verified Titans roster by name, number, position, or unit.Roster \u00b7 updated 11 hours ago"
  },
  "durationSeconds": 1.49
}```

## Advanced analytics browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
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
  "durationSeconds": 1.57,
  "testedAt": "2026-08-23T12:23:49Z"
}```

## Player headshot browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "rosterCards": 95,
  "rosterDecoratedHeadshots": 81,
  "rosterLoadedHeadshots": 42,
  "statsPlayerRows": 96,
  "statsDecoratedHeadshots": 82,
  "statsLoadedHeadshots": 12,
  "mobileLoadedHeadshots": 26,
  "richPlayer": "Austin Schlottmann",
  "richPlayerHeadshotLoaded": true,
  "browserWarnings": [],
  "durationSeconds": 2.68,
  "testedAt": "2026-08-23T12:23:52Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
