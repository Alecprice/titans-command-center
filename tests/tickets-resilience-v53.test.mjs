import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  TITANS_TICKETS_URL,
  __resetTicketCachesForTest,
  groupTicketOffers,
  normalizeSeatGeekEvents,
  providerFailureReason,
  ticketGameKey,
  ticketsRoute,
} from '../src/tickets-api.mjs';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const jsonResponse=(payload,status=200)=>({ok:status>=200&&status<300,status,json:async()=>payload});
function recorder(){
  return {statusCode:200,headers:{},body:null,setHeader(name,value){this.headers[name]=value;},status(code){this.statusCode=code;return this;},json(value){this.body=value;return value;}};
}
async function withFetch(mock,run){const original=globalThis.fetch;globalThis.fetch=mock;try{return await run();}finally{globalThis.fetch=original;}}
const tmEvent=(id='tm1',price=49)=>({id,name:'Chicago Bears at Tennessee Titans',url:`https://www.ticketmaster.com/event/${id}`,dates:{start:{localDate:'2026-08-29',localTime:'17:00:00',dateTime:'2026-08-29T22:00:00Z'}},priceRanges:[{min:price,max:250}],_embedded:{venues:[{name:'Nissan Stadium',city:{name:'Nashville'},state:{stateCode:'TN'}}]}});

test('SeatGeek fixture rejects zero-price noise without losing diagnostics',()=>{
  const [event]=normalizeSeatGeekEvents([{id:1,title:'Chicago Bears at Tennessee Titans',url:'javascript:alert(1)',datetime_local:'2026-08-29T17:00:00',datetime_utc:'2026-08-29T22:00:00Z',time_tbd:true,stats:{lowest_price:0,listing_count:0},venue:null}]);
  assert.equal(event.lowestPrice,null);
  assert.equal(event.priceBand.key,'unknown');
  assert.equal(event.listingCount,0);
  assert.equal(event.url,TITANS_TICKETS_URL);
  assert.equal(event.timeTbd,true);
  assert.equal(event.venue.name,'Venue TBD');
});

test('game identity uses date plus matchup instead of merging unrelated same-day events',()=>{
  const bears={id:'a',provider:'SeatGeek',title:'Chicago Bears at Tennessee Titans',datetimeLocal:'2026-09-20T12:00:00',homeAway:'home',venue:{name:'Nissan Stadium'},lowestPrice:50};
  const colts={id:'b',provider:'Ticketmaster',title:'Indianapolis Colts at Tennessee Titans',datetimeLocal:'2026-09-20T16:00:00',homeAway:'home',venue:{name:'Nissan Stadium'},lowestPrice:60};
  assert.notEqual(ticketGameKey(bears),ticketGameKey(colts));
  assert.equal(groupTicketOffers([bears,colts]).length,2);
});

test('matched providers expose next-best spread and percentage',()=>{
  const games=groupTicketOffers([
    {id:'sg',provider:'SeatGeek',title:'Chicago Bears at Tennessee Titans',datetimeLocal:'2026-08-29T17:00:00',homeAway:'home',venue:{name:'Nissan Stadium'},lowestPrice:40},
    {id:'tm',provider:'Ticketmaster',title:'Chicago Bears at Tennessee Titans',datetimeLocal:'2026-08-29T17:00:00',homeAway:'home',venue:{name:'Nissan Stadium'},lowestPrice:50},
    {id:'sh',provider:'StubHub',title:'Chicago Bears at Tennessee Titans',datetimeLocal:'2026-08-29T17:00:00',homeAway:'home',venue:{name:'Nissan Stadium'},lowestPrice:44},
  ]);
  assert.equal(games.length,1);
  assert.equal(games[0].lowestPrice,40);
  assert.equal(games[0].secondLowestPrice,44);
  assert.equal(games[0].priceSpread,4);
  assert.equal(games[0].priceSpreadPct,10);
  assert.equal(games[0].pricedProviderCount,3);
});

test('provider failures are classified without returning raw upstream errors',()=>{
  assert.equal(providerFailureReason(new Error('SeatGeek 429')),'rate-limited');
  assert.equal(providerFailureReason(new Error('StubHub auth 403')),'authentication');
  assert.equal(providerFailureReason(new Error('Ticketmaster 503')),'upstream-error');
  assert.equal(providerFailureReason(Object.assign(new Error('aborted'),{name:'AbortError'})),'timeout');
});

