import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const stable=read('gameday-v16.js');
const addon=read('gameday-today-v22.js');
const runtime=read('runtime-v19.js');

test('stable Game Day and Game Flow share the same Fan Intel cache budget',()=>{
  assert.match(stable,/const LIVE_DATA_TTL_MS=15000/);
  assert.match(stable,/sharedJson\('\/api\/fan-intel',\{ttl:LIVE_DATA_TTL_MS/);
  assert.match(addon,/runtime\.apiJson\('\/api\/fan-intel',\{ttl:15000\}\)/);
  assert.match(stable,/runtime\.apiJson\(url,\{ttl,force\}\)/);
  assert.match(runtime,/if\(!force&&entry\?\.value&&now<entry\.expiresAt\)return entry\.value/);
  assert.match(runtime,/if\(entry\?\.inflight\)return entry\.inflight/);
});

test('stable Game Day keeps degraded-source truth when the runtime returns an older cached snapshot',()=>{
  assert.match(stable,/const cacheInfo=url=>runtime\?\.apiCacheInfo\?\.\(\)\.find\(row=>row\.url===url\)\|\|null/);
  assert.match(stable,/const updatedAt=Number\(cacheInfo\(url\)\?\.updatedAt\)\|\|0/);
  assert.match(stable,/fresh:Number\.isFinite\(age\)&&age<=Math\.max\(1000,ttl\)/);
  assert.match(stable,/const readHealthy=read=>read\?\.fresh!==false&&available\(read\?\.value\)/);
  assert.match(stable,/if\(available\(fan\)\)state\.fan=fan/);
  assert.match(stable,/Fan intel retrying · showing last good snapshot/);
});

test('manual Game Day refresh still forces the shared cache while automatic reads remain bounded',()=>{
  assert.match(stable,/sharedJson\('\/api\/fan-intel',\{ttl:LIVE_DATA_TTL_MS,force\}\)/);
  assert.match(stable,/sharedJson\('\/api\/espn-scoreboard',\{ttl:LIVE_DATA_TTL_MS,force\}\)/);
  assert.match(stable,/void refresh\(true,button\)/);
  assert.match(stable,/const REFRESH_GUARD_MS=10000/);
  assert.match(stable,/const LIVE_REFRESH_MS=30000/);
});

test('shared cache adoption adds no new Game Day global snapshot or lifecycle owner',()=>{
  assert.doesNotMatch(stable,/window\.TitansGameDay/);
  assert.doesNotMatch(addon,/window\.TitansGameDay/);
  assert.doesNotMatch(stable,/dispatchEvent\(new CustomEvent/);
  assert.doesNotMatch(addon,/dispatchEvent\(new CustomEvent/);
  assert.doesNotMatch(stable,/fetch\('\/api\/fan-intel'/);
  assert.doesNotMatch(addon,/fetch\('\/api\/fan-intel'/);
});
