import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {team,games} from '../src/data.mjs';

const script=fs.readFileSync(new URL('../scripts/regular-season-production-regression.mjs',import.meta.url),'utf8');

test('2026 source data is in regular-season phase with the Jets opener locked',()=>{
  assert.equal(team.season,2026);
  assert.equal(team.phase,'Regular Season');
  assert.equal(team.byeWeek,9);
  const week1=games.find(game=>game.week===1);
  assert.ok(week1);
  assert.deepEqual({opponentAbbr:week1.opponentAbbr,date:week1.date,homeAway:week1.homeAway,venue:week1.venue,network:week1.network},{opponentAbbr:'NYJ',date:'2026-09-13T17:00:00Z',homeAway:'home',venue:'Nissan Stadium',network:'CBS'});
});

test('completed preseason history remains immutable as the app enters Week 1',()=>{
  const preseason=games.filter(game=>String(game.week).startsWith('P'));
  assert.equal(preseason.length,3);
  assert.deepEqual(preseason.map(game=>[game.opponentAbbr,game.status,game.score,game.opponentScore]),[
    ['SF','final',19,13],
    ['SEA','final',19,16],
    ['CHI','final',15,24]
  ]);
});

test('production audit is date-aware around Week 1 kickoff and validates fan-facing schedule truth',()=>{
  assert.match(script,/WEEK1_KICKOFF='2026-09-13T17:00:00Z'/);
  assert.match(script,/team\.phase\|\|''\)==='Regular Season'/);
  assert.match(script,/opponentAbbr\|\|''\)==='NYJ'/);
  assert.match(script,/homeAway\|\|''\)==='home'/);
  assert.match(script,/venue\|\|''\)==='Nissan Stadium'/);
  assert.match(script,/network\|\|''\)==='CBS'/);
  assert.match(script,/Date\.now\(\)<Date\.parse\(WEEK1_KICKOFF\)/);
  assert.match(script,/Historical preseason score/);
});
