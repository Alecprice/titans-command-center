import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const bridge=readFileSync(new URL('../tickets-compare-cache-bridge-v141.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('TENX Ticket runtime bridge ships on a new immutable browser path',()=>{
  assert.match(index,/tickets-price-fallback-v58\.js\?v=1[^]*tickets-compare-cache-bridge-v141\.js/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/['"]\/tickets-compare-cache-bridge-v141\.js['"]/);
  assert.match(bridge,/__TitansTicketCompareCacheBridgeV141/);
  assert.match(bridge,/__TitansTicketCompareConvergenceV156/);
});

test('bridge observes Ticket save ownership before synchronous DOM replacement',()=>{
  assert.match(bridge,/app\.addEventListener\('click',[^]*\[data-ticket-tenx-save\],\[data-ticket-tenx-clear\][^]*queueMicrotask\(reconcile\);[^]*},true\);/);
  assert.match(bridge,/titans:ticket-shortlist-change/);
  assert.match(bridge,/center\.dispatchEvent\(new CustomEvent\(SHORTLIST_CHANGE/);
});

test('legacy CDN wake-up is bounded behind semantic reconciliation',()=>{
  const semantic=bridge.indexOf("center.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE");
  const frame=bridge.indexOf('requestAnimationFrame');
  const settled=bridge.indexOf('if(settled(liveCenter,liveItems))return;');
  const legacy=bridge.indexOf("window.dispatchEvent(new StorageEvent('storage'");
  assert.ok(semantic>=0&&frame>semantic&&settled>frame&&legacy>settled);
  assert.equal((bridge.match(/new StorageEvent\('storage'/g)||[]).length,1);
  assert.doesNotMatch(bridge,/localStorage\.(?:setItem|removeItem)/);
  assert.doesNotMatch(bridge,/\bfetch\s*\(|setInterval\s*\(|setTimeout\s*\(/);
});

test('v158 recovery observers are narrow saved-state and direct-child guards',()=>{
  assert.equal((bridge.match(/new MutationObserver/g)||[]).length,2);
  assert.match(bridge,/centerObserver\.observe\(boundCenter,\{attributes:true,attributeFilter:\['data-ticket-tenx-saved-count'\],childList:true,subtree:false\}\)/);
  assert.match(bridge,/saved\(\)\.length>0&&mutations\.some\(mutation=>mutation\.type==='childList'\)/);
  assert.match(bridge,/schedule\(savedChanged\?'saved-count':'center-child'\)/);
  assert.match(bridge,/new MutationObserver\(\(\)=>schedule\('app-replaced'\)\)\.observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(bridge,/subtree:true/);
  assert.doesNotMatch(bridge,/characterData:true/);
});

test('production Saved Compare lifecycle remains an unchanged eight-second requirement',()=>{
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until\(\s*lambda d:d\.execute_script\("return document\.querySelectorAll\('\[data-ticket-compare-v125\] \.tickets-compare-v125-card'\)\.length"\)>=2\s*\)/s);
});
