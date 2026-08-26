# Cloudflare deployment status

- Status: **deployed + Market Pulse browser regression failure**
- Source commit: `47e202cf43438ea6b91eeb54aaf53a16d1853855`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Market Pulse browser regression: failure
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-26T15:25:34Z

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
  "marketRows": 850,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "47e202cf43438ea6b91eeb54aaf53a16d1853855",
    "builtAt": "2026-08-26T15:24:30.152Z"
  },
  "deploymentPropagationAttempts": 3,
  "responseMs": {
    "root": 25,
    "health": 902,
    "data": 420,
    "stats": 241,
    "market": 931,
    "analytics": 672
  },
  "testedAt": "2026-08-26T15:24:57.430Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 441,
    "testedAt": "2026-08-26T15:24:57.910Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "MISS",
    "finalStatus": "HIT",
    "attempts": 2,
    "coldOrInitialMs": 1263,
    "warmHitMs": 34,
    "rows": 850,
    "sequence": [
      {
        "status": "MISS",
        "durationMs": 1263,
        "rows": 850
      },
      {
        "status": "HIT",
        "durationMs": 34,
        "rows": 850
      }
    ],
    "testedAt": "2026-08-26T15:24:59.622Z"
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
  "durationMs": 122,
  "testedAt": "2026-08-26T15:25:00.486Z"
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
  "maxLongTaskMs": 128,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 23.23,
  "testedAt": "2026-08-26T15:25:29Z"
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
  "durationSeconds": 2.24,
  "testedAt": "2026-08-26T15:25:31Z"
}```

## Market Pulse browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "initial": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 150,
        "total": 850,
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
        "result": "Showing 150 of 850 rows",
        "resultTotal": 850,
        "rowCount": 150,
        "rowSample": [
          "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine3Price-115Implied53.5%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 FanDuel \u2197SideChicago BearsLine2.5Price+100Implied50.0%",
          "Chicago Bears at Tennessee Titans Spread \u00b7 MyBookie.ag \u2197SideChicago BearsLine2.5Price-110Implied52.4%"
        ],
        "scrollWidth": 1265,
        "shown": 150,
        "title": "Live Titans market board",
        "total": 850,
        "viewport": 1265
      }
    }
  },
  "mobile": {},
  "browserWarnings": [],
  "stage": "desktop:filters",
  "error": "StaleElementReferenceException: Message: stale element reference: stale element not found in the current frame\n  (Session info: chrome=151.0.7922.137); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#staleelementreferenceexception\nStacktrace:\n#0 0x556eaf90736a <unknown>\n#1 0x556eaf27af49 <unknown>\n#2 0x556eaf281fc0 <unknown>\n#3 0x556eaf284cc2 <unknown>\n#4 0x556eaf31a1c1 <unknown>\n#5 0x556eaf3190c3 <unknown>\n#6 0x556eaf2c3c92 <unknown>\n#7 0x556eaf2c4b11 <unknown>\n#8 0x556eaf8cc8d0 <unknown>\n#9 0x556eaf8caf3a <unknown>\n#10 0x556eaf8b59b5 <unknown>\n#11 0x556eaf8cbc0a <unknown>\n#12 0x556eaf89d740 <unknown>\n#13 0x556eaf8f29a8 <unknown>\n#14 0x556eaf8f2b45 <unknown>\n#15 0x556eaf905f1e <unknown>\n#16 0x7fda8929cb84 <unknown>\n#17 0x7fda89329d6c <unknown>\n",
  "state": {
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
    "result": "Showing 150 of 850 rows",
    "resultTotal": 850,
    "rowCount": 150,
    "rowSample": [
      "Chicago Bears at Tennessee Titans Spread \u00b7 DraftKings \u2197SideCHI BearsLine3Price-115Implied53.5%",
      "Chicago Bears at Tennessee Titans Spread \u00b7 FanDuel \u2197SideChicago BearsLine2.5Price+100Implied50.0%",
      "Chicago Bears at Tennessee Titans Spread \u00b7 MyBookie.ag \u2197SideChicago BearsLine2.5Price-110Implied52.4%"
    ],
    "scrollWidth": 1265,
    "shown": 150,
    "title": "Live Titans market board",
    "total": 850,
    "viewport": 1265
  },
  "durationSeconds": 1.66,
  "testedAt": "2026-08-26T15:25:33Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
