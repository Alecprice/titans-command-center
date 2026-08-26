import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const production=fs.readFileSync(new URL('../scripts/production-regression.mjs',import.meta.url),'utf8');
const api=fs.readFileSync(new URL('../src/preseason-api.mjs',import.meta.url),'utf8');

test('production audit reconciles completed preseason games with player-stat coverage',()=>{
  assert.match(production,/const coverage=stats\.body\?\.coverage/);
  assert.match(production,/completedGamesWithPlayerStats/);
  assert.match(production,/completedGamesMissingPlayerStats/);
  assert.match(production,/withPlayerStats\+missingPlayerStats===completedCoverage/);
  assert.match(production,/completedSchedule\.length===completedCoverage/);
  assert.match(production,/typeof game\.statsAvailable==='boolean'/);
  assert.match(production,/missing player box-score detail/i);
  assert.match(production,/completedPreseasonGamebooks/);
  assert.match(production,/completedPreseasonGamesMissingPlayerStats/);
});

test('preseason API distinguishes final schedule truth from loaded gamebook detail',()=>{
  assert.match(api,/statsAvailable:Boolean\(statsGame\)/);
  assert.match(api,/completed:Boolean\(statsGame\)\|\|seedFinal/);
  assert.match(api,/function coverageFor/);
  assert.match(api,/completedGamesMissingPlayerStats/);
  assert.match(api,/expectedLowBoxPositions/);
  assert.match(api,/missing player box-score detail from the current upstream stat source/);
});
