# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `6370120cd886dfc4e9d24dac34579ef87b9c8b92`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-20T22:32:53Z

## Quality gate failure context

```text
not ok 29 - Cloudflare and browser shell route advanced analytics without exposing server code
  ---
  duration_ms: 3.012744
  location: '/home/runner/work/titans-command-center/titans-command-center/tests/nflreadpy-analytics.test.mjs:79:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /titans-cc-brand-2026-v30/. Input:
    
    "const CACHE = 'titans-cc-brand-2026-v31';\n" +
      'const SHELL = [\n' +
      "  '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css', '/player-polish.css', '/headshot-polish.css', '/fan-polish.css', '/team-room.css', '/audit-responsive.css', '/usability-runtime.css', '/source-activity.css', '/stats-hub.css', '/analytics-hub.css', '/market-hub.css',\n" +
      "  '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js', '/player-polish.js', '/headshot-polish.js', '/fan-polish.js', '/team-room.js', '/usability-runtime.js', '/source-activity.js', '/transactions-hub.js', '/stats-hub.js', '/analytics-hub.js', '/market-hub.js', '/accessibility-runtime.js',\n" +
      "  '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs', '/src/visual-audit.mjs', '/src/roster-audit-20260819.mjs', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',\n" +
      "  '/assets/brand/current-lockup.webp', '/assets/archive/current-shield-primary.webp', '/assets/archive/logo-transition-shield-fireball.webp', '/assets/archive/fireball-wordmark.webp', '/assets/archive/fireball-on-navy.webp'\n" +
      '];\n' +
      'const SHELL_PATHS=new Set(SHELL.map(path=>new URL(path,self.location.origin).pathname));\n' +
      'const NETWORK_FIRST=/\\.(?:js|mjs|css|webmanifest)$/i;\n' +
      "self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});\n" +
      "self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});\n" +
      "self.addEventListener('fetch',event=>{\n" +
      "  if(event.request.method!=='GET')return;\n" +
      '  const url=new URL(event.request.url);\n' +
      '  if(url.origin!==self.location.origin)return;\n' +
      "  if(url.pathname.startsWith('/api/'))return;\n" +
      "  if(event.request.mode==='navigate'){\n" +
      "    event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));\n" +
      '    return;\n' +
      '  }\n' +
      '  if(!SHELL_PATHS.has(url.pathname))return;\n' +
      '  if(NETWORK_FIRST.test(url.pathname)){\n' +
      '    event.respondWith(fetch(event.request).then(response=>{\n' +
      '      if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));\n' +
      '      return response;\n' +
      '    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(url.pathname))));\n' +
      '    return;\n' +
      '  }\n' +
      '  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{\n' +
      '    if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));\n' +
      '    return response;\n' +
      '  })));\n' +
      '});\n'
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    const CACHE = 'titans-cc-brand-2026-v31';
    const SHELL = [
      '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css', '/player-polish.css', '/headshot-polish.css', '/fan-polish.css', '/team-room.css', '/audit-responsive.css', '/usability-runtime.css', '/source-activity.css', '/stats-hub.css', '/analytics-hub.css', '/market-hub.css',
      '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js', '/player-polish.js', '/headshot-polish.js', '/fan-polish.js', '/team-room.js', '/usability-runtime.js', '/source-activity.js', '/transactions-hub.js', '/stats-hub.js', '/analytics-hub.js', '/market-hub.js', '/accessibility-runtime.js',
      '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs', '/src/visual-audit.mjs', '/src/roster-audit-20260819.mjs', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',
      '/assets/brand/current-lockup.webp', '/assets/archive/current-shield-primary.webp', '/assets/archive/logo-transition-shield-fireball.webp', '/assets/archive/fireball-wordmark.webp', '/assets/archive/fireball-on-navy.webp'
    ];
    const SHELL_PATHS=new Set(SHELL.map(path=>new URL(path,self.location.origin).pathname));
    const NETWORK_FIRST=/\.(?:js|mjs|css|webmanifest)$/i;
    self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
    self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
    self.addEventListener('fetch',event=>{
      if(event.request.method!=='GET')return;
      const url=new URL(event.request.url);
      if(url.origin!==self.location.origin)return;
      if(url.pathname.startsWith('/api/'))return;
      if(event.request.mode==='navigate'){
        event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));
        return;
      }
      if(!SHELL_PATHS.has(url.pathname))return;
      if(NETWORK_FIRST.test(url.pathname)){
        event.respondWith(fetch(event.request).then(response=>{
          if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));

--- tail ---
  ...
# Subtest: fan-facing base pages prefer live/backup language over storage implementation jargon
ok 66 - fan-facing base pages prefer live/backup language over storage implementation jargon
  ---
  duration_ms: 0.362244
  ...
# Subtest: roster team-room switcher has plain button semantics, keyboard cycling and safe source links
ok 67 - roster team-room switcher has plain button semantics, keyboard cycling and safe source links
  ---
  duration_ms: 0.563036
  ...
# Subtest: rich player pages use the server player endpoint
ok 68 - rich player pages use the server player endpoint
  ---
  duration_ms: 0.398228
  ...
# Subtest: fan status UI uses reader-friendly coverage language instead of implementation jargon
ok 69 - fan status UI uses reader-friendly coverage language instead of implementation jargon
  ---
  duration_ms: 0.33992
  ...
# Subtest: source activity distinguishes checked rows from new rows in fan-readable language
ok 70 - source activity distinguishes checked rows from new rows in fan-readable language
  ---
  duration_ms: 0.374202
  ...
# Subtest: v0.6 database adapter uses current live schema columns
ok 71 - v0.6 database adapter uses current live schema columns
  ---
  duration_ms: 0.461553
  ...
# Subtest: visual archive uses audited metadata instead of ambiguous legacy aliases
ok 72 - visual archive uses audited metadata instead of ambiguous legacy aliases
  ---
  duration_ms: 0.406841
  ...
# Subtest: responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
ok 73 - responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
  ---
  duration_ms: 0.327742
  ...
# Subtest: visual source registry includes official, specialist and Wikipedia cross-checks
ok 74 - visual source registry includes official, specialist and Wikipedia cross-checks
  ---
  duration_ms: 1.6851
  ...
# Subtest: active visual catalog never uses quarantined legacy aliases
ok 75 - active visual catalog never uses quarantined legacy aliases
  ---
  duration_ms: 0.437187
  ...
# Subtest: representative and composite art cannot masquerade as exact official logos
ok 76 - representative and composite art cannot masquerade as exact official logos
  ---
  duration_ms: 3.891354
  ...
# Subtest: 2018 is treated as a uniform and wordmark change, not a new primary logo
ok 77 - 2018 is treated as a uniform and wordmark change, not a new primary logo
  ---
  duration_ms: 2.05775
  ...
# Subtest: Tennessee Oilers transition preserves alternate-logo nuance
ok 78 - Tennessee Oilers transition preserves alternate-logo nuance
  ---
  duration_ms: 0.395695
  ...
# Subtest: current Shield receives exact current-brand treatment
ok 79 - current Shield receives exact current-brand treatment
  ---
  duration_ms: 0.228864
  ...
1..79
# tests 79
# suites 0
# pass 78
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 347.340444
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.
