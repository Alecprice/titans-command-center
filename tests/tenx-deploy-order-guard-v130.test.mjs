import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow=fs.readFileSync('.github/workflows/cloudflare-deploy.yml','utf8');

test('TENX Cloudflare deploys queue instead of cancelling one another',()=>{
  assert.match(workflow,/concurrency:\s*\n\s*group: titans-cloudflare-production\s*\n\s*cancel-in-progress: false/);
});

test('TENX Cloudflare deploy verifies its source is still current main before publishing',()=>{
  assert.match(workflow,/name: Verify deployment source is current main/);
  assert.match(workflow,/id: source_guard/);
  assert.match(workflow,/git fetch origin main/);
  assert.match(workflow,/CURRENT_MAIN_SHA="\$\(git rev-parse origin\/main\)"/);
  assert.match(workflow,/if \[\[ "\$GITHUB_SHA" == "\$CURRENT_MAIN_SHA" \]\]/);
  assert.match(workflow,/echo "current=true" >> "\$GITHUB_OUTPUT"/);
  assert.match(workflow,/echo "current=false" >> "\$GITHUB_OUTPUT"/);
});

test('TENX stale deploy events cannot build secrets or deploy to Cloudflare',()=>{
  const guarded="steps.source_guard.outputs.current == 'true'";
  const occurrences=workflow.split(guarded).length-1;
  assert.ok(occurrences>=2,'both secret bundle and deploy steps should require current main');
  assert.match(workflow,/stale deploy source skipped; current main is/);
  assert.match(workflow,/Source still current main/);
});
