# Cloudflare deployment status

- Status: **deployed + Listen Watch browser regression failure**
- Source commit: `09de8ee46d4c3c7423ba9836f20b4c73c0248f8f`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: failure
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-21T21:41:23Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v38",
  "precachePaths": 65,
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
    "commit": "09de8ee46d4c3c7423ba9836f20b4c73c0248f8f",
    "builtAt": "2026-08-21T21:39:59.538Z"
  },
  "deploymentPropagationAttempts": 15,
  "responseMs": {
    "root": 32,
    "health": 200,
    "data": 271,
    "stats": 148,
    "market": 674,
    "analytics": 529
  },
  "testedAt": "2026-08-21T21:40:51.367Z",
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
  "durationMs": 167,
  "testedAt": "2026-08-21T21:40:52.192Z"
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
  "maxLongTaskMs": 115,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 15.87,
  "testedAt": "2026-08-21T21:41:11Z"
}```

## Listen Watch browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "desktop:click-media-link",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 11.02,
  "testedAt": "2026-08-21T21:41:22Z",
  "hash": "#media",
  "pageText": "TITANS MEDIA CENTER\nListen / Watch\n\nOne simple place to find the Titans broadcast you can legally use \u2014 local radio, all-game audio, TV and streaming.\n\nNashville / Middle Tennessee\nElsewhere in U.S.\nInternational\nNEXT GAME\nvs Seattle Seahawks\nSun, Aug 23, 7:00 PM\nFOX\nLISTEN\nTitans Radio\n\nNashville flagship: WGFX 104.5 The Zone. Use the official station or Titans game-audio player below; NFL geographic/device restrictions can still apply.\n\n104.5\nTHE ZONE\nNEXT TITANS BROADCAST\nvs Seattle Seahawks\nSun, Aug 23, 7:00 PM\nGAME AUDIO\nListen on Titans Radio\nThe official live-audio button appears when the broadcast is available. Mobile home-market rules apply.\nOpen official game audio \u2197\n104.5 THE ZONE\nOpen the official station player\nCurrent 104.5 web player \u00b7 player ID 3234.\nOpen 104.5 \u2197\n\nThe Comma",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
