import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('../accessibility-runtime.js',import.meta.url),'utf8');
const matrix=fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py',import.meta.url),'utf8');

test('mobile runtime promotes only rendered microcopy below 10px',()=>{
  assert.match(runtime,/const mobileTypeFloor=matchMedia\('\(max-width:760px\)'\)/);
  assert.match(runtime,/function enforceMobileComputedTextFloor\(\)/);
  assert.match(runtime,/querySelectorAll\('small,p,li,span'\)/);
  assert.match(runtime,/Number\.parseFloat\(getComputedStyle\(element\)\.fontSize\)/);
  assert.match(runtime,/size<10/);
  assert.match(runtime,/classList\.add\('tcc-mobile-readable-micro'\)/);
  assert.match(runtime,/\.tcc-mobile-readable-micro\{font-size:10px!important/);
});

test('desktop removes the computed mobile floor instead of changing desktop typography',()=>{
  assert.match(runtime,/if\(!mobileTypeFloor\.matches\)/);
  assert.match(runtime,/classList\.remove\('tcc-mobile-readable-micro'\)/);
  assert.match(runtime,/mobileTypeFloor\.addEventListener\?\.\('change',syncAsyncRegions\)/);
});

test('responsive matrix measures checkbox and radio labels as their real hit targets',()=>{
  assert.match(matrix,/type==='checkbox'\|\|type==='radio'/);
  assert.match(matrix,/el\.closest\('label'\)\|\|el/);
});

test('responsive matrix keeps embedded JavaScript regex safe from Python syntax warnings',()=>{
  assert.ok(matrix.includes('driver.execute_script(r"""')||matrix.includes("replace(/\\\\s+/g,' ')"));
});
