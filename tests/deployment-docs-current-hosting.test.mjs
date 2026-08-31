import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const deployment=read('docs/DEPLOYMENT.md');
const freeTier=read('docs/FREE_TIER_DEPLOYMENT.md');

test('deployment docs identify Cloudflare and D1 as the current production path',()=>{
  for (const doc of [deployment,freeTier]) {
    assert.match(doc,/Cloudflare Worker \+ Static Assets/);
    assert.match(doc,/Cloudflare D1/);
    assert.match(doc,/vercel\.json` is intentionally absent/);
    assert.match(doc,/Vercel .*not (?:a )?(?:release target|production)/i);
  }
});

test('retired Vercel configuration cannot be described as a current compatibility surface',()=>{
  assert.equal(fs.existsSync(new URL('../vercel.json',import.meta.url)),false);
  assert.doesNotMatch(deployment,/Old Vercel configuration may remain/i);
  assert.doesNotMatch(freeTier,/remaining `vercel\.json`\/gateway compatibility files/i);
});

test('compatibility gateway is documented without restoring Vercel ownership',()=>{
  assert.match(deployment,/`api\/index\.js` remains only as a compatibility gateway module imported by the Cloudflare Worker/);
  assert.match(freeTier,/Cloudflare Worker still imports it as a compatibility gateway/);
  assert.match(deployment,/does \*\*not\*\* make Vercel a deployment target or release authority/);
});
