import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const controller = readFileSync(new URL('../.github/workflows/tenx-automerge.yml', import.meta.url), 'utf8');

test('live TENX controller requires an exact successful lane guard before merge', () => {
  const exactLaneLookup = controller.indexOf('actions/workflows/tenx-lane-guard.yml/runs');
  const exactHeadFilter = controller.indexOf('-f head_sha="$head_sha"');
  const laneSuccess = controller.indexOf('TENX Lane Guard confirmed collision-free');
  const mergeCall = controller.indexOf('pulls/${pr_number}/merge');

  assert.ok(exactLaneLookup >= 0, 'controller must query the dedicated Lane Guard workflow');
  assert.ok(exactHeadFilter > exactLaneLookup, 'Lane Guard lookup must filter the exact Quality Gate head SHA');
  assert.ok(laneSuccess > exactHeadFilter, 'controller must confirm the exact Lane Guard completed successfully');
  assert.ok(mergeCall > laneSuccess, 'controller must not reach the merge API before Lane Guard success');

  assert.match(controller, /if \[\[ "\$lane_status" != 'completed' \]\]; then[\s\S]*?exit 0/);
  assert.match(controller, /if \[\[ "\$lane_conclusion" != 'success' \]\]; then[\s\S]*?exit 0/);
  assert.match(controller, /-f sha="\$head_sha"/);
});
