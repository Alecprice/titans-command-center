import test from 'node:test';
import assert from 'node:assert/strict';
import { auditedTeamContext } from '../src/team-context.mjs';

test('source policy prioritizes official current sources',()=>{
  assert.deepEqual(auditedTeamContext.sourcePolicy.currentTeamData,['Tennessee Titans','NFL.com']);
  assert.match(auditedTeamContext.sourcePolicy.rule,/overrides secondary sources/i);
});

test('preseason injury state is not presented as zero injuries',()=>{
  assert.equal(auditedTeamContext.injuryReport.status,'not-published-preseason');
  assert.match(auditedTeamContext.injuryReport.detail,/Reserve\/Injured roster status is tracked separately/);
});

test('verified baseline is explicitly prior season and audited',()=>{
  assert.equal(auditedTeamContext.baselineStats.season,2025);
  assert.match(auditedTeamContext.baselineStats.label,/not 2026 stats/i);
  assert.equal(auditedTeamContext.baselineStats.players.find(p=>p.name==='Cam Ward').lines.includes('3,169 pass yds'),true);
  assert.equal(auditedTeamContext.baselineStats.players.find(p=>p.name==='Jeffery Simmons').lines.includes('67 total tackles'),true);
});

test('current 2026 leadership and coordinators are audited',()=>{
  assert.equal(auditedTeamContext.leadership.find(x=>x.role==='General Manager').name,'Mike Borgonzi');
  assert.equal(auditedTeamContext.coaching.find(x=>x.role==='Head Coach').name,'Robert Saleh');
  assert.equal(auditedTeamContext.coaching.find(x=>x.role==='Offensive Coordinator').name,'Brian Daboll');
  assert.equal(auditedTeamContext.coaching.find(x=>x.role==='Defensive Coordinator').name,'Gus Bradley');
});

test('known secondary schedule conflict is documented',()=>{
  const conflict=auditedTeamContext.knownConflicts.find(x=>x.topic==='2026 preseason opener date');
  assert.ok(conflict);
  assert.match(conflict.resolution,/Aug\. 13/);
});

test('known Jeffery Simmons stat-source conflict is documented',()=>{
  const conflict=auditedTeamContext.knownConflicts.find(x=>x.topic==='Jeffery Simmons 2025 total tackles');
  assert.ok(conflict);
  assert.match(conflict.officialValue,/67/);
  assert.match(conflict.secondaryValue,/65/);
});
