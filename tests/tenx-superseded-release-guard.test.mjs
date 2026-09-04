import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const controller = fs.readFileSync('.github/workflows/tenx-automerge.yml', 'utf8');

test('TENX controller does not post-verify a release superseded while Cloudflare was running', () => {
  const mainRead = controller.indexOf('current_main_sha="$(gh api "repos/${GITHUB_REPOSITORY}/git/ref/heads/main"');
  const supersededGuard = controller.indexOf('if [[ "$current_main_sha" != "$merge_sha" ]]');
  const postDeployDispatch = controller.indexOf('actions/workflows/tenx-postdeploy-verification.yml/dispatches');

  assert.ok(mainRead >= 0, 'controller must re-read authoritative main after Cloudflare completes');
  assert.ok(supersededGuard > mainRead, 'controller must compare current main to the deployed merge SHA');
  assert.ok(postDeployDispatch > supersededGuard, 'supersession guard must run before post-deploy dispatch');
  assert.match(controller, /superseded by newer main .* before verification dispatch/);
  assert.match(controller, /current_main_sha.*!=.*merge_sha/);
});
