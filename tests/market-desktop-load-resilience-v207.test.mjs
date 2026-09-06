import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/market-browser-smoke.py',import.meta.url),'utf8');

test('Market Pulse retries only the initial desktop TimeoutException once before accepting state',()=>{
  assert.match(smoke,/TimeoutException/);
  assert.match(smoke,/def load_desktop_market\(driver\):/);
  assert.match(smoke,/while attempts<2:/);
  assert.match(smoke,/except TimeoutException:/);
  assert.match(smoke,/if attempts>=2:\s*raise/s);
  assert.match(smoke,/summary=read_summary\(driver\)/);
  assert.match(smoke,/warnings=severe_logs\(driver\)/);
  assert.match(smoke,/if summary is not None or warnings:\s*raise/s);
  assert.match(smoke,/result\['desktopLoadAttempts'\]=load_desktop_market\(driver\)/);
});

test('Market Pulse load recovery leaves all strict semantic and mobile gates in place',()=>{
  assert.match(smoke,/stage='desktop:truth'/);
  assert.match(smoke,/assert_truthful_state\(summary,'desktop'\)/);
  assert.match(smoke,/stage='desktop:filters'/);
  assert.match(smoke,/stage='desktop:refresh'/);
  assert.match(smoke,/stage='mobile:layout'/);
  assert.match(smoke,/if too_small:raise RuntimeError/);
  assert.match(smoke,/Mobile market row escapes viewport/);
  assert.match(smoke,/stage='console'/);
  assert.match(smoke,/Market browser console errors/);
  assert.doesNotMatch(smoke,/except Exception:\s*if attempts/s);
});
