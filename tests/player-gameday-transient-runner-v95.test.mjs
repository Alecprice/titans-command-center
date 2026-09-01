import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runner=fs.readFileSync(new URL('../scripts/player-gameday-browser-smoke-resilient.py',import.meta.url),'utf8');
const strict=fs.readFileSync(new URL('../scripts/player-gameday-browser-smoke.py',import.meta.url),'utf8');
const workflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');

test('Player Game Day resilient runner retries only bounded broad startup network failures',()=>{
  assert.match(runner,/MAX_ATTEMPTS\s*=\s*2/);
  assert.match(runner,/MIN_TRANSIENT_ASSET_FAILURES\s*=\s*5/);
  assert.match(runner,/net::ERR_FAILED/);
  assert.match(runner,/net::ERR_CERT_VERIFIER_CHANGED/);
  assert.match(runner,/STARTUP_STAGES\s*=\s*\{'player:find', 'roster:stability'\}/);
  assert.match(runner,/if str\(report\.get\('pageText'\) or ''\)\.strip\(\):\s*\n\s*return False/);
  assert.match(runner,/len\(transient_asset_failures\(report\)\) >= MIN_TRANSIENT_ASSET_FAILURES/);
});

test('Player Game Day resilient runner executes the unchanged strict smoke and fails closed',()=>{
  assert.match(runner,/STRICT_SMOKE = Path\(__file__\)\.with_name\('player-gameday-browser-smoke\.py'\)/);
  assert.match(runner,/subprocess\.run\(\[sys\.executable, str\(STRICT_SMOKE\)\]/);
  assert.match(runner,/return result\.returncode or 1/);
  assert.match(strict,/stage='player:find'/);
  assert.match(strict,/stage='cutdown:desktop'/);
  assert.match(strict,/stage='my53:interaction'/);
  assert.match(strict,/stage='gameday:desktop'/);
});

test('Cloudflare release uses the resilient wrapper for the Player Game Day gate',()=>{
  assert.match(workflow,/Run Player Intelligence and Game Day browser regression[\s\S]*run: python scripts\/player-gameday-browser-smoke-resilient\.py/);
});
