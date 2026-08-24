import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('fantasy-decision-center-v3.js');
const search=read('smart-search-v111.js');
const sw=read('sw.js');

test('Decision Center loads additively through search bootstrap and PWA shell',()=>{
  assert.match(search,/import\('\.\/fantasy-decision-center-v3\.js'\)\.catch/);
  assert.match(search,/Compare Start \/ Sit/);
  assert.match(sw,/'\/fantasy-decision-center-v3\.js'/);
  assert.match(sw,/titans-cc-brand-2026-v60/);
});

test('Decision Center compares transparent evidence rather than projected points',()=>{
  assert.match(js,/Start \/ Sit Compare/);
  assert.match(js,/Compare transparent evidence—not invented projections/);
  assert.match(js,/Evidence leans/);
  assert.match(js,/not a point projection or guarantee/);
  assert.match(js,/Too close to call from the loaded evidence/);
  assert.doesNotMatch(js,/projectedPoints|projection\s*[:=]\s*\d/i);
});

test('Decision signals are limited to loaded roster availability slot and Sleeper trends',()=>{
  assert.match(js,/currently in a starter slot/);
  assert.match(js,/currently on the bench/);
  assert.match(js,/availability flag/);
  assert.match(js,/Sleeper trending adds/);
  assert.match(js,/Sleeper trending drops/);
  assert.match(js,/Titans roster status/);
});

test('Decision Center is read-only and request bounded',()=>{
  assert.match(js,/setTimeout\(\(\)=>controller\.abort\(\),6500\)/);
  assert.match(js,/trending\/add\?lookback_hours=24&limit=25/);
  assert.match(js,/trending\/drop\?lookback_hours=24&limit=15/);
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
});

test('Decision Center shares concurrent context loads instead of returning null',()=>{
  assert.match(js,/let context=null,contextKey='',contextPromise=null,promiseKey=''/);
  assert.match(js,/if\(contextPromise&&promiseKey===key\)return contextPromise/);
  assert.match(js,/contextPromise=buildContext\(key\)\.finally/);
  assert.doesNotMatch(js,/if\(running\)return context/);
});

test('Decision Center keeps persisted input parsing safe and candidate counts bounded',()=>{
  assert.match(js,/typeof v==='object'&&!Array\.isArray\(v\)/);
  assert.match(js,/manual\.slice\(0,40\)/);
  assert.match(js,/slice\(0,80\)/);
});

test('Decision Center remains mobile and touch safe',()=>{
  assert.match(js,/min-height:44px/);
  assert.match(js,/@media\(max-width:560px\)/);
  assert.match(js,/grid-template-columns:1fr/);
});
