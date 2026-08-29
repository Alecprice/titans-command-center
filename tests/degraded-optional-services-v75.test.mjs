import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cloudflare/worker.mjs';

const BASE='https://titans-command-center.alecjordanprice.workers.dev';
const ctx={waitUntil(){}};

async function json(response){return response.json();}

function sameOriginPost(path,body={}){
  return new Request(`${BASE}${path}`,{
    method:'POST',
    headers:{'Content-Type':'application/json','Origin':BASE},
    body:JSON.stringify(body)
  });
}

test('Fan Intel degrades to an explicit empty 200 state when Neon is unavailable',async()=>{
  const response=await worker.fetch(new Request(`${BASE}/api/fan-intel`),{},ctx);
  assert.equal(response.status,200);
  assert.equal(response.headers.get('cache-control'),'no-store');
  assert.equal(response.headers.get('x-titans-edge-cache'),'BYPASS');
  const body=await json(response);
  assert.equal(body.ok,true);
  assert.equal(body.available,false);
  assert.equal(body.configured,false);
  assert.equal(body.mode,'database-unavailable');
  assert.deepEqual(body.standings,[]);
  assert.deepEqual(body.injuries,[]);
  assert.deepEqual(body.contracts,[]);
  assert.equal(body.opponent,null);
  assert.deepEqual(body.gameDay,{drives:[],plays:[],teamMetrics:[]});
  assert.deepEqual(body.playerStats,[]);
  assert.ok(Object.values(body.availability).every(value=>value===false));
  assert.ok(body.diagnostics.some(note=>/unavailable/i.test(note)));
});

test('guest session lookup turns an auth 5xx into a guest-safe 200 response',async()=>{
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>new Response(JSON.stringify({error:'database unavailable'}),{status:500,headers:{'Content-Type':'application/json'}});
  try{
    const response=await worker.fetch(new Request(`${BASE}/api/account/auth/get-session`),{},ctx);
    assert.equal(response.status,200);
    assert.equal(response.headers.get('cache-control'),'no-store');
    const body=await json(response);
    assert.equal(body.ok,true);
    assert.equal(body.user,null);
    assert.equal(body.session,null);
    assert.equal(body.guest,true);
    assert.equal(body.available,false);
    assert.equal(body.code,'ACCOUNT_SERVICE_UNAVAILABLE');
  }finally{globalThis.fetch=originalFetch;}
});

test('guest session lookup also stays guest-safe on an auth network failure',async()=>{
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>{throw new Error('auth offline');};
  try{
    const response=await worker.fetch(new Request(`${BASE}/api/account/auth/get-session`),{},ctx);
    assert.equal(response.status,200);
    const body=await json(response);
    assert.equal(body.guest,true);
    assert.equal(body.available,false);
  }finally{globalThis.fetch=originalFetch;}
});

test('sign-in remains fail-closed when the auth provider returns a server error',async()=>{
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>new Response(JSON.stringify({error:'database unavailable'}),{status:500,headers:{'Content-Type':'application/json'}});
  try{
    const response=await worker.fetch(sameOriginPost('/api/account/auth/sign-in/email',{email:'fan@example.com',password:'not-a-real-password'}),{},ctx);
    assert.equal(response.status,500);
  }finally{globalThis.fetch=originalFetch;}
});

test('sign-in remains fail-closed when the auth provider cannot be reached',async()=>{
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>{throw new Error('auth offline');};
  try{
    const response=await worker.fetch(sameOriginPost('/api/account/auth/sign-in/email',{email:'fan@example.com',password:'not-a-real-password'}),{},ctx);
    assert.equal(response.status,503);
    const body=await json(response);
    assert.equal(body.ok,false);
  }finally{globalThis.fetch=originalFetch;}
});
