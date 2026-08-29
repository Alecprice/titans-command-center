import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const worker=read('cloudflare/worker.mjs');
const db=read('src/db.mjs');

test('TENX bootstrap and player queries do not transfer raw provider payloads',()=>{
  assert.doesNotMatch(db,/raw_payload/);
  assert.doesNotMatch(db,/select\s+mo\.\*/i);
  assert.doesNotMatch(db,/select\s+fs\.\*/i);
  assert.match(db,/select mo\.id,mo\.game_id,mo\.provider_event_id/);
  assert.match(db,/select fs\.id,fs\.market_type,fs\.market_name/);
});

test('account infrastructure failures never expose provider quota or billing text',()=>{
  assert.match(worker,/function accountInfrastructureFailure\(status\)\{return status===402\|\|status===429\|\|status>=500;\}/);
  assert.match(worker,/code:'ACCOUNT_SERVICE_UNAVAILABLE'/);
  assert.match(worker,/subpath==='get-session'\?guestSessionUnavailable\(\):accountServiceUnavailable\(\)/);
  const message=worker.match(/function accountServiceUnavailable\(\)\{return jsonResponse\(\{ok:false,error:'([^']+)'/)?.[1]||'';
  assert.ok(message.length>20,'Expected a fan-readable account outage message');
  assert.doesNotMatch(message,/Neon|quota|billing|upgrade|data transfer/i);
});
