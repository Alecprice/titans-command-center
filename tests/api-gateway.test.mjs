import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import api from '../api/index.js';

function response(){
  const state={status:200,headers:{},body:null};
  const res={
    setHeader(k,v){state.headers[k]=v;return res},
    status(code){state.status=code;return res},
    json(body){state.body=body;return res}
  };
  return {state,res};
}

async function run(method,query={},headers={},env){
  const {state,res}=response();
  await api({method,query,headers},res,env);
  return state;
}

test('one compatibility gateway owns the API directory',()=>{
  const files=fs.readdirSync(new URL('../api/',import.meta.url)).filter(name=>name.endsWith('.js')).sort();
  assert.deepEqual(files,['index.js']);
});

test('gateway rejects unknown routes cleanly',async()=>{
  const result=await run('GET',{route:'missing'});
  assert.equal(result.status,404);
  assert.equal(result.body?.ok,false);
});

test('public odds route rejects cache-busting query params before provider calls',async()=>{
  const result=await run('GET',{route:'odds',cacheBust:'1'});
  assert.equal(result.status,400);
  assert.match(result.body?.error||'',/does not accept query/i);
});

test('sync remains POST-only before auth is evaluated',async()=>{
  const result=await run('GET',{route:'sync'});
  assert.equal(result.status,405);
});

test('provider diagnostics remain GET-only',async()=>{
  const result=await run('POST',{route:'provider-health'});
  assert.equal(result.status,405);
});

test('Cloudflare Worker owns public API routing and retired Vercel config stays absent',()=>{
  const root=new URL('../',import.meta.url);
  const worker=fs.readFileSync(new URL('cloudflare/worker.mjs',root),'utf8');
  assert.equal(fs.existsSync(new URL('vercel.json',root)),false);
  assert.match(worker,/const API_PREFIX='\/api\/'/);
  assert.match(worker,/pathname\.startsWith\(API_PREFIX\)/);
  assert.match(worker,/import apiHandler from '\.\.\/api\/index\.js'/);
  for(const route of ['health','data','player','preseason-stats','market-data','advanced-analytics','espn-scoreboard']){
    assert.match(worker,new RegExp(`route==='${route}'`));
  }
  assert.doesNotMatch(worker,/vercelRequest|vercelResponse/);
});

test('legacy warehouse gateway routes are explicit retired states and never database fallbacks',async()=>{
  for(const route of ['health','data','analytics','player']){
    const result=await run('GET',{route},{},{DATABASE_URL:'postgres://must-never-be-read.invalid/db'});
    assert.equal(result.status,503,`${route} should be retired in the legacy gateway`);
    assert.equal(result.headers['Cache-Control'],'no-store');
    assert.equal(result.body?.ok,false);
    assert.equal(result.body?.code,'WAREHOUSE_ROUTE_RETIRED');
    assert.equal(result.body?.route,route);
    assert.match(result.body?.error||'',/Cloudflare D1 Worker/i);
  }
});

test('legacy gateway has no Neon warehouse adapter import or query helpers',()=>{
  const source=fs.readFileSync(new URL('../api/index.js',import.meta.url),'utf8');
  assert.doesNotMatch(source,/from ['"]\.\.\/src\/db\.mjs['"]/);
  assert.doesNotMatch(source,/databaseHealth\(|getBootstrapData\(|getAnalyticsExplorer\(|getPlayerProfile\(|getSql\(/);
  assert.match(source,/\['health',retiredWarehouseRoute\]/);
  assert.match(source,/\['data',retiredWarehouseRoute\]/);
  assert.match(source,/\['analytics',retiredWarehouseRoute\]/);
  assert.match(source,/\['player',retiredWarehouseRoute\]/);
});

test('Bluesky limit parsing is finite integer bounded with a safe fallback',()=>{
  const source=fs.readFileSync(new URL('../api/index.js',import.meta.url),'utf8');
  assert.match(source,/rawLimit=Number\(query\.limit\|\|20\)/);
  assert.match(source,/Number\.isFinite\(rawLimit\)/);
  assert.match(source,/Math\.min\(50,Math\.max\(1,Math\.trunc\(rawLimit\)\)\):20/);
  assert.doesNotMatch(source,/Math\.min\(50,Math\.max\(1,Number\(query\.limit\|\|20\)\)\)/);
});
