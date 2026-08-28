# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `5dcc57f1074c14ac800a83c6f53ce9ba48c01c38`
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
- Recorded: 2026-08-28T22:42:46Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v75",
  "precachePaths": 128,
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
  "marketRows": 948,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "5dcc57f1074c14ac800a83c6f53ce9ba48c01c38",
    "builtAt": "2026-08-28T22:41:05.406Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 91,
    "health": 166,
    "data": 329,
    "stats": 252,
    "market": 6003,
    "analytics": 364
  },
  "testedAt": "2026-08-28T22:41:37.500Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 189,
    "testedAt": "2026-08-28T22:41:37.720Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 624,
    "warmHitMs": 624,
    "rows": 948,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 624,
        "rows": 948
      }
    ],
    "testedAt": "2026-08-28T22:41:38.406Z"
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
  "generatedAt": "2026-08-28T21:31:46.577091+00:00",
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
  "durationMs": 113,
  "testedAt": "2026-08-28T22:41:38.938Z"
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
  "maxLongTaskMs": 295,
  "longTasksOver250ms": 1,
  "browserWarnings": [],
  "durationSeconds": 35.47,
  "testedAt": "2026-08-28T22:42:23Z"
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
  "durationSeconds": 3.0,
  "testedAt": "2026-08-28T22:42:26Z"
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
        "total": 948,
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
        "result": "Showing 162 of 948 rows",
        "resultTotal": 948,
        "rowCount": 162,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
        ],
        "scrollWidth": 1265,
        "shown": 162,
        "title": "Live Titans market board",
        "total": 948,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "159453",
        "before": "Showing 162 of 948 rows",
        "after": "Showing 94 of 948 rows"
      },
      "book": {
        "available": true,
        "options": 16,
        "selectedValue": "onexbet",
        "before": "Showing 162 of 948 rows",
        "after": "Showing 6 of 948 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 162 of 948 rows",
        "after": "Showing 162 of 948 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 162,
      "afterRows": 948
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 948,
        "total": 948,
        "renderedRows": 948
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
        "result": "Showing 948 of 948 rows",
        "resultTotal": 948,
        "rowCount": 948,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
        ],
        "scrollWidth": 1265,
        "shown": 948,
        "title": "Live Titans market board",
        "total": 948,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 948,
      "total": 948,
      "renderedRows": 948
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
      "result": "Showing 948 of 948 rows",
      "resultTotal": 948,
      "rowCount": 948,
      "rowSample": [
        "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
      ],
      "scrollWidth": 375,
      "shown": 948,
      "title": "Live Titans market board",
      "total": 948,
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
  "durationSeconds": 5.92,
  "testedAt": "2026-08-28T22:42:32Z"
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
  "durationSeconds": 2.58,
  "testedAt": "2026-08-28T22:42:35Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "cutdown:desktop",
  "error": "TimeoutError: Cutdown view did not settle after roster refresh: {'buttonConnected': True, 'exists': True, 'panelConnected': True, 'sameButton': False, 'selected': False, 'visible': True}",
  "durationSeconds": 9.88,
  "testedAt": "2026-08-28T22:42:45Z",
  "hash": "#roster?view=cutdown",
  "pageText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 updated 2 days ago\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\n53-MAN CUTDOWN COMMAND\nFinal roster clock\n\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\n\nTIME REMAINING\n1d 23h\nSun, Aug 30, 6:00 PM EDT\nLoaded roster\n95\nAll current rows\nActive rows\n91\nLoaded status = Active\nReserve / other\n4\nNot counted as active rows here\nFinal active limit\n53\n38 loaded active rows above 53\nPOSITION SHAPE\nActive rows by position\nFull roster \u2192\n13\nWR\n9\nCB\n9\nLB\n8\nDE\n7\nRB\n7\nT\n6\nDT\n6\nG\n6\nS\n5\nTE\n4\nQB\n3\nC\n3\nDL\n2\nDB\n1\nK\n1\nLS\n1\nP\nMOVEMENT WIRE\nLatest loaded transactions\nAll moves \u2192\n2026-08-25\n\nWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.\n\n2026-08-24\n\nSigned LB Reid Carrico and placed LB Milo Eifler on injured reserve.\n\n2026-08-21\n\nWaived LB Sean Brown from injured reserve with an injury settlement; placed DB Nazeeh Johnson on injured reserve; waived TE Matt Lauter; signed free agents LB Milo Eifler and DE Tanoh Kpassagnon.\n\n2026-08-19\n\nWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.\n\n2026-08-17\n\nWaived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.\n\n2026-08-16\n\nPlaced DE Jaylen Harrell and TE Jaren Kanak on injured reserve and signed free-agent TE Matt Lauter and RB Dominic Richardson.\n\nMY 53 \u00b7 FAN BOARD\nBuild your own Titans 53\n\nYour picks stay on this device. This is a fan roster exercise\u2014not an official roster projection or report.\n\n0 / 53\nClear picks\nNo fan picks yet.\n#61\nAndre James\nC \u00b7 Offense\n+\n#51\nAustin Schlottmann\nC \u00b7 Offense\n+\n#79\nPat Coogan\nC \u00b7 Offense\n+\n#73\nCordell Volson\nG \u00b7 Offense\n+\n#67\nDrew Moss\nG \u00b7 Offense\n+\n#66\nFernando Carmona Jr.\nG \u00b7 Offense\n+\n#71\nGarrett Dellinger\nG \u00b7 Offense\n+\n#64\nJackson Slater\nG \u00b7 Offense\n+\n#77\nPeter Skoronski\nG \u00b7 Offense\n+\n#1\nCam Ward\nQB \u00b7 Offense\n+\n#16\nHendon Hooker\nQB \u00b7 Offense\n+\n#10\nMitchell Trubisky\nQB \u00b7 Offense\n+\n#8\nWill Levis\nQB \u00b7 Offense\n+\n#21\nD'Ernest Johnson\nRB \u00b7 Offense\n+\n#36\nJulius Chestn",
  "cutdownAriaTrace": [
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 1540.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 1650.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 1755,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 1861,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 1966.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2071.9,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2176.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2281.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2386.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2490.7,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2596.9,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2701.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2807.9,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 2912.2,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3016.5,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3121.9,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3227.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3335.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3440,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3546.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3651,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3755,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3859.2,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 3963.5,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4068.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4172.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4278.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4382.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4488.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4592.9,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4697.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4803.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 4908.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5013.2,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5118.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5223.5,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5328.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5434.7,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5539.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5644.1,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5751.7,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5857,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 5961.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6067.1,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6172.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6278.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6383.1,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6489.9,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6595.1,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6702.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6808.2,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 6913.7,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7019.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7127.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7235.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7340,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7446.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7551.7,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7657.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7762.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7870.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 7978.2,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8086.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8191.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8300.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8406.7,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8515.4,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8623.5,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8730.6,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8838.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 8945.9,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 9050.8,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 9155.2,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 9260.3,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 9368,
      "value": "true"
    },
    {
      "connected": true,
      "hash": "#roster?view=cutdown",
      "kind": "setAttribute",
      "sameButton": true,
      "stack": [
        "    at Element.setAttribute (eval at executeScript (:416:16), <anonymous>:18:26)",
        "    at https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:356",
        "    at Array.forEach (<anonymous>)",
        "    at setRosterView (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:26:271)",
        "    at HTMLDivElement.handleTeamRoomActivation (https://titans-command-center.alecjordanprice.workers.dev/team-room.js?v=28:31:278)",
        "    at eval (eval at executeScript (:416:16), <anonymous>:8:80)",
        "    at executeScript (<anonymous>:418:30)",
        "    at <anonymous>:423:24",
        "    at callFunction (<anonymous>:386:22)",
        "    at <anonymous>:400:23"
      ],
      "time": 9472.3,
      "value": "true"
    }
  ],
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
