import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEspnEvent } from '../src/core.mjs';

test('normalizeEspnEvent contains malformed provider shapes',()=>{
  for(const value of [null,undefined,true,42,'event',[],{}, {competitions:{}}, {competitions:[null]}, {competitions:[{competitors:{}}]}, {competitions:[{competitors:[null,42,'team']}]}]){
    assert.equal(normalizeEspnEvent(value),null);
  }
});

test('normalizeEspnEvent requires Tennessee and a distinct identified opponent',()=>{
  assert.equal(normalizeEspnEvent({competitions:[{competitors:[{team:{abbreviation:'TEN'}}]}]}),null);
  assert.equal(normalizeEspnEvent({competitions:[{competitors:[{team:{abbreviation:'TEN'}},{team:{}}]}]}),null);
});

test('normalizeEspnEvent preserves established valid ESPN mapping',()=>{
  const event={
    id:'game-1',
    week:{number:1},
    date:'2026-09-13T17:00:00.000Z',
    status:{type:{state:'in',detail:'3rd - 08:12'}},
    competitions:[{
      venue:{fullName:'Nissan Stadium'},
      competitors:[
        {homeAway:'home',score:'17',team:{abbreviation:'TEN',displayName:'Tennessee Titans'}},
        {homeAway:'away',score:'10',team:{abbreviation:'NYJ',displayName:'New York Jets'}},
      ],
    }],
  };
  assert.deepEqual(normalizeEspnEvent(event),{
    id:'game-1',week:1,date:'2026-09-13T17:00:00.000Z',opponent:'New York Jets',opponentAbbr:'NYJ',homeAway:'home',status:'live',detail:'3rd - 08:12',score:'17',opponentScore:'10',venue:'Nissan Stadium',source:'ESPN'
  });
});
