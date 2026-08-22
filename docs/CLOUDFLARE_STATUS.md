# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `356fd3e1f80ba9fedd1aa30bc50eeb28ffbdc7a9`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: failure
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-22T00:51:52Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v44",
  "precachePaths": 79,
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
    "commit": "356fd3e1f80ba9fedd1aa30bc50eeb28ffbdc7a9",
    "builtAt": "2026-08-22T00:50:39.328Z"
  },
  "deploymentPropagationAttempts": 6,
  "responseMs": {
    "root": 141,
    "health": 955,
    "data": 616,
    "stats": 254,
    "market": 6132,
    "analytics": 1091
  },
  "testedAt": "2026-08-22T00:51:20.593Z",
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
  "durationMs": 128,
  "testedAt": "2026-08-22T00:51:21.954Z"
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
  "maxLongTaskMs": 197,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 15.51,
  "testedAt": "2026-08-22T00:51:42Z"
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
  "durationSeconds": 2.46,
  "testedAt": "2026-08-22T00:51:45Z"
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
  "durationSeconds": 2.89,
  "testedAt": "2026-08-22T00:51:48Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "gameday:desktop",
  "error": "RuntimeError: Game Day source/tune contract failed: {'fakeLive': False, 'phase': 'postgame', 'text': 'POSTGAME\\nGame Day 3.0 \u00b7 source-aware\\nPOSTGAME COMMAND\\nFinal result \u00b7 TEN \u2014 \u2014 OPP \u2014\\n\\nTitans game \u00b7 TBD\\n\\nFull schedule \u2192\\nTURNING POINTS\\nBiggest loaded swings\\n\\nNo trustworthy turning-point rows are loaded yet.\\n\\nWHAT CHANGED?\\nBecause of this game\\n\\nRoster, injury and depth consequences populate through Command Intel as verified updates arrive.\\n\\nOpen Change Engine \u2192\\nTOP PERFORMERS\\nFinal loaded leaders\\n0 players\\nPostgame player stats are awaiting ingest.\\nThe page will populate automatically when the warehouse has them.', 'tune': False}",
  "durationSeconds": 3.13,
  "testedAt": "2026-08-22T00:51:51Z",
  "hash": "#live",
  "pageText": "GAME DAY\nGAME DAY CENTER\n\nA focused live view for the current or next Titans game \u2014 scoreboard first, context second.\n\nSchedule \u00b7 updated this minute\nGAME DAY PULSE\nTEN vs SEA\n1d 23h 8m\nKICKOFF\nSun, Aug 23, 7:00 PM\nBROADCAST\nFOX\nVENUE\nNissan Stadium\nWEATHER\nWeather awaiting update\nFull schedule\nRoster\nAdd to calendar\nGAME DAY PULSE\nTEN vs SEA\n1d 23h 8m\nKICKOFF\nSun, Aug 23, 7:00 PM\nBROADCAST\nFOX\nVENUE\nNissan Stadium\nWEATHER\nWeather awaiting update\nFull schedule\nRoster\nAdd to calendar\nGAME DAY PULSE\nTEN vs SEA\n1d 23h 8m\nKICKOFF\nSun, Aug 23, 7:00 PM\nBROADCAST\nFOX\nVENUE\nNissan Stadium\nWEATHER\nWeather awaiting update\nFull schedule\nRoster\nAdd to calendar\nGAME DAY PULSE\nTEN vs SEA\n1d 23h 8m\nKICKOFF\nSun, Aug 23, 7:00 PM\nBROADCAST\nFOX\nVENUE\nNissan Stadium\nWEATHER\nWeather awaiting update\nFull schedule\nRoster\nAdd to calendar\n2026 INJURY-REPORT STATUS\nOfficial weekly injury report not yet published\n\nThe Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.\n\nOFFICIAL REPORT \u2197\nGAME WEEK BRIEF\nTEN vs SEA\n\nSun, Aug 23, 7:00 PM \u00b7 Nissan Stadium \u00b7 FOX\n\nFULL SCHEDULE \u2192\nROSTER\n95 players loaded\nWEATHER\nForecast not loaded yet\nMARKETS\nNo market lines loaded yet\nINJURIES\nNo injury report loaded yet\nROSTER MOVES\nAug 19, 2026 latest official move\nSITE DATA\nLive updates available\nQUICK READ\nvs Seattle Seahawks \u00b7 Mon, Aug 24, 12:00 AM UTC\nKickoff in 47 hours. Open Listen / Watch for your local kickoff time and legal broadcast options.\nListen / Watch\nOpponent + fan hub\nPOSTGAME\nGame Day 3.0 \u00b7 source-aware\nPOSTGAME COMMAND\nFinal result \u00b7 TEN \u2014 \u2014 OPP \u2014\n\nTitans game \u00b7 TBD\n\nFull schedule \u2192\nTURNING POINTS\nBiggest loaded swings\n\nNo trustworthy turning-point rows are loaded yet",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
