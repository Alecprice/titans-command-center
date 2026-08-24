# Cloudflare deployment status

- Status: **deployed + full production + browser + media + market + command intelligence + player intelligence + game day + Ask Titans + change intelligence + 365 mode + freshness + account + analytics + player headshot regressions passed**
- Source commit: `7e4fc72f84c9a11d6ee1997892682732903568bc`
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
- Recorded: 2026-08-24T11:00:09Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v60",
  "precachePaths": 105,
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
  "marketRows": 334,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "7e4fc72f84c9a11d6ee1997892682732903568bc",
    "builtAt": "2026-08-24T10:58:40.533Z"
  },
  "deploymentPropagationAttempts": 6,
  "responseMs": {
    "root": 52,
    "health": 185,
    "data": 247,
    "stats": 202,
    "market": 6048,
    "analytics": 918
  },
  "testedAt": "2026-08-24T10:59:17.229Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-22",
    "databaseContentAudit": "2026-08-22",
    "responseMs": 178,
    "testedAt": "2026-08-24T10:59:17.441Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 465,
    "warmHitMs": 465,
    "rows": 334,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 465,
        "rows": 334
      }
    ],
    "testedAt": "2026-08-24T10:59:17.967Z"
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
  "durationMs": 100,
  "testedAt": "2026-08-24T10:59:19.077Z"
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
  "maxLongTaskMs": 235,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 7.65,
  "testedAt": "2026-08-24T10:59:31Z"
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
  "durationSeconds": 2.53,
  "testedAt": "2026-08-24T10:59:34Z"
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
        "shown": 78,
        "total": 334,
        "renderedRows": 78
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
            "width": 340
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
        "result": "Showing 78 of 334 rows",
        "resultTotal": 334,
        "rowCount": 78,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine2Price+100Implied50.0%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine2.5Price-105Implied51.2%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetRivers \u2197SideNew York JetsLine2.5Price-110Implied52.4%"
        ],
        "scrollWidth": 1265,
        "shown": 78,
        "title": "Live Titans market board",
        "total": 334,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "159453",
        "before": "Showing 78 of 334 rows",
        "after": "Showing 2 of 334 rows"
      },
      "book": {
        "available": true,
        "options": 13,
        "selectedValue": "betonlineag",
        "before": "Showing 78 of 334 rows",
        "after": "Showing 6 of 334 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 78 of 334 rows",
        "after": "Showing 78 of 334 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 78,
      "afterRows": 334
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 334,
        "total": 334,
        "renderedRows": 334
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
            "width": 340
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
        "result": "Showing 334 of 334 rows",
        "resultTotal": 334,
        "rowCount": 334,
        "rowSample": [
          "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine2Price+100Implied50.0%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine2.5Price-105Implied51.2%",
          "New York Jets at Tennessee Titans Spread \u00b7 BetRivers \u2197SideNew York JetsLine2.5Price-110Implied52.4%"
        ],
        "scrollWidth": 1265,
        "shown": 334,
        "title": "Live Titans market board",
        "total": 334,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 334,
      "total": 334,
      "renderedRows": 334
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
      "result": "Showing 334 of 334 rows",
      "resultTotal": 334,
      "rowCount": 334,
      "rowSample": [
        "New York Jets at Tennessee Titans Spread \u00b7 BetUS \u2197SideNew York JetsLine2Price+100Implied50.0%",
        "New York Jets at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideNew York JetsLine2.5Price-105Implied51.2%",
        "New York Jets at Tennessee Titans Spread \u00b7 BetRivers \u2197SideNew York JetsLine2.5Price-110Implied52.4%"
      ],
      "scrollWidth": 375,
      "shown": 334,
      "title": "Live Titans market board",
      "total": 334,
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
  "durationSeconds": 6.06,
  "testedAt": "2026-08-24T10:59:40Z"
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
  "durationSeconds": 2.43,
  "testedAt": "2026-08-24T10:59:43Z"
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
  "gameDayFastPass": true,
  "gameDayFastPassGameId": "c294d349-dc5a-4f82-a796-f82cac0fd776",
  "gameDayFastPassText": "NEXT GAME FAST PASS\nChicago Bears at Titans\nPRESEASON 3\nWHEN\nSat, Aug 29, 5:00 PM CDT \u00b7 5d 11h\nWATCH / LISTEN\nNFL Network \u00b7 WGFX 104.5 FM The Zone\nWHERE\nHome \u00b7 Nissan Stadium\nOpen Listen / Watch\nOfficial schedule \u2197\nStadium guide \u2197\nSchedule facts: TennesseeTitans.com",
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
  "durationSeconds": 4.76,
  "testedAt": "2026-08-24T10:59:48Z"
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
      "answer": "Tennessee is next scheduled to host Chicago Bears on Sat, Aug 29, 5:00 PM CDT (Nashville time).",
      "facts": 4,
      "sources": 1,
      "why": "That is the next non-final, non-bye game in the loaded Titans schedule. NFL Network is the listed network."
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
      "answer": "The next game is Sat, Aug 29, 5:00 PM CDT (Nashville time) and the loaded TV listing is NFL Network. Open Listen / Watch for your device-local time, Eastern time, Nashville time, UTC, radio, and territory-specific viewing guidance.",
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
  "mobileFantasyHandoff": {
    "actionHeight": 46,
    "left": 24,
    "overflow": false,
    "right": 351,
    "viewport": 375
  },
  "browserWarnings": [],
  "durationSeconds": 2.6,
  "testedAt": "2026-08-24T10:59:51Z"
}```

## Change Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "detectedBeforeReview": 122,
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
        "label": "Transaction \u00b7 27"
      }
    ],
    "review": 48,
    "viewport": 375,
    "width": 357
  },
  "browserWarnings": [],
  "durationSeconds": 2.63,
  "testedAt": "2026-08-24T10:59:54Z"
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
      "height": 386.140625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL NetworkWHAT CHANGED?Review team changesSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.ROSTERroster_moveSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "refresh": {
      "cache": [
        {
          "expiresAt": 1787569226088,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787569196088,
          "url": "/api/data"
        },
        {
          "expiresAt": 1787569226002,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787569196002,
          "url": "/api/fan-intel"
        }
      ],
      "epoch": 1,
      "last": {
        "at": "2026-08-24T10:59:55.859Z",
        "epoch": 1,
        "reason": "scoreboard-control",
        "urls": null
      }
    },
    "refreshedPanel": {
      "cards": 4,
      "display": "block",
      "height": 386.140625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL NetworkWHAT CHANGED?Review team changesSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.ROSTERroster_moveSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "returnPanel": {
      "cards": 4,
      "display": "block",
      "height": 386.140625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL NetworkWHAT CHANGED?Review team changesSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.ROSTERroster_moveSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
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
      "panelHeight": 806.921875,
      "panelWidth": 461,
      "reviewHeight": 48,
      "targets": [
        {
          "h": 112,
          "label": "NEXT GAME",
          "w": 427
        },
        {
          "h": 143.8125,
          "label": "WHAT CHANGED?",
          "w": 427
        },
        {
          "h": 143.8125,
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
      "height": 806.921875,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL NetworkWHAT CHANGED?Review team changesSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.ROSTERroster_moveSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
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
  "durationSeconds": 3.89
}```

