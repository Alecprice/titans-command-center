# Cloudflare deployment status

- Status: **deployed + Command Intelligence browser regression failure**
- Source commit: `06a725f58b3a8eb0f5d1772c62c6d8af1c1d979a`
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
- Recorded: 2026-08-22T00:25:26Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v43",
  "precachePaths": 75,
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
    "version": "1.0.0",
    "commit": "06a725f58b3a8eb0f5d1772c62c6d8af1c1d979a",
    "builtAt": "2026-08-22T00:23:52.187Z"
  },
  "deploymentPropagationAttempts": 12,
  "responseMs": {
    "root": 107,
    "health": 922,
    "data": 630,
    "stats": 414,
    "market": 8238,
    "analytics": 770
  },
  "testedAt": "2026-08-22T00:24:47.932Z",
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
  "durationMs": 115,
  "testedAt": "2026-08-22T00:24:48.947Z"
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
  "maxLongTaskMs": 63,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 14.37,
  "testedAt": "2026-08-22T00:25:08Z"
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
  "durationSeconds": 2.03,
  "testedAt": "2026-08-22T00:25:10Z"
}```

## Command Intelligence browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "mobile:command",
  "error": "TimeoutException: Message: \n",
  "durationSeconds": 16.08,
  "testedAt": "2026-08-22T00:25:26Z",
  "hash": "#command",
  "pageText": "TITANS COMMAND INTELLIGENCE\nWhat changed. Why it matters. What comes next.\n\nA Titans-specific intelligence layer built around context instead of another wall of headlines.\n\nListen / Watch\nGame Day\nFan Hub\nChanges\nPress Room\nScheme Lab\nGlobal Fans\nStadium\nFan GM\nTime Machine\nGLOBAL FAN DESK\nBe a Titans fan anywhere\n\nKickoff translation, media routing, a local fan passport and spoiler controls without assuming everyone lives in Nashville.\n\nOpen Listen / Watch \u2192\nNext-game concierge\nTitans vs Seattle Seahawks\nYour device \u00b7 Mon, Aug 24, 12:00 AM UTC\nEastern \u00b7 Sun, Aug 23, 8:00 PM EDT\nNashville \u00b7 Sun, Aug 23, 7:00 PM CDT\nUTC \u00b7 Mon, Aug 24, 12:00 AM UTC\nFOX\nFan passport\nMy city\nCountry\nMy watch-party note\nSave on this device\nSPOILER-FREE MODE\nWatching later?\n\nMask common score elements across Command Center until you turn them back on.\n\nReveal scores\n\nCommunity map / nearby-fan counts are intentionally not fabricated. That feature needs an opt-in community backend and moderation before it can be trustworthy.\n\nMY TITANS\nPersonal fan profile\nFavorite player\nNo favorite selected\nAamil Wagner\nAlontae Taylor\nAmani Hooker\nAndre James\nAnthony Hill Jr.\nAustin Deculus\nAustin Schlottmann\nBishop Fitzgerald\nBrandon Crenshaw-Dickson\nBryce Oliver\nCalvin Ridley\nCam Ward\nCarnell Tate\nCedric Gray\nChimere Dike\nCody Barton\nCor'Dale Flott\nCordell Volson\nCorey Mayfield Jr.\nCourtney Jackson\nD'Ernest Johnson\nDan Moore Jr.\nDaniel Bellinger\nDavid Martin-Robinson\nDerrick Canteen\nDominique Hampton\nDorian Mausi\nDrew Moss\nEarnest Brown IV\nElic Ayomanor\nErick Hallett II\nFernando Carmona Jr.\nGarrett Dellinger\nG",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
