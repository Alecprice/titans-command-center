# Cloudflare deployment status

- Status: **deployed + Ticket Center browser regression failure**
- Source commit: `f899befaaf7775df5d30debc35cf84fc99c033ec`
- Quality gate: success
- Cloudflare credentials available: true
- Source still current main: true
- Main SHA observed before deploy: `f899befaaf7775df5d30debc35cf84fc99c033ec`
- Neon warehouse deployment secret required: false (D1 primary)
- YouTube Data API configured: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
- Deploy outcome: success
- Canonical front door: success
- Production regression: success
- Browser navigation regression: success
- Listen Watch browser regression: success
- Market Pulse browser regression: success
- Ticket Center browser regression: failure
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Production URL: https://titans.alecjprice.com
- Rollback Worker URL: https://titans-command-center.alecjordanprice.workers.dev
- Recorded: 2026-09-02T17:45:01Z

## Canonical front door regression

```json
{
  "ok": true,
  "canonical": "https://titans.alecjprice.com",
  "origin": "https://titans-command-center.alecjordanprice.workers.dev",
  "deployedCommit": "f899befaaf7775df5d30debc35cf84fc99c033ec",
  "version": "1.0.0",
  "revisionAttempts": 1,
  "shellPropagationAttempts": 1,
  "shellPaths": [
    "/",
    "/index.html",
    "/sw.js",
    "/app.js",
    "/tickets-price-fallback-v58.js",
    "/tickets-tenx-v123.js",
    "/tickets-compare-v125.js",
    "/tickets-compare-cache-bridge-v141.js"
  ],
  "shellCacheControl": {
    "/": {
      "canonical": "no-store, max-age=0, must-revalidate",
      "origin": "no-store, max-age=0, must-revalidate"
    },
    "/index.html": {
      "canonical": "no-store, max-age=0, must-revalidate",
      "origin": "no-store, max-age=0, must-revalidate"
    },
    "/sw.js": {
      "canonical": "public, max-age=0, must-revalidate, no-store, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate, no-store, max-age=0, must-revalidate"
    },
    "/app.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    },
    "/tickets-price-fallback-v58.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    },
    "/tickets-tenx-v123.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    },
    "/tickets-compare-v125.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    },
    "/tickets-compare-cache-bridge-v141.js": {
      "canonical": "public, max-age=0, must-revalidate",
      "origin": "public, max-age=0, must-revalidate"
    }
  },
  "cloudFront": {
    "requestId": "iII3TsU_e79xKK5iBpdIVaDN-tgAPnnefIPWkdqd2MGBCNn2rKnQ4g==",
    "pop": "IAD55-P2",
    "via": "1.1 f338f1f5c997eee01a37834445ee4740.cloudfront.net (CloudFront)",
    "cache": "Miss from cloudfront"
  },
  "canonicalSecurity": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com https://i.ytimg.com https://d1plawd8huk6hh.cloudfront.net; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "",
    "csp": true
  },
  "originRobots": "noindex, nofollow",
  "health": {
    "status": "healthy",
    "databaseProvider": "cloudflare-d1",
    "databaseConfigured": true,
    "snapshotFresh": true
  },
  "responseMs": {
    "canonicalMeta": 298,
    "originMeta": 212,
    "canonicalRoot": 75,
    "originRoot": 74,
    "health": 512
  },
  "testedAt": "2026-09-02T17:43:58.770Z"
}```

