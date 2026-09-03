import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const bus=fs.readFileSync(new URL('../tickets-decision-bus-v156.js',import.meta.url),'utf8');
const repair=fs.readFileSync(new URL('../tickets-decision-rehydrate-v156.js',import.meta.url),'utf8');
const fallback=fs.readFileSync(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const smoke=fs.readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('v156 decision bus loads before Ticket shortlist and decision owners',()=>{
  const busIndex=fallback.indexOf("import './tickets-decision-bus-v156.js'");
  const shortlist=fallback.indexOf("import './tickets-tenx-v123.js'");
  const compare=fallback.indexOf("import './tickets-compare-v125.js'");
  const finalists=fallback.indexOf("import './tickets-finalists-v127.js'");
  const signal=fallback.indexOf("import './tickets-signal-lens-v128.js'");
  const settle=fallback.indexOf("import './tickets-decision-settle-v149.js'");
  const rehydrate=fallback.indexOf("import './tickets-decision-rehydrate-v156.js'");
  assert.ok(busIndex>=0&&shortlist>busIndex&&compare>shortlist&&finalists>compare&&signal>finalists&&settle>signal&&rehydrate>settle);
  assert.doesNotMatch(fallback,/tickets-decision-rehydrate-v155\.js/);
});

test('decision bus retains only bounded semantic shortlist state and never owns persistence',()=>{
  assert.match(bus,/const MAX_SAVED=3/);
  assert.match(bus,/state\.last=normalize\(storageSnapshot\(\),'bootstrap'\)/);
  assert.match(bus,/keys:\s*Object\.freeze/);
  assert.match(bus,/slice\(0,MAX_SAVED\)/);
  assert.doesNotMatch(bus,/localStorage\.setItem|sessionStorage|indexedDB|cookie/i);
});

test('decision bus replays directly on stable app boundary and ignores its own replay event',()=>{
  assert.match(bus,/app\.dispatchEvent\(new CustomEvent\(SHORTLIST_CHANGE/);
  assert.match(bus,/decisionBusReplay:true/);
  assert.match(bus,/if\(event\?\.detail\?\.decisionBusReplay\)return/);
  assert.match(bus,/runtime\?\.onAppRender\?\./);
  assert.match(bus,/queueMicrotask\(replayLatest\)/);
  assert.match(bus,/new StorageEvent\('storage',\{key:MEMORY_KEY/);
});

test('decision bus remains event-driven with no polling provider traffic or duplicate DOM renderer',()=>{
  assert.doesNotMatch(bus,/setInterval|setTimeout|fetch\(|XMLHttpRequest|WebSocket|EventSource|new MutationObserver/);
  assert.doesNotMatch(bus,/innerHTML|insertAdjacentHTML|createElement|append\(|prepend\(|replaceWith/);
  assert.doesNotMatch(bus,/api[_-]?key|client[_-]?secret|access[_-]?token|authorization/i);
});

test('v156 coordinator verifies all existing owners and prefers the replay bus before legacy wakes',()=>{
  assert.match(repair,/data-ticket-tenx-command/);
  assert.match(repair,/data-ticket-compare-v125/);
  assert.match(repair,/data-ticket-finalists-v127/);
  assert.match(repair,/data-ticket-signal-lens-v128/);
  assert.match(repair,/bus\?\.publish\?\.\(\{count:items\.length,keys:\[\.\.\.keys\]\},'rehydrate-v156'\)/);
  assert.match(repair,/busVersion:bus\?\.version/);
  assert.match(repair,/busSubscribers:Number/);
  assert.match(repair,/settled:commandReady&&compare&&finalists&&signal/);
});

test('v156 recovery stays frame-bounded and quota neutral',()=>{
  assert.match(repair,/const MAX_SETTLE_FRAMES=5/);
  assert.match(repair,/const MAX_WAKE_PASSES=2/);
  assert.match(repair,/if\(frame>=MAX_SETTLE_FRAMES-1\)return/);
  assert.match(repair,/new MutationObserver\(schedule\)\.observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(repair,/setInterval|setTimeout|fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.equal((repair.match(/new MutationObserver/g)||[]).length,1);
  assert.equal((repair.match(/requestAnimationFrame/g)||[]).length,1);
});

test('v156 bus and coordinator ship to installed clients without changing cache strategy',()=>{
  assert.match(sw,/titans-cc-brand-2026-v84/);
  assert.match(sw,/\/tickets-decision-bus-v156\.js/);
  assert.match(sw,/\/tickets-decision-rehydrate-v156\.js/);
  assert.doesNotMatch(sw,/\/tickets-decision-rehydrate-v155\.js/);
  assert.match(sw,/NETWORK_FIRST/);
});

test('production keeps the exact eight-second Saved Compare SLA',()=>{
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(\s*lambda d:d\.execute_script\("return document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length"\)>=2/);
});
