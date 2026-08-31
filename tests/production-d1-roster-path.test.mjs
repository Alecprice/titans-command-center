import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('production audit accepts only D1 or audited Stats Lab roster paths',()=>{
  const audit=read('scripts/production-regression.mjs');
  const preseason=read('src/preseason-api.mjs');

  assert.match(preseason,/rosterMode='d1-snapshot'/);
  assert.match(preseason,/rosterSource='Tennessee Titans official roster \/ transaction snapshot · Cloudflare D1'/);
  assert.match(audit,/statsRosterMode==='d1-snapshot'\|\|statsRosterMode==='audited-fallback'/);
  assert.match(audit,/Stats Lab D1 roster provenance is unclear/);
  assert.doesNotMatch(audit,/statsRosterMode==='live-database'/);
});
