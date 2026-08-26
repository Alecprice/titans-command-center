import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/market-browser-smoke.py',import.meta.url),'utf8');

test('Market Pulse filter smoke changes live select values without holding stale Selenium option refs',()=>{
  assert.match(smoke,/def select_values\(driver,selector\):/);
  assert.match(smoke,/def set_select_value\(driver,selector,value\):/);
  assert.match(smoke,/el\.dispatchEvent\(new Event\('change',\{bubbles:true\}\)\)/);
  assert.doesNotMatch(smoke,/select\.select_by_index\(1\)/);
  assert.doesNotMatch(smoke,/select\.options\[1\]\.get_attribute/);
});

test('Market Pulse filter smoke still reacquires controls after rerender before reading results',()=>{
  assert.match(smoke,/wait_settled\(driver\);stable_select_element\(driver,selector\);after=read_summary\(driver\)/);
  assert.match(smoke,/stable_select_element\(driver,selector\)\n    if not set_select_value\(driver,selector,'all'\)/);
});
