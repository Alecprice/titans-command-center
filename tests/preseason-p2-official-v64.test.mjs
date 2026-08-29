import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  PRESEASON_P2_GAME_CENTER_URL,
  PRESEASON_P2_NOTES_URL,
  auditedPreseasonGameP2,
  auditedPlayerPreseasonStatsP2,
  auditedPreseasonSourcesP2
} from '../src/preseason-p2-20260823.mjs';
import { aggregatePlayerStats } from '../src/preseason-model.mjs';

const api=fs.readFileSync(new URL('../src/preseason-api.mjs',import.meta.url),'utf8');
const p2Source=fs.readFileSync(new URL('../src/preseason-p2-20260823.mjs',import.meta.url),'utf8');

const field=(row,label)=>row.fields.find(item=>item.label===label)?.value;
const category=(name,label)=>auditedPlayerPreseasonStatsP2[name]?.find(row=>row.category===label);

test('Seattle P2 audit is sourced only to official Titans pages and declares its limited defensive scope',()=>{
  assert.match(PRESEASON_P2_GAME_CENTER_URL,/^https:\/\/www\.tennesseetitans\.com\/game-day\//);
  assert.match(PRESEASON_P2_NOTES_URL,/^https:\/\/www\.tennesseetitans\.com\/news\//);
  assert.equal(auditedPreseasonGameP2.status,'Final · TEN 19–16 SEA');
  assert.match(auditedPreseasonGameP2.sourceScope,/unlisted defensive stats are not inferred/i);
  assert.equal(auditedPreseasonSourcesP2.length,2);
  assert.ok(auditedPreseasonSourcesP2.every(source=>source.url.startsWith('https://www.tennesseetitans.com/')));
});

test('official Seattle offense is mirrored without projection or target guessing',()=>{
  const ward=category('Cam Ward','Passing');
  assert.equal(field(ward,'CMP/ATT'),'8/12');
  assert.equal(field(ward,'YDS'),'69');

  const johnson=category("D'Ernest Johnson",'Rushing');
  assert.equal(field(johnson,'ATT'),'10');
  assert.equal(field(johnson,'YDS'),'25');
  assert.equal(field(johnson,'TD'),'1');

  const chestnut=category('Julius Chestnut','Receiving');
  assert.equal(field(chestnut,'REC'),'3');
  assert.equal(field(chestnut,'YDS'),'24');
  assert.equal(field(chestnut,'TAR'),undefined);
  assert.doesNotMatch(p2Source,/TAR=/);
});

test('published Seattle defensive and special-teams notes are present without a fabricated full box score',()=>{
  const hill=category('Anthony Hill Jr.','Defense');
  assert.equal(field(hill,'COMB'),'7');
  assert.equal(field(hill,'INT'),'1');

  const jones=category('Truman Jones','Defense');
  assert.equal(field(jones,'COMB'),'2');
  assert.equal(field(jones,'SACK'),'1.5');

  const canteen=category('Derrick Canteen','Special Teams');
  assert.equal(field(canteen,'TKL'),'2');
  assert.match(p2Source,/unlisted defensive stats are not inferred/i);
});

test('receiving aggregate omits targets when any contributing game lacks target data',()=>{
  const totals=aggregatePlayerStats([
    {category:'Receiving',fields:[{label:'TAR',value:'4'},{label:'REC',value:'2'},{label:'YDS',value:'19'},{label:'LG',value:'12'},{label:'TD',value:'0'}]},
    {category:'Receiving',fields:[{label:'REC',value:'2'},{label:'YDS',value:'11'},{label:'LG',value:'6'},{label:'TD',value:'0'}]}
  ]);
  const receiving=totals.find(row=>row.category==='Receiving');
  assert.equal(receiving.fields.find(item=>item.label==='TAR'),undefined);
  assert.equal(receiving.fields.find(item=>item.label==='REC')?.value,'4');
  assert.equal(receiving.fields.find(item=>item.label==='YDS')?.value,'30');
});

test('preseason API seeds audited P1 and P2 while withholding incomplete season team totals',()=>{
  assert.match(api,/from '\.\/preseason-p2-20260823\.mjs'/);
  assert.match(api,/gameBooks=\[gameBookFromAuditP1\(\),gameBookFromAuditP2\(\)\]/);
  assert.match(api,/gameBookFromAuditP2\(\)[\s\S]*teamStats:\{\},teamStatsComplete:false/);
  assert.match(api,/sources=\[\.\.\.auditedPreseasonSources,\.\.\.auditedPreseasonSourcesP2\]/);
  assert.match(api,/allTeamStatsComplete=completeTeamBooks\.length===gameBooks\.length/);
  assert.match(api,/seasonTeamStats=allTeamStatsComplete\?aggregateTeamStats[\s\S]*:\{\}/);
  assert.match(api,/Season team-stat totals are withheld because at least one completed preseason source does not expose the full team-stat table/);
  assert.match(api,/Tennessee Titans official P2 Game Center\/postgame notes/);
});
