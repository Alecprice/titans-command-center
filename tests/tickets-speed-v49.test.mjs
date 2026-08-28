import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeTicketmasterEvents,safeTicketmasterUrl,TITANS_TICKETS_URL} from '../src/tickets-api.mjs';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Ticketmaster fallback normalizes price ranges cheapest first',()=>{
  const events=normalizeTicketmasterEvents([
    {id:'b',name:'Tennessee Titans at Team B',url:'https://www.ticketmaster.com/event/b',dates:{start:{localDate:'2026-10-01',localTime:'13:00:00',dateTime:'2026-10-01T17:00:00Z'}},priceRanges:[{min:120,max:400}],_embedded:{venues:[{name:'B',city:{name:'City'},state:{stateCode:'TN'}}]}},
    {id:'a',name:'Team A at Tennessee Titans',url:'https://www.ticketmaster.com/event/a',dates:{start:{localDate:'2026-09-01',localTime:'12:00:00',dateTime:'2026-09-01T16:00:00Z'}},priceRanges:[{min:45,max:250}],_embedded:{venues:[{name:'A',city:{name:'Nashville'},state:{stateCode:'TN'}}]}},
  ]);
  assert.deepEqual(events.map(event=>event.lowestPrice),[45,120]);
  assert.deepEqual(events.map(event=>event.homeAway),['home','away']);
  assert.ok(events.every(event=>event.provider==='Ticketmaster'));
  assert.equal(safeTicketmasterUrl('javascript:alert(1)'),TITANS_TICKETS_URL);
});

test('Ticket Center removes general bootstrap data from the critical price path',async()=>{
  const ui=await read('tickets-v47.js');
  assert.match(ui,/titans:tickets-fast-v49/);
  assert.match(ui,/CACHE_TTL=10\*60\*1000/);
  assert.match(ui,/requestIdleCallback/);
  assert.match(ui,/apiJson\('\/api\/tickets',\{ttl:300000/);
  assert.match(ui,/if\(!payload\?\.available\)loadFallbackData\(\)/);
  assert.doesNotMatch(ui,/Promise\.all\(\[\s*runtime\.apiJson\('\/api\/tickets'[\s\S]*runtime\.apiJson\('\/api\/data'/);
});

test('Cloudflare edge cache owns tickets instead of relying on response headers alone',async()=>{
  const [worker,api]=await Promise.all([read('cloudflare/worker.mjs'),read('src/tickets-api.mjs')]);
  assert.match(worker,/route==='tickets'\)return await cachedAdapterData/);
  assert.match(worker,/globalThis\.caches\?\.default/);
  assert.match(worker,/X-Titans-Edge-Cache/);
  assert.match(api,/s-maxage=300, stale-while-revalidate=3600/);
  assert.match(api,/AbortSignal\.timeout\(2200\)/);
});

test('SeatGeek remains first provider and Ticketmaster is fallback-only',async()=>{
  const api=await read('src/tickets-api.mjs');
  const seatGeekIndex=api.indexOf('if(clientId)');
  const ticketmasterIndex=api.indexOf('if(ticketmasterKey)');
  assert.ok(seatGeekIndex>=0&&ticketmasterIndex>seatGeekIndex);
  assert.match(api,/TICKETMASTER_API_KEY/);
  assert.match(api,/Ticketmaster Discovery is providing event-level price ranges/);
});
