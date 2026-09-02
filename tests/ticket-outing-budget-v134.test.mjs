import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../tickets-outing-budget-v134.js',import.meta.url),'utf8');
const css=await readFile(new URL('../tickets-outing-budget-v134.css',import.meta.url),'utf8');
const loader=await readFile(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');

test('outing budget is additive and browser-local',()=>{
  assert.match(loader,/import '\.\/tickets-outing-budget-v134\.js';/);
  assert.match(js,/titans:tickets-outing-budget-v134/);
  assert.match(js,/titans:tickets-shortlist-v123/);
  assert.match(js,/MAX_PLANS=3/);
  assert.match(js,/MAX_AMOUNT=99999\.99/);
  assert.doesNotMatch(js,/\bfetch\s*\(/);
  assert.doesNotMatch(js,/XMLHttpRequest|WebSocket|EventSource/);
});

test('outing total requires user-entered checkout instead of invented fees',()=>{
  assert.match(js,/Enter the actual ticket checkout total you see/);
  assert.match(js,/Ticket Center never guesses fees/);
  assert.match(js,/This reference is not used as your checkout total/);
  assert.match(js,/const total=checkout==null\?null:checkout\+extras/);
  assert.match(js,/Waiting for checkout/);
  assert.match(js,/No fee, parking, food, or merch estimate is generated/);
  assert.doesNotMatch(js,/estimated fee|fee estimate|average fee|projected fee/i);
});

test('worksheet supports actual checkout plus explicit fan extras',()=>{
  for(const field of ['checkout','parking','food','other']){
    assert.match(js,new RegExp(`data-ticket-outing-field=\\"${field}\\"`));
  }
  assert.match(js,/\['parking','food','other'\]\.reduce/);
  assert.match(js,/perPerson:total==null\?null:total\/party/);
  assert.match(js,/User-entered ticket checkout total/);
  assert.match(js,/Parking \+ food \+ merch\/other/);
});

test('saved plans are bounded, sanitized, and pruned to the current shortlist',()=>{
  assert.match(js,/filter\(item=>item&&typeof item\.key==='string'\)\.slice\(0,MAX_PLANS\)/);
  assert.match(js,/const allowed=new Set\(saved\.map\(item=>item\.key\)\)/);
  assert.match(js,/if\(!allowed\.has\(key\)\)continue/);
  assert.match(js,/if\(!Number\.isFinite\(parsed\)\|\|parsed<0\|\|parsed>MAX_AMOUNT\)return null/);
  assert.match(js,/delete store\.plans\[key\]/);
});

test('worksheet composes with shortlist and party-size ownership',()=>{
  assert.match(js,/data-ticket-tenx-party/);
  assert.match(js,/titans:ticket-shortlist-change/);
  assert.match(js,/data-ticket-tenx-save/);
  assert.match(js,/data-ticket-tenx-clear/);
  assert.match(js,/data-ticket-compare-v125/);
});

test('mobile worksheet keeps readable single-column fallback and touch targets',()=>{
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/grid-template-columns:1fr/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(forced-colors:active\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
