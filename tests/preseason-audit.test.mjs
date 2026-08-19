import test from 'node:test';
import assert from 'node:assert/strict';
import {auditedRoster20260819} from '../src/roster-audit-20260819.mjs';
import {auditedPreseasonGames,auditedPlayerPreseasonStats,auditedTeamPreseasonStats,PRESEASON_GAMEBOOK_URL} from '../src/preseason-p1-20260813.mjs';

test('audited Aug. 19 roster fallback is complete',()=>{
  assert.equal(auditedRoster20260819.length,95);
  assert.equal(auditedRoster20260819.filter(p=>p.status==='Active').length,91);
  assert.equal(auditedRoster20260819.filter(p=>p.status==='Reserve/Injured').length,4);
  assert.equal(auditedRoster20260819.find(p=>p.name==='Peter Skoronski')?.position,'G');
  assert.equal(auditedRoster20260819.find(p=>p.name==="D'Ernest Johnson")?.number,'21');
});

test('preseason audit represents the one completed game as of Aug. 19',()=>{
  assert.equal(auditedPreseasonGames.length,1);
  assert.match(auditedPreseasonGames[0].status,/TEN 19–13 SF/);
  assert.match(PRESEASON_GAMEBOOK_URL,/static\.www\.nfl\.com/);
  assert.equal(auditedTeamPreseasonStats.totalYards,'279');
  assert.equal(auditedTeamPreseasonStats.rushingYards,'167');
  assert.equal(auditedTeamPreseasonStats.fieldGoals,'4/4');
});

test('official gamebook player lines are preserved',()=>{
  const ward=auditedPlayerPreseasonStats['Cam Ward'].find(x=>x.category==='Passing');
  assert.equal(ward.fields.find(x=>x.label==='CMP/ATT')?.value,'5/12');
  assert.equal(ward.fields.find(x=>x.label==='YDS')?.value,'57');
  const pollard=auditedPlayerPreseasonStats['Tony Pollard'].find(x=>x.category==='Rushing');
  assert.equal(pollard.fields.find(x=>x.label==='TD')?.value,'1');
  const slye=auditedPlayerPreseasonStats['Joey Slye'].find(x=>x.category==='Kicking');
  assert.equal(slye.fields.find(x=>x.label==='FG')?.value,'4/4');
  const holmes=auditedPlayerPreseasonStats['Jalyn Holmes'].find(x=>x.category==='Defense');
  assert.equal(holmes.fields.find(x=>x.label==='SACK')?.value,'1');
});
