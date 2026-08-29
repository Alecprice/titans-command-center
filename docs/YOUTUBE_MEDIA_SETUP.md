# Official YouTube media setup

Titans Command Center uses the YouTube Data API v3 only to discover recent uploads from the official **@Titans** and **@NFL** channels, then re-checks each video before it can appear in Listen / Watch.

## Rights boundary

The media endpoint only returns videos that YouTube currently reports as public and embeddable. It excludes live/upcoming broadcasts, Made-for-Kids videos, unrelated NFL uploads, and titles that look like full games, replays, or live broadcasts. The site does not proxy or rebroadcast video. The browser loads YouTube's IFrame Player API only after a fan presses **Play**.

## Google Cloud setup

1. Create or select a Google Cloud project for Titans Command Center.
2. Enable **YouTube Data API v3** in APIs & Services → Library.
3. Create an API key in APIs & Services → Credentials.
4. Restrict the key to **YouTube Data API v3**. Keep the key server-side. Do not create a browser/referrer key for this feature.
5. Add the key to the GitHub repository Actions secret named `YOUTUBE_API_KEY`.

The Cloudflare deployment workflow copies that optional GitHub Actions secret into the Worker secret bundle without printing it. If the secret is absent, `/api/media-videos` returns a safe `configured:false` response and the video shelf stays hidden.

Cloudflare Workers do not give this application a dedicated static egress IP by default, so an IP-address application restriction is not assumed here. Use an API restriction to YouTube Data API v3 and keep quota alerts enabled. If this deployment later gains dedicated egress IPs, add a matching server-IP restriction in Google Cloud.

## IFrame Player API

The IFrame Player API does not use `YOUTUBE_API_KEY`. The client loads `https://www.youtube.com/iframe_api` lazily after a Play interaction. The Content Security Policy allows only the YouTube script/frame/thumbnail origins needed by this integration.

## Production verification

- `/api/health` exposes only whether the YouTube provider is configured, never the key.
- `/api/media-videos` must report `scope: official-embeddable-vod-only` and `liveRightsExcluded: true`.
- The Listen / Watch production browser smoke verifies that no YouTube iframe or IFrame API script is loaded before a fan presses Play.
- If YouTube or a rights holder later revokes embedding, the player falls back to the video's official YouTube watch link.
