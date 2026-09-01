import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const base=read('fan-enrichment-v13.js');
const addons=read('fan-enrichment-addons-v13.js');
const runtime=read('runtime-v19.js');

test('Fan Hub layers share runtime API cache when available',()=>{
  for(const js of [base,addons]){
    assert.match(js,/const runtime=window\.TitansRuntime/);
    assert.match(js,/const request=runtime\?\[/);
    assert.match(js,/runtime\.apiJson\('\/api\/data',\{ttl:30000\}\)/);
    assert.match(js,/runtime\.apiJson\('\/api\/fan-intel',\{ttl:30000\}\)/);
    assert.match(js,/Promise\.all\(request\)/);
  }
});

test('Fan Hub keeps direct no-store fetch fallback when runtime is unavailable',()=>{
  for(const js of [base,addons]){
    assert.match(js,/fetch\('\/api\/data',\{cache:'no-store'\}\)/);
    assert.match(js,/fetch\('\/api\/fan-intel',\{cache:'no-store'\}\)/);
  }
});

test('shared runtime cache deduplicates in-flight same-origin API requests',()=>{
  assert.match(runtime,/if\(!key\.startsWith\('\/api\/'\)\)throw new Error/);
  assert.match(runtime,/if\(entry\?\.inflight\)return entry\.inflight/);
  assert.match(runtime,/apiCache\.set\(key,\{value:entry\?\.value\|\|null/);
  assert.match(runtime,/expiresAt:Date\.now\(\)\+Math\.max\(0,Number\(ttl\)\|\|0\)/);
});

test('runtime adoption adds no new Fan Hub lifecycle ownership',()=>{
  assert.equal((base.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((addons.match(/new MutationObserver/g)||[]).length,1);
  assert.doesNotMatch(base,/setInterval\(/);
  assert.doesNotMatch(addons,/setInterval\(/);
});
