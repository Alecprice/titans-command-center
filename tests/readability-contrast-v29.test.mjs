import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync(new URL('../readability-v28.css',import.meta.url),'utf8');

test('dark surfaces use visibly lighter secondary text',()=>{
  assert.match(css,/\.sidebar \.nav a[\s\S]*color:#b8ccdc/);
  assert.match(css,/\.search-wrap input::placeholder\{color:#9eb4c7\}/);
  assert.match(css,/\.footer-note,\.footer-note a\{color:#a9bfd2!important\}/);
});

test('small Tennessee-blue text on white is darkened without changing accents',()=>{
  assert.match(css,/--tcc-readable-blue-text:#28689f/);
  assert.match(css,/\.depth-position a b[\s\S]*var\(--tcc-readable-blue-text\)!important/);
});

test('tiny Team Room metadata has a readable floor',()=>{
  assert.match(css,/\.depth-position-head small,\.leadership-grid small,\.staff-row span\{font-size:11px!important\}/);
  assert.match(css,/\.staff-row strong\{font-size:12px/);
  assert.match(css,/\.baseline-grid li\{font-size:12px/);
});

test('mobile reading text is promoted and inputs avoid iOS zoom',()=>{
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/font-size:16px!important/);
  assert.match(css,/\.page-head p,\.intel-item p,\.player-card p,\.source-card p,\.timeline-item p\{font-size:13px/);
});

test('higher-contrast user preference gets stronger text values',()=>{
  assert.match(css,/@media\(prefers-contrast:more\)/);
  assert.match(css,/--tcc-readable-blue-text:#174f7d/);
  assert.match(css,/color:#e2edf5/);
});
