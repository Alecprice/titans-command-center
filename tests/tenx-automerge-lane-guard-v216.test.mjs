import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/tenx-automerge.yml', import.meta.url), 'utf8');

function position(fragment) {
  const index = workflow.indexOf(fragment);
  assert.notEqual(index, -1, `missing controller fragment: ${fragment}`);
  return index;
}

test('automerge controller remains single-triggered by the Quality Gate', () => {
  assert.match(workflow, /workflows: \['Titans Quality Gate'\]/);
  assert.doesNotMatch(workflow, /workflows:\s*\[[^\]]*TENX Lane Guard/);
  assert.match(workflow, /if: github\.event\.workflow_run\.event == 'pull_request'/);
});

test('controller resolves the exact PR-head Lane Guard through the workflow-runs API', () => {
  assert.match(workflow, /actions\/workflows\/tenx-lane-guard\.yml\/runs/);
  assert.match(workflow, /X-GitHub-Api-Version: 2026-03-10/);
  assert.match(workflow, /-X GET/);
  assert.match(workflow, /-f event='pull_request'/);
  assert.match(workflow, /-f head_sha="\$head_sha"/);
  assert.match(workflow, /select\(\.head_sha == \$sha and \.event == "pull_request"\)/);
});

test('controller waits for completion and requires Lane Guard success', () => {
  assert.match(workflow, /for attempt in \$\(seq 1 60\); do/);
  assert.match(workflow, /if \[\[ "\$lane_status" == 'completed' \]\]; then/);
  assert.match(workflow, /if \[\[ "\$lane_status" != 'completed' \]\]; then[\s\S]*?exit 0/);
  assert.match(workflow, /if \[\[ "\$lane_conclusion" != 'success' \]\]; then[\s\S]*?exit 0/);
  assert.match(workflow, /TENX Lane Guard confirmed collision-free/);
});

test('lane safety is checked before mergeability reviews and the exact-sha merge call', () => {
  const laneLookup = position('actions/workflows/tenx-lane-guard.yml/runs');
  const mergeability = position('mergeable_state=');
  const reviews = position('latest_blocking_reviews=');
  const mergeCall = position('pulls/${pr_number}/merge');

  assert.ok(laneLookup < mergeability, 'Lane Guard must run before mergeability evaluation');
  assert.ok(laneLookup < reviews, 'Lane Guard must run before review evaluation');
  assert.ok(laneLookup < mergeCall, 'Lane Guard must run before the merge API call');
  assert.match(workflow, /-f sha="\$head_sha"/);
});

test('existing trusted-PR and release-chain safeguards remain intact', () => {
  assert.match(workflow, /TENX_AUTOMERGE_MARKER: '<!-- tenx-automerge:v1 -->'/);
  assert.match(workflow, /if \[\[ "\$head_repo" != "\$GITHUB_REPOSITORY" \]\]/);
  assert.match(workflow, /if \[\[ "\$author" != "Alecprice" \]\]/);
  assert.match(workflow, /if \[\[ "\$pr_head_sha" != "\$head_sha" \]\]/);
  assert.match(workflow, /latest_blocking_reviews/);
  assert.match(workflow, /actions\/workflows\/cloudflare-deploy\.yml\/dispatches/);
  assert.match(workflow, /deploy_head_sha.*merge_sha/s);
  assert.match(workflow, /actions\/workflows\/tenx-postdeploy-verification\.yml\/dispatches/);
  assert.doesNotMatch(workflow, /actions\/checkout/);
});
