import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('ticket bundle loads saved matchup compare after decision and price-memory layers',async()=>{
  const source=await read('tickets-price-fallback-v58.js');
  assert.match(source,/import '\.\/tickets-tenx-v123\.js';/);
  assert.match(source,/import '\.\/tickets-trend-v124\.js';/);
  assert.match(source,/import '\.\/tickets-compare-v125\.js';/);
});

test('saved matchup compare reuses shortlist and observed price memory without new provider traffic',async()=>{
  const source=await read('tickets-compare-v125.js');
  assert.match(source,/titans:tickets-shortlist-v123/);
  assert.match(source,/titans:tickets-price-memory-v124/);
  assert.match(source,/const MAX_SAVED=3/);
  assert.match(source,/live starting prices, source counts, and browser-observed movement/);
  assert.match(source,/Seat quality and checkout fees are not inferred/);
  assert.doesNotMatch(source,/fetch\(/);
});

test('saved matchup compare provides factual leaders and party totals',async()=>{
  const source=await read('tickets-compare-v125.js');
  assert.match(source,/LOWEST SAVED START/);
  assert.match(source,/MOST SOURCES/);
  assert.match(source,/PRICE DOWN/);
  assert.match(source,/above lowest saved start/);
  assert.match(source,/before fees/);
  assert.match(source,/data-ticket-compare-focus/);
  assert.match(source,/scrollIntoView/);
});

test('saved matchup compare is responsive accessible and motion safe',async()=>{
  const css=await read('tickets-compare-v125.css');
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:46px/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/@media\(forced-colors:active\)/);
});
