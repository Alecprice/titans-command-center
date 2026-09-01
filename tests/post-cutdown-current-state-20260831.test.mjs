import test from 'node:test';
import assert from 'node:assert/strict';
import {team,games,roster,feed,metrics} from '../src/data.mjs';
import {ROSTER_AUDIT_DATE,ROSTER_SOURCE_URL,ROSTER_53_SOURCE_URL,auditedRoster20260831} from '../src/roster-audit-20260831.mjs';

const byName=name=>roster.find(player=>player.name===name);

test('Aug 31 audited fallback keeps Active and reserve lists distinct',()=>{
  assert.equal(ROSTER_AUDIT_DATE,'2026-08-31');
  assert.match(ROSTER_SOURCE_URL,/tennesseetitans\.com\/team\/players-roster/);
  assert.match(ROSTER_53_SOURCE_URL,/updated-53-man-roster-for-the-titans/);
  assert.equal(auditedRoster20260831.length,61);
  assert.equal(roster.length,61);
  assert.equal(roster.filter(player=>player.status==='Active').length,53);
  assert.equal(roster.filter(player=>player.status==='Reserve/Injured').length,6);
  assert.equal(roster.filter(player=>player.status==='Reserve/Injured; Designated for Return').length,2);
  assert.equal(team.rosterCoverage.officialActivePlayersAtAudit,53);
  assert.equal(team.rosterCoverage.officialReservePlayersAtAudit,8);
  assert.equal(team.rosterCoverage.fallbackPlayers,61);
  assert.equal(team.rosterCoverage.asOf,'2026-08-31');
});

test('Aug 31 waiver/signing changes are represented without retaining initial-53 departures',()=>{
  for(const name of ['Owen Pappoe','Melvin Smith Jr.','Nazir Stackhouse','Terrell Burgess','James Hudson']){
    assert.equal(byName(name)?.status,'Active',`${name} should be active`);
  }
  for(const name of ['Xavier Restrepo','Austin Deculus','Jerrick Reed II','Erick Hallett II','Mohamoud Diabate']){
    assert.equal(byName(name),undefined,`${name} should be absent after the Aug 31 changes`);
  }
  for(const name of ['Will Levis','Hendon Hooker','Kalel Mullings','Cordell Volson']){
    assert.equal(byName(name),undefined,`${name} should not remain on the current Active/reserve fallback`);
  }
});

test('unassigned official jersey numbers remain unknown rather than guessed',()=>{
  for(const name of ['Terrell Burgess','James Hudson','Owen Pappoe','Melvin Smith Jr.','Nazir Stackhouse','Milo Eifler']){
    assert.equal(byName(name)?.number,'',`${name} should not receive a fabricated jersey number`);
  }
});

test('preseason final and regular-season next-game metrics agree with schedule truth',()=>{
  const bears=games.find(game=>game.id==='pre3');
  assert.deepEqual({status:bears?.status,score:bears?.score,opponentScore:bears?.opponentScore},{status:'final',score:15,opponentScore:24});
  const jets=games.find(game=>game.id==='wk1');
  assert.equal(jets?.opponentAbbr,'NYJ');
  assert.equal(jets?.status,'scheduled');
  assert.equal(team.phase,'Regular Season');
  assert.deepEqual(metrics.find(metric=>metric.label==='Preseason'),{label:'Preseason',value:'2–1',delta:'L 15–24 vs CHI',tone:'neutral'});
  assert.equal(metrics.find(metric=>metric.label==='Next game')?.value,'NYJ');
  assert.equal(metrics.find(metric=>metric.label==='Audited roster')?.value,'53');
});

test('current feed leads with post-cutdown roster, practice-squad, and preseason-final evidence',()=>{
  const latestDates=feed.slice(0,4).map(item=>item.publishedAt.slice(0,10));
  assert.deepEqual(latestDates,['2026-08-31','2026-08-31','2026-08-30','2026-08-29']);
  assert.ok(feed.some(item=>/practice squad/i.test(item.title)));
  assert.ok(feed.some(item=>/Updated 53-man roster/i.test(item.title)));
  assert.ok(feed.some(item=>/Bears 24, Titans 15/i.test(item.title)));
});
