import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-affiliates-v14.js',import.meta.url),'utf8');
const css=await readFile(new URL('../media-affiliates-v14.css',import.meta.url),'utf8');
const loader=await readFile(new URL('../media-search-v14.js',import.meta.url),'utf8');

test('affiliate finder transcribes the full official 2026 network',()=>{
  const stationRows=[...js.matchAll(/\{state:'(?:Tennessee|Alabama|Kentucky)',call:'[^']+',frequency:'[^']+',city:'[^']+'\}/g)];
  assert.equal(stationRows.length,39);
  assert.match(js,/\{state:'Tennessee',call:'WGFX',frequency:'104\.5 The Zone',city:'Nashville \(Flagship\)'\}/);
  assert.match(js,/\{state:'Tennessee',call:'WIKQ',frequency:'103\.1 FM',city:'Greeneville'\}/);
  assert.match(js,/\{state:'Tennessee',call:'WXSM',frequency:'640 AM',city:'Tri-Cities'\}/);
  assert.match(js,/\{state:'Alabama',call:'WJOX',frequency:'94\.5 FM',city:'Birmingham'\}/);
  assert.match(js,/\{state:'Kentucky',call:'WKDZ',frequency:'106\.5 FM',city:'Cadiz'\}/);
});

test('finder keeps the Titans official affiliate page as the source of truth',()=>{
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/broadcast\/titans-radio\/titans-radio-affiliates/);
  assert.match(js,/Updated for 2026/);
  assert.match(js,/Broadcast availability can change/);
  assert.match(js,/Verify official list/);
});

test('search is client-side, multi-field, grouped, and truthfully counted',()=>{
  assert.match(js,/search:normalize\(`\$\{station\.call\} \$\{station\.frequency\} \$\{station\.city\} \$\{station\.state\}`\)/);
  assert.match(js,/String\(card\.dataset\.affiliateSearch\|\|''\)\.includes\(query\)/);
  assert.match(js,/STATES=\['Tennessee','Alabama','Kentucky'\]/);
  assert.match(js,/visible\?`\$\{visible\} of \$\{STATIONS\.length\} stations match/);
  assert.match(js,/No 2026 Titans Radio affiliates match/);
  assert.match(js,/data-affiliate-count role="status" aria-live="polite"/);
});

test('media search loader activates the isolated finder without adding another app fetch path',()=>{
  assert.match(loader,/import '\.\/media-affiliates-v14\.js';/);
  assert.doesNotMatch(js,/fetch\(/);
  assert.doesNotMatch(js,/apiJson\(/);
  assert.match(js,/MutationObserver\(\(\)=>queueMicrotask\(enhance\)\)\.observe\(app,\{childList:true,subtree:false\}\)/);
});

test('finder is mobile-first and keyboard accessible',()=>{
  assert.match(css,/media-affiliate-tools input\{[^}]*min-height:48px/);
  assert.match(css,/media-affiliate-tools button\{[^}]*min-height:48px/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/media-affiliate-grid\{grid-template-columns:1fr\}/);
  assert.match(css,/focus-visible/);
  assert.match(css,/@media\(prefers-contrast:more\)/);
});
