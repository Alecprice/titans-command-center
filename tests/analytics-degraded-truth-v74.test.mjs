import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const regression=fs.readFileSync(new URL('../scripts/advanced-analytics-regression.mjs',import.meta.url),'utf8');
const browser=fs.readFileSync(new URL('../scripts/analytics-browser-smoke.py',import.meta.url),'utf8');

test('advanced analytics production audit stays strict when Neon is healthy',()=>{
  assert.match(regression,/healthStatus==='healthy'\|\|healthStatus==='degraded'/);
  assert.match(regression,/Healthy analytics check requires a healthy database/);
  assert.match(regression,/Advanced analytics warehouse coverage is too small/);
  assert.match(regression,/No recent play contains down\/distance/);
  assert.match(regression,/analyticsMode='live-database'/);
});

test('advanced analytics outage is accepted only alongside a proven Neon degradation',()=>{
  assert.match(regression,/if\(healthStatus==='degraded'\)/);
  assert.match(regression,/Degraded analytics check must preserve the failed database signal/);
  assert.match(regression,/response\.status===500/);
  assert.match(regression,/data\?\.error==='Advanced analytics query failed'/);
  assert.match(regression,/analyticsMode='database-unavailable'/);
  assert.doesNotMatch(regression,/if\(response\.status===500\)process\.exit\(0\)/);
});

test('browser smoke keeps core Stats Lab usable and shows retry instead of fake warehouse metrics',()=>{
  assert.match(browser,/if health_status == 'degraded':/);
  assert.match(browser,/advanced-analytics-hub \.ah-error/);
  assert.match(browser,/Advanced analytics could not load\./);
  assert.match(browser,/Advanced analytics query failed/);
  assert.match(browser,/retryHeight.*44/);
  assert.match(browser,/metricCount.*0/);
  assert.match(browser,/coreStats/);
  assert.match(browser,/mode': 'database-unavailable'/);
});
