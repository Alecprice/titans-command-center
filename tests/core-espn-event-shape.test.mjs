import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeEspnEvent} from '../src/core.mjs';

function event(overrides={}){
  return {
    id:'401772000',
    date:'2026-09-13T17:00:00.000Z',
    week:{number:1},
    competitions:[{
      competitors:[
        {homeAway:'home',team:{abbreviation:'TEN',displayName:'Tennessee Titans'},score:'7'},
        {homeAway:'away',team:{abbreviation:'NYJ',displayName:'New York Jets'},score:'3'},
      ],
      venue:{fullName:'Nissan Stadium'},
    }],
    status:{type:{state:'in',detail:'Q2 08:11'}},
    ...overrides,
  };
}

test('normalizes a valid ESPN event while preserving the established public game shape',()=>{
  assert.deepEqual(normalizeEspnEvent(event()),{
    id:'401772000',week:1,date:'2026-09-13T17:00:00.000Z',opponent:'New York Jets',opponentAbbr:'NYJ',homeAway:'home',status:'live',detail:'Q2 08:11',score:'7',opponentScore:'3',venue:'Nissan Stadium',source:'ESPN'
  });
});

test('rejects malformed provider identity, date, and team containers',()=>{
  for(const value of [null,[], 'bad'])assert.equal(normalizeEspnEvent(value),null);
  assert.equal(normalizeEspnEvent(event({id:''})),null);
  assert.equal(normalizeEspnEvent(event({date:'not-a-date'})),null);
  assert.equal(normalizeEspnEvent(event({competitions:[{competitors:[{homeAway:'home',team:[]},{homeAway:'away',team:{abbreviation:'NYJ'}}]}]})),null);
});

test('requires a real Titans home/away role before publishing a normalized game',()=>{
  const bad=event();
  bad.competitions[0].competitors[0].homeAway='neutral';
  assert.equal(normalizeEspnEvent(bad),null);

  const away=event();
  away.competitions[0].competitors[0].homeAway='AWAY';
  away.competitions[0].competitors[1].homeAway='home';
  assert.equal(normalizeEspnEvent(away)?.homeAway,'away');
});
