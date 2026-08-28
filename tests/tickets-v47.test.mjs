import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeSeatGeekEvents,safeSeatGeekUrl,ticketPriceBand,TITANS_TICKETS_URL} from '../src/tickets-api.mjs';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('ticket price groups always progress cheapest to most expensive',()=>{
  assert.deepEqual(ticketPriceBand(15),{key:'under-50',label:'Under $50',order:0});
  assert.equal(ticketPriceBand(50).key,'50-99');
  assert.equal(ticketPriceBand(100).key,'100-199');
  assert.equal(ticketPriceBand(200).key,'200-plus');
  assert.equal(ticketPriceBand(null).key,'unknown');
});

test('SeatGeek event summaries normalize and sort by lowest price first',()=>{
  const events=normalizeSeatGeekEvents([
    {id:3,title:'Tennessee Titans at Team C',url:'https://seatgeek.com/c',datetime_utc:'2026-10-01T17:00:00Z',stats:{lowest_price:110,listing_count:8}},
    {id:1,title:'Team A at Tennessee Titans',url:'https://seatgeek.com/a',datetime_utc:'2026-09-01T17:00:00Z',stats:{lowest_price:22,listing_count:20}},
    {id:2,title:'Team B at Tennessee Titans',url:'https://seatgeek.com/b',datetime_utc:'2026-09-15T17:00:00Z',stats:{lowest_price:49,listing_count:12}},
  ]);
  assert.deepEqual(events.map(event=>event.lowestPrice),[22,49,110]);
  assert.deepEqual(events.map(event=>event.homeAway),['home','home','away']);
  assert.equal(events[0].priceBand.key,'under-50');
});

test('ticket purchase URLs fail closed to the official SeatGeek Titans page',()=>{
  assert.equal(safeSeatGeekUrl('javascript:alert(1)'),TITANS_TICKETS_URL);
  assert.equal(safeSeatGeekUrl('https://evil.example/tickets'),TITANS_TICKETS_URL);
  assert.equal(safeSeatGeekUrl('https://seatgeek.com/titans-test'),'https://seatgeek.com/titans-test');
});

test('Ticket Center explains provider scope instead of inventing individual seat listings',async()=>{
  const [api,ui]=await Promise.all([read('src/tickets-api.mjs'),read('tickets-v47.js')]);
  assert.match(api,/scope:'event-inventory-summary'/);
  assert.match(api,/SEATGEEK_CLIENT_ID/);
  assert.match(api,/listing_count\.gt/);
  assert.doesNotMatch(api,/client_secret/);
  assert.match(ui,/Cheapest first\. Always\./);
  assert.match(ui,/complete verified SeatGeek inventory/);
  assert.match(ui,/instead of scraping or inventing listings/);
  assert.match(ui,/data-ticket-filter="home"/);
  assert.match(ui,/data-ticket-filter="away"/);
});

test('Ticket Center is first-class, searchable, PWA packaged, and in responsive production coverage',async()=>{
  const [html,search,sw,matrix,css]=await Promise.all([
    read('index.html'),read('smart-search-v111.js'),read('sw.js'),read('scripts/responsive-matrix-smoke.py'),read('tickets-v47.css')
  ]);
  assert.match(html,/href="#tickets" data-route="tickets"/);
  assert.match(html,/tickets-v47\.css/);
  assert.match(html,/tickets-v47\.js/);
  assert.match(search,/#tickets/);
  assert.match(search,/tickets buy tickets seats seatgeek/i);
  assert.match(sw,/tickets-v47\.css/);
  assert.match(sw,/tickets-v47\.js/);
  assert.match(matrix,/\('tickets','tickets'\)/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/@media\(max-width:390px\)/);
});

test('Home has a prominent Ticket Center entry without changing the five-action mobile dock',async()=>{
  const [ui,html]=await Promise.all([read('tickets-v47.js'),read('index.html')]);
  assert.match(ui,/data\.ticketHome='1'/);
  assert.match(ui,/Buy Titans tickets/);
  const dock=html.match(/<nav class="mobile-nav"[\s\S]*?<\/nav>/)?.[0]||'';
  const actions=[...dock.matchAll(/<(?:a|button)\b/g)];
  assert.equal(actions.length,5);
});
