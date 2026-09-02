import test from 'node:test';
import assert from 'node:assert/strict';
import { team, games, roster, feed } from '../src/data.mjs';
import { auditedPracticeSquad20260902, ROSTER_AUDIT_DATE, ROSTER_SOURCE_CONFLICT } from '../src/roster-audit-20260831.mjs';
import { gameStatus, mergeLiveGames } from '../src/core.mjs';

test('current team metadata matches audited official facts',()=>{
  assert.equal(team.coach,'Robert Saleh');
  assert.equal(team.generalManager,'Mike Borgonzi');
  assert.equal(team.owner,'Amy Adams Strunk');
  assert.equal(team.president,'Burke Nihill');
  assert.equal(team.presidentTitle,'President and Chief Executive Officer');
  assert.equal(team.offensiveCoordinator,'Brian Daboll');
  assert.equal(team.defensiveCoordinator,'Gus Bradley');
  assert.equal(team.specialTeamsCoordinator,'John Fassel');
  assert.equal(team.specialTeamsCoordinatorTitle,'Assistant Head Coach/Special Teams Coordinator');
  assert.deepEqual(team.colors,['Titans blue','red','white','navy blue']);
  assert.equal(team.primaryLogo,'The Shield');
  assert.equal(team.phase,'Regular Season');
});

test('franchise grant and first season remain separate milestones',()=>{
  assert.equal(team.franchiseGranted,'1959-08-14');
  assert.equal(team.firstSeason,1960);
});

test('Week 9 is a bye and Week 18 is TBD',()=>{
  const bye=games.find(g=>g.week===9);
  assert.equal(bye?.status,'bye');
  assert.equal(gameStatus(bye),'Bye');
  const week18=games.find(g=>g.week===18);
  assert.equal(week18?.date,null);
  assert.equal(week18?.dateTbd,true);
  assert.equal(week18?.venue,'Reliant Stadium');
  assert.equal(gameStatus(week18),'TBD');
});

test('preseason is final at 2-1 and the Jets are next',()=>{
  const bears=games.find(g=>g.opponentAbbr==='CHI');
  assert.equal(bears?.status,'final');
  assert.equal(bears?.score,15);
  assert.equal(bears?.opponentScore,24);
  const completedPreseason=games.filter(g=>String(g.week).startsWith('P')&&g.status==='final');
  assert.equal(completedPreseason.length,3);
  assert.equal(completedPreseason.filter(g=>g.score>g.opponentScore).length,2);
  assert.equal(completedPreseason.filter(g=>g.score<g.opponentScore).length,1);
  const next=games.find(g=>g.week===1);
  assert.equal(next?.opponentAbbr,'NYJ');
  assert.equal(next?.status,'scheduled');
  assert.equal(next?.network,'CBS');
});

test('fallback roster matches the Sept 2 current-team audit',()=>{
  assert.equal(ROSTER_AUDIT_DATE,'2026-09-02');
  assert.equal(team.rosterCoverage.fallbackType,'cross-source-audited-snapshot');
  assert.equal(team.rosterCoverage.fallbackPlayers,roster.length);
  assert.equal(roster.length,60);
  assert.equal(team.rosterCoverage.officialActivePlayersAtAudit,53);
  assert.equal(team.rosterCoverage.officialReservePlayersAtAudit,7);
  assert.equal(team.rosterCoverage.practiceSquadPlayersAtAudit,17);
  assert.equal(roster.filter(p=>p.status==='Active').length,53);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured').length,5);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured; Designated for Return').length,2);
  assert.equal(team.rosterCoverage.asOf,'2026-09-02');
  assert.match(ROSTER_SOURCE_CONFLICT,/transactions log is newer/i);
  assert.equal(team.rosterCoverage.sourceConflict,ROSTER_SOURCE_CONFLICT);

  const verifiedNumbers={
    'Tony Adams':'29','Terrell Burgess':'38','James Hudson III':'59','Owen Pappoe':'40','Melvin Smith Jr.':'39','Nazir Stackhouse':'93'
  };
  for(const [name,number] of Object.entries(verifiedNumbers)){
    assert.ok(roster.some(p=>p.name===name&&p.number===number&&p.status==='Active'),`${name} should be active as #${number}`);
  }
  assert.equal(roster.some(p=>p.name==='Andre James'),false,'Andre James was waived from IR with an injury settlement on Sept. 1');
  assert.ok(roster.some(p=>p.name==='Dorian Mausi'&&p.status==='Reserve/Injured; Designated for Return'));
  assert.ok(roster.some(p=>p.name==='Joshua Williams'&&p.status==='Reserve/Injured; Designated for Return'));
  assert.equal(new Set(roster.map(p=>p.name)).size,60);
});

test('practice squad is tracked separately from the 53-man roster',()=>{
  assert.equal(auditedPracticeSquad20260902.length,17);
  for(const name of ['Shemar Bartholomew','Mohamoud Diabate','Erick Hallett II','Xavier Restrepo','Jerrick Reed II','Hendon Hooker','Kalel Mullings','Laki Tasi']){
    assert.ok(auditedPracticeSquad20260902.some(p=>p.name===name),`${name} should be in the Sept. 2 practice-squad snapshot`);
  }
  for(const removed of ['Hank Beatty','Derrick Canteen','Mani Powell','Mario Goodrich III']){
    assert.equal(auditedPracticeSquad20260902.some(p=>p.name===removed),false,`${removed} should not remain on the current practice squad`);
  }
  assert.equal(roster.some(p=>auditedPracticeSquad20260902.some(ps=>ps.name===p.name)),false,'practice squad must not be folded into current 53/reserve roster');
});

test('fallback roster does not use unsourced opinion tags',()=>{
  assert.equal(roster.some(p=>'tag' in p),false);
});

test('fallback feed leads with the latest official Sept 2 transactions',()=>{
  for(const item of feed)assert.match(item.url,/^https:\/\//);
  assert.match(feed[0]?.title||'',/add four to practice squad/i);
  assert.match(feed[0]?.summary||'',/Xavier Restrepo/);
  const sept1=feed.find(item=>/Sept\. 1 roster transactions/i.test(item.title));
  assert.equal(sept1?.tier,'official');
  assert.match(sept1?.summary||'',/Andre James/);
  const rosterUpdate=feed.find(item=>/Updated 53-man roster/i.test(item.title));
  assert.equal(rosterUpdate?.tier,'official');
  assert.match(rosterUpdate?.summary||'',/Owen Pappoe/);
  const bears=feed.find(item=>/Bears 24, Titans 15/i.test(item.title));
  assert.equal(bears?.tier,'official');
  assert.match(bears?.summary||'',/2-1/);
});

test('live merge leaves null-date schedule rows alone',()=>{
  const base=[...games];
  const live=[{id:'live',week:2,date:'2026-08-24T00:00:00Z',opponentAbbr:'SEA',opponent:'Seattle Seahawks',homeAway:'home',status:'live',score:'7',opponentScore:'3',source:'ESPN'}];
  const out=mergeLiveGames(base,live);
  assert.equal(out.filter(g=>g.week===18).length,1);
  assert.equal(out.find(g=>g.week===18).date,null);
});