# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `77aa9a46be9142f5a61e29da9a9512f4545299ef`
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
- Recorded: 2026-08-26T20:14:07Z

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
  "precachePaths": 108,
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
  "marketRows": 852,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "77aa9a46be9142f5a61e29da9a9512f4545299ef",
    "builtAt": "2026-08-26T20:12:55.865Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 46,
    "health": 402,
    "data": 887,
    "stats": 338,
    "market": 1375,
    "analytics": 639
  },
  "testedAt": "2026-08-26T20:13:22.231Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 485,
    "testedAt": "2026-08-26T20:13:22.758Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 257,
    "warmHitMs": 257,
    "rows": 852,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 257,
        "rows": 852
      }
    ],
    "testedAt": "2026-08-26T20:13:23.081Z"
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
  "generatedAt": "2026-08-26T12:04:27.347044+00:00",
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
  "durationMs": 175,
  "testedAt": "2026-08-26T20:13:24.024Z"
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
  "maxLongTaskMs": 135,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 14.18,
  "testedAt": "2026-08-26T20:13:41Z"
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
  "durationSeconds": 2.68,
  "testedAt": "2026-08-26T20:13:44Z"
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
        "shown": 150,
        "total": 852,
        "renderedRows": 150
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
        "result": "Showing 150 of 852 rows",
        "resultTotal": 852,
        "rowCount": 150,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-108Implied51.9%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine2.5Price-115Implied53.5%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetUS \u2197SideChicago BearsLine2.5Price-115Implied53.5%"
        ],
        "scrollWidth": 1265,
        "shown": 150,
        "title": "Live Titans market board",
        "total": 852,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "159453",
        "before": "Showing 150 of 852 rows",
        "after": "Showing 82 of 852 rows"
      },
      "book": {
        "available": true,
        "options": 14,
        "selectedValue": "betonlineag",
        "before": "Showing 150 of 852 rows",
        "after": "Showing 12 of 852 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 150 of 852 rows",
        "after": "Showing 150 of 852 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 150,
      "afterRows": 852
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 852,
        "total": 852,
        "renderedRows": 852
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
        "result": "Showing 852 of 852 rows",
        "resultTotal": 852,
        "rowCount": 852,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-108Implied51.9%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine2.5Price-115Implied53.5%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetUS \u2197SideChicago BearsLine2.5Price-115Implied53.5%"
        ],
        "scrollWidth": 1265,
        "shown": 852,
        "title": "Live Titans market board",
        "total": 852,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 852,
      "total": 852,
      "renderedRows": 852
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
      "result": "Showing 852 of 852 rows",
      "resultTotal": 852,
      "rowCount": 852,
      "rowSample": [
        "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-108Implied51.9%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine2.5Price-115Implied53.5%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 BetUS \u2197SideChicago BearsLine2.5Price-115Implied53.5%"
      ],
      "scrollWidth": 375,
      "shown": 852,
      "title": "Live Titans market board",
      "total": 852,
      "viewport": 375
    },
    "rowGeometry": [
      {
        "height": 137.59375,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 137.59375,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 137.59375,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 137.59375,
        "left": 9,
        "right": 366,
        "width": 357
      }
    ]
  },
  "browserWarnings": [],
  "durationSeconds": 6.31,
  "testedAt": "2026-08-26T20:13:51Z"
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
  "durationSeconds": 2.91,
  "testedAt": "2026-08-26T20:13:54Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "roster:stability",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 12.02,
  "testedAt": "2026-08-26T20:14:06Z",
  "hash": "#roster",
  "pageText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 updated 6 hours ago\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\nRoster coverage: this page is currently using a 95-player partial fallback. That count is not the size of the Titans roster. Titans roster \u2197\nCONTENT AUDIT: AUG. 22, 2026\nSource note: The Tennessee Titans roster page lagged the team\u2019s Aug. 24 transaction announcement. The newer official transaction controls: Reid Carrico is active and Milo Eifler is on Reserve/Injured until the roster page catches up. NFL roster cross-check \u2197\nLOADED\n95\nplayers\nACTIVE\n91\ncurrent active listing\nRESERVE / INJURED\n4\nseparate status group\nROSTER CHECKED\nAug 24, 2026\nTitans official roster\nAll units\nOffense\nDefense\nSpecial Teams\nSTATUS\nALL\nACTIVE\nRESERVE / INJURED\nCLEAR FILTERS\n95 of 95 players shown\n61\nAndre James\n\nC \u00b7 Offense\n\nActive\n51\nAustin Schlottmann\n\nC \u00b7 Offense\n\nActive\n79\nPat Coogan\n\nC \u00b7 Offense\n\nActive\n73\nCordell Volson\n\nG \u00b7 Offense\n\nActive\n67\nDrew Moss\n\nG \u00b7 Offense\n\nActive\n66\nFernando Carmona Jr.\n\nG \u00b7 Offense\n\nActive\n71\nGarrett Dellinger\n\nG \u00b7 Offense\n\nActive\n64\nJackson Slater\n\nG \u00b7 Offense\n\nActive\n77\nPeter Skoronski\n\nG \u00b7 Offense\n\nActive\n1\nCam Ward\n\nQB \u00b7 Offense\n\nActive\n16\nHendon Hooker\n\nQB \u00b7 Offense\n\nActive\n10\nMitchell Trubisky\n\nQB \u00b7 Offense\n\nActive\n8\nWill Levis\n\nQB \u00b7 Offense\n\nActive\n21\nD'Ernest Johnson\n\nRB \u00b7 Offense\n\nActive\n36\nJulius Chestnut\n\nRB \u00b7 Offense\n\nActive\n31\nKalel Mullings\n\nRB \u00b7 Offense\n\nActive\n35\nMichael Carter\n\nRB \u00b7 Offense\n\nActive\n32\nNicholas Singleton\n\nRB \u00b7 Offense\n\nActive\n20\nTony Pollard\n\nRB \u00b7 Offense\n\nActive\n2\nTyjae Spears\n\nRB \u00b7 Offense\n\nActive\n69\nAamil Wagner\n\nT \u00b7 Offense\n\nActive\n76\nAustin Deculus\n\nT \u00b7 Offense\n\nActive\n78\nBrandon Crenshaw-Dickson\n\nT \u00b7 Offense\n\nActive\n75\nDan Moore Jr.\n\nT \u00b7 Offense\n\nActive\n55\nJC Latham\n\nT \u00b7 Offense\n\nActive\n62\nRasheed Miller\n\nT \u00b7 Offense\n\nActive\n72\nZachary Thomas\n\nT \u00b7 Offense\n\nActive\n82\nDaniel Bellinger\n\nTE \u00b7 Offense\n\nActive\n88\nDavid Martin-Robinson\n\nTE \u00b7 Offense\n\nActive\n84\nGunnar Helm\n\nTE \u00b7 Offense\n\nActive\n81\nJaren Kanak\n\nTE \u00b7 Offense\n\nReserve/Injured\n83\nJoel Wilson\n\nTE \u00b7 Offense\n\nActive\n86\nKylen Granson\n\nTE \u00b7 Offense\n\nActive\n80\nBryce Oliver\n\nWR \u00b7 Offense\n\nActive\n0\nCalvin Ridley\n\nWR \u00b7 Offense\n\nActive\n14\nCarnell Tate\n\nWR \u00b7 Offense\n\nActive\n17\nChimere Dike\n\nWR \u00b7 Offense\n\nActive\n39\nCourtney Jackson\n\nWR \u00b7 Offense\n\nActive\n5\nElic Ayomanor\n\nWR \u00b7 Offense\n\nActive\n13\nHank Beatty\n\n",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
