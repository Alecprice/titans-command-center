import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-search-v14.js',import.meta.url),'utf8');

test('Listen Watch search bridge recognizes radio affiliate language',()=>{
  assert.match(js,/affiliate\|station/);
  assert.match(js,/\|am\|fm\|call sign\|/);
  assert.match(js,/where to watch\|where to listen/);
});

test('radio callsign and frequency shapes can surface the Media route without duplicating the station registry',()=>{
  assert.match(js,/const RADIO_CALLSIGN=\/\\b\[WK\]\[A-Z\]\{3\}\\b\//);
  assert.match(js,/const RADIO_FREQUENCY=/);
  assert.match(js,/\\d\{3,4\}\\s\*\(\?:AM\|FM\)/);
  assert.match(js,/\\d\{2,3\}\\\.\\d/);
  assert.match(js,/const mediaIntent=value=>TERMS\.test\(value\)\|\|RADIO_CALLSIGN\.test\(value\)\|\|RADIO_FREQUENCY\.test\(value\)/);
  assert.doesNotMatch(js,/WIKQ|WXSM|WCRK|WOKI|WKFN|WAIN/);
});

test('search enhancement remains route-scoped and idempotent while supporting Media handoff',()=>{
  assert.match(js,/if\(route\(\)==='media'\)\{applyAffiliateHandoff\(\);return\}/);
  assert.match(js,/if\(route\(\)!=='search'\|\|!mediaIntent\(value\)\)return/);
  assert.match(js,/links\.querySelector\('\[data-media-search-link\]'\)/);
  assert.match(js,/a\.href='#media'/);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
});
