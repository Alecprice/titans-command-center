import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/runtime-365-production.yml', 'utf8');
const smoke = readFileSync('scripts/runtime-365-browser-smoke.py', 'utf8');

test('Runtime 365 production gate is exact-release and canonical', () => {
  assert.match(workflow, /name: Titans Runtime 365 Production Gate/);
  assert.match(workflow, /workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow, /github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(workflow, /WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow, /EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow, /ref: \$\{\{ env\.EXPECTED_SHA \}\}/);
  assert.match(workflow, /meta\?\.commit\|\|null/);
  assert.match(workflow, /observed===expected/);
  assert.match(workflow, /runtime-365-audit=\$\{attempt\}/);
  assert.match(workflow, /Record superseded deployment/);
  assert.match(workflow, /steps\.deployed\.outcome == 'success'/);
  assert.match(workflow, /python scripts\/runtime-365-browser-smoke\.py/);
  assert.match(workflow, /path: \/tmp\/runtime-365-browser-smoke\.json/);
  assert.match(workflow, /retention-days: 14/);
});

test('Runtime 365 production smoke remains fail-closed on core experience contracts', () => {
  assert.match(smoke, /OUT=Path\('\/tmp\/runtime-365-browser-smoke\.json'\)/);
  assert.match(smoke, /Runtime missing or wrong version/);
  assert.match(smoke, /Team-time runtime contract missing/);
  assert.match(smoke, /365 integrated panel contract failed/);
  assert.match(smoke, /Shared API cache missing core rows/);
  assert.match(smoke, /Unexpected refresh epoch/);
  assert.match(smoke, /365 panel duplicated after route cycle/);
  assert.match(smoke, /Mobile horizontal overflow/);
  assert.match(smoke, /Mobile 365 card target too small/);
  assert.match(smoke, /Mobile five-action dock targets invalid/);
  assert.match(smoke, /severe_logs/);
  assert.match(smoke, /result\['ok'\]=True/);
});
