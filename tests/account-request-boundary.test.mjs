import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../src/account-api.mjs',import.meta.url),'utf8');

test('state-changing account routes reject cross-site browser requests',()=>{
  assert.match(source,/function mutationIsCrossSite\(request\)/);
  assert.match(source,/sec-fetch-site/);
  assert.match(source,/new URL\(origin\)\.origin!==new URL\(request\.url\)\.origin/);
  assert.match(source,/request\.method==='POST'&&mutationIsCrossSite\(request\)/);
  assert.match(source,/request\.method==='PUT'&&mutationIsCrossSite\(request\)/);
  assert.match(source,/Cross-site account request rejected/);
});

test('account request bodies are bounded before proxying or parsing',()=>{
  assert.match(source,/MAX_AUTH_BODY_BYTES=32\*1024/);
  assert.match(source,/MAX_PREFERENCE_BODY_BYTES=32\*1024/);
  assert.match(source,/function declaredBodyTooLarge\(request,maxBytes\)/);
  assert.match(source,/async function limitedBody\(request,maxBytes\)/);
  assert.match(source,/body\.byteLength>maxBytes/);
  assert.match(source,/limitedBody\(request,MAX_AUTH_BODY_BYTES\)/);
  assert.match(source,/limitedBody\(request,MAX_PREFERENCE_BODY_BYTES\)/);
  assert.match(source,/Request body too large/);
});

test('preference writes reject malformed JSON instead of silently clearing preferences',()=>{
  assert.match(source,/JSON\.parse\(new TextDecoder\(\)\.decode\(limited\.body\)\|\|'\{\}'\)/);
  assert.match(source,/Invalid JSON body/);
  assert.doesNotMatch(source,/request\.json\(\)\.catch\(\(\)=>\(\{\}\)\)/);
});

test('account reads and guest session checks remain available without mutation checks',()=>{
  assert.match(source,/const allowedMethod=safe==='get-session'\?'GET':'POST'/);
  assert.match(source,/if\(request\.method==='POST'&&mutationIsCrossSite/);
  assert.match(source,/if\(request\.method==='PUT'&&mutationIsCrossSite/);
  assert.match(source,/if\(request\.method==='GET'\)\{/);
});
