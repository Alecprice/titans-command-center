# Cloudflare deployment status

- Status: **deployed + Ask Titans browser regression failure**
- Source commit: `17cc3cc4d1836ade031a39ce9417e674c98d2215`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: success
- Ask Titans browser regression: failure
- Change Intelligence browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-22T02:56:34Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v48",
  "precachePaths": 84,
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
    "commit": "17cc3cc4d1836ade031a39ce9417e674c98d2215",
    "builtAt": "2026-08-22T02:55:15.053Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 16,
    "health": 870,
    "data": 414,
    "stats": 238,
    "market": 2262,
    "analytics": 1194
  },
  "testedAt": "2026-08-22T02:55:42.939Z",
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
  "durationMs": 123,
  "testedAt": "2026-08-22T02:55:44.396Z"
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
  "maxLongTaskMs": 136,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 17.83,
  "testedAt": "2026-08-22T02:56:07Z"
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
  "durationSeconds": 1.94,
  "testedAt": "2026-08-22T02:56:10Z"
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
  "durationSeconds": 2.57,
  "testedAt": "2026-08-22T02:56:12Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "playerRoute": "#player?id=cb885a93-e510-4a22-8834-78fc4b32a54b",
  "playerRouteHydrated": true,
  "playerTabs": [
    "overview",
    "games",
    "trends",
    "career",
    "timeline"
  ],
  "favoriteToggle": [
    "false",
    "true",
    "false"
  ],
  "playerMobileTargets": [
    {
      "h": 48,
      "label": "Overview"
    },
    {
      "h": 48,
      "label": "Game Log"
    },
    {
      "h": 48,
      "label": "Trends"
    },
    {
      "h": 48,
      "label": "Career + Contract"
    },
    {
      "h": 48,
      "label": "Timeline"
    }
  ],
  "playerHeadshotLoaded": true,
  "gameDayPhase": "pregame",
  "gameDayTuneLink": true,
  "gameDayMobileViewport": 375,
  "browserWarnings": [],
  "durationSeconds": 3.53,
  "testedAt": "2026-08-22T02:56:16Z"
}```

## Ask Titans browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "ask:Who is next?",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 17.32,
  "testedAt": "2026-08-22T02:56:34Z",
  "hash": "#fan",
  "pageText": "FAN HUB\nEverything Titans.\nEasy to use.\n\nStart simple. Open more detail only when you want it.\n\nSimple view\nToday\nGame\nTeam\nSeason\nOffseason\nHistory\nToday\n\nThe important stuff first. No hunting around.\n\nNext game\nVS Seattle Seahawks\nAug 23, 7:00 PM\nFOX \u00b7 Nissan Stadium\nGame Day\nWhat changed?\nNo major tracked changes since your last Fan Hub visit\nRoster moves\nYour players\nPick a favorite player\n\nOpen the roster and favorite a player. Their updates will show here.\n\nRoster\nLatest move\n\nWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.\n\nAug 18, 7:00 PM\nFan pulse\ngames\n2 recent mentions\nroster\n2 recent mentions\ncam-ward\n2 recent mentions\nanalytics\n1 recent mention\ntransactions\n1 recent mention\nMarket pulse\nMarket pulse waiting\n\nNo current cached market row is available.\n\nMarkets\nFan picks\nSeason MVP\nChoose\n#61 Andre James \u00b7 C\n#51 Austin Schlottmann \u00b7 C\n#79 Pat Coogan \u00b7 C\n#73 Cordell Volson \u00b7 G\n#67 Drew Moss \u00b7 G\n#66 Fernando Carmona Jr. \u00b7 G\n#71 Garrett Dellinger \u00b7 G\n#64 Jackson Slater \u00b7 G\n#77 Peter Skoronski \u00b7 G\n#1 Cam Ward \u00b7 QB\n#16 Hendon Hooker \u00b7 QB\n#10 Mitchell Trubisky \u00b7 QB\n#8 Will Levis \u00b7 QB\n#21 D'Ernest Johnson \u00b7 RB\n#36 Julius Chestnut \u00b7 RB\n#31 Kalel Mullings \u00b7 RB\n#35 Michael Carter \u00b7 RB\n#32 Nicholas Singleton \u00b7 RB\n#20 Tony Pollard \u00b7 RB\n#2 Tyjae Spears \u00b7 RB\n#69 Aamil Wagner \u00b7 T\n#76 Austin Deculus \u00b7 T\n#78 Brandon Crenshaw-Dickson \u00b7 T\n#75 Dan Moore Jr. \u00b7 T\n#55 JC Latham \u00b7 T\n#62 Rasheed Miller \u00b7 T\n#72 Zachary Thomas \u00b7 T\n#82 Daniel Bellinger \u00b7 TE\n#88 David Martin-Robinson \u00b7 TE\n#84 Gunnar Helm \u00b7 TE\n#81 Jaren Kanak \u00b7 TE\n#83 Joel Wilson \u00b7 TE\n#86 Kylen Granson \u00b7 TE\n#47 Matt Lauter \u00b7 TE\n#80 Bryce Oliver \u00b7 WR\n#0 Calvin Ridley \u00b7 WR\n#14 Carnell Tate \u00b7 WR\n#17 Chimere Dike \u00b7 WR\n#39 Courtney Jackson \u00b7 WR\n#5 Elic Ayomanor \u00b7 WR\n#13 Hank Beatty \u00b7 WR\n#85 K.J. Osborn \u00b7 WR\n#89 Lance McCutcheon \u00b7 WR\n#12 Mason Kinsey \u00b7 WR\n#19 Tyren Montgomery \u00b7 WR\n#4 Wan'Dale Robinson \u00b7 WR\n#87 Xavier Restrepo \u00b7 WR\n#24 Alontae Taylor \u00b7 CB\n#18 Cor'Dale Flott \u00b7 CB\n#13 Corey Mayfield Jr. \u00b7 CB\n#16 Jalen McMurray \u00b7 CB\n#25 Joshua Williams \u00b7 CB\n#29 Keydrain Calligan \u00b7 CB\n#26 Marcus Harris \u00b7 CB\n#35 Mario Goodrich III \u00b7 CB\n#21 Micah Robinson \u00b7 CB\n#42 Derrick Canteen \u00b7 DB\n#30 Kendell Brooks",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
