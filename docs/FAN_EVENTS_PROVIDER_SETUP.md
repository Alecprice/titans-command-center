# Fan Event Radar provider setup

Titans Command Center keeps event-provider credentials on the server. Never paste real API credentials into a browser module, `.env.example`, GitHub issue, pull request, or committed config file.

## Runtime surface

- Fan Hub surface: **Nashville Event Radar**
- Same-origin API: `GET /api/fan-events`
- Public query parameters: rejected
- Default scope: Nashville, Tennessee · 25 miles · next 30 days
- Browser/runtime cache: 10 minutes
- Response cache policy: 10 minutes with 30-minute stale-while-revalidate
- No scheduled event-provider polling or cron job

The endpoint normalizes provider payloads into one event shape and isolates provider failures so one unavailable service does not break Fan Hub.

## Cloudflare Worker secrets

From a local checkout authenticated to the correct Cloudflare account:

```bash
npx wrangler@4 secret put EVENTBRITE_PRIVATE_TOKEN
npx wrangler@4 secret put BANDSINTOWN_API_KEY
npx wrangler@4 secret put BANDSINTOWN_ARTISTS
```

`BANDSINTOWN_ARTISTS` is a comma-separated list of exact approved/canonical artist names. Keep this list small and tied to the access granted for the key.

The existing `TICKETMASTER_API_KEY`, when configured, is automatically reused as the broad Nashville-radius discovery source. No second Ticketmaster key is required.

### Eventbrite

Use an Eventbrite **Private Token / OAuth access token** as `EVENTBRITE_PRIVATE_TOKEN`. An Eventbrite App Key alone is not sent as an API bearer credential.

This integration intentionally does **not** call Eventbrite's retired public Event Search endpoint. It reads events only from organizations authorized for the connected token. Optional organization IDs can be pinned with:

```bash
npx wrangler@4 secret put EVENTBRITE_ORGANIZATION_IDS
```

The value is a comma-separated list of up to four organization IDs. If omitted, the server asks Eventbrite which organizations the token can access.

### Bandsintown

Standard Bandsintown API access is artist-scoped unless Bandsintown explicitly authorizes broader use. Configure only the exact artist name(s) covered by your access. The app does not perform broad artist sweeps and does not accept public artist query parameters.

### Skiddle — adapter staged, do not enable yet

The Skiddle adapter is implemented and bounded, but **do not add `SKIDDLE_API_KEY` to production yet**.

Current Skiddle API terms require displays of Skiddle data to:

1. credit Skiddle by name,
2. display the Skiddle brand logo, and
3. link to Skiddle using the event link returned by the API.

The current Fan Event Radar preserves the provider name and direct event link, but this branch does not bundle an official Skiddle logo asset. Add the official approved logo asset and a regression that requires it before enabling the production secret.

Skiddle is also primarily a UK events source, so a Nashville-radius query may legitimately return zero events even after it is enabled.

## Optional fixed scope tuning

These values are not required; the defaults are already bounded in code. They can be supplied as Worker vars/secrets when needed:

```text
FAN_EVENTS_REGION_LABEL=Nashville, TN
FAN_EVENTS_LAT=36.1665
FAN_EVENTS_LON=-86.7713
FAN_EVENTS_RADIUS_MILES=25
FAN_EVENTS_LOOKAHEAD_DAYS=30
FAN_EVENTS_LIMIT=18
```

Server bounds remain enforced even if environment values are changed:

- radius: 5–50 miles
- lookahead: 7–60 days
- returned cards: 6–24
- Eventbrite organizations: at most 4
- Bandsintown artists: at most 6

## Verification after secrets are added

Deploy normally, then check:

```bash
curl -sS https://titans.alecjprice.com/api/fan-events
```

Expected response traits:

- `ok: true`
- no API keys/tokens in the response
- `configuredProviders` shows which providers are wired
- `providerResults` reports per-provider success/failure and scope
- `events` contains only normalized HTTPS source links
- a failed provider does not turn the whole endpoint into a 5xx response

Then open `https://titans.alecjprice.com/#fan` and verify the **Nashville Event Radar** surface on desktop and mobile.
