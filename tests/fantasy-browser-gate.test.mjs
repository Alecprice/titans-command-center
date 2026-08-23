import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const smoke=read('scripts/fantasy-browser-smoke.py');
const current=read('.github/workflows/current-experience-browser.yml');
const quality=read('.github/workflows/quality.yml');

test('Fantasy browser smoke exercises real desktop and mobile interactions',()=>{
  assert.match(smoke,/driver\.get\(f'\{BASE\}\/\#fantasy'\)/);
  assert.match(smoke,/\[data-scoring='ppr'\]/);
  assert.match(smoke,/37\.0 pts/);
  assert.match(smoke,/\[data-ftab='my'\]/);
  assert.match(smoke,/Smoke Test Player/);
  assert.match(smoke,/\[data-remove-player\]/);
  assert.match(smoke,/\[data-ftab='sleeper'\]/);
  assert.match(smoke,/\[data-ftab='draft'\]/);
  assert.match(smoke,/set_window_size\(390,844\)/);
  assert.match(smoke,/min\(heights\)<43\.5/);
  assert.match(smoke,/severe_logs/);
});

test('Fantasy browser smoke is syntax checked and gates Current Experience status',()=>{
  assert.match(quality,/scripts\/fantasy-browser-smoke\.py/);
  assert.match(current,/name: Audit Fantasy Command/);
  assert.match(current,/id: fantasy_command/);
  assert.match(current,/python scripts\/fantasy-browser-smoke\.py/);
  assert.match(current,/FANTASY_OUTCOME: \$\{\{ steps\.fantasy_command\.outcome \}\}/);
  assert.match(current,/fantasy: process\.env\.FANTASY_OUTCOME/);
  assert.match(current,/\/tmp\/fantasy-browser-smoke\.json/);
  assert.match(current,/\"\$FANTASY_OUTCOME\"/);
});
