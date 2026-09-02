import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const repair=fs.readFileSync(new URL('../tickets-decision-rehydrate-v155.js',import.meta.url),'utf8');
const fallback=fs.readFileSync(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const smoke=fs.readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('v155 replaces v151 after the existing Ticket decision owners and v149 coordinator',()=>{
  const compare=fallback.indexOf("import './tickets-compare-v125.js'");
  const finalists=fallback.indexOf("import './tickets-finalists-v127.js'");
  const signal=fallback.indexOf("import './tickets-signal-lens-v128.js'");
  const settle=fallback.indexOf("import './tickets-decision-settle-v149.js'");
  const rehydrate=fallback.indexOf("import './tickets-decision-rehydrate-v155.js'");
  assert.ok(compare>=0&&finalists>compare&&signal>finalists&&settle>signal&&rehydrate>settle);
  assert.doesNotMatch(fallback,/tickets-decision-rehydrate-v151\.js/);
});

test('rehydrate convergence verifies authoritative shortlist plus all derived decision surfaces',()=>{
  assert.match(repair,/titans:tickets-shortlist-v123/);
  assert.match(repair,/data-ticket-tenx-command/);
  assert.match(repair,/data-ticket-compare-v125/);
  assert.match(repair,/tickets-compare-v125-card/);
  assert.match(repair,/dataset\.ticketCompareKey/);
  assert.match(repair,/data-ticket-finalists-v127/);
  assert.match(repair,/data-ticket-signal-lens-v128/);
  assert.match(repair,/settled:commandReady&&compare&&finalists&&signal/);
});

test('v155 verifies convergence after waking existing owners instead of stopping after one repair',()=>{
  assert.match(repair,/const MAX_SETTLE_FRAMES=5/);
  assert.match(repair,/const MAX_WAKE_PASSES=2/);
  assert.match(repair,/if\(frame>=MAX_SETTLE_FRAMES-1\)return/);
  assert.match(repair,/if\(wakes<MAX_WAKE_PASSES\)/);
  assert.match(repair,/wakeDecisionOwners\(center,items\);\s*queueReconcile\(frame\+1,wakes\+1\)/);
  assert.match(repair,/queueReconcile\(frame\+1,wakes\);/);
  assert.match(repair,/reason:'rehydrate-v155'/);
});

test('rehydrate repair wakes owners without rendering duplicate Ticket UI or creating another state owner',()=>{
  assert.match(repair,/new CustomEvent\(SHORTLIST_CHANGE/);
  assert.match(repair,/key:MEMORY_KEY/);
  assert.doesNotMatch(repair,/innerHTML|insertAdjacentHTML|createElement|append\(|prepend\(|replaceWith/);
  assert.equal((repair.match(/titans:tickets-shortlist-v123/g)||[]).length,1);
  assert.equal((repair.match(/titans:tickets-price-memory-v124/g)||[]).length,1);
});

test('rehydrate lifecycle remains frame-bounded root-scoped and free of polling or provider traffic',()=>{
  assert.match(repair,/new MutationObserver\(schedule\)\.observe\(app,\{childList:true,subtree:false\}\)/);
  assert.match(repair,/requestAnimationFrame\(\(\)=>\{\s*frameQueued=false;\s*reconcile\(frame,wakes\);/);
  assert.match(repair,/if\(report\.settled\)return/);
  assert.doesNotMatch(repair,/setInterval|setTimeout|fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.equal((repair.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((repair.match(/requestAnimationFrame/g)||[]).length,1);
});

test('same-tab repair diagnostics remain bounded counts and surface truth',()=>{
  assert.match(repair,/checks:0,repairs:0,last:null/);
  assert.match(repair,/savedCount:items\.length/);
  assert.match(repair,/frame,\s*wakes,\s*boardReady/);
  assert.doesNotMatch(repair,/api[_-]?key|client[_-]?secret|access[_-]?token|authorization|offer\.url|href/i);
});

test('v155 is available to installed clients in the refreshed PWA shell generation',()=>{
  assert.match(sw,/titans-cc-brand-2026-v84/);
  assert.match(sw,/\/tickets-decision-rehydrate-v155\.js/);
  assert.doesNotMatch(sw,/\/tickets-decision-rehydrate-v151\.js/);
  assert.match(sw,/NETWORK_FIRST/);
});

test('production keeps the exact eight-second Saved Compare SLA while v155 converges locally',()=>{
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(\s*lambda d:d\.execute_script\("return document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length"\)>=2/);
});