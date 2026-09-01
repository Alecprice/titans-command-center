import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('ticket TENX layer is loaded through the existing ticket fallback entrypoint',async()=>{
  const fallback=await read('tickets-price-fallback-v58.js');
  assert.match(fallback,/import '\.\/tickets-tenx-v123\.js';/);
});

test('ticket TENX decision center adds budget, source coverage, party totals, and a bounded shortlist',async()=>{
  const source=await read('tickets-tenx-v123.js');
  assert.match(source,/TENX · TICKET DECISION CENTER/);
  assert.match(source,/data-ticket-tenx-budget="75"/);
  assert.match(source,/data-ticket-tenx-budget="100"/);
  assert.match(source,/data-ticket-tenx-budget="150"/);
  assert.match(source,/data-ticket-tenx-sort="sources"/);
  assert.match(source,/MULTI-SOURCE/);
  assert.match(source,/const MAX_SAVED=3/);
  assert.match(source,/data-ticket-tenx-party/);
  assert.match(source,/before fees/);
  assert.match(source,/We do not invent fee estimates/);
});

test('ticket TENX layer preserves mobile touch targets and reduced-motion behavior',async()=>{
  const css=await read('tickets-tenx-v123.css');
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/min-height:46px/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('ticket TENX enhancement stays additive to resilient marketplace rendering',async()=>{
  const base=await read('tickets-v47.js');
  const source=await read('tickets-tenx-v123.js');
  assert.match(base,/data-ticket-center/);
  assert.match(base,/LAST_GOOD_KEY/);
  assert.match(base,/tickets-provider-health/);
  assert.match(source,/querySelectorAll\('\.tickets-compare-card'\)/);
  assert.match(source,/new MutationObserver\(schedule\)/);
  assert.doesNotMatch(source,/fetch\(/);
});
