import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const worker=read('cloudflare/worker.mjs');
const analytics=read('src/advanced-analytics-api.mjs');
const player=read('src/player-api.mjs');
const pkg=JSON.parse(read('package.json'));

test('TENX runtime keeps analytics and player reads materialized and warehouse-free',()=>{
  assert.equal(pkg.dependencies?.['@neondatabase/serverless'],undefined);
  assert.doesNotMatch(worker,/raw_payload|DATABASE_URL|getSql\(|@neondatabase\/serverless/);
  assert.match(analytics,/readApiSnapshot/);
  assert.match(player,/readApiSnapshot/);
});

test('account infrastructure failures never expose provider quota or billing text',()=>{
  assert.match(worker,/function accountInfrastructureFailure\(status\)\{return status===402\|\|status===429\|\|status>=500;\}/);
  assert.match(worker,/code:'ACCOUNT_SERVICE_UNAVAILABLE'/);
  assert.match(worker,/subpath==='get-session'\?guestSessionUnavailable\(\):accountServiceUnavailable\(response\.status\)/);
  assert.match(worker,/function accountServiceUnavailable\(status=503\)/);
  const message=worker.match(/function accountServiceUnavailable\(status=503\)\{return jsonResponse\(\{ok:false,error:'([^']+)'/)?.[1]||'';
  assert.ok(message.length>20,'Expected a fan-readable account outage message');
  assert.doesNotMatch(message,/Neon|quota|billing|upgrade|data transfer/i);
});
