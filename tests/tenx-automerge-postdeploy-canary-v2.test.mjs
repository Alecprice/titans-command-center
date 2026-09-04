import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const controller = fs.readFileSync('.github/workflows/tenx-automerge.yml', 'utf8');
const verifier = fs.readFileSync('.github/workflows/tenx-postdeploy-verification.yml', 'utf8');

test('TENX autonomous merge has permission to dispatch both release workflows', () => {
  assert.match(controller, /permissions:\n(?:[\s\S]*\n)?\s*actions: write/);
  assert.match(controller, /cloudflare-deploy\.yml\/dispatches/);
  assert.match(controller, /tenx-postdeploy-verification\.yml\/dispatches/);
});

test('TENX merge stays pinned to the green PR head while postdeploy pins the resulting main merge commit', () => {
  assert.match(controller, /-f sha="\$head_sha"/);
  assert.match(controller, /merge_sha=.*\.sha/);
  assert.match(controller, /inputs\[source_sha\]=\$\{merge_sha\}/);
  assert.match(controller, /deploy_head_sha/);
  assert.match(controller, /deploy_head_sha\" != \"\$merge_sha/);
  assert.match(verifier, /SOURCE_SHA: \$\{\{ inputs\.source_sha \}\}/);
  assert.match(verifier, /ref: \$\{\{ inputs\.source_sha \}\}/);
  assert.match(verifier, /last === expected/);
});

test('TENX postdeploy verifier remains an explicit dispatch workflow and fails closed', () => {
  assert.match(verifier, /on:\n\s*workflow_dispatch:/);
  assert.doesNotMatch(verifier, /workflow_run:/);
  assert.match(verifier, /Fail closed when any verification check failed/);
  assert.match(verifier, /TENX Current Experience \/ Post-Deploy/);
});
