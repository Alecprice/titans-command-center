import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('freshness production smoke validates rendered truth states on desktop and mobile',()=>{
  const smoke=read('scripts/freshness-browser-smoke.py');
  assert.match(smoke,/DATA FRESHNESS/);
  assert.match(smoke,/Live source check/);
  assert.match(smoke,/Checking snapshot age…/);
  assert.match(smoke,/Recent server snapshot/);
  assert.match(smoke,/Roster snapshot needs review/);
  assert.match(smoke,/Verified backup ·/);
  assert.match(smoke,/Roster verified/);
  assert.match(smoke,/verified roster backup audited/);
  assert.match(smoke,/\('recent','stale','unknown','fallback'\)/);
  assert.match(smoke,/within the last 48 hours/);
  assert.match(smoke,/more than 48 hours old/);
  assert.match(smoke,/backend jargon leaked into fan freshness UI/);
  assert.match(smoke,/null roster timestamp was coerced to epoch time/);
  assert.match(smoke,/set_window_size\(390,844\)/);
  assert.match(smoke,/horizontal overflow/);
  assert.match(smoke,/titans:v10Onboarded/);
  assert.match(smoke,/\/tmp\/freshness-browser-smoke\.json/);
});

test('Cloudflare deploy blocks account and later gates on rendered freshness',()=>{
  const deploy=read('.github/workflows/cloudflare-deploy.yml');
  assert.match(deploy,/id: freshness_browser/);
  assert.match(deploy,/python scripts\/freshness-browser-smoke\.py/);
  assert.match(deploy,/if: steps\.runtime_365_browser\.outcome == 'success'/);
  assert.match(deploy,/if: steps\.freshness_browser\.outcome == 'success'/);
  assert.match(deploy,/FRESHNESS_BROWSER_OUTCOME/);
  assert.match(deploy,/Data freshness browser regression/);
  assert.match(deploy,/data freshness browser regression/);
  assert.match(deploy,/\/tmp\/freshness-browser-smoke\.json/);
});
