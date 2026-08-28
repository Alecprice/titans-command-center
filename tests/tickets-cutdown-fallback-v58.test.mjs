import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('production shell actually loads the existing Team Room semantic repair after Team Room ownership',async()=>{
  const html=await read('index.html');
  const owner=html.indexOf('/team-room.js?v=28');
  const repair=html.indexOf('/team-room-state-repair-v54.js?v=1');
  assert.ok(owner>=0,'Team Room owner must be loaded');
  assert.ok(repair>owner,'semantic repair must execute after Team Room owner');
});

test('ticket cards use a truthful actionable fallback instead of Price unavailable',async()=>{
  const [html,ui]=await Promise.all([read('index.html'),read('tickets-price-fallback-v58.js')]);
  assert.match(html,/tickets-price-fallback-v58\.js\?v=1/);
  assert.match(ui,/replacement='Check live price'/);
  assert.match(ui,/Live price pending · open marketplace/);
  assert.match(ui,/Price unavailable/);
  assert.doesNotMatch(ui,/\$\d+/,'fallback must never invent a dollar price');
  assert.match(ui,/MutationObserver\(schedule\)\.observe\(app,\{childList:true,subtree:false\}\)/);
});

test('new ticket fallback remains available in the offline PWA shell',async()=>{
  const sw=await read('sw.js');
  assert.match(sw,/tickets-price-fallback-v58\.js/);
  assert.match(sw,/titans-cc-brand-2026-v76/);
});
