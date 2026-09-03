import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflowPath = '.github/workflows/player-preseason-fallback-production.yml';
const workflow = fs.readFileSync(workflowPath, 'utf8');

test('Player preseason production gate qualifies workflow_run events by the actual Cloudflare deploy step', () => {
  assert.match(workflow, /permissions:\s*[\s\S]*actions:\s*read[\s\S]*contents:\s*read/);
  assert.match(workflow, /Determine whether Cloudflare actually deployed this source/);
  assert.match(workflow, /github\.event\.workflow_run\.id/);
  assert.match(workflow, /actions\/runs\/\$\{WORKFLOW_RUN_ID\}\/jobs\?per_page=100/);
  assert.match(workflow, /select\(\.name == \"Deploy to Cloudflare\"\) \| \.conclusion/);
  assert.match(workflow, /if \[\[ \"\$DEPLOY_OUTCOME\" == \"success\" \]\]; then/);
  assert.match(workflow, /echo \"should_run=true\" >> \"\$GITHUB_OUTPUT\"/);
  assert.match(workflow, /echo \"should_run=false\" >> \"\$GITHUB_OUTPUT\"/);
});

test('Player preseason production assertions stay strict but only run for a deployed source', () => {
  const qualifiedSteps = [
    'Checkout deployed revision',
    'Use Node 24',
    'Verify exact production revision',
    'Install Selenium',
    'Run Player Intelligence preseason fallback regression',
  ];

  for (const step of qualifiedSteps) {
    const escaped = step.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(
      workflow,
      new RegExp(`- name: ${escaped}\\n\\s+if: steps\\.deployed\\.outputs\\.should_run == 'true'`),
      `${step} must be guarded by the real-deploy qualification`,
    );
  }

  assert.match(workflow, /lastCommit===expected/);
  assert.match(workflow, /Production revision mismatch: expected/);
  assert.match(workflow, /python scripts\/player-preseason-fallback-browser-smoke\.py/);
  assert.match(workflow, /Record stale or skipped deploy/);
});
