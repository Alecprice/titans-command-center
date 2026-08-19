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

test('fallback roster is explicitly a verified sample',()=>{
  assert.equal(team.rosterCoverage.fallbackType,'featured-sample');
  assert.equal(team.rosterCoverage.fallbackPlayers,roster.length);
  assert.ok(team.rosterCoverage.officialActivePlayersAtAudit>roster.length);
});

test('fallback roster does not use unsourced opinion tags',()=>{
  assert.equal(roster.some(p=>'tag' in p),false);
});

test('fallback feed is source-linked',()=>{
  for(const item of feed)assert.match(item.url,/^https:\/\//);
});

test('live merge leaves null-date schedule rows alone',()=>{
  const base=[...games];
  const live=[{id:'live',week:2,date:'2026-08-24T00:00:00Z',opponentAbbr:'SEA',opponent:'Seattle Seahawks',homeAway:'home',status:'live',score:'7',opponentScore:'3',source:'ESPN'}];
  const out=mergeLiveGames(base,live);
  assert.equal(out.filter(g=>g.week===18).length,1);
  assert.equal(out.find(g=>g.week===18).date,null);
});
