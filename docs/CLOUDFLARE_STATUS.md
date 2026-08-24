# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `497216065075f255dd72a34cbf139116f9497f89`
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
- Recorded: 2026-08-24T16:16:56Z

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
  "precachePaths": 107,
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
  "marketRows": 392,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "497216065075f255dd72a34cbf139116f9497f89",
    "builtAt": "2026-08-24T16:15:36.408Z"
  },
  "deploymentPropagationAttempts": 5,
  "responseMs": {
    "root": 32,
    "health": 178,
    "data": 449,
    "stats": 322,
    "market": 250,
    "analytics": 503
  },
  "testedAt": "2026-08-24T16:16:15.191Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-22",
    "databaseContentAudit": "2026-08-22",
    "responseMs": 179,
    "testedAt": "2026-08-24T16:16:15.404Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 112,
    "warmHitMs": 112,
    "rows": 392,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 112,
        "rows": 392
      }
    ],
    "testedAt": "2026-08-24T16:16:15.579Z"
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
  "generatedAt": "2026-08-24T12:02:16.151255+00:00",
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
  "durationMs": 111,
  "testedAt": "2026-08-24T16:16:16.295Z"
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
  "maxLongTaskMs": 348,
  "longTasksOver250ms": 2,
  "browserWarnings": [],
  "durationSeconds": 19.88,
  "testedAt": "2026-08-24T16:16:42Z"
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
  "durationSeconds": 2.04,
  "testedAt": "2026-08-24T16:16:44Z"
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
        "shown": 122,
        "total": 392,
        "renderedRows": 122
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
        "result": "Showing 122 of 392 rows",
        "resultTotal": 392,
        "rowCount": 122,
        "rowSample": [
          "CHI Bears at TEN Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine1.5Price-115Implied53.5%",
          "CHI Bears at TEN Titans Spread \u00b7 MyBookie.ag \u2197SideChicago BearsLine0.5Price-110Implied52.4%",
          "CHI Bears at TEN Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price-110Implied52.4%"
        ],
        "scrollWidth": 1265,
        "shown": 122,
        "title": "Live Titans market board",
        "total": 392,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "159453",
        "before": "Showing 122 of 392 rows",
        "after": "Showing 46 of 392 rows"
      },
      "book": {
        "available": true,
        "options": 14,
        "selectedValue": "betonlineag",
        "before": "Showing 122 of 392 rows",
        "after": "Showing 10 of 392 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 122 of 392 rows",
        "after": "Showing 122 of 392 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 122,
      "afterRows": 392
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 392,
        "total": 392,
        "renderedRows": 392
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
        "result": "Showing 392 of 392 rows",
        "resultTotal": 392,
        "rowCount": 392,
        "rowSample": [
          "CHI Bears at TEN Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine1.5Price-115Implied53.5%",
          "CHI Bears at TEN Titans Spread \u00b7 MyBookie.ag \u2197SideChicago BearsLine0.5Price-110Implied52.4%",
          "CHI Bears at TEN Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price-110Implied52.4%"
        ],
        "scrollWidth": 1265,
        "shown": 392,
        "title": "Live Titans market board",
        "total": 392,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 392,
      "total": 392,
      "renderedRows": 392
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
      "result": "Showing 392 of 392 rows",
      "resultTotal": 392,
      "rowCount": 392,
      "rowSample": [
        "CHI Bears at TEN Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine1.5Price-115Implied53.5%",
        "CHI Bears at TEN Titans Spread \u00b7 MyBookie.ag \u2197SideChicago BearsLine0.5Price-110Implied52.4%",
        "CHI Bears at TEN Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price-110Implied52.4%"
      ],
      "scrollWidth": 375,
      "shown": 392,
      "title": "Live Titans market board",
      "total": 392,
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
  "durationSeconds": 6.67,
  "testedAt": "2026-08-24T16:16:51Z"
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
  "durationSeconds": 2.47,
  "testedAt": "2026-08-24T16:16:53Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "cutdown:desktop",
  "error": "RuntimeError: Cutdown Command contract failed: {'activePressed': '', 'disclaimer': True, 'limitText': True, 'nflSource': True, 'text': \"53-MAN CUTDOWN COMMAND\\nFinal roster clock\\n\\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\\n\\nTIME REMAINING\\n6d 5h\\nSun, Aug 30, 6:00 PM EDT\\nLoaded roster\\n95\\nAll current rows\\nActive rows\\n91\\nLoaded status = Active\\nReserve / other\\n4\\nNot counted as active rows here\\nFinal active limit\\n53\\n38 loaded active rows above 53\\nPOSITION SHAPE\\nActive rows by position\\nFull roster \u2192\\n13\\nWR\\n9\\nCB\\n9\\nLB\\n8\\nDE\\n7\\nRB\\n7\\nT\\n6\\nDT\\n6\\nG\\n6\\nS\\n5\\nTE\\n4\\nQB\\n3\\nC\\n3\\nDL\\n2\\nDB\\n1\\nK\\n1\\nLS\\n1\\nP\\nMOVEMENT WIRE\\nLatest loaded transactions\\nAll moves \u2192\\n2026-08-21\\n\\nSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.\\n\\n2026-08-19\\n\\nWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.\\n\\n2026-08-17\\n\\nWaived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.\\n\\n2026-08-16\\n\\nPlaced DE Jaylen Harrell and TE Jaren Kanak on injured reserve and signed free-agent TE Matt Lauter and RB Dominic Richardson.\\n\\n2026-08-10\\n\\nWaived LB Shad Banks Jr. from injured reserve with an injury settlement.\\n\\n2026-08-06\\n\\nWaived injured LB Shad Banks Jr. and signed free-agent LB Dominique Hampton.\\n\\nMY 53 \u00b7 FAN BOARD\\nBuild your own Titans 53\\n\\nYour picks stay on this device. This is a fan roster exercise\u2014not an official roster projection or report.\\n\\n0 / 53\\nClear picks\\nNo fan picks yet.\\n#61\\nAndre James\\nC \u00b7 Offense\\n+\\n#51\\nAustin Schlottmann\\nC \u00b7 Offense\\n+\\n#79\\nPat Coogan\\nC \u00b7 Offense\\n+\\n#73\\nCordell Volson\\nG \u00b7 Offense\\n+\\n#67\\nDrew Moss\\nG \u00b7 Offense\\n+\\n#66\\nFernando Carmona Jr.\\nG \u00b7 Offense\\n+\\n#71\\nGarrett Dellinger\\nG \u00b7 Offense\\n+\\n#64\\nJackson Slater\\nG \u00b7 Offense\\n+\\n#77\\nPeter Skoronski\\nG \u00b7 Offense\\n+\\n#1\\nCam Ward\\nQB \u00b7 Offense\\n+\\n#16\\nHendon Hooker\\nQB \u00b7 Offense\\n+\\n#10\\nMitchell Trubisky\\nQB \u00b7 Offense\\n+\\n#8\\nWill Levis\\nQB \u00b7 Offense\\n+\\n#21\\nD'Ernest Johnson\\nRB \u00b7 Offense\\n+\\n#36\\nJulius Chestnut\\nRB \u00b7 Offense\\n+\\n#31\\nKalel Mullings\\nRB \u00b7 Offense\\n+\\n#35\\nMichael Carter\\nRB \u00b7 Offense\\n+\\n#32\\nNicholas Singleton\\nRB \u00b7 Offense\\n+\\n#20\\nTony Pollard\\nRB \u00b7 Offense\\n+\\n#2\\nTyjae Spears\\nRB \u00b7 Offense\\n+\\n#69\\nAamil Wagner\\nT \u00b7 Offense\\n+\\n#76\\nAustin Deculus\\nT \u00b7 Offense\\n+\\n#78\\nBrandon Crenshaw-Dickson\\nT \u00b7 Offense\\n+\\n#75\\nDan Moore Jr.\\nT \u00b7 Offense\\n+\\n#55\\nJC Latham\\nT \u00b7 Offense\\n\", 'titansMoves': True}",
  "durationSeconds": 1.7,
  "testedAt": "2026-08-24T16:16:55Z",
  "hash": "#roster",
  "pageText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 updated yesterday\nRoster \u00b7 updated yesterday\nRoster \u00b7 updated yesterday\nRoster \u00b7 updated yesterday\nRoster \u00b7 updated yesterday\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\n53-MAN CUTDOWN COMMAND\nFinal roster clock\n\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\n\nTIME REMAINING\n6d 5h\nSun, Aug 30, 6:00 PM EDT\nLoaded roster\n95\nAll current rows\nActive rows\n91\nLoaded status = Active\nReserve / other\n4\nNot counted as active rows here\nFinal active limit\n53\n38 loaded active rows above 53\nPOSITION SHAPE\nActive rows by position\nFull roster \u2192\n13\nWR\n9\nCB\n9\nLB\n8\nDE\n7\nRB\n7\nT\n6\nDT\n6\nG\n6\nS\n5\nTE\n4\nQB\n3\nC\n3\nDL\n2\nDB\n1\nK\n1\nLS\n1\nP\nMOVEMENT WIRE\nLatest loaded transactions\nAll moves \u2192\n2026-08-21\n\nSigned DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.\n\n2026-08-19\n\nWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.\n\n2026-08-17\n\nWaived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.\n\n2026-08-16\n\nPlaced DE Jaylen Harrell and TE Jaren Kanak on injured reserve and signed free-agent TE Matt Lauter and RB Dominic Richardson.\n\n2026-08-10\n\nWaived LB Shad Banks Jr. from injured reserve with an injury settlement.\n\n2026-08-06\n\nWaived injured LB Shad Banks Jr. and signed free-agent LB Dominique Hampton.\n\nMY 53 \u00b7 FAN BOARD\nBuild your own Titans 53\n\nYour picks stay on this device.",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
