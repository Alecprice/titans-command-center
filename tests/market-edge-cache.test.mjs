import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Cloudflare market edge cache only serves queryless GET requests',()=>{
  const worker=read('cloudflare/worker.mjs');
  assert.match(worker,/async function cachedMarketData\(request,env,ctx\)/);
  assert.match(worker,/request\.method!=='GET'\|\|url\.searchParams\.size/);
  assert.match(worker,/X-Titans-Edge-Cache/);
  assert.match(worker,/'BYPASS'/);
  assert.match(worker,/'HIT'/);
  assert.match(worker,/'MISS'/);
});

test('market cache writes are non-blocking and failure-tolerant',()=>{
  const worker=read('cloudflare/worker.mjs');
  assert.match(worker,/cache\.put\(key,fresh\.clone\(\)\)\.catch/);
  assert.match(worker,/ctx\?\.waitUntil\)ctx\.waitUntil\(write\)/);
  assert.match(worker,/if\(route==='market-data'\)return await cachedMarketData\(request,env,ctx\)/);
  assert.match(worker,/async fetch\(request,env,ctx\)/);
});

test('market UI explicit refresh stays canonical while bypassing the browser cache',()=>{
  const hub=read('market-hub.js');
  assert.match(hub,/fetch\('\/api\/market-data',\{cache:force\?'no-store':'default'/);
  assert.match(hub,/cache:force\?'no-store':'default'/);
  assert.doesNotMatch(hub,/\/api\/market-data\?refresh=/);
  assert.doesNotMatch(hub,/market-data[^\n]*Date\.now\(\)|Date\.now\(\)[^\n]*market-data/);
});
