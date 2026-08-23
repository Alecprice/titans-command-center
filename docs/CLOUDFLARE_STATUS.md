# Cloudflare deployment status

- Status: **deployed + Market Pulse browser regression failure**
- Source commit: `37b331cd8e42202780112506184a4a215710b336`
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
- Recorded: 2026-08-23T11:49:12Z

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
    "contentSecurityPolicy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com; connect-src 'self'; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "noindex, nofollow",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v59",
  "precachePaths": 99,
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
  "marketRows": 266,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "37b331cd8e42202780112506184a4a215710b336",
    "builtAt": "2026-08-23T11:48:20.855Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 29,
    "health": 369,
    "data": 502,
    "stats": 409,
    "market": 2035,
    "analytics": 556
  },
  "testedAt": "2026-08-23T11:48:45.231Z",
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
  "generatedAt": "2026-08-23T11:33:06.446157+00:00",
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
  "durationMs": 116,
  "testedAt": "2026-08-23T11:48:46.001Z"
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
  "maxLongTaskMs": 72,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 17.36,
  "testedAt": "2026-08-23T11:49:09Z"
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
  "durationSeconds": 1.99,
  "testedAt": "2026-08-23T11:49:11Z"
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
        "shown": 88,
        "total": 266,
        "renderedRows": 88
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
            "width": 170
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
        "result": "Showing 88 of 266 rows",
        "resultTotal": 266,
        "rowCount": 88,
        "rowSample": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-2.5Price+233Implied30.0%"
        ],
        "scrollWidth": 1265,
        "shown": 88,
        "title": "Live Titans market board",
        "total": 266,
        "viewport": 1265
      }
    }
  },
  "mobile": {},
  "browserWarnings": [],
  "stage": "desktop:filters",
  "error": "NoSuchElementException: Message: no such element: Unable to locate element: {\"method\":\"css selector\",\"selector\":\"#mh-book-filter\"}\n  (Session info: chrome=151.0.7922.137); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#nosuchelementexception\nStacktrace:\n#0 0x55f5e101836a <unknown>\n#1 0x55f5e098bf49 <unknown>\n#2 0x55f5e09e17e2 <unknown>\n#3 0x55f5e09e1a31 <unknown>\n#4 0x55f5e0a2ced4 <unknown>\n#5 0x55f5e0a2a0c3 <unknown>\n#6 0x55f5e09d4c92 <unknown>\n#7 0x55f5e09d5b11 <unknown>\n#8 0x55f5e0fdd8d0 <unknown>\n#9 0x55f5e0fdbf3a <unknown>\n#10 0x55f5e0fc69b5 <unknown>\n#11 0x55f5e0fdcc0a <unknown>\n#12 0x55f5e0fae740 <unknown>\n#13 0x55f5e10039a8 <unknown>\n#14 0x55f5e1003b45 <unknown>\n#15 0x55f5e1016f1e <unknown>\n#16 0x7fa4f489cb84 <unknown>\n#17 0x7fa4f4929d6c <unknown>\n",
  "state": {
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
        "width": 170
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
    "result": "Showing 88 of 266 rows",
    "resultTotal": 266,
    "rowCount": 88,
    "rowSample": [
      "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
      "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
      "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-2.5Price+233Implied30.0%"
    ],
    "scrollWidth": 1265,
    "shown": 88,
    "title": "Live Titans market board",
    "total": 266,
    "viewport": 1265
  },
  "durationSeconds": 1.19,
  "testedAt": "2026-08-23T11:49:12Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
