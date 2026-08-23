# Cloudflare deployment status

- Status: **deployed + full production + browser + media + market + command intelligence + player intelligence + game day + Ask Titans + change intelligence + 365 mode + freshness + account + analytics + player headshot regressions passed**
- Source commit: `62df6495b5a032fb2ed388ff82803e44c1d291b6`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Market Pulse browser regression: success
- Command Intelligence browser regression: success
- Player Intelligence / Game Day browser regression: success
- Ask Titans browser regression: success
- Change Intelligence browser regression: success
- Runtime / 365 Mode browser regression: success
- Data freshness browser regression: success
- Account / Guest browser regression: success
- Advanced analytics browser regression: success
- Player headshot browser regression: success
- Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-08-23T11:21:36Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v59",
  "precachePaths": 99,
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
  "marketRows": 266,
  "marketMode": "configured-provider",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "62df6495b5a032fb2ed388ff82803e44c1d291b6",
    "builtAt": "2026-08-23T11:20:11.059Z"
  },
  "deploymentPropagationAttempts": 7,
  "responseMs": {
    "root": 15,
    "health": 176,
    "data": 204,
    "stats": 164,
    "market": 525,
    "analytics": 467
  },
  "testedAt": "2026-08-23T11:20:46.055Z",
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
  "durationMs": 121,
  "testedAt": "2026-08-23T11:20:46.794Z"
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
  "smartSearchQuickJump": true,
  "mobileDrawerInert": true,
  "fiveActionDock": true,
  "teamRoomChecks": 4,
  "rosterFilterReset": true,
  "mobileTargets": [
    {
      "height": 58,
      "label": "Home",
      "width": 69.796875
    },
    {
      "height": 58,
      "label": "Roster",
      "width": 69.796875
    },
    {
      "height": 58,
      "label": "Game",
      "width": 69.796875
    },
    {
      "height": 58,
      "label": "Search",
      "width": 69.796875
    },
    {
      "height": 58,
      "label": "More",
      "width": 69.8125
    }
  ],
  "maxLongTaskMs": 104,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 17.11,
  "testedAt": "2026-08-23T11:21:09Z"
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
  "durationSeconds": 2.01,
  "testedAt": "2026-08-23T11:21:11Z"
}```

## Market Pulse browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "initial": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 88,
        "total": 266
      },
      "summary": {
        "controls": [
          {
            "disabled": false,
            "height": 44,
            "id": "mh-event-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 352
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-book-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 170
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-category-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 160
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-alt-toggle",
            "pressed": "false",
            "tag": "BUTTON",
            "value": "",
            "width": 177.390625
          }
        ],
        "empty": "",
        "errorVisible": false,
        "overflow": false,
        "provider": "PropLine",
        "quality": "Live",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "Showing 88 of 266 rows",
        "resultTotal": 266,
        "rows": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-2.5Price+233Implied30.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine2.5Price+138Implied42.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine4.5Price-120Implied54.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetRivers \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Bovada \u2197SideSeattle SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 FanDuel \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideSeattle SeahawksLine4.5Price-116Implied53.7%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 MyBookie.ag \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Pinnacle \u2197SideSeattle SeahawksLine4.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 ProphetX \u2197SideSeattle SeahawksLine4.5Price-108Implied51.9%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Novig \u2197SideSeattle SeahawksLine6.5Price-150Implied60.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideTEN TitansLine-4.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideTEN TitansLine-4.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Novig \u2197SideTennessee TitansLine-6.5Price+125Implied44.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideTennessee TitansLine-4.5Price+100Implied50.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetRivers \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Bovada \u2197SideTennessee TitansLine-4.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 FanDuel \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideTennessee TitansLine-4.5Price+105Implied48.8%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 MyBookie.ag \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Pinnacle \u2197SideTennessee TitansLine-4.5Price-103Implied50.7%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 ProphetX \u2197SideTennessee TitansLine-4.5Price+104Implied49.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideTennessee TitansLine-2.5Price-144Implied59.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideTennessee TitansLine2.5Price-245Implied71.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings \u2197SideSEA SeahawksLine\u2014Price+170Implied37.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine\u2014Price+170Implied37.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Kalshi \u2197SideSEA SeahawksLine\u2014Price+156Implied39.1%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 1xBet \u2197SideSeattle SeahawksLine\u2014Price+170Implied37.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine\u2014Price+157Implied38.9%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetRivers \u2197SideSeattle SeahawksLine\u2014Price+163Implied38.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetUS \u2197SideSeattle SeahawksLine\u2014Price+155Implied39.2%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Bovada \u2197SideSeattle SeahawksLine\u2014Price+160Implied38.5%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 FanDuel \u2197SideSeattle SeahawksLine\u2014Price+168Implied37.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 LowVig.ag \u2197SideSeattle SeahawksLine\u2014Price+157Implied38.9%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 MyBookie.ag \u2197SideSeattle SeahawksLine\u2014Price+167Implied37.5%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Novig \u2197SideSeattle SeahawksLine\u2014Price+163Implied38.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Pinnacle \u2197SideSeattle SeahawksLine\u2014Price+164Implied37.9%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 ProphetX \u2197SideSeattle SeahawksLine\u2014Price+166Implied37.6%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings \u2197SideTEN TitansLine\u2014Price-205Implied67.2%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings Predictions \u2197SideTEN TitansLine\u2014Price-205Implied67.2%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Kalshi \u2197SideTEN TitansLine\u2014Price-163Implied62.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 1xBet \u2197SideTennessee TitansLine\u2014Price-205Implied67.2%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetOnline.ag \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetRivers \u2197SideTennessee TitansLine\u2014Price-200Implied66.7%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetUS \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Bovada \u2197SideTennessee TitansLine\u2014Price-185Implied64.9%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 FanDuel \u2197SideTennessee TitansLine\u2014Price-200Implied66.7%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 LowVig.ag \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 MyBookie.ag \u2197SideTennessee TitansLine\u2014Price-208Implied67.5%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Novig \u2197SideTennessee TitansLine\u2014Price-170Implied63.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Pinnacle \u2197SideTennessee TitansLine\u2014Price-197Implied66.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 ProphetX \u2197SideTennessee TitansLine\u2014Price-168Implied62.7%",
          "CHI Bears at TEN Titans Moneyline \u00b7 Kalshi \u2197SideCHI BearsLine\u2014Price-117Implied53.9%",
          "CHI Bears at TEN Titans Moneyline \u00b7 Kalshi \u2197SideTEN TitansLine\u2014Price-133Implied57.1%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 1xBet \u2197SideOverLine37.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetOnline.ag \u2197SideOverLine37.5Price-107Implied51.7%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetRivers \u2197SideOverLine37.5Price-112Implied52.8%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetUS \u2197SideOverLine37.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings \u2197SideOverLine37.5Price-112Implied52.8%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings Predictions \u2197SideOverLine37.5Price-112Implied52.8%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Kalshi \u2197SideOverLine37.5Price-100Implied50.0%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 LowVig.ag \u2197SideOverLine37.5Price-104Implied51.0%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 ProphetX \u2197SideOverLine37.5Price-103Implied50.7%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Bovada \u2197SideOverLine38Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Pinnacle \u2197SideOverLine38Price-106Implied51.5%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 FanDuel \u2197SideOverLine38.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 MyBookie.ag \u2197SideOverLine38.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Novig \u2197SideOverLine38.5Price+108Implied48.1%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 1xBet \u2197SideUnderLine37.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetOnline.ag \u2197SideUnderLine37.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetRivers \u2197SideUnderLine37.5Price-109Implied52.2%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetUS \u2197SideUnderLine37.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings \u2197SideUnderLine37.5Price-108Implied51.9%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings Predictions \u2197SideUnderLine37.5Price-108Implied51.9%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Kalshi \u2197SideUnderLine37.5Price-104Implied51.0%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 LowVig.ag \u2197SideUnderLine37.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 ProphetX \u2197SideUnderLine37.5Price-101Implied50.2%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Bovada \u2197SideUnderLine38Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Pinnacle \u2197SideUnderLine38Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 FanDuel \u2197SideUnderLine38.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 MyBookie.ag \u2197SideUnderLine38.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Novig \u2197SideUnderLine38.5Price-113Implied53.1%"
        ],
        "scrollWidth": 1265,
        "shown": 88,
        "title": "Live Titans market board",
        "total": 266,
        "viewport": 1265
      }
    },
    "filters": {
      "event": {
        "available": true,
        "options": 3,
        "selectedValue": "148033",
        "before": "Showing 88 of 266 rows",
        "after": "Showing 86 of 266 rows"
      },
      "book": {
        "available": true,
        "options": 15,
        "selectedValue": "onexbet",
        "before": "Showing 88 of 266 rows",
        "after": "Showing 6 of 266 rows"
      },
      "category": {
        "available": true,
        "options": 2,
        "selectedValue": "game_line",
        "before": "Showing 88 of 266 rows",
        "after": "Showing 88 of 266 rows"
      }
    },
    "alternateLines": {
      "available": true,
      "beforeRows": 88,
      "afterRows": 266
    },
    "refresh": {
      "state": {
        "quality": "Live",
        "provider": "PropLine",
        "shown": 266,
        "total": 266
      },
      "summary": {
        "controls": [
          {
            "disabled": false,
            "height": 44,
            "id": "mh-event-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 352
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-book-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 170
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-category-filter",
            "pressed": null,
            "tag": "SELECT",
            "value": "all",
            "width": 160
          },
          {
            "disabled": false,
            "height": 44,
            "id": "mh-alt-toggle",
            "pressed": "true",
            "tag": "BUTTON",
            "value": "",
            "width": 171.390625
          }
        ],
        "empty": "",
        "errorVisible": false,
        "overflow": false,
        "provider": "PropLine",
        "quality": "Live",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "Showing 266 of 266 rows",
        "resultTotal": 266,
        "rows": [
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-16.5Price+1900Implied5.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-14.5Price+1900Implied5.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-13.5Price+1900Implied5.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-10.5Price+1150Implied8.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-9.5Price+900Implied10.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-7.5Price+669Implied13.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-6.5Price+525Implied16.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-5.5Price+488Implied17.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-5.5Price+326Implied23.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-4.5Price+400Implied20.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-4.5Price+292Implied25.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-3.5Price+335Implied23.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-3.5Price+257Implied28.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-2.5Price+233Implied30.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-2.5Price+190Implied34.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-1.5Price+223Implied31.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-1.5Price+174Implied36.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine1.5Price+150Implied40.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine1.5Price+130Implied43.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine1.5Price+144Implied41.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine2.5Price+138Implied42.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine2.5Price+122Implied45.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine2.5Price+130Implied43.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine3Price+111Implied47.4%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine3.5Price+108Implied48.1%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine3.5Price+104Implied49.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine3.5Price+107Implied48.3%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine4Price-107Implied51.7%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine4.5Price-120Implied54.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetRivers \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Bovada \u2197SideSeattle SeahawksLine4.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 FanDuel \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine4.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideSeattle SeahawksLine4.5Price-116Implied53.7%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 MyBookie.ag \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine4.5Price-108Implied51.9%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Pinnacle \u2197SideSeattle SeahawksLine4.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 ProphetX \u2197SideSeattle SeahawksLine4.5Price-108Implied51.9%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine5Price-121Implied54.8%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine5.5Price-122Implied55.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine5.5Price-117Implied53.9%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine6.5Price-144Implied59.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Novig \u2197SideSeattle SeahawksLine6.5Price-150Implied60.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine7.5Price-170Implied63.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine7.5Price-178Implied64.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine8.5Price-213Implied68.1%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine9.5Price-213Implied68.1%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine9.5Price-233Implied70.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine10.5Price-233Implied70.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine10.5Price-335Implied77.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine13.5Price-335Implied77.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine13.5Price-355Implied78.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine14.5Price-456Implied82.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine14.5Price-456Implied82.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine16.5Price-567Implied85.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine16.5Price-567Implied85.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideTEN TitansLine-4.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideTEN TitansLine-4.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-16.5Price+525Implied16.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-16.5Price+426Implied19.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-14.5Price+400Implied20.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-14.5Price+335Implied23.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-13.5Price+317Implied24.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-13.5Price+300Implied25.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-10.5Price+212Implied32.1%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-10.5Price+212Implied32.1%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-9.5Price+203Implied33.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-9.5Price+203Implied33.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-8.5Price+167Implied37.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-7.5Price+163Implied38.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-7.5Price+156Implied39.1%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-6.5Price+138Implied42.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Novig \u2197SideTennessee TitansLine-6.5Price+125Implied44.4%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-5.5Price+113Implied46.9%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-5.5Price+108Implied48.1%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-5Price+105Implied48.8%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideTennessee TitansLine-4.5Price+100Implied50.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetRivers \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Bovada \u2197SideTennessee TitansLine-4.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 FanDuel \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-4.5Price+108Implied48.1%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideTennessee TitansLine-4.5Price+105Implied48.8%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 MyBookie.ag \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-4.5Price+102Implied49.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Pinnacle \u2197SideTennessee TitansLine-4.5Price-103Implied50.7%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 ProphetX \u2197SideTennessee TitansLine-4.5Price+104Implied49.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-4Price-109Implied52.2%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-3.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-3.5Price-117Implied53.9%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-3.5Price-117Implied53.9%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-3Price-130Implied56.5%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideTennessee TitansLine-2.5Price-144Implied59.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-2.5Price-160Implied61.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-2.5Price-142Implied58.7%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-1.5Price-156Implied60.9%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-1.5Price-178Implied64.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-1.5Price-152Implied60.3%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine1.5Price-233Implied70.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine1.5Price-233Implied70.0%",
          "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideTennessee TitansLine2.5Price-245Implied71.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine2.5Price-264Implied72.5%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine3.5Price-355Implied78.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine3.5Price-376Implied79.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine4.5Price-426Implied81.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine4.5Price-426Implied81.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine5.5Price-525Implied84.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine5.5Price-1011Implied91.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine6.5Price-567Implied85.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine7.5Price-733Implied88.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine9.5Price-1011Implied91.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine10.5Price-1329Implied93.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine13.5Price-2400Implied96.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine14.5Price-2400Implied96.0%",
          "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine16.5Price-2400Implied96.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings \u2197SideSEA SeahawksLine\u2014Price+170Implied37.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine\u2014Price+170Implied37.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Kalshi \u2197SideSEA SeahawksLine\u2014Price+156Implied39.1%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 1xBet \u2197SideSeattle SeahawksLine\u2014Price+170Implied37.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine\u2014Price+157Implied38.9%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetRivers \u2197SideSeattle SeahawksLine\u2014Price+163Implied38.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetUS \u2197SideSeattle SeahawksLine\u2014Price+155Implied39.2%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Bovada \u2197SideSeattle SeahawksLine\u2014Price+160Implied38.5%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 FanDuel \u2197SideSeattle SeahawksLine\u2014Price+168Implied37.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 LowVig.ag \u2197SideSeattle SeahawksLine\u2014Price+157Implied38.9%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 MyBookie.ag \u2197SideSeattle SeahawksLine\u2014Price+167Implied37.5%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Novig \u2197SideSeattle SeahawksLine\u2014Price+163Implied38.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Pinnacle \u2197SideSeattle SeahawksLine\u2014Price+164Implied37.9%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 ProphetX \u2197SideSeattle SeahawksLine\u2014Price+166Implied37.6%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings \u2197SideTEN TitansLine\u2014Price-205Implied67.2%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings Predictions \u2197SideTEN TitansLine\u2014Price-205Implied67.2%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Kalshi \u2197SideTEN TitansLine\u2014Price-163Implied62.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 1xBet \u2197SideTennessee TitansLine\u2014Price-205Implied67.2%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetOnline.ag \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetRivers \u2197SideTennessee TitansLine\u2014Price-200Implied66.7%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetUS \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Bovada \u2197SideTennessee TitansLine\u2014Price-185Implied64.9%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 FanDuel \u2197SideTennessee TitansLine\u2014Price-200Implied66.7%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 LowVig.ag \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 MyBookie.ag \u2197SideTennessee TitansLine\u2014Price-208Implied67.5%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Novig \u2197SideTennessee TitansLine\u2014Price-170Implied63.0%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Pinnacle \u2197SideTennessee TitansLine\u2014Price-197Implied66.3%",
          "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 ProphetX \u2197SideTennessee TitansLine\u2014Price-168Implied62.7%",
          "CHI Bears at TEN Titans Moneyline \u00b7 Kalshi \u2197SideCHI BearsLine\u2014Price-117Implied53.9%",
          "CHI Bears at TEN Titans Moneyline \u00b7 Kalshi \u2197SideTEN TitansLine\u2014Price-133Implied57.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine17.5Price-1900Implied95.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine17.5Price-11011Implied99.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine20.5Price-1329Implied93.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine20.5Price-19900Implied99.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine23.5Price-733Implied88.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine23.5Price-1900Implied95.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine26.5Price-567Implied85.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine26.5Price-1150Implied92.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine29.5Price-317Implied76.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine29.5Price-441Implied81.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine31.5Price-1011Implied91.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine32.5Price-213Implied68.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine32.5Price-245Implied71.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine33.5Price-208Implied67.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine34.5Price-178Implied64.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine35.5Price-138Implied58.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine35.5Price-156Implied60.9%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine36.5Price-122Implied55.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine36.5Price-133Implied57.1%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 1xBet \u2197SideOverLine37.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetOnline.ag \u2197SideOverLine37.5Price-107Implied51.7%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetRivers \u2197SideOverLine37.5Price-112Implied52.8%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetUS \u2197SideOverLine37.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings \u2197SideOverLine37.5Price-112Implied52.8%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings Predictions \u2197SideOverLine37.5Price-112Implied52.8%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Kalshi \u2197SideOverLine37.5Price-100Implied50.0%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 LowVig.ag \u2197SideOverLine37.5Price-104Implied51.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine37.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 ProphetX \u2197SideOverLine37.5Price-103Implied50.7%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Bovada \u2197SideOverLine38Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Pinnacle \u2197SideOverLine38Price-106Implied51.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 ProphetX \u2197SideOverLine38Price+102Implied49.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 1xBet \u2197SideOverLine38.5Price-120Implied54.5%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 FanDuel \u2197SideOverLine38.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine38.5Price+113Implied46.9%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 MyBookie.ag \u2197SideOverLine38.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Novig \u2197SideOverLine38.5Price+108Implied48.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 ProphetX \u2197SideOverLine38.5Price+109Implied47.8%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine39.5Price+127Implied44.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine39.5Price+108Implied48.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine40.5Price+150Implied40.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine40.5Price+125Implied44.4%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine41.5Price+163Implied38.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine41.5Price+144Implied41.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine42.5Price+160Implied38.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine43.5Price+186Implied35.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine44.5Price+245Implied29.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine44.5Price+223Implied31.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine47.5Price+355Implied22.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine47.5Price+335Implied23.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine50.5Price+567Implied15.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine50.5Price+525Implied16.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine53.5Price+809Implied11.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine53.5Price+669Implied13.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine56.5Price+1329Implied7.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine56.5Price+590Implied14.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine59.5Price+1900Implied5.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine59.5Price+852Implied10.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine17.5Price+1329Implied7.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine17.5Price+669Implied13.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine20.5Price+1011Implied9.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine20.5Price+567Implied15.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine23.5Price+669Implied13.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine23.5Price+413Implied19.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine26.5Price+488Implied17.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine26.5Price+344Implied22.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine29.5Price+300Implied25.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine29.5Price+277Implied26.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine31.5Price+208Implied32.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine32.5Price+203Implied33.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine32.5Price+190Implied34.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine33.5Price+160Implied38.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine34.5Price+141Implied41.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine35.5Price+133Implied42.9%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine35.5Price+125Implied44.4%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine36.5Price+117Implied46.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine36.5Price+106Implied48.5%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 1xBet \u2197SideUnderLine37.5Price-105Implied51.2%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetOnline.ag \u2197SideUnderLine37.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetRivers \u2197SideUnderLine37.5Price-109Implied52.2%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 BetUS \u2197SideUnderLine37.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings \u2197SideUnderLine37.5Price-108Implied51.9%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings Predictions \u2197SideUnderLine37.5Price-108Implied51.9%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Kalshi \u2197SideUnderLine37.5Price-104Implied51.0%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 LowVig.ag \u2197SideUnderLine37.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine37.5Price-111Implied52.6%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 ProphetX \u2197SideUnderLine37.5Price-101Implied50.2%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Bovada \u2197SideUnderLine38Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Pinnacle \u2197SideUnderLine38Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 ProphetX \u2197SideUnderLine38Price-108Implied51.9%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 1xBet \u2197SideUnderLine38.5Price-125Implied55.6%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 FanDuel \u2197SideUnderLine38.5Price-115Implied53.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine38.5Price-117Implied53.9%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 MyBookie.ag \u2197SideUnderLine38.5Price-110Implied52.4%",
          "Seattle Seahawks at Tennessee Titans Total \u00b7 Novig \u2197SideUnderLine38.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 ProphetX \u2197SideUnderLine38.5Price-113Implied53.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine39.5Price-133Implied57.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine39.5Price-138Implied58.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine40.5Price-156Implied60.9%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine40.5Price-167Implied62.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine41.5Price-170Implied63.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine41.5Price-194Implied66.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine42.5Price-213Implied68.1%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine43.5Price-251Implied71.5%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine44.5Price-257Implied72.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine44.5Price-270Implied73.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine47.5Price-376Implied79.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine47.5Price-400Implied80.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine50.5Price-614Implied86.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine50.5Price-614Implied86.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine53.5Price-900Implied90.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine53.5Price-900Implied90.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine56.5Price-1567Implied94.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine56.5Price-24900Implied99.6%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine59.5Price-2400Implied96.0%",
          "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine59.5Price-99900Implied99.9%"
        ],
        "scrollWidth": 1265,
        "shown": 266,
        "title": "Live Titans market board",
        "total": 266,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Live",
      "provider": "PropLine",
      "shown": 266,
      "total": 266
    },
    "summary": {
      "controls": [
        {
          "disabled": false,
          "height": 44,
          "id": "mh-event-filter",
          "pressed": null,
          "tag": "SELECT",
          "value": "all",
          "width": 331
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-book-filter",
          "pressed": null,
          "tag": "SELECT",
          "value": "all",
          "width": 331
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-category-filter",
          "pressed": null,
          "tag": "SELECT",
          "value": "all",
          "width": 331
        },
        {
          "disabled": false,
          "height": 44,
          "id": "mh-alt-toggle",
          "pressed": "true",
          "tag": "BUTTON",
          "value": "",
          "width": 331
        }
      ],
      "empty": "",
      "errorVisible": false,
      "overflow": false,
      "provider": "PropLine",
      "quality": "Live",
      "referenceNotice": "",
      "refreshHeight": 44,
      "result": "Showing 266 of 266 rows",
      "resultTotal": 266,
      "rows": [
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine4.5Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-16.5Price+1900Implied5.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-14.5Price+1900Implied5.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-13.5Price+1900Implied5.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-10.5Price+1150Implied8.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-9.5Price+900Implied10.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-7.5Price+669Implied13.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-6.5Price+525Implied16.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-5.5Price+488Implied17.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-5.5Price+326Implied23.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-4.5Price+400Implied20.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-4.5Price+292Implied25.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-3.5Price+335Implied23.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-3.5Price+257Implied28.0%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-2.5Price+233Implied30.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-2.5Price+190Implied34.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine-1.5Price+223Implied31.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine-1.5Price+174Implied36.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine1.5Price+150Implied40.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine1.5Price+130Implied43.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine1.5Price+144Implied41.0%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideSeattle SeahawksLine2.5Price+138Implied42.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine2.5Price+122Implied45.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine2.5Price+130Implied43.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine3Price+111Implied47.4%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine3.5Price+108Implied48.1%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine3.5Price+104Implied49.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine3.5Price+107Implied48.3%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine4Price-107Implied51.7%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine4.5Price-120Implied54.5%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetRivers \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Bovada \u2197SideSeattle SeahawksLine4.5Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 FanDuel \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine4.5Price-113Implied53.1%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideSeattle SeahawksLine4.5Price-116Implied53.7%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 MyBookie.ag \u2197SideSeattle SeahawksLine4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine4.5Price-108Implied51.9%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Pinnacle \u2197SideSeattle SeahawksLine4.5Price-113Implied53.1%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 ProphetX \u2197SideSeattle SeahawksLine4.5Price-108Implied51.9%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideSeattle SeahawksLine5Price-121Implied54.8%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine5.5Price-122Implied55.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine5.5Price-117Implied53.9%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine6.5Price-144Implied59.0%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Novig \u2197SideSeattle SeahawksLine6.5Price-150Implied60.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine7.5Price-170Implied63.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine7.5Price-178Implied64.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine8.5Price-213Implied68.1%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine9.5Price-213Implied68.1%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine9.5Price-233Implied70.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine10.5Price-233Implied70.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine10.5Price-335Implied77.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine13.5Price-335Implied77.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine13.5Price-355Implied78.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine14.5Price-456Implied82.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine14.5Price-456Implied82.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideSeattle SeahawksLine16.5Price-567Implied85.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideSeattle SeahawksLine16.5Price-567Implied85.0%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings \u2197SideTEN TitansLine-4.5Price-105Implied51.2%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 DraftKings Predictions \u2197SideTEN TitansLine-4.5Price-105Implied51.2%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-16.5Price+525Implied16.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-16.5Price+426Implied19.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-14.5Price+400Implied20.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-14.5Price+335Implied23.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-13.5Price+317Implied24.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-13.5Price+300Implied25.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-10.5Price+212Implied32.1%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-10.5Price+212Implied32.1%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-9.5Price+203Implied33.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-9.5Price+203Implied33.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-8.5Price+167Implied37.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-7.5Price+163Implied38.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-7.5Price+156Implied39.1%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-6.5Price+138Implied42.0%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Novig \u2197SideTennessee TitansLine-6.5Price+125Implied44.4%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-5.5Price+113Implied46.9%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-5.5Price+108Implied48.1%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-5Price+105Implied48.8%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 1xBet \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetOnline.ag \u2197SideTennessee TitansLine-4.5Price+100Implied50.0%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetRivers \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 BetUS \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Bovada \u2197SideTennessee TitansLine-4.5Price-105Implied51.2%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 FanDuel \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-4.5Price+108Implied48.1%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 LowVig.ag \u2197SideTennessee TitansLine-4.5Price+105Implied48.8%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 MyBookie.ag \u2197SideTennessee TitansLine-4.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-4.5Price+102Implied49.5%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Pinnacle \u2197SideTennessee TitansLine-4.5Price-103Implied50.7%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 ProphetX \u2197SideTennessee TitansLine-4.5Price+104Implied49.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-4Price-109Implied52.2%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-3.5Price-113Implied53.1%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-3.5Price-117Implied53.9%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-3.5Price-117Implied53.9%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-3Price-130Implied56.5%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideTennessee TitansLine-2.5Price-144Implied59.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-2.5Price-160Implied61.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-2.5Price-142Implied58.7%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine-1.5Price-156Implied60.9%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine-1.5Price-178Implied64.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 ProphetX \u2197SideTennessee TitansLine-1.5Price-152Implied60.3%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine1.5Price-233Implied70.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine1.5Price-233Implied70.0%",
        "Seattle Seahawks at Tennessee Titans Spread \u00b7 Kalshi \u2197SideTennessee TitansLine2.5Price-245Implied71.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine2.5Price-264Implied72.5%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine3.5Price-355Implied78.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine3.5Price-376Implied79.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine4.5Price-426Implied81.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine4.5Price-426Implied81.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine5.5Price-525Implied84.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Novig \u2197SideTennessee TitansLine5.5Price-1011Implied91.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine6.5Price-567Implied85.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine7.5Price-733Implied88.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine9.5Price-1011Implied91.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine10.5Price-1329Implied93.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine13.5Price-2400Implied96.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine14.5Price-2400Implied96.0%",
        "Seattle Seahawks at Tennessee Titans ALTSpread \u00b7 Kalshi \u2197SideTennessee TitansLine16.5Price-2400Implied96.0%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings \u2197SideSEA SeahawksLine\u2014Price+170Implied37.0%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings Predictions \u2197SideSEA SeahawksLine\u2014Price+170Implied37.0%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Kalshi \u2197SideSEA SeahawksLine\u2014Price+156Implied39.1%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 1xBet \u2197SideSeattle SeahawksLine\u2014Price+170Implied37.0%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetOnline.ag \u2197SideSeattle SeahawksLine\u2014Price+157Implied38.9%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetRivers \u2197SideSeattle SeahawksLine\u2014Price+163Implied38.0%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetUS \u2197SideSeattle SeahawksLine\u2014Price+155Implied39.2%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Bovada \u2197SideSeattle SeahawksLine\u2014Price+160Implied38.5%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 FanDuel \u2197SideSeattle SeahawksLine\u2014Price+168Implied37.3%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 LowVig.ag \u2197SideSeattle SeahawksLine\u2014Price+157Implied38.9%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 MyBookie.ag \u2197SideSeattle SeahawksLine\u2014Price+167Implied37.5%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Novig \u2197SideSeattle SeahawksLine\u2014Price+163Implied38.0%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Pinnacle \u2197SideSeattle SeahawksLine\u2014Price+164Implied37.9%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 ProphetX \u2197SideSeattle SeahawksLine\u2014Price+166Implied37.6%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings \u2197SideTEN TitansLine\u2014Price-205Implied67.2%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 DraftKings Predictions \u2197SideTEN TitansLine\u2014Price-205Implied67.2%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Kalshi \u2197SideTEN TitansLine\u2014Price-163Implied62.0%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 1xBet \u2197SideTennessee TitansLine\u2014Price-205Implied67.2%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetOnline.ag \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetRivers \u2197SideTennessee TitansLine\u2014Price-200Implied66.7%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 BetUS \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Bovada \u2197SideTennessee TitansLine\u2014Price-185Implied64.9%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 FanDuel \u2197SideTennessee TitansLine\u2014Price-200Implied66.7%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 LowVig.ag \u2197SideTennessee TitansLine\u2014Price-180Implied64.3%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 MyBookie.ag \u2197SideTennessee TitansLine\u2014Price-208Implied67.5%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Novig \u2197SideTennessee TitansLine\u2014Price-170Implied63.0%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 Pinnacle \u2197SideTennessee TitansLine\u2014Price-197Implied66.3%",
        "Seattle Seahawks at Tennessee Titans Moneyline \u00b7 ProphetX \u2197SideTennessee TitansLine\u2014Price-168Implied62.7%",
        "CHI Bears at TEN Titans Moneyline \u00b7 Kalshi \u2197SideCHI BearsLine\u2014Price-117Implied53.9%",
        "CHI Bears at TEN Titans Moneyline \u00b7 Kalshi \u2197SideTEN TitansLine\u2014Price-133Implied57.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine17.5Price-1900Implied95.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine17.5Price-11011Implied99.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine20.5Price-1329Implied93.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine20.5Price-19900Implied99.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine23.5Price-733Implied88.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine23.5Price-1900Implied95.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine26.5Price-567Implied85.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine26.5Price-1150Implied92.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine29.5Price-317Implied76.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine29.5Price-441Implied81.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine31.5Price-1011Implied91.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine32.5Price-213Implied68.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine32.5Price-245Implied71.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine33.5Price-208Implied67.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine34.5Price-178Implied64.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine35.5Price-138Implied58.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine35.5Price-156Implied60.9%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine36.5Price-122Implied55.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine36.5Price-133Implied57.1%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 1xBet \u2197SideOverLine37.5Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 BetOnline.ag \u2197SideOverLine37.5Price-107Implied51.7%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 BetRivers \u2197SideOverLine37.5Price-112Implied52.8%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 BetUS \u2197SideOverLine37.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings \u2197SideOverLine37.5Price-112Implied52.8%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings Predictions \u2197SideOverLine37.5Price-112Implied52.8%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 Kalshi \u2197SideOverLine37.5Price-100Implied50.0%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 LowVig.ag \u2197SideOverLine37.5Price-104Implied51.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine37.5Price-113Implied53.1%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 ProphetX \u2197SideOverLine37.5Price-103Implied50.7%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 Bovada \u2197SideOverLine38Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 Pinnacle \u2197SideOverLine38Price-106Implied51.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 ProphetX \u2197SideOverLine38Price+102Implied49.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 1xBet \u2197SideOverLine38.5Price-120Implied54.5%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 FanDuel \u2197SideOverLine38.5Price-105Implied51.2%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine38.5Price+113Implied46.9%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 MyBookie.ag \u2197SideOverLine38.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 Novig \u2197SideOverLine38.5Price+108Implied48.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 ProphetX \u2197SideOverLine38.5Price+109Implied47.8%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine39.5Price+127Implied44.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine39.5Price+108Implied48.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine40.5Price+150Implied40.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine40.5Price+125Implied44.4%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine41.5Price+163Implied38.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine41.5Price+144Implied41.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine42.5Price+160Implied38.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine43.5Price+186Implied35.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine44.5Price+245Implied29.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine44.5Price+223Implied31.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine47.5Price+355Implied22.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine47.5Price+335Implied23.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine50.5Price+567Implied15.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine50.5Price+525Implied16.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine53.5Price+809Implied11.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine53.5Price+669Implied13.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine56.5Price+1329Implied7.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine56.5Price+590Implied14.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideOverLine59.5Price+1900Implied5.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideOverLine59.5Price+852Implied10.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine17.5Price+1329Implied7.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine17.5Price+669Implied13.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine20.5Price+1011Implied9.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine20.5Price+567Implied15.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine23.5Price+669Implied13.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine23.5Price+413Implied19.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine26.5Price+488Implied17.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine26.5Price+344Implied22.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine29.5Price+300Implied25.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine29.5Price+277Implied26.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine31.5Price+208Implied32.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine32.5Price+203Implied33.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine32.5Price+190Implied34.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine33.5Price+160Implied38.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine34.5Price+141Implied41.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine35.5Price+133Implied42.9%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine35.5Price+125Implied44.4%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine36.5Price+117Implied46.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine36.5Price+106Implied48.5%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 1xBet \u2197SideUnderLine37.5Price-105Implied51.2%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 BetOnline.ag \u2197SideUnderLine37.5Price-113Implied53.1%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 BetRivers \u2197SideUnderLine37.5Price-109Implied52.2%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 BetUS \u2197SideUnderLine37.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings \u2197SideUnderLine37.5Price-108Implied51.9%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 DraftKings Predictions \u2197SideUnderLine37.5Price-108Implied51.9%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 Kalshi \u2197SideUnderLine37.5Price-104Implied51.0%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 LowVig.ag \u2197SideUnderLine37.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine37.5Price-111Implied52.6%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 ProphetX \u2197SideUnderLine37.5Price-101Implied50.2%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 Bovada \u2197SideUnderLine38Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 Pinnacle \u2197SideUnderLine38Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 ProphetX \u2197SideUnderLine38Price-108Implied51.9%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 1xBet \u2197SideUnderLine38.5Price-125Implied55.6%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 FanDuel \u2197SideUnderLine38.5Price-115Implied53.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine38.5Price-117Implied53.9%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 MyBookie.ag \u2197SideUnderLine38.5Price-110Implied52.4%",
        "Seattle Seahawks at Tennessee Titans Total \u00b7 Novig \u2197SideUnderLine38.5Price-113Implied53.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 ProphetX \u2197SideUnderLine38.5Price-113Implied53.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine39.5Price-133Implied57.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine39.5Price-138Implied58.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine40.5Price-156Implied60.9%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine40.5Price-167Implied62.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine41.5Price-170Implied63.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine41.5Price-194Implied66.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine42.5Price-213Implied68.1%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine43.5Price-251Implied71.5%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine44.5Price-257Implied72.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine44.5Price-270Implied73.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine47.5Price-376Implied79.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine47.5Price-400Implied80.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine50.5Price-614Implied86.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine50.5Price-614Implied86.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine53.5Price-900Implied90.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine53.5Price-900Implied90.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine56.5Price-1567Implied94.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine56.5Price-24900Implied99.6%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Kalshi \u2197SideUnderLine59.5Price-2400Implied96.0%",
        "Seattle Seahawks at Tennessee Titans ALTTotal \u00b7 Novig \u2197SideUnderLine59.5Price-99900Implied99.9%"
      ],
      "scrollWidth": 375,
      "shown": 266,
      "title": "Live Titans market board",
      "total": 266,
      "viewport": 375
    },
    "rowGeometry": [
      {
        "height": 125,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 125,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 125,
        "left": 9,
        "right": 366,
        "width": 357
      },
      {
        "height": 125,
        "left": 9,
        "right": 366,
        "width": 357
      }
    ]
  },
  "browserWarnings": [],
  "durationSeconds": 2.8,
  "testedAt": "2026-08-23T11:21:14Z"
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
  "durationSeconds": 2.01,
  "testedAt": "2026-08-23T11:21:16Z"
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
  "durationSeconds": 2.42,
  "testedAt": "2026-08-23T11:21:19Z"
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
      "answer": "Tennessee is next scheduled to host Seattle Seahawks on Sun, Aug 23, 7:00 PM CDT (Nashville time).",
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
      "answer": "The next game is Sun, Aug 23, 7:00 PM CDT (Nashville time) and the loaded TV listing is FOX. Open Listen / Watch for your device-local time, Eastern time, Nashville time, UTC, radio, and territory-specific viewing guidance.",
      "facts": 2,
      "sources": 1,
      "why": "Broadcast rights vary by location, so the media center keeps viewing guidance separate by Nashville, elsewhere in the U.S., and international fans."
    }
  ],
  "teamTimeVerified": [
    "Who is next?",
    "How do I watch?"
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
    "width": 357
  },
  "browserWarnings": [],
  "durationSeconds": 1.45,
  "testedAt": "2026-08-23T11:21:21Z"
}```

