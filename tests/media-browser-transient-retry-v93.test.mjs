import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/media-browser-smoke.py',import.meta.url),'utf8');

test('Listen Watch smoke retries only a bounded broad same-origin asset failure',()=>{
  assert.match(smoke,/SHELL_LOAD_ATTEMPTS = 2/);
  assert.match(smoke,/TRANSIENT_ASSET_FAILURE_THRESHOLD = 4/);
  assert.match(smoke,/def broad_transient_asset_failures\(entries\):/);
  assert.match(smoke,/BASE in message and 'Failed to load resource: net::ERR_FAILED' in message/);
  assert.match(smoke,/attempt < SHELL_LOAD_ATTEMPTS and len\(broad\) >= TRANSIENT_ASSET_FAILURE_THRESHOLD/);
  assert.match(smoke,/driver\.get\('about:blank'\)/);
});

test('Listen Watch smoke still fails closed after the bounded retry',()=>{
  assert.match(smoke,/raise\n    raise RuntimeError\(f'Unable to load shell after \{SHELL_LOAD_ATTEMPTS\} attempts'\)/);
  assert.match(smoke,/shell = load_shell\(driver, '#home'/);
  assert.match(smoke,/shell = load_shell\(driver, '#media'/);
  assert.match(smoke,/transientShellAssetFailures/);
  assert.match(smoke,/transientShellWarnings/);
});

test('transient startup errors are consumed before the final console gate',()=>{
  assert.match(smoke,/warnings = browser_warnings\(driver\)/);
  assert.match(smoke,/severe = \[x for x in warnings if x\.get\('level'\) == 'SEVERE'\]/);
  assert.match(smoke,/Media browser console has severe errors/);
});
