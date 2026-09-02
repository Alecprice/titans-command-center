import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Ticket fallback imports the Signal Lens after the existing TENX decision layers',async()=>{
  const source=await read('tickets-price-fallback-v58.js');
  assert.match(source,/tickets-tenx-v123\.js[\s\S]*tickets-trend-v124\.js[\s\S]*tickets-compare-v125\.js[\s\S]*tickets-finalists-v127\.js[\s\S]*tickets-signal-lens-v128\.js/);
});

test('Signal Lens derives only factual current-board and browser-observed signals',async()=>{
  const source=await read('tickets-signal-lens-v128.js');
  assert.match(source,/LOWEST CURRENT START/);
  assert.match(source,/LOWEST HOME START/);
  assert.match(source,/MOST CROSS-CHECKED/);
  assert.match(source,/BIGGEST LOCAL DROP/);
  assert.match(source,/titans:tickets-price-memory-v124/);
  assert.match(source,/current!==currentPrice/);
  assert.match(source,/b\.drop\.amount-a\.drop\.amount/);
  assert.match(source,/ties break toward lower starting price/);
  assert.match(source,/not a deal score or buy\/wait recommendation/);
  assert.match(source,/No marketplace-wide history or prediction is inferred/);
});

test('Signal Lens party totals stay explicitly before fees',async()=>{
  const source=await read('tickets-signal-lens-v128.js');
  assert.match(source,/lowest\.price\*party/);
  assert.match(source,/lowestHome\.price\*party/);
  assert.match(source,/before fees/);
});

test('Signal Lens is read-only and adds no provider traffic or persistence writes',async()=>{
  const source=await read('tickets-signal-lens-v128.js');
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/XMLHttpRequest/);
  assert.doesNotMatch(source,/apiJson\s*\(/);
  assert.doesNotMatch(source,/setJSON\s*\(/);
  assert.doesNotMatch(source,/localStorage\.setItem/);
  assert.match(source,/storage\?\.getJSON/);
});

test('Signal focus reveals a matchup through every Ticket filter layer',async()=>{
  const source=await read('tickets-signal-lens-v128.js');
  assert.match(source,/data-ticket-filter="all"/);
  assert.match(source,/data-ticket-tenx-budget="all"/);
  assert.match(source,/data-ticket-finalists-view="all"/);
  assert.match(source,/data-ticket-finalists-budget="all"/);
  assert.match(source,/data-ticket-signal-focus/);
  assert.match(source,/scrollIntoView/);
  assert.match(source,/window\.matchMedia/);
  assert.match(source,/prefers-reduced-motion/);
});

test('Signal Lens decorates the corresponding live matchup cards without rewriting marketplace offers',async()=>{
  const source=await read('tickets-signal-lens-v128.js');
  assert.match(source,/data-ticket-signal-badges/);
  assert.match(source,/labelsByKey/);
  assert.match(source,/tickets-offer-row a/);
  assert.doesNotMatch(source,/\.href\s*=\s*['"`]https?:\/\/(?:www\.)?(?:seatgeek|ticketmaster|stubhub)/i);
});

test('Signal Lens is phone-first and accessible',async()=>{
  const css=await read('tickets-signal-lens-v128.css');
  assert.match(css,/@media\(max-width:980px\)/);
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/@media\(max-width:430px\)/);
  assert.match(css,/min-height:46px/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/@media\(forced-colors:active\)/);
});
