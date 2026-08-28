import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {accountMutationIsCrossSite} from '../src/account-api.mjs';

const source=fs.readFileSync(new URL('../src/account-api.mjs',import.meta.url),'utf8');

test('state-changing account routes reject untrusted cross-site browser requests',()=>{
  assert.match(source,/function accountMutationIsCrossSite\(request\)/);
  assert.match(source,/TRUSTED_ACCOUNT_ORIGINS/);
  assert.match(source,/request\.method==='POST'&&accountMutationIsCrossSite\(request\)/);
  assert.match(source,/request\.method==='PUT'&&accountMutationIsCrossSite\(request\)/);
  assert.match(source,/Cross-site account request rejected/);

  const malicious=new Request('https://titans-command-center.alecjordanprice.workers.dev/api/account/auth/sign-in/email',{
    method:'POST',
    headers:{origin:'https://evil.example','sec-fetch-site':'cross-site'}
  });
  assert.equal(accountMutationIsCrossSite(malicious),true);
});

test('trusted Titans public origins survive the custom-domain to Worker boundary',()=>{
  const proxiedMobile=new Request('https://titans-command-center.alecjordanprice.workers.dev/api/account/auth/sign-in/email',{
    method:'POST',
    headers:{origin:'https://titans-command-center.alecjprice.com','sec-fetch-site':'cross-site'}
  });
  assert.equal(accountMutationIsCrossSite(proxiedMobile),false);

  const directCustomDomain=new Request('https://titans-command-center.alecjprice.com/api/account/preferences',{
    method:'PUT',
    headers:{origin:'https://titans-command-center.alecjprice.com','sec-fetch-site':'same-origin'}
  });
  assert.equal(accountMutationIsCrossSite(directCustomDomain),false);
});

test('fetch metadata remains a fallback when Origin is absent',()=>{
  const crossSiteWithoutOrigin=new Request('https://titans-command-center.alecjordanprice.workers.dev/api/account/auth/sign-out',{
    method:'POST',
    headers:{'sec-fetch-site':'cross-site'}
  });
  assert.equal(accountMutationIsCrossSite(crossSiteWithoutOrigin),true);

  const sameOriginWithoutOrigin=new Request('https://titans-command-center.alecjordanprice.workers.dev/api/account/auth/sign-out',{
    method:'POST',
    headers:{'sec-fetch-site':'same-origin'}
  });
  assert.equal(accountMutationIsCrossSite(sameOriginWithoutOrigin),false);
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
  assert.match(source,/if\(request\.method==='POST'&&accountMutationIsCrossSite/);
  assert.match(source,/if\(request\.method==='PUT'&&accountMutationIsCrossSite/);
  assert.match(source,/if\(request\.method==='GET'\)\{/);
});
