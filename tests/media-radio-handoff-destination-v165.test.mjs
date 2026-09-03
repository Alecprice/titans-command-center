import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../media-search-v14.js',import.meta.url),'utf8');

test('successful affiliate handoff reveals the canonical finder after applying its filter',()=>{
  assert.match(js,/function revealAffiliateFinder\(details\)/);
  assert.match(js,/input\.dispatchEvent\(new Event\('input',\{bubbles:true\}\)\);\n    consumeAffiliateHandoff\(\);\n    revealAffiliateFinder\(details\)/);
  assert.match(js,/details\.scrollIntoView\?\.\(\{block:'center',behavior:reduced\?'auto':'smooth'\}\)/);
});

test('destination handoff moves keyboard context to the finder summary without focusing the search input',()=>{
  assert.match(js,/const summary=details\.querySelector\('summary'\)/);
  assert.match(js,/summary\?\.focus\?\.\(\{preventScroll:true\}\)/);
  assert.doesNotMatch(js,/input\.focus\(/);
});

test('destination reveal is one-shot, route-safe, and respects reduced motion',()=>{
  assert.match(js,/requestAnimationFrame\(\(\)=>\{/);
  assert.match(js,/if\(route\(\)!=='media'\|\|!details\?\.isConnected\)return/);
  assert.match(js,/prefers-reduced-motion: reduce/);
  assert.equal((js.match(/requestAnimationFrame\(/g)||[]).length,1);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(js,/setInterval\(|localStorage|sessionStorage|fetch\(/);
});
