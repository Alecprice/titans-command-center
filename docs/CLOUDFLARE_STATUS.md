# Cloudflare deployment status

- Status: **deployed + advanced analytics browser regression failure**
- Source commit: `35479d27eeb708496ff7b1c079390652331203a6`
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
- Player Intelligence / Game Day browser regression: success
- Ask Titans browser regression: success
- Change Intelligence browser regression: success
- Runtime / 365 Mode browser regression: success
- Data freshness browser regression: success
- Account / Guest browser regression: success
- Advanced analytics browser regression: failure
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-29T15:09:45Z

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
  "marketRows": 1005,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "35479d27eeb708496ff7b1c079390652331203a6",
    "builtAt": "2026-08-29T15:08:13.158Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 39,
    "health": 273,
    "data": 130,
    "stats": 234,
    "market": 5869,
    "analytics": 223
  },
  "testedAt": "2026-08-29T15:08:44.275Z",
  "healthTruth": {
    "ok": true,
    "mode": "audited-fallback",
    "status": 200,
    "healthStatus": "degraded",
    "contentAudit": null,
    "databaseContentAudit": null,
    "fallbackContentAudit": "2026-08-27",
    "databaseAvailable": false,
    "responseMs": 361,
    "testedAt": "2026-08-29T15:08:44.673Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 320,
    "warmHitMs": 320,
    "rows": 1005,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 320,
        "rows": 1005
      }
    ],
    "testedAt": "2026-08-29T15:08:45.026Z"
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
  "durationMs": 161,
  "testedAt": "2026-08-29T15:08:45.515Z"
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
  "maxLongTaskMs": 199,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 15.79,
  "testedAt": "2026-08-29T15:09:06Z"
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
      "timestamp": 1788016154025
    }
  ],
  "durationSeconds": 7.21,
  "testedAt": "2026-08-29T15:09:14Z"
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
        "shown": 172,
        "total": 1005,
        "renderedRows": 172
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
        "result": "Showing 172 of 1005 rows",
        "resultTotal": 1005,
        "rowCount": 172,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+105Implied48.8%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+110Implied47.6%"
        ],
        "scrollWidth": 1265,
        "shown": 172,
        "title": "Live Titans market board",
        "total": 1005,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "159453",
        "before": "Showing 172 of 1005 rows",
        "after": "Showing 100 of 1005 rows"
      },
      "book": {
        "available": true,
        "options": 17,
        "selectedValue": "onexbet",
        "before": "Showing 172 of 1005 rows",
        "after": "Showing 6 of 1005 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 172 of 1005 rows",
        "after": "Showing 172 of 1005 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 172,
      "afterRows": 1005
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 1005,
        "total": 1005,
        "renderedRows": 1005
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
        "result": "Showing 1005 of 1005 rows",
        "resultTotal": 1005,
        "rowCount": 1005,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+105Implied48.8%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+110Implied47.6%"
        ],
        "scrollWidth": 1265,
        "shown": 1005,
        "title": "Live Titans market board",
        "total": 1005,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 1005,
      "total": 1005,
      "renderedRows": 1005
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
      "result": "Showing 1005 of 1005 rows",
      "resultTotal": 1005,
      "rowCount": 1005,
      "rowSample": [
        "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine2.5Price-105Implied51.2%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideChicago BearsLine1Price+105Implied48.8%",
        "Chicago Bears at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideChicago BearsLine1Price+110Implied47.6%"
      ],
      "scrollWidth": 375,
      "shown": 1005,
      "title": "Live Titans market board",
      "total": 1005,
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
  "durationSeconds": 6.85,
  "testedAt": "2026-08-29T15:09:21Z"
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
  "durationSeconds": 2.28,
  "testedAt": "2026-08-29T15:09:24Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "playerRoute": "#player?name=Cam%20Ward",
  "playerRouteHydrated": true,
  "playerRouteMode": "audited-name",
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
      "h": 44,
      "label": "Overview"
    },
    {
      "h": 44,
      "label": "Game Log"
    },
    {
      "h": 44,
      "label": "Trends"
    },
    {
      "h": 44,
      "label": "Career + Contract"
    },
    {
      "h": 44,
      "label": "Timeline"
    }
  ],
  "playerHeadshotLoaded": true,
  "rosterEnhancementState": {
    "cutdownButtons": 1,
    "cutdownPanels": 1,
    "injuryBanners": 1,
    "switchers": 1
  },
  "cutdownCommand": true,
  "cutdownCommandText": "53-MAN CUTDOWN COMMAND\nFinal roster clock\n\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\n\nTIME REMAINING\n1d 6h\nSun, Aug 30, 6:00 PM EDT\nLoaded roster\n95\nAll current rows\nActive rows\n91\nLoaded status = Active\nReserve / other\n4\nNot counted as active rows here\nFinal active limit\n53\n38 loaded active rows above 53\nPOSITION SHAPE\nActive rows by position\nFull roster \u2192\n13\nWR\n9\nCB\n9\nLB\n8\nDE\n7\nRB\n7\nT\n6\nDT\n6\nG\n6\nS\n5\nTE\n4\nQB\n3\nC\n3\nDL\n2\nDB\n1\nK\n1\nLS\n1\nP\nMOVEMENT WIRE\nLatest loaded transactions\nAll moves \u2192\n2026-08-25\n\nTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.\n\n2026-08-24\n\nThe Titans announced the move Aug. 24. This newer official transaction controls over any roster page that has not yet reflected the same-day move.\n\n2026-08-21\n\nOn Aug. 21, Tennessee signed DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, placed DB Nazeeh Johnson on Reserve/Injured, and later waived LB Sean Brown from injured reserve with an injury settlement.\n\n2026-08-19\n\nTennessee's official Aug. 19 transaction log lists RB D'Ernest Johnson signed and RB Dominic Richardson waived.\n\nMY 53 \u00b7 FAN BOARD\nBuild your own Titans 53\n\nYour picks stay on this device. This is a fan roster exercise\u2014not an official roster projection or report.\n\n0 / 53\nClear picks\nNo fan picks yet.\nFIND PLAYER\nPOSITION\nAll positions\nC\nCB\nDB\nDE\nDL\nDT\nG\nK\nLB\nLS\nP\nQB\nRB\nS\nT\nTE\nWR\nSelected only\nShare / Copy My 53\n91 shown \u00b7 0 selected\nSelect players to see unit composition.\n#61\nAndre James\nC \u00b7 Offense\n+\n#51\nAustin Schlottmann\nC \u00b7 Offense\n+\n#79\nPat Coogan\nC \u00b7 Offense\n+\n#73\nCordell Volson\nG \u00b7 Offense\n+\n#67\nDrew Moss\nG \u00b7 Offense\n+\n#66\nFernando Carmona Jr.\nG \u00b7 Offense\n+\n#71\nGarrett Dellinger\nG \u00b7 Offense\n+\n#64\nJackson Slater\nG \u00b7 Offense\n+\n#77\nPeter Skoronski\nG \u00b7 Offense\n+\n#1\nCam Ward\nQB \u00b7 Offense\n+\n#16\nHendon Hooker\nQB \u00b7 Offense\n+\n#10\nMitchell Trubisky\nQB \u00b7 Offense\n+\n#8\nWill Levis\nQB \u00b7 Offense\n+\n#21\nD'Ernest Johnson\nRB \u00b7 Offense\n+\n#36\nJulius Chestnut\nRB \u00b7 Offense\n+\n#31\nKalel Mullings\nRB \u00b7 Offense\n+\n#35\nMichael Carter\nRB \u00b7 Offense\n+\n#32\nNicholas Singleton\nRB \u00b7 Offense\n+\n#20\nTony Pollard\nRB \u00b7 Offense\n+\n#2\nTyjae Spears\nRB \u00b7 Offense\n+\n#69\nAamil Wagner\nT \u00b7 Offense\n+\n#76\nAustin Deculus\nT \u00b7 Offense\n+\n#78\nBrandon Crenshaw-Dickson\nT \u00b7 Offense\n+\n#75\nDan Moore Jr.\nT \u00b7 Offense\n+\n#55\nJC Latham\nT \u00b7 Offense\n+\n#62\nRasheed Miller\nT \u00b7 Offense\n+\n#72\nZachary Thomas\nT \u00b7 Offense\n+\n#82\nDaniel Bellinger\nTE \u00b7 Offense\n+\n#88\nDavid Martin-Robinson\nTE \u00b7 Offe",
  "cutdownMobileTargets": [
    {
      "h": 48,
      "label": "Full roster \u2192"
    },
    {
      "h": 48,
      "label": "All moves \u2192"
    },
    {
      "h": 48,
      "label": "NFL roster deadline \u2197"
    },
    {
      "h": 48,
      "label": "Official Titans transactions \u2197"
    }
  ],
  "my53Interaction": {
    "before": {
      "count": "0 / 53",
      "key": "Andre James",
      "pressed": "false"
    },
    "added": {
      "count": "1 / 53",
      "note": "Pick saved on this device.",
      "pressed": "true",
      "stored": 1
    },
    "removed": {
      "count": "0 / 53",
      "note": "Pick removed. Your fan board stays on this device.",
      "stored": 0
    }
  },
  "my53MobileTargets": [
    {
      "h": 48,
      "label": "Clear picks"
    },
    {
      "h": 48,
      "label": "Selected only"
    },
    {
      "h": 48,
      "label": "Share / Copy My 53"
    },
    {
      "h": 56.6875,
      "label": "#61Andre JamesC \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#51Austin SchlottmannC \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#79Pat CooganC \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#73Cordell VolsonG \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#67Drew MossG \u00b7 Offense+"
    }
  ],
  "gameDayPhase": "pregame",
  "gameDayTuneLink": true,
  "gameDayMobileViewport": 375,
  "gameDayFastPass": true,
  "gameDayFastPassGameId": "pre3",
  "gameDayFastPassText": "GAME DAY IN NASHVILLE\nChicago Bears at Titans\nPRESEASON 3\nWHEN\nSat, Aug 29, 5:00 PM CDT \u00b7 6h 50m\nWATCH / LISTEN\nNFL Network / WKRN-TV News 2 (regional) \u00b7 WGFX 104.5 FM The Zone\nWHERE\nHome \u00b7 Nissan Stadium\nOpen Listen / Watch\nOfficial schedule \u2197\nStadium guide \u2197\nSchedule facts: TennesseeTitans.com",
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
  "durationSeconds": 4.75,
  "testedAt": "2026-08-29T15:09:29Z"
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
      "why": "That is the next non-final, non-bye game in the loaded Titans schedule. NFL Network / WKRN-TV News 2 (regional) is the listed network."
    },
    {
      "question": "Cam Ward",
      "action": "#roster",
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
      "answer": "The next game is Sat, Aug 29, 5:00 PM CDT (Nashville time) and the loaded TV listing is NFL Network / WKRN-TV News 2 (regional). Open Listen / Watch for your device-local time, Eastern time, Nashville time, UTC, radio, and territory-specific viewing guidance.",
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
    "askButton": 44,
    "input": 44,
    "quick": [
      {
        "h": 44,
        "label": "What changed?"
      },
      {
        "h": 44,
        "label": "Who is next?"
      },
      {
        "h": 44,
        "label": "Injuries"
      },
      {
        "h": 44,
        "label": "Watch"
      },
      {
        "h": 44,
        "label": "Cam Ward"
      },
      {
        "h": 44,
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
  "durationSeconds": 1.79,
  "testedAt": "2026-08-29T15:09:31Z"
}```

## Change Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "detectedBeforeReview": 99,
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
        "h": 44,
        "label": "All"
      },
      {
        "h": 44,
        "label": "Roster \u00b7 95"
      },
      {
        "h": 44,
        "label": "Transaction \u00b7 4"
      }
    ],
    "review": 44,
    "viewport": 375,
    "width": 357
  },
  "browserWarnings": [],
  "durationSeconds": 2.71,
  "testedAt": "2026-08-29T15:09:34Z"
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
      "/api/fan-intel",
      "/api/social-pulse",
      "/api/tickets"
    ],
    "panel": {
      "cards": 4,
      "display": "block",
      "height": 427.890625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL Network / WKRN-TV News 2 (regional)WHAT CHANGED?Review team changesTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.ROSTERtransactionTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "refresh": {
      "cache": [
        {
          "expiresAt": 1788016206194,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1788016176194,
          "url": "/api/data"
        },
        {
          "expiresAt": 1788016206240,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1788016176240,
          "url": "/api/fan-intel"
        }
      ],
      "epoch": 1,
      "last": {
        "at": "2026-08-29T15:09:36.097Z",
        "epoch": 1,
        "reason": "scoreboard-control",
        "urls": null
      }
    },
    "refreshedPanel": {
      "cards": 4,
      "display": "block",
      "height": 427.890625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL Network / WKRN-TV News 2 (regional)WHAT CHANGED?Review team changesTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.ROSTERtransactionTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "returnPanel": {
      "cards": 4,
      "display": "block",
      "height": 427.890625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL Network / WKRN-TV News 2 (regional)WHAT CHANGED?Review team changesTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.ROSTERtransactionTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
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
      "panelHeight": 865.609375,
      "panelWidth": 461,
      "reviewHeight": 48,
      "targets": [
        {
          "h": 124.4375,
          "label": "NEXT GAME",
          "w": 427
        },
        {
          "h": 166.1875,
          "label": "WHAT CHANGED?",
          "w": 427
        },
        {
          "h": 166.1875,
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
      "height": 865.609375,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL Network / WKRN-TV News 2 (regional)WHAT CHANGED?Review team changesTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.ROSTERtransactionTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 461
    },
    "sheet": {
      "bottom": 611,
      "dockTop": 621,
      "height": 504.71875,
      "links": 15,
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
  "durationSeconds": 3.65
}```

## Data freshness browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "detail": "Roster 20,695 days ago \u00b7 Moves 4 days ago \u00b7 Intel 4 days ago",
    "overflow": false,
    "rect": {
      "bottom": 1312.375,
      "height": 155.765625,
      "left": 915.328125,
      "right": 1216.984375,
      "top": 1156.609375,
      "width": 301.65625
    },
    "state": "unknown",
    "strong": "Freshness unknown",
    "text": "DATA FRESHNESSFreshness unknownRoster 20,695 days ago \u00b7 Moves 4 days ago \u00b7 Intel 4 days agoSee sources \u2192",
    "title": "The loaded roster does not provide a usable capture timestamp.",
    "viewport": {
      "height": 757,
      "width": 1280
    }
  },
  "mobile": {
    "detail": "Roster 20,695 days ago \u00b7 Moves 4 days ago \u00b7 Intel 4 days ago",
    "overflow": false,
    "rect": {
      "bottom": 2356.453125,
      "height": 117.1875,
      "left": 9,
      "right": 366,
      "top": 2239.265625,
      "width": 357
    },
    "state": "unknown",
    "strong": "Freshness unknown",
    "text": "DATA FRESHNESSFreshness unknownRoster 20,695 days ago \u00b7 Moves 4 days ago \u00b7 Intel 4 days agoSee sources \u2192",
    "title": "The loaded roster does not provide a usable capture timestamp.",
    "viewport": {
      "height": 701,
      "width": 390
    }
  },
  "browserWarnings": [],
  "durationSeconds": 1.57,
  "testedAt": "2026-08-29T15:09:40Z"
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
    "text": "PersonnelRosterSearch the latest verified Titans roster by name, number, position, or unit.Roster \u00b7 freshness unknown202"
  },
  "durationSeconds": 2.02
}```

## Advanced analytics browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "desktop:degraded-analytics",
  "error": "RuntimeError: Degraded analytics retry target is too small: {'coreStats': True, 'loading': None, 'metricCount': 0, 'retryHeight': 36, 'text': 'Advanced analytics could not load.Advanced analytics query failedTry again'}",
  "state": {
    "advanced": true,
    "hash": "#stats",
    "heading": "Stats Lab",
    "loading": null,
    "metricCount": 0,
    "playCount": 0,
    "scrollWidth": 1425,
    "text": "Advanced analytics could not load.\nAdvanced analytics query failed\nTry again",
    "width": 1425
  },
  "durationSeconds": 1.8,
  "testedAt": "2026-08-29T15:09:44Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
