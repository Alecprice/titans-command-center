import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const bridge=readFileSync(new URL('../tickets-compare-cache-bridge-v141.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('TENX Ticket runtime bridge ships on the independent top-level browser path',()=>{
  assert.match(index,/tickets-price-fallback-v58\.js\?v=1[^]*tickets-compare-cache-bridge-v141\.js/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/['"]\/tickets-compare-cache-bridge-v141\.js['"]/);
  assert.match(bridge,/__TitansTicketCompareCacheBridgeV141/);
});

test('bridge observes Ticket save ownership before synchronous DOM replacement',()=>{
  assert.match(bridge,/app\.addEventListener\('click',[^]*\[data-ticket-tenx-save\],\[data-ticket-tenx-clear\][^]*queueMicrotask\(\(\)=>\{void reconcile\(\);\}\);[^]*},true\);/);
  assert.match(bridge,/titans:ticket-shortlist-change/);
  assert.match(bridge,/center\.dispatchEvent\(new CustomEvent\(SHORTLIST_CHANGE/);
});

test('bridge independently bootstraps the three critical Ticket decision owners',()=>{
  assert.match(bridge,/tickets-compare-v125\.js/);
  assert.match(bridge,/tickets-finalists-v127\.js/);
  assert.match(bridge,/tickets-signal-lens-v128\.js/);
  assert.match(bridge,/Promise\.allSettled\(OWNER_MODULES\.map\(owner=>import\(owner\.path\)\)\)/);
  assert.match(bridge,/__TitansTicketCompareV125/);
  assert.match(bridge,/__TitansTicketFinalistsV127/);
  assert.match(bridge,/__TitansTicketSignalLensV128/);
  assert.match(bridge,/void ensureOwners\(\)/);
});

test('owner bootstrap is local fail-soft and preserves the semantic-first legacy fallback',()=>{
  const owners=bridge.indexOf('await ensureOwners()');
  const semantic=bridge.indexOf("center.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE");
  const frame=bridge.indexOf('requestAnimationFrame');
  const settled=bridge.indexOf('if(settled(liveCenter,liveItems))return;');
  const legacy=bridge.indexOf("window.dispatchEvent(new StorageEvent('storage'");
  assert.ok(owners>=0&&semantic>owners&&frame>semantic&&settled>frame&&legacy>settled);
  assert.equal((bridge.match(/new StorageEvent\('storage'/g)||[]).length,1);
  assert.doesNotMatch(bridge,/localStorage\.(?:setItem|removeItem)/);
  assert.doesNotMatch(bridge,/\bfetch\s*\(|setInterval\s*\(|setTimeout\s*\(|MutationObserver|XMLHttpRequest|WebSocket|EventSource/);
});

test('bridge exposes only bounded owner and reconciliation diagnostics',()=>{
  assert.match(bridge,/ownerChecks:0,ownerLoads:0,ownerFailures:0/);
  assert.match(bridge,/owners:\{compare:false,finalists:false,signal:false\}/);
  assert.match(bridge,/semanticDispatches:0,legacyWakeups:0/);
  assert.doesNotMatch(bridge,/api[_-]?key|client[_-]?secret|access[_-]?token|authorization/i);
});

test('production Saved Compare lifecycle remains an unchanged eight-second requirement',()=>{
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(\s*lambda d:d\.execute_script\("return document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length"\)>=2\s*\)/s);
});
