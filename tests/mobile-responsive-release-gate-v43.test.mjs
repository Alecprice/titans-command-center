import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow=fs.readFileSync(new URL('../.github/workflows/responsive-matrix.yml',import.meta.url),'utf8');
const smoke=fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py',import.meta.url),'utf8');

test('responsive production matrix is not blocked by unrelated later deploy checks',()=>{
  assert.match(workflow,/workflow_run:/);
  assert.match(workflow,/head_branch == 'main'/);
  assert.match(workflow,/workflow_run\.event == 'push'/);
  assert.doesNotMatch(workflow,/workflow_run\.conclusion == 'success'/);
});

test('responsive production matrix verifies the exact deployed revision before browser checks',()=>{
  assert.match(workflow,/build-meta\.json\?responsive=/);
  assert.match(workflow,/data\?\.commit/);
  assert.match(workflow,/last === expected/);
  assert.match(workflow,/id: deployed_sha/);
  assert.match(workflow,/steps\.deployed_sha\.outcome == 'success'/);
  assert.match(workflow,/steps\.deployed_sha\.outcome != 'success'/);
});

test('responsive production report remains available for diagnosis',()=>{
  assert.match(workflow,/actions\/upload-artifact@/);
  assert.match(workflow,/responsive-matrix-\$\{\{ env\.EXPECTED_SHA \}\}/);
  assert.match(workflow,/\/tmp\/responsive-matrix-smoke\.json/);
});

test('phone matrix enforces touch target and minimum text floors instead of only reporting them',()=>{
  assert.match(smoke,/if state\['smallControls'\]: raise RuntimeError\(f'\{label\}: undersized app controls/);
  assert.match(smoke,/if state\['suspiciousTiny'\]: raise RuntimeError\(f'\{label\}: text below 9\.5px/);
  assert.match(smoke,/x\['w'\]<44 or x\['h'\]<44/);
  assert.match(smoke,/\('small-phone',360,780,'mobile'\)/);
  assert.match(smoke,/\('phone',390,844,'mobile'\)/);
  assert.match(smoke,/\('large-phone',430,932,'mobile'\)/);
});
