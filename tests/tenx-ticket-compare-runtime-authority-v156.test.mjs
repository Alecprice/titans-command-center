import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../tickets-compare-v125.js',import.meta.url),'utf8');
const smoke=fs.readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('Saved Compare resolves the shared runtime at read time instead of capturing boot state',()=>{
  assert.match(source,/const currentRuntime=\(\)=>window\.TitansRuntime/);
  assert.doesNotMatch(source,/const runtime=window\.TitansRuntime/);
  assert.match(source,/const runtime=currentRuntime\(\)/);
  assert.match(source,/runtime\.storage\.getJSON\(key,fallback\)/);
});

test('Saved Compare falls back to the same browser-local shortlist authority when runtime storage is not ready',()=>{
  assert.match(source,/localStorage\.getItem\(key\)/);
  assert.match(source,/authority:'localStorage'/);
  assert.match(source,/const SHORTLIST_KEY='titans:tickets-shortlist-v123'/);
  assert.doesNotMatch(source,/localStorage\.setItem/);
  assert.doesNotMatch(source,/localStorage\.removeItem/);
});

test('Saved Compare exposes bounded production diagnostics without fan-state duplication',()=>{
  assert.match(source,/ticketCompareAuthorityV156/);
  assert.match(source,/ticketCompareSavedV156/);
  assert.match(source,/savedAuthority=read\.authority/);
  assert.doesNotMatch(source,/sessionStorage/);
  assert.doesNotMatch(source,/indexedDB/);
});

test('runtime subscriptions can bind after module evaluation without polling or provider traffic',()=>{
  assert.match(source,/function bindRuntime\(\)/);
  assert.match(source,/runtime\.onRoute\?\.\(schedule,\{immediate:true\}\)/);
  assert.match(source,/runtime\.onAppRender\?\.\(schedule,\{immediate:true\}\)/);
  assert.match(source,/queueMicrotask\(\(\)=>\{bindRuntime\(\);schedule\(\);\}\)/);
  assert.doesNotMatch(source,/setTimeout/);
  assert.doesNotMatch(source,/setInterval/);
  assert.doesNotMatch(source,/\bfetch\s*\(/);
});

test('compare initialization does not burn its global guard before the app host exists',()=>{
  const appCheck=source.indexOf("const app=document.querySelector('#app')");
  const globalGuard=source.indexOf('if(window.__TitansTicketCompareV125)return');
  assert.ok(appCheck>=0&&globalGuard>appCheck);
});

test('production Saved Compare remains an unchanged eight-second requirement',()=>{
  const start=smoke.indexOf('def exercise_saved_compare');
  const compareWait=smoke.indexOf("document.querySelectorAll('[data-ticket-compare-v125] .tickets-compare-v125-card').length",start);
  const wait=smoke.lastIndexOf('WebDriverWait(driver,8,poll_frequency=.1)',compareWait);
  assert.ok(start>=0&&compareWait>start&&wait>start&&wait<compareWait);
});
