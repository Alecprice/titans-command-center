import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/postdeploy-browser-diagnostics.yml','utf8');
const responsiveWorkflow = readFileSync('.github/workflows/responsive-matrix.yml','utf8');

const expectedScripts = [
  'browser-navigation-smoke.py',
  'media-browser-smoke.py',
  'market-browser-smoke.py',
  'command-intelligence-browser-smoke.py',
  'player-gameday-browser-smoke.py',
  'ask-titans-browser-smoke.py',
  'change-intelligence-browser-smoke.py',
  'runtime-365-browser-smoke.py',
  'freshness-browser-smoke.py',
  'account-browser-smoke.py',
  'analytics-browser-smoke.py',
  'headshot-browser-smoke.py',
  'responsive-matrix-smoke.py',
];

test('post-deploy diagnostics exercise every major browser surface independently', () => {
  for (const script of expectedScripts) {
    assert.match(workflow, new RegExp(`python scripts/${script.replaceAll('.', '\\.')}`), `missing ${script}`);
  }
  const tolerantSteps = workflow.match(/continue-on-error: true/g) ?? [];
  assert.equal(tolerantSteps.length, expectedScripts.length, 'each diagnostic must continue so later surfaces still run');
});

test('post-deploy diagnostics still fail closed after collecting all results', () => {
  assert.match(workflow, /Fail if any browser diagnostic failed/);
  assert.match(workflow, /grep -Eq '\(\^\| \)failure\( \|\$\)'/);
  assert.match(workflow, /exit 1/);
  assert.match(workflow, /GITHUB_STEP_SUMMARY/);
});

test('diagnostic workflow is read-only and uses pinned workflow dependencies', () => {
  assert.match(workflow, /permissions:\s*\n\s+contents: read/);
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40}/);
  assert.match(workflow, /actions\/setup-node@[0-9a-f]{40}/);
  assert.match(workflow, /persist-credentials: false/);
});

test('post-deploy browser workflows test the exact revision that triggered deployment', () => {
  const deployedRef = /ref: \$\{\{ github\.event_name == 'workflow_run' && github\.event\.workflow_run\.head_sha \|\| 'main' \}\}/;
  assert.match(workflow, deployedRef);
  assert.match(responsiveWorkflow, deployedRef);
  assert.doesNotMatch(workflow, /ref: main\s/);
  assert.doesNotMatch(responsiveWorkflow, /ref: main\s/);
});

test('browser diagnostics refuse to test stale production against a newer source revision', () => {
  assert.match(workflow, /SOURCE_SHA: \$\{\{ github\.event_name == 'workflow_run' && github\.event\.workflow_run\.head_sha \|\| '' \}\}/);
  assert.match(workflow, /build-meta\.json\?diagnostic=/);
  assert.match(workflow, /live===expected/);
  assert.match(workflow, /deployed=\$\{matches\?'true':'false'\}/);
  assert.match(workflow, /if: steps\.deployment\.outputs\.deployed == 'true'/);
  assert.match(workflow, /Source revision is not live; browser diagnostics were correctly skipped/);
});
