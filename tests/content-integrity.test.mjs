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

test('fallback roster is the Aug 24 cross-source audited snapshot',()=>{
  assert.equal(team.rosterCoverage.fallbackType,'cross-source-audited-snapshot');
  assert.equal(team.rosterCoverage.fallbackPlayers,roster.length);
  assert.equal(roster.length,96);
  assert.equal(team.rosterCoverage.officialActivePlayersAtAudit,91);
  assert.equal(team.rosterCoverage.officialReservePlayersAtAudit,5);
  assert.equal(roster.filter(p=>p.status==='Active').length,91);
  assert.equal(roster.filter(p=>p.status==='Reserve/Injured').length,5);
  assert.equal(team.rosterCoverage.asOf,'2026-08-24');
  assert.match(team.rosterCoverage.sourceConflict,/Reid Carrico/i);
  assert.ok(roster.some(p=>p.name==='Tanoh Kpassagnon'&&p.number==='58'&&p.status==='Active'));
  assert.ok(roster.some(p=>p.name==='Milo Eifler'&&p.number==='45'&&p.status==='Reserve/Injured'));
  assert.ok(roster.some(p=>p.name==='Reid Carrico'&&p.number===''&&p.status==='Active'));
  assert.equal(roster.some(p=>p.name==='Matt Lauter'),false);
});

test('fallback roster does not use unsourced opinion tags',()=>{
  assert.equal(roster.some(p=>'tag' in p),false);
});

test('fallback feed is source-linked and includes the Aug 24 official roster move',()=>{
  for(const item of feed)assert.match(item.url,/^https:\/\//);
  const move=feed.find(item=>/Reid Carrico/i.test(item.title));
  assert.equal(move?.tier,'official');
  assert.match(move?.summary||'',/newer official transaction/i);
  const seattle=feed.find(item=>/Titans 19, Seahawks 16/i.test(item.title));
  assert.ok(seattle);
});

test('live merge leaves null-date schedule rows alone',()=>{
  const base=[...games];
  const live=[{id:'live',week:2,date:'2026-08-24T00:00:00Z',opponentAbbr:'SEA',opponent:'Seattle Seahawks',homeAway:'home',status:'live',score:'7',opponentScore:'3',source:'ESPN'}];
  const out=mergeLiveGames(base,live);
  assert.equal(out.filter(g=>g.week===18).length,1);
  assert.equal(out.find(g=>g.week===18).date,null);
});
