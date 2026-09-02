import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const script=read('fantasy-prop-trends-v133.js');
const css=read('fantasy-prop-trends-v133.css');
const html=read('index.html');
const sw=read('sw.js');

test('fantasy prop trend memory is observed-only and bounded',()=>{
  assert.match(script,/localStorage\.getItem\(STORE\)/);
  assert.match(script,/MAX_KEYS=120/);
  assert.match(script,/MAX_POINTS=8/);
  assert.match(script,/MIN_CAPTURE_MS=120000/);
  assert.match(script,/previously observed/);
  assert.doesNotMatch(script,/fetch\s*\(/);
  assert.doesNotMatch(script,/XMLHttpRequest/);
});

test('fantasy prop trend direction is based only on line delta',()=>{
  assert.match(script,/current\.line-previous\.line/);
  assert.match(script,/Line \$\{delta>0\?'up':'down'\}/);
  assert.match(script,/No line change/);
  assert.match(script,/First observed/);
  assert.doesNotMatch(script,/recommend|best bet|edge|lock/i);
});

test('fantasy prop trend decorator cannot recursively trigger its own observer',()=>{
  assert.match(script,/observer\?\.disconnect\(\)/);
  assert.match(script,/finally \{resumeObserver\(\)\}/);
  assert.match(script,/observer=new MutationObserver\(queue\)/);
  assert.match(script,/resumeObserver\(\)/);
});

test('fantasy prop trend UI is wired, mobile safe, and accessible',()=>{
  assert.match(html,/fantasy-prop-trends-v133\.css/);
  assert.match(html,/fantasy-prop-trends-v133\.js/);
  assert.match(script,/aria-live/);
  assert.match(script,/Reset line memory/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/@media\(forced-colors:active\)/);
  assert.match(css,/min-height:48px/);
});

test('installed PWA precaches the complete live Fantasy prop experience',()=>{
  assert.match(sw,/titans-cc-brand-2026-v78/);
  for(const asset of ['fantasy-props-v122.css','fantasy-prop-trends-v133.css','fantasy-props-v122.js','fantasy-prop-trends-v133.js']){
    assert.match(sw,new RegExp(asset.replaceAll('.','\\.')));
  }
});
