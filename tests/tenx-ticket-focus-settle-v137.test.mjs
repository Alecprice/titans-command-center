import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const signal=readFileSync(new URL('../tickets-signal-lens-v128.js',import.meta.url),'utf8');
const compare=readFileSync(new URL('../tickets-compare-v125.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

const ownerSelectors=[
  '[data-ticket-filter="all"]',
  '[data-ticket-tenx-budget="all"]',
  '[data-ticket-finalists-view="all"]',
  '[data-ticket-finalists-budget="all"]'
];

test('TENX Signal Lens reveal waits for all Ticket owners and reacquires live focus',()=>{
  assert.match(signal,/const MAX_FOCUS_SETTLE_FRAMES=18/);
  assert.match(signal,/function requestCanonicalFilters\(center\)/);
  for(const selector of ownerSelectors) assert.ok(signal.includes(`'${selector}'`),`missing owner reset ${selector}`);
  assert.match(signal,/function focusState\(center,key\)/);
  assert.match(signal,/card&&!card\.hidden/);
  assert.match(signal,/current\.card\.contains\(document\.activeElement\)/);
  assert.match(signal,/requestAnimationFrame\(\(\)=>settleReveal\(center,key,reduce,frame\+1/);
  assert.match(signal,/stableFrames>=1/);
  assert.match(signal,/center\.dataset\.ticketSignalFocusComplete=key/);
  assert.match(signal,/titans:ticket-signal-focus-complete/);
});

test('TENX Saved Compare uses the same bounded owner-settle contract',()=>{
  assert.match(compare,/const MAX_FOCUS_SETTLE_FRAMES=18/);
  assert.match(compare,/function requestCanonicalFilters\(center\)/);
  for(const selector of ownerSelectors) assert.ok(compare.includes(`'${selector}'`),`missing compare owner reset ${selector}`);
  assert.match(compare,/current\.card\.contains\(document\.activeElement\)/);
  assert.match(compare,/requestAnimationFrame\(\(\)=>settleReveal\(center,key,frame\+1/);
  assert.match(compare,/stableFrames>=1/);
  assert.match(compare,/center\.dataset\.ticketCompareFocusComplete=key/);
  assert.match(compare,/titans:ticket-compare-focus-complete/);
});

test('Ticket reveal settlement is frame-bounded and adds no polling, network, or state silo',()=>{
  for(const source of [signal,compare]){
    assert.doesNotMatch(source,/setInterval\s*\(/);
    assert.doesNotMatch(source,/setTimeout\s*\(/);
    assert.doesNotMatch(source,/\bfetch\s*\(/);
    assert.doesNotMatch(source,/while\s*\(/);
  }
});

test('production smoke still requires canonical filters plus focus inside the target card',()=>{
  assert.match(smoke,/all&&ticketBudget&&allGames&&groupBudget&&card&&!card\.hidden&&card\.contains\(document\.activeElement\)/);
  assert.match(smoke,/all&&budget&&finalists&&group&&card&&card\.contains\(document\.activeElement\)/);
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)/);
});
