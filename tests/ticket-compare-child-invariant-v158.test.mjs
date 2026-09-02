import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('v158 recovers Saved Compare when the live Ticket Center rewrites direct children',async()=>{
  const source=await read('tickets-compare-cache-bridge-v141.js');

  assert.match(source,/revision:'v158'/);
  assert.match(source,/__TitansTicketCompareChildInvariantV158/);
  assert.match(source,/const childChanged=saved\(\)\.length>0&&mutations\.some\(mutation=>mutation\.type==='childList'\)/);
  assert.match(source,/centerObserver\.observe\(boundCenter,\{attributes:true,attributeFilter:\['data-ticket-tenx-saved-count'\],childList:true,subtree:false\}\)/);
  assert.match(source,/if\(savedChanged\|\|childChanged\)schedule\(savedChanged\?'saved-count':'center-child'\)/);
});

test('v158 remains a bounded state-to-view invariant instead of another polling owner',async()=>{
  const source=await read('tickets-compare-cache-bridge-v141.js');

  assert.match(source,/const before=settled\(center,items\)/);
  assert.match(source,/if\(before\)return/);
  assert.match(source,/render\(center,items\)/);
  assert.match(source,/settledAfter:settled\(center,items\)/);
  assert.equal((source.match(/new MutationObserver/g)||[]).length,2);
  assert.doesNotMatch(source,/subtree:true/);
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/\bsetInterval\s*\(/);
  assert.doesNotMatch(source,/\bsetTimeout\s*\(/);
});

test('v158 preserves the existing Saved Compare truth and strict production deadline',async()=>{
  const [source,smoke]=await Promise.all([
    read('tickets-compare-cache-bridge-v141.js'),
    read('scripts/tickets-browser-smoke.py')
  ]);

  assert.match(source,/data-ticket-compare-owner="v156"/);
  assert.match(source,/Party totals are starting price × ticket count, before fees/);
  assert.match(source,/Seat quality and checkout fees are not inferred/);
  assert.match(source,/data-ticket-compare-share/);
  assert.match(source,/data-ticket-compare-focus/);
  assert.match(source,/data-ticket-tenx-save/);
  assert.match(smoke,/WebDriverWait\(driver,8,poll_frequency=\.1\)\.until/);
});
