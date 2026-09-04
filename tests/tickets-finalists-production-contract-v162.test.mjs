import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../tickets-finalists-v127.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../tickets-finalists-v127.css',import.meta.url),'utf8');

test('production finalist filters have a cache-distinct stylesheet carrying accessible touch targets',()=>{
  const match=js.match(/link\.href='\/tickets-finalists-v127\.css\?v=(\d+)'/);
  assert.ok(match,'finalists module should load its stylesheet with an explicit cache identity');
  assert.ok(Number(match[1])>=2,'cache identity must move past the stale v1 production asset');
  assert.match(css,/\.tickets-finalists-v127 button\{[^}]*min-height:44px/);
});
