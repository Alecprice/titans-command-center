import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {groupTicketOffers,normalizeStubHubEvents,normalizeTicketmasterEvents,safeTicketmasterUrl,TITANS_TICKETS_URL} from '../src/tickets-api.mjs';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Ticketmaster normalizes price ranges cheapest first',()=>{
  const events=normalizeTicketmasterEvents([
    {id:'b',name:'Tennessee Titans at Team B',url:'https://www.ticketmaster.com/event/b',dates:{start:{localDate:'2026-10-01',localTime:'13:00:00',dateTime:'2026-10-01T17:00:00Z'}},priceRanges:[{min:120,max:400}],_embedded:{venues:[{name:'B',city:{name:'City'},state:{stateCode:'TN'}}]}},
    {id:'a',name:'Team A at Tennessee Titans',url:'https://www.ticketmaster.com/event/a',dates:{start:{localDate:'2026-09-01',localTime:'12:00:00',dateTime:'2026-09-01T16:00:00Z'}},priceRanges:[{min:45,max:250}],_embedded:{venues:[{name:'A',city:{name:'Nashville'},state:{stateCode:'TN'}}]}},
  ]);
  assert.deepEqual(events.map(event=>event.lowestPrice),[45,120]);
  assert.deepEqual(events.map(event=>event.homeAway),['home','away']);
  assert.ok(events.every(event=>event.provider==='Ticketmaster'));
  assert.equal(safeTicketmasterUrl('javascript:alert(1)'),TITANS_TICKETS_URL);
});

test('StubHub public event minimums normalize for comparison',()=>{
  const events=normalizeStubHubEvents([{id:22,name:'Chicago Bears at Tennessee Titans',start_date:'2026-08-29T17:00:00Z',time_confirmed:true,min_ticket_price:{amount:39,currency_code:'USD'},_links:{'event:webpage':{href:'https://www.stubhub.com/example'}},_embedded:{venue:{name:'Nissan Stadium',city:'Nashville',state_province:'TN'}}}]);
  assert.equal(events.length,1);
  assert.equal(events[0].provider,'StubHub');
  assert.equal(events[0].lowestPrice,39);
  assert.equal(events[0].homeAway,'home');
});

test('same-day marketplace offers are grouped and cheapest provider wins',()=>{
  const games=groupTicketOffers([
    {id:'sg',provider:'SeatGeek',title:'Chicago Bears at Tennessee Titans',url:'https://seatgeek.com/a',datetimeLocal:'2026-08-29T17:00:00',datetimeUtc:'2026-08-29T22:00:00Z',homeAway:'home',venue:{name:'Nissan Stadium'},lowestPrice:52},
    {id:'tm',provider:'Ticketmaster',title:'Chicago Bears at Tennessee Titans',url:'https://ticketmaster.com/a',datetimeLocal:'2026-08-29T17:00:00',datetimeUtc:'2026-08-29T22:00:00Z',homeAway:'home',venue:{name:'Nissan Stadium'},lowestPrice:48},
    {id:'sh',provider:'StubHub',title:'Chicago Bears at Tennessee Titans',url:'https://stubhub.com/a',datetimeLocal:'2026-08-29T17:00:00',datetimeUtc:'2026-08-29T22:00:00Z',homeAway:'home',venue:{name:'Nissan Stadium'},lowestPrice:44},
  ]);
  assert.equal(games.length,1);
  assert.equal(games[0].providerCount,3);
  assert.equal(games[0].cheapestProvider,'StubHub');
  assert.equal(games[0].lowestPrice,44);
  assert.deepEqual(games[0].offers.map(offer=>offer.provider),['StubHub','Ticketmaster','SeatGeek']);
});

test('Ticket Center keeps general bootstrap data off the critical price path',async()=>{
  const ui=await read('tickets-v47.js');
  assert.match(ui,/titans:tickets-fast-v52/);
  assert.match(ui,/CACHE_TTL=5\*60\*1000/);
  assert.match(ui,/requestIdleCallback/);
  assert.match(ui,/apiJson\('\/api\/tickets',\{ttl:300000/);
  assert.match(ui,/\/api\/tickets\?refresh=1/);
  assert.doesNotMatch(ui,/Promise\.all\(\[\s*runtime\.apiJson\('\/api\/tickets'[\s\S]*runtime\.apiJson\('\/api\/data'/);
});

test('Ticket Center app-render reconciliation cannot recursively rewrite its own surface',async()=>{
  const ui=await read('tickets-v47.js');
  assert.match(ui,/if\(!app\.querySelector\('\[data-ticket-center\]'\)\)/);
  assert.match(ui,/route\(\)==='tickets'&&!app\.querySelector\('\[data-ticket-center\]'\)\)mountTickets\(\)/);
  assert.doesNotMatch(ui,/runtime\.onAppRender\(\(\)=>queueMicrotask\(reconcile\)/);
});

test('Cloudflare edge cache owns automatic ticket checks and manual refresh bypasses it',async()=>{
  const [worker,api]=await Promise.all([read('cloudflare/worker.mjs'),read('src/tickets-api.mjs')]);
  assert.match(worker,/route==='tickets'\)return await cachedAdapterData/);
  assert.match(worker,/url\.searchParams\.size/);
  assert.match(worker,/X-Titans-Edge-Cache/);
  assert.match(api,/s-maxage=300, stale-while-revalidate=900/);
  assert.match(api,/AbortSignal\.timeout\(2400\)/);
});

test('all configured free ticket providers run in parallel instead of fallback order',async()=>{
  const api=await read('src/tickets-api.mjs');
  assert.match(api,/Promise\.all\(jobs\)/);
  assert.match(api,/jobs\.push\(runProvider\('SeatGeek'/);
  assert.match(api,/jobs\.push\(runProvider\('Ticketmaster'/);
  assert.match(api,/jobs\.push\(runProvider\('StubHub'/);
  assert.match(api,/STUBHUB_CLIENT_ID/);
  assert.match(api,/STUBHUB_CLIENT_SECRET/);
  assert.doesNotMatch(api,/SeatGeek remains first provider/);
});
