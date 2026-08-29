# Cloudflare deployment status

- Status: **deployed + full production + browser + media + market + command intelligence + player intelligence + game day + Ask Titans + change intelligence + 365 mode + freshness + account + analytics + player headshot regressions passed**
- Source commit: `5d9be4d5623b8e6b546c4e9750b41aee462cd9ff`
- Quality gate: success
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Ticket providers configured: SeatGeek=false, Ticketmaster=false, StubHub=false
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
- Recorded: 2026-08-29T01:12:32Z

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
  "serviceWorkerCache": "titans-cc-brand-2026-v75",
  "precachePaths": 128,
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
  "marketRows": 0,
  "marketMode": "no-current-source",
  "buildMeta": {
    "app": "titans-command-center",
    "version": "1.0.0",
    "commit": "5d9be4d5623b8e6b546c4e9750b41aee462cd9ff",
    "builtAt": "2026-08-29T01:11:07.883Z"
  },
  "deploymentPropagationAttempts": 1,
  "responseMs": {
    "root": 43,
    "health": 202,
    "data": 139,
    "stats": 148,
    "market": 7361,
    "analytics": 328
  },
  "testedAt": "2026-08-29T01:11:40.080Z",
  "healthTruth": {
    "ok": true,
    "status": 200,
    "contentAudit": "2026-08-26",
    "databaseContentAudit": "2026-08-26",
    "responseMs": 192,
    "testedAt": "2026-08-29T01:11:40.310Z"
  },
  "marketEdgeCache": {
    "ok": true,
    "base": "https://titans-command-center.alecjordanprice.workers.dev",
    "initialStatus": "HIT",
    "finalStatus": "HIT",
    "attempts": 1,
    "coldOrInitialMs": 233,
    "warmHitMs": 233,
    "rows": 0,
    "sequence": [
      {
        "status": "HIT",
        "durationMs": 233,
        "rows": 0
      }
    ],
    "testedAt": "2026-08-29T01:11:40.604Z"
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
  "generatedAt": "2026-08-28T21:31:46.577091+00:00",
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
  "durationMs": 121,
  "testedAt": "2026-08-29T01:11:41.179Z"
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
  "rosterTotal": 95,
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
  "maxLongTaskMs": 74,
  "longTasksOver250ms": 0,
  "browserWarnings": [],
  "durationSeconds": 13.87,
  "testedAt": "2026-08-29T01:11:58Z"
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
  "durationSeconds": 2.15,
  "testedAt": "2026-08-29T01:12:01Z"
}```

## Market Pulse browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
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
  "durationSeconds": 1.74,
  "testedAt": "2026-08-29T01:12:03Z"
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
      "h": 44,
      "label": "Changes"
    },
    {
      "h": 44,
      "label": "Press Room"
    },
    {
      "h": 44,
      "label": "Scheme Lab"
    },
    {
      "h": 44,
      "label": "Global Fans"
    },
    {
      "h": 44,
      "label": "Stadium"
    },
    {
      "h": 44,
      "label": "Fan GM"
    },
    {
      "h": 44,
      "label": "Time Machine"
    }
  ],
  "mobileViewport": 375,
  "browserWarnings": [],
  "durationSeconds": 2.59,
  "testedAt": "2026-08-29T01:12:06Z"
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
      "h": 44,
      "label": "Overview"
    },
    {
      "h": 44,
      "label": "Game Log"
    },
    {
      "h": 44,
      "label": "Trends"
    },
    {
      "h": 44,
      "label": "Career + Contract"
    },
    {
      "h": 44,
      "label": "Timeline"
    }
  ],
  "playerHeadshotLoaded": true,
  "rosterEnhancementState": {
    "cutdownButtons": 1,
    "cutdownPanels": 1,
    "injuryBanners": 1,
    "switchers": 1
  },
  "cutdownCommand": true,
  "cutdownCommandText": "53-MAN CUTDOWN COMMAND\nFinal roster clock\n\nFacts from the loaded Titans roster and transaction feed. This does not rank bubble players or predict cuts.\n\nTIME REMAINING\n1d 20h\nSun, Aug 30, 6:00 PM EDT\nLoaded roster\n95\nAll current rows\nActive rows\n91\nLoaded status = Active\nReserve / other\n4\nNot counted as active rows here\nFinal active limit\n53\n38 loaded active rows above 53\nPOSITION SHAPE\nActive rows by position\nFull roster \u2192\n13\nWR\n9\nCB\n9\nLB\n8\nDE\n7\nRB\n7\nT\n6\nDT\n6\nG\n6\nS\n5\nTE\n4\nQB\n3\nC\n3\nDL\n2\nDB\n1\nK\n1\nLS\n1\nP\nMOVEMENT WIRE\nLatest loaded transactions\nAll moves \u2192\n2026-08-25\n\nWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.\n\n2026-08-24\n\nSigned LB Reid Carrico and placed LB Milo Eifler on injured reserve.\n\n2026-08-21\n\nWaived LB Sean Brown from injured reserve with an injury settlement; placed DB Nazeeh Johnson on injured reserve; waived TE Matt Lauter; signed free agents LB Milo Eifler and DE Tanoh Kpassagnon.\n\n2026-08-19\n\nWaived RB Dominic Richardson and signed free-agent RB D'Ernest Johnson.\n\n2026-08-17\n\nWaived injured LB Sean Brown and signed free-agent CB Corey Mayfield Jr.\n\n2026-08-16\n\nPlaced DE Jaylen Harrell and TE Jaren Kanak on injured reserve and signed free-agent TE Matt Lauter and RB Dominic Richardson.\n\nMY 53 \u00b7 FAN BOARD\nBuild your own Titans 53\n\nYour picks stay on this device. This is a fan roster exercise\u2014not an official roster projection or report.\n\n0 / 53\nClear picks\nNo fan picks yet.\nFIND PLAYER\nPOSITION\nAll positions\nC\nCB\nDB\nDE\nDL\nDT\nG\nK\nLB\nLS\nP\nQB\nRB\nS\nT\nTE\nWR\nSelected only\nShare / Copy My 53\n91 shown \u00b7 0 selected\nSelect players to see unit composition.\n#61\nAndre James\nC \u00b7 Offense\n+\n#51\nAustin Schlottmann\nC \u00b7 Offense\n+\n#79\nPat Coogan\nC \u00b7 Offense\n+\n#73\nCordell Volson\nG \u00b7 Offense\n+\n#67\nDrew Moss\nG \u00b7 Offense\n+\n#66\nFernando Carmona Jr.\nG \u00b7 Offense\n+\n#71\nGarrett Dellinger\nG \u00b7 Offense\n+\n#64\nJackson Slater\nG \u00b7 Offense\n+\n#77\nPeter Skoronski\nG \u00b7 Offense\n+\n#1\nCam Ward\nQB \u00b7 Offense\n+\n#16\nHendon Hooker\nQB \u00b7 Offense\n+\n#10\nMitchell Trubisky\nQB \u00b7 Offense\n+\n#8\nWill Levis\nQB \u00b7 Offense\n+\n#21\nD'Ernest Johnson\nRB \u00b7 Offense\n+\n#36\nJulius Chestnut\nRB \u00b7 Offense\n+\n#31\nKalel Mullings\nRB \u00b7 Offense\n+\n#35\nMichael Carter\nRB \u00b7 Offense\n+\n#32\nNicholas Singleton\nRB \u00b7 Offense\n+\n#20\nTony Pollard\nRB \u00b7 Offense\n+\n#2\nTyjae Spears\nRB \u00b7 Offense\n+\n#69\nAamil Wagner\nT \u00b7 Offense\n+\n#76\nAustin Deculus\nT \u00b7 Offense\n+\n#78\nBrandon Crenshaw-Dickson\nT \u00b7 Offense\n+\n#75\nDan Moore Jr.\nT \u00b7 Offense\n+\n#55\nJC Latham\nT \u00b7 Offense\n+\n#62\nRasheed Miller\nT \u00b7 Offense\n+\n#72\nZachary Thomas\nT \u00b7 Offense\n+\n#82\nDaniel Bellinger\nTE \u00b7 Offense\n+\n#88\nDa",
  "cutdownMobileTargets": [
    {
      "h": 48,
      "label": "Full roster \u2192"
    },
    {
      "h": 48,
      "label": "All moves \u2192"
    },
    {
      "h": 48,
      "label": "NFL roster deadline \u2197"
    },
    {
      "h": 48,
      "label": "Official Titans transactions \u2197"
    }
  ],
  "my53Interaction": {
    "before": {
      "count": "0 / 53",
      "key": "86088925-3ab1-4187-9e62-c3c7acdf89c1",
      "pressed": "false"
    },
    "added": {
      "count": "1 / 53",
      "note": "Pick saved on this device.",
      "pressed": "true",
      "stored": 1
    },
    "removed": {
      "count": "0 / 53",
      "note": "Pick removed. Your fan board stays on this device.",
      "stored": 0
    }
  },
  "my53MobileTargets": [
    {
      "h": 48,
      "label": "Clear picks"
    },
    {
      "h": 48,
      "label": "Selected only"
    },
    {
      "h": 48,
      "label": "Share / Copy My 53"
    },
    {
      "h": 56.6875,
      "label": "#61Andre JamesC \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#51Austin SchlottmannC \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#79Pat CooganC \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#73Cordell VolsonG \u00b7 Offense+"
    },
    {
      "h": 56.6875,
      "label": "#67Drew MossG \u00b7 Offense+"
    }
  ],
  "gameDayPhase": "pregame",
  "gameDayTuneLink": true,
  "gameDayMobileViewport": 375,
  "gameDayFastPass": true,
  "gameDayFastPassGameId": "c294d349-dc5a-4f82-a796-f82cac0fd776",
  "gameDayFastPassText": "NEXT GAME FAST PASS\nChicago Bears at Titans\nPRESEASON 3\nWHEN\nSat, Aug 29, 5:00 PM CDT \u00b7 20h 47m\nWATCH / LISTEN\nNFL Network / WKRN-TV News 2 (regional) \u00b7 WGFX 104.5 FM The Zone\nWHERE\nHome \u00b7 Nissan Stadium\nOpen Listen / Watch\nOfficial schedule \u2197\nStadium guide \u2197\nSchedule facts: TennesseeTitans.com",
  "gameDayFastPassMobileTargets": [
    {
      "h": 48,
      "label": "Open Listen / Watch"
    },
    {
      "h": 48,
      "label": "Official schedule \u2197"
    },
    {
      "h": 48,
      "label": "Stadium guide \u2197"
    }
  ],
  "browserWarnings": [],
  "durationSeconds": 4.73,
  "testedAt": "2026-08-29T01:12:11Z"
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
      "answer": "Tennessee is next scheduled to host Chicago Bears on Sat, Aug 29, 5:00 PM CDT (Nashville time).",
      "facts": 4,
      "sources": 1,
      "why": "That is the next non-final, non-bye game in the loaded Titans schedule. NFL Network / WKRN-TV News 2 (regional) is the listed network."
    },
    {
      "question": "Cam Ward",
      "action": "#player?id=cb885a93-e510-4a22-8834-78fc4b32a54b",
      "answer": "Cam Ward is listed as QB #1 with roster status Active.",
      "facts": 6,
      "sources": 2,
      "why": "I found structured player-game rows for 2 recent loaded stat groups. The numbers below are sums of loaded numeric fields only, not a film grade."
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
      "answer": "The next game is Sat, Aug 29, 5:00 PM CDT (Nashville time) and the loaded TV listing is NFL Network / WKRN-TV News 2 (regional). Open Listen / Watch for your device-local time, Eastern time, Nashville time, UTC, radio, and territory-specific viewing guidance.",
      "facts": 2,
      "sources": 1,
      "why": "Broadcast rights vary by location, so the media center keeps viewing guidance separate by Nashville, elsewhere in the U.S., and international fans."
    }
  ],
  "teamTimeVerified": [
    "Who is next?",
    "How do I watch?"
  ],
  "fantasyHandoff": {
    "actionHeight": 46,
    "href": "#fantasy",
    "text": "FANTASY HANDOFFEvidence workspaceUse Fantasy Decision Center for this one.WHY IT MATTERSStart/sit and waiver choices depend on league context. Command Center will carry this question into the fantasy workspace and compare loaded evidence without inventing a point projection or guarantee.Scoring presetPPRSleeper leagueNot connectedSaved fantasy players2SOURCE + CONTEXTFantasy CommandDevice-local scoring, roster selections and read-only Sleeper context when connectedNo projection generatedOpen Decision Center \u2192",
    "title": "Use Fantasy Decision Center for this one."
  },
  "fantasyCarried": {
    "hash": "#fantasy",
    "selected": [
      "Decision Smoke A \u00b7 WR \u00b7 TEN",
      "Decision Smoke B \u00b7 RB \u00b7 IND"
    ],
    "values": [
      "manual:0",
      "manual:1"
    ],
    "verdict": "Evidence leans Decision Smoke A, but this is not a point projection or guarantee."
  },
  "unsupportedRefused": true,
  "mobileTargets": {
    "askButton": 44,
    "input": 44,
    "quick": [
      {
        "h": 44,
        "label": "What changed?"
      },
      {
        "h": 44,
        "label": "Who is next?"
      },
      {
        "h": 44,
        "label": "Injuries"
      },
      {
        "h": 44,
        "label": "Watch"
      },
      {
        "h": 44,
        "label": "Cam Ward"
      },
      {
        "h": 44,
        "label": "Explain EPA"
      }
    ],
    "viewport": 375,
    "width": 357
  },
  "mobileFantasyHandoff": {
    "actionHeight": 46,
    "left": 24,
    "overflow": false,
    "right": 351,
    "viewport": 375
  },
  "browserWarnings": [],
  "durationSeconds": 1.83,
  "testedAt": "2026-08-29T01:12:13Z"
}```

