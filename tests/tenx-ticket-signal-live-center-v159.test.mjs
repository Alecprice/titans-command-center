import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const signal=readFileSync(new URL('../tickets-signal-lens-v128.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

const ownerSelectors=[
  '[data-ticket-filter="all"]',
  '[data-ticket-tenx-budget="all"]',
  '[data-ticket-finalists-view="all"]',
  '[data-ticket-finalists-budget="all"]'
];

test('Signal Lens reacquires the current Ticket Center across owner reset renders',()=>{
  assert.match(signal,/function liveCenter\(\)\{\s*return app\.querySelector\('\[data-ticket-center\]'\);\s*\}/);
  assert.match(signal,/function requestCanonicalFilters\(center\)/);
  assert.match(signal,/for\(const selector of selectors\)\{\s*center=liveCenter\(\)\|\|center;/);
  assert.match(signal,/return liveCenter\(\)\|\|center;/);
  assert.match(signal,/function focusState\(center,key\)\{\s*center=liveCenter\(\)\|\|center;/);
  assert.match(signal,/function settleReveal\(center,key,reduce,frame=0,stableFrames=0\)\{\s*if\(route\(\)!=='tickets'\)return;\s*center=liveCenter\(\)\|\|center;/);
  assert.doesNotMatch(signal,/if\(route\(\)!=='tickets'\|\|!center\.isConnected\)return;/);
  for(const selector of ownerSelectors)assert.ok(signal.includes(`'${selector}'`),`missing canonical owner reset ${selector}`);
});

test('Signal Lens keeps bounded focus settlement and the production acceptance contract unchanged',()=>{
  assert.match(signal,/const MAX_FOCUS_SETTLE_FRAMES=18/);
  assert.match(signal,/requestAnimationFrame\(\(\)=>settleReveal\(center,key,reduce,frame\+1/);
  assert.match(signal,/stableFrames>=1/);
  assert.match(signal,/current\.card\.contains\(document\.activeElement\)/);
  assert.doesNotMatch(signal,/setTimeout\s*\(/);
  assert.doesNotMatch(signal,/setInterval\s*\(/);
  assert.doesNotMatch(signal,/\bfetch\s*\(/);

  assert.match(smoke,/all&&ticketBudget&&allGames&&groupBudget&&card&&!card\.hidden&&card\.contains\(document\.activeElement\)/);
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)/);
});

test('production failure state is specifically guarded by canonical Finalists resets',()=>{
  assert.ok(smoke.includes('[data-ticket-finalists-view="all"]'));
  assert.ok(smoke.includes('[data-ticket-finalists-budget="all"]'));
  assert.match(signal,/center=requestCanonicalFilters\(center\)\|\|liveCenter\(\)\|\|center;/);
});
