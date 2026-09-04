import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const controller = fs.readFileSync('.github/workflows/tenx-automerge.yml', 'utf8');
const verifier = fs.readFileSync('.github/workflows/tenx-postdeploy-verification.yml', 'utf8');

test('TENX release E2E contract separates gate, merge, deploy, and verification identities', () => {
  assert.match(controller, /head_sha=.*workflow_run\.head_sha/);
  assert.match(controller, /-f sha="\$head_sha"/);
  assert.match(controller, /merge_sha=.*\.sha/);
  assert.match(controller, /deploy_run_id=.*workflow_run_id/);
  assert.match(controller, /deploy_head_sha=.*head_sha/);
  assert.match(controller, /deploy_head_sha\" != \"\$merge_sha/);
  assert.match(controller, /deploy_conclusion\" != 'success'/);
  assert.match(controller, /inputs\[source_sha\]=\$\{merge_sha\}/);
});

test('TENX postdeploy verifier consumes only the dispatched deployed revision', () => {
  assert.match(verifier, /workflow_dispatch:/);
  assert.match(verifier, /SOURCE_SHA: \$\{\{ inputs\.source_sha \}\}/);
  assert.match(verifier, /ref: \$\{\{ inputs\.source_sha \}\}/);
  assert.match(verifier, /last === expected/);
  assert.match(verifier, /TENX Current Experience \/ Post-Deploy/);
  assert.match(verifier, /Fail closed when any verification check failed/);
});
