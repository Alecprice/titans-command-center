import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  eventInRegion,
  fanEventsConfig,
  fanEventsRoute,
  groupFanEvents,
  normalizeBandsintownEvents,
  normalizeEventbriteEvents,
  normalizeSkiddleEvents,
  normalizeTicketmasterEvents,
} from '../src/fan-events-api.mjs';

const source=fs.readFileSync(new URL('../src/fan-events-api.mjs',import.meta.url),'utf8');
const envExample=fs.readFileSync(new URL('../.env.example',import.meta.url),'utf8');
const setup=fs.readFileSync(new URL('../docs/FAN_EVENTS_PROVIDER_SETUP.md',import.meta.url),'utf8');
const gateway=fs.readFileSync(new URL('../api/index.js',import.meta.url),'utf8');

function responseRecorder(){
  const state={status:200,headers:new Map(),payload:null};
  const res={
    setHeader(name,value){state.headers.set(String(name).toLowerCase(),String(value));return res;},
    status(code){state.status=Number(code);return res;},
    json(payload){state.payload=payload;return payload;},
  };
  return {res,state};
}

test('fan event scope is fixed and server bounded',()=>{
  const config=fanEventsConfig({FAN_EVENTS_RADIUS_MILES:'900',FAN_EVENTS_LOOKAHEAD_DAYS:'2',FAN_EVENTS_LIMIT:'999',FAN_EVENTS_LAT:'999',FAN_EVENTS_LON:'-999'});
  assert.equal(config.radiusMiles,50);
  assert.equal(config.lookaheadDays,7);
  assert.equal(config.limit,24);
  assert.equal(config.lat,90);
  assert.equal(config.lon,-180);
  assert.equal(config.regionLabel,'Nashville, TN');
  assert.match(source,/Fan Events does not accept public query parameters/);
  assert.doesNotMatch(source,/req\.query\?\.(?:lat|lon|radius|artist|keyword)/);
});

test('provider normalizers keep only provider-owned HTTPS destinations',()=>{
  const eventbrite=normalizeEventbriteEvents([
    {id:'1',name:{text:'Nashville event'},url:'https://www.eventbrite.com/e/1',start:{utc:'2026-09-04T01:00:00Z'},venue:{name:'Venue',address:{city:'Nashville',region:'TN',latitude:'36.16',longitude:'-86.78'}}},
    {id:'2',name:{text:'Unsafe'},url:'https://example.com/e/2',start:{utc:'2026-09-04T01:00:00Z'}},
  ]);
  assert.equal(eventbrite.length,1);
  assert.equal(eventbrite[0].provider,'Eventbrite');
  assert.equal(eventbrite[0].coordinates.lat,36.16);

  const skiddle=normalizeSkiddleEvents([{id:'3',eventname:'Gig',startdate:'2026-09-05',link:'https://www.skiddle.com/whats-on/example',venue:{name:'Room',town:'Town'}}]);
  assert.equal(skiddle.length,1);
  assert.equal(skiddle[0].provider,'Skiddle');

  const bands=normalizeBandsintownEvents([{id:'4',datetime:'2026-09-06T20:00:00',url:'https://www.bandsintown.com/e/4',venue:{name:'Club',city:'Nashville',region:'TN',latitude:'36.17',longitude:'-86.77'}}],'Approved Artist');
  assert.equal(bands.length,1);
  assert.equal(bands[0].artist,'Approved Artist');

  const ticketmaster=normalizeTicketmasterEvents([{id:'5',name:'Local event',url:'https://www.ticketmaster.com/event/5',dates:{start:{dateTime:'2026-09-07T01:00:00Z'}},_embedded:{venues:[{name:'Arena',city:{name:'Nashville'},state:{stateCode:'TN'},location:{latitude:'36.16',longitude:'-86.77'}}]}}]);
  assert.equal(ticketmaster.length,1);
  assert.equal(ticketmaster[0].provider,'Ticketmaster');
});

test('every provider result must independently pass Nashville-region verification',()=>{
  const config={lat:36.1665,lon:-86.7713,radiusMiles:25,regionLabel:'Nashville, TN',start:new Date('2026-09-01T00:00:00Z'),end:new Date('2026-10-01T00:00:00Z'),limit:18};
  assert.equal(eventInRegion({coordinates:{lat:36.16,lon:-86.78},venue:{}},config),true);
  assert.equal(eventInRegion({coordinates:{lat:40.7128,lon:-74.006},venue:{city:'New York',state:'NY'}},config),false);
  assert.equal(eventInRegion({coordinates:{lat:null,lon:null},venue:{city:'Nashville',state:'Tennessee'}},config),true);
  assert.equal(eventInRegion({coordinates:{lat:null,lon:null},venue:{city:'Los Angeles',state:'CA'}},config),false);

  const grouped=groupFanEvents([
    {id:'local',provider:'Bandsintown',title:'Local Show',start:'2026-09-10T01:00:00Z',url:'https://www.bandsintown.com/e/local',venue:{name:'Local',city:'Nashville',state:'TN'},coordinates:{lat:null,lon:null}},
    {id:'away',provider:'Eventbrite',title:'Away Show',start:'2026-09-11T01:00:00Z',url:'https://www.eventbrite.com/e/away',venue:{name:'Away',city:'New York',state:'NY'},coordinates:{lat:null,lon:null}},
  ],config);
  assert.deepEqual(grouped.map(event=>event.id),['local']);
});

