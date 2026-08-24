import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('home-stability-v27.js');
const runtime=read('usability-runtime.js');
const sw=read('sw.js');

test('Home stability guard loads behind the shared runtime and is available offline',()=>{
  assert.match(runtime,/import\('\.\/home-stability-v27\.js'\)\.catch\(\(\)=>\{\}\)/);
  assert.match(sw,/titans-cc-brand-2026-v61/);
  assert.match(sw,/'\/home-stability-v27\.js'/);
});

test('Home owns one copy of each async-mounted command surface',()=>{
  assert.match(js,/dedupe\('\[data-v10-home\]'\)/);
  assert.match(js,/dedupe\('\[data-fan-v09="today"\]'\)/);
  assert.match(js,/dedupe\('\.v14-now'\)/);
  assert.match(js,/matches\.slice\(1\)/);
  assert.match(js,/let queued=false/);
});

test('Home market card uses the same live market endpoint as Market Pulse',()=>{
  assert.match(js,/apiJson\('\/api\/market-data',\{ttl:30000\}\)/);
  assert.match(js,/current market rows/);
  assert.match(js,/provider=String\(current\.provider/);
  assert.match(js,/Markets \$\{age\(current\.fetchedAt\)\}/);
  assert.doesNotMatch(js,/d\?\.markets\?\.rows/);
});

test('stale premium next-game card is repaired from current schedule data',()=>{
  assert.match(js,/apiJson\('\/api\/data',\{ttl:30000\}\)/);
  assert.match(js,/schedule tbd\|schedule loading/);
  assert.match(js,/const payload=await loadData\(\),game=nextGame\(payload\)/);
  assert.match(js,/game\.homeAway==='home'\?'vs':'at'/);
  assert.match(js,/gameTime\(game\.date\)/);
});

test('Home stability uses the shared render bus instead of another DOM observer',()=>{
  assert.match(js,/runtime\.onAppRender\(schedule,\{immediate:true\}\)/);
  assert.match(js,/runtime\.onRoute\(schedule\)/);
  assert.match(js,/runtime\.onRefresh\(\(\)=>/);
  assert.doesNotMatch(js,/MutationObserver/);
});
