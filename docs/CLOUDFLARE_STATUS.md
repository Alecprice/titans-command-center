# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `fec7bb8f358a1da2ad59192f0cc214caa8e4b80e`
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
- Recorded: 2026-08-25T01:54:23Z

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
  "dataRosterCount": 96,
  "transactionCount": 28,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 96,
  "statsRosterMode": "live-database",
  "statsRosterSource": "Tennessee Titans official roster / transaction snapshot · latest audited database state",
  "completedPreseasonGames": 1,
  "marketStatus": 200,
  "marketRows": 520,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "fec7bb8f358a1da2ad59192f0cc214caa8e4b80e",
    "builtAt": "2026-08-25T01:53:12.801Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 32,
    "health": 1397,
    "data": 657,
    "stats": 335,
    "market": 303,
    "analytics": 1376
  },
  "testedAt": "2026-08-25T01:53:36.981Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-24",
    "databaseContentAudit": "2026-08-24",
    "responseMs": 490,
    "testedAt": "2026-08-25T01:53:37.501Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 297,
    "warmHitMs": 297,
    "rows": 520,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 297,
        "rows": 520
      }
    ],
    "testedAt": "2026-08-25T01:53:37.848Z"
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
  "durationMs": 129,
  "testedAt": "2026-08-25T01:53:39.445Z"
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
    "appText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nRoster \u00b7 updated 7 hours ago\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nCUTDOWN\nRoster coverage: 96 current player records are loaded from the",
    "depthPressed": "false",
    "hash": "#roster",
    "href": "https://titans-command-center.alecjordanprice.workers.dev/#roster",
    "marketLoading": null,
    "moreExpanded": "false",
    "rosterCardCount": 96,
    "rosterFilterCount": "96 of 96 players shown",
    "rosterGridChildren": 96,
    "rosterGridDisplay": "grid",
    "rosterGridExists": true,
    "rosterGridHidden": false,
    "rosterGridPreview": "61\nAndre James\n\nC \u00b7 Offense\n\nActive\n51\nAustin Schlottmann\n\nC \u00b7 Offense\n\nActive\n79\nPat Coogan\n\nC \u00b7 Offense\n\nActive\n73\nCordell Volson\n\nG \u00b7 Offense\n\nActive\n67\nDrew Moss\n\nG \u00b7 Offense\n\nActive\n66\nFernando Carmona Jr.\n\nG \u00b7 Offense\n\nActive\n71\nGarre",
    "rosterPressed": "true",
    "rosterSearchValue": null,
    "rosterUnitValue": "all",
    "rosterVisibleCardCount": 96,
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
  "durationSeconds": 35.99,
  "testedAt": "2026-08-25T01:54:22Z",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
