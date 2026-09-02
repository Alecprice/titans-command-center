import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Alternative Viewing is loaded and available offline',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/media-alternatives-v14\.css\?v=2/);
  assert.match(html,/media-alternatives-v14\.js\?v=1/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
  assert.match(sw,/media-alternatives-v14\.css/);
  assert.match(sw,/media-alternatives-v14\.js/);
});

test('Alternative Viewing uses authorized NFL, Titans and commercial provider paths',()=>{
  const js=read('media-alternatives-v14.js');
  for(const token of ['nfl.com/ways-to-watch','nfl.com/plus','tennesseetitans.com/watch-live-games','tv.youtube.com/learn/nflsundayticket','nfl.com/international/ways-to-watch','dazn.com','everpass.com/live-sports/nfl-sunday-ticket'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/Other legitimate ways to watch/);
  assert.match(js,/official or licensed providers/);
  assert.doesNotMatch(js,/<iframe/i);
  assert.doesNotMatch(js,/document\.write/);
});

test('Alternative Viewing changes guidance for Nashville U.S. and international fans',()=>{
  const js=read('media-alternatives-v14.js');
  assert.match(js,/area\(\)==='international'/);
  assert.match(js,/area\(\)==='us'/);
  assert.match(js,/Over-the-air \/ local TV/);
  assert.match(js,/NFL Sunday Ticket/);
  assert.match(js,/NFL Game Pass on DAZN/);
  assert.match(js,/Licensed sports bar/);
});

test('Alternative Viewing stays mobile friendly and reacts to territory changes',()=>{
  const js=read('media-alternatives-v14.js'),css=read('media-alternatives-v14.css');
  assert.match(js,/data-media-area/);
  assert.match(js,/MutationObserver/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/grid-template-columns:1fr/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});
