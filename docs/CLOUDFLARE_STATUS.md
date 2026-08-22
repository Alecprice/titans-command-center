# Cloudflare deployment status

- Status: **deployed + Player Intelligence / Game Day browser regression failure**
- Source commit: `51321189021f8ef89d38fc5c74e025e5d6d73301`
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
- Recorded: 2026-08-22T00:40:08Z

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
    "commit": "51321189021f8ef89d38fc5c74e025e5d6d73301",
    "builtAt": "2026-08-22T00:39:18.982Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 67,
    "health": 1040,
    "data": 657,
    "stats": 247,
    "market": 3656,
    "analytics": 1196
  },
  "testedAt": "2026-08-22T00:39:47.767Z",
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
  "durationMs": 134,
  "testedAt": "2026-08-22T00:39:49.232Z"
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
  "maxLongTaskMs": 324,
  "longTasksOver250ms": 1,
  "browserWarnings": [],
  "durationSeconds": 8.4,
  "testedAt": "2026-08-22T00:40:00Z"
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
  "durationSeconds": 2.47,
  "testedAt": "2026-08-22T00:40:03Z"
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
  "durationSeconds": 2.5,
  "testedAt": "2026-08-22T00:40:06Z"
}```

## Player Intelligence / Game Day browser regression

```json
{
  "ok": false,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "stage": "player:find",
  "error": "RuntimeError: Could not resolve player route: #roster",
  "durationSeconds": 1.0,
  "testedAt": "2026-08-22T00:40:07Z",
  "hash": "#roster",
  "pageText": "PERSONNEL\nROSTER\n\nSearch the latest verified Titans roster by name, number, position, or unit.\n\nROSTER\nDEPTH CHART\nSTAFF\nRoster coverage: 95 player records are loaded from the official Titans roster snapshot audited Aug. 19, 2026: 91 Active + 4 Reserve/Injured. This is a dated snapshot and will change as preseason moves occur. View the official current roster \u2197\nCONTENT AUDIT: AUG. 19, 2026\nAll units\nOffense\nDefense\nSpecial Teams\nSTATUS\nALL\nACTIVE\nRESERVE / INJURED\nCLEAR FILTERS\n95 of 95 players shown\n61\nAndre James\n\nC \u00b7 Offense\n\nActive\n51\nAustin Schlottmann\n\nC \u00b7 Offense\n\nActive\n79\nPat Coogan\n\nC \u00b7 Offense\n\nActive\n73\nCordell Volson\n\nG \u00b7 Offense\n\nActive\n67\nDrew Moss\n\nG \u00b7 Offense\n\nActive\n66\nFernando Carmona Jr.\n\nG \u00b7 Offense\n\nActive\n71\nGarrett Dellinger\n\nG \u00b7 Offense\n\nActive\n64\nJackson Slater\n\nG \u00b7 Offense\n\nActive\n77\nPeter Skoronski\n\nG \u00b7 Offense\n\nActive\n1\nCam Ward\n\nQB \u00b7 Offense\n\nActive\n16\nHendon Hooker\n\nQB \u00b7 Offense\n\nActive\n10\nMitchell Trubisky\n\nQB \u00b7 Offense\n\nActive\n8\nWill Levis\n\nQB \u00b7 Offense\n\nActive\n21\nD'Ernest Johnson\n\nRB \u00b7 Offense\n\nActive\n36\nJulius Chestnut\n\nRB \u00b7 Offense\n\nActive\n31\nKalel Mullings\n\nRB \u00b7 Offense\n\nActive\n35\nMichael Carter\n\nRB \u00b7 Offense\n\nActive\n32\nNicholas Singleton\n\nRB \u00b7 Offense\n\nActive\n20\nTony Pollard\n\nRB \u00b7 Offense\n\nActive\n2\nTyjae Spears\n\nRB \u00b7 Offense\n\nActive\n69\nAamil Wagner\n\nT \u00b7 Offense\n\nActive\n76\nAustin Deculus\n\nT \u00b7 Offense\n\nActive\n78\nBrandon Crenshaw-Dickson\n\nT \u00b7 Offense\n\nActive\n75\nDan Moore Jr.\n\nT \u00b7 Offense\n\nActive\n55\nJC Latham\n\nT \u00b7 Offense\n\nActive\n62\nRasheed Miller\n\nT \u00b7 Offense\n\nActive\n72\nZachary Thomas\n\nT \u00b7 Offense\n\nActive\n82\nDaniel Bellinger\n\nTE \u00b7 Offense\n\nActive\n88\nDavid Martin-Robinson\n\nTE \u00b7 Offense\n\nActive\n84\nGunnar Helm\n\nTE \u00b7 Offense\n\nActive\n81\nJaren Kanak\n\nTE \u00b7 Offense\n\nReserve/Injured\n83\nJoel Wilson\n\nTE \u00b7 Offense\n\nActive\n86\nKylen Granson\n\nTE \u00b7 Of",
  "browserWarnings": []
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
