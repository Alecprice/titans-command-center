import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { detectCollisions, collisionSummary } from '../scripts/tenx-lane-guard.mjs';

const workflow = readFileSync(new URL('../.github/workflows/tenx-lane-guard.yml', import.meta.url), 'utf8');

test('lane guard reports exact file overlap and keeps draft PRs reserved', () => {
  const collisions = detectCollisions(
    ['src/a.mjs', 'tests/a.test.mjs', 'README.md'],
    [
      { number: 10, title: 'Agent A', head: 'agent/a', draft: false, files: ['src/a.mjs', 'src/b.mjs'] },
      { number: 11, title: 'Agent B', head: 'agent/b', draft: true, files: ['README.md'] },
      { number: 12, title: 'Agent C', head: 'agent/c', draft: false, files: ['other.txt'] }
    ]
  );

  assert.deepEqual(collisions.map(item => ({ number: item.number, draft: item.draft, files: item.files })), [
    { number: 10, draft: false, files: ['src/a.mjs'] },
    { number: 11, draft: true, files: ['README.md'] }
  ]);
});

test('lane guard allows a file-disjoint PR lane', () => {
  assert.deepEqual(detectCollisions(
    ['scripts/new-guard.mjs'],
    [{ number: 20, title: 'Other lane', head: 'feature/other', draft: false, files: ['src/data.mjs'] }]
  ), []);
});

test('collision summary gives actionable ownership without hiding reserved files', () => {
  const summary = collisionSummary(99, [{
    number: 22,
    title: 'Ticket | agent',
    head: 'agent/tickets',
    draft: false,
    files: ['tickets.js', 'tests/tickets.test.mjs']
  }]);

  assert.match(summary, /PR #99 overlaps 1 active pull request lane/);
  assert.match(summary, /#22 Ticket \\| agent/);
  assert.match(summary, /`agent\/tickets`/);
  assert.match(summary, /`tickets\.js`/);
  assert.match(summary, /Do not silently overwrite parallel agent work/);
});

test('workflow uses least privilege and never executes through pull_request_target', () => {
  assert.match(workflow, /pull_request:\s*\n\s+branches: \[main\]/);
  assert.doesNotMatch(workflow, /pull_request_target/);
  assert.match(workflow, /permissions:\s*\n\s+contents: read\s*\n\s+pull-requests: read/);
  assert.doesNotMatch(workflow, /contents: write|pull-requests: write|actions: write/);
  assert.match(workflow, /persist-credentials: false/);
});

test('workflow checks opened updated reopened and ready PR lanes with a short fail-closed job', () => {
  assert.match(workflow, /types: \[opened, synchronize, reopened, ready_for_review\]/);
  assert.match(workflow, /group: tenx-lane-guard-\$\{\{ github\.event\.pull_request\.number \}\}/);
  assert.match(workflow, /cancel-in-progress: true/);
  assert.match(workflow, /timeout-minutes: 5/);
  assert.match(workflow, /run: node scripts\/tenx-lane-guard\.mjs/);
  assert.match(workflow, /PR_NUMBER: \$\{\{ github\.event\.pull_request\.number \}\}/);
  assert.match(workflow, /BASE_REF: \$\{\{ github\.event\.pull_request\.base\.ref \}\}/);
});
