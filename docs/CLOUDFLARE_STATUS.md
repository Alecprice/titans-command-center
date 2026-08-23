# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `0fb9ea9a4760c9e61b933c54bbc17b9ea7b67e96`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-23T01:33:56Z

## Quality gate failure context

```text

--- tail ---
  ---
  duration_ms: 0.342091
  ...
# Subtest: v0.6 database adapter uses current live schema columns
ok 296 - v0.6 database adapter uses current live schema columns
  ---
  duration_ms: 0.492916
  ...
# Subtest: visual archive uses audited metadata instead of ambiguous legacy aliases
ok 297 - visual archive uses audited metadata instead of ambiguous legacy aliases
  ---
  duration_ms: 0.381539
  ...
# Subtest: responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
ok 298 - responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
  ---
  duration_ms: 0.342301
  ...
# Subtest: visual source registry includes official, specialist and Wikipedia cross-checks
ok 299 - visual source registry includes official, specialist and Wikipedia cross-checks
  ---
  duration_ms: 1.211388
  ...
# Subtest: active visual catalog never uses quarantined legacy aliases
ok 300 - active visual catalog never uses quarantined legacy aliases
  ---
  duration_ms: 0.347758
  ...
# Subtest: representative and composite art cannot masquerade as exact official logos
ok 301 - representative and composite art cannot masquerade as exact official logos
  ---
  duration_ms: 0.614276
  ...
# Subtest: 2018 is treated as a uniform and wordmark change, not a new primary logo
ok 302 - 2018 is treated as a uniform and wordmark change, not a new primary logo
  ---
  duration_ms: 1.060283
  ...
# Subtest: Tennessee Oilers transition preserves alternate-logo nuance
ok 303 - Tennessee Oilers transition preserves alternate-logo nuance
  ---
  duration_ms: 0.285415
  ...
# Subtest: current Shield receives exact current-brand treatment
ok 304 - current Shield receives exact current-brand treatment
  ---
  duration_ms: 0.143134
  ...
1..304
# tests 304
# suites 0
# pass 304
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 1624.693112

> titans-command-center@1.0.0 audit:content
> node scripts/content-audit.mjs

✓ current team identity metadata
✓ franchise milestone dates preserve 1959 vs 1960 distinction
✓ 2026 schedule contains Week 9 bye
✓ Week 18 stays genuinely TBD at current Reliant Stadium name
✗ fallback roster is the full dated audited snapshot
✓ fallback player metadata avoids unsupported editorial tags
✓ Peter Skoronski fallback position matches official roster
✓ fallback feed carries the current Aug. 19 transaction
✓ fallback feed contains sourceable links instead of placeholder social claims
✓ fallback source labels distinguish API availability from active persistence
✓ visual labels are source-audited and active art avoids legacy aliases
✓ base app no longer requests retired duplicate legacy assets

Content audit failed (1):
- fallback roster is the full dated audited snapshot: Expected values to be strictly equal:
+ actual - expected

+ 'cross-source-audited-snapshot'
- 'full-audited-snapshot'
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
