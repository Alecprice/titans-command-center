import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');

test('Cloudflare owns the public scoreboard route and treats provider loss as optional data',()=>{
  assert.match(worker,/async function nativeScoreboard/);
  assert.match(worker,/if\(route==='espn-scoreboard'\)return await nativeScoreboard\(request,env\)/);
  assert.match(worker,/const snapshot=await readD1Scoreboard\(env\)/);
  assert.match(worker,/const stale=await readD1Scoreboard\(env,\{allowExpired:true\}\)/);
  assert.match(worker,/available:false/);
  assert.match(worker,/payload:\{events:\[\]\}/);
  assert.match(worker,/Live scoreboard provider unavailable/);
  assert.match(worker,/return jsonResponse\(\{ok:false,provider:'ESPN'.*\},200,headers\)/s);
});

test('scoreboard route keeps bounded cache, method protection, and centralized refresh',()=>{
  assert.match(worker,/s-maxage=60, stale-while-revalidate=180/);
  assert.match(worker,/request\.method!=='GET'/);
  assert.match(worker,/AbortSignal\.timeout\(4500\)/);
  assert.match(worker,/SCOREBOARD_SNAPSHOT_TTL_SECONDS=240/);
  assert.match(worker,/NEAR_LIVE_CRON='\*\/3 \* \* \* \*'/);
  assert.match(worker,/runNearLiveScheduled\(env\)/);
});
