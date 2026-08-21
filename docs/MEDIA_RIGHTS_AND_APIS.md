# Titans Command Center — Listen / Watch media architecture

Updated: 2026-08-21

## Goal

Give a Titans fan one simple place to answer:

- When does the game start in my timezone?
- Where can I listen legally?
- Where can I watch legally?
- What changes if I am in Nashville/Middle Tennessee versus elsewhere?

The product routes or plays authorized sources. It must not proxy, restream, decrypt, scrape, or bypass geographic, device, subscription, blackout, or DRM restrictions.

## Timezone rule

Every upcoming Titans broadcast should display:

- the fan's device-local kickoff time,
- Eastern Time (ET),
- Nashville/Central Time (CT),
- UTC,
- the actual seasonal abbreviation when available (EDT/CDT or EST/CST),
- a simple countdown.

This keeps the site useful for fans anywhere in the world while preserving familiar ET/CT references for U.S. fans.

## Nashville radio

### Official flagship

The Tennessee Titans' updated 2026 affiliate page identifies WGFX 104.5 The Zone as the Nashville flagship of Titans Radio.

Official references:

- https://www.tennesseetitans.com/broadcast/titans-radio/titans-radio-affiliates
- https://www.tennesseetitans.com/audio/live-game-broadcast-titans-radio-2026
- https://www.1045thezone.com/listen/
- https://player.1045thezone.com/

### Current in-app approach

The v1.4 media center may request the station's public digital stream directly from the station streaming provider in the fan's browser. Titans Command Center does not proxy, store, or rebroadcast the audio.

If playback is unavailable because of station policy, geo restrictions, game digital rights, browser support, or a station-side change, the UI directs the fan to the official 104.5 player and official Titans audio page.

Before any commercial/public launch at meaningful scale, confirm the station/streaming-provider terms permit direct third-party client playback. If not, disable the inline audio element and retain official deep links unless an approved integration is obtained.

### Terrestrial AM/FM

A website cannot tune a physical AM/FM receiver on iPhone. The site can show the closest known Titans Radio affiliate and its frequency, but actual terrestrial reception occurs in the user's radio hardware.

## All Titans games — licensed audio

### NFL+

NFL+ currently advertises live home, away, and national audio for every NFL game of the season.

- https://www.nfl.com/plus/learn-more

Best current integration: service/game deep link. True embedded playback would require an NFL-supported authenticated media integration or rights agreement.

### TuneIn Premium

The official Titans watch/listen guide identifies TuneIn Premium for the live local Titans call during the season.

- https://www.tennesseetitans.com/watch-live-games/ways-to-watch

Best current integration: deep link. In-app controls would require TuneIn-supported partner/API rights.

### SiriusXM

SiriusXM is an NFL-authorized play-by-play distributor.

- https://www.siriusxm.com/sports/nfl

Best current integration: deep link. In-app playback requires supported authentication/partner integration.

### Westwood One

The official Titans guide also points fans to Westwood One for national primetime and postseason audio where carried.

Best current integration: service/station deep link.

## Watch architecture

There is no normal public developer API that legally hands an unaffiliated third-party website the raw live NFL game video stream. Live NFL video is governed by broadcaster rights, authentication, DRM, market rules, subscription rules, and device rules.

The correct architecture is a **watch-rights router**:

1. Read the scheduled Titans game and network from verified schedule data.
2. Use the fan's selected market mode plus device-local timezone.
3. Show the game date/time prominently.
4. Explain the likely legal viewing path in plain language.
5. Deep-link to the authorized provider.
6. State clearly when local-market, subscription, device, or blackout restrictions can change availability.

## Core U.S. provider mapping

Based on current Titans/NFL guidance:

- CBS -> local CBS / Paramount+ where the live local CBS game is available.
- FOX -> local FOX / FOX Sports with supported access.
- NBC -> NBC / Peacock for applicable NBC games.
- ESPN / ABC -> ESPN watch options for applicable games.
- Thursday Night Football -> Prime Video.
- NFL Network -> NFL Network / NFL+ according to plan/device.
- Netflix-carried NFL games -> Netflix.
- Out-of-market Sunday afternoon -> NFL Sunday Ticket on YouTube / YouTube TV where eligible.
- NFL+ -> live local and primetime games on supported mobile/tablet devices, plus live audio.
- Titans preseason local-market streams -> official Titans app/TennesseeTitans.com when the club makes the stream available; the Nashville preseason TV flagship is WKRN-News 2 for applicable regional games.

Official references:

- https://www.tennesseetitans.com/watch-live-games/ways-to-watch
- https://www.nfl.com/ways-to-watch

## Global fans

The site should not assume U.S. rights apply worldwide. International NFL distribution varies by country and season.

For global use:

1. always show device-local kickoff time + ET + CT + UTC;
2. show U.S. network as schedule context;
3. show a generic NFL official watch guide when a country-specific provider is not verified;
4. never claim a U.S. provider is available globally;
5. add country-aware rights data only from a licensed source or current official NFL country guidance.

## APIs/data sources for a higher-end rights router

### Sportradar NFL API

Potential use:

- schedule metadata,
- game identifiers,
- live game state,
- richer event metadata depending on contracted package.

Use only under the licensed plan and redistribution terms negotiated for the product.

### SportsDataIO NFL API

Potential use:

- schedules,
- broadcast-channel metadata,
- game status,
- team/player data,
- additional feed enrichment depending on subscription.

Use only under the service's licensing/redistribution terms.

### Gracenote / Nielsen metadata

Potential use:

- television listings,
- channel/service availability,
- local market lineup resolution,
- program-to-station mapping.

This is the strongest class of data for a true market-aware 'where can I watch?' product, but it is commercial/licensed data rather than a free public API.

### YouTube Data API + IFrame Player API

Good use:

- official Titans/NFL highlights,
- press conferences,
- studio shows,
- trailers and other videos whose rights holder permits embedding.

Not a path to live NFL game video unless the rights holder itself publishes an embeddable authorized stream.

## What would be required for true in-app live NFL video

A normal API key is not enough. A true in-app live-game player would generally require:

- a commercial media-rights agreement with the NFL and/or applicable broadcaster/distributor,
- authentication/entitlement handling,
- DRM integration (for example Widevine/FairPlay/PlayReady depending on platform),
- geo/market enforcement,
- device restrictions,
- blackout enforcement,
- concurrency/session controls,
- analytics/reporting required by the rights holder,
- content security and anti-piracy requirements.

Until those rights exist, Titans Command Center should remain a premium discovery/router experience rather than pretending to be the video distributor.