test('dedupe preserves source attribution instead of hiding provider provenance',()=>{
  const config={lat:36.1665,lon:-86.7713,radiusMiles:25,regionLabel:'Nashville, TN',start:new Date('2026-09-01T00:00:00Z'),end:new Date('2026-10-01T00:00:00Z'),limit:18};
  const base={title:'Same Show',start:'2026-09-10T01:00:00Z',venue:{name:'Same Venue',city:'Nashville',state:'TN'},coordinates:{lat:null,lon:null}};
  const grouped=groupFanEvents([
    {...base,id:'a',provider:'Ticketmaster',url:'https://www.ticketmaster.com/event/a'},
    {...base,id:'b',provider:'Eventbrite',url:'https://www.eventbrite.com/e/b'},
  ],config);
  assert.equal(grouped.length,1);
  assert.equal(grouped[0].providerCount,2);
  assert.deepEqual(grouped[0].sources.map(source=>source.provider).sort(),['Eventbrite','Ticketmaster']);
});

test('Eventbrite uses authenticated organization inventory, never the retired public Event Search API',()=>{
  assert.match(source,/\/users\/me\/organizations\//);
  assert.match(source,/\/organizations\/\$\{encodeURIComponent\(id\)\}\/events\//);
  assert.match(source,/Authorization:`Bearer \$\{token\}`/);
  assert.doesNotMatch(source,/EVENTBRITE_BASE\}\/events\/search/);
  assert.match(source,/retired public Event Search API is not used/);
  assert.match(source,/only events verified inside the configured Nashville region are displayed/);
  assert.match(envExample,/EVENTBRITE_PRIVATE_TOKEN=/);
});

test('Bandsintown is bounded to configured artists and Nashville-verified results',()=>{
  assert.match(source,/BANDSINTOWN_ARTISTS/);
  assert.match(source,/csv\(env\.BANDSINTOWN_ARTISTS,6\)/);
  assert.match(source,/artists\/\$\{encodeURIComponent\(artist\)\}\/events/);
  assert.doesNotMatch(source,/artists\/search/);
  assert.match(source,/configured artists; only returned events verified inside the configured Nashville region/);
  assert.match(setup,/exact approved\/canonical artist names/);
});

test('Skiddle adapter is staged but cannot issue production requests in this release',()=>{
  assert.match(source,/SKIDDLE_API_KEY/);
  assert.match(source,/getdistance/);
  assert.match(source,/provider:'Skiddle'/);
  assert.match(source,/skiddle:false/);
  assert.doesNotMatch(source,/jobs\.push\(runProvider\('Skiddle'/);
  assert.match(setup,/do not add `SKIDDLE_API_KEY` to production yet/i);
  assert.match(setup,/brand logo/i);
  assert.doesNotMatch(setup,/secret put SKIDDLE_API_KEY/);
});

test('public route rejects arbitrary query proxying and exposes provider health without secrets',async()=>{
  const blocked=responseRecorder();
  await fanEventsRoute({method:'GET',query:{route:'fan-events',artist:'anything'}},blocked.res,{});
  assert.equal(blocked.state.status,400);
  assert.equal(blocked.state.payload.ok,false);

  const empty=responseRecorder();
  await fanEventsRoute({method:'GET',query:{route:'fan-events'}},empty.res,{});
  assert.equal(empty.state.status,200);
  assert.equal(empty.state.payload.ok,true);
  assert.equal(empty.state.payload.configured,false);
  assert.equal(empty.state.payload.providersConfigured,0);
  assert.ok(Array.isArray(empty.state.payload.providerCatalog));
  assert.equal(JSON.stringify(empty.state.payload).includes('PRIVATE_TOKEN'),false);
  assert.match(empty.state.headers.get('cache-control'),/s-maxage=600/);
});

test('gateway exposes fan-events while preserving server-only credential ownership',()=>{
  assert.match(gateway,/fanEventsRoute/);
  assert.match(gateway,/\['fan-events',\(req,res,env\)=>fanEventsRoute/);
  for(const key of ['EVENTBRITE_PRIVATE_TOKEN','SKIDDLE_API_KEY','BANDSINTOWN_API_KEY'])assert.doesNotMatch(gateway,new RegExp(`${key}\\s*=`));
});
