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

test('TENX postdeploy verification is sequenced after successful Cloudflare completion', () => {
  const cloudflareDispatch = controller.indexOf('cloudflare-deploy.yml/dispatches');
  const completedGuard = controller.indexOf("deploy_status\" != 'completed'");
  const successGuard = controller.indexOf("deploy_conclusion\" != 'success'");
  const postdeployDispatch = controller.indexOf('tenx-postdeploy-verification.yml/dispatches');

  assert.ok(cloudflareDispatch >= 0);
  assert.ok(completedGuard > cloudflareDispatch);
  assert.ok(successGuard > completedGuard);
  assert.ok(postdeployDispatch > successGuard);
});

test('TENX release sequencing fails closed instead of guessing with a production sleep window', () => {
  assert.match(controller, /did not return a workflow_run_id/);
  assert.match(controller, /did not complete within the controller lease/);
  assert.match(controller, /Cloudflare run \$\{deploy_run_id\} concluded/);
  assert.doesNotMatch(controller, /tenx-postdeploy-verification\.yml\/dispatches[\s\S]{0,240}sleep/);
});
