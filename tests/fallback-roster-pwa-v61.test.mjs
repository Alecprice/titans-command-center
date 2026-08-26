import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const data=readFileSync(new URL('../src/data.mjs',import.meta.url),'utf8');

test('Aug 26 fallback module is imported by the canonical data layer',()=>{
  assert.match(data,/roster-audit-20260826\.mjs/);
  assert.match(data,/auditedRoster20260826/);
});

test('Aug 26 fallback module is available in the offline PWA shell',()=>{
  assert.match(sw,/titans-cc-brand-2026-v61/);
  assert.match(sw,/\/src\/roster-audit-20260826\.mjs/);
});
