import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('app shell keeps core accessibility, mobile navigation and PWA semantics',()=>{
  const html=read('index.html');
  assert.match(html,/class="skip-link" href="#app"/);
  assert.match(html,/id="menu-button"[^>]*aria-controls="sidebar"[^>]*aria-expanded="false"/);
  assert.match(html,/id="primary-nav" aria-label="Primary navigation"/);
  assert.match(html,/id="app"[^>]*aria-live="polite"[^>]*tabindex="-1"/);
  assert.match(html,/rel="preload" as="image" href="\/assets\/brand\/current-lockup\.webp"/);
  assert.match(html,/class="mobile-nav"[\s\S]*href="#transactions"[^>]*data-route="transactions"[\s\S]*>Moves/);
  assert.match(html,/id="mobile-more-button"[^>]*aria-controls="sidebar"[^>]*aria-expanded="false"/);
  assert.match(html,/href="\/usability-runtime\.css"/);
  assert.match(html,/src="\/usability-runtime\.js\?v=26"/);
  assert.match(html,/src="\/ux-polish\.js\?v=27"/);
  assert.match(html,/src="\/fan-polish\.js\?v=27"/);
  assert.match(html,/src="\/team-room\.js\?v=27"/);
  assert.match(html,/src="\/source-activity\.js\?v=27"/);
  assert.match(html,/src="\/market-hub\.js\?v=27"/);
  assert.match(html,/href="\/ux-polish\.css\?v=27"/);
  assert.match(html,/href="\/team-room\.css\?v=27"/);
  assert.match(html,/href="\/market-hub\.css\?v=27"/);
  assert.match(html,/src="\/accessibility-runtime\.js"/);
  assert.match(html,/src="\/legacy-polish\.js\?v=21"/);
  assert.match(html,/src="\/fact-polish\.js\?v=21"/);
  assert.match(html,/src="\/transactions-hub\.js\?v=24"/);
  assert.match(html,/src="\/stats-hub\.js\?v=22"/);
});

test('responsive layer preserves keyboard focus, safe areas and mobile touch targets',()=>{
  const css=`${read('ux-polish.css')}\n${read('audit-responsive.css')}\n${read('usability-runtime.css')}`;
  assert.match(css,/:focus-visible/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/env\(safe-area-inset-bottom\)/);
  assert.match(css,/\.mobile-nav button,.mobile-nav a\{min-height:48px\}/);
  assert.match(css,/body\.nav-open\{overflow:hidden\}/);
  assert.match(css,/body\.nav-open:after/);
  assert.match(css,/\.search-route-links a\{min-height:44px/);
  assert.match(css,/\.roster-status-filters \.ux-clear-filter/);
});

test('usability runtime prevents stale-route dead ends and keeps navigation state accessible',()=>{
  const runtime=read('usability-runtime.js');
  assert.match(runtime,/renderRecovery/);
  assert.match(runtime,/routeLooksRendered/);
  assert.match(runtime,/aria-current/);
  assert.match(runtime,/controllerchange/);
  assert.match(runtime,/Update ready/);
  assert.match(runtime,/trapMobileDrawerFocus/);
  assert.match(runtime,/event\.key==='Escape'/);
  assert.match(runtime,/event\.key==='\/'/);
  assert.match(runtime,/enhanceSearchPage/);
  assert.match(runtime,/hash:'#transactions',label:'Transactions'/);
  assert.match(runtime,/current==='home'\|\|current==='live'\|\|current==='games'/);
  assert.match(runtime,/observe\(app,\{childList:true\}\)/);
  assert.doesNotMatch(runtime,/observe\(app,\{childList:true,subtree:true\}\)/);
});

test('shared UX helpers keep countdowns finite and roster filters recoverable',()=>{
  const ux=read('ux-polish.js');
  assert.match(ux,/if\(!Number\.isFinite\(time\)\)return 'Kickoff TBD'/);
  assert.match(ux,/data-roster-clear/);
  assert.match(ux,/aria-pressed="true"/);
  assert.match(ux,/Live data checks are healthy/);
  assert.doesNotMatch(ux,/Neon database online and responding/);
  assert.match(ux,/observe\(list,\{childList:true\}\)/);
  assert.doesNotMatch(ux,/observe\(list,\{childList:true,subtree:true\}\)/);
});

test('manifest uses dark launch colors and prioritizes core fan shortcuts',()=>{
  const manifest=JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.background_color,'#06101C');
  assert.equal(manifest.theme_color,'#0C2340');
  assert.ok(manifest.shortcuts.some(item=>item.url==='/#transactions'&&item.short_name==='Moves'));
  assert.ok(manifest.shortcuts.some(item=>item.url==='/#stats'));
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
  assert.match(sw,/titans-cc-brand-2026-v27/);
  assert.match(sw,/\/accessibility-runtime\.js/);
  assert.match(sw,/\/usability-runtime\.js/);
  assert.match(sw,/\/usability-runtime\.css/);
  assert.match(sw,/\/transactions-hub\.js/);
  assert.match(sw,/const NETWORK_FIRST=/);
  assert.match(sw,/js\|mjs\|css\|webmanifest/);
  assert.doesNotMatch(sw,/\/src\/preseason-p1-20260813\.mjs/);
});

