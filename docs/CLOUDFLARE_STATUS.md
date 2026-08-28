# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `87953e85349f84bdc9d6b35b77af126e93c83a7f`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
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
- Recorded: 2026-08-28T18:56:45Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v74",
  "precachePaths": 125,
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
  "transactionCount": 29,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 95,
  "statsRosterMode": "live-database",
  "statsRosterSource": "Tennessee Titans official roster / transaction snapshot · latest audited database state",
  "completedPreseasonGamebooks": 1,
  "completedPreseasonGames": 2,
  "completedPreseasonGamesWithPlayerStats": 1,
  "completedPreseasonGamesMissingPlayerStats": 1,
  "marketStatus": 200,
  "marketRows": 946,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "87953e85349f84bdc9d6b35b77af126e93c83a7f",
    "builtAt": "2026-08-28T18:55:07.459Z"
  },
  "deploymentPropagationAttempts": 5,
  "responseMs": {
    "root": 92,
    "health": 1029,
    "data": 849,
    "stats": 413,
    "market": 558,
    "analytics": 1612
  },
  "testedAt": "2026-08-28T18:55:47.540Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 718,
    "testedAt": "2026-08-28T18:55:48.292Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "MISS",
    "finalStatus": "HIT",
    "attempts": 2,
    "coldOrInitialMs": 4500,
    "warmHitMs": 240,
    "rows": 946,
    "sequence": [
      {
        "status": "MISS",
        "durationMs": 4500,
        "rows": 946
      },
      {
        "status": "HIT",
        "durationMs": 240,
        "rows": 946
      }
    ],
    "testedAt": "2026-08-28T18:55:53.440Z"
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
  "generatedAt": "2026-08-27T21:19:03.543554+00:00",
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
  "durationMs": 317,
  "testedAt": "2026-08-28T18:55:55.465Z"
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
  "rosterTotal": 95,
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
  "maxLongTaskMs": 312,
  "longTasksOver250ms": 1,
  "browserWarnings": [],
  "durationSeconds": 19.42,
  "testedAt": "2026-08-28T18:56:19Z"
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
  "durationSeconds": 3.57,
  "testedAt": "2026-08-28T18:56:23Z"
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
        "shown": 162,
        "total": 946,
        "renderedRows": 162
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
        "result": "Showing 162 of 946 rows",
        "resultTotal": 946,
        "rowCount": 162,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
        ],
        "scrollWidth": 1265,
        "shown": 162,
        "title": "Live Titans market board",
        "total": 946,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "159453",
        "before": "Showing 162 of 946 rows",
        "after": "Showing 94 of 946 rows"
      },
      "book": {
        "available": true,
        "options": 16,
        "selectedValue": "onexbet",
        "before": "Showing 162 of 946 rows",
        "after": "Showing 6 of 946 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 162 of 946 rows",
        "after": "Showing 162 of 946 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 162,
      "afterRows": 946
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 946,
        "total": 946,
        "renderedRows": 946
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
        "result": "Showing 946 of 946 rows",
        "resultTotal": 946,
        "rowCount": 946,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
        ],
        "scrollWidth": 1265,
        "shown": 946,
        "title": "Live Titans market board",
        "total": 946,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 946,
      "total": 946,
      "renderedRows": 946
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
      "result": "Showing 946 of 946 rows",
      "resultTotal": 946,
      "rowCount": 946,
      "rowSample": [
        "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
      ],
      "scrollWidth": 375,
      "shown": 946,
      "title": "Live Titans market board",
      "total": 946,
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
  "durationSeconds": 7.6,
  "testedAt": "2026-08-28T18:56:31Z"
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
  "durationSeconds": 2.62,
  "testedAt": "2026-08-28T18:56:34Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "cutdown:desktop",
  "error": "TimeoutError: Cutdown view did not settle after roster refresh: {'buttonConnected': True, 'exists': True, 'panelConnected': True, 'selected': False, 'visible': True}",
  "durationSeconds": 10.85,
  "testedAt": "2026-08-28T18:56:45Z",
  "hash": "#roster?view=cutdown",
  "pageText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 updated 2 days ago\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\n53-MAN CUTDOWN COMMAND\nFinal roster clock\n\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\n\nTIME REMAINING\n2d 3h\nSun, Aug 30, 6:00 PM EDT\nLoaded roster\n95\nAll current rows\nActive rows\n91\nLoaded status = Active\nReserve / other\n4\nNot counted as active rows here\nFinal active limit\n53\n38 loaded active rows above 53\nPOSITION SHAPE\nActive rows by position\nFull roster \u2192\n13\nWR\n9\nCB\n9\nLB\n8\nDE\n7\nRB\n7\nT\n6\nDT\n6\nG\n6\nS\n5\nTE\n4\nQB\n3\nC\n3\nDL\n2\nDB\n1\nK\n1\nLS\n1\nP\nMOVEMENT WIRE\nLatest loaded transactions\nAll moves \u2192\n2026-08-25\n\nWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.\n\n2026-08-24\n\nSigned LB Reid Carrico and placed LB Milo Eifler on injured reserve.\n\n2026-08-21\n\nWaived LB Sean Brown from injured reserve with an injury settlement; placed DB Nazeeh Johnson on injured reserve; waived TE Matt Lauter; signed free agents LB Milo Eifler and DE Tanoh Kpassagnon.\n\n2026-08-19\n\nWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.\n\n2026-08-17\n\nWaived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.\n\n2026-08-16\n\nPlaced DE Jaylen Harrell and TE Jaren Kanak on injured reserve and signed free-agent TE Matt Lauter and RB Dominic Richardson.\n\nMY 53 \u00b7 FAN BOARD\nBuild your own Titans 53\n\nYour picks stay on this device. This is a fan roster exercise\u2014not an official roster projection or report.\n\n0 / 53\nClear picks\nNo fan picks yet.\n#61\nAndre James\nC \u00b7 Offense\n+\n#51\nAustin Schlottmann\nC \u00b7 Offense\n+\n#79\nPat Coogan\nC \u00b7 Offense\n+\n#73\nCordell Volson\nG \u00b7 Offense\n+\n#67\nDrew Moss\nG \u00b7 Offense\n+\n#66\nFernando Carmona Jr.\nG \u00b7 Offense\n+\n#71\nGarrett Dellinger\nG \u00b7 Offense\n+\n#64\nJackson Slater\nG \u00b7 Offense\n+\n#77\nPeter Skoronski\nG \u00b7 Offense\n+\n#1\nCam Ward\nQB \u00b7 Offense\n+\n#16\nHendon Hooker\nQB \u00b7 Offense\n+\n#10\nMitchell Trubisky\nQB \u00b7 Offense\n+\n#8\nWill Levis\nQB \u00b7 Offense\n+\n#21\nD'Ernest Johnson\nRB \u00b7 Offense\n+\n#36\nJulius Chestnu",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
