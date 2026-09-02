import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const settle=fs.readFileSync(new URL('../tickets-decision-settle-v149.js',import.meta.url),'utf8');
const fallback=fs.readFileSync(new URL('../tickets-price-fallback-v58.js',import.meta.url),'utf8');
const smoke=fs.readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('Ticket decision settle coordinator loads after the three decision surfaces',()=>{
  const compare=fallback.indexOf("import './tickets-compare-v125.js'");
  const finalists=fallback.indexOf("import './tickets-finalists-v127.js'");
  const signal=fallback.indexOf("import './tickets-signal-lens-v128.js'");
  const coordinator=fallback.indexOf("import './tickets-decision-settle-v149.js'");
  assert.ok(compare>=0&&finalists>compare&&signal>finalists&&coordinator>signal);
});

test('same-tab shortlist reconciliation verifies compare keys and derived panels',()=>{
  assert.match(settle,/titans:ticket-shortlist-change/);
  assert.match(settle,/data-ticket-compare-v125/);
  assert.match(settle,/tickets-compare-v125-card/);
  assert.match(settle,/dataset\.ticketCompareKey/);
  assert.match(settle,/data-ticket-finalists-v127/);
  assert.match(settle,/data-ticket-signal-lens-v128/);
  assert.match(settle,/dataset\.ticketTenxPrice/);
  assert.match(settle,/dataset\.ticketTenxSources/);
});

test('settle repair is bounded to one frame and one storage wake-up without polling or network',()=>{
  assert.match(settle,/requestAnimationFrame\(reconcile\)/);
  assert.match(settle,/new StorageEvent\('storage'/);
  assert.match(settle,/if\(report\.settled\)return;/);
  assert.doesNotMatch(settle,/setInterval|setTimeout|MutationObserver|fetch\(|XMLHttpRequest|WebSocket/);
  assert.equal((settle.match(/requestAnimationFrame\(/g)||[]).length,1);
  assert.equal((settle.match(/new StorageEvent\(/g)||[]).length,1);
});

test('settle diagnostics expose counts only and never provider or ticket credentials',()=>{
  assert.match(settle,/checks:0,repairs:0,last:null/);
  assert.doesNotMatch(settle,/api[_-]?key|client[_-]?secret|access[_-]?token|authorization/i);
});

test('Ticket decision settle coordinator remains available to installed offline clients',()=>{
  assert.match(sw,/titans-cc-brand-2026-v84/);
  assert.match(sw,/\/tickets-decision-settle-v149\.js/);
});

test('production Ticket compare SLA remains eight seconds instead of masking the race',()=>{
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(\s*lambda d:d\.execute_script\("return document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length"\)>=2/);
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(\s*lambda d:d\.execute_script\("return Boolean\(document\.querySelector\('\[data-ticket-finalists-v127\]'\)&&document\.querySelector\('\[data-ticket-signal-lens-v128\]'\)\)"\)\s*\)/);
});
