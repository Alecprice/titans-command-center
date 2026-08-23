# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `b97d35d15a07cda4510b4f292d4febe48a7ff7ed`
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
- Recorded: 2026-08-23T13:29:17Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v59",
  "precachePaths": 101,
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
    "commit": "b97d35d15a07cda4510b4f292d4febe48a7ff7ed",
    "builtAt": "2026-08-23T13:28:17.322Z"
  },
  "deploymentPropagationAttempts": 9,
  "responseMs": {
    "root": 14,
    "health": 956,
    "data": 459,
    "stats": 230,
    "market": 678,
    "analytics": 753
  },
  "testedAt": "2026-08-23T13:28:55.355Z",
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
  "generatedAt": "2026-08-23T12:03:19.225157+00:00",
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
  "durationMs": 99,
  "testedAt": "2026-08-23T13:28:56.277Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "read-console",
  "error": "RuntimeError: Browser console has severe errors: [{'level': 'SEVERE', 'message': \"https://titans-command-center.alecjordanprice.workers.dev/fantasy-command-v1.js?v=1 7:129 Uncaught TypeError: Cannot read properties of null (reading 'scoring')\", 'source': 'javascript', 'timestamp': 1787491750761}]",
  "state": {
    "appChildren": 3,
    "appText": "PERSONNEL MOVEMENT\nTRANSACTIONS\n\nLatest Titans roster moves, signings, waivers, releases, and reserve-list changes.\n\nMoves \u00b7 updated 5 days ago\nAll move types\ncontract\ndraft\ndraft-trade\ninjury-settlement\nroster-move\nsigning\nsigning-trade\nwaiver\nTRANSACTIONS \u00b7 26\nAug 19, 2026\nroster-move\n\nWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.\n\nAug 17, 2026\nroster-move\n\nWaived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.\n\nAug 16, 2026\nroster-move\n\nPlaced DE Ja",
    "depthPressed": null,
    "hash": "#transactions",
    "href": "https://titans-command-center.alecjordanprice.workers.dev/#transactions",
    "marketLoading": null,
    "moreExpanded": "false",
    "rosterCardCount": 0,
    "rosterFilterCount": null,
    "rosterGridChildren": null,
    "rosterGridDisplay": null,
    "rosterGridExists": false,
    "rosterGridHidden": null,
    "rosterGridPreview": "",
    "rosterPressed": null,
    "rosterSearchValue": null,
    "rosterUnitValue": null,
    "rosterVisibleCardCount": 0,
    "rows": 26,
    "scrollWidth": 305,
    "sidebarInert": true,
    "sidebarOpen": false,
    "staffPressed": null,
    "statsLoading": null,
    "teamRoomSwitcher": false,
    "teamRoomView": "roster",
    "title": "Transactions",
    "transactionTools": true,
    "viewport": 320
  },
  "durationSeconds": 17.21,
  "testedAt": "2026-08-23T13:29:16Z",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
