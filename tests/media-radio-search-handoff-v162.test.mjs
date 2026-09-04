import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-search-v14.js',import.meta.url),'utf8');

test('radio callsign or frequency search can carry a focused affiliate handoff',()=>{
  assert.match(js,/const affiliateHandoff=value=>/);
  assert.match(js,/source\.match\(RADIO_CALLSIGN\)/);
  assert.match(js,/source\.match\(RADIO_FREQUENCY\)/);
  assert.match(js,/a\.href='#media'/);
  assert.match(js,/a\.href=`#media\?affiliate=\$\{encodeURIComponent\(handoff\)\}`/);
  assert.doesNotMatch(js,/WIKQ|WXSM|WCRK|WOKI|WKFN|WAIN/);
});

test('Media route applies the handoff through the canonical finder input event',()=>{
  assert.match(js,/if\(route\(\)==='media'\)\{applyAffiliateHandoff\(\);return\}/);
  assert.match(js,/querySelector\('\[data-affiliate-search-input\]'\)/);
  assert.match(js,/closest\('\.media-affiliate-finder'\)/);
  assert.match(js,/details\.open=true/);
  assert.match(js,/input\.value=requested/);
  assert.match(js,/input\.dispatchEvent\(new Event\('input',\{bubbles:true\}\)\)/);
});

test('handoff is fail-closed and does not overwrite a later manual filter',()=>{
  assert.match(js,/const requested=affiliateHandoff\(params\(\)\.get\('affiliate'\)\|\|''\)/);
  assert.match(js,/if\(!requested\)return false/);
  assert.match(js,/if\(details\.dataset\.searchHandoff===requested\)\{consumeAffiliateHandoff\(\);return true\}/);
  assert.match(js,/details\.dataset\.searchHandoff=requested/);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
});
