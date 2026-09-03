import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const controller = fs.readFileSync('.github/workflows/tenx-automerge.yml', 'utf8');
const verification = fs.readFileSync('.github/workflows/tenx-postdeploy-verification.yml', 'utf8');

test('TENX auto-merge dispatches exact-sha postdeploy verification after production deploy', () => {
  assert.match(controller, /cloudflare-deploy\.yml\/dispatches/);
  assert.match(controller, /tenx-postdeploy-verification\.yml\/dispatches/);
  assert.match(controller, /inputs\[source_sha\].*head_sha/);
  assert.ok(
    controller.indexOf('cloudflare-deploy.yml/dispatches') < controller.indexOf('tenx-postdeploy-verification.yml/dispatches'),
    'production deploy must be dispatched before the verification waiter'
  );
});

test('TENX postdeploy verification is manual-dispatch only and pins the tested revision', () => {
  assert.match(verification, /workflow_dispatch:/);
  assert.doesNotMatch(verification, /pull_request_target:/);
  assert.doesNotMatch(verification, /workflow_run:/);
  assert.match(verification, /source_sha:/);
  assert.match(verification, /required: true/);
  assert.match(verification, /ref: \$\{\{ inputs\.source_sha \}\}/);
  assert.match(verification, /SOURCE_SHA: \$\{\{ inputs\.source_sha \}\}/);
  assert.match(verification, /build-meta\.json\?tenx=/);
  assert.match(verification, /last === expected/);
});

test('TENX postdeploy verification preserves Current Experience and post-deploy coverage', () => {
  for (const script of [
    'runtime-365-diagnostic.py',
    'smart-search-browser-smoke.py',
    'mobile-navigation-browser-smoke.py',
    'fantasy-browser-smoke.py',
    'fantasy-decision-browser-smoke.py',
    'legacy-browser-smoke.py',
    'browser-navigation-smoke.py',
    'media-browser-smoke.py',
    'market-browser-smoke.py',
    'command-intelligence-browser-smoke.py',
    'player-gameday-browser-smoke-resilient.py',
    'ask-titans-browser-smoke.py',
    'change-intelligence-browser-smoke.py',
    'runtime-365-browser-smoke.py',
    'freshness-browser-smoke.py',
    'account-browser-smoke.py',
    'analytics-browser-smoke-resilient.py',
    'headshot-browser-smoke.py',
    'responsive-matrix-smoke.py',
    'readability-browser-smoke.py',
  ]) {
    assert.match(verification, new RegExp(script.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(verification, /continue-on-error: true/);
  assert.match(verification, /TENX Current Experience \/ Post-Deploy/);
  assert.match(verification, /Fail closed when any verification check failed/);
});
