import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');

test('TENX query cache preserves functional dimensions and discards cache-buster noise',()=>{
  assert.match(worker,/function queryAwareApiCacheKey\(request,keys=\[\]\)/);
  assert.match(worker,/for\(const key of \[\.\.\.keys\]\.sort\(\)\)/);
  assert.match(worker,/input\.searchParams\.get\(key\)/);
  assert.match(worker,/url\.searchParams\.set\(key,value\)/);
});

test('player and advanced analytics use query-aware Cloudflare edge caching',()=>{
  assert.match(worker,/route==='player'\)return await cachedQueryAdapterData\(request,route,playerProfileRoute,env,ctx,\['id'\]\)/);
  assert.match(worker,/route==='advanced-analytics'\)return await cachedQueryAdapterData\(request,route,advancedAnalyticsRoute,env,ctx,\['season','team'\]\)/);
  assert.match(worker,/QUERY_CACHE_CONTROL='public, s-maxage=900, stale-while-revalidate=21600'/);
});

test('degraded and private responses cannot enter the query edge cache',()=>{
  assert.match(worker,/function edgeResponseCacheable\(response\)/);
  assert.match(worker,/response\.ok&&!policy\.includes\('no-store'\)&&!policy\.includes\('private'\)/);
  assert.match(worker,/if\(edgeResponseCacheable\(fresh\)\)/);
});
