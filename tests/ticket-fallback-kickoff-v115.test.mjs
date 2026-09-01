import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('offline Ticket Center stops presenting a known-kickoff game as upcoming once kickoff arrives',async()=>{
  const ui=await read('tickets-v47.js');
  assert.match(ui,/if\(game\.status==='final'\|\|game\.status==='bye'\)return false/);
  assert.match(ui,/const stamp=Date\.parse\(game\.date\)/);
  assert.match(ui,/return Number\.isFinite\(stamp\)&&stamp>Date\.now\(\)/);
  assert.doesNotMatch(ui,/Date\.now\(\)-21600000/,'ticket fallback must not retain a known kickoff for six hours after it starts');
  assert.doesNotMatch(ui,/!Number\.isFinite\(stamp\)\|\|stamp>/,'malformed non-TBD dates must not be treated as upcoming');
});

test('explicit TBD schedule rows stay eligible without inventing a kickoff or game status',async()=>{
  const [ui,data]=await Promise.all([read('tickets-v47.js'),read('src/data.mjs')]);
  assert.match(ui,/if\(game\.dateTbd\)return true/);
  assert.match(data,/id:'wk18'[\s\S]*date:null[\s\S]*status:'scheduled'[\s\S]*dateTbd:true/);
  assert.match(ui,/UPCOMING TITANS GAMES/);
  assert.doesNotMatch(ui,/game\.status='(?:live|final)'/,'ticket availability must not mutate schedule status');
});

test('fallback ticket ordering keeps dated games chronological and undated TBD rows last',async()=>{
  const ui=await read('tickets-v47.js');
  assert.match(ui,/const aStamp=Date\.parse\(a\.date\),bStamp=Date\.parse\(b\.date\)/);
  assert.match(ui,/Number\.isFinite\(aStamp\)\?aStamp:Number\.MAX_SAFE_INTEGER/);
  assert.match(ui,/Number\.isFinite\(bStamp\)\?bStamp:Number\.MAX_SAFE_INTEGER/);
});
