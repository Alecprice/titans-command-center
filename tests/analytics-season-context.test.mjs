import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('analytics fallback exposes requested and actual seasons on the rendered root',()=>{
  const js=read('analytics-hub.js');
  assert.match(js,/section\.dataset\.requestedSeason=String\(data\.requestedSeason/);
  assert.match(js,/section\.dataset\.dataSeason=String\(data\.dataSeason/);
  assert.match(js,/section\.dataset\.seasonFallback=String\(Boolean\(data\.seasonFallback\)\)/);
});

test('historical analytics are labeled as a baseline rather than current performance',()=>{
  const js=read('analytics-hub.js');
  const css=read('analytics-hub.css');
  assert.match(js,/class="ah-season-context" role="note"/);
  assert.match(js,/regular-season baseline/);
  assert.match(js,/Not \$\{ahEsc\(data\.requestedSeason\)\} performance/);
  assert.match(js,/advanced analytics baseline/);
  assert.match(js,/REGULAR SEASON/);
  assert.match(js,/Situation explorer · \$\{ahEsc\(data\.dataSeason\)\} regular season/);
  assert.match(css,/\.ah-season-context/);
  assert.match(css,/border-left:4px solid #c8102e/);
  assert.match(css,/@media\(max-width:650px\)[^{]*\{/);
  assert.match(css,/\.ah-season-context\{align-items:flex-start;flex-direction:column\}/);
});

test('current-season analytics do not receive the historical fallback banner',()=>{
  const js=read('analytics-hub.js');
  assert.match(js,/const seasonContext=seasonFallback\?/);
  assert.match(js,/:'';/);
});

test('production analytics smoke enforces season context on desktop and mobile',()=>{
  const smoke=read('scripts/analytics-browser-smoke.py');
  assert.match(smoke,/stage = 'desktop:season-context'/);
  assert.match(smoke,/requestedSeason/);
  assert.match(smoke,/dataSeason/);
  assert.match(smoke,/seasonFallback/);
  assert.match(smoke,/Analytics fallback metadata is inconsistent/);
  assert.match(smoke,/Analytics fallback is not unmistakably labeled/);
  assert.match(smoke,/regular-season baseline/);
  assert.match(smoke,/Not \{season_context\['requestedSeason'\]\} performance/);
  assert.match(smoke,/mobileSeasonContext/);
  assert.match(smoke,/Mobile analytics fallback context is missing/);
});

test('analytics assets remain network-first and pathname-cached for PWA updates',()=>{
  const html=read('index.html');
  const sw=read('sw.js');
  assert.match(html,/analytics-hub\.css\?v=30/);
  assert.match(html,/analytics-hub\.js\?v=30/);
  assert.match(sw,/NETWORK_FIRST/);
  assert.match(sw,/\/analytics-hub\.css/);
  assert.match(sw,/\/analytics-hub\.js/);
  assert.match(sw,/caches\.match\(url\.pathname\)/);
});
