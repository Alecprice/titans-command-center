import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const audit=fs.readFileSync(new URL('../scripts/production-regression.mjs',import.meta.url),'utf8');

test('production roster bound uses current-team Regular Season language',()=>{
  assert.match(audit,/Roster count is outside a plausible current-team range/);
  assert.doesNotMatch(audit,/Roster count is outside a plausible preseason range/);
});

test('release audit still preserves explicit preseason-history validation',()=>{
  assert.match(audit,/\/api\/preseason-stats/);
  assert.match(audit,/No completed preseason gamebook is available/);
  assert.match(audit,/Completed preseason schedule count/);
  assert.match(audit,/completedPreseasonGamesWithPlayerStats/);
});
