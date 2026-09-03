import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const workflow=readFileSync(new URL('../.github/workflows/tenx-automerge.yml',import.meta.url),'utf8');

test('TENX auto-merge only follows the completed Titans Quality Gate',()=>{
  assert.match(workflow,/workflow_run:/);
  assert.match(workflow,/workflows: \['Titans Quality Gate'\]/);
  assert.match(workflow,/types: \[completed\]/);
  assert.match(workflow,/github\.event\.workflow_run\.event == 'pull_request'/);
  assert.doesNotMatch(workflow,/pull_request_target:/);
});

test('TENX auto-merge has explicit least-purpose write permissions and never checks out PR code',()=>{
  assert.match(workflow,/actions: write/);
  assert.match(workflow,/contents: write/);
  assert.match(workflow,/pull-requests: write/);
  assert.match(workflow,/GH_TOKEN: \$\{\{ github\.token \}\}/);
  assert.doesNotMatch(workflow,/actions\/checkout/);
  assert.doesNotMatch(workflow,/secrets\./);
});

test('TENX auto-merge requires explicit opt-in and same-repo owner trust',()=>{
  assert.match(workflow,/<!-- tenx-automerge:v1 -->/);
  assert.match(workflow,/head_repo.*GITHUB_REPOSITORY/);
  assert.match(workflow,/author.*Alecprice/);
  assert.match(workflow,/base_ref.*main/);
  assert.match(workflow,/draft.*false/);
});

test('TENX auto-merge rejects stale or red revisions before merge',()=>{
  assert.match(workflow,/pr_head_sha.*head_sha/);
  assert.match(workflow,/conclusion.*success/);
  assert.match(workflow,/tenx-automerge-failure:/);
  assert.match(workflow,/mergeable_state.*dirty/);
  assert.match(workflow,/mergeable_state.*blocked/);
  assert.match(workflow,/CHANGES_REQUESTED/);
});

test('TENX auto-merge pins the merge to the exact green head SHA',()=>{
  assert.match(workflow,/pulls\/\$\{pr_number\}\/merge/);
  assert.match(workflow,/-f merge_method='merge'/);
  assert.match(workflow,/-f sha="\$head_sha"/);
  assert.match(workflow,/merged.*true/);
});

test('TENX autonomous merge explicitly dispatches the production pipeline',()=>{
  assert.match(workflow,/actions\/workflows\/cloudflare-deploy\.yml\/dispatches/);
  assert.match(workflow,/-f ref='main'/);
  assert.match(workflow,/Dispatched Titans Cloudflare Deploy/);
});
