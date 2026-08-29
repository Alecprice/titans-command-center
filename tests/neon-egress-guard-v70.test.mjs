import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');

test('bootstrap data is cached at the Cloudflare edge with a free-tier-safe freshness budget',()=>{
  assert.match(worker,/async function cachedNativeData\(/);
  assert.match(worker,/cache\.match\(key\)/);
  assert.match(worker,/cache\.put\(key,fresh\.clone\(\)\)/);
  assert.match(worker,/route==='data'\)return await cachedNativeData\(request,env,ctx\)/);
  assert.match(worker,/X-Titans-Edge-Cache/);
  assert.match(worker,/s-maxage=900, stale-while-revalidate=21600/);
});

test('bootstrap cache keys ignore audit/cache-buster query strings instead of forcing Neon reads',()=>{
  const block=worker.match(/async function cachedNativeData\([\s\S]*?\n\}/)?.[0]||'';
  assert.match(block,/if\(request\.method!=='GET'\)/);
  assert.doesNotMatch(block,/searchParams\.size/);
  assert.match(worker,/function apiCacheKey\(request\)[\s\S]*?url\.search=''/);
});

test('database health stays strict while healthy Fan Intel can cache and degraded Fan Intel bypasses cache',()=>{
  assert.match(worker,/route==='health'\)return await nativeHealth\(request,env\)/);
  assert.match(worker,/nativeHealth[\s\S]*Cache-Control':'no-store/);
  assert.match(worker,/async function resilientFanIntel\([\s\S]*cachedAdapterData\(request,'fan-intel',fanIntelRoute,env,ctx\)/);
  assert.match(worker,/resilientFanIntel[\s\S]*response\.status<500[\s\S]*Cache-Control':'no-store'[\s\S]*'BYPASS'/);
  assert.doesNotMatch(worker,/cachedNativeData\(request,env,ctx\)[\s\S]{0,120}health/);
});

test('failed bootstrap responses are never written into the edge cache',()=>{
  assert.match(worker,/const fresh=await nativeData\(request,env\);\s*if\(fresh\.ok\)/);
});
