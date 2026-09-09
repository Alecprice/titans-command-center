import test from 'node:test';
import assert from 'node:assert/strict';
import {filterFeed} from '../src/core.mjs';

const official={title:'Roster move',summary:'Titans update',source:'Titans',type:'news',tier:'official',topics:['roster'],publishedAt:'2026-09-09T12:00:00Z'};
const media={title:'Game preview',summary:'Week 1',source:'Media',type:'analysis',tier:'media',topics:['game'],publishedAt:'2026-09-09T13:00:00Z'};

test('filterFeed fails closed on malformed container inputs',()=>{
  assert.deepEqual(filterFeed(),[]);
  assert.deepEqual(filterFeed(null),[]);
  assert.deepEqual(filterFeed({},{}),[]);
  assert.deepEqual(filterFeed([null,42,'bad',[],official]),[official]);
});

test('filterFeed normalizes malformed filters without throwing',()=>{
  assert.deepEqual(filterFeed([official],null),[official]);
  assert.deepEqual(filterFeed([official],{query:{bad:true}}),[]);
  assert.deepEqual(filterFeed([official],{type:42}),[official]);
});

test('filterFeed preserves topic/query filtering and source-rank ordering',()=>{
  assert.deepEqual(filterFeed([media,official],{}),[official,media]);
  assert.deepEqual(filterFeed([media,official],{topic:'game'}),[media]);
  assert.deepEqual(filterFeed([media,official],{query:'week 1'}),[media]);
});

test('filterFeed tolerates malformed topics and text fields',()=>{
  const malformed={...official,title:null,summary:{bad:true},topics:{bad:true}};
  assert.deepEqual(filterFeed([malformed],{query:'titans'}),[malformed]);
  assert.deepEqual(filterFeed([malformed],{topic:'roster'}),[]);
});
