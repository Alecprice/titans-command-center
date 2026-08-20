import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('app shell keeps core accessibility and PWA semantics',()=>{
  const html=read('index.html');
  assert.match(html,/class="skip-link" href="#app"/);
  assert.match(html,/id="menu-button"[^>]*aria-controls="sidebar"[^>]*aria-expanded="false"/);
  assert.match(html,/id="primary-nav" aria-label="Primary navigation"/);
  assert.match(html,/id="app"[^>]*aria-live="polite"[^>]*tabindex="-1"/);
  assert.match(html,/rel="preload" as="image" href="\/assets\/brand\/current-lockup\.webp"/);
  assert.match(html,/src="\/accessibility-runtime\.js"/);
  assert.match(html,/src="\/legacy-polish\.js\?v=21"/);
  assert.match(html,/src="\/fact-polish\.js\?v=21"/);
  assert.match(html,/src="\/source-activity\.js\?v=22"/);
  assert.match(html,/src="\/stats-hub\.js\?v=22"/);
  assert.match(html,/src="\/market-hub\.js\?v=22"/);
});

test('responsive layer preserves keyboard focus, safe areas and reduced motion',()=>{
  const css=`${read('ux-polish.css')}\n${read('audit-responsive.css')}`;
  assert.match(css,/:focus-visible/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/env\(safe-area-inset-bottom\)/);
  assert.match(css,/\.mobile-nav a\{min-height:48px\}/);
});

test('Cloudflare deployment requires Neon and exposes only API paths to Worker compute',()=>{
  const config=read('wrangler.jsonc');
  assert.match(config,/"required"\s*:\s*\["DATABASE_URL"\]/);
  assert.match(config,/"run_worker_first"\s*:\s*\["\/api\/\*"\]/);
  assert.match(config,/"observability"\s*:\s*\{\s*"enabled"\s*:\s*true/);
});

test('Cloudflare static policy hardens the temporary workers.dev deployment',()=>{
  const headers=read('_headers');
  assert.match(headers,/X-Content-Type-Options: nosniff/);
  assert.match(headers,/X-Frame-Options: DENY/);
  assert.match(headers,/Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers,/Content-Security-Policy:.*frame-ancestors 'none'/);
  assert.match(headers,/https:\/\/:version\.:subdomain\.workers\.dev\/\*[\s\S]*X-Robots-Tag: noindex/);
});

test('PWA shell excludes server-only modules and refreshes code assets from network first',()=>{
  const sw=read('sw.js');
  assert.match(sw,/titans-cc-brand-2026-v22/);
  assert.match(sw,/\/accessibility-runtime\.js/);
  assert.match(sw,/const NETWORK_FIRST=/);
  assert.match(sw,/js\|mjs\|css\|webmanifest/);
  assert.doesNotMatch(sw,/\/src\/preseason-p1-20260813\.mjs/);
});

test('DOM polishers cannot recursively observe their own nested rewrites',()=>{
  const facts=read('fact-polish.js');
  const legacy=read('legacy-polish.js');
  assert.match(facts,/factByePolished/);
  assert.match(facts,/factTbdPolished/);
  assert.match(facts,/observe\(root,\{childList:true\}\)/);
  assert.doesNotMatch(facts,/observe\(root,\{childList:true,subtree:true\}\)/);
  assert.match(legacy,/calloutCopy&&calloutCopy\.textContent!==desired/);
  assert.match(legacy,/observe\(appRoot,\{childList:true\}\)/);
  assert.doesNotMatch(legacy,/observe\(appRoot,\{childList:true,subtree:true\}\)/);
});

test('async page modules cannot overwrite a later route',()=>{
  const stats=read('stats-hub.js');
  const market=read('market-hub.js');
  const sources=read('source-activity.js');
  assert.match(stats,/statsRequestSerial/);
  assert.match(stats,/requestId!==statsRequestSerial\|\|shRoute\(\)!=='stats'/);
  assert.match(stats,/observe\(shRoot,\{childList:true\}\)/);
  assert.doesNotMatch(stats,/observe\(shRoot,\{childList:true,subtree:true\}\)/);
  assert.match(market,/marketRequestSerial/);
  assert.match(market,/requestId!==marketRequestSerial\|\|mhRoute\(\)!=='markets'/);
  assert.match(market,/observe\(mhRoot,\{childList:true\}\)/);
  assert.doesNotMatch(market,/observe\(mhRoot,\{childList:true,subtree:true\}\)/);
  assert.match(sources,/saRequestSerial/);
  assert.match(sources,/requestId!==saRequestSerial\|\|saRoute\(\)!=='sources'/);
  assert.match(sources,/observe\(saApp,\{childList:true\}\)/);
  assert.doesNotMatch(sources,/observe\(saApp,\{childList:true,subtree:true\}\)/);
});

test('production regression audit is wired as a package command',()=>{
  const pkg=JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['audit:production'],'node scripts/production-regression.mjs');
  const script=read('scripts/production-regression.mjs');
  assert.match(script,/Expected 95 Neon roster players/);
  assert.match(script,/PWA precache paths failed/);
  assert.match(script,/database connection string leaked/i);
  assert.match(script,/workers\.dev staging hostname is not marked noindex/);
  assert.match(script,/Deployed commit .* does not match expected/);
});
