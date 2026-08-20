# Titans Command Center — pre-domain cutover gate

Custom-domain attachment is intentionally the final migration step. Until that step is complete, the Cloudflare `workers.dev` deployment is the validation target and Vercel remains available as rollback insurance.

## Required production gate

A release is ready for custom-domain cutover only when `.github/workflows/cloudflare-deploy.yml` records `deployed + full production regression passed` for the exact source commit being reviewed.

The automated regression verifies:

- Cloudflare static app shell, current Shield asset, manifest and browser modules return the expected content types.
- `build-meta.json` matches the exact GitHub commit that triggered deployment.
- The PWA service-worker shell installs from assets that all exist in the deployed static bundle.
- The current PWA cache version is deployed and API requests remain network-only.
- Accessibility shell requirements remain present, including skip navigation and mobile-menu state semantics.
- Static security headers are active, including MIME-sniffing protection, frame protection, referrer policy and CSP.
- The temporary `workers.dev` hostname is marked `noindex` until the custom domain is attached.
- `/api/health` reports a healthy application and healthy Neon connection.
- `/api/data` returns the complete 95-player Neon roster.
- `/api/preseason-stats` returns the complete roster and identifies Neon as the roster source.
- `/api/market-data` returns a safe response without provider-configuration crashes.
- Public HTML and primary browser JavaScript do not expose a PostgreSQL connection string or Neon credential.

## Current architecture

`GitHub main → Cloudflare Worker + Static Assets → Neon PostgreSQL`

The Worker handles `/api/*`. Cloudflare's static asset layer handles browser HTML, CSS, JS, images, manifest and PWA files. A scheduled Cloudflare event performs source refresh work without exposing an unauthenticated public cron endpoint.

## Rollback rule

Do not remove the Vercel project before the custom-domain Cloudflare deployment is validated. If a custom-domain cutover fails, restore traffic to the previous production host while the Cloudflare deployment is repaired.

## Final step

After the pre-domain gate passes:

1. Attach the chosen custom domain to the Cloudflare Worker.
2. Validate HTTPS, redirects, PWA scope, API routes and security headers on the custom hostname.
3. Remove the temporary `workers.dev` noindex concern from the public-domain evaluation; the rule remains scoped only to `workers.dev`.
4. Leave Vercel available briefly as rollback insurance.
5. Retire Vercel only after the custom-domain Cloudflare deployment is confirmed stable.
