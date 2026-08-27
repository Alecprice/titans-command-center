# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `e07f0794765ba3a4d80800a720ce231d4d58cbff`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: failure
- Listen Watch browser regression: skipped
- Market Pulse browser regression: skipped
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
- Recorded: 2026-08-27T20:30:49Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v67",
  "precachePaths": 115,
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
  "marketRows": 936,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "e07f0794765ba3a4d80800a720ce231d4d58cbff",
    "builtAt": "2026-08-27T20:29:51.264Z"
  },
  "deploymentPropagationAttempts": 2,
  "responseMs": {
    "root": 42,
    "health": 310,
    "data": 336,
    "stats": 369,
    "market": 3027,
    "analytics": 508
  },
  "testedAt": "2026-08-27T20:30:23.266Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 431,
    "testedAt": "2026-08-27T20:30:23.736Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 627,
    "warmHitMs": 627,
    "rows": 936,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 627,
        "rows": 936
      }
    ],
    "testedAt": "2026-08-27T20:30:24.429Z"
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
  "durationMs": 193,
  "testedAt": "2026-08-27T20:30:25.206Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "mobile:roster-clear-filters",
  "error": "TimeoutException: Message: \n",
  "state": {
    "appChildren": 11,
    "appText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 updated yesterday\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\nRoster coverage: 95 player records are loaded from the current s",
    "depthPressed": "false",
    "hash": "#roster",
    "href": "https://titans-command-center.alecjordanprice.workers.dev/#roster",
    "marketLoading": null,
    "moreExpanded": "false",
    "rosterCardCount": 46,
    "rosterFilterCount": "46 of 95 players shown",
    "rosterGridChildren": 46,
    "rosterGridDisplay": "grid",
    "rosterGridExists": true,
    "rosterGridHidden": false,
    "rosterGridPreview": "24\nAlontae Taylor\n\nCB \u00b7 Defense\n\nActive\n18\nCor'Dale Flott\n\nCB \u00b7 Defense\n\nActive\n13\nCorey Mayfield Jr.\n\nCB \u00b7 Defense\n\nActive\n16\nJalen McMurray\n\nCB \u00b7 Defense\n\nActive\n25\nJoshua Williams\n\nCB \u00b7 Defense\n\nActive\n29\nKeydrain Calligan\n\nCB \u00b7 Defense\n",
    "rosterPressed": "true",
    "rosterSearchValue": null,
    "rosterUnitValue": "Defense",
    "rosterVisibleCardCount": 46,
    "rows": 0,
    "scrollWidth": 375,
    "sidebarInert": true,
    "sidebarOpen": false,
    "staffPressed": "false",
    "statsLoading": null,
    "teamRoomSwitcher": true,
    "teamRoomView": "roster",
    "title": "Roster",
    "transactionTools": false,
    "viewport": 390
  },
  "durationSeconds": 18.14,
  "testedAt": "2026-08-27T20:30:49Z",
  "browserWarnings": [
    {
      "level": "SEVERE",
      "message": "https://titans-command-center.alecjordanprice.workers.dev/schedule-calendar-v39.js 24:48 Uncaught ReferenceError: mount is not defined",
      "source": "javascript",
      "timestamp": 1787862640126
    }
  ]
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
