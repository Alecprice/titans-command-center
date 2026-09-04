import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync(new URL('../legacy-polish.css',import.meta.url),'utf8');

test('Legacy visual-audit source chips keep the museum desktop interaction floor',()=>{
  assert.match(css,/\.visual-audit-source-chips a\{[^}]*min-height:44px/);
  assert.doesNotMatch(css,/\.visual-audit-source-chips a\{[^}]*min-height:(?:3[0-9]|4[0-3])px/);
});

test('Legacy visual-audit source chips keep the museum phone interaction floor',()=>{
  assert.match(css,/@media\(max-width:760px\)\{[\s\S]*?\.visual-audit-source-chips a\{min-height:48px\}[\s\S]*?\}/);
  assert.doesNotMatch(css,/@media\(max-width:760px\)\{[\s\S]*?\.visual-audit-source-chips a\{min-height:(?:3[0-9]|4[0-7])px\}/);
});

test('Visual-audit source chips retain keyboard focus visibility and stay CSS-only',()=>{
  assert.match(css,/\.legacy-page a:focus-visible/);
  assert.match(css,/\.visual-audit-source-chips a:hover/);
  assert.doesNotMatch(css,/javascript:|expression\s*\(/i);
});
