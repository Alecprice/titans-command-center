import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../scripts/account-browser-smoke.py',import.meta.url),'utf8');

test('Account smoke retries a real sheet click until the account panel actually mounts',()=>{
  assert.match(source,/TimeoutException/);
  assert.match(source,/def open_account_from_sheet\(driver,attempts=3\):/);
  assert.match(source,/button\.click\(\)/);
  assert.match(source,/WebDriverWait\(driver,2,poll_frequency=\.1\)\.until\(lambda d:d\.find_elements\(By\.CSS_SELECTOR,'\.account-panel'\)\)/);
  assert.match(source,/ElementClickInterceptedException,ElementNotInteractableException,StaleElementReferenceException,TimeoutException/);
  assert.match(source,/raise RuntimeError\('account entry did not open account panel'\)/);
});

test('Account smoke still validates the complete panel after the confirmed open',()=>{
  assert.match(source,/stage='open-account';entry=open_account_from_sheet\(d\)/);
  assert.match(source,/stage='wait-account-panel';panel=wait_account_panel\(d\)/);
  assert.match(source,/Continue as guest/);
  assert.match(source,/guest-portability-tools/);
  assert.match(source,/simulate-auth-outage/);
});
