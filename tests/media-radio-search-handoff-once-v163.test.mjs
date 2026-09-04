import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-search-v14.js',import.meta.url),'utf8');

test('affiliate handoff is consumed only after the canonical finder can apply it',()=>{
  assert.match(js,/function consumeAffiliateHandoff\(\)/);
  assert.match(js,/if\(!next\.has\('affiliate'\)\)return/);
  assert.match(js,/if\(!input\|\|!details\)return false/);
  assert.match(js,/input\.dispatchEvent\(new Event\('input',\{bubbles:true\}\)\);\n    consumeAffiliateHandoff\(\)/);
});

test('consuming the handoff preserves unrelated Media query state',()=>{
  assert.match(js,/next\.delete\('affiliate'\)/);
  assert.match(js,/const rest=next\.toString\(\)/);
  assert.match(js,/history\.replaceState\(null,'',`#media\$\{rest\?`\?\$\{rest\}`:''\}`\)/);
  assert.doesNotMatch(js,/location\.hash=['"]#media/);
});

test('a rerender cannot replay the original affiliate query over a manual finder filter',()=>{
  assert.match(js,/consumeAffiliateHandoff\(\);return true/);
  assert.match(js,/details\.dataset\.searchHandoff=requested/);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(js,/sessionStorage|localStorage/);
});
