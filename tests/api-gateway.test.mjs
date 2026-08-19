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

async function run(method,query={},headers={}){
  const {state,res}=response();
  await api({method,query,headers},res);
  return state;
}

test('one serverless gateway owns the API directory',()=>{
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

test('Vercel rewrites preserve the public API contract',()=>{
  const config=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
  const map=new Map((config.rewrites||[]).map(item=>[item.source,item.destination]));
  for(const route of ['health','data','player','analytics','odds','bluesky-search','espn-scoreboard','provider-health','sync','cron-refresh']){
    assert.equal(map.get(`/api/${route}`),`/api?route=${route}`);
  }
});
