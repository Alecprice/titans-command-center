import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('TENX mobile readability keeps supporting text legible',()=>{
  assert.match(runtime,/#app small\{font-size:12px!important;line-height:1\.45!important\}/);
  assert.match(runtime,/size<12/);
  assert.match(runtime,/small,p,li,span,a,label,time/);
});

test('TENX mobile controls are readable and thumb friendly',()=>{
  assert.match(runtime,/font-size:14px!important;line-height:1\.25!important/);
  assert.match(runtime,/min-width:44px!important/);
  assert.match(runtime,/min-height:44px!important/);
  assert.match(runtime,/\.mobile-nav a,\.mobile-nav button\{font-size:11px!important;line-height:1\.15!important;min-height:52px!important\}/);
  assert.match(runtime,/\.sidebar \.nav a\{font-size:14px!important;line-height:1\.25!important;min-height:48px!important\}/);
});

test('TENX mobile layout preserves useful reading width',()=>{
  assert.match(runtime,/\.content\{padding-left:14px!important;padding-right:14px!important\}/);
  assert.match(runtime,/\.panel-body\{padding-left:14px!important;padding-right:14px!important\}/);
  assert.match(runtime,/@media \(max-width:390px\)/);
});