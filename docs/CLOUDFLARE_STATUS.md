# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `04c759937e2aa4019471c033430388529ecce27c`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
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
- Recorded: 2026-08-28T23:14:12Z

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
  "marketRows": 950,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "04c759937e2aa4019471c033430388529ecce27c",
    "builtAt": "2026-08-28T23:13:13.532Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 40,
    "health": 279,
    "data": 409,
    "stats": 197,
    "market": 7041,
    "analytics": 361
  },
  "testedAt": "2026-08-28T23:13:42.689Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 220,
    "testedAt": "2026-08-28T23:13:42.945Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "MISS",
    "finalStatus": "HIT",
    "attempts": 2,
    "coldOrInitialMs": 7345,
    "warmHitMs": 51,
    "rows": 950,
    "sequence": [
      {
        "status": "MISS",
        "durationMs": 7345,
        "rows": 950
      },
      {
        "status": "HIT",
        "durationMs": 51,
        "rows": 950
      }
    ],
    "testedAt": "2026-08-28T23:13:50.754Z"
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
  "durationMs": 143,
  "testedAt": "2026-08-28T23:13:51.352Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "mobile:depth-route-state",
  "error": "TimeoutException: Message: \n",
  "state": {
    "appChildren": 11,
    "appText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 updated 2 days ago\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\nOFFICIAL TEAM SNAPSHOT\nUNOFFICIAL depth chart \u00b7 Aug 17, 2026\n\nT",
    "depthPressed": "true",
    "hash": "#roster?view=depth",
    "href": "https://titans-command-center.alecjordanprice.workers.dev/#roster?view=depth",
    "marketLoading": null,
    "moreExpanded": "false",
    "rosterCardCount": 95,
    "rosterFilterCount": "95 of 95 players shown",
    "rosterGridChildren": 95,
    "rosterGridDisplay": "none",
    "rosterGridExists": true,
    "rosterGridHidden": true,
    "rosterGridPreview": "61Andre JamesC \u00b7 OffenseActive51Austin SchlottmannC \u00b7 OffenseActive79Pat CooganC \u00b7 OffenseActive73Cordell VolsonG \u00b7 OffenseActive67Drew MossG \u00b7 OffenseActive66Fernando Carmona Jr.G \u00b7 OffenseActive71Garrett DellingerG \u00b7 OffenseActive64Jackso",
    "rosterPressed": "false",
    "rosterSearchValue": null,
    "rosterUnitValue": "all",
    "rosterVisibleCardCount": 95,
    "rows": 0,
    "scrollWidth": 375,
    "sidebarInert": true,
    "sidebarOpen": false,
    "staffPressed": "false",
    "statsLoading": null,
    "teamRoomSwitcher": true,
    "teamRoomView": null,
    "title": "Roster",
    "transactionTools": false,
    "viewport": 390
  },
  "durationSeconds": 16.37,
  "testedAt": "2026-08-28T23:14:11Z",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