test('one marketplace can fail while Ticketmaster still serves current prices',async()=>{
  __resetTicketCachesForTest();
  await withFetch(async input=>{
    const url=String(input);
    if(url.includes('api.seatgeek.com'))return jsonResponse({},429);
    if(url.includes('ticketmaster.com/discovery'))return jsonResponse({_embedded:{events:[tmEvent()]}});
    throw new Error(`Unexpected URL ${url}`);
  },async()=>{
    const res=recorder();
    await ticketsRoute({method:'GET',query:{}},res,{SEATGEEK_CLIENT_ID:'pending-test-key',TICKETMASTER_API_KEY:'tm-test-key'});
    assert.equal(res.statusCode,200);
    assert.equal(res.body.available,true);
    assert.equal(res.body.providersConfigured,2);
    assert.equal(res.body.providersCompared,1);
    assert.equal(res.body.providerFailures,1);
    assert.equal(res.body.games[0].lowestPrice,49);
    const seatGeek=res.body.providerResults.find(result=>result.provider==='SeatGeek');
    assert.equal(seatGeek.ok,false);
    assert.equal(seatGeek.errorCode,'rate-limited');
    assert.equal('error' in seatGeek,false);
  });
});

test('all-provider outage serves a recent last-known-good comparison',async()=>{
  __resetTicketCachesForTest();
  let fail=false;
  await withFetch(async input=>{
    const url=String(input);
    if(!url.includes('ticketmaster.com/discovery'))throw new Error(`Unexpected URL ${url}`);
    return fail?jsonResponse({},503):jsonResponse({_embedded:{events:[tmEvent('cached',55)]}});
  },async()=>{
    const first=recorder();
    await ticketsRoute({method:'GET',query:{}},first,{TICKETMASTER_API_KEY:'tm-test-key'});
    assert.equal(first.body.stale,false);
    assert.equal(first.body.games[0].lowestPrice,55);
    fail=true;
    const second=recorder();
    await ticketsRoute({method:'GET',query:{refresh:'1'}},second,{TICKETMASTER_API_KEY:'tm-test-key'});
    assert.equal(second.statusCode,200);
    assert.equal(second.body.stale,true);
    assert.equal(second.body.staleReason,'all-configured-providers-unavailable');
    assert.equal(second.body.games[0].lowestPrice,55);
    assert.match(second.body.lastGoodAt,/^\d{4}-\d{2}-\d{2}T/);
    assert.equal(second.body.providerResults[0].errorCode,'upstream-error');
  });
});

test('StubHub fixture exercises application-only token plus read-only event fetch',async()=>{
  __resetTicketCachesForTest();
  let tokenRequest=null;
  await withFetch(async (input,options={})=>{
    const url=String(input);
    if(url.includes('account.stubhub.com/oauth2/token')){
      tokenRequest=options;
      return jsonResponse({access_token:'sandbox-token',expires_in:3600,scope:'read:events'});
    }
    if(url.includes('api.stubhub.net/catalog/events/search')){
      assert.equal(options.headers.Authorization,'Bearer sandbox-token');
      return jsonResponse({_embedded:{events:[{id:22,name:'Chicago Bears at Tennessee Titans',start_date:'2026-08-29T22:00:00Z',time_confirmed:true,min_ticket_price:{amount:42,currency_code:'USD'},_links:{'event:webpage':{href:'https://www.stubhub.com/example'}},_embedded:{venue:{name:'Nissan Stadium',city:'Nashville',state_province:'TN'}}}]}});
    }
    throw new Error(`Unexpected URL ${url}`);
  },async()=>{
    const res=recorder();
    await ticketsRoute({method:'GET',query:{}},res,{STUBHUB_CLIENT_ID:'client',STUBHUB_CLIENT_SECRET:'secret'});
    assert.equal(res.body.providersCompared,1);
    assert.equal(res.body.games[0].cheapestProvider,'StubHub');
    assert.equal(res.body.games[0].lowestPrice,42);
    assert.match(String(tokenRequest?.body),/grant_type=client_credentials/);
    assert.match(String(tokenRequest?.body),/scope=read%3Aevents/);
    assert.match(String(tokenRequest?.headers?.Authorization),/^Basic /);
  });
});

test('Ticket Center packages provider health, stale cache, and price-spread UI',async()=>{
  const [ui,css,sw]=await Promise.all([read('tickets-v47.js'),read('tickets-resilience-v53.css'),read('sw.js')]);
  assert.match(ui,/titans:tickets-last-good-v53/);
  assert.match(ui,/LAST_GOOD_TTL=24\*60\*60\*1000/);
  assert.match(ui,/Marketplace status/);
  assert.match(ui,/Using last known good ticket prices/);
  assert.match(ui,/Next best is/);
  assert.match(ui,/providerFailures/);
  assert.match(css,/tickets-provider-pill\.live/);
  assert.match(css,/tickets-stale-banner/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(sw,/tickets-resilience-v53\.css/);
  assert.match(sw,/titans-cc-brand-2026-v75/);
});