## Production regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "rootStatus": 200,
  "securityHeaders": {
    "contentTypeOptions": "nosniff",
    "frameOptions": "DENY",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "contentSecurityPolicy": "default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://static.clubs.nfl.com https://static.www.nfl.com https://static.nfl.com https://a.espncdn.com https://a1.espncdn.com https://i.ytimg.com https://d1plawd8huk6hh.cloudfront.net; connect-src 'self' https://api.sleeper.app; media-src 'self'; font-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    "robots": "",
    "csp": true
  },
  "manifestStatus": 200,
  "serviceWorkerStatus": 200,
  "serviceWorkerCache": "titans-cc-brand-2026-v82",
  "precachePaths": 140,
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
  "databaseProvider": "cloudflare-d1",
  "databaseConfigured": true,
  "databaseOk": true,
  "snapshotFresh": true,
  "dataMode": "audited-fallback",
  "databaseAvailable": false,
  "dataStatus": 200,
  "dataRosterCount": 61,
  "transactionCount": 7,
  "invalidTransactionDates": 0,
  "statsStatus": 200,
  "statsRosterCount": 61,
  "statsRosterMode": "d1-snapshot",
  "statsRosterSource": "Tennessee Titans official roster / transaction snapshot · Cloudflare D1",
  "completedPreseasonGamebooks": 3,
  "completedPreseasonGames": 3,
  "completedPreseasonGamesWithPlayerStats": 3,
  "completedPreseasonGamesMissingPlayerStats": 0,
  "marketStatus": 200,
  "marketRows": 0,
  "marketMode": "no-current-source",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "f899befaaf7775df5d30debc35cf84fc99c033ec",
    "builtAt": "2026-09-02T17:43:35.844Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 118,
    "health": 137,
    "data": 589,
    "stats": 342,
    "market": 207,
    "analytics": 327
  },
  "testedAt": "2026-09-02T17:44:17.845Z",
  "healthTruth": {
    "ok": true,
    "mode": "d1-snapshot",
    "status": 200,
    "healthStatus": "healthy",
    "contentAudit": "2026-08-31",
    "dataAudit": "2026-09-02",
    "databaseProvider": "cloudflare-d1",
    "snapshotFresh": true,
    "edgeCacheStatus": "HIT",
    "responseMs": 511,
    "testedAt": "2026-09-02T17:44:18.964Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans.alecjprice.com",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 260,
    "warmHitMs": 260,
    "rows": 0,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 260,
        "rows": 0
      }
    ],
    "testedAt": "2026-09-02T17:44:19.257Z"
  },
  "analyticsStatus": 200,
  "analyticsMode": "cloudflare-d1",
  "analyticsHealthStatus": "healthy",
  "analyticsDatabaseAvailable": true,
  "analyticsStorage": "cloudflare-d1",
  "analyticsSnapshotSource": "nflreadpy-d1-snapshot",
  "analyticsSnapshotStale": false,
  "analyticsDataSeason": 2025,
  "analyticsSeasonFallback": true,
  "analyticsWarehousePlays": 48771,
  "analyticsPersonnelPlays": 45184,
  "analyticsRecentPlays": 80,
  "analyticsPersonnelRows": 20,
  "analyticsOffensiveEpaPerPlay": -0.14842680811935152,
  "analyticsDefensiveEpaPerPlayAllowed": 0.10385631037224925,
  "analyticsPaceSecondsPerPlay": 28.914001158972834,
  "analyticsLatestRestDays": 7
}```

## Player headshot production regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "season": 2026,
  "generatedAt": "2026-09-02T15:18:26.534763+00:00",
  "rosterRows": 94,
  "headshotCount": 92,
  "coveragePct": 97.9,
  "omittedCount": 2,
  "omissionReasons": {
    "no-approved-headshot-url": 2
  },
  "omittedPlayers": [
    {
      "name": "Corey Mayfield Jr.",
      "number": "13",
      "position": "DB",
      "status": "CUT",
      "reason": "no-approved-headshot-url"
    },
    {
      "name": "Keydrain Calligan",
      "number": "29",
      "position": "DB",
      "status": "CUT",
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
  "durationMs": 172,
  "testedAt": "2026-09-02T17:44:19.860Z"
}```

