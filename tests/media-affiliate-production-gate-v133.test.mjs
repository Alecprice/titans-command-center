import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const workflow=await readFile(new URL('../.github/workflows/media-affiliate-production.yml',import.meta.url),'utf8');
const browser=await readFile(new URL('../scripts/media-affiliate-browser-smoke.py',import.meta.url),'utf8');

test('affiliate production gate runs after successful Cloudflare workflows and supports manual verification',()=>{
  assert.match(workflow,/workflow_run:/);
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/types: \[completed\]/);
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(workflow,/github\.event\.workflow_run\.head_branch == 'main'/);
});

test('gate distinguishes a real Cloudflare deployment from a stale skipped workflow',()=>{
  assert.match(workflow,/actions\/runs\/\$\{WORKFLOW_RUN_ID\}\/jobs\?per_page=100/);
  assert.match(workflow,/select\(\.name == "Deploy to Cloudflare"\)/);
  assert.match(workflow,/if \[\[ "\$DEPLOY_OUTCOME" == "success" \]\]/);
  assert.match(workflow,/should_run=true/);
  assert.match(workflow,/should_run=false/);
  assert.match(workflow,/this was not a deployed source/);
});

test('gate checks out the exact deployed SHA before running the dedicated production browser test',()=>{
  assert.match(workflow,/ref: \$\{\{ steps\.deployed\.outputs\.source_sha \}\}/);
  assert.match(workflow,/WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow,/python scripts\/media-affiliate-browser-smoke\.py/);
  assert.match(browser,/document\.querySelectorAll\('\[data-affiliate-station\]'\)\.length===39/);
  assert.match(browser,/search\(driver,'Greeneville'\)/);
  assert.match(browser,/search\(driver,'Columbia'\)/);
  assert.match(browser,/search\(driver,'102\.3'\)/);
  assert.match(browser,/driver\.set_window_size\(390,844\)/);
});

test('gate has tight permissions and a short timeout',()=>{
  assert.match(workflow,/permissions:\n  contents: read\n  actions: read/);
  assert.match(workflow,/timeout-minutes: 8/);
  assert.doesNotMatch(workflow,/contents: write/);
});
