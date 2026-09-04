import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const js=fs.readFileSync(new URL('../gameday-v16.js',import.meta.url),'utf8');

function harness(){
  const sandbox={
    focus:{state:'game-window',game:null,current:null,next:null},
    location:{hash:'#live'},
    document:{hidden:false,querySelector:()=>null,addEventListener:()=>{}},
    addEventListener:()=>{},
    setInterval:()=>0,
    setTimeout:()=>0,
    queueMicrotask:()=>{},
    MutationObserver:class{observe(){}},
    fetch:async()=>({ok:false,json:async()=>null}),
    Intl,
    Date,
    console
  };
  sandbox.window={TitansRuntime:{scheduleFocus:()=>sandbox.focus}};
  sandbox.globalThis=sandbox;
  const instrumented=js.replace(/\}\)\(\);\s*$/,"globalThis.__gamedayTest={state,espnGame,providerMatchesGame,providerLiveStatus,phase};})();");
  vm.runInNewContext(instrumented,sandbox,{filename:'gameday-v16.js'});
  return {sandbox,api:sandbox.__gamedayTest};
}

function provider(overrides={}){
  return {
    date:'2026-09-13T17:00:00Z',
    opponent:'Jacksonville Jaguars',
    opponentAbbr:'JAX',
    status:'Scheduled',
    detail:'Scheduled',
    ...overrides
  };
}

const focused={
  date:'2026-09-13T17:00:00Z',
  opponent:'Jacksonville Jaguars',
  opponentAbbr:'JAX'
};

test('focused Game Day requires opponent identity in addition to kickoff proximity',()=>{
  const {api}=harness();
  assert.equal(api.providerMatchesGame(provider({opponent:'',opponentAbbr:''}),focused),false);
  assert.equal(api.providerMatchesGame(provider({opponent:'New York Jets',opponentAbbr:''}),focused),false);
});

test('exact normalized opponent name can prove identity when provider abbreviation is missing',()=>{
  const {api}=harness();
  assert.equal(api.providerMatchesGame(provider({opponent:'  Jacksonville---Jaguars ',opponentAbbr:''}),focused),true);
});

test('complete abbreviation mismatch fails closed even when names and kickoff match',()=>{
  const {api}=harness();
  assert.equal(api.providerMatchesGame(provider({opponent:'Jacksonville Jaguars',opponentAbbr:'NYJ'}),focused),false);
});

test('matching identity cannot rescue an implausible kickoff',()=>{
  const {api}=harness();
  assert.equal(api.providerMatchesGame(provider({date:'2026-09-14T17:00:00Z'}),focused),false);
});

test('identity hardening keeps existing scoreboard ownership boundaries',()=>{
  assert.match(js,/function providerMatchesGame\(eg,g\)/);
  assert.match(js,/providerOpponentMatches/);
  assert.equal((js.match(/setInterval\(/g)||[]).length,1);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.equal((js.match(/sharedJson\('\/api\/espn-scoreboard'/g)||[]).length,2);
  assert.doesNotMatch(js,/localStorage|sessionStorage/);
});
