import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('desktop Smart Search reserves separate grid columns for input and command shortcut',()=>{
  const css=read('smart-search-v111.css');
  assert.match(css,/\.search-wrap\{position:relative;min-width:0;display:grid;grid-template-columns:auto minmax\(0,1fr\) auto;align-items:stretch\}/);
  assert.match(css,/\.search-wrap input\{grid-column:2;min-width:0;width:100%;max-width:100%;align-self:stretch\}/);
  assert.match(css,/\.search-wrap kbd\{grid-column:3;position:relative!important;inset:auto!important;transform:none!important;/);
  assert.match(css,/min-width:44px/);
});

test('Smart Search browser regression waits for enhanced settled geometry and verifies click ownership',()=>{
  const smoke=read('scripts/smart-search-browser-smoke.py');
  assert.match(smoke,/def desktop_hit_areas\(driver\):/);
  assert.match(smoke,/def settled_hit_areas\(driver\):/);
  assert.match(smoke,/shortcut\.dataset\.fanCommand==='1'/);
  assert.match(smoke,/document\.elementFromPoint\(x,y\)/);
  assert.match(smoke,/inputCenterOwner/);
  assert.match(smoke,/Desktop search center click is owned by another element/);
  assert.match(smoke,/Desktop quick-jump click target intercepted after route return/);
  assert.match(smoke,/search\.click\(\);search\.send_keys\('Cam Ward'\)/);
});