## Browser navigation regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktopRounds": 3,
  "transactionChecks": 12,
  "mobileChecks": 14,
  "smallPhoneChecks": 2,
  "smartSearchQuickJump": true,
  "mobileDrawerInert": true,
  "fiveActionDock": true,
  "teamRoomChecks": 4,
  "rosterFilterReset": true,
  "rosterTotal": 61,
  "mobileTargets": [
    {
      "height": 56,
      "label": "Home",
      "width": 69.796875
    },
    {
      "height": 56,
      "label": "Roster",
      "width": 69.796875
    },
    {
      "height": 56,
      "label": "Game",
      "width": 69.796875
    },
    {
      "height": 56,
      "label": "Search",
      "width": 69.796875
    },
    {
      "height": 56,
      "label": "More",
      "width": 69.8125
    }
  ],
  "maxLongTaskMs": 77,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 17.05,
  "testedAt": "2026-09-02T17:44:41Z"
}```

## Listen Watch browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "shellLoadRetries": 0,
  "transientShellAssetFailures": 0,
  "territoryChecks": [
    "Elsewhere in U.S.",
    "International",
    "Nashville / Middle Tennessee"
  ],
  "quickStart": {
    "cards": 2,
    "labels": [
      "Watch Titans coverage: Set up your stream",
      "Listen to Titans coverage: Listen to Titans Radio"
    ],
    "listenHref": "https://www.tennesseetitans.com/broadcast/titans-radio/live-game-day-audio",
    "phase": "upcoming",
    "present": true,
    "result": "",
    "watchHref": "https://www.paramountplus.com/shows/nfl-on-cbs/"
  },
  "officialTitansAudio": true,
  "official1045Player": true,
  "rawEmbeddedAudio": false,
  "youtube": {
    "configured": true,
    "available": true,
    "videos": 10,
    "liveRightsExcluded": true,
    "lazyBeforePlay": true,
    "iframeAfterPlay": {
      "attempted": true,
      "fallback": false,
      "fallbackText": "",
      "iframe": true,
      "iframeApiScript": true,
      "iframeSrc": "https://www.youtube.com/embed/Cy9JY9m264c?autoplay=0&playsinline=1&rel=0&origin=https%3A%2F%2Ftitans.alecjprice.com&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Ftitans.alecjprice.com%2F%23media&aoriginsup=1&vf=1",
      "videoId": "Cy9JY9m264c"
    }
  },
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
  "mobileQuickStart": {
    "phase": "upcoming",
    "cards": 2,
    "targets": [
      186.34375,
      258.34375
    ],
    "labels": [
      "Watch Titans coverage: Set up your stream",
      "Listen to Titans coverage: Listen to Titans Radio"
    ]
  },
  "mobileYoutubeCards": 12,
  "browserWarnings": [
    {
      "level": "WARNING",
      "message": "https://www.youtube.com/s/player/e937390a/www-widgetapi.vflset/www-widgetapi.js 146 Unrecognized feature: 'web-share'.",
      "source": "other",
      "timestamp": 1788371085816
    }
  ],
  "durationSeconds": 4.49,
  "testedAt": "2026-09-02T17:44:46Z"
}```

## Market Pulse browser regression

