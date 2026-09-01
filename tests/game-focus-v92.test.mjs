import test from 'node:test';
import assert from 'node:assert/strict';
import {scheduleFocus,GAME_FOCUS_WINDOW_MS} from '../src/core.mjs';

const week1={id:'wk1',week:1,date:'2026-09-13T17:00:00Z',status:'scheduled',opponentAbbr:'NYJ'};
const week2={id:'wk2',week:2,date:'2026-09-20T17:00:00Z',status:'scheduled',opponentAbbr:'JAX'};
const bye={id:'wk9',week:9,date:'2026-11-08T18:00:00Z',status:'bye'};

function at(iso,games=[week1,week2,bye]){
  return scheduleFocus(games,new Date(iso));
}

test('schedule focus selects the next future matchup before kickoff',()=>{
  const focus=at('2026-09-13T16:59:00Z');
  assert.equal(focus.state,'upcoming');
  assert.equal(focus.game?.id,'wk1');
  assert.equal(focus.current,null);
  assert.equal(focus.next?.id,'wk1');
});

test('schedule focus keeps the kickoff matchup in a bounded game window without calling it live',()=>{
  const focus=at('2026-09-13T17:01:00Z');
  assert.equal(focus.state,'game-window');
  assert.equal(focus.game?.id,'wk1');
  assert.equal(focus.current?.id,'wk1');
  assert.equal(focus.next?.id,'wk2');
  assert.notEqual(focus.state,'live');
});

test('game focus window lasts five hours and then advances to the next matchup',()=>{
  const inside=at('2026-09-13T21:59:59Z');
  assert.equal(GAME_FOCUS_WINDOW_MS,5*60*60*1000);
  assert.equal(inside.state,'game-window');
  assert.equal(inside.game?.id,'wk1');

  const outside=at('2026-09-13T22:00:01Z');
  assert.equal(outside.state,'upcoming');
  assert.equal(outside.game?.id,'wk2');
  assert.equal(outside.current,null);
});

test('final games and byes never occupy the kickoff focus window',()=>{
  const finalWeek1={...week1,status:'final',score:24,opponentScore:17};
  const focus=at('2026-09-13T18:00:00Z',[finalWeek1,week2,bye]);
  assert.equal(focus.state,'upcoming');
  assert.equal(focus.game?.id,'wk2');
  assert.equal(focus.current,null);
});

test('schedule focus ignores invalid dates and fails closed for invalid current time',()=>{
  const invalidGame={id:'bad',status:'scheduled',date:'not-a-date'};
  const focus=scheduleFocus([invalidGame,week2],new Date('2026-09-14T00:00:00Z'));
  assert.equal(focus.game?.id,'wk2');

  const invalidNow=scheduleFocus([week1,week2],'not-a-date');
  assert.deepEqual(invalidNow,{state:'none',game:null,current:null,next:null});
});
