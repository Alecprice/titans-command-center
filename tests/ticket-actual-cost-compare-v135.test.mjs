import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../tickets-actual-cost-compare-v135.js',import.meta.url),'utf8');
const css=await readFile(new URL('../tickets-actual-cost-compare-v135.css',import.meta.url),'utf8');
const loader=await readFile(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');

test('actual cost compare is an additive Ticket layer',()=>{
  assert.match(loader,/import '\.\/tickets-outing-budget-v134\.js';\nimport '\.\/tickets-actual-cost-compare-v135\.js';/);
  assert.match(js,/titans:tickets-shortlist-v123/);
  assert.match(js,/titans:tickets-outing-budget-v134/);
  assert.match(js,/MAX_SAVED=3/);
  assert.doesNotMatch(js,/\bfetch\s*\(/);
  assert.doesNotMatch(js,/XMLHttpRequest|WebSocket|EventSource/);
});

test('only user-entered checkout makes a saved matchup rankable',()=>{
  assert.match(js,/const checkout=amount\(plan\?\.checkout\)/);
  assert.match(js,/const total=checkout==null\?null:checkout\+extras/);
  assert.match(js,/ready:checkout!=null/);
  assert.match(js,/if\(a\.ready!==b\.ready\)return a\.ready\?-1:1/);
  assert.match(js,/Enter the actual ticket checkout total in Game Night Budget before this matchup can be ranked by cost/);
  assert.match(js,/Starting prices are not substituted for checkout/);
});

test('actual cost ranking uses entered outing total and is tie-safe',()=>{
  assert.match(js,/if\(a\.ready&&b\.ready\)return \(a\.total-b\.total\)\|\|\(a\.checkout-b\.checkout\)/);
  assert.match(js,/LOWEST ENTERED OUTING/);
  assert.match(js,/tiedLowest\.length>1/);
  assert.match(js,/shared by \$\{tiedLowest\.length\} saved games/);
  assert.match(js,/This compares only amounts entered in this browser/);
  assert.doesNotMatch(js,/best deal|buy now|wait to buy|guaranteed/i);
});

test('incomplete saved games stay visible instead of borrowing starting prices',()=>{
  assert.match(js,/data-ticket-cost-ready=\"\$\{item\.ready\}\"/);
  assert.match(js,/NEEDS CHECKOUT/);
  assert.match(js,/ready\.length===1/);
  assert.match(js,/actual totals ready/);
  assert.match(js,/Starting prices, unentered fees, seat quality, and projected spending are excluded/);
});

test('compare layer is read-only and edits through the existing budget worksheet',()=>{
  assert.doesNotMatch(js,/storage\?\.setJSON|localStorage\.setItem|sessionStorage\.setItem/);
  assert.match(js,/data-ticket-cost-edit/);
  assert.match(js,/picker\.value=key/);
  assert.match(js,/picker\.dispatchEvent\(new Event\('change',\{bubbles:true\}\)\)/);
  assert.match(js,/data-ticket-outing-field=\"checkout\"/);
  assert.match(js,/titans:ticket-shortlist-change/);
});

test('actual cost compare preserves mobile and accessibility contracts',()=>{
  assert.match(css,/min-height:44px/);
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(forced-colors:active\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
