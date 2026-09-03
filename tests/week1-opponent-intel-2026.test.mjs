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

test('source truth distinguishes active roster from practice squad when the depth chart is stale',()=>{
  const truth=opponentIntelSourceTruth();
  assert.equal(truth.status,'qualified-conflict');
  assert.equal(truth.conflictCount,2);
  assert.equal(truth.hasHighSeverityConflict,true);
  assert.deepEqual(truth.controllingSourceOrder,[
    'official-transaction',
    'official-roster-group',
    'official-unofficial-depth-chart'
  ]);

  const conflicts=WEEK1_OPPONENT_INTEL_2026.depthChart.conflicts;
  const sanders=conflicts.find(item=>item.subject==='Jason Sanders');
  const levao=conflicts.find(item=>item.subject==='Kohl Levao');
  assert.equal(sanders?.severity,'high');
  assert.equal(sanders?.currentGroup,'practice-squad');
  assert.equal(sanders?.sourceKey,'jetsPracticeSquad');
  assert.match(sanders?.resolution||'',/Blake Grupe/i);
  assert.equal(levao?.currentGroup,'practice-squad');
  assert.equal(levao?.sourceKey,'jetsLevaoPracticeSquad');
  assert.deepEqual(WEEK1_OPPONENT_INTEL_2026.rosterGroupContext.practiceSquad,['Jason Sanders','Kohl Levao']);
  assert.equal(WEEK1_OPPONENT_INTEL_2026.depthChart.authority,'unofficial');
});

test('opponent source registry carries independent practice-squad and Week 1 prep provenance',()=>{
  const sources=WEEK1_OPPONENT_INTEL_2026.sources;
  assert.match(sources.jetsPracticeSquad?.url||'',/^https:\/\/www\.newyorkjets\.com\/news\//);
  assert.equal(sources.jetsPracticeSquad?.tier,'official');
  assert.match(sources.jetsLevaoPracticeSquad?.url||'',/^https:\/\/www\.newyorkjets\.com\/news\/all-news$/);
  assert.equal(sources.jetsLevaoPracticeSquad?.tier,'official');
  assert.match(sources.jetsLevaoPracticeSquad?.label||'',/Kohl Levao/i);
  assert.match(sources.jetsWeek1Prep?.url||'',/^https:\/\/www\.newyorkjets\.com\/news\//);
  assert.equal(sources.jetsWeek1Prep?.tier,'official');
});

test('pre-game-week availability cannot masquerade as an injury designation',()=>{
  assert.equal(WEEK1_OPPONENT_INTEL_2026.availability.status,'pre-game-week');
  assert.equal(WEEK1_OPPONENT_INTEL_2026.availability.confidence,'limited');
  assert.match(WEEK1_OPPONENT_INTEL_2026.availability.note,/Do not convert/i);
  assert.match(WEEK1_OPPONENT_INTEL_2026.availability.note,/re-audit/i);
});

test('consumer clones cannot mutate the frozen source snapshot',()=>{
  const clone=cloneWeek1OpponentIntel();
  clone.activeRosterSpine.quarterback.starter='Changed';
  assert.equal(WEEK1_OPPONENT_INTEL_2026.activeRosterSpine.quarterback.starter,'Geno Smith');
});
