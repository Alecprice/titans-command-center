import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('desktop Smart Search reserves separate input and command shortcut hit areas',()=>{
  const css=read('smart-search-v111.css');
  assert.match(css,/\.search-wrap input\{flex:1 1 auto;min-width:0;width:auto\}/);
  assert.match(css,/\.search-wrap kbd\{flex:0 0 auto\}/);
});

test('Smart Search browser regression measures and rejects hit-area overlap',()=>{
  const smoke=read('scripts/smart-search-browser-smoke.py');
  assert.match(smoke,/def desktop_hit_areas\(driver\):/);
  assert.match(smoke,/overlap:Math\.max/);
  assert.match(smoke,/Desktop search input overlaps command shortcut/);
  assert.match(smoke,/search\.click\(\);search\.send_keys\('Cam Ward'\)/);
});
