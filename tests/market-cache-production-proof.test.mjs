import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('production audit proves a bounded warm market cache HIT',()=>{
  const pkg=JSON.parse(read('package.json'));
  const script=read('scripts/market-cache-production-regression.mjs');
  assert.equal(pkg.scripts['audit:production'],'node scripts/production-regression.mjs');
  assert.match(pkg.scripts['postaudit:production'],/health-content-audit-production-regression\.mjs/);
  assert.match(pkg.scripts['postaudit:production'],/market-cache-production-regression\.mjs/);
  assert.match(script,/fetch\(`\$\{base\}\/api\/market-data`,\{/);
  assert.doesNotMatch(script,/\/api\/market-data\?/);
  assert.match(script,/x-titans-edge-cache/i);
  assert.match(script,/\['HIT','MISS'\]/);
  assert.match(script,/attempt<=4/);
  assert.match(script,/current\.edgeCache==='HIT'/);
  assert.match(script,/market-cache-production-smoke\.json/);
  assert.match(script,/mergeProductionReport\('marketEdgeCache',result\)/);
});
