import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const script=fs.readFileSync(new URL('../scripts/market-browser-smoke.py',import.meta.url),'utf8');
const quality=fs.readFileSync(new URL('../.github/workflows/quality.yml',import.meta.url),'utf8');
const deploy=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');

test('market production smoke covers live API rows, filters, alternates and mobile safety',()=>{
  assert.match(script,/\/api\/market-data/);
  assert.match(script,/live-provider/);
  assert.match(script,/providerValidation/);
  assert.match(script,/#mh-event-filter/);
  assert.match(script,/#mh-book-filter/);
  assert.match(script,/#mh-alt-toggle/);
  assert.match(script,/horizontal overflow/);
  assert.match(script,/44px mobile target/);
  assert.match(script,/SEVERE/);
});

test('quality gate syntax-checks the market browser regression',()=>{
  assert.match(quality,/scripts\/market-browser-smoke\.py/);
});

test('Cloudflare deployment runs and records the live market browser regression',()=>{
  assert.match(deploy,/id: market_browser/);
  assert.match(deploy,/python scripts\/market-browser-smoke\.py/);
  assert.match(deploy,/MARKET_BROWSER_OUTCOME/);
  assert.match(deploy,/Live market browser regression/);
  assert.match(deploy,/\/tmp\/market-browser-smoke\.json/);
  assert.match(deploy,/steps\.market_browser\.outcome == 'success'/);
});
