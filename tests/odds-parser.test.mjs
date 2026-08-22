import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchFreeOdds, normalizeOddsRows, resetOddsRuntimeCache, selectTitansEvents } from '../src/odds.mjs';

const payload={
  id:'148033',
  live:false,
  last_update:'2026-08-21T11:58:00Z',
  bookmakers:[
    {
      key:'fanduel',title:'FanDuel',link:'https://example.com/fd',last_update:'2026-08-21T11:57:55Z',
      markets:[
        {key:'h2h',outcomes:[
          {name:'Tennessee Titans',price:-220},
          {name:'Seattle Seahawks',price:186}
        ]},
        {key:'spreads',outcomes:[
          {name:'Tennessee Titans',point:-4.5,price:-110},
          {name:'Seattle Seahawks',point:4.5,price:-110},
          {name:'Tennessee Titans',point:-9.5,price:194},
          {name:'Seattle Seahawks',point:9.5,price:-245}
        ]},
        {key:'totals',outcomes:[
          {name:'Over',point:37.5,price:-112},
          {name:'Under',point:37.5,price:-109},
          {name:'Over',point:45.5,price:250},
          {name:'Under',point:45.5,price:-300}
        ]},
        {key:'player_pass_yds',description:'Passing Yards',period:null,outcomes:[
          {name:'Over',description:'Cam Ward',point:245.5,price:-110},
          {name:'Under',description:'Cam Ward',point:245.5,price:-110}
        ]}
      ]
    },
    {
      key:'draftkings',title:'DraftKings',
      markets:[{key:'spreads',outcomes:[
        {name:'Tennessee Titans',point:-4.5,price:-110},
        {name:'Seattle Seahawks',point:4.5,price:-110}
      ]}]
    }
  ]
};

test('structured odds preserve bookmaker and market identity',()=>{
  const rows=normalizeOddsRows(payload,'PropLine',{id:'148033'});
  const ml=rows.find(r=>r.bookId==='fanduel'&&r.marketKey==='h2h'&&r.side==='Tennessee Titans');
  assert.ok(ml);
  assert.equal(ml.book,'FanDuel');
  assert.equal(ml.marketName,'Moneyline');
  assert.equal(ml.price,-220);
  assert.equal(ml.deeplink,'https://example.com/fd');
});

test('standard and alternate spread/total lines are distinguished',()=>{
  const rows=normalizeOddsRows(payload,'PropLine',{id:'148033'});
  const stdSpread=rows.find(r=>r.bookId==='fanduel'&&r.marketKey==='spreads'&&r.side==='Tennessee Titans'&&r.line===-4.5);
  const altSpread=rows.find(r=>r.bookId==='fanduel'&&r.marketKey==='spreads'&&r.side==='Tennessee Titans'&&r.line===-9.5);
  const stdTotal=rows.find(r=>r.bookId==='fanduel'&&r.marketKey==='totals'&&r.side==='Over'&&r.line===37.5);
  const altTotal=rows.find(r=>r.bookId==='fanduel'&&r.marketKey==='totals'&&r.side==='Over'&&r.line===45.5);
  assert.equal(stdSpread.alt,false);
  assert.equal(altSpread.alt,true);
  assert.equal(stdTotal.alt,false);
  assert.equal(altTotal.alt,true);
});

test('same price at different books is not deduplicated away',()=>{
  const rows=normalizeOddsRows(payload,'PropLine',{id:'148033'});
  const matches=rows.filter(r=>r.marketKey==='spreads'&&r.side==='Tennessee Titans'&&r.line===-4.5&&r.price===-110);
  assert.equal(matches.length,2);
  assert.deepEqual(new Set(matches.map(r=>r.bookId)),new Set(['fanduel','draftkings']));
});

test('player prop description is preserved as entity name',()=>{
  const rows=normalizeOddsRows(payload,'PropLine',{id:'148033'});
  const prop=rows.find(r=>r.marketKey==='player_pass_yds'&&r.side==='Over');
  assert.ok(prop);
  assert.equal(prop.category,'player_prop');
  assert.equal(prop.marketName,'Passing Yards');
  assert.equal(prop.entityName,'Cam Ward');
  assert.equal(prop.statId,'player_pass_yds');
  assert.equal(prop.book,'FanDuel');
  assert.equal(prop.periodId,'game');
});

test('Titans event selection ignores stale/final/non-Titans games and sorts upcoming kickoffs',()=>{
  const now=Date.parse('2026-08-21T12:00:00Z');
  const selected=selectTitansEvents([
    {id:'later',home_team:'TEN Titans',away_team:'Chicago Bears',commence_time:'2026-08-29T22:00:00Z'},
    {id:'final',home_team:'Tennessee Titans',away_team:'Atlanta Falcons',commence_time:'2026-08-15T00:00:00Z',status:'Final'},
    {id:'other',home_team:'Seattle Seahawks',away_team:'Green Bay Packers',commence_time:'2026-08-23T00:00:00Z'},
    {id:'next',home_team:'Tennessee Titans',away_team:'Seattle Seahawks',commence_time:'2026-08-24T00:00:00Z'},
    {id:'stale',home_team:'Tennessee Titans',away_team:'Baltimore Ravens',commence_time:'2026-08-20T00:00:00Z'}
  ],2,{now});
  assert.deepEqual(selected.map(event=>event.id),['next','later']);
});

