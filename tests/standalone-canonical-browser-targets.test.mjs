import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const responsiveWorkflow=fs.readFileSync(new URL('../.github/workflows/responsive-matrix.yml',import.meta.url),'utf8');
const diagnosticsWorkflow=fs.readFileSync(new URL('../.github/workflows/postdeploy-browser-diagnostics.yml',import.meta.url),'utf8');
const responsiveSmoke=fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py',import.meta.url),'utf8');

const canonical='https://titans.alecjprice.com';
const rollback='https://titans-command-center.alecjordanprice.workers.dev';

test('standalone production browser workflows exercise the canonical front door',()=>{
  for (const [name,workflow] of [
    ['responsive matrix',responsiveWorkflow],
    ['post-deploy diagnostics',diagnosticsWorkflow],
  ]) {
    assert.match(workflow,new RegExp(`WORKER_URL: ${canonical.replaceAll('.','\\.')}`),`${name} must use canonical production`);
    assert.equal(workflow.includes(`WORKER_URL: ${rollback}`),false,`${name} must not bypass CloudFront`);
    assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/,`${name} must run after the deployment workflow`);
  }
});

test('standalone workflows retain deployed-revision verification before browser evidence',()=>{
  assert.match(responsiveWorkflow,/EXPECTED_SHA:/);
  assert.match(responsiveWorkflow,/Confirm deployed SHA/);
  assert.match(diagnosticsWorkflow,/SOURCE_SHA:/);
  assert.match(diagnosticsWorkflow,/Verify source revision is live/);
});

test('manual responsive smoke defaults to canonical production',()=>{
  assert.equal(responsiveSmoke.includes(`os.environ.get('WORKER_URL','${canonical}')`),true);
  assert.equal(responsiveSmoke.includes(`os.environ.get('WORKER_URL','${rollback}')`),false);
});
