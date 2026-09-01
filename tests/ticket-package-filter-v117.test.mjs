import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeTicketmasterEvents,safeTicketmasterUrl} from '../src/tickets-api.mjs';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

const venue={name:'Nissan Stadium',city:{name:'Nashville'},state:{stateCode:'TN'}};
const start={localDate:'2026-09-13',localTime:'12:00:00',dateTime:'2026-09-13T17:00:00Z'};

test('Ticketmaster game normalization rejects hotel travel and parking products',()=>{
  const rows=normalizeTicketmasterEvents([
    {id:'game',name:'Tennessee Titans vs. New York Jets',url:'https://www.ticketmaster.com/event/game',dates:{start},priceRanges:[{min:55,max:240}],_embedded:{venues:[venue]}},
    {id:'hotel',name:'Las Vegas Raiders vs. Tennessee Titans | Official Hotel Packages',url:'https://travel.ticketmaster.com/en-US/package-forward/103568662',dates:{start:{...start,localDate:'2026-12-27',dateTime:'2026-12-27T21:05:00Z'}},priceRanges:[{min:75,max:600}],_embedded:{venues:[venue]}},
    {id:'parking',name:'Parking: Tennessee Titans vs. New York Jets',url:'https://www.ticketmaster.com/event/parking',dates:{start},priceRanges:[{min:25,max:80}],_embedded:{venues:[venue]}},
  ]);
  assert.deepEqual(rows.map(row=>row.id),['tm:game']);
  assert.equal(rows[0].lowestPrice,55);
});

test('Ticketmaster subdomain URL safety stays separate from game-event eligibility',()=>{
  const travel='https://travel.ticketmaster.com/en-US/package-forward/103568662';
  assert.equal(safeTicketmasterUrl(travel),travel);
  assert.equal(normalizeTicketmasterEvents([{id:'hotel',name:'Tennessee Titans Official Hotel Packages',url:travel,dates:{start},priceRanges:[{min:99}],_embedded:{venues:[venue]}}]).length,0);
});

test('Ticket Center browser smoke mirrors reviewed marketplace subdomain policy and rejects ancillary cards',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/SAFE_ROOTS=\('seatgeek\.com','ticketmaster\.com','stubhub\.com','tennesseetitans\.com'\)/);
  assert.match(smoke,/def host_allowed\(host,root\):/);
  assert.match(smoke,/return host==root or host\.endswith\(f'\.\{root\}'\)/);
  assert.match(smoke,/any\(host_allowed\(host,root\) for root in SAFE_ROOTS\)/);
  assert.match(smoke,/ancillary Ticketmaster products entered game comparison/);
  assert.doesNotMatch(smoke,/SAFE_HOSTS=/);
});
