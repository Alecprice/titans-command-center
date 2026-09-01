import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('analytics resilient wrapper only retries renderer timeouts during route-load stages',()=>{
  const py=read('scripts/analytics-browser-smoke-resilient.py');
  assert.match(py,/MAX_ATTEMPTS = 2/);
  assert.match(py,/ROUTE_LOAD_STAGES = \{'desktop:load-stats', 'mobile:resize', 'mobile:degraded-analytics'\}/);
  assert.match(py,/RENDERER_TIMEOUT_MARKER = 'timed out receiving message from renderer'/);
  assert.match(py,/report\.get\('ok'\) is not False/);
  assert.match(py,/lowered\.startswith\('timeoutexception:'\)/);
  assert.match(py,/attempt < MAX_ATTEMPTS and retryable_renderer_load_timeout\(report\)/);
  assert.match(py,/retrying the unchanged strict smoke once/);
  assert.match(py,/return result\.returncode or 1/);
});

test('release uses resilient analytics wrapper while preserving the strict diagnostic report',()=>{
  const workflow=read('.github/workflows/cloudflare-deploy.yml');
  assert.match(workflow,/Run advanced analytics browser regression[\s\S]*?run: python scripts\/analytics-browser-smoke-resilient\.py/);
  assert.doesNotMatch(workflow,/Run advanced analytics browser regression[\s\S]*?run: python scripts\/analytics-browser-smoke\.py/);
  assert.match(workflow,/\/tmp\/analytics-browser-smoke\.json/);
});

test('quality gate syntax-checks strict and resilient analytics smokes',()=>{
  const workflow=read('.github/workflows/quality.yml');
  assert.match(workflow,/scripts\/analytics-browser-smoke\.py/);
  assert.match(workflow,/scripts\/analytics-browser-smoke-resilient\.py/);
});
