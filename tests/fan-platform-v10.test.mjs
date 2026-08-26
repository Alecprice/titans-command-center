import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('release identifies itself as v1.0.0 across package and API health paths',()=>{
  const pkg=JSON.parse(read('package.json')),worker=read('cloudflare/worker.mjs'),api=read('api/index.js');
  assert.equal(pkg.version,'1.0.0');
  assert.match(worker,/const APP_VERSION='1\.0\.0'/);
  assert.match(api,/const APP_VERSION='1\.0\.0'/);
});

test('production regression validates the deployed release version instead of a stale constant',()=>{
  const regression=read('scripts/production-regression.mjs');
  assert.match(regression,/health\.body\?\.version===buildMeta\?\.version/);
  assert.doesNotMatch(regression,/health\.body\?\.version==='0\.8\.0'/);
  assert.match(regression,/ProductionAudit\/1\.0/);
  assert.match(regression,/const maxAttempts=45/);
  assert.match(regression,/cache:'no-store'/);
  assert.match(regression,/'Cache-Control':'no-cache, no-store'/);
  assert.match(regression,/'Pragma':'no-cache'/);
  assert.match(regression,/&ts=\$\{Date\.now\(\)\}/);
  assert.match(regression,/if\(lastCommit===expectedSha\)return/);
  assert.match(regression,/Expected deploy \$\{expectedSha\} did not propagate/);
});

test('v1 fan platform is loaded in browser shell and PWA shell',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/href="\/fan-platform-v10\.css\?v=1"/);
  assert.match(html,/src="\/fan-platform-v10\.js\?v=1"/);
  assert.match(html,/property="og:title" content="Titans Command Center"/);
  assert.match(sw,/\/fan-platform-v10\.css/);
  assert.match(sw,/\/fan-platform-v10\.js/);
  assert.match(sw,/self\.addEventListener\('push'/);
  assert.match(sw,/self\.addEventListener\('notificationclick'/);
  assert.match(sw,/url\.pathname\.startsWith\('\/api\/'\)\)return/);
});

test('v1 fan runtime contains personalization, offline, smart search and game-day features',()=>{
  const js=read('fan-platform-v10.js');
  for(const token of ['V1.0 PERSONALIZATION','MY COMMAND DECK','What changed?','POSITION-AWARE','Pull to refresh','You are offline','SMART COMMAND','GAME WEEK COMMAND','POSTGAME COMMAND','LIVE GAME CENTER','Favorite player'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/localStorage\.setItem\(KEYS\.prefs/);
  assert.match(js,/Notification\.requestPermission/);
  assert.match(js,/new Notification/);
  assert.match(js,/sessionStorage\.setItem\(`titans:scroll:/);
  assert.match(js,/fetch\('\/api\/preseason-stats'/);
  assert.match(js,/fetch\(`\/api\/player\?id=/);
  assert.match(js,/state\.prefs\.showMarkets/);
  assert.match(js,/innerWidth<1600/);
  assert.doesNotMatch(js,/DATABASE_URL|PROPLINE_API_KEY|ODDS_API_IO_KEY/);
});

test('v1 responsive layer supports phone, tablet, wide desktop and safe areas',()=>{
  const css=read('fan-platform-v10.css');
  assert.match(css,/@media\(max-width:1100px\)/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/@media\(min-width:1600px\)/);
  assert.match(css,/env\(safe-area-inset-bottom\)/);
  assert.match(css,/env\(safe-area-inset-top\)/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/\.v10-game-toggle\{min-height:34px/);
  assert.match(css,/max-width:759px[\s\S]*\.v10-game-toggle\{min-height:40px/);
});

test('headshot runtime prevents error loops and prioritizes visible photos',()=>{
  const js=read('headshot-polish.js');
  assert.match(js,/headshotFailed==='true'/);
  assert.match(js,/media\.dataset\.headshotFailed='true'/);
  assert.match(js,/eager:index<8/);
  assert.match(js,/image\.fetchPriority='high'/);
  assert.match(js,/image\.addEventListener\('load'/);
  assert.doesNotMatch(js,/removeAttribute\('data-headshot-applied'\)/);
});