```json
{
  "ok": true,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "initial": {
      "state": {
        "quality": "Unavailable",
        "provider": "No verified current market source",
        "shown": null,
        "total": 0,
        "renderedRows": 0
      },
      "summary": {
        "controls": [],
        "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
        "errorVisible": false,
        "overflow": false,
        "provider": "No verified current market source",
        "quality": "Unavailable",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "",
        "resultTotal": null,
        "rowCount": 0,
        "rowSample": [],
        "scrollWidth": 1265,
        "shown": null,
        "title": "Titans market status",
        "total": 0,
        "viewport": 1265
      }
    },
    "refresh": {
      "state": {
        "quality": "Unavailable",
        "provider": "No verified current market source",
        "shown": null,
        "total": 0,
        "renderedRows": 0
      },
      "summary": {
        "controls": [],
        "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
        "errorVisible": false,
        "overflow": false,
        "provider": "No verified current market source",
        "quality": "Unavailable",
        "referenceNotice": "",
        "refreshHeight": 44,
        "result": "",
        "resultTotal": null,
        "rowCount": 0,
        "rowSample": [],
        "scrollWidth": 1265,
        "shown": null,
        "title": "Titans market status",
        "total": 0,
        "viewport": 1265
      }
    }
  },
  "mobile": {
    "state": {
      "quality": "Unavailable",
      "provider": "No verified current market source",
      "shown": null,
      "total": 0,
      "renderedRows": 0
    },
    "summary": {
      "controls": [],
      "empty": "No market rows match these filters. Try another game or sportsbook, show alternate lines, or switch the market type.",
      "errorVisible": false,
      "overflow": false,
      "provider": "No verified current market source",
      "quality": "Unavailable",
      "referenceNotice": "",
      "refreshHeight": 44,
      "result": "",
      "resultTotal": null,
      "rowCount": 0,
      "rowSample": [],
      "scrollWidth": 375,
      "shown": null,
      "title": "Titans market status",
      "total": 0,
      "viewport": 375
    },
    "rowGeometry": []
  },
  "browserWarnings": [],
  "durationSeconds": 2.49,
  "testedAt": "2026-09-02T17:44:49Z"
}```

## Ticket Center browser regression

