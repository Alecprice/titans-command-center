import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../scripts/account-browser-smoke.py',import.meta.url),'utf8');

test('Account smoke retries the real More control until the sidebar is actually settled open',()=>{
  assert.match(source,/def open_more_sheet\(driver,attempts=3\):/);
  assert.match(source,/driver\.find_element\(By\.ID,'mobile-more-button'\)\.click\(\)/);
  assert.match(source,/return wait_sheet_settled\(driver,timeout=2\)/);
  assert.match(source,/ElementClickInterceptedException,ElementNotInteractableException,StaleElementReferenceException,TimeoutException/);
  assert.match(source,/More button did not open settled sidebar/);
});

test('All Account smoke entry paths use the verified More helper',()=>{
  assert.match(source,/if not opened:\n\s+open_more_sheet\(driver\)/);
  assert.match(source,/stage='open-more';stage='wait-more';sheet=open_more_sheet\(d\)/);
  assert.doesNotMatch(source,/stage='open-more';d\.find_element\(By\.ID,'mobile-more-button'\)\.click\(\)/);
});
