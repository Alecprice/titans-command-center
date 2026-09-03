import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const workflow=await readFile(new URL('../.github/workflows/media-affiliate-production.yml',import.meta.url),'utf8');
const smoke=await readFile(new URL('../scripts/media-radio-search-browser-smoke.py',import.meta.url),'utf8');

test('affiliate production gate verifies the deployed Search to Radio journey',()=>{
  assert.match(workflow,/select\(\.name == "Deploy to Cloudflare"\)/);
  assert.match(workflow,/if \[\[ "\$DEPLOY_OUTCOME" == "success" \]\]/);
  assert.match(workflow,/ref: \$\{\{ steps\.deployed\.outputs\.source_sha \}\}/);
  assert.match(workflow,/python scripts\/media-affiliate-browser-smoke\.py/);
  assert.match(workflow,/python scripts\/media-radio-search-browser-smoke\.py/);
});

test('production Search smoke covers false positives, lowercase handoff, consumption and destination UX',()=>{
  assert.match(smoke,/load_search\(driver, 'week%201'\)/);
  assert.match(smoke,/load_search\(driver, 'wikq'\)/);
  assert.match(smoke,/#media\?affiliate=WIKQ/);
  assert.match(smoke,/location\.hash === '#media'/);
  assert.match(smoke,/data-affiliate-search-input/);
  assert.match(smoke,/document\.activeElement === document\.querySelector\('\.media-affiliate-finder > summary'\)/);
  assert.match(smoke,/visibleStations.*!= 1/);
  assert.match(smoke,/scrollWidth.*clientWidth/);
});

test('production Search smoke remains production-targeted and does not duplicate affiliate data',()=>{
  assert.match(smoke,/WORKER_URL/);
  assert.doesNotMatch(smoke,/WIKQ.*103\.1.*Greeneville/s);
  assert.doesNotMatch(smoke,/STATIONS\s*=|affiliate registry|localStorage|sessionStorage/);
});
