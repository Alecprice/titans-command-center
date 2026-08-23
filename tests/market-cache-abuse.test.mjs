import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {marketDataRoute} from '../src/market-api.mjs';

function response(){
  const state={status:200,headers:{},body:null};
  const res={
    setHeader(name,value){state.headers[name]=value;return res;},
    status(code){state.status=code;return res;},
    json(body){state.body=body;return res;}
  };
  return {state,res};
}

test('Market Pulse rejects cache-busting query parameters before provider work',async()=>{
  const {state,res}=response();
  await marketDataRoute({method:'GET',query:{route:'market-data',cacheBust:'1'}},res,{});
  assert.equal(state.status,400);
  assert.equal(state.headers['Cache-Control'],'no-store');
  assert.match(state.body?.error||'',/does not accept query parameters/i);
});

test('Market Pulse still accepts the gateway route marker',async()=>{
  const {state,res}=response();
  // Deliberately use a non-GET method so this test proves the route marker itself
  // is not treated as an unsupported query without making an upstream request.
  await marketDataRoute({method:'POST',query:{route:'market-data'}},res,{});
  assert.equal(state.status,405);
  assert.equal(state.headers.Allow,'GET');
});

test('Market refresh uses the canonical endpoint without unique query URLs',()=>{
  const source=fs.readFileSync(new URL('../market-hub.js',import.meta.url),'utf8');
  assert.match(source,/fetch\('\/api\/market-data',\{cache:force\?'no-store':'default'/);
  assert.doesNotMatch(source,/\/api\/market-data\?refresh=/);
  assert.doesNotMatch(source,/Date\.now\(\).*market-data|market-data.*Date\.now\(\)/);
});
