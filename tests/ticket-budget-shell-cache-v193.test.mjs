import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const loader=readFileSync(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');
const guard=readFileSync(new URL('../tickets-budget-touch-guard-v192.js',import.meta.url),'utf8');

test('Ticket budget touch guard is shipped in the PWA shell',()=>{
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v87'/);
  assert.ok(sw.includes("'/tickets-budget-touch-guard-v192.js'"));
  assert.ok(loader.includes("import './tickets-budget-touch-guard-v192.js';"));
});

test('Ticket budget shell guard preserves mobile accessibility floors',()=>{
  assert.match(guard,/@media \(max-width:620px\)/);
  assert.match(guard,/min-height:48px!important/);
  assert.match(guard,/\[data-ticket-outing-field\]\{font-size:16px!important\}/);
});
