import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WEEK1_OPPONENT_INTEL_2026,
  cloneWeek1OpponentIntel,
  opponentIntelSourceTruth
} from '../src/week1-opponent-intel-2026.mjs';

test('Week 1 opponent intelligence matches the scheduled Jets opener',()=>{
  assert.equal(WEEK1_OPPONENT_INTEL_2026.opponent,'New York Jets');
  assert.equal(WEEK1_OPPONENT_INTEL_2026.opponentAbbr,'NYJ');
  assert.equal(WEEK1_OPPONENT_INTEL_2026.game.week,1);
  assert.equal(WEEK1_OPPONENT_INTEL_2026.game.kickoff,'2026-09-13T17:00:00Z');
  assert.equal(WEEK1_OPPONENT_INTEL_2026.game.venue,'Nissan Stadium');
  assert.equal(WEEK1_OPPONENT_INTEL_2026.game.network,'CBS');
});

test('opponent roster spine uses post-cutdown active-roster evidence',()=>{
  const spine=WEEK1_OPPONENT_INTEL_2026.activeRosterSpine;
  assert.equal(spine.quarterback.starter,'Geno Smith');
  assert.equal(spine.quarterback.backup,'Cade Klubnik');
  assert.equal(spine.runningBack.lead,'Breece Hall');
  assert.ok(spine.receivers.includes('Garrett Wilson'));
  assert.deepEqual(spine.offensiveLine,[
    'Olu Fashanu','Dylan Parham','Josh Myers','Joe Tippmann','Armand Membou'
  ]);
  assert.equal(spine.kicker,'Blake Grupe');
});

test('source truth qualifies stale unofficial depth-chart claims',()=>{
  const truth=opponentIntelSourceTruth();
  assert.equal(truth.status,'qualified-conflict');
  assert.equal(truth.conflictCount,2);
  assert.equal(truth.hasHighSeverityConflict,true);
  assert.deepEqual(truth.controllingSourceOrder,[
    'official-transaction',
    'official-active-roster',
    'official-unofficial-depth-chart'
  ]);

  const conflicts=WEEK1_OPPONENT_INTEL_2026.depthChart.conflicts;
  assert.ok(conflicts.some(item=>item.subject==='Jason Sanders'&&item.severity==='high'));
  assert.ok(conflicts.some(item=>item.subject==='Kohl Levao'));
  assert.equal(WEEK1_OPPONENT_INTEL_2026.depthChart.authority,'unofficial');
});

test('pre-game-week availability cannot masquerade as an injury designation',()=>{
  assert.equal(WEEK1_OPPONENT_INTEL_2026.availability.status,'pre-game-week');
  assert.equal(WEEK1_OPPONENT_INTEL_2026.availability.confidence,'limited');
  assert.match(WEEK1_OPPONENT_INTEL_2026.availability.note,/Do not convert/i);
});

test('consumer clones cannot mutate the frozen source snapshot',()=>{
  const clone=cloneWeek1OpponentIntel();
  clone.activeRosterSpine.quarterback.starter='Changed';
  assert.equal(WEEK1_OPPONENT_INTEL_2026.activeRosterSpine.quarterback.starter,'Geno Smith');
});