## Change Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "detectedBeforeReview": 121,
  "categories": [
    "Roster",
    "Transaction"
  ],
  "favoritePriority": "Added to loaded roster",
  "rosterFilterVisible": 95,
  "clearedAfterReview": true,
  "mobileTargets": {
    "filters": [
      {
        "h": 48,
        "label": "All"
      },
      {
        "h": 48,
        "label": "Roster \u00b7 95"
      },
      {
        "h": 48,
        "label": "Transaction \u00b7 26"
      }
    ],
    "review": 48,
    "viewport": 375,
    "width": 357
  },
  "browserWarnings": [],
  "durationSeconds": 2.01,
  "testedAt": "2026-08-23T11:21:23Z"
}```

## Runtime / 365 Mode browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "phase": "preseason",
    "cards": 4,
    "runtimeVersion": "1.10.0",
    "teamTimeZone": "America/Chicago",
    "teamTimeLabel": "Nashville time",
    "routeCycle": true,
    "singlePanel": true,
    "cacheUrls": [
      "/api/data",
      "/api/fan-intel"
    ],
    "panel": {
      "cards": 4,
      "display": "block",
      "height": 344.390625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Seattle SeahawksSun, Aug 23, 7:00 PM CDT \u00b7 FOXWHAT CHANGED?Review team changesWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.ROSTERroster-moveWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "refresh": {
      "cache": [
        {
          "expiresAt": 1787484115330,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787484085330,
          "url": "/api/data"
        },
        {
          "expiresAt": 1787484115261,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787484085261,
          "url": "/api/fan-intel"
        }
      ],
      "epoch": 1,
      "last": {
        "at": "2026-08-23T11:21:25.165Z",
        "epoch": 1,
        "reason": "scoreboard-control",
        "urls": null
      }
    },
    "refreshedPanel": {
      "cards": 4,
      "display": "block",
      "height": 344.390625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Seattle SeahawksSun, Aug 23, 7:00 PM CDT \u00b7 FOXWHAT CHANGED?Review team changesWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.ROSTERroster-moveWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "returnPanel": {
      "cards": 4,
      "display": "block",
      "height": 344.390625,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Seattle SeahawksSun, Aug 23, 7:00 PM CDT \u00b7 FOXWHAT CHANGED?Review team changesWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.ROSTERroster-moveWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    }
  },
  "mobile": {
    "layout": {
      "dock": {
        "display": "grid",
        "h": 72,
        "w": 465,
        "x": 10,
        "y": 621
      },
      "dockTargets": [
        {
          "h": 58,
          "label": "Home",
          "w": 89.796875
        },
        {
          "h": 58,
          "label": "Roster",
          "w": 89.796875
        },
        {
          "h": 58,
          "label": "Game",
          "w": 89.796875
        },
        {
          "h": 58,
          "label": "Search",
          "w": 89.796875
        },
        {
          "h": 58,
          "label": "More",
          "w": 89.8125
        }
      ],
      "menu": {
        "display": "grid",
        "h": 46,
        "w": 46,
        "x": 10,
        "y": 8
      },
      "overflow": false,
      "panelHeight": 765.171875,
      "panelWidth": 461,
      "reviewHeight": 48,
      "targets": [
        {
          "h": 112,
          "label": "NEXT GAME",
          "w": 427
        },
        {
          "h": 122.9375,
          "label": "WHAT CHANGED?",
          "w": 427
        },
        {
          "h": 122.9375,
          "label": "ROSTER",
          "w": 427
        },
        {
          "h": 112,
          "label": "AVAILABILITY",
          "w": 427
        }
      ],
      "viewport": 500
    },
    "panelState": {
      "cards": 4,
      "display": "block",
      "height": 765.171875,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Seattle SeahawksSun, Aug 23, 7:00 PM CDT \u00b7 FOXWHAT CHANGED?Review team changesWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.ROSTERroster-moveWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 461
    },
    "sheet": {
      "bottom": 611,
      "dockTop": 621,
      "height": 504.71875,
      "links": 13,
      "top": 106.28125
    },
    "smartSearch": {
      "height": 110,
      "left": 10,
      "right": 475,
      "rows": 1,
      "targets": [
        58
      ],
      "width": 465
    }
  },
  "browserWarnings": [],
  "durationSeconds": 3.43
}```

