import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../legacy-anniversary-v9.js',import.meta.url),'utf8');

test('anniversary lens keeps readable desktop secondary type',()=>{
  assert.match(js,/\.legacy-anniversary-head small\{[^}]*font-size:10px/);
  assert.match(js,/\.legacy-anniversary-head p\{[^}]*font-size:12px/);
  assert.match(js,/\.legacy-anniversary-card>small\{[^}]*font-size:10px/);
  assert.match(js,/\.legacy-anniversary-card span\{[^}]*font-size:11px/);
  assert.match(js,/\.legacy-anniversary-card button\{[^}]*min-height:44px[^}]*font-size:11px/);
  assert.doesNotMatch(js,/\.legacy-anniversary-(?:head small|card>small)\{[^}]*font-size:8px/);
  assert.doesNotMatch(js,/\.legacy-anniversary-card button\{[^}]*font-size:8px/);
});

test('anniversary lens preserves the stronger phone readability and touch floor',()=>{
  assert.match(js,/@media\(max-width:760px\)\{[^\n]*\.legacy-anniversary-head small\{font-size:12px;line-height:1\.35\}/);
  assert.match(js,/@media\(max-width:760px\)\{[^\n]*\.legacy-anniversary-head p\{font-size:14px;line-height:1\.6\}/);
  assert.match(js,/@media\(max-width:760px\)\{[^\n]*\.legacy-anniversary-card>small\{font-size:12px;line-height:1\.35\}/);
  assert.match(js,/@media\(max-width:760px\)\{[^\n]*\.legacy-anniversary-card span\{font-size:13px;line-height:1\.5\}/);
  assert.match(js,/@media\(max-width:760px\)\{[^\n]*\.legacy-anniversary-card button\{min-height:48px;font-size:12px;line-height:1\.25\}/);
  assert.match(js,/button:focus-visible\{outline:3px/);
  assert.match(js,/prefers-reduced-motion:reduce/);
  assert.match(js,/forced-colors:active/);
});

test('anniversary lens remains DOM-derived and delegates exact exhibit opening',()=>{
  assert.match(js,/querySelectorAll\('\.legacy-moment-card'\)/);
  assert.match(js,/querySelector\('\.legacy-moment-date'\)/);
  assert.match(js,/controller\?\.focusExhibit/);
  assert.match(js,/history|hashchange/);
  assert.doesNotMatch(js,/\bfetch\s*\(/);
  assert.doesNotMatch(js,/localStorage|sessionStorage/);
});
