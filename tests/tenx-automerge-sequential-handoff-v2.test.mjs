import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const controller = fs.readFileSync('.github/workflows/tenx-automerge.yml', 'utf8');

test('TENX controller captures the exact Cloudflare workflow run before postdeploy dispatch', () => {
  assert.match(controller, /X-GitHub-Api-Version: 2026-03-10/);
  assert.match(controller, /deploy_dispatch_json=/);
  assert.match(controller, /workflow_run_id/);
  assert.match(controller, /actions\/runs\/\$\{deploy_run_id\}/);
});

test('TENX distinguishes the green PR head from the deployed main merge commit', () => {
  assert.match(controller, /head_sha=.*workflow_run\.head_sha/);
  assert.match(controller, /-f sha="\$head_sha"/);
  assert.match(controller, /merge_sha=.*\.sha/);
  assert.match(controller, /deploy_head_sha/);
  assert.match(controller, /expected merge commit \$\{merge_sha\}/);
  assert.match(controller, /inputs\[source_sha\]=\$\{merge_sha\}/);
});

test('TENX postdeploy verification is sequenced after successful Cloudflare completion', () => {
  const cloudflareDispatch = controller.indexOf('cloudflare-deploy.yml/dispatches');
  const completedGuard = controller.indexOf("deploy_status\" != 'completed'");
  const identityGuard = controller.indexOf('deploy_head_sha\" != \"$merge_sha');
  const successGuard = controller.indexOf("deploy_conclusion\" != 'success'");
  const postdeployDispatch = controller.indexOf('tenx-postdeploy-verification.yml/dispatches');

  assert.ok(cloudflareDispatch >= 0);
  assert.ok(completedGuard > cloudflareDispatch);
  assert.ok(identityGuard > completedGuard);
  assert.ok(successGuard > identityGuard);
  assert.ok(postdeployDispatch > successGuard);
});

test('TENX release sequencing fails closed instead of guessing with a production sleep window', () => {
  assert.match(controller, /did not return a workflow_run_id/);
  assert.match(controller, /did not complete within the controller lease/);
  assert.match(controller, /tested \$\{deploy_head_sha:-unknown\}, expected merge commit/);
  assert.match(controller, /Cloudflare run \$\{deploy_run_id\} concluded/);
  assert.doesNotMatch(controller, /tenx-postdeploy-verification\.yml\/dispatches[\s\S]{0,240}sleep/);
});
