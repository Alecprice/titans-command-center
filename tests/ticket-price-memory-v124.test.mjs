import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('ticket price fallback loads the bounded local price-memory layer',async()=>{
  const source=await read('tickets-price-fallback-v58.js');
  assert.match(source,/import '\.\/tickets-tenx-v123\.js';/);
  assert.match(source,/import '\.\/tickets-trend-v124\.js';/);
});

test('ticket price memory is explicit browser-observed history, not invented market history',async()=>{
  const source=await read('tickets-trend-v124.js');
  assert.match(source,/titans:tickets-price-memory-v124/);
  assert.match(source,/const TTL=30\*24\*60\*60\*1000/);
  assert.match(source,/const MAX_EVENTS=24/);
  assert.match(source,/const MAX_POINTS=12/);
  assert.match(source,/Only prices actually observed on this device are compared/);
  assert.match(source,/not marketplace-wide historical pricing/i);
  assert.match(source,/This browser now has a baseline/);
  assert.doesNotMatch(source,/fetch\(/);
});

test('ticket price memory reports drops rises flats and first observations from stored points',async()=>{
  const source=await read('tickets-trend-v124.js');
  assert.match(source,/kind:'down'/);
  assert.match(source,/kind:'up'/);
  assert.match(source,/kind:'flat'/);
  assert.match(source,/kind:'first'/);
  assert.match(source,/Previously observed at/);
  assert.match(source,/Reset price memory/);
  assert.match(source,/MIN_CAPTURE_AGE=4\*60\*1000/);
});

test('ticket price memory remains mobile-accessible and reduced-motion safe',async()=>{
  const css=await read('tickets-trend-v124.css');
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/min-height:46px/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/@media\(forced-colors:active\)/);
});