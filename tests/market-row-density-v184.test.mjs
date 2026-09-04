import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const js=readFileSync(new URL('../market-hub.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../market-hub.css',import.meta.url),'utf8');

test('large Market Pulse boards render a bounded first tranche',()=>{
  assert.match(js,/const DEFAULT_VISIBLE_ROWS=72,ROW_PAGE_SIZE=72/);
  assert.match(js,/visible=shown\.slice\(0,marketUi\.visibleRows\)/);
  assert.match(js,/remaining=Math\.max\(0,shown\.length-visible\.length\)/);
  assert.match(js,/id="mh-show-more"/);
  assert.match(js,/id="mh-show-all"/);
  assert.match(js,/marketUi\.visibleRows\+=ROW_PAGE_SIZE/);
  assert.match(js,/marketUi\.visibleRows=Number\.MAX_SAFE_INTEGER/);
});

test('filter and route changes restore the bounded scan state',()=>{
  assert.match(js,/function resetVisibleRows\(\)\{marketUi\.visibleRows=DEFAULT_VISIBLE_ROWS\}/);
  assert.match(js,/mh-event-filter[\s\S]*resetVisibleRows\(\);renderMarket/);
  assert.match(js,/mh-book-filter[\s\S]*resetVisibleRows\(\);renderMarket/);
  assert.match(js,/mh-category-filter[\s\S]*resetVisibleRows\(\);renderMarket/);
  assert.match(js,/mh-alt-toggle[\s\S]*resetVisibleRows\(\);renderMarket/);
  assert.match(js,/hashchange[\s\S]*resetVisibleRows\(\)/);
});

test('density controls stay accessible and phone-sized',()=>{
  assert.match(js,/class="mh-density" role="status"/);
  assert.match(js,/Filters are the fastest way to narrow a large board/);
  assert.match(css,/\.mh-density \.button\{min-height:44px/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.mh-density \.button\{min-height:48px/);
});

test('density pass does not create a second market data owner',()=>{
  assert.equal((js.match(/fetch\('\/api\/market-data'/g)||[]).length,1);
  assert.doesNotMatch(js,/localStorage|sessionStorage|WebSocket|EventSource|setInterval/);
  assert.match(js,/fetch\('\/api\/market-data',\{cache:force\?'no-store':'default'/);
});
