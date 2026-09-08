import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const workflow=readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');
const headshot=readFileSync(new URL('../scripts/headshot-production-regression.mjs',import.meta.url),'utf8');

function ordered(...needles){
  let previous=-1;
  for(const needle of needles){
    const index=workflow.indexOf(needle);
    assert.ok(index>previous,`Expected ${needle} after previous release gate`);
    previous=index;
  }
}

test('Cloudflare release exposes each server-side production gate instead of hiding npm lifecycle scripts',()=>{
  assert.doesNotMatch(workflow,/npm run audit:production/);
  ordered(
    'id: smoke',
    'run: node scripts/production-regression.mjs',
    'id: regular_season_smoke',
    'run: node scripts/regular-season-production-regression.mjs',
    'id: health_content_smoke',
    'run: node scripts/health-content-audit-production-regression.mjs',
    'id: market_cache_smoke',
    'run: node scripts/market-cache-production-regression.mjs',
    'id: analytics_api_smoke',
    'run: node scripts/advanced-analytics-regression.mjs',
    'id: headshot_production_smoke',
    'run: node scripts/headshot-production-regression.mjs',
    'id: fan_events_smoke'
  );
  assert.match(workflow,/if: steps\.headshot_production_smoke\.outcome == 'success'\n\s+env:\n\s+PRODUCTION_URL/);
});

test('deployment status names the exact production gate that failed',()=>{
  for(const marker of [
    'REGULAR_SEASON_OUTCOME: ${{ steps.regular_season_smoke.outcome }}',
    'HEALTH_CONTENT_OUTCOME: ${{ steps.health_content_smoke.outcome }}',
    'MARKET_CACHE_OUTCOME: ${{ steps.market_cache_smoke.outcome }}',
    'ANALYTICS_API_OUTCOME: ${{ steps.analytics_api_smoke.outcome }}',
    'HEADSHOT_PRODUCTION_OUTCOME: ${{ steps.headshot_production_smoke.outcome }}',
    'deployed + core production regression',
    'deployed + regular-season production regression',
    'deployed + health content production regression',
    'deployed + market cache production regression',
    'deployed + advanced analytics API production regression',
    'deployed + player headshot production regression'
  ])assert.ok(workflow.includes(marker),`Missing release truth marker: ${marker}`);
  assert.match(workflow,/Core production regression: \$\{SMOKE_OUTCOME:-not-run\}/);
  assert.match(workflow,/Player headshot production regression: \$\{HEADSHOT_PRODUCTION_OUTCOME:-not-run\}/);
});

test('stale queued deploys identify themselves as safe no-ops rather than production proof',()=>{
  assert.match(workflow,/- name: Record stale deploy no-op/);
  assert.match(workflow,/steps\.source_guard\.outputs\.current != 'true'/);
  assert.match(workflow,/No Worker deployment or production\/browser regression was performed by this run\./);
  assert.match(workflow,/This is a safe no-op, not production verification\./);
  assert.match(workflow,/cancel-in-progress: false/);
});

test('headshot production audit retries only bounded transport failures',()=>{
  assert.match(headshot,/const transientCodes=new Set\(\['ECONNRESET','ETIMEDOUT','EAI_AGAIN','ENETUNREACH','EHOSTUNREACH'\]\)/);
  assert.match(headshot,/for\(let attempt=1;attempt<=2;attempt\+\+\)/);
  assert.match(headshot,/if\(attempt>=2\|\|!isTransientTransport\(error\)\)throw error/);
  assert.equal((headshot.match(/return await fetch\(/g)||[]).length,1);
  assert.doesNotMatch(headshot,/response\.status\s*>?=\s*500[^]*fetchAudit/);
  assert.match(headshot,/assert\(manifestResponse\.ok,`Headshot manifest returned \$\{manifestResponse\.status\}`\)/);
  assert.match(headshot,/transportRetries/);
});
