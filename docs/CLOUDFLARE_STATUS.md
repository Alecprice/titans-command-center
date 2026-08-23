# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `e15c185e98bc046f7ad05946ca3aebf362aefb4d`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: failure
- Listen Watch browser regression: skipped
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
- Recorded: 2026-08-23T01:37:02Z

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
  "precachePaths": 97,
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
  "marketRows": 262,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "e15c185e98bc046f7ad05946ca3aebf362aefb4d",
    "builtAt": "2026-08-23T01:36:04.203Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 28,
    "health": 298,
    "data": 470,
    "stats": 332,
    "market": 262,
    "analytics": 1009
  },
  "testedAt": "2026-08-23T01:36:37.428Z",
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
  "rosterRows": 91,
  "headshotCount": 88,
  "allowedHosts": [
    "static.clubs.nfl.com",
    "static.www.nfl.com",
    "static.nfl.com",
    "a.espncdn.com",
    "a1.espncdn.com"
  ],
  "durationMs": 180,
  "testedAt": "2026-08-23T01:36:38.753Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "desktop:wait-home-ready",
  "error": "TimeoutException: Message: \n",
  "state": {
    "appChildren": 1,
    "appText": "NAVIGATION RECOVERY\nThis page did not finish loading.\n\nThe rest of Titans Command Center is still available. Retry this page or return home.\n\nRetry page\nGo home",
    "depthPressed": null,
    "hash": "#home",
    "href": "https://titans-command-center.alecjordanprice.workers.dev/#home",
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
    "rows": 0,
    "scrollWidth": 1440,
    "sidebarInert": false,
    "sidebarOpen": false,
    "staffPressed": null,
    "statsLoading": null,
    "teamRoomSwitcher": false,
    "teamRoomView": null,
    "title": "Titans Command Center",
    "transactionTools": false,
    "viewport": 1440
  },
  "durationSeconds": 19.1,
  "testedAt": "2026-08-23T01:37:02Z",
  "browserWarnings": [
    {
      "level": "SEVERE",
      "message": "https://titans-command-center.alecjordanprice.workers.dev/src/roster-audit-20260822.mjs - Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of \"text/html\". Strict MIME type checking is enforced for module scripts per HTML spec.",
      "source": "javascript",
      "timestamp": 1787449012457
    }
  ]
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
