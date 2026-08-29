import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('degraded Advanced Analytics retry meets the global 44px touch floor',()=>{
  const css=read('analytics-hub.css');
  const js=read('analytics-hub.js');
  assert.match(js,/id="ah-retry">Try again<\/button>/);
  assert.match(css,/#ah-retry\{min-height:44px\}/);
});

test('verified fallback freshness stays fan-readable and does not expose backend implementation jargon',()=>{
  const js=read('freshness-truth-v20.js');
  assert.match(js,/Verified backup ·/);
  assert.match(js,/Live roster updates are temporarily unavailable/);
  assert.doesNotMatch(js,/Neon|DATABASE_URL|database degraded/i);
});
