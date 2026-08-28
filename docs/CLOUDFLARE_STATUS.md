# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `39aa7e9b461e6180a047960972734c2b37df541d`
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
- Recorded: 2026-08-28T23:06:14Z

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
  "marketRows": 0,
  "marketMode": "no-current-source",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "39aa7e9b461e6180a047960972734c2b37df541d",
    "builtAt": "2026-08-28T23:04:49.015Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 18,
    "health": 403,
    "data": 572,
    "stats": 339,
    "market": 7043,
    "analytics": 652
  },
  "testedAt": "2026-08-28T23:05:22.470Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 435,
    "testedAt": "2026-08-28T23:05:22.941Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "MISS",
    "finalStatus": "HIT",
    "attempts": 2,
    "coldOrInitialMs": 11794,
    "warmHitMs": 560,
    "rows": 950,
    "sequence": [
      {
        "status": "MISS",
        "durationMs": 11794,
        "rows": 950
      },
      {
        "status": "HIT",
        "durationMs": 560,
        "rows": 950
      }
    ],
    "testedAt": "2026-08-28T23:05:35.707Z"
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
  "durationMs": 105,
  "testedAt": "2026-08-28T23:05:36.561Z"
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
  "maxLongTaskMs": 92,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 14.85,
  "testedAt": "2026-08-28T23:05:55Z"
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
  "durationSeconds": 2.19,
  "testedAt": "2026-08-28T23:05:58Z"
}```

## Market Pulse browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "initial": {
      "state": {
        "quality": "Unavailable",
        "provider": "No verified current market source",
        "shown": null,
        "total": 0,
        "renderedRows": 0
      },
      "summary": {
        "controls": [],
        "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
        "errorVisible": false,
        "overflow": false,
        "provider": "No verified current market source",
        "quality": "Unavailable",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "",
        "resultTotal": null,
        "rowCount": 0,
        "rowSample": [],
        "scrollWidth": 1265,
        "shown": null,
        "title": "Titans market status",
        "total": 0,
        "viewport": 1265
      }
    },
    "refresh": {
      "state": {
        "quality": "Unavailable",
        "provider": "No verified current market source",
        "shown": null,
        "total": 0,
        "renderedRows": 0
      },
      "summary": {
        "controls": [],
        "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
        "errorVisible": false,
        "overflow": false,
        "provider": "No verified current market source",
        "quality": "Unavailable",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "",
        "resultTotal": null,
        "rowCount": 0,
        "rowSample": [],
        "scrollWidth": 1265,
        "shown": null,
        "title": "Titans market status",
        "total": 0,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Unavailable",
      "provider": "No verified current market source",
      "shown": null,
      "total": 0,
      "renderedRows": 0
    },
    "summary": {
      "controls": [],
      "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
      "errorVisible": false,
      "overflow": false,
      "provider": "No verified current market source",
      "quality": "Unavailable",
      "referenceNotice": "",
      "refreshHeight": 44,
      "result": "",
      "resultTotal": null,
      "rowCount": 0,
      "rowSample": [],
      "scrollWidth": 375,
      "shown": null,
      "title": "Titans market status",
      "total": 0,
      "viewport": 375
    },
    "rowGeometry": []
  },
  "browserWarnings": [],
  "durationSeconds": 1.43,
  "testedAt": "2026-08-28T23:06:00Z"
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
  "durationSeconds": 2.78,
  "testedAt": "2026-08-28T23:06:03Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "cutdown:desktop",
  "error": "TimeoutError: Cutdown view did not settle after roster refresh: {'buttonConnected': True, 'exists': True, 'panelConnected': True, 'sameButton': False, 'selected': False, 'visible': True}",
  "durationSeconds": 10.27,
  "testedAt": "2026-08-28T23:06:13Z",
  "hash": "#roster?view=cutdown",
  "pageText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 updated 2 days ago\nRoster \u00b7 updated 2 days ago\nRoster \u00b7 updated 2 days ago\nRoster \u00b7 updated 2 days ago\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\n53-MAN CUTDOWN COMMAND\nFinal roster clock\n\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\n\nTIME REMAINING\n1d 22h\nSun, Aug 30, 6:00 PM EDT\nLoaded roster\n95\nAll current rows\nActive rows\n91\nLoaded status = Active\nReserve / other\n4\nNot counted as active rows here\nFinal active limit\n53\n38 loaded active rows above 53\nPOSITION SHAPE\nActive rows by position\nFull roster \u2192\n13\nWR\n9\nCB\n9\nLB\n8\nDE\n7\nRB\n7\nT\n6\nDT\n6\nG\n6\nS\n5\nTE\n4\nQB\n3\nC\n3\nDL\n2\nDB\n1\nK\n1\nLS\n1\nP\nMOVEMENT WIRE\nLatest loaded transactions\nAll moves \u2192\n2026-08-25\n\nWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.\n\n2026-08-24\n\nSigned LB Reid Carrico and placed LB Milo Eifler on injured reserve.\n\n2026-08-21\n\nWaived LB Sean Brown from injured reserve with an injury settlement; placed DB Nazeeh Johnson on injured reserve; waived TE Matt Lauter; signed free agents LB Milo Eifler and DE Tanoh Kpassagnon.\n\n2026-08-19\n\nWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.\n\n2026-08-17\n\nWaived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.\n\n2026-08-16\n\nPlaced DE Jaylen Harrell and TE Jaren Kanak on injured reserve and signed free-agent TE Matt Lauter and RB Dominic Richardson.\n\nMY 53 \u00b7 FAN BOARD\nBuild your own Titans 53\n\nYour picks stay on this device. This is a fan roster exercise\u2014not an official roster projection or report.\n\n0 / 53\nClear picks\nNo fan picks yet.\n#61\nAndre James\nC \u00b7 Offense\n+\n#51\nAustin Schlottmann\nC \u00b7 Offense\n+\n#79\nPat Coogan\nC \u00b7 Offense\n+\n#73\nCordell Volson\nG \u00b7 Offense\n+\n#67\nDrew Moss\nG \u00b7 Offense\n+\n#66\nFernando Carmona Jr.\nG \u00b7 Offense\n+\n#71\nGarrett Dellinger\nG \u00b7 Offense\n+\n#64\nJackson Slater\nG \u00b7 Offense\n+\n#77\nPeter Skoronski\nG \u00b7 Offense\n+\n#1\nCam Ward\nQB \u00b7 Offense\n+\n#16\nHendon Hooker\nQB \u00b7 Offense\n+\n#10\nMitchell Trubisky\nQB \u00b7 Offense\n",
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
      "time": 1863.2,
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
      "time": 1979.3,
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
      "time": 2086.4,
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
      "time": 2193.2,
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
      "time": 2299,
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
      "time": 2404.1,
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
      "time": 2510.1,
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
      "time": 2615.3,
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
      "time": 2720.6,
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
      "time": 2826,
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
      "time": 2930.9,
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
      "time": 3036.3,
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
      "time": 3141.7,
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
      "time": 3246.8,
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
      "time": 3352,
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
      "time": 3457.5,
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
      "time": 3562.7,
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
      "time": 3667.8,
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
      "time": 3773,
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
      "time": 3878.2,
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
      "time": 3983.4,
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
      "time": 4088.9,
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
      "time": 4194.3,
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
      "time": 4299.5,
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
      "time": 4404.3,
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
      "time": 4509.5,
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
      "time": 4614.7,
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
      "time": 4719.8,
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
      "time": 4824.8,
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
      "time": 4930.1,
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
      "time": 5035.9,
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
      "time": 5141,
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
      "time": 5245.9,
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
      "time": 5351.1,
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
      "time": 5456.3,
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
      "time": 5561.5,
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
      "time": 5666.6,
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
      "time": 5771.9,
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
      "time": 5877.2,
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
      "time": 5982.8,
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
      "time": 6087.9,
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
      "time": 6192.9,
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
      "time": 6298.5,
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
      "time": 6403.6,
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
      "time": 6509.1,
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
      "time": 6614.2,
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
      "time": 6719.7,
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
      "time": 6824.8,
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
      "time": 6929.9,
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
      "time": 7034.9,
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
      "time": 7140.2,
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
      "time": 7245.5,
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
      "time": 7350.3,
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
      "time": 7455.5,
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
      "time": 7560.7,
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
      "time": 7665.7,
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
      "time": 7771,
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
      "time": 7876,
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
      "time": 7981.2,
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
      "time": 8089.8,
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
      "time": 8195,
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
      "time": 8299.8,
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
      "time": 8404.7,
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
      "time": 8509.6,
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
      "time": 8614.6,
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
      "time": 8719.4,
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
      "time": 8824.5,
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
      "time": 8929.3,
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
      "time": 9034.2,
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
      "time": 9139.3,
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
      "time": 9244.4,
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
      "time": 9349.4,
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
      "time": 9454.6,
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
      "time": 9559.8,
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
      "time": 9664.8,
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
      "time": 9769.8,
      "value": "true"
    }
  ],
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
