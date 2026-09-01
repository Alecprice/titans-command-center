import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  PRESEASON_P3_GAME_CENTER_URL,
  PRESEASON_P3_RECAP_URL,
  auditedPreseasonGameP3,
  auditedTeamPreseasonStatsP3,
  auditedPlayerPreseasonStatsP3,
  auditedPreseasonSourcesP3
} from '../src/preseason-p3-20260829.mjs';

const api=fs.readFileSync(new URL('../src/preseason-api.mjs',import.meta.url),'utf8');
const field=(row,label)=>row.fields.find(item=>item.label===label)?.value;
const category=(name,label)=>auditedPlayerPreseasonStatsP3[name]?.find(row=>row.category===label);

test('Bears P3 audit is sourced to official Titans final-game pages and stays explicit about partial scope',()=>{
  assert.match(PRESEASON_P3_GAME_CENTER_URL,/^https:\/\/www\.tennesseetitans\.com\/game-day\//);
  assert.match(PRESEASON_P3_RECAP_URL,/^https:\/\/www\.tennesseetitans\.com\/news\//);
  assert.equal(auditedPreseasonGameP3.status,'Final · CHI 24–15 TEN');
  assert.equal(auditedPreseasonGameP3.date,'2026-08-29T22:00:00Z');
  assert.match(auditedPreseasonGameP3.sourceScope,/unlisted defensive and special-teams stats are not inferred/i);
  assert.equal(auditedPreseasonSourcesP3.length,2);
});

test('official Bears offensive box score is mirrored without projection',()=>{
  const levis=category('Will Levis','Passing');
  assert.equal(field(levis,'CMP/ATT'),'14/22');
  assert.equal(field(levis,'YDS'),'143');
  const johnson=category("D'Ernest Johnson",'Rushing');
  assert.equal(field(johnson,'ATT'),'6');
  assert.equal(field(johnson,'YDS'),'29');
  assert.equal(field(johnson,'TD'),'1');
  const restrepo=category('Xavier Restrepo','Receiving');
  assert.equal(field(restrepo,'REC'),'4');
  assert.equal(field(restrepo,'YDS'),'71');
});

test('partial official team summary and explicit recap facts remain auditable',()=>{
  assert.deepEqual(auditedTeamPreseasonStatsP3,{totalYards:'259',penalties:'7-46',timeOfPossession:'24:16'});
  assert.equal(field(category('Joey Slye','Kicking'),'FG'),'3/3');
  assert.equal(field(category('Joey Slye','Kicking'),'FG LG'),'56');
  assert.equal(field(category('Jacob Martin','Defense'),'FR'),'1');
});

test('preseason API seeds P3 locally and does not depend on ESPN for completed-game player coverage',()=>{
  assert.match(api,/from '\.\/preseason-p3-20260829\.mjs'/);
  assert.match(api,/gameBookFromAuditP3\(\)/);
  assert.match(api,/auditedPreseasonSourcesP3/);
  assert.match(api,/Tennessee Titans official P3 Game Center\/game recap/);
  assert.match(api,/teamStatsComplete:false/);
});
