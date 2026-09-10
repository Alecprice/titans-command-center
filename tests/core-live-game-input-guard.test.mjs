import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeLiveGames} from '../src/core.mjs';

test('mergeLiveGames fails safely on missing or malformed provider collections',()=>{
  assert.deepEqual(mergeLiveGames(),[]);
  assert.deepEqual(mergeLiveGames(null,'not-an-array'),[]);
  assert.deepEqual(mergeLiveGames([null,false,'bad',[]],[null,42,'bad',[]]),[]);
});

test('mergeLiveGames ignores incomplete live rows and preserves canonical identity on valid matches',()=>{
  const canonical={
    id:'wk1',week:1,date:'2026-09-13T17:00:00.000Z',opponentAbbr:'NYJ',homeAway:'home',source:'verified schedule',status:'scheduled'
  };
  const result=mergeLiveGames([canonical,{id:'undated',date:'not-a-date',opponentAbbr:'TBD',homeAway:'home'},[]],[
    {date:'not-a-date',opponentAbbr:'NYJ',homeAway:'home',status:'live'},
    {date:'2026-09-13T17:00:00.000Z',opponentAbbr:'',homeAway:'home',status:'live'},
    [],
    {date:'2026-09-13T17:00:00.000Z',opponentAbbr:'NYJ',homeAway:'home',status:'live',score:'7',opponentScore:'3',source:'ESPN'}
  ]);

  assert.equal(result.length,2);
  assert.deepEqual(result[0],{
    ...canonical,status:'live',score:'7',opponentScore:'3',source:'verified schedule + ESPN'
  });
  assert.equal(result[0].id,'wk1');
  assert.equal(result[0].week,1);
  assert.equal(result[1].id,'undated','invalid/undated canonical rows sort after valid dated games');
});
