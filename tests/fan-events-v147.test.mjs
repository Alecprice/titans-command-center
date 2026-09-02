import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fanEventsRoute,
  normalizeSeatGeekEvents,
} from '../src/fan-events-api.mjs';

function responseRecorder(){
  const state={status:200,headers:new Map(),payload:null};
  const res={
    setHeader(name,value){state.headers.set(String(name).toLowerCase(),String(value));return res;},
    status(code){state.status=Number(code);return res;},
    json(payload){state.payload=payload;return payload;},
  };
  return {res,state};
}

const futureIso=()=>new Date(Date.now()+86400000).toISOString();

test('SeatGeek normalizer keeps canonical SeatGeek URLs and venue coordinates',()=>{
  const event=normalizeSeatGeekEvents([{
    id:123,
    title:'Nashville Live Event',
    url:'https://seatgeek.com/nashville-live-event-tickets',
    datetime_utc:'2026-09-10T01:30:00',
    type:'concert',
    venue:{name:'Nashville Room',city:'Nashville',state:'TN',country:'US',location:{lat:36.16,lon:-86.78}},
    taxonomies:[{name:'concert'}],
  }])[0];
  assert.equal(event.provider,'SeatGeek');
  assert.equal(event.start,'2026-09-10T01:30:00Z');
  assert.equal(event.coordinates.lat,36.16);
  assert.equal(event.coordinates.lon,-86.78);
  assert.equal(event.url,'https://seatgeek.com/nashville-live-event-tickets');

  const unsafe=normalizeSeatGeekEvents([{
    id:124,title:'Unsafe',url:'https://example.com/event',datetime_utc:'2026-09-10T01:30:00',venue:{city:'Nashville',state:'TN'}
  }]);
  assert.equal(unsafe.length,0);
});

test('SeatGeek reuses existing server credential with the same bounded Nashville scope',async()=>{
  const originalFetch=globalThis.fetch;
  let requested='';
  globalThis.fetch=async input=>{
    requested=String(input);
    const start=futureIso().replace(/\.\d{3}Z$/,'');
    return {ok:true,status:200,json:async()=>({events:[{
      id:321,title:'SeatGeek Nashville Event',url:'https://seatgeek.com/seat-geek-nashville-event-tickets',datetime_utc:start,
      venue:{name:'Downtown Venue',city:'Nashville',state:'TN',country:'US',location:{lat:36.1665,lon:-86.7713}},taxonomies:[{name:'concert'}]
    }]})};
  };
  try{
    const capture=responseRecorder();
    await fanEventsRoute({method:'GET',query:{route:'fan-events'}},capture.res,{SEATGEEK_CLIENT_ID:'test-client',SEATGEEK_AID:'test-aid'});
    assert.equal(capture.state.status,200);
    assert.equal(capture.state.payload.configuredProviders.seatgeek,true);
    assert.equal(capture.state.payload.providersConfigured,1);
    assert.equal(capture.state.payload.providersAvailable,1);
    assert.equal(capture.state.payload.providersContributing,1);
    assert.equal(capture.state.payload.providerResults[0].provider,'SeatGeek');
    assert.equal(capture.state.payload.providerResults[0].displayedCount,1);
    const url=new URL(requested);
    assert.equal(url.hostname,'api.seatgeek.com');
    assert.equal(url.pathname,'/2/events');
    assert.equal(url.searchParams.get('client_id'),'test-client');
    assert.equal(url.searchParams.get('aid'),'test-aid');
    assert.equal(url.searchParams.get('lat'),'36.1665');
    assert.equal(url.searchParams.get('lon'),'-86.7713');
    assert.equal(url.searchParams.get('range'),'25mi');
    assert.equal(url.searchParams.get('sort'),'datetime_utc.asc');
    assert.match(capture.state.payload.message,/1 contributing provider; 1 connected provider responded/);
  }finally{
    globalThis.fetch=originalFetch;
  }
});

test('summary distinguishes providers responding from providers actually contributing displayed events',async()=>{
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async input=>{
    const url=new URL(String(input));
    if(url.hostname==='app.ticketmaster.com'){
      return {ok:true,status:200,json:async()=>({_embedded:{events:[{
        id:'tm-one',name:'Only Displayed Event',url:'https://www.ticketmaster.com/event/tm-one',
        dates:{start:{dateTime:futureIso()}},
        _embedded:{venues:[{name:'Arena',city:{name:'Nashville'},state:{stateCode:'TN'},country:{countryCode:'US'},location:{latitude:'36.1665',longitude:'-86.7713'}}]}
      }]}})};
    }
    if(url.hostname==='www.eventbriteapi.com')return {ok:true,status:200,json:async()=>({organizations:[]})};
    if(url.hostname==='www.skiddle.com')return {ok:true,status:200,json:async()=>({results:[]})};
    throw new Error(`Unexpected provider ${url.hostname}`);
  };
  try{
    const capture=responseRecorder();
    await fanEventsRoute({method:'GET',query:{route:'fan-events'}},capture.res,{
      TICKETMASTER_API_KEY:'tm-test',EVENTBRITE_PRIVATE_TOKEN:'eb-test',SKIDDLE_API_KEY:'sk-test'
    });
    assert.equal(capture.state.payload.count,1);
    assert.equal(capture.state.payload.providersAvailable,3);
    assert.equal(capture.state.payload.providersContributing,1);
    assert.equal(capture.state.payload.providerFailures,0);
    const byProvider=new Map(capture.state.payload.providerResults.map(result=>[result.provider,result]));
    assert.equal(byProvider.get('Ticketmaster').displayedCount,1);
    assert.equal(byProvider.get('Eventbrite').displayedCount,0);
    assert.equal(byProvider.get('Skiddle').displayedCount,0);
    assert.match(capture.state.payload.message,/Showing 1 upcoming event from 1 contributing provider; 3 connected providers responded/);
    assert.doesNotMatch(capture.state.payload.message,/from 3 connected source/);
  }finally{
    globalThis.fetch=originalFetch;
  }
});
