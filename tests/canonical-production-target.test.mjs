import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');

test('production deploy verifies the canonical front door while retaining the Worker rollback path',()=>{
  assert.match(workflow,/PRODUCTION_URL:\s*https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow,/name: Verify canonical front door and Worker rollback path/);
  assert.match(workflow,/id: frontdoor/);
  assert.match(workflow,/CUSTOM_DOMAIN_URL:\s*\$\{\{\s*env\.PRODUCTION_URL\s*\}\}/);
  assert.match(workflow,/ORIGIN_URL:\s*\$\{\{\s*steps\.deploy\.outputs\.deployment-url\s*\}\}/);
  assert.match(workflow,/node scripts\/custom-domain-regression\.mjs/);
  assert.match(workflow,/if: steps\.frontdoor\.outcome == 'success'/);
  assert.match(workflow,/FRONTDOOR_OUTCOME:\s*\$\{\{\s*steps\.frontdoor\.outcome\s*\}\}/);
});

test('post-deploy production and browser gates use the canonical hostname',()=>{
  const directAssignments=[...workflow.matchAll(/WORKER_URL:\s*\$\{\{\s*steps\.deploy\.outputs\.deployment-url\s*\}\}/g)];
  assert.equal(directAssignments.length,0,'post-deploy gates must not bypass the canonical front door');

  const canonicalAssignments=[...workflow.matchAll(/WORKER_URL:\s*\$\{\{\s*env\.PRODUCTION_URL\s*\}\}/g)];
  assert.equal(canonicalAssignments.length,14,'production plus all browser regressions, including Ticket Center, must use the canonical hostname');
  assert.match(workflow,/Run Ticket Center browser regression[\s\S]*WORKER_URL:\s*\$\{\{\s*env\.PRODUCTION_URL\s*\}\}/);
  assert.match(workflow,/EXPECTED_SHA:\s*\$\{\{\s*github\.sha\s*\}\}/);
});

test('deployment status records both canonical and rollback endpoints',()=>{
  assert.match(workflow,/Canonical front door: \$\{FRONTDOOR_OUTCOME:-not-run\}/);
  assert.match(workflow,/Production URL: \$PRODUCTION_URL/);
  assert.match(workflow,/Rollback Worker URL: \$ORIGIN_URL/);
  assert.match(workflow,/## Canonical front door regression/);
  assert.match(workflow,/\/tmp\/custom-domain-smoke\.json/);
});
