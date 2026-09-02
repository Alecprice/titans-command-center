import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('TENX mobile pass makes the bottom More action the canonical phone drawer control',()=>{
  assert.match(html,/id="mobile-more-button"/);
  assert.match(runtime,/\.menu-button\{display:none!important\}/);
  assert.match(runtime,/\.topbar\{padding-left:12px!important\}/);
  assert.match(runtime,/const mobileMore=document\.querySelector\('#mobile-more-button'\)/);
  assert.match(runtime,/mobileTypeFloor\.matches\?mobileMore:menu/);
});

test('TENX mobile pass prevents iOS form zoom and keeps thumb targets readable',()=>{
  assert.match(runtime,/\.search-wrap input\{/);
  assert.match(runtime,/font-size:16px!important/);
  assert.match(runtime,/min-width:44px!important/);
  assert.match(runtime,/min-height:44px!important/);
  assert.match(runtime,/\.mobile-nav a,\.mobile-nav button\{font-size:11px!important;line-height:1\.15!important;min-height:52px!important\}/);
});

test('TENX small-phone navigation stays compact instead of becoming a long one-column sheet',()=>{
  assert.match(runtime,/\.sidebar \.nav\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important\}/);
  assert.match(runtime,/\.sidebar \.nav a\{font-size:14px!important;line-height:1\.25!important;min-height:48px!important\}/);
});
