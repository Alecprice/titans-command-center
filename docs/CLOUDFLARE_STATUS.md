# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `3bd8d9b3b86fdd8d500265a3d9f1f496bbfe4ace`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- YouTube Data API configured: true
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
- Recorded: 2026-08-29T13:04:04Z

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
  "marketRows": 975,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "3bd8d9b3b86fdd8d500265a3d9f1f496bbfe4ace",
    "builtAt": "2026-08-29T13:03:14.118Z"
  },
  "deploymentPropagationAttempts": 2,
  "responseMs": {
    "root": 28,
    "health": 248,
    "data": 59,
    "stats": 183,
    "market": 2246,
    "analytics": 279
  },
  "testedAt": "2026-08-29T13:03:44.939Z",
  "healthTruth": {
    "ok": true,
    "mode": "audited-fallback",
    "status": 200,
    "healthStatus": "degraded",
    "contentAudit": null,
    "databaseContentAudit": null,
    "fallbackContentAudit": "2026-08-27",
    "databaseAvailable": false,
    "responseMs": 443,
    "testedAt": "2026-08-29T13:03:45.415Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 266,
    "warmHitMs": 266,
    "rows": 975,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 266,
        "rows": 975
      }
    ],
    "testedAt": "2026-08-29T13:03:45.714Z"
  },
  "analyticsStatus": 500,
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
  "durationMs": 183,
  "testedAt": "2026-08-29T13:03:46.264Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "read-console",
  "error": "RuntimeError: Browser console has severe errors: [{'level': 'SEVERE', 'message': 'https://titans-command-center.alecjordanprice.workers.dev/api/advanced-analytics?season=2026&team=TEN - Failed to load resource: the server responded with a status of 500 ()', 'source': 'network', 'timestamp': 1788008638126}, {'level': 'SEVERE', 'message': 'https://titans-command-center.alecjordanprice.workers.dev/api/advanced-analytics?season=2026&team=TEN - Failed to load resource: the server responded with a status of 500 ()', 'source': 'network', 'timestamp': 1788008639623}, {'level': 'SEVERE', 'message': 'https://titans-command-center.alecjordanprice.workers.dev/api/advanced-analytics?season=2026&team=TEN - Failed to load resource: the server responded with a status of 500 ()', 'source': 'network', 'timestamp': 1788008641099}]",
  "state": {
    "appChildren": 3,
    "appText": "PERSONNEL MOVEMENT\nTRANSACTIONS\n\nLatest Titans roster moves, signings, waivers, releases, and reserve-list changes.\n\nMoves \u00b7 updated 4 days ago\nAll move types\ntransaction\nTRANSACTIONS \u00b7 4\nAug 25, 2026\ntransaction\n\nTennessee announced the Aug. 25 move and also waived S Sanoussi Kane from injured reserve. The current official roster now shows Johnson active and four Reserve/Injured players.\n\nAug 24, 2026\ntransaction\n\nThe Titans announced the move Aug. 24. This newer official transaction controls o",
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
    "rows": 4,
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
  "durationSeconds": 13.93,
  "testedAt": "2026-08-29T13:04:03Z",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
