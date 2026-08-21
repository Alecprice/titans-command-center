# Cloudflare deployment status

- Status: **deployed + Command Intelligence browser regression failure**
- Source commit: `472e45e2255eb0bfadbd01272e81a0d78a24ed7d`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Command Intelligence browser regression: failure
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-21T23:35:02Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v42",
  "precachePaths": 74,
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
    "commit": "472e45e2255eb0bfadbd01272e81a0d78a24ed7d",
    "builtAt": "2026-08-21T23:33:44.050Z"
  },
  "deploymentPropagationAttempts": 2,
  "responseMs": {
    "root": 177,
    "health": 887,
    "data": 460,
    "stats": 345,
    "market": 3744,
    "analytics": 711
  },
  "testedAt": "2026-08-21T23:34:16.952Z",
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
  "durationMs": 139,
  "testedAt": "2026-08-21T23:34:17.916Z"
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
  "maxLongTaskMs": 261,
  "longTasksOver250ms": 1,
  "browserWarnings": [],
  "durationSeconds": 23.4,
  "testedAt": "2026-08-21T23:34:47Z"
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
  "durationSeconds": 1.78,
  "testedAt": "2026-08-21T23:34:49Z"
}```

## Command Intelligence browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "desktop:command",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 12.9,
  "testedAt": "2026-08-21T23:35:02Z",
  "hash": "#command",
  "pageText": "2026 SEASON \u00b7 PRESEASON \u00b7 FAN-BUILT HQ\nTENNESSEE FOOTBALL.\nEVERY ANGLE.\n\nGame day, roster movement, official team updates, stats, free market data, and the franchise history that made Titans blue mean something. Built as a fan destination \u2014 not a generic dashboard.\n\nENTER GAME DAY \u2192\nEXPLORE THE LEGACY\nNEXT UP \u00b7 VS SEATTLE SEAHAWKS \u00b7 SUN, AUG 23, 7:00 PM\n2026 IDENTITY \u00b7 THE SHIELD\nPRESEASON\n1\u20130\n1 finals indexed\nNEXT OPPONENT\nSEA\nMon, Aug 24\nROSTER INDEXED\n95\nlive roster feed\nDATA SOURCES\n14/22\nlive\nGAME WEEK COMMAND\nNEXT GAME\nFull schedule \u2192\nPRESEASON 2\nLIVE DATA\nTEN\nTennessee\nVS\nSEA\nSeattle Seahawks\nNissan Stadium\nNashville, TN\nSun, Aug 23, 7:00 PM\nFOX \u00b7 2d away\nTITANS NOW\nAll intel \u2192\nPreseason sample size warning\n\nEarly preseason efficiency should be segmented by starter/back-up snaps before drawing conclusions.\n\nTITANS COMMAND CENTER\nCOMMAND CENTER ANALYSIS\nANALYTICS\nGAMES\n3d ago\nTitans continue official preseason roster moves\n\nTennessee has continued making dated preseason roster moves. Use the Transactions page for the current official chronology.\n\nTENNESSEE TITANS\nOFFICIAL\nTRANSACTIONS\nROSTER\n4d ago\nTitans win preseason opener 19-13 over San Francisco\n\nTennessee opened the 2026 preseason with a road win. Cam Ward played roughly the first quarter-plus before the backups took over.\n\nTENNESSEE TITANS\nOFFICIAL\nGAMES\nCAM-WARD\n8d ago\nFirst unofficial 2026 depth chart is out\n\nThe first unofficial depth chart gives an early snapshot of camp roles and position battles.\n\nTENNESSEE TITANS\nOFFICIAL\nDEPTH-CHART\nROSTER\n10d ago\nRobert Saleh talks camp ramp-up and Cam Ward\n\nCoach pres",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
