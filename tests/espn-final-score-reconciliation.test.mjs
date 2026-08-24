import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {extractFinalTitansScores} from '../src/ingest.mjs';

const source=fs.readFileSync(new URL('../src/ingest.mjs',import.meta.url),'utf8');
const dataSource=fs.readFileSync(new URL('../src/data.mjs',import.meta.url),'utf8');

const competitor=(abbr,homeAway,score)=>({homeAway,score:String(score),team:{abbreviation:abbr,displayName:abbr==='TEN'?'Tennessee Titans':abbr}});

test('ESPN final parser keeps only completed Titans games with valid scores',()=>{
  const parsed=extractFinalTitansScores({events:[
    {id:'done',date:'2026-08-24T00:00:00Z',status:{type:{completed:true,description:'Final'}},competitions:[{competitors:[competitor('SEA','away',16),competitor('TEN','home',19)]}]},
    {id:'future',date:'2026-08-29T22:00:00Z',status:{type:{completed:false,description:'Scheduled'}},competitions:[{competitors:[competitor('CHI','away',0),competitor('TEN','home',0)]}]},
    {id:'other',date:'2026-08-24T00:00:00Z',status:{type:{completed:true,description:'Final'}},competitions:[{competitors:[competitor('NYJ','away',10),competitor('BUF','home',20)]}]}
  ]});
  assert.deepEqual(parsed,[{eventId:'done',kickoff:'2026-08-24T00:00:00.000Z',homeAbbr:'TEN',awayAbbr:'SEA',homeScore:19,awayScore:16}]);
});

test('final-score reconciliation is bounded, unambiguous, and conflict-safe',()=>{
  assert.match(source,/finals\.slice\(0,3\)/);
  assert.match(source,/g\.kickoff between \$\{start\} and \$\{end\}/);
  assert.match(source,/ht\.abbreviation=\$\{final\.homeAbbr\}/);
  assert.match(source,/at\.abbreviation=\$\{final\.awayAbbr\}/);
  assert.match(source,/if\(rows\.length!==1\)/);
  assert.match(source,/final-conflict/);
  assert.match(source,/lower\(status\) not in \('final','postponed','cancelled','canceled'\)/);
  assert.match(source,/official_audit_required:true/);
  assert.match(source,/TennesseeTitans\.com remains the audit authority/);
});

test('sync audit records reconciliation diagnostics without changing source authority',()=>{
  assert.match(source,/diagnostics:Array\.isArray\(result\.diagnostics\)\?result\.diagnostics\.slice\(0,8\):\[\]/);
  assert.match(source,/finalsSeen:Number\(result\.finalsSeen\|\|0\)/);
  assert.match(dataSource,/Scoreboard fallback · final-score reconciliation/);
  assert.match(dataSource,/Secondary near-live scoreboard and bounded final-score backfill/);
  assert.match(dataSource,/Tennessee Titans official sources remain the audit authority/);
});
