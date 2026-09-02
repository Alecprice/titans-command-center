import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const js=await readFile(new URL('../tickets-tenx-v123.js',import.meta.url),'utf8');
const css=await readFile(new URL('../tickets-tenx-v123.css',import.meta.url),'utf8');

test('Observed drops sort is browser-local and requires two matching observations',()=>{
  assert.match(js,/PRICE_MEMORY_KEY='titans:tickets-price-memory-v124'/);
  assert.match(js,/function observedDrop\(item,memory\)/);
  assert.match(js,/if\(points\.length<2\|\|item\.price==null\)return null/);
  assert.match(js,/previous<=current\|\|current!==item\.price\)return null/);
  assert.match(js,/const amount=previous-current/);
  assert.doesNotMatch(js,/setJSON\?\.\(PRICE_MEMORY_KEY/);
});

test('Observed drops joins the existing sort controls without hiding games',()=>{
  assert.match(js,/data-ticket-tenx-sort="drops"[^>]*disabled>Observed drops<\/button>/);
  assert.match(js,/if\(state\.sort==='drops'&&!dropCount\)state\.sort='price'/);
  assert.match(js,/if\(state\.sort==='drops'\)\{/);
  assert.match(js,/return \(bDrop-aDrop\)\|\|\(\(a\.price\?\?Number\.MAX_SAFE_INTEGER\)-\(b\.price\?\?Number\.MAX_SAFE_INTEGER\)\)/);
  assert.match(js,/dropButton\.disabled=dropCount===0/);
  assert.match(js,/Observed drops \(\$\{dropCount\}\)/);
  assert.match(js,/const show=cap==null\|\|\(item\.price!=null&&item\.price<=cap\)/);
});

test('Observed drops copy stays factual and avoids buy-wait claims',()=>{
  assert.match(js,/largest price drops observed in this browser first/);
  assert.match(js,/This is local history, not marketplace-wide/);
  assert.doesNotMatch(js,/buy now/i);
  assert.doesNotMatch(js,/wait to buy/i);
  assert.doesNotMatch(js,/deal score/i);
});

test('Observed drops remains touch-safe and readable on phones',()=>{
  assert.match(css,/button:disabled\{cursor:not-allowed;opacity:\.5\}/);
  assert.match(css,/@media\(max-width:620px\)[\s\S]*fieldset:nth-child\(2\)\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)\}/);
  assert.match(css,/@media\(max-width:390px\)[\s\S]*fieldset:nth-child\(2\)\{grid-template-columns:1fr\}/);
  assert.match(css,/\.tickets-tenx-controls button\{min-height:44px/);
});

test('memory changes refresh after v124 capture windows',()=>{
  assert.match(js,/function scheduleAfterMemoryCapture\(\)\{schedule\(\);requestAnimationFrame\(schedule\);\}/);
  assert.match(js,/if\(target\.closest\('\[data-ticket-refresh\],\[data-ticket-trend-clear\]'\)\)requestAnimationFrame\(schedule\)/);
  assert.match(js,/event\.key===STORAGE_KEY\|\|event\.key===PRICE_MEMORY_KEY/);
});
