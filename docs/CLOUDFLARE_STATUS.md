# Cloudflare deployment status

- Status: **deployed + browser navigation regression failure**
- Source commit: `12fc12308ce8a14a9e50a551d9730085db322fe0`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: failure
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-20T21:12:41Z

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
    "contentSecurityPolicy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "noindex, nofollow",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v28",
  "precachePaths": 41,
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
  "marketRows": 6,
  "marketMode": "published-reference",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "0.8.0",
    "commit": "12fc12308ce8a14a9e50a551d9730085db322fe0",
    "builtAt": "2026-08-20T21:11:50.471Z"
  },
  "deploymentPropagationAttempts": 2,
  "responseMs": {
    "root": 125,
    "health": 78,
    "data": 257,
    "stats": 126,
    "market": 163
  },
  "testedAt": "2026-08-20T21:12:13.782Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "mobile:roster-pressed",
  "error": "TimeoutException: Message: \n",
  "state": {
    "appChildren": 10,
    "appText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nROSTER\nDEPTH CHART\nSTAFF\nRoster coverage: 95 player records are loaded from the official Titans roster snapshot audited Aug.",
    "depthPressed": "false",
    "hash": "#roster",
    "href": "https://titans-command-center.alecjordanprice.workers.dev/#roster",
    "marketLoading": null,
    "moreExpanded": "false",
    "rosterCardCount": 95,
    "rosterGridChildren": 95,
    "rosterGridDisplay": "grid",
    "rosterGridExists": true,
    "rosterGridHidden": false,
    "rosterGridPreview": "61\nAndre James\n\nC \u00b7 Offense\n\nActive\n51\nAustin Schlottmann\n\nC \u00b7 Offense\n\nActive\n79\nPat Coogan\n\nC \u00b7 Offense\n\nActive\n73\nCordell Volson\n\nG \u00b7 Offense\n\nActive\n67\nDrew Moss\n\nG \u00b7 Offense\n\nActive\n66\nFernando Carmona Jr.\n\nG \u00b7 Offense\n\nActive\n71\nGarre",
    "rosterPressed": null,
    "rosterSearchValue": null,
    "rosterUnitValue": "all",
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
  "durationSeconds": 23.59,
  "testedAt": "2026-08-20T21:12:41Z",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