test('live Titans event remains eligible and takes priority even after scheduled kickoff',()=>{
  const now=Date.parse('2026-08-21T12:00:00Z');
  const selected=selectTitansEvents([
    {id:'future',home_team:'Tennessee Titans',away_team:'Seattle Seahawks',commence_time:'2026-08-24T00:00:00Z'},
    {id:'live',home_team:'Tennessee Titans',away_team:'Houston Texans',commence_time:'2026-08-21T09:00:00Z',live:true}
  ],2,{now});
  assert.deepEqual(selected.map(event=>event.id),['live','future']);
});

test('free provider runtime cache caps event requests and reuses a successful response',async t=>{
  const originalFetch=globalThis.fetch;
  let calls=0;
  const future=days=>new Date(Date.now()+days*24*60*60*1000).toISOString();
  const events=[
    {id:'evt-3',home_team:'Tennessee Titans',away_team:'Houston Texans',commence_time:future(3)},
    {id:'evt-1',home_team:'Tennessee Titans',away_team:'Seattle Seahawks',commence_time:future(1)},
    {id:'evt-2',home_team:'TEN Titans',away_team:'CHI Bears',commence_time:future(2)}
  ];
  globalThis.fetch=async url=>{
    calls++;
    const value=String(url);
    if(value.endsWith('/events'))return new Response(JSON.stringify(events),{status:200,headers:{'content-type':'application/json','x-ratelimit-remaining':'998','x-ratelimit-limit':'1000'}});
    const id=value.match(/\/events\/([^/]+)\/odds/)?.[1]||'evt-1';
    return new Response(JSON.stringify({id,bookmakers:[{key:'fanduel',title:'FanDuel',markets:[{key:'h2h',outcomes:[{name:'Tennessee Titans',price:-120},{name:'Opponent',price:110}]}]}]}),{status:200,headers:{'content-type':'application/json'}});
  };
  resetOddsRuntimeCache();
  t.after(()=>{globalThis.fetch=originalFetch;resetOddsRuntimeCache()});
  const env={PROPLINE_API_KEY:'test-only-key',ODDS_CACHE_SECONDS:'300'};
  const first=await fetchFreeOdds(env,{maxEvents:3});
  assert.equal(first.ok,true);
  assert.deepEqual(first.events.map(event=>event.id),['evt-1','evt-2']);
  assert.equal(calls,3,'one events request plus two event-odds requests expected');
  const second=await fetchFreeOdds(env,{maxEvents:3});
  assert.equal(second.cache,'runtime-memory');
  assert.equal(calls,3,'a warm cache must not spend more provider requests');
  const bypassed=await fetchFreeOdds(env,{maxEvents:3,bypassCache:true});
  assert.equal(bypassed.ok,true);
  assert.equal(calls,6,'trusted bypass performs one fresh events request plus two odds requests');
});

test('configured provider overlaps the two bounded Titans event-detail requests',async t=>{
  const originalFetch=globalThis.fetch;
  let calls=0,activeOdds=0,maxActiveOdds=0;
  const future=days=>new Date(Date.now()+days*24*60*60*1000).toISOString();
  const events=[
    {id:'evt-a',home_team:'Tennessee Titans',away_team:'Seattle Seahawks',commence_time:future(1)},
    {id:'evt-b',home_team:'TEN Titans',away_team:'Chicago Bears',commence_time:future(2)}
  ];
  globalThis.fetch=async url=>{
    calls++;
    const value=String(url);
    if(value.endsWith('/events'))return new Response(JSON.stringify(events),{status:200,headers:{'content-type':'application/json'}});
    if(/\/events\/[^/]+\/odds/.test(value)){
      activeOdds++;maxActiveOdds=Math.max(maxActiveOdds,activeOdds);
      await new Promise(resolve=>setTimeout(resolve,30));
      activeOdds--;
      const id=value.match(/\/events\/([^/]+)\/odds/)?.[1]||'evt-a';
      return new Response(JSON.stringify({id,bookmakers:[{key:'fanduel',title:'FanDuel',markets:[{key:'h2h',outcomes:[{name:'Tennessee Titans',price:-120},{name:'Opponent',price:110}]}]}]}),{status:200,headers:{'content-type':'application/json'}});
    }
    throw new Error(`Unexpected URL: ${value}`);
  };
  resetOddsRuntimeCache();
  t.after(()=>{globalThis.fetch=originalFetch;resetOddsRuntimeCache()});
  const result=await fetchFreeOdds({PROPLINE_API_KEY:'test-only-key'},{maxEvents:2,bypassCache:true});
  assert.equal(result.ok,true);
  assert.equal(calls,3,'one events request plus two bounded event-detail requests expected');
  assert.equal(result.odds.length,4);
  assert.equal(maxActiveOdds,2,'the two event-detail requests should overlap instead of running serially');
});