## Change Intelligence browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "detectedBeforeReview": 137,
  "categories": [
    "Roster",
    "Transaction",
    "Depth chart"
  ],
  "favoritePriority": "Added to loaded roster",
  "rosterFilterVisible": 95,
  "clearedAfterReview": true,
  "mobileTargets": {
    "filters": [
      {
        "h": 44,
        "label": "All"
      },
      {
        "h": 44,
        "label": "Roster \u00b7 95"
      },
      {
        "h": 44,
        "label": "Transaction \u00b7 29"
      },
      {
        "h": 44,
        "label": "Depth chart \u00b7 13"
      }
    ],
    "review": 44,
    "viewport": 375,
    "width": 359.28125
  },
  "browserWarnings": [],
  "durationSeconds": 3.41,
  "testedAt": "2026-08-29T01:12:17Z"
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
      "/api/fan-intel",
      "/api/social-pulse",
      "/api/tickets"
    ],
    "panel": {
      "cards": 4,
      "display": "block",
      "height": 406.296875,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL Network / WKRN-TV News 2 (regional)WHAT CHANGED?13 depth changes loadedWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.ROSTERroster-moveWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "refresh": {
      "cache": [
        {
          "expiresAt": 1787965969245,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787965939245,
          "url": "/api/data"
        },
        {
          "expiresAt": 1787965969214,
          "hasValue": true,
          "inflight": false,
          "updatedAt": 1787965939214,
          "url": "/api/fan-intel"
        }
      ],
      "epoch": 1,
      "last": {
        "at": "2026-08-29T01:12:19.109Z",
        "epoch": 1,
        "reason": "scoreboard-control",
        "urls": null
      }
    },
    "refreshedPanel": {
      "cards": 4,
      "display": "block",
      "height": 406.296875,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL Network / WKRN-TV News 2 (regional)WHAT CHANGED?13 depth changes loadedWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.ROSTERroster-moveWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 925
    },
    "returnPanel": {
      "cards": 4,
      "display": "block",
      "height": 406.296875,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL Network / WKRN-TV News 2 (regional)WHAT CHANGED?13 depth changes loadedWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.ROSTERroster-moveWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
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
      "panelHeight": 823.859375,
      "panelWidth": 461,
      "reviewHeight": 48,
      "targets": [
        {
          "h": 124.4375,
          "label": "NEXT GAME",
          "w": 427
        },
        {
          "h": 145.3125,
          "label": "WHAT CHANGED?",
          "w": 427
        },
        {
          "h": 145.3125,
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
      "height": 823.859375,
      "opacity": "1",
      "text": "365 MODE \u00b7 PRESEASONRoster decisions are the storyNext game, position battles, depth changes and roster movement matter more than standings.Review changes \u2192NEXT GAMEvs Chicago BearsSat, Aug 29, 5:00 PM CDT \u00b7 NFL Network / WKRN-TV News 2 (regional)WHAT CHANGED?13 depth changes loadedWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.ROSTERroster-moveWaived/injured LB Dominique Hampton; signed free agent LB Dyontae Johnson; waived S Sanoussi Kane from injured reserve.AVAILABILITYWeekly report not loadedMissing report data is not treated as an all-clear.Command Center mode adapts to the football calendar; it does not claim an official league transaction window.",
      "visibility": "visible",
      "visible": true,
      "width": 461
    },
    "sheet": {
      "bottom": 611,
      "dockTop": 621,
      "height": 504.71875,
      "links": 15,
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
  "durationSeconds": 3.96
}```

## Data freshness browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "desktop": {
    "detail": "Roster 2 days ago \u00b7 Moves 4 days ago \u00b7 Intel 4 days ago",
    "overflow": false,
    "rect": {
      "bottom": 1312.375,
      "height": 155.765625,
      "left": 915.328125,
      "right": 1216.984375,
      "top": 1156.609375,
      "width": 301.65625
    },
    "state": "stale",
    "strong": "Roster snapshot needs review",
    "text": "DATA FRESHNESSRoster snapshot needs reviewRoster 2 days ago \u00b7 Moves 4 days ago \u00b7 Intel 4 days agoSee sources \u2192",
    "title": "The loaded roster snapshot is more than 48 hours old. Open Sources before treating it as current.",
    "viewport": {
      "height": 757,
      "width": 1280
    }
  },
  "mobile": {
    "detail": "Roster 2 days ago \u00b7 Moves 4 days ago \u00b7 Intel 4 days ago",
    "overflow": false,
    "rect": {
      "bottom": 2356.453125,
      "height": 117.1875,
      "left": 9,
      "right": 366,
      "top": 2239.265625,
      "width": 357
    },
    "state": "stale",
    "strong": "Roster snapshot needs review",
    "text": "DATA FRESHNESSRoster snapshot needs reviewRoster 2 days ago \u00b7 Moves 4 days ago \u00b7 Intel 4 days agoSee sources \u2192",
    "title": "The loaded roster snapshot is more than 48 hours old. Open Sources before treating it as current.",
    "viewport": {
      "height": 701,
      "width": 390
    }
  },
  "browserWarnings": [],
  "durationSeconds": 1.97,
  "testedAt": "2026-08-29T01:12:23Z"
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
    "text": "PersonnelRosterSearch the latest verified Titans roster by name, number, position, or unit.Roster \u00b7 updated 2 days agoRo"
  },
  "durationSeconds": 2.04
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
  "durationSeconds": 2.04,
  "testedAt": "2026-08-29T01:12:28Z"
}```

## Player headshot browser regression

```json
{
  "ok": true,
  "base": "https://titans-command-center.alecjordanprice.workers.dev",
  "rosterCards": 95,
  "rosterDecoratedHeadshots": 80,
  "rosterLoadedHeadshots": 39,
  "statsPlayerRows": 97,
  "statsDecoratedHeadshots": 81,
  "statsLoadedHeadshots": 47,
  "mobileLoadedHeadshots": 47,
  "richPlayer": "Austin Schlottmann",
  "richPlayerHeadshotLoaded": true,
  "browserWarnings": [],
  "durationSeconds": 3.35,
  "testedAt": "2026-08-29T01:12:31Z"
}```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
