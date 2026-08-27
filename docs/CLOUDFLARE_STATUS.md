# Cloudflare deployment status

- Status: **deployed + browser navigation regression cancelled**
- Source commit: `62ceb487686cdb3770b3c548217e424b29adf67b`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: cancelled
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
- Recorded: 2026-08-27T19:27:40Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v61",
  "precachePaths": 109,
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
  "marketRows": 862,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "62ceb487686cdb3770b3c548217e424b29adf67b",
    "builtAt": "2026-08-27T19:23:39.647Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 25,
    "health": 244,
    "data": 469,
    "stats": 491,
    "market": 982,
    "analytics": 705
  },
  "testedAt": "2026-08-27T19:24:00.693Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 183,
    "testedAt": "2026-08-27T19:24:00.911Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 382,
    "warmHitMs": 382,
    "rows": 862,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 382,
        "rows": 862
      }
    ],
    "testedAt": "2026-08-27T19:24:01.357Z"
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
  "generatedAt": "2026-08-26T12:04:27.347044+00:00",
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
  "durationMs": 110,
  "testedAt": "2026-08-27T19:24:02.244Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "desktop:round-1:navigate:#roster",
  "error": "TimeoutException: Message: timeout: Timed out receiving message from renderer: 20.000\n  (Session info: chrome=151.0.7922.173)\nStacktrace:\n#0 0x55ac3e15236a <unknown>\n#1 0x55ac3dac5f49 <unknown>\n#2 0x55ac3daad99b <unknown>\n#3 0x55ac3daad616 <unknown>\n#4 0x55ac3daab1fe <unknown>\n#5 0x55ac3daabb7f <unknown>\n#6 0x55ac3dabacf0 <unknown>\n#7 0x55ac3dad4cb7 <unknown>\n#8 0x55ac3dadc68b <unknown>\n#9 0x55ac3daac2d9 <unknown>\n#10 0x55ac3dad4a12 <unknown>\n#11 0x55ac3db64416 <unknown>\n#12 0x55ac3db0ec92 <unknown>\n#13 0x55ac3db0fb11 <unknown>\n#14 0x55ac3e1178d0 <unknown>\n#15 0x55ac3e115f3a <unknown>\n#16 0x55ac3e1009b5 <unknown>\n#17 0x55ac3e116c0a <unknown>\n#18 0x55ac3e0e8740 <unknown>\n#19 0x55ac3e13d9a8 <unknown>\n#20 0x55ac3e13db45 <unknown>\n#21 0x55ac3e150f1e <unknown>\n#22 0x7f45b4e9cb84 <unknown>\n#23 0x7f45b4f29d6c <unknown>\n",
  "state": {
    "stateReadError": "TimeoutException: Message: timeout: Timed out receiving message from renderer: 20.000\n  (Session info: chrome=151.0.7922.173)\nStacktrace:\n#0 0x55ac3e15236a <unknown>\n#1 0x55ac3dac5f49 <unknown>\n#2 0x55ac3daad99b <unknown>\n#3 0x55ac3daad616 <unknown>\n#4 0x55ac3daab1fe <unknown>\n#5 0x55ac3daabb7f <unknown>\n#6 0x55ac3dabacf0 <unknown>\n#7 0x55ac3dad4cb7 <unknown>\n#8 0x55ac3dadc68b <unknown>\n#9 0x55ac3daac2d9 <unknown>\n#10 0x55ac3dad4a12 <unknown>\n#11 0x55ac3db63f86 <unknown>\n#12 0x55ac3db0ec92 <unknown>\n#13 0x55ac3db0fb11 <unknown>\n#14 0x55ac3e1178d0 <unknown>\n#15 0x55ac3e115f3a <unknown>\n#16 0x55ac3e1009b5 <unknown>\n#17 0x55ac3e116c0a <unknown>\n#18 0x55ac3e0e8740 <unknown>\n#19 0x55ac3e13d9a8 <unknown>\n#20 0x55ac3e13db45 <unknown>\n#21 0x55ac3e150f1e <unknown>\n#22 0x7f45b4e9cb84 <unknown>\n#23 0x7f45b4f29d6c <unknown>\n"
  },
  "durationSeconds": 44.2,
  "testedAt": "2026-08-27T19:24:49Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
