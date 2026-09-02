import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');

test('mobile app microcopy has a 12px readability floor',()=>{
  assert.match(source,/function installMobileReadabilityFloor\(\)/);
  assert.match(source,/#tcc-mobile-type-floor-v45/);
  assert.match(source,/@media \(max-width:760px\)/);
  assert.match(source,/#app small\{font-size:12px!important/);
});

test('home KPI and visual-history labels are included in the mobile floor',()=>{
  for(const selector of ['.pulse-item small','.fan-tile .tile-label','.fan-hero-brand .era-chip','.legacy-peek span','.legal-mark-note','.home-quality-strip span']){
    assert.ok(source.includes(`#app ${selector}`),`missing mobile floor selector ${selector}`);
  }
});

test('mobile data-health microcopy uses the same readable floor',()=>{
  for(const selector of ['.roster-summary-strip span','.fan-health-item small','.warehouse-health-head>span','.warehouse-health-card span','.source-quality-meta span']){
    assert.ok(source.includes(`#app ${selector}`),`missing mobile floor selector ${selector}`);
  }
});
