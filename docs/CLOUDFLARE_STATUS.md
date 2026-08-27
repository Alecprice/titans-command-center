# Cloudflare deployment status

- Status: **deployed + browser navigation regression cancelled**
- Source commit: `d931598ceaf6804792933de53d0003603fec88b8`
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
- Recorded: 2026-08-27T19:44:08Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v63",
  "precachePaths": 111,
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
  "marketRows": 936,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "d931598ceaf6804792933de53d0003603fec88b8",
    "builtAt": "2026-08-27T19:32:25.080Z"
  },
  "deploymentPropagationAttempts": 2,
  "responseMs": {
    "root": 49,
    "health": 132,
    "data": 216,
    "stats": 216,
    "market": 3040,
    "analytics": 431
  },
  "testedAt": "2026-08-27T19:32:57.865Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 272,
    "testedAt": "2026-08-27T19:32:58.173Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 641,
    "warmHitMs": 641,
    "rows": 936,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 641,
        "rows": 936
      }
    ],
    "testedAt": "2026-08-27T19:32:58.878Z"
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
  "durationMs": 166,
  "testedAt": "2026-08-27T19:32:59.548Z"
}```

## Browser navigation regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "desktop:round-1:navigate:#roster",
  "error": "TimeoutException: Message: timeout: Timed out receiving message from renderer: 20.000\n  (Session info: chrome=151.0.7922.173)\nStacktrace:\n#0 0x559f22c1736a <unknown>\n#1 0x559f2258af49 <unknown>\n#2 0x559f2257299b <unknown>\n#3 0x559f22572616 <unknown>\n#4 0x559f225701fe <unknown>\n#5 0x559f22570b7f <unknown>\n#6 0x559f2257fcf0 <unknown>\n#7 0x559f22599cb7 <unknown>\n#8 0x559f225a168b <unknown>\n#9 0x559f225712d9 <unknown>\n#10 0x559f22599a12 <unknown>\n#11 0x559f22629416 <unknown>\n#12 0x559f225d3c92 <unknown>\n#13 0x559f225d4b11 <unknown>\n#14 0x559f22bdc8d0 <unknown>\n#15 0x559f22bdaf3a <unknown>\n#16 0x559f22bc59b5 <unknown>\n#17 0x559f22bdbc0a <unknown>\n#18 0x559f22bad740 <unknown>\n#19 0x559f22c029a8 <unknown>\n#20 0x559f22c02b45 <unknown>\n#21 0x559f22c15f1e <unknown>\n#22 0x7fc1eaa9cb84 <unknown>\n#23 0x7fc1eab29d6c <unknown>\n",
  "state": {
    "stateReadError": "TimeoutException: Message: timeout: Timed out receiving message from renderer: 20.000\n  (Session info: chrome=151.0.7922.173)\nStacktrace:\n#0 0x559f22c1736a <unknown>\n#1 0x559f2258af49 <unknown>\n#2 0x559f2257299b <unknown>\n#3 0x559f22572616 <unknown>\n#4 0x559f225701fe <unknown>\n#5 0x559f22570b7f <unknown>\n#6 0x559f2257fcf0 <unknown>\n#7 0x559f22599cb7 <unknown>\n#8 0x559f225a168b <unknown>\n#9 0x559f225712d9 <unknown>\n#10 0x559f22599a12 <unknown>\n#11 0x559f22628f86 <unknown>\n#12 0x559f225d3c92 <unknown>\n#13 0x559f225d4b11 <unknown>\n#14 0x559f22bdc8d0 <unknown>\n#15 0x559f22bdaf3a <unknown>\n#16 0x559f22bc59b5 <unknown>\n#17 0x559f22bdbc0a <unknown>\n#18 0x559f22bad740 <unknown>\n#19 0x559f22c029a8 <unknown>\n#20 0x559f22c02b45 <unknown>\n#21 0x559f22c15f1e <unknown>\n#22 0x7fc1eaa9cb84 <unknown>\n#23 0x7fc1eab29d6c <unknown>\n"
  },
  "durationSeconds": 61.6,
  "testedAt": "2026-08-27T19:34:05Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
