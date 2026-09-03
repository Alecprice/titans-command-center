import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const compare=readFileSync(new URL('../tickets-compare-v125.js',import.meta.url),'utf8');
const smoke=readFileSync(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

const ownerSelectors=[
  '[data-ticket-filter="all"]',
  '[data-ticket-tenx-budget="all"]',
  '[data-ticket-finalists-view="all"]',
  '[data-ticket-finalists-budget="all"]'
];

test('Saved Compare preserves selected party truth when a live starting price is unavailable',()=>{
  assert.ok(compare.includes("`${party} ticket${party===1?'':'s'}: current starting price unavailable before fees · ${sources}`"));
  assert.ok(compare.includes("`Current start: ${money(item.price)} · ${party} ticket${party===1?'':'s'}: ${money(total)} before fees · ${sources}`"));
  assert.doesNotMatch(compare,/current starting price unavailable[^\n]*\$0/i);
  assert.doesNotMatch(compare,/current starting price unavailable[^\n]*money\(0\)/i);
  assert.ok(smoke.includes("'3 tickets:'"));
  assert.ok(smoke.includes("'before fees'"));
});

test('Saved Compare reacquires the live Ticket Center across canonical owner reset renders',()=>{
  assert.match(compare,/function liveCenter\(\)\{\s*return app\.querySelector\('\[data-ticket-center\]'\);\s*\}/);
  assert.match(compare,/function requestCanonicalFilters\(center\)/);
  assert.match(compare,/for\(const selector of selectors\)\{\s*center=liveCenter\(\)\|\|center;/);
  assert.match(compare,/function focusState\(center,key\)\{\s*center=liveCenter\(\)\|\|center;/);
  assert.match(compare,/function settleReveal\(center,key,frame=0,stableFrames=0\)\{\s*if\(route\(\)!=='tickets'\)return;\s*center=liveCenter\(\)\|\|center;/);
  assert.doesNotMatch(compare,/if\(route\(\)!=='tickets'\|\|!center\.isConnected\)return;/);
  for(const selector of ownerSelectors)assert.ok(compare.includes(`'${selector}'`),`missing canonical Compare owner reset ${selector}`);
});

test('Saved Compare keeps bounded focus settlement and the production gate remains strict',()=>{
  assert.match(compare,/const MAX_FOCUS_SETTLE_FRAMES=18/);
  assert.match(compare,/requestAnimationFrame\(\(\)=>settleReveal\(center,key,frame\+1/);
  assert.match(compare,/stableFrames>=1/);
  assert.match(compare,/current\.card\.contains\(document\.activeElement\)/);
  assert.match(compare,/FOCUS_COMPLETE_EVENT='titans:ticket-compare-focus-complete'/);
  assert.doesNotMatch(compare,/setTimeout\s*\(/);
  assert.doesNotMatch(compare,/setInterval\s*\(/);
  assert.doesNotMatch(compare,/\bfetch\s*\(/);

  assert.match(smoke,/all&&budget&&finalists&&group&&card&&card\.contains\(document\.activeElement\)/);
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)/);
});
