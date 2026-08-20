# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `44cd1d45e7d23ce3ac145c5dfb59489196570d58`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-20T21:46:02Z

## Quality gate tail

```text
  ...
# Subtest: known Jeffery Simmons stat-source conflict is documented
ok 54 - known Jeffery Simmons stat-source conflict is documented
  ---
  duration_ms: 0.160481
  ...
# Subtest: known Cedric Gray official-source conflict is documented
ok 55 - known Cedric Gray official-source conflict is documented
  ---
  duration_ms: 0.243186
  ...
# Subtest: official transaction typo cannot overwrite Mario Goodrich identity
ok 56 - official transaction typo cannot overwrite Mario Goodrich identity
  ---
  duration_ms: 0.209203
  ...
# Subtest: visual policy only treats the Shield as current primary
ok 57 - visual policy only treats the Shield as current primary
  ---
  duration_ms: 0.284805
  ...
# Subtest: fan, player, team-room, source-activity and responsive assets are loaded
ok 58 - fan, player, team-room, source-activity and responsive assets are loaded
  ---
  duration_ms: 2.44534
  ...
# Subtest: service worker keeps API responses out of cache and versions current shell
ok 59 - service worker keeps API responses out of cache and versions current shell
  ---
  duration_ms: 0.295384
  ...
# Subtest: core router degrades malformed dates and render failures instead of trapping navigation
ok 60 - core router degrades malformed dates and render failures instead of trapping navigation
  ---
  duration_ms: 2.775389
  ...
# Subtest: shared feed time helpers never expose NaN labels
ok 61 - shared feed time helpers never expose NaN labels
  ---
  duration_ms: 0.322836
  ...
# Subtest: fan-facing base pages prefer live/backup language over storage implementation jargon
ok 62 - fan-facing base pages prefer live/backup language over storage implementation jargon
  ---
  duration_ms: 0.350368
  ...
# Subtest: roster team-room switcher has plain button semantics, keyboard cycling and safe source links
ok 63 - roster team-room switcher has plain button semantics, keyboard cycling and safe source links
  ---
  duration_ms: 0.613812
  ...
# Subtest: rich player pages use the server player endpoint
ok 64 - rich player pages use the server player endpoint
  ---
  duration_ms: 0.42095
  ...
# Subtest: fan status UI uses reader-friendly coverage language instead of implementation jargon
ok 65 - fan status UI uses reader-friendly coverage language instead of implementation jargon
  ---
  duration_ms: 0.380795
  ...
# Subtest: source activity distinguishes checked rows from new rows in fan-readable language
ok 66 - source activity distinguishes checked rows from new rows in fan-readable language
  ---
  duration_ms: 0.392857
  ...
# Subtest: v0.6 database adapter uses current live schema columns
ok 67 - v0.6 database adapter uses current live schema columns
  ---
  duration_ms: 0.484069
  ...
# Subtest: visual archive uses audited metadata instead of ambiguous legacy aliases
ok 68 - visual archive uses audited metadata instead of ambiguous legacy aliases
  ---
  duration_ms: 0.390122
  ...
# Subtest: responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
ok 69 - responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
  ---
  duration_ms: 0.366268
  ...
# Subtest: visual source registry includes official, specialist and Wikipedia cross-checks
ok 70 - visual source registry includes official, specialist and Wikipedia cross-checks
  ---
  duration_ms: 1.297456
  ...
# Subtest: active visual catalog never uses quarantined legacy aliases
ok 71 - active visual catalog never uses quarantined legacy aliases
  ---
  duration_ms: 0.313699
  ...
# Subtest: representative and composite art cannot masquerade as exact official logos
ok 72 - representative and composite art cannot masquerade as exact official logos
  ---
  duration_ms: 0.66031
  ...
# Subtest: 2018 is treated as a uniform and wordmark change, not a new primary logo
ok 73 - 2018 is treated as a uniform and wordmark change, not a new primary logo
  ---
  duration_ms: 0.896784
  ...
# Subtest: Tennessee Oilers transition preserves alternate-logo nuance
ok 74 - Tennessee Oilers transition preserves alternate-logo nuance
  ---
  duration_ms: 0.277251
  ...
# Subtest: current Shield receives exact current-brand treatment
ok 75 - current Shield receives exact current-brand treatment
  ---
  duration_ms: 0.152977
  ...
1..75
# tests 75
# suites 0
# pass 74
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 346.197801
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
