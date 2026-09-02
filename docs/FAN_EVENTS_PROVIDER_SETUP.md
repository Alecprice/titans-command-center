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

## Active provider stack

### Ticketmaster

The existing `TICKETMASTER_API_KEY`, when configured, is automatically reused as the broad Nashville-radius discovery source. No second Ticketmaster key is required.

### Eventbrite

Use an Eventbrite **Private Token / OAuth access token** as `EVENTBRITE_PRIVATE_TOKEN`. An Eventbrite App Key alone is not sent as an API bearer credential.

This integration intentionally does **not** call Eventbrite's retired public Event Search endpoint. It reads events only from organizations authorized for the connected token. Optional organization IDs can be pinned with:

```bash
npx wrangler@4 secret put EVENTBRITE_ORGANIZATION_IDS
```

The value is a comma-separated list of up to four organization IDs. If omitted, the server asks Eventbrite which organizations the token can access.

### Skiddle

Skiddle replaces the removed Bandsintown provider in Fan Event Radar.

The server performs a fixed geographic search around the configured Nashville radius and does not expose an arbitrary Skiddle proxy to browsers. Add the production key with:

```bash
npx wrangler@4 secret put SKIDDLE_API_KEY
```

Current Skiddle API guidance says the API is for non-commercial use unless commercial use is approved in writing. Do not rely on Skiddle data in a commercialized version of the site without that approval.

Skiddle's API terms also require every use of Skiddle data to:

1. credit Skiddle by name,
2. display the Skiddle brand logo, and
3. link to Skiddle using the direct event link returned by the API.

Fan Event Radar satisfies those display requirements by using Skiddle's official unmodified white-on-transparent landscape logo from the official Skiddle brand asset host and by making each Skiddle source action link directly to the event URL returned by Skiddle.

Skiddle is primarily a UK events source, so a Nashville-radius query may legitimately return zero events even when the API key is valid.

## Production secret ownership

Direct Cloudflare Worker secrets remain a supported production setup. The current deploy command uses Wrangler's secret-file deploy behavior, and secrets omitted from the deploy secret file are preserved rather than treated as deletions. That means a provider configured directly with `wrangler secret put` does not need a matching GitHub secret just to survive later normal deployments.

The primary Cloudflare deployment can also manage these optional values from GitHub Actions secrets:

- `EVENTBRITE_PRIVATE_TOKEN`
- `EVENTBRITE_ORGANIZATION_IDS`
- `SKIDDLE_API_KEY`

Only non-empty GitHub values are added to the temporary Worker secret bundle. Secret values are never printed. If one of those GitHub secrets is absent, the deployment status reports only that the **GitHub-managed input** is absent; it does not claim the production provider is disabled because a direct Worker secret may already exist.

Actual provider readiness is determined after deploy by `GET /api/fan-events`. The primary Cloudflare release now runs `scripts/fan-events-production-regression.mjs` before browser regressions and records a sanitized report in `docs/CLOUDFLARE_STATUS.md`, including boolean configured-provider state and provider availability/count evidence without credentials.

## Bandsintown removal

Bandsintown is no longer queried or exposed by the Fan Event Radar provider catalog. If its Worker secrets were previously added, remove them:

```bash
npx wrangler@4 secret delete BANDSINTOWN_API_KEY
npx wrangler@4 secret delete BANDSINTOWN_ARTISTS
```

If Wrangler reports that either binding does not exist, no cleanup is required for that name.

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

## Verification after secrets are added

Deploy normally, then check:

```bash
curl -sS https://titans.alecjprice.com/api/fan-events | python3 -m json.tool
```

Expected response traits:

- `ok: true`
- no API keys/tokens in the response
- `configuredProviders.eventbrite` is `true` when an Eventbrite private/OAuth token is bound
- `configuredProviders.skiddle` is `true` when `SKIDDLE_API_KEY` is bound
- `providerResults` reports per-provider success/failure and scope
- `events` contains only normalized HTTPS source links
- a failed provider does not turn the whole endpoint into a 5xx response
- no Bandsintown provider appears in `configuredProviders`, `providerCatalog`, or `providerResults`

Then open `https://titans.alecjprice.com/#fan` and verify the **Nashville Event Radar** surface on desktop and mobile. Any Skiddle result must show the Skiddle logo/name and its direct event link.
