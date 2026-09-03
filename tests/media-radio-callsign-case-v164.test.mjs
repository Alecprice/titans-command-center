import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-search-v14.js',import.meta.url),'utf8');

test('radio callsign discovery remains case-insensitive through constrained intent',()=>{
  assert.match(js,/const RADIO_CALLSIGN=\/\\b\[WK\]\[A-Z\]\{3\}\\b\/i/);
  assert.match(js,/const callsignHandoff=value=>/);
  assert.match(js,/Boolean\(callsignHandoff\(value\)\)/);
});

test('lowercase callsign handoff is normalized before entering the canonical finder',()=>{
  assert.match(js,/const call=source\.match\(RADIO_CALLSIGN\)\?\.\[0\]/);
  assert.match(js,/return exact\|\|contextual\?call\.toUpperCase\(\):''/);
  assert.match(js,/const call=callsignHandoff\(source\)/);
  assert.match(js,/encodeURIComponent\(handoff\)/);
  assert.match(js,/input\.value=requested/);
});

test('case normalization keeps the existing one-shot and lifecycle boundaries',()=>{
  assert.match(js,/consumeAffiliateHandoff\(\)/);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(/);
  assert.doesNotMatch(js,/WIKQ|WXSM|WCRK|WOKI|WKFN|WAIN/);
});
