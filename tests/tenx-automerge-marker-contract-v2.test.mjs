import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const workflow=readFileSync(new URL('../.github/workflows/tenx-automerge.yml',import.meta.url),'utf8');
const docs=readFileSync(new URL('../.github/TENX_AUTOMERGE.md',import.meta.url),'utf8');
const deploy=readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');
const marker='<!-- tenx-automerge:v1 -->';

test('TENX autonomous merge marker stays identical in workflow and operator contract',()=>{
  assert.equal(workflow.includes(marker),true);
  assert.equal(docs.includes(marker),true);
});

test('TENX operator contract keeps failure repair and production verification boundaries explicit',()=>{
  assert.match(docs,/Quality Gate fails, is cancelled, or times out/);
  assert.match(docs,/make the smallest safe fix/);
  assert.match(docs,/Production verification remains owned by the existing Cloudflare deploy and post-deploy browser audit workflows/);
});

test('autonomous merge explicitly dispatches the existing production owner',()=>{
  assert.match(workflow,/actions\/workflows\/cloudflare-deploy\.yml\/dispatches/);
  assert.match(workflow,/-f ref='main'/);
  assert.match(deploy,/workflow_dispatch:/);
  assert.match(deploy,/name: Titans Cloudflare Deploy/);
});

test('autonomous merge remains exact-SHA gated and privileged workflow never executes PR code',()=>{
  assert.match(workflow,/-f sha="\$head_sha"/);
  assert.match(workflow,/pr_head_sha.*head_sha/);
  assert.doesNotMatch(workflow,/pull_request_target:/);
  assert.doesNotMatch(workflow,/actions\/checkout/);
});
