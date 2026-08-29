# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `695953ae4eeaad7e920e21a0911b26ffcde782f7`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- YouTube Data API configured: true
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
- Recorded: 2026-08-29T13:10:04Z

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
    "contentSecurityPolicy": "default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com https://i.ytimg.com; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "noindex, nofollow",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v75",
  "precachePaths": 130,
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
  "appStatus": "degraded",
  "databaseConfigured": true,
  "databaseOk": false,
  "dataMode": "audited-fallback",
  "databaseAvailable": false,
  "dataStatus": 200,
  "dataRosterCount": 95,
  "transactionCount": 4,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 95,
  "statsRosterMode": "audited-fallback",
  "statsRosterSource": "Tennessee Titans official roster + newer official transactions · audited 2026-08-27",
  "completedPreseasonGamebooks": 2,
  "completedPreseasonGames": 2,
  "completedPreseasonGamesWithPlayerStats": 2,
  "completedPreseasonGamesMissingPlayerStats": 0,
  "marketStatus": 200,
  "marketRows": 973,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "695953ae4eeaad7e920e21a0911b26ffcde782f7",
    "builtAt": "2026-08-29T13:08:45.370Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 28,
    "health": 200,
    "data": 145,
    "stats": 283,
    "market": 1581,
    "analytics": 195
  },
  "testedAt": "2026-08-29T13:09:09.048Z",
  "healthTruth": {
    "ok": true,
    "mode": "audited-fallback",
    "status": 200,
    "healthStatus": "degraded",
    "contentAudit": null,
    "databaseContentAudit": null,
    "fallbackContentAudit": "2026-08-27",
    "databaseAvailable": false,
    "responseMs": 307,
    "testedAt": "2026-08-29T13:09:09.396Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 661,
    "warmHitMs": 661,
    "rows": 973,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 661,
        "rows": 973
      }
    ],
    "testedAt": "2026-08-29T13:09:10.090Z"
  },
  "analyticsStatus": 200,
  "analyticsMode": "database-unavailable",
  "analyticsHealthStatus": "degraded",
  "analyticsDatabaseAvailable": false
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
  "durationMs": 140,
  "testedAt": "2026-08-29T13:09:10.526Z"
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
  "maxLongTaskMs": 136,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 16.18,
  "testedAt": "2026-08-29T13:09:31Z"
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
  "youtube": {
    "configured": true,
    "available": true,
    "videos": 10,
    "liveRightsExcluded": true,
    "lazyBeforePlay": true,
    "iframeAfterPlay": {
      "attempted": true,
      "fallback": false,
      "fallbackText": "",
      "iframe": true,
      "iframeApiScript": true,
      "iframeSrc": "https://www.youtube.com/embed/9b27OBu5j0I?autoplay=0&playsinline=1&rel=0&origin=https%3A%2F%2Ftitans-command-center.alecjordanprice.workers.dev&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Ftitans-command-center.alecjordanprice.workers.dev%2F%23media&aoriginsup=1&vf=1",
      "videoId": "9b27OBu5j0I"
    }
  },
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
  "mobileYoutubeCards": 6,
  "browserWarnings": [
    {
      "level": "WARNING",
      "message": "https://www.youtube.com/s/player/e937390a/www-widgetapi.vflset/www-widgetapi.js 146 Unrecognized feature: 'web-share'.",
      "source": "other",
      "timestamp": 1788008973445
    }
  ],
  "durationSeconds": 2.56,
  "testedAt": "2026-08-29T13:09:33Z"
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
        "shown": 174,
        "total": 973,
        "renderedRows": 174
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
        "result": "Showing 174 of 973 rows",
        "resultTotal": 973,
        "rowCount": 174,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
        ],
        "scrollWidth": 1265,
        "shown": 174,
        "title": "Live Titans market board",
        "total": 973,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "159453",
        "before": "Showing 174 of 973 rows",
        "after": "Showing 100 of 973 rows"
      },
      "book": {
        "available": true,
        "options": 17,
        "selectedValue": "onexbet",
        "before": "Showing 174 of 973 rows",
        "after": "Showing 6 of 973 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 174 of 973 rows",
        "after": "Showing 174 of 973 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 174,
      "afterRows": 973
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 973,
        "total": 973,
        "renderedRows": 973
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
        "result": "Showing 973 of 973 rows",
        "resultTotal": 973,
        "rowCount": 973,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
        ],
        "scrollWidth": 1265,
        "shown": 973,
        "title": "Live Titans market board",
        "total": 973,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 973,
      "total": 973,
      "renderedRows": 973
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
      "result": "Showing 973 of 973 rows",
      "resultTotal": 973,
      "rowCount": 973,
      "rowSample": [
        "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+107Implied48.3%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+112Implied47.2%"
      ],
      "scrollWidth": 375,
      "shown": 973,
      "title": "Live Titans market board",
      "total": 973,
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
  "durationSeconds": 7.08,
  "testedAt": "2026-08-29T13:09:41Z"
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
  "durationSeconds": 2.32,
  "testedAt": "2026-08-29T13:09:43Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "player:find",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 19.67,
  "testedAt": "2026-08-29T13:10:03Z",
  "hash": "#roster",
  "pageText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 freshness unknown\nRoster \u00b7 freshness unknown\nRoster \u00b7 freshness unknown\nRoster \u00b7 freshness unknown\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\nRoster coverage: 95 player records are loaded from the verified backup snapshot audited Aug. 27, 2026. Active-roster and Reserve/Injured entries are shown together; reserve-list players are separate from the active-roster limit. Titans roster \u2197\nCONTENT AUDIT: AUG. 27, 2026 \u00b7 AUDITED BACKUP 91 ACTIVE + 4 RESERVE/INJURED\nLOADED\n95\nplayers\nACTIVE\n91\ncurrent active listing\nRESERVE / INJURED\n4\nseparate status group\nROSTER CHECKED\nAug 27, 2026\nTitans official roster\nAll units\nOffense\nDefense\nSpecial Teams\nSTATUS\nALL\nACTIVE\nRESERVE / INJURED\nCLEAR FILTERS\n95 of 95 players shown\n61\nAndre James\n\nC \u00b7 Offense\n\nActive\n51\nAustin Schlottmann\n\nC \u00b7 Offense\n\nActive\n79\nPat Coogan\n\nC \u00b7 Offense\n\nActive\n73\nCordell Volson\n\nG \u00b7 Offense\n\nActive\n67\nDrew Moss\n\nG \u00b7 Offense\n\nActive\n66\nFernando Carmona Jr.\n\nG \u00b7 Offense\n\nActive\n71\nGarrett Dellinger\n\nG \u00b7 Offense\n\nActive\n64\nJackson Slater\n\nG \u00b7 Offense\n\nActive\n77\nPeter Skoronski\n\nG \u00b7 Offense\n\nActive\n1\nCam Ward\n\nQB \u00b7 Offense\n\nActive\n16\nHendon Hooker\n\nQB \u00b7 Offense\n\nActive\n10\nMitchell Trubisky\n\nQB \u00b7 Offense\n\nActive\n8\nWill Levis\n\nQB \u00b7 Offense\n\nActive\n21\nD'Ernest Johnson\n\nRB \u00b7 Offense\n\nActive\n36\nJulius Chestnut\n\nRB \u00b7 Offense\n\nActive\n31\nKalel Mullings\n\nRB \u00b7 Offense\n\nActive\n35\nMichael Carter\n\nRB \u00b7 Offense\n\nActive\n32\nNicholas Singleton\n\nRB \u00b7 Offense\n\nActive\n20\nTony Pollard\n\nRB \u00b7 Offense\n\nActive\n2\nTyjae Spears\n\nRB \u00b7 Offense\n\nActive\n69\nAamil Wagner\n\nT \u00b7 Offense\n\nActive\n76\nAustin Deculus\n\nT \u00b7 Offense\n\nActive\n78\nBrandon Crenshaw-Dickson\n\nT \u00b7 Offense\n\nActive\n75\nDan Moore Jr.\n\nT \u00b7 Offense\n\nActive\n55\nJC Latham\n\nT \u00b7 Offense\n\nActive\n62\nRasheed Miller\n\nT \u00b7 Offense\n\nActive\n72\nZachary Thomas\n\nT \u00b7 Offense\n\nActive\n82\nDaniel Bellinger\n\nTE \u00b7 Offense\n\nActive\n88\nDavid Martin-Robinson\n\nTE \u00b7 Offense\n\nActive\n84\nGunnar Helm\n\nTE \u00b7 Offense\n\nActive\n81\nJaren Kanak\n\nTE \u00b7 Offense\n\nReserve/Injured\n83\nJoel Wilson\n\nTE \u00b7 Offense\n\nActive\n86\nKylen Granson\n\nTE \u00b7 Offense\n\nActi",
  "cutdownAriaTrace": [],
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