test('DOM polishers cannot recursively observe their own nested rewrites',()=>{
  const facts=read('fact-polish.js');
  const legacy=read('legacy-polish.js');
  const ux=read('ux-polish.js');
  const fan=read('fan-polish.js');
  assert.match(facts,/factByePolished/);
  assert.match(facts,/factTbdPolished/);
  assert.match(facts,/observe\(root,\{childList:true\}\)/);
  assert.doesNotMatch(facts,/observe\(root,\{childList:true,subtree:true\}\)/);
  assert.match(legacy,/calloutCopy&&calloutCopy\.textContent!==desired/);
  assert.match(legacy,/observe\(appRoot,\{childList:true\}\)/);
  assert.doesNotMatch(legacy,/observe\(appRoot,\{childList:true,subtree:true\}\)/);
  assert.match(ux,/observe\(app,\{childList:true\}\)/);
  assert.doesNotMatch(ux,/observe\(app,\{childList:true,subtree:true\}\)/);
  assert.match(fan,/if\(fanRoute\(\)==='transactions'\)return/);
  assert.match(fan,/observe\(fanApp,\{childList:true\}\)/);
  assert.doesNotMatch(fan,/observe\(fanApp,\{childList:true,subtree:true\}\)/);
  assert.doesNotMatch(fan,/function polishTransactions/);
});

test('async page modules cannot overwrite a later route',()=>{
  const stats=read('stats-hub.js');
  const market=read('market-hub.js');
  const marketCss=read('market-hub.css');
  const sources=read('source-activity.js');
  const transactions=read('transactions-hub.js');
  assert.match(stats,/statsRequestSerial/);
  assert.match(stats,/requestId!==statsRequestSerial\|\|shRoute\(\)!=='stats'/);
  assert.match(stats,/observe\(shRoot,\{childList:true\}\)/);
  assert.doesNotMatch(stats,/observe\(shRoot,\{childList:true,subtree:true\}\)/);
  assert.match(market,/marketRequestSerial/);
  assert.match(market,/requestId!==marketRequestSerial\|\|mhRoute\(\)!=='markets'/);
  assert.match(market,/const validDate=/);
  assert.match(market,/const safeUrl=/);
  assert.match(market,/id="mh-retry"/);
  assert.match(market,/aria-busy/);
  assert.match(market,/Technical details/);
  assert.match(marketCss,/\.mh-error/);
  assert.match(market,/observe\(mhRoot,\{childList:true\}\)/);
  assert.doesNotMatch(market,/observe\(mhRoot,\{childList:true,subtree:true\}\)/);
  assert.match(sources,/saRequestSerial/);
  assert.match(sources,/0 new rows/);
  assert.match(sources,/> checked</);
  assert.match(sources,/> new rows</);
  assert.match(sources,/observe\(saApp,\{childList:true\}\)/);
  assert.doesNotMatch(sources,/observe\(saApp,\{childList:true,subtree:true\}\)/);
  assert.match(transactions,/thRequestSerial/);
  assert.match(transactions,/requestId!==thRequestSerial\|\|thRoute\(\)!=='transactions'/);
  assert.match(transactions,/cache:'no-store'/);
  assert.match(transactions,/aria-busy/);
  assert.match(transactions,/id="txn-retry"/);
  assert.match(transactions,/observe\(thApp,\{childList:true\}\)/);
  assert.doesNotMatch(transactions,/observe\(thApp,\{childList:true,subtree:true\}\)/);
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
  assert.match(script,/192px PWA icon dimensions/);
});