```json
{
  "ok": false,
  "base": "https://titans.alecjprice.com",
  "desktop": {
    "state": {
      "mode": "comparison",
      "fallbackCards": 0,
      "comparisonCards": 16
    },
    "summary": {
      "comparison": [
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-new-york-jets-nashville-tennessee-09-13-2026/event/1B006470D213F665"
          ],
          "right": 1217,
          "text": "CHEAPEST TITANS TICKET NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. New York Jets Sun, Sep 13, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 MARKETPLACE AVAILABLEVERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-philadelphia-eagles-nashville-tennessee-09-20-2026/event/1B006470D219F66B"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Philadelphia Eagles Sun, Sep 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/new-york-giants-vs-tennessee-titans-east-rutherford-new-jersey-09-27-2026/event/00006491C2E8E049"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS New York Giants vs. Tennessee Titans Sun, Sep 27, 1:00 PMMetLife Stadium \u00b7 East Rutherford \u00b7 NJ TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/baltimore-ravens-v-tennessee-titans-baltimore-maryland-10-04-2026/event/1500648DB7AD9D7D"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace TITANS1 SOURCE WITH OFFERS Baltimore Ravens v Tennessee Titans Sun, Oct 4, 1:00 PMM&T Bank Stadium \u00b7 Baltimore \u00b7 MD TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-houston-texans-nashville-tennessee-10-11-2026/event/1B006470D200F645"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Houston Texans Sun, Oct 11, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/indianapolis-colts-vs-tennessee-titans-indianapolis-indiana-10-18-2026/event/05006474BEDEA72C"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Indianapolis Colts vs. Tennessee Titans Sun, Oct 18, 1:00 PMLucas Oil Stadium \u00b7 Indianapolis \u00b7 IN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-cleveland-browns-nashville-tennessee-10-25-2026/event/1B006470D1F8F636"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Cleveland Browns Sun, Oct 25, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/cincinnati-bengals-vs-tennessee-titans-cincinnati-ohio-11-01-2026/event/16006469BBD893F2"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Cincinnati Bengals vs. Tennessee Titans Sun, Nov 1, 1:00 PMPaycor Stadium \u00b7 Cincinnati \u00b7 OH TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-jacksonville-jaguars-nashville-tennessee-11-15-2026/event/1B006470D20DF658"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Jacksonville Jaguars Sun, Nov 15, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/dallas-cowboys-vs-tennessee-titans-arlington-texas-11-22-2026/event/0C00646CBC939043"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Dallas Cowboys vs. Tennessee Titans Sun, Nov 22, 12:00 PMAT&T Stadium \u00b7 Arlington \u00b7 TX TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/jacksonville-jaguars-vs-tennessee-titans-jacksonville-florida-11-29-2026/event/2200646A920D4DA3"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Jacksonville Jaguars vs. Tennessee Titans Sun, Nov 29, 4:05 PMEverBank Stadium \u00b7 Jacksonville \u00b7 FL TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-washington-commanders-nashville-tennessee-12-06-2026/event/1B006470D232F684"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Washington Commanders Sun, Dec 6, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/detroit-lions-vs-tennessee-titans-detroit-michigan-12-13-2026/event/080064718D7239E3"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Detroit Lions vs. Tennessee Titans Sun, Dec 13, 1:00 PMFord Field \u00b7 Detroit \u00b7 MI TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-indianapolis-colts-nashville-tennessee-12-20-2026/event/1B006470D206F655"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Indianapolis Colts Sun, Dec 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/las-vegas-raiders-vs-tennessee-titans-las-vegas-nevada-12-27-2026/event/1700646CC3A0C3A4"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Las Vegas Raiders vs. Tennessee Titans Sun, Dec 27, 1:05 PMAllegiant Stadium \u00b7 Las Vegas \u00b7 NV TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        },
        {
          "left": 292,
          "offers": [
            "https://www.ticketmaster.com/tennessee-titans-vs-pittsburgh-steelers-nashville-tennessee-01-03-2027/event/1B006470D21FF66E"
          ],
          "right": 1217,
          "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Pittsburgh Steelers Sun, Jan 3, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
        }
      ],
      "fallback": [],
      "filters": [
        {
          "height": 44,
          "pressed": "true",
          "value": "all",
          "width": 86.703125
        },
        {
          "height": 44,
          "pressed": "false",
          "value": "home",
          "width": 63.34375
        },
        {
          "height": 44,
          "pressed": "false",
          "value": "away",
          "width": 61.140625
        }
      ],
      "heading": "Titans Ticket Finder",
      "mode": "comparison",
      "offline": false,
      "overflow": false,
      "refreshHeight": 44,
      "scrollWidth": 1265,
      "upcoming": false,
      "viewport": 1265
    }
  },
  "mobile": {},
  "browserWarnings": [],
  "stage": "desktop:tenx-compare",
  "error": "TimeoutException: Message: \n",
  "state": {
    "comparison": [
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/tennessee-titans-vs-new-york-jets-nashville-tennessee-09-13-2026/event/1B006470D213F665"
        ],
        "right": 1217,
        "text": "CHEAPEST TITANS TICKET NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. New York Jets Sun, Sep 13, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 MARKETPLACE AVAILABLEVERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySaved \u2713"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/tennessee-titans-vs-philadelphia-eagles-nashville-tennessee-09-20-2026/event/1B006470D219F66B"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Philadelphia Eagles Sun, Sep 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySaved \u2713"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/new-york-giants-vs-tennessee-titans-east-rutherford-new-jersey-09-27-2026/event/00006491C2E8E049"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS New York Giants vs. Tennessee Titans Sun, Sep 27, 1:00 PMMetLife Stadium \u00b7 East Rutherford \u00b7 NJ TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/baltimore-ravens-v-tennessee-titans-baltimore-maryland-10-04-2026/event/1500648DB7AD9D7D"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace TITANS1 SOURCE WITH OFFERS Baltimore Ravens v Tennessee Titans Sun, Oct 4, 1:00 PMM&T Bank Stadium \u00b7 Baltimore \u00b7 MD TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/tennessee-titans-vs-houston-texans-nashville-tennessee-10-11-2026/event/1B006470D200F645"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Houston Texans Sun, Oct 11, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/indianapolis-colts-vs-tennessee-titans-indianapolis-indiana-10-18-2026/event/05006474BEDEA72C"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Indianapolis Colts vs. Tennessee Titans Sun, Oct 18, 1:00 PMLucas Oil Stadium \u00b7 Indianapolis \u00b7 IN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/tennessee-titans-vs-cleveland-browns-nashville-tennessee-10-25-2026/event/1B006470D1F8F636"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Cleveland Browns Sun, Oct 25, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/cincinnati-bengals-vs-tennessee-titans-cincinnati-ohio-11-01-2026/event/16006469BBD893F2"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Cincinnati Bengals vs. Tennessee Titans Sun, Nov 1, 1:00 PMPaycor Stadium \u00b7 Cincinnati \u00b7 OH TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/tennessee-titans-vs-jacksonville-jaguars-nashville-tennessee-11-15-2026/event/1B006470D20DF658"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Jacksonville Jaguars Sun, Nov 15, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/dallas-cowboys-vs-tennessee-titans-arlington-texas-11-22-2026/event/0C00646CBC939043"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Dallas Cowboys vs. Tennessee Titans Sun, Nov 22, 12:00 PMAT&T Stadium \u00b7 Arlington \u00b7 TX TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/jacksonville-jaguars-vs-tennessee-titans-jacksonville-florida-11-29-2026/event/2200646A920D4DA3"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Jacksonville Jaguars vs. Tennessee Titans Sun, Nov 29, 4:05 PMEverBank Stadium \u00b7 Jacksonville \u00b7 FL TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/tennessee-titans-vs-washington-commanders-nashville-tennessee-12-06-2026/event/1B006470D232F684"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Washington Commanders Sun, Dec 6, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/detroit-lions-vs-tennessee-titans-detroit-michigan-12-13-2026/event/080064718D7239E3"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Detroit Lions vs. Tennessee Titans Sun, Dec 13, 1:00 PMFord Field \u00b7 Detroit \u00b7 MI TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/tennessee-titans-vs-indianapolis-colts-nashville-tennessee-12-20-2026/event/1B006470D206F655"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Indianapolis Colts Sun, Dec 20, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/las-vegas-raiders-vs-tennessee-titans-las-vegas-nevada-12-27-2026/event/1700646CC3A0C3A4"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace AWAY1 SOURCE WITH OFFERS Las Vegas Raiders vs. Tennessee Titans Sun, Dec 27, 1:05 PMAllegiant Stadium \u00b7 Las Vegas \u00b7 NV TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      },
      {
        "left": 292,
        "offers": [
          "https://www.ticketmaster.com/tennessee-titans-vs-pittsburgh-steelers-nashville-tennessee-01-03-2027/event/1B006470D21FF66E"
        ],
        "right": 1217,
        "text": "CHEAPEST NOWCheck live pricevia TicketmasterLive price pending \u00b7 open marketplace HOME1 SOURCE WITH OFFERS Tennessee Titans vs. Pittsburgh Steelers Sun, Jan 3, 12:00 PMNissan Stadium \u00b7 Nashville \u00b7 TN TicketmasterMarketplace inventory Check live priceCHECK LIVE View \u2197 VERIFY LIVEOnly one usable starting-price source is visibleOpen a marketplace to check current price and inventorySave matchup"
      }
    ],
    "fallback": [],
    "filters": [
      {
        "height": 44,
        "pressed": "true",
        "value": "all",
        "width": 86.703125
      },
      {
        "height": 44,
        "pressed": "false",
        "value": "home",
        "width": 63.34375
      },
      {
        "height": 44,
        "pressed": "false",
        "value": "away",
        "width": 61.140625
      }
    ],
    "heading": "Titans Ticket Finder",
    "mode": "comparison",
    "offline": false,
    "overflow": false,
    "refreshHeight": 44,
    "scrollWidth": 1265,
    "upcoming": false,
    "viewport": 1265
  },
  "durationSeconds": 10.91,
  "testedAt": "2026-09-02T17:45:00Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
