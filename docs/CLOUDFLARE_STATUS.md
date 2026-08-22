# Cloudflare deployment status

- Status: **deployed + Change Intelligence browser regression failure**
- Source commit: `7cbe5c52f0164c44b34cd5c6fbc87d44e47fb19f`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: success
- Ask Titans browser regression: success
- Change Intelligence browser regression: failure
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-22T02:09:22Z

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
    "commit": "7cbe5c52f0164c44b34cd5c6fbc87d44e47fb19f",
    "builtAt": "2026-08-22T02:08:03.671Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 55,
    "health": 926,
    "data": 625,
    "stats": 219,
    "market": 590,
    "analytics": 1224
  },
  "testedAt": "2026-08-22T02:08:29.779Z",
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
  "durationMs": 137,
  "testedAt": "2026-08-22T02:08:31.273Z"
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
  "maxLongTaskMs": 234,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 18.21,
  "testedAt": "2026-08-22T02:08:54Z"
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
  "durationSeconds": 2.09,
  "testedAt": "2026-08-22T02:08:57Z"
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
  "durationSeconds": 2.19,
  "testedAt": "2026-08-22T02:08:59Z"
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
  "durationSeconds": 3.46,
  "testedAt": "2026-08-22T02:09:03Z"
}```

## Ask Titans browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "answers": [
    {
      "question": "Who is next?",
      "action": "#live",
      "answer": "Tennessee is next scheduled to host Seattle Seahawks on Mon, Aug 24, 12:00 AM UTC.",
      "facts": 4,
      "sources": 1,
      "why": "That is the next non-final, non-bye game in the loaded Titans schedule. FOX is the listed network."
    },
    {
      "question": "Cam Ward",
      "action": "#player?id=cb885a93-e510-4a22-8834-78fc4b32a54b",
      "answer": "Cam Ward is listed as QB #1 with roster status Active.",
      "facts": 2,
      "sources": 2,
      "why": "No recent structured player-game rows are loaded, so I am not treating missing stats as zero production."
    },
    {
      "question": "What is EPA?",
      "action": "#stats",
      "answer": "EPA: Expected Points Added estimates how much a play helped or hurt scoring expectation.",
      "facts": 2,
      "sources": 1,
      "why": "Advanced metrics are context tools, not standalone player grades. Command Center labels model-derived metrics and keeps them behind plain-English explanations."
    },
    {
      "question": "How do I watch?",
      "action": "#media",
      "answer": "The next game is Mon, Aug 24, 12:00 AM UTC and the loaded TV listing is FOX. Open Listen / Watch for your device-local time, Eastern time, Nashville time, UTC, radio, and territory-specific viewing guidance.",
      "facts": 2,
      "sources": 1,
      "why": "Broadcast rights vary by location, so the media center keeps viewing guidance separate by Nashville, elsewhere in the U.S., and international fans."
    }
  ],
  "unsupportedRefused": true,
  "mobileTargets": {
    "askButton": 50,
    "input": 50,
    "quick": [
      {
        "h": 48,
        "label": "What changed?"
      },
      {
        "h": 48,
        "label": "Who is next?"
      },
      {
        "h": 48,
        "label": "Injuries"
      },
      {
        "h": 48,
        "label": "Watch"
      },
      {
        "h": 48,
        "label": "Cam Ward"
      },
      {
        "h": 48,
        "label": "Explain EPA"
      }
    ],
    "viewport": 375,
    "width": 355
  },
  "browserWarnings": [],
  "durationSeconds": 1.61,
  "testedAt": "2026-08-22T02:09:05Z"
}```

## Change Intelligence browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "load",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 16.91,
  "testedAt": "2026-08-22T02:09:22Z",
  "hash": "#command",
  "pageText": "TITANS COMMAND INTELLIGENCE\nWhat changed. Why it matters. What comes next.\n\nA Titans-specific intelligence layer built around context instead of another wall of headlines.\n\nListen / Watch\nGame Day\nFan Hub\nChanges\nPress Room\nScheme Lab\nGlobal Fans\nStadium\nFan GM\nTime Machine\nSIGNATURE FEATURE\nTitans Change Engine\n\nWhat changed, when it changed, and why a fan should care.\n\n0\nCHANGES\nBaseline created.\nCome back after data changes and this page will show before/after differences instead of making you hunt across sections.\nLatest roster movement\nTransaction\nAug 19, 2026, 12:00 AM\nTransaction\nAug 17, 2026, 12:00 AM\nTransaction\nAug 16, 2026, 12:00 AM\nTransaction\nAug 10, 2026, 12:00 AM\nTransaction\nAug 6, 2026, 12:00 AM\nTransaction\nAug 2, 2026, 12:00 AM\nOpen transactions \u2192\nSource reliability\n\nEvidence tiers show what a source is. We do not invent an accuracy percentage without a verified history.\n\nEXTERNAL\nTitans Command Center\nNeeds cross-check \u00b7 Preseason sample size warning\nVERIFIED\nTennessee Titans\nOfficial team / league \u00b7 Titans continue official preseason roster moves\nVERIFIED\nTennessee Titans\nOfficial team / league \u00b7 Titans win preseason opener 19-13 over San Francisco\nVERIFIED\nTennessee Titans\nOfficial team / league \u00b7 First unofficial 2026 depth chart is out\nVERIFIED\nTennessee Titans\nOfficial team / league \u00b7 Robert Saleh talks camp ramp-up and Cam Ward\nOpen source registry \u2192\nPLAYER JOURNEY + CONNECTIONS\nAamil Wagner\nPlayer\nAamil Wagner\nAlontae Taylor\nAmani Hooker\nAndre James\nAnthony Hill Jr.\nAustin Deculus\nAustin Schlottmann\nBishop Fitzgerald\nBrandon Crenshaw-Dickson\nBryce Oliver\nCalvin Ridley\nCam Ward\nCarnell Tate\nCedric Gray\nChimere Dike\nCody Barton\nCor'Dale Flott\nCordell Volson\nCorey Mayfield Jr.\nCourtney Jackson\nD'Ernest Johnson\nDan Moore Jr.\nDaniel Bellinger\nDavid Martin-Robinson\nDerrick Canteen\nDominique Hampton\nDorian Mausi\nDrew Moss\nEarnest Brown IV\nElic Ayomanor\nErick Hallett II\nFernando Carmona Jr.\nGarrett Dellinger\nGunnar Helm\nHank Beatty\nHendon Hooker\nJackie Marshall\nJackson Slater\nJacob Martin\nJalen McMurray\nJalyn Holmes\nJames Williams Sr.\nJaren Kanak\nJaylen Harrell\nJC Latham\nJeffery Simmons\nJermaine Johnson II\nJerrick Reed II\nJoel Wilson\nJoey Slye\nJ",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
