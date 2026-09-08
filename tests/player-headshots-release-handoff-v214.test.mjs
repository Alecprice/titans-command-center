import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = readFileSync('.github/workflows/player-headshots.yml', 'utf8');

test('player headshot refresh can dispatch the production release', () => {
  assert.match(workflow, /permissions:\s*[\s\S]*?actions:\s*write/);
  assert.match(workflow, /id:\s*commit_manifest/);
  assert.match(workflow, /changed=false/);
  assert.match(workflow, /changed=true/);
  assert.match(workflow, /if:\s*steps\.commit_manifest\.outputs\.changed == 'true'/);
  assert.match(workflow, /actions\/workflows\/cloudflare-deploy\.yml\/dispatches/);
  assert.match(workflow, /-f ref='main'/);
});

test('player headshot refresh does not dispatch a release when the manifest is unchanged', () => {
  const unchangedBranch = workflow.indexOf("echo 'changed=false'");
  const earlyExit = workflow.indexOf('exit 0', unchangedBranch);
  const dispatchStep = workflow.indexOf('Dispatch production release for refreshed manifest');

  assert.ok(unchangedBranch >= 0, 'workflow must mark unchanged manifests');
  assert.ok(earlyExit > unchangedBranch, 'unchanged manifest path must exit before commit');
  assert.ok(dispatchStep > earlyExit, 'release dispatch must be a separate conditional step');
});
