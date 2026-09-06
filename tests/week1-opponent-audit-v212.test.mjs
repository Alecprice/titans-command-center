import test from 'node:test';
import assert from 'node:assert/strict';

import {WEEK1_OPPONENT_INTEL_2026,opponentIntelSourceTruth} from '../src/week1-opponent-intel-2026.mjs';

test('Week 1 opponent intel records a Sep 6 source audit without inventing new football facts',()=>{
  const intel=WEEK1_OPPONENT_INTEL_2026;
  assert.equal(intel.version,'2026-w1-20260906.1');
  assert.equal(intel.asOf,'2026-09-06');
  assert.equal(intel.audit.recheckedThrough,'2026-09-06');
  assert.equal(intel.audit.latestOfficialFootballUpdate,'2026-09-04');
  assert.equal(intel.audit.formalGameStatusAvailable,false);
  assert.equal(intel.audit.sourceKey,'jetsNewsIndex');
  assert.equal(intel.sources.jetsNewsIndex.publisher,'New York Jets');
  assert.equal(intel.sources.jetsNewsIndex.url,'https://www.newyorkjets.com/news/all-news');
});

test('Sep 6 audit preserves the qualified kicker and availability truth boundaries',()=>{
  const intel=WEEK1_OPPONENT_INTEL_2026;
  const truth=opponentIntelSourceTruth(intel);
  assert.equal(intel.specialTeams.kicker.activeRoster,'Blake Grupe');
  assert.equal(intel.specialTeams.kicker.practiceSquad,'Jason Sanders');
  assert.equal(intel.specialTeams.kicker.competitionStatus,'open');
  assert.equal(intel.specialTeams.kicker.settledStarter,false);
  assert.equal(intel.availability.status,'pre-game-week');
  assert.equal(truth.formalGameStatusCount,0);
  assert.equal(truth.availabilityIsInferred,false);
  assert.ok(intel.availability.signals.every(signal=>signal.formalGameStatus===false));
});

test('Sep 6 audit preserves exact Week 1 game identity and official-source bounds',()=>{
  const intel=WEEK1_OPPONENT_INTEL_2026;
  assert.equal(intel.opponent,'New York Jets');
  assert.equal(intel.opponentAbbr,'NYJ');
  assert.equal(intel.game.week,1);
  assert.equal(intel.game.kickoff,'2026-09-13T17:00:00Z');
  assert.equal(intel.game.venue,'Nissan Stadium');
  assert.equal(intel.game.network,'CBS');
  for(const source of Object.values(intel.sources)){
    const url=new URL(source.url);
    assert.equal(url.protocol,'https:');
    assert.ok(['www.newyorkjets.com','www.tennesseetitans.com'].includes(url.hostname));
    assert.equal(source.checkedAt,intel.checkedAt);
  }
});
