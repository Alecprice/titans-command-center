import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {neonWarehouseDisabled,productionDataEnv} from '../cloudflare/production-worker.mjs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('production boundary hides DATABASE_URL when Neon warehouse cutover is enabled',()=>{
  const d1={prepare(){}};
  const env={DATABASE_URL:'postgresql://example.invalid/titans',TITANS_DB:d1,ASSETS:{fetch(){}},NEON_WAREHOUSE_DISABLED:'true'};
  assert.equal(neonWarehouseDisabled(env),true);
  const cutover=productionDataEnv(env);
  assert.equal(cutover.DATABASE_URL,undefined);
  assert.equal('DATABASE_URL' in cutover,false);
  assert.equal(cutover.TITANS_DB,d1);
  assert.equal(cutover.ASSETS,env.ASSETS);
  assert.equal(env.DATABASE_URL,'postgresql://example.invalid/titans');
});

test('production boundary preserves warehouse access when rollback flag is disabled',()=>{
  const env={DATABASE_URL:'postgresql://example.invalid/titans',NEON_WAREHOUSE_DISABLED:'false'};
  assert.equal(neonWarehouseDisabled(env),false);
  assert.equal(productionDataEnv(env),env);
  assert.equal(productionDataEnv(env).DATABASE_URL,env.DATABASE_URL);
});

test('wrangler routes production through the D1-primary boundary while retaining rollback secret',()=>{
  const config=JSON.parse(read('wrangler.jsonc'));
  assert.equal(config.main,'cloudflare/production-worker.mjs');
  assert.equal(config.vars?.NEON_WAREHOUSE_DISABLED,'true');
  assert.ok(config.secrets?.required?.includes('DATABASE_URL'));
  assert.ok(config.d1_databases?.some(entry=>entry.binding==='TITANS_DB'&&entry.database_name==='titans-command-center'));
});

test('Neon Auth remains independent of DATABASE_URL warehouse cutover',()=>{
  const account=read('src/account-api.mjs');
  assert.match(account,/const AUTH_ORIGIN='https:\/\/[^']+\.neonauth\.[^']+\/neondb\/auth'/);
  assert.doesNotMatch(account,/AUTH_ORIGIN=.*DATABASE_URL/);
  assert.match(account,/hasD1\(env\)/);
});
