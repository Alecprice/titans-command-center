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

function event({id,date,opponent,status='Scheduled',tenScore='0',opponentScore='0'}){
  return {
    id,
    date,
    name:`TEN vs ${opponent}`,
    competitions:[{
      date,
      status:{type:{description:status,shortDetail:status}},
      competitors:[
        {team:{abbreviation:'TEN'},score:tenScore,homeAway:'home'},
        {team:{abbreviation:opponent,displayName:opponent},score:opponentScore,homeAway:'away'}
      ]
    }]
  };
}

test('Game Day ignores provider array order and selects the focused Titans matchup',()=>{
  const {api}=harness();
  const focused={date:'2026-09-13T17:00:00Z',opponentAbbr:'JAX'};
  api.state.espn={payload:{events:[
    event({id:'old',date:'2026-09-06T17:00:00Z',opponent:'NYJ',status:'Final',tenScore:'24',opponentScore:'17'}),
    event({id:'current',date:'2026-09-13T17:00:00Z',opponent:'JAX',status:'In Progress',tenScore:'10',opponentScore:'7'})
  ]}};
  const selected=api.espnGame({state:'game-window',game:focused,current:focused,next:null});
  assert.equal(selected?.id,'current');
  assert.equal(selected?.opponentAbbr,'JAX');
});

test('focused Game Day fails closed when scoreboard contains only other Titans games',()=>{
  const {api}=harness();
  const focused={date:'2026-09-13T17:00:00Z',opponentAbbr:'JAX'};
  api.state.espn={payload:{events:[
    event({id:'stale',date:'2026-09-06T17:00:00Z',opponent:'NYJ',status:'Final',tenScore:'24',opponentScore:'17'})
  ]}};
  assert.equal(api.espnGame({state:'game-window',game:focused,current:focused,next:null}),null);
});

test('multiple provider matches resolve by closest kickoff rather than payload position',()=>{
  const {api}=harness();
  const focused={date:'2026-09-13T17:00:00Z',opponentAbbr:'JAX'};
  api.state.espn={payload:{events:[
    event({id:'farther',date:'2026-09-13T21:00:00Z',opponent:'JAX',status:'Scheduled'}),
    event({id:'exact',date:'2026-09-13T17:00:00Z',opponent:'JAX',status:'Scheduled'})
  ]}};
  assert.equal(api.espnGame({state:'game-window',game:focused,current:focused,next:null})?.id,'exact');
});

test('phase resolves shared schedule focus before choosing the scoreboard event',()=>{
  const {sandbox,api}=harness();
  const focused={date:'2026-09-13T17:00:00Z',opponentAbbr:'JAX'};
  sandbox.focus={state:'game-window',game:focused,current:focused,next:null};
  api.state.espn={payload:{events:[
    event({id:'stale-final',date:'2026-09-06T17:00:00Z',opponent:'NYJ',status:'Final',tenScore:'24',opponentScore:'17'}),
    event({id:'live',date:'2026-09-13T17:00:00Z',opponent:'JAX',status:'In Progress',tenScore:'10',opponentScore:'7'})
  ]}};
  const [mode,game,provider]=api.phase();
  assert.equal(mode,'live');
  assert.equal(game.opponentAbbr,'JAX');
  assert.equal(provider.id,'live');
});

test('scoreboard selection hardening adds no provider, polling, or persistence owner',()=>{
  assert.match(js,/function espnGame\(focus=gameFocus\(\)\)/);
  assert.match(js,/const matches=rows\.filter\(row=>providerMatchesGame\(row,focused\)\)/);
  assert.match(js,/if\(!matches\.length\)return null/);
  assert.match(js,/const focus=gameFocus\(\),eg=espnGame\(focus\)/);
  assert.equal((js.match(/setInterval\(/g)||[]).length,1);
  assert.equal((js.match(/new MutationObserver\(/g)||[]).length,1);
  assert.equal((js.match(/sharedJson\('\/api\/espn-scoreboard'/g)||[]).length,2);
  assert.doesNotMatch(js,/localStorage|sessionStorage/);
});
