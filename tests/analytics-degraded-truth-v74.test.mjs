import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const regression=fs.readFileSync(new URL('../scripts/advanced-analytics-regression.mjs',import.meta.url),'utf8');
const browser=fs.readFileSync(new URL('../scripts/analytics-browser-smoke.py',import.meta.url),'utf8');
const api=fs.readFileSync(new URL('../src/advanced-analytics-api.mjs',import.meta.url),'utf8');
const production=fs.readFileSync(new URL('../cloudflare/production-worker.mjs',import.meta.url),'utf8');

test('advanced analytics production audit treats a verified D1 snapshot as authoritative even when legacy health is degraded',()=>{
  assert.match(regression,/healthStatus==='healthy'\|\|healthStatus==='degraded'/);
  assert.match(regression,/const analyticsAvailable=response\.status===200&&data\?\.ok===true&&data\?\.status==='available'/);
  assert.match(regression,/data\?\.storage==='cloudflare-d1'/);
  assert.match(regression,/data\.snapshot\.source==='nflreadpy-d1-snapshot'/);
  assert.match(regression,/Advanced analytics warehouse coverage is too small/);
  assert.match(regression,/No recent play contains down\/distance/);
  assert.match(regression,/analyticsMode=snapshotStale\?'cloudflare-d1-stale':'cloudflare-d1'/);
  assert.doesNotMatch(regression,/Healthy analytics check requires a healthy database/);
});

test('advanced analytics outage remains explicit quiet non-cacheable and does not fabricate metrics',()=>{
  assert.match(regression,/if\(!analyticsAvailable\)/);
  assert.match(regression,/Unavailable analytics response unexpectedly claims ok=true/);
  assert.match(regression,/data\?\.available===false/);
  assert.match(regression,/data\?\.status==='database-unavailable'/);
  assert.match(regression,/data\?\.error==='Advanced analytics query failed'/);
  assert.match(regression,/Unavailable analytics response must not fabricate a summary/);
  assert.match(regression,/Unavailable analytics response must not be cached/);
  assert.match(regression,/analyticsMode='database-unavailable'/);
  assert.doesNotMatch(regression,/if\(response\.status===500\)process\.exit\(0\)/);
});

test('analytics API is D1-only and owns its stale plus unavailable behavior directly',()=>{
  assert.match(api,/readApiSnapshot\(env,snapshotKey\)/);
  assert.match(api,/allowExpired:true/);
  assert.match(api,/Fresh analytics snapshot unavailable; serving last D1 snapshot\./);
  assert.match(api,/hasD1\(env\)/);
  assert.match(api,/res\.setHeader\('Cache-Control','no-store'\)/);
  assert.match(api,/res\.status\(200\)\.json\(\{/);
  assert.match(api,/ok:false/);
  assert.match(api,/available:false/);
  assert.match(api,/status:'database-unavailable'/);
  assert.match(api,/summary:null/);
  assert.match(api,/weeks:\[\]/);
  assert.match(api,/league:\[\]/);
  assert.match(api,/recentPlays:\[\]/);
  assert.match(api,/byDown:\[\]/);
  assert.match(api,/personnel:\[\]/);
  assert.match(api,/error:'Advanced analytics query failed'/);
  assert.doesNotMatch(api,/getSql|DATABASE_URL|writeApiSnapshot|team_week_metrics|\bfrom plays\b|neon-advanced-analytics/i);
  assert.doesNotMatch(production,/d1WarehouseFallback|Database not configured/);
});

test('browser smoke follows actual analytics availability instead of global legacy health',()=>{
  assert.match(browser,/def read_analytics\(\):/);
  assert.match(browser,/analytics_available = analytics\.get\('ok'\) is True and analytics\.get\('status'\) == 'available'/);
  assert.match(browser,/analytics\.get\('storage'\) != 'cloudflare-d1'/);
  assert.match(browser,/snapshot\.get\('source'\) != 'nflreadpy-d1-snapshot'/);
  assert.match(browser,/if not analytics_available:/);
  assert.match(browser,/advanced-analytics-hub \.ah-error/);
  assert.match(browser,/Advanced analytics could not load\./);
  assert.match(browser,/Advanced analytics query failed/);
  assert.match(browser,/retryHeight.*44/);
  assert.match(browser,/metricCount.*0/);
  assert.match(browser,/coreStats/);
  assert.match(browser,/mode = 'cloudflare-d1-stale' if snapshot\.get\('stale'\) else 'cloudflare-d1'/);
});
