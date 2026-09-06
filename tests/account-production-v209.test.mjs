import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflow = await readFile(new URL('../.github/workflows/account-production.yml', import.meta.url), 'utf8');
const smoke = await readFile(new URL('../scripts/account-browser-smoke.py', import.meta.url), 'utf8');

test('Account production gate is exact-release and canonical', () => {
  assert.match(workflow, /workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow, /branches: \[main\]/);
  assert.match(workflow, /WORKER_URL: https:\/\/titans\.alecjprice\.com/);
  assert.match(workflow, /EXPECTED_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/);
  assert.match(workflow, /ref: \$\{\{ env\.EXPECTED_SHA \}\}/);
  assert.match(workflow, /meta\?\.commit\|\|null/);
  assert.match(workflow, /if: steps\.deployed\.outcome != 'success'/);
  assert.match(workflow, /if: steps\.deployed\.outcome == 'success'/);
  assert.match(workflow, /python scripts\/account-browser-smoke\.py/);
  assert.match(workflow, /path: \/tmp\/account-browser-smoke\.json/);
  assert.match(workflow, /retention-days: 14/);
});

test('Account release gate promotes the deterministic mobile/guest smoke without weakening it', () => {
  assert.match(smoke, /def driver_for\(width=390,height=844\):/);
  assert.match(smoke, /Emulation\.setDeviceMetricsOverride/);
  assert.match(smoke, /Account browser viewport mismatch/);
  assert.match(smoke, /wait_guest_tools/);
  assert.match(smoke, /wait_password_control/);
  assert.match(smoke, /browserWarnings/);
  assert.match(smoke, /SEVERE/);
  assert.match(smoke, /\/tmp\/account-browser-smoke\.json/);
});