## Data freshness browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "detail": "Roster 10 hours ago \u00b7 Moves 4 days ago \u00b7 Intel 5 days ago",
    "overflow": false,
    "rect": {
      "bottom": 2726.171875,
      "height": 132.03125,
      "left": 915.328125,
      "right": 1216.984375,
      "top": 2594.140625,
      "width": 301.65625
    },
    "state": "recent",
    "strong": "Recent server snapshot",
    "text": "DATA FRESHNESSRecent server snapshotRoster 10 hours ago \u00b7 Moves 4 days ago \u00b7 Intel 5 days agoSee sources \u2192",
    "title": "The loaded roster snapshot was captured within the last 48 hours.",
    "viewport": {
      "height": 757,
      "width": 1280
    }
  },
  "mobile": {
    "detail": "Roster 10 hours ago \u00b7 Moves 4 days ago \u00b7 Intel 5 days ago",
    "overflow": false,
    "rect": {
      "bottom": 5454.359375,
      "height": 113.53125,
      "left": 9,
      "right": 366,
      "top": 5340.828125,
      "width": 357
    },
    "state": "recent",
    "strong": "Recent server snapshot",
    "text": "DATA FRESHNESSRecent server snapshotRoster 10 hours ago \u00b7 Moves 4 days ago \u00b7 Intel 5 days agoSee sources \u2192",
    "title": "The loaded roster snapshot was captured within the last 48 hours.",
    "viewport": {
      "height": 701,
      "width": 390
    }
  },
  "browserWarnings": [],
  "durationSeconds": 1.49,
  "testedAt": "2026-08-23T11:21:29Z"
}```

## Account / Guest browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "browserWarnings": [],
  "guest": {
    "accountGuest": true,
    "route": "#home",
    "text": "VIEWING AS GUESTNo account requiredSettings stay on this device.Sign in / Sign up"
  },
  "mobileShell": {
    "dock": {
      "h": 72,
      "top": 621,
      "w": 465
    },
    "more": {
      "bottom": 686,
      "h": 58,
      "top": 628,
      "w": 89.8125
    },
    "runtime": "1.10.0",
    "sidebarHidden": "true",
    "sidebarInert": true
  },
  "sheet": {
    "bottom": 611,
    "dockTop": 621,
    "top": 106.28125
  },
  "accountEntry": {
    "bottom": 290.53125,
    "h": 44,
    "parent": "sidebar",
    "top": 246.53125,
    "visibleBottom": 611,
    "visibleTop": 106.28125,
    "w": 390
  },
  "panel": {
    "bottom": 701,
    "h": 602.859375,
    "text": "\u00d7OPTIONAL ACCOUNTWelcome backEverything is still available as a guest. Sign in only if you want favorites and selected preferences to sync when account storage is available.Log inSign upEmailPasswordLog inContinue as guestGUEST DATAThese settings exist only on this device.Export this deviceImport backupReset this deviceReset clears favorite, alert, display, home-layout, and saved-media preferences from this device. Your account status is unaffected.",
    "vh": 701,
    "w": 485
  },
  "portabilityTools": {
    "exportHeight": 50,
    "exportLabel": "Export this device",
    "guest": true,
    "importHeight": 50,
    "importLabel": "Import backup",
    "resetHeight": 50,
    "resetLabel": "Reset this device"
  },
  "importPreview": {
    "applyHeight": 46,
    "favorite": null,
    "pending": {
      "accountEmail": "",
      "exportedAt": "2026-08-22T12:00:00Z",
      "keys": [
        "titans:v15MyTitans"
      ],
      "preferences": {
        "titans:v15MyTitans": {
          "favorite": "Browser Smoke"
        }
      },
      "scope": "guest-device"
    },
    "text": "READY TO RESTORE1 setting groupAug 22, 2026, 12:00 PM \u00b7 guest-deviceNothing has changed yet. Applying restores only recognized Titans preferences from this file.Apply imported settingsCancel"
  },
  "resetArmed": {
    "guest": true,
    "hash": "#home",
    "hint": "Tap Confirm reset again within 6 seconds.",
    "label": "Confirm reset"
  },
  "authOutage": {
    "guest": true,
    "text": "VIEWING AS GUESTNo account requiredSettings stay on this device.Sign in / Sign up"
  },
  "roster": {
    "route": "#roster",
    "text": "PersonnelRosterSearch the latest verified Titans roster by name, number, position, or unit.Roster \u00b7 updated 10 hours ago"
  },
  "durationSeconds": 1.79
}```

