import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const sw=read('sw.js');
const data=read('src/data.mjs');
const build=read('scripts/build-cloudflare.mjs');
const preseason=read('src/preseason-api.mjs');

test('Aug 26 fallback module is imported by the canonical data layer',()=>{
  assert.match(data,/roster-audit-20260826\.mjs/);
  assert.match(data,/auditedRoster20260826/);
});

test('Aug 26 fallback module is available in the offline PWA shell',()=>{
  assert.match(sw,/titans-cc-brand-2026-v61/);
  assert.match(sw,/\/src\/roster-audit-20260826\.mjs/);
});

test('Cloudflare static build packages the imported Aug 26 fallback dependency',()=>{
  assert.match(build,/'src\/roster-audit-20260826\.mjs'/);
});

test('Stats Lab outage fallback agrees with canonical Aug 26 roster truth',()=>{
  assert.match(preseason,/roster-audit-20260826\.mjs/);
  assert.match(preseason,/auditedRoster20260826/);
  assert.match(preseason,/95-player Aug\. 26 audited roster snapshot/);
  assert.doesNotMatch(preseason,/96-player Aug\. 24 audited roster snapshot/);
});
