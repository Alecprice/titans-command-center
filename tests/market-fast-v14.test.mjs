import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Market Pulse can paint a cached snapshot before live refresh finishes',()=>{
  const js=read('market-fast-v14.js');
  assert.match(js,/titans:v10Data/);
  assert.match(js,/FAST SNAPSHOT/);
  assert.match(js,/full live board/);
  assert.match(js,/localStorage\.getItem/);
  assert.match(js,/fetch\('\/api\/data'/);
  assert.match(js,/market-hub/);
});

test('fast market shell preserves authoritative full-board freshness language',()=>{
  const js=read('market-fast-v14.js');
  assert.match(js,/Source\/freshness labels on the full board remain authoritative/);
  assert.match(js,/replaces this snapshot automatically/);
});

test('fast market shell is mobile and reduced-motion friendly',()=>{
  const css=read('market-fast-v14.css'),html=read('index.html'),sw=read('sw.js');
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(html,/market-fast-v14\.css\?v=1/);
  assert.match(html,/market-fast-v14\.js\?v=1/);
  assert.match(sw,/titans-cc-brand-2026-v37/);
  assert.match(sw,/market-fast-v14\.css/);
  assert.match(sw,/market-fast-v14\.js/);
});