## Advanced analytics browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "seasonContext": {
    "bannerRole": "note",
    "bannerText": "2025 regular-season baselineNot 2026 performance. These metrics stay historical until completed 2026 regular-season play-by-play is available.",
    "bannerVisible": true,
    "dataSeason": "2025",
    "heading": "2025 advanced analytics baseline",
    "requestedSeason": "2026",
    "seasonFallback": "true"
  },
  "mobileSeasonContext": {
    "fallback": "true",
    "text": "2025 regular-season baselineNot 2026 performance. These metrics stay historical until completed 2026 regular-season play-by-play is available.",
    "visible": true
  },
  "metricCount": 4,
  "metricValues": [
    {
      "detail": "#30 of 32",
      "label": "Offensive EPA / play",
      "value": "-0.148"
    },
    {
      "detail": "#28 of 32",
      "label": "Defensive EPA / play allowed",
      "value": "+0.104"
    },
    {
      "detail": "#11 of 32",
      "label": "Pace",
      "value": "28.9 sec/play"
    },
    {
      "detail": "Latest loaded week: 18",
      "label": "Rest days",
      "value": "7 days"
    }
  ],
  "situationFields": [
    "Down & distance",
    "Field position",
    "Formation",
    "Personnel",
    "Score diff",
    "TEN EPA",
    "Time remaining"
  ],
  "initialPlayCards": 60,
  "offenseFilteredPlayCards": 39,
  "mobileMetricCount": 4,
  "browserWarnings": [],
  "durationSeconds": 1.54,
  "testedAt": "2026-08-23T11:21:33Z"
}```

## Player headshot browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "rosterCards": 95,
  "rosterDecoratedHeadshots": 81,
  "rosterLoadedHeadshots": 46,
  "statsPlayerRows": 96,
  "statsDecoratedHeadshots": 82,
  "statsLoadedHeadshots": 8,
  "mobileLoadedHeadshots": 22,
  "richPlayer": "Austin Schlottmann",
  "richPlayerHeadshotLoaded": true,
  "browserWarnings": [],
  "durationSeconds": 2.99,
  "testedAt": "2026-08-23T11:21:36Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
