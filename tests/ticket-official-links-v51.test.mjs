import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('free ticket enhancement carries a game-specific official destination for every remaining 2026 Titans game',async()=>{
  const ui=await read('tickets-official-v51.js');
  const links=[...ui.matchAll(/'\d{2}-\d{2}':\{marketplace:'(SeatGeek|Ticketmaster)',url:'(https:\/\/[^']+)'\}/g)];
  assert.equal(links.length,18);
  assert.equal(new Set(links.map(match=>match[0].slice(1,6))).size,18);
  assert.ok(links.every(([,marketplace,url])=>marketplace==='SeatGeek'?url.startsWith('https://seatgeek.com/tennessee-titans-tickets/'):url.startsWith('https://www.ticketmaster.com/event/')));
  assert.match(ui,/08-29[\s\S]*18076599/);
  assert.match(ui,/09-27[\s\S]*00006491C2E8E049/);
  assert.match(ui,/01-10[\s\S]*3A00647B804947ED/);
});

test('fallback ticket cards are rewritten to official game links instead of one generic marketplace page',async()=>{
  const ui=await read('tickets-official-v51.js');
  assert.match(ui,/card\.href=official\.url/);
  assert.match(ui,/card\.dataset\.officialTicketLink='1'/);
  assert.match(ui,/card\.dataset\.ticketMarketplace=official\.marketplace/);
  assert.match(ui,/Official Titans tickets ↗/);
  assert.match(ui,/Official game links are live/);
  assert.match(ui,/No ticket API key required/);
});

test('home and away filters also work when live price summaries are unavailable',async()=>{
  const ui=await read('tickets-official-v51.js');
  assert.match(ui,/const filter=currentFilter\(center\)/);
  assert.match(ui,/const visible=filter==='all'\|\|filter===side/);
  assert.match(ui,/card\.hidden=!visible/);
  assert.match(ui,/tickets-next-official-v51/);
});

test('official-link fallback never overwrites the live multi-market comparison board',async()=>{
  const ui=await read('tickets-official-v51.js');
  assert.match(ui,/const comparisonBoard=center\.querySelector\('\.tickets-comparison-board'\)/);
  assert.match(ui,/if\(priceGroups\|\|comparisonBoard\)return/);
});

test('free ticket enhancement remains mobile accessible, observer-light, and source-transparent',async()=>{
  const [ui,css]=await Promise.all([read('tickets-official-v51.js'),read('tickets-official-v51.css')]);
  assert.match(ui,/Source: TennesseeTitans\.com ↗/);
  assert.match(ui,/\$0<\/b> API cost/);
  assert.match(ui,/observer\.observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(ui,/observer\.observe\(app,\{childList:true,subtree:true\}\)/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/tickets-next-label-v51[^\n]*font-size:10px/);
  assert.match(css,/focus-visible/);
});

test('ticket enhancement is loaded through the existing ticket module dependency chain',async()=>{
  const social=await read('titans-social-v49.js');
  assert.match(social,/^import '\.\/tickets-official-v51\.js';/);
});
