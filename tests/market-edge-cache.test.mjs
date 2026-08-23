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

test('market UI explicit refresh continues using a cache-busting no-store request',()=>{
  const hub=read('market-hub.js');
  assert.match(hub,/force\?`\/api\/market-data\?refresh=\$\{Date\.now\(\)\}`:'\/api\/market-data'/);
  assert.match(hub,/cache:force\?'no-store':'default'/);
});
