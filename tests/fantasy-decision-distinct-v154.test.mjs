import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const js=read('fantasy-decision-center-v3.js');
const smoke=read('scripts/fantasy-decision-browser-smoke.py');

test('Start Sit compare owns two distinct player selections',()=>{
  assert.match(js,/function syncDistinctSelects\(a,b,prefer='a'\)/);
  assert.match(js,/for\(const opt of \[\.\.\.a\.options,\.\.\.b\.options\]\)opt\.disabled=false/);
  assert.match(js,/if\(a\.value&&a\.value===b\.value\)/);
  assert.match(js,/const keeper=prefer==='b'\?b:a,mover=prefer==='b'\?a:b/);
  assert.match(js,/find\(opt=>opt\.value!==keeper\.value\)/);
  assert.match(js,/for\(const opt of a\.options\)opt\.disabled=Boolean\(bv&&opt\.value===bv\)/);
  assert.match(js,/for\(const opt of b\.options\)opt\.disabled=Boolean\(av&&opt\.value===av\)/);
});

test('single-player Ask Fantasy handoff cannot create a self comparison',()=>{
  assert.match(js,/const pending=pendingMatches\(candidates\);if\(pending\[0\]\)a\.value=pending\[0\]\.id;if\(pending\[1\]\)b\.value=pending\[1\]\.id;syncDistinctSelects\(a,b,'a'\)/);
  assert.match(js,/Choose two different players/);
  assert.match(js,/if\(pa\.id===pb\.id\)\{out\.innerHTML='<div class="fdc-compare"><div class="fdc-verdict">Choose two different players to compare loaded evidence\.<\/div><\/div>';return\}/);
});

test('each selector change preserves the fan choice and reconciles the opposite side first',()=>{
  assert.match(js,/a\.addEventListener\('change',\(\)=>\{syncDistinctSelects\(a,b,'a'\);draw\(\)\}\)/);
  assert.match(js,/b\.addEventListener\('change',\(\)=>\{syncDistinctSelects\(a,b,'b'\);draw\(\)\}\)/);
  assert.doesNotMatch(js,/selectedIndex\s*=\s*Math\.random/);
});

test('production Fantasy decision smoke gates Ask collisions and duplicate recovery',()=>{
  assert.match(smoke,/titans-fantasy-pending-question-v1','Should I start Decision Smoke B\?'/);
  assert.match(smoke,/disabled:\[\.\.\.s\.options\]\.filter\(o=>o\.disabled\)\.map\(o=>o\.value\)/);
  assert.match(smoke,/def assert_distinct\(state,label\):/);
  assert.match(smoke,/if a\['value'\]==b\['value'\]: raise RuntimeError/);
  assert.match(smoke,/if b\['value'\] not in a\['disabled'\] or a\['value'\] not in b\['disabled'\]: raise RuntimeError/);
  assert.match(smoke,/def force_duplicate_then_read\(driver\):/);
  assert.match(smoke,/a\.value=b\.value;a\.dispatchEvent\(new Event\('change',\{bubbles:true\}\)\)/);
  assert.match(smoke,/assert_distinct\(recovered,'Duplicate recovery'\)/);
});

test('distinct selection repair keeps the existing truth and lifecycle boundaries',()=>{
  assert.match(js,/Compare transparent evidence—not invented projections/);
  assert.match(js,/not a point projection or guarantee/);
  assert.equal((js.match(/new MutationObserver/g)||[]).length,1);
  assert.doesNotMatch(js,/localStorage\.setItem/);
  assert.doesNotMatch(js,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
  assert.match(js,/min-height:44px/);
  assert.match(js,/@media\(max-width:560px\)/);
});