## Data freshness browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "detail": "Roster yesterday \u00b7 Moves 3 days ago \u00b7 Intel 6 days ago",
    "overflow": false,
    "rect": {
      "bottom": 965.3125,
      "height": 132.03125,
      "left": 915.328125,
      "right": 1216.984375,
      "top": 833.28125,
      "width": 301.65625
    },
    "state": "recent",
    "strong": "Recent server snapshot",
    "text": "DATA FRESHNESSRecent server snapshotRoster yesterday \u00b7 Moves 3 days ago \u00b7 Intel 6 days agoSee sources \u2192",
    "title": "The loaded roster snapshot was captured within the last 48 hours.",
    "viewport": {
      "height": 757,
      "width": 1280
    }
  },
  "mobile": {
    "detail": "Roster yesterday \u00b7 Moves 3 days ago \u00b7 Intel 6 days ago",
    "overflow": false,
    "rect": {
      "bottom": 1642.84375,
      "height": 113.53125,
      "left": 9,
      "right": 366,
      "top": 1529.3125,
      "width": 357
    },
    "state": "recent",
    "strong": "Recent server snapshot",
    "text": "DATA FRESHNESSRecent server snapshotRoster yesterday \u00b7 Moves 3 days ago \u00b7 Intel 6 days agoSee sources \u2192",
    "title": "The loaded roster snapshot was captured within the last 48 hours.",
    "viewport": {
      "height": 701,
      "width": 390
    }
  },
  "browserWarnings": [],
  "durationSeconds": 2.16,
  "testedAt": "2026-08-24T11:00:00Z"
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
    "text": "PersonnelRosterSearch the latest verified Titans roster by name, number, position, or unit.Roster \u00b7 updated yesterdayRos"
  },
  "durationSeconds": 1.95
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
  "durationSeconds": 2.05,
  "testedAt": "2026-08-24T11:00:05Z"
}```

## Player headshot browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "rosterCards": 95,
  "rosterDecoratedHeadshots": 81,
  "rosterLoadedHeadshots": 40,
  "statsPlayerRows": 96,
  "statsDecoratedHeadshots": 82,
  "statsLoadedHeadshots": 16,
  "mobileLoadedHeadshots": 28,
  "richPlayer": "Austin Schlottmann",
  "richPlayerHeadshotLoaded": true,
  "browserWarnings": [],
  "durationSeconds": 3.49,
  "testedAt": "2026-08-24T11:00:09Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
