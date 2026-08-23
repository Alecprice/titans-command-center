# Cloudflare deployment status

- Status: **deployed + Account / Guest browser regression failure**
- Source commit: `3205428da77a3d7c3c0b28b787ce4654b71f4cc6`
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
- Account / Guest browser regression: failure
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-23T17:17:54Z

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
    "commit": "3205428da77a3d7c3c0b28b787ce4654b71f4cc6",
    "builtAt": "2026-08-23T17:16:31.235Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 33,
    "health": 168,
    "data": 308,
    "stats": 182,
    "market": 4321,
    "analytics": 395
  },
  "testedAt": "2026-08-23T17:17:01.234Z",
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
  "durationMs": 152,
  "testedAt": "2026-08-23T17:17:01.857Z"
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
  "maxLongTaskMs": 462,
  "longTasksOver250ms": 1,
  "browserWarnings": [],
  "durationSeconds": 9.09,
  "testedAt": "2026-08-23T17:17:16Z"
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
  "durationSeconds": 2.09,
  "testedAt": "2026-08-23T17:17:18Z"
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
  "durationSeconds": 5.94,
  "testedAt": "2026-08-23T17:17:24Z"
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
  "durationSeconds": 2.33,
  "testedAt": "2026-08-23T17:17:27Z"
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
  "durationSeconds": 4.73,
  "testedAt": "2026-08-23T17:17:32Z"
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
  "durationSeconds": 1.66,
  "testedAt": "2026-08-23T17:17:34Z"
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
  "durationSeconds": 2.83,
  "testedAt": "2026-08-23T17:17:37Z"
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
          "expiresAt": 1787505489523,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787505459523,
          "url": "/api/data"
        },
        {
          "expiresAt": 1787505489518,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787505459518,
          "url": "/api/fan-intel"
        }
      ],
      "epoch": 1,
      "last": {
        "at": "2026-08-23T17:17:39.358Z",
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
      "links": 14,
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
  "durationSeconds": 3.73
}```

## Data freshness browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "detail": "Roster 16 hours ago \u00b7 Moves 5 days ago \u00b7 Intel 5 days ago",
    "overflow": false,
    "rect": {
      "bottom": 2218.203125,
      "height": 132.03125,
      "left": 915.328125,
      "right": 1216.984375,
      "top": 2086.171875,
      "width": 301.65625
    },
    "state": "recent",
    "strong": "Recent server snapshot",
    "text": "DATA FRESHNESSRecent server snapshotRoster 16 hours ago \u00b7 Moves 5 days ago \u00b7 Intel 5 days agoSee sources \u2192",
    "title": "The loaded roster snapshot was captured within the last 48 hours.",
    "viewport": {
      "height": 757,
      "width": 1280
    }
  },
  "mobile": {
    "detail": "Roster 16 hours ago \u00b7 Moves 5 days ago \u00b7 Intel 5 days ago",
    "overflow": false,
    "rect": {
      "bottom": 4363.640625,
      "height": 113.53125,
      "left": 9,
      "right": 366,
      "top": 4250.109375,
      "width": 357
    },
    "state": "recent",
    "strong": "Recent server snapshot",
    "text": "DATA FRESHNESSRecent server snapshotRoster 16 hours ago \u00b7 Moves 5 days ago \u00b7 Intel 5 days agoSee sources \u2192",
    "title": "The loaded roster snapshot was captured within the last 48 hours.",
    "viewport": {
      "height": 701,
      "width": 390
    }
  },
  "browserWarnings": [],
  "durationSeconds": 1.88,
  "testedAt": "2026-08-23T17:17:43Z"
}```

## Account / Guest browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "browserWarnings": [],
  "stage": "wait-more",
  "error": "TimeoutException: Message: \n",
  "state": {
    "accountApi": true,
    "accountCard": "VIEWING AS GUESTNo account requiredSettings stay on this device.Sign in / Sign up",
    "accountCardAtSidebarTop": true,
    "accountEntry": {
      "bottom": 911.25,
      "height": 44,
      "top": 867.25,
      "width": 390
    },
    "accountGuest": true,
    "accountImport": true,
    "accountPanel": null,
    "appText": "2026 SEASON \u00b7 PRESEASON \u00b7 FAN-BUILT HQ\nTENNESSEE FOOTBALL.\nEVERY ANGLE.\n\nGame day, roster movement, official team updates, stats, free market data, and the franchise history that made Titans blue mean something. Built as a fan destination \u2014 not a generic dashboard.\n\nENTER GAME DAY \u2192\nEXPLORE THE LEGA",
    "dock": {
      "bottom": 693,
      "height": 72,
      "top": 621,
      "width": 465
    },
    "hash": "#home",
    "importPreview": "",
    "moreExpanded": "false",
    "onboarding": false,
    "ready": "complete",
    "runtimeVersion": "1.10.0",
    "sidebar": {
      "ariaHidden": "true",
      "inert": true,
      "open": false,
      "rect": {
        "bottom": 1231.71875,
        "height": 504.71875,
        "top": 727,
        "width": 469
      }
    },
    "viewport": {
      "h": 701,
      "w": 500
    }
  },
  "durationSeconds": 9.22
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
