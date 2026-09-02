import test from 'node:test';
import assert from 'node:assert/strict';
import {team,games,roster,feed,metrics} from '../src/data.mjs';
import {ROSTER_AUDIT_DATE,ROSTER_SOURCE_URL,ROSTER_53_SOURCE_URL,auditedRoster20260831,auditedPracticeSquad20260902} from '../src/roster-audit-20260831.mjs';

const byName=name=>roster.find(player=>player.name===name);

test('Sept 2 audited fallback keeps Active, reserve, and practice-squad lists distinct',()=>{
  assert.equal(ROSTER_AUDIT_DATE,'2026-09-02');
  assert.match(ROSTER_SOURCE_URL,/tennesseetitans\.com\/team\/rosters/);
  assert.match(ROSTER_53_SOURCE_URL,/updated-53-man-roster-for-the-titans/);
  assert.equal(auditedRoster20260831.length,60);
  assert.equal(roster.length,60);
  assert.equal(roster.filter(player=>player.status==='Active').length,53);
  assert.equal(roster.filter(player=>player.status==='Reserve/Injured').length,5);
  assert.equal(roster.filter(player=>player.status==='Reserve/Injured; Designated for Return').length,2);
  assert.equal(auditedPracticeSquad20260902.length,17);
  assert.equal(team.rosterCoverage.officialActivePlayersAtAudit,53);
  assert.equal(team.rosterCoverage.officialReservePlayersAtAudit,7);
  assert.equal(team.rosterCoverage.practiceSquadPlayersAtAudit,17);
  assert.equal(team.rosterCoverage.fallbackPlayers,60);
  assert.equal(team.rosterCoverage.asOf,'2026-09-02');
});

test('Sept 2 waiver, signing, and injury-settlement changes are represented without stale membership',()=>{
  for(const name of ['Owen Pappoe','Melvin Smith Jr.','Nazir Stackhouse','Terrell Burgess','James Hudson III']){
    assert.equal(byName(name)?.status,'Active',`${name} should be active`);
  }
  for(const name of ['Xavier Restrepo','Jerrick Reed II','Erick Hallett II','Mohamoud Diabate']){
    assert.equal(byName(name),undefined,`${name} belongs to the separate current practice-squad snapshot`);
    assert.ok(auditedPracticeSquad20260902.some(player=>player.name===name),`${name} should be on the Sept. 2 practice squad`);
  }
  for(const name of ['Will Levis','Cordell Volson','Andre James']){
    assert.equal(byName(name),undefined,`${name} should not remain on the current Active/reserve fallback`);
  }
  for(const name of ['Hank Beatty','Derrick Canteen','Mani Powell','Mario Goodrich III']){
    assert.equal(auditedPracticeSquad20260902.some(player=>player.name===name),false,`${name} should not remain on the current practice squad`);
  }
});

test('current official jersey numbers are used and unknown numbers remain unknown',()=>{
  const verified={
    'Tony Adams':'29','Terrell Burgess':'38','James Hudson III':'59','Owen Pappoe':'40','Melvin Smith Jr.':'39','Nazir Stackhouse':'93'
  };
  for(const [name,number] of Object.entries(verified))assert.equal(byName(name)?.number,number,`${name} should use the current official jersey number`);
  assert.equal(byName('Milo Eifler')?.number,'','Milo Eifler should remain unknown until a current official number is verified');
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

test('current feed leads with Sept 2 and Sept 1 post-cutdown evidence',()=>{
  const latestDates=feed.slice(0,4).map(item=>item.publishedAt.slice(0,10));
  assert.deepEqual(latestDates,['2026-09-02','2026-09-01','2026-08-31','2026-08-31']);
  assert.ok(feed.some(item=>/add four to practice squad/i.test(item.title)));
  assert.ok(feed.some(item=>/Sept\. 1 roster transactions/i.test(item.title)));
  assert.ok(feed.some(item=>/Updated 53-man roster/i.test(item.title)));
  assert.ok(feed.some(item=>/Bears 24, Titans 15/i.test(item.title)));
});
