import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Ticket Center switches to a true single-column phone card before modern iPhone widths',async()=>{
  const css=await read('tickets-resilience-v53.css');
  assert.match(css,/@media\(max-width:540px\)/);
  assert.match(css,/\.tickets-compare-card\{grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css,/\.tickets-event-copy\{order:1/);
  assert.match(css,/\.tickets-price-block\{order:2/);
  assert.match(css,/\.tickets-offer-list\{order:3/);
  assert.match(css,/\.tickets-event-tags\{flex-wrap:wrap/);
});

test('Ticket Center phone layout clears the persistent mobile dock and preserves full-width checkout targets',async()=>{
  const css=await read('tickets-resilience-v53.css');
  assert.match(css,/padding-bottom:calc\(118px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css,/\.tickets-offer-row>a\{grid-column:1\/-1;width:100%;min-height:48px/);
  assert.match(css,/\.tickets-price-block strong\{font-size:24px;line-height:1\.06;overflow-wrap:anywhere\}/);
});
