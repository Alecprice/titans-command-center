import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const repair=fs.readFileSync(new URL('../tickets-decision-rehydrate-v151.js',import.meta.url),'utf8');
const fallback=fs.readFileSync(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const smoke=fs.readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('v151 loads after the existing Ticket decision owners and v149 coordinator',()=>{
  const compare=fallback.indexOf("import './tickets-compare-v125.js'");
  const finalists=fallback.indexOf("import './tickets-finalists-v127.js'");
  const signal=fallback.indexOf("import './tickets-signal-lens-v128.js'");
  const settle=fallback.indexOf("import './tickets-decision-settle-v149.js'");
  const rehydrate=fallback.indexOf("import './tickets-decision-rehydrate-v151.js'");
  assert.ok(compare>=0&&finalists>compare&&signal>finalists&&settle>signal&&rehydrate>settle);
});

test('rehydrate check verifies authoritative shortlist plus all derived decision surfaces',()=>{
  assert.match(repair,/titans:tickets-shortlist-v123/);
  assert.match(repair,/data-ticket-tenx-command/);
  assert.match(repair,/data-ticket-compare-v125/);
  assert.match(repair,/tickets-compare-v125-card/);
  assert.match(repair,/dataset\.ticketCompareKey/);
  assert.match(repair,/data-ticket-finalists-v127/);
  assert.match(repair,/data-ticket-signal-lens-v128/);
  assert.match(repair,/settled:commandReady&&compare&&finalists&&signal/);
});

test('rehydrate repair wakes existing owners instead of rendering duplicate Ticket UI',()=>{
  assert.match(repair,/new CustomEvent\(SHORTLIST_CHANGE/);
  assert.match(repair,/key:MEMORY_KEY/);
  assert.match(repair,/reason:'rehydrate-v151'/);
  assert.doesNotMatch(repair,/innerHTML|insertAdjacentHTML|createElement|append\(|prepend\(|replaceWith/);
});

test('rehydrate lifecycle is frame-bounded and root-scoped without polling or provider traffic',()=>{
  assert.match(repair,/new MutationObserver\(schedule\)\.observe\(app,\{childList:true,subtree:false\}\)/);
  assert.match(repair,/requestAnimationFrame\(\(\)=>reconcile\(true\)\)/);
  assert.match(repair,/requestAnimationFrame\(\(\)=>reconcile\(false\)\)/);
  assert.match(repair,/if\(report\.settled\)return;/);
  assert.match(repair,/if\(!report\.commandReady&&allowRetry\)/);
  assert.doesNotMatch(repair,/setInterval|setTimeout|fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.equal((repair.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((repair.match(/requestAnimationFrame/g)||[]).length,2);
});

test('same-tab repair diagnostics remain counts and surface booleans only',()=>{
  assert.match(repair,/checks:0,repairs:0,last:null/);
  assert.match(repair,/savedCount:items\.length/);
  assert.doesNotMatch(repair,/api[_-]?key|client[_-]?secret|access[_-]?token|authorization|offer\.url|href/i);
});

test('v151 is available to installed clients in the new PWA shell generation',()=>{
  assert.match(sw,/titans-cc-brand-2026-v83/);
  assert.match(sw,/\/tickets-decision-rehydrate-v151\.js/);
  assert.match(sw,/NETWORK_FIRST/);
});

test('production still enforces the original eight-second Saved Compare SLA',()=>{
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(\s*lambda d:d\.execute_script\("return document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length"\)>=2/);
});
