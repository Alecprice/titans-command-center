import test from 'node:test';
import assert from 'node:assert/strict';
import { team, games, roster, feed } from '../src/data.mjs';
import { gameStatus, mergeLiveGames } from '../src/core.mjs';

test('current team metadata matches audited official facts',()=>{
  assert.equal(team.coach,'Robert Saleh');
  assert.equal(team.generalManager,'Mike Borgonzi');
  assert.equal(team.owner,'Amy Adams Strunk');
  assert.equal(team.president,'Burke Nihill');
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

test('fallback roster matches the Aug 31 official post-cutdown audit',()=>{
  assert.equal(team.rosterCoverage.fallbackType,'cross-source-audited-snapshot');
  assert.equal(team.rosterCoverage.fallbackPlayers,roster.length);
  assert.equal(roster.length,61);
  assert.equal(team.rosterCoverage.officialActivePlayersAtAudit,53);
  assert.equal(team.rosterCoverage.officialReservePlayersAtAudit,8);
  assert.equal(roster.filter(p=>p.status==='Active').length,53);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured').length,6);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured; Designated for Return').length,2);
  assert.equal(team.rosterCoverage.asOf,'2026-08-31');
  assert.equal(team.rosterCoverage.sourceConflict,'');
  assert.ok(roster.some(p=>p.name==='Owen Pappoe'&&p.status==='Active'));
  assert.ok(roster.some(p=>p.name==='Nazir Stackhouse'&&p.status==='Active'));
  assert.ok(roster.some(p=>p.name==='Terrell Burgess'&&p.status==='Active'));
  assert.ok(roster.some(p=>p.name==='James Hudson'&&p.status==='Active'));
  assert.ok(roster.some(p=>p.name==='Melvin Smith Jr.'&&p.status==='Active'));
  assert.ok(roster.some(p=>p.name==='Dorian Mausi'&&p.status==='Reserve/Injured; Designated for Return'));
  assert.ok(roster.some(p=>p.name==='Joshua Williams'&&p.status==='Reserve/Injured; Designated for Return'));
  for(const removed of ['Will Levis','Hendon Hooker','Kalel Mullings','Cordell Volson','Austin Deculus','Xavier Restrepo','Jerrick Reed II','Erick Hallett II','Mohamoud Diabate']){
    assert.equal(roster.some(p=>p.name===removed),false,`${removed} should not remain in the current fallback roster`);
  }
  assert.equal(new Set(roster.map(p=>p.name)).size,61);
});

test('fallback roster does not use unsourced opinion tags',()=>{
  assert.equal(roster.some(p=>'tag' in p),false);
});

test('fallback feed is source-linked and leads with current post-cutdown facts',()=>{
  for(const item of feed)assert.match(item.url,/^https:\/\//);
  const rosterUpdate=feed.find(item=>/Updated 53-man roster/i.test(item.title));
  assert.equal(rosterUpdate?.tier,'official');
  assert.match(rosterUpdate?.summary||'',/Owen Pappoe/);
  const cutdown=feed.find(item=>/trim roster to 53/i.test(item.title));
  assert.equal(cutdown?.tier,'official');
  const bears=feed.find(item=>/Bears 24, Titans 15/i.test(item.title));
  assert.equal(bears?.tier,'official');
  assert.match(bears?.summary||'',/2-1/);
  const practice=feed.find(item=>/practice squad/i.test(item.title));
  assert.equal(practice?.tier,'official');
  assert.match(practice?.summary||'',/separate from the 53-player Active roster/i);
});

test('live merge leaves null-date schedule rows alone',()=>{
  const base=[...games];
  const live=[{id:'live',week:2,date:'2026-08-24T00:00:00Z',opponentAbbr:'SEA',opponent:'Seattle Seahawks',homeAway:'home',status:'live',score:'7',opponentScore:'3',source:'ESPN'}];
  const out=mergeLiveGames(base,live);
  assert.equal(out.filter(g=>g.week===18).length,1);
  assert.equal(out.find(g=>g.week===18).date,null);
});