import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const owner=readFileSync(new URL('../tickets-tenx-v123.js',import.meta.url),'utf8');
const compare=readFileSync(new URL('../tickets-compare-v125.js',import.meta.url),'utf8');
const finalists=readFileSync(new URL('../tickets-finalists-v127.js',import.meta.url),'utf8');
const outing=readFileSync(new URL('../tickets-outing-budget-v134.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

const eventName='titans:ticket-shortlist-change';

test('Ticket shortlist owner publishes semantic same-tab state after its DOM state agrees',()=>{
  assert.match(owner,/const SHORTLIST_CHANGE='titans:ticket-shortlist-change'/);
  assert.match(owner,/center\.dispatchEvent\(new CustomEvent\(SHORTLIST_CHANGE,\{bubbles:true,detail:\{count,keys:\[\.\.\.keys\]\}\}\)\)/);
  assert.doesNotMatch(owner,/new StorageEvent\s*\(/);

  const toggle=owner.slice(owner.indexOf('function toggleSaved'),owner.indexOf('function enhance'));
  const decorateIndex=toggle.indexOf('decorate(items);');
  const trayIndex=toggle.indexOf('savedTray(center,items);');
  const announceIndex=toggle.indexOf('announceSaved(center,saved);');
  assert.ok(decorateIndex>=0&&trayIndex>decorateIndex&&announceIndex>trayIndex,'semantic event must follow card and shortlist DOM synchronization');
});

test('Saved Compare renders directly from settled same-tab shortlist state while other consumers retain their contracts',()=>{
  assert.match(compare,/const SHORTLIST_CHANGE='titans:ticket-shortlist-change'/);
  assert.match(compare,/function syncFromShortlist\(\)\{queued=false;enhance\(\);\}/);
  assert.match(compare,/app\.addEventListener\(SHORTLIST_CHANGE,syncFromShortlist\)/);
  assert.match(finalists,/const SHORTLIST_CHANGE='titans:ticket-shortlist-change'/);
  assert.match(finalists,/app\.addEventListener\(SHORTLIST_CHANGE,schedule\)/);
  assert.match(outing,/app\.addEventListener\('titans:ticket-shortlist-change',schedule\)/);
});

test('real storage events remain cross-tab synchronization instead of a same-tab synthetic bridge',()=>{
  assert.match(owner,/event\.key===STORAGE_KEY\|\|event\.key===PRICE_MEMORY_KEY/);
  assert.match(compare,/event\.key===SHORTLIST_KEY\|\|event\.key===MEMORY_KEY/);
  assert.match(finalists,/event\.key===SHORTLIST_KEY/);
  assert.match(outing,/event\.key===SHORTLIST_KEY\|\|event\.key===BUDGET_KEY/);
  for(const source of [owner,compare,finalists,outing])assert.doesNotMatch(source,/window\.dispatchEvent\(new StorageEvent/);
});

test('shortlist handoff adds no polling, network request, or duplicate persistence namespace',()=>{
  for(const source of [owner,compare,finalists]){
    assert.doesNotMatch(source,/setInterval\s*\(/);
    assert.doesNotMatch(source,/\bfetch\s*\(/);
    assert.doesNotMatch(source,/XMLHttpRequest|WebSocket/);
  }
  assert.equal((owner.match(/titans:tickets-shortlist-v123/g)||[]).length,1);
  assert.equal((compare.match(/titans:tickets-shortlist-v123/g)||[]).length,1);
  assert.equal((finalists.match(/titans:tickets-shortlist-v123/g)||[]).length,1);
});

test('production compare gate remains strict and keeps its eight-second lifecycle deadline',()=>{
  assert.match(smoke,/document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length/);
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until/);
  assert.match(smoke,/saved_count\(d\)==expected_count/);
});
