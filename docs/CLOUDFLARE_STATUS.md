# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `a0bec9c38a4f66d850abc04708b5ffc8ee4ddd47`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: failure
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-22T01:23:20Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v47",
  "precachePaths": 83,
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
  "marketRows": 222,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "a0bec9c38a4f66d850abc04708b5ffc8ee4ddd47",
    "builtAt": "2026-08-22T01:22:28.781Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 67,
    "health": 123,
    "data": 116,
    "stats": 158,
    "market": 539,
    "analytics": 350
  },
  "testedAt": "2026-08-22T01:22:54.123Z",
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
  "durationMs": 143,
  "testedAt": "2026-08-22T01:22:54.748Z"
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
  "searchQuickJump": true,
  "mobileDrawerInert": true,
  "teamRoomChecks": 4,
  "rosterFilterReset": true,
  "mobileTargets": [
    {
      "height": 48,
      "label": "\u2302Home",
      "width": 59.15625
    },
    {
      "height": 48,
      "label": "\u25cfGame",
      "width": 59.171875
    },
    {
      "height": 48,
      "label": "\u25ceRoster",
      "width": 59.171875
    },
    {
      "height": 48,
      "label": "\u21c4Moves",
      "width": 59.15625
    },
    {
      "height": 48,
      "label": "\u2197Stats",
      "width": 59.171875
    },
    {
      "height": 48,
      "label": "\u2630More",
      "width": 59.171875
    }
  ],
  "maxLongTaskMs": 54,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 12.98,
  "testedAt": "2026-08-22T01:23:11Z"
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
  "durationSeconds": 2.05,
  "testedAt": "2026-08-22T01:23:13Z"
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
      "h": 48,
      "label": "Changes"
    },
    {
      "h": 48,
      "label": "Press Room"
    },
    {
      "h": 48,
      "label": "Scheme Lab"
    },
    {
      "h": 48,
      "label": "Global Fans"
    },
    {
      "h": 48,
      "label": "Stadium"
    },
    {
      "h": 48,
      "label": "Fan GM"
    },
    {
      "h": 48,
      "label": "Time Machine"
    }
  ],
  "mobileViewport": 375,
  "browserWarnings": [],
  "durationSeconds": 2.86,
  "testedAt": "2026-08-22T01:23:17Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "console",
  "error": "RuntimeError: v1.6 browser console has severe errors: [{'level': 'SEVERE', 'message': 'https://titans-command-center.alecjordanprice.workers.dev/api/espn-scoreboard - Failed to load resource: the server responded with a status of 502 ()', 'source': 'network', 'timestamp': 1787361799936}]",
  "durationSeconds": 2.64,
  "testedAt": "2026-08-22T01:23:20Z",
  "hash": "#live",
  "pageText": "GAME DAY\nGAME DAY CENTER\n\nA focused live view for the current or next Titans game \u2014 scoreboard first, context second.\n\nSchedule \u00b7 updated this minute\nGAME WEEK COMMAND\nTEN vs Seattle Seahawks\nUPCOMING\nWHEN / WHERE\nSunday, Aug 23, 7:00 PM\n\nNissan Stadium \u00b7 FOX\n\nWEATHER\nForecast awaiting update\n\nForecast feed\n\nMARKET\nNo current market rows\n\nInformational only\n\nCURRENT LEADERS\nPlayer production\nFull Stats Lab \u2192\n0\nCam Ward\n57\n1\nJulius Chestnut\n47\n2\nWan'Dale Robinson\n19\n3\nCor'Dale Flott\n5\n4\nJalyn Holmes\n1\n5\nJoey Slye\n13\nAdd to calendar\nRoster\nIntel\nAnalytics\nGAME WEEK COMMAND\nTEN vs Seattle Seahawks\nUPCOMING\nWHEN / WHERE\nSunday, Aug 23, 7:00 PM\n\nNissan Stadium \u00b7 FOX\n\nWEATHER\nForecast awaiting update\n\nForecast feed\n\nMARKET\nNo current market rows\n\nInformational only\n\nCURRENT LEADERS\nPlayer production\nFull Stats Lab \u2192\n0\nCam Ward\n57\n1\nJulius Chestnut\n47\n2\nWan'Dale Robinson\n19\n3\nCor'Dale Flott\n5\n4\nJalyn Holmes\n1\n5\nJoey Slye\n13\nAdd to calendar\nRoster\nIntel\nAnalytics\nGAME WEEK COMMAND\nTEN vs Seattle Seahawks\nUPCOMING\nWHEN / WHERE\nSunday, Aug 23, 7:00 PM\n\nNissan Stadium \u00b7 FOX\n\nWEATHER\nForecast awaiting update\n\nForecast feed\n\nMARKET\nNo current market rows\n\nInformational only\n\nCURRENT LEADERS\nPlayer production\nFull Stats Lab \u2192\n0\nCam Ward\n57\n1\nJulius Chestnut\n47\n2\nWan'Dale Robinson\n19\n3\nCor'Dale Flott\n5\n4\nJalyn Holmes\n1\n5\nJoey Slye\n13\nAdd to calendar\nRoster\nIntel\nAnalytics\nGAME WEEK COMMAND\nTEN vs Seattle Seahawks\nUPCOMING\nWHEN / WHERE\nSunday, Aug 23, 7:00 PM\n\nNissan Stadium \u00b7 FOX\n\nWEATHER\nForecast awaiting update\n\nForecast feed\n\nMARKET\nNo current market rows\n\nInformational only\n\nCURRENT LEADERS\nPlayer production\nFull Stats Lab \u2192\n0\nCam Ward\n57\n1\nJulius Chestnut\n47\n2\nWan'Dale Robinson\n19\n3\nCor'Dale Flott\n5\n4\nJalyn Holmes\n1\n5\nJoey Slye\n13\nAdd to calendar\nRoster\nIntel\nAnalytics\nGAME DAY P",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
