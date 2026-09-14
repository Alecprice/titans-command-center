import test from 'node:test';
import assert from 'node:assert/strict';
import {apiSnapshotKey} from '../src/d1-api-snapshot.mjs';

test('apiSnapshotKey keeps stable sorted dimensions for valid records',()=>{
  assert.equal(apiSnapshotKey('Game Day',{week:2,team:'TEN'}),'game-day:team=TEN:week=2');
});

test('apiSnapshotKey fails closed on malformed dimension containers',()=>{
  for(const dimensions of [null,[],['TEN'],'team',42,true]){
    assert.doesNotThrow(()=>apiSnapshotKey('Game Day',dimensions));
    assert.equal(apiSnapshotKey('Game Day',dimensions),'game-day');
  }
});

test('apiSnapshotKey skips blank dimension keys and values',()=>{
  assert.equal(apiSnapshotKey('Game Day',{'':'TEN',team:'   ',week:2}),'game-day:week=2');
});
