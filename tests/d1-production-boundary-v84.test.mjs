import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../cloudflare/worker.mjs';
import {productionDataEnv} from '../cloudflare/production-worker.mjs';

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

test('production boundary always hides DATABASE_URL',()=>{
  const d1={prepare(){}};
  const env={DATABASE_URL:'postgresql://example.invalid/titans',TITANS_DB:d1,ASSETS:{fetch(){}}};
  const cutover=productionDataEnv(env);
  assert.equal(cutover.DATABASE_URL,undefined);
  assert.equal('DATABASE_URL' in cutover,false);
  assert.equal(cutover.TITANS_DB,d1);
  assert.equal(cutover.ASSETS,env.ASSETS);
  assert.equal(env.DATABASE_URL,'postgresql://example.invalid/titans');
});

test('production boundary is safe when DATABASE_URL is absent',()=>{
  const d1={prepare(){}};
  const env={TITANS_DB:d1,ASSETS:{fetch(){}}};
  const cutover=productionDataEnv(env);
  assert.equal(cutover.DATABASE_URL,undefined);
  assert.equal('DATABASE_URL' in cutover,false);
  assert.equal(cutover.TITANS_DB,d1);
});

test('legacy rollback flags cannot re-enable warehouse access',()=>{
  const env={DATABASE_URL:'postgresql://example.invalid/titans',NEON_WAREHOUSE_DISABLED:'false'};
  const cutover=productionDataEnv(env);
  assert.equal(cutover.DATABASE_URL,undefined);
  assert.equal('DATABASE_URL' in cutover,false);
});

test('Worker D1 health is authoritative with a fresh bootstrap snapshot',async()=>{
  const snapshot={cache_key:'bootstrap:v1',payload:{ok:true,dataQuality:{contentAuditAt:'2026-09-02T00:00:00.000Z'}},source:'audited-fallback',fetched_at:new Date().toISOString(),expires_at:new Date(Date.now()+60_000).toISOString()};
  const env={DATABASE_URL:'postgresql://example.invalid/titans',TITANS_DB:new FakeD1(snapshot)};
  const response=await worker.fetch(new Request('https://example.test/api/health'),productionDataEnv(env),{});
  const body=await response.json();
  assert.equal(response.status,200);
  assert.equal(body.status,'healthy');
  assert.equal(body.database.provider,'cloudflare-d1');
  assert.equal(body.database.configured,true);
  assert.equal(body.database.ok,true);
  assert.equal(body.database.snapshotFresh,true);
  assert.equal(body.database.warehouse,undefined);
  assert.equal(body.storage.primary,'cloudflare-d1');
  assert.equal(body.contentAudit,'2026-09-02T00:00:00.000Z');
});

test('Worker D1 health remains authoritative with no warehouse secret at all',async()=>{
  const snapshot={cache_key:'bootstrap:v1',payload:{ok:true,dataQuality:{contentAuditAt:'2026-09-02'}},source:'audited-fallback',fetched_at:new Date().toISOString(),expires_at:new Date(Date.now()+60_000).toISOString()};
  const env={TITANS_DB:new FakeD1(snapshot)};
  const response=await worker.fetch(new Request('https://example.test/api/health'),env,{});
  const body=await response.json();
  assert.equal(body.status,'healthy');
  assert.equal(body.database.provider,'cloudflare-d1');
  assert.equal(body.database.configured,true);
  assert.equal(body.database.ok,true);
  assert.equal(body.database.warehouse,undefined);
});

test('Worker D1 health degrades when the primary snapshot is not fresh even if the binding responds',async()=>{
  const env={TITANS_DB:new FakeD1(null)};
  const response=await worker.fetch(new Request('https://example.test/api/health'),env,{});
  const body=await response.json();
  assert.equal(body.status,'degraded');
  assert.equal(body.database.provider,'cloudflare-d1');
  assert.equal(body.database.configured,true);
  assert.equal(body.database.ok,false);
  assert.equal(body.database.snapshotFresh,false);
});

test('production wrapper only strips warehouse credentials and does not translate D1 health',()=>{
  const production=read('cloudflare/production-worker.mjs');
  assert.match(production,/productionDataEnv\(env\)/);
  assert.doesNotMatch(production,/d1AuthoritativeHealth|d1Health|getD1Snapshot|BOOTSTRAP_SNAPSHOT_KEY|pathname==='\/api\/health'/);
});

test('Advanced Analytics owns D1 outage behavior without a production-wrapper translator',()=>{
  const production=read('cloudflare/production-worker.mjs');
  const analytics=read('src/advanced-analytics-api.mjs');
  assert.doesNotMatch(production,/d1WarehouseFallback|pathname==='\/api\/advanced-analytics'/);
  assert.match(analytics,/readApiSnapshot\(env,snapshotKey\)/);
  assert.match(analytics,/allowExpired:true/);
  assert.match(analytics,/status:'database-unavailable'/);
  assert.match(analytics,/Cache-Control','no-store/);
});

test('wrangler makes D1 primary without any Neon warehouse rollback variable or secret requirement',()=>{
  const config=JSON.parse(read('wrangler.jsonc'));
  assert.equal(config.main,'cloudflare/production-worker.mjs');
  assert.equal(config.vars,undefined);
  assert.equal(config.secrets,undefined);
  assert.ok(config.d1_databases?.some(entry=>entry.binding==='TITANS_DB'&&entry.database_name==='titans-command-center'));
  assert.doesNotMatch(read('wrangler.jsonc'),/NEON_WAREHOUSE_DISABLED|DATABASE_URL/);
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