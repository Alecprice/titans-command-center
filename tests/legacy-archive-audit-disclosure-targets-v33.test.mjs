import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync(new URL('../legacy-polish.css',import.meta.url),'utf8');

test('Legacy archive audit disclosures keep the museum desktop interaction floor',()=>{
  assert.match(css,/\.archive-audit-detail summary\{[^}]*min-height:44px[^}]*box-sizing:border-box[^}]*padding:16px 0/);
  assert.doesNotMatch(css,/\.archive-audit-detail summary\{[^}]*min-height:(?:3[0-9]|4[0-3])px/);
});

test('Legacy archive audit disclosures keep a readable phone interaction floor',()=>{
  assert.match(css,/@media\(max-width:760px\)\{[\s\S]*?\.archive-audit-detail summary\{min-height:48px;font-size:12px;line-height:1\.35\}[\s\S]*?\}/);
  assert.doesNotMatch(css,/@media\(max-width:760px\)\{[\s\S]*?\.archive-audit-detail summary\{[^}]*min-height:(?:3[0-9]|4[0-7])px/);
});

test('Archive audit disclosures preserve native summary semantics, focus, and CSS safety',()=>{
  assert.match(css,/\.legacy-page summary:focus-visible/);
  assert.match(css,/\.archive-audit-detail summary\{[^}]*cursor:pointer/);
  assert.doesNotMatch(css,/\.archive-audit-detail summary\{[^}]*display:(?:flex|block|grid)/);
  assert.doesNotMatch(css,/javascript:|expression\s*\(/i);
});
