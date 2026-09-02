import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('legacy finder ships through the browser and offline shells',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/legacy-finder-v2\.css\?v=1/);
  assert.match(html,/legacy-finder-v2\.js\?v=1/);
  assert.match(sw,/\/legacy-finder-v2\.css/);
  assert.match(sw,/\/legacy-finder-v2\.js/);
  assert.match(sw,/titans-cc-brand-2026-v77/);
});

test('legacy finder indexes the rendered museum instead of duplicating history data',()=>{
  const js=read('legacy-finder-v2.js');
  assert.match(js,/legacy-story-card/);
  assert.match(js,/legacy-moment-card/);
  assert.match(js,/legacy-legend-card/);
  assert.match(js,/legacy-record-card/);
  assert.match(js,/archive-card/);
  assert.doesNotMatch(js,/Warren Moon|Steve McNair|Derrick Henry|Music City Miracle/);
});

test('legacy finder supports shareable route-safe state and resilient native-filter coexistence',()=>{
  const js=read('legacy-finder-v2.js');
  assert.match(js,/history\.replaceState/);
  assert.match(js,/new URLSearchParams/);
  assert.match(js,/params\.set\('q'/);
  assert.match(js,/params\.set\('scope'/);
  assert.match(js,/resetMuseumNativeFilters/);
  assert.match(js,/\.legacy-era-filter,\.archive-filter/);
  assert.match(js,/legacy-finder-filtered/);
  assert.doesNotMatch(js,/location\.hash\s*=/);
});

test('legacy finder is accessible and keyboard friendly',()=>{
  const js=read('legacy-finder-v2.js'),css=read('legacy-finder-v2.css');
  assert.match(js,/aria-live="polite"/);
  assert.match(js,/aria-pressed/);
  assert.match(js,/event\.key==='\/'/);
  assert.match(js,/event\.key==='Escape'/);
  assert.match(css,/focus-visible/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});

test('legacy finder share action degrades from native share to clipboard',()=>{
  const js=read('legacy-finder-v2.js');
  assert.match(js,/navigator\.share/);
  assert.match(js,/navigator\.clipboard\?\.writeText/);
  assert.match(js,/AbortError/);
});
