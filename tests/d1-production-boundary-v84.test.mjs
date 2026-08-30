import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {d1AuthoritativeHealth,neonWarehouseDisabled,productionDataEnv} from '../cloudflare/production-worker.mjs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

class FakeD1{
  constructor(snapshot=null){this.snapshot=snapshot;}
  prepare(sql){
    const db=this,query=String(sql).replace(/\s+/g,' ').trim().toLowerCase();
    return {
      bind(){
        return {async first(){return query.includes('from api_snapshots')?db.snapshot:null;}};
      },
      async first(){return query.includes('select 1 as ok')?{ok:1}:null;}
    };
  }
}

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

test('production boundary is already safe when DATABASE_URL is absent',()=>{
  const d1={prepare(){}};
  const env={TITANS_DB:d1,ASSETS:{fetch(){}},NEON_WAREHOUSE_DISABLED:'true'};
  const cutover=productionDataEnv(env);
  assert.equal(cutover.DATABASE_URL,undefined);
  assert.equal('DATABASE_URL' in cutover,false);
  assert.equal(cutover.TITANS_DB,d1);
});

test('production boundary preserves warehouse access when rollback flag is disabled',()=>{
  const env={DATABASE_URL:'postgresql://example.invalid/titans',NEON_WAREHOUSE_DISABLED:'false'};
  assert.equal(neonWarehouseDisabled(env),false);
  assert.equal(productionDataEnv(env),env);
  assert.equal(productionDataEnv(env).DATABASE_URL,env.DATABASE_URL);
});

test('D1 health is authoritative when warehouse cutover is enabled and bootstrap snapshot is fresh',async()=>{
  const snapshot={cache_key:'bootstrap:v1',payload:{ok:true,dataQuality:{contentAuditAt:'2026-08-27T00:00:00.000Z'}},source:'audited-fallback',fetched_at:new Date().toISOString(),expires_at:new Date(Date.now()+60_000).toISOString()};
  const env={DATABASE_URL:'postgresql://example.invalid/titans',TITANS_DB:new FakeD1(snapshot),NEON_WAREHOUSE_DISABLED:'true'};
  const response=await d1AuthoritativeHealth(new Request('https://example.test/api/health'),env,{});
  const body=await response.json();
  assert.equal(response.status,200);
  assert.equal(body.status,'healthy');
  assert.equal(body.database.provider,'cloudflare-d1');
  assert.equal(body.database.configured,true);
  assert.equal(body.database.ok,true);
  assert.equal(body.database.snapshotFresh,true);
  assert.equal(body.database.warehouse.configured,true);
  assert.equal(body.database.warehouse.disabled,true);
  assert.equal(body.storage.primary,'cloudflare-d1');
  assert.equal(body.contentAudit,'2026-08-27T00:00:00.000Z');
});

test('D1 health remains authoritative with no warehouse secret at all',async()=>{
  const snapshot={cache_key:'bootstrap:v1',payload:{ok:true},source:'audited-fallback',fetched_at:new Date().toISOString(),expires_at:new Date(Date.now()+60_000).toISOString()};
  const env={TITANS_DB:new FakeD1(snapshot),NEON_WAREHOUSE_DISABLED:'true'};
  const response=await d1AuthoritativeHealth(new Request('https://example.test/api/health'),env,{});
  const body=await response.json();
  assert.equal(body.status,'healthy');
  assert.equal(body.database.provider,'cloudflare-d1');
  assert.equal(body.database.warehouse.configured,false);
  assert.equal(body.database.warehouse.disabled,true);
});

test('D1 health degrades when the primary snapshot is not fresh even if the binding responds',async()=>{
  const env={DATABASE_URL:'postgresql://example.invalid/titans',TITANS_DB:new FakeD1(null),NEON_WAREHOUSE_DISABLED:'true'};
  const response=await d1AuthoritativeHealth(new Request('https://example.test/api/health'),env,{});
  const body=await response.json();
  assert.equal(body.status,'degraded');
  assert.equal(body.database.provider,'cloudflare-d1');
  assert.equal(body.database.configured,true);
  assert.equal(body.database.ok,false);
  assert.equal(body.database.snapshotFresh,false);
});

test('wrangler routes production through D1 without requiring a Neon warehouse secret',()=>{
  const config=JSON.parse(read('wrangler.jsonc'));
  assert.equal(config.main,'cloudflare/production-worker.mjs');
  assert.equal(config.vars?.NEON_WAREHOUSE_DISABLED,'true');
  assert.equal(config.secrets,undefined);
  assert.ok(config.d1_databases?.some(entry=>entry.binding==='TITANS_DB'&&entry.database_name==='titans-command-center'));
});

test('Cloudflare deploy workflow neither reads nor uploads DATABASE_URL',()=>{
  const workflow=read('.github/workflows/cloudflare-deploy.yml');
  assert.doesNotMatch(workflow,/DATABASE_URL/);
  assert.match(workflow,/steps\.creds\.outputs\.cloudflare == 'true'/);
  assert.match(workflow,/deploy --secrets-file \/tmp\/titans-worker-secrets\.json/);
});

test('Neon Auth remains independent of DATABASE_URL warehouse cutover',()=>{
  const account=read('src/account-api.mjs');
  assert.match(account,/const AUTH_ORIGIN='https:\/\/[^']+\.neonauth\.[^']+\/neondb\/auth'/);
  assert.doesNotMatch(account,/AUTH_ORIGIN=.*DATABASE_URL/);
  assert.match(account,/hasD1\(env\)/);
});
