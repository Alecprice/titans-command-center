import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const deploy=readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');
const current=readFileSync(new URL('../.github/workflows/current-experience-browser.yml',import.meta.url),'utf8');

test('Current Experience keeps normal workflow_run and gains exact-SHA workflow_dispatch',()=>{
  assert.match(current,/workflow_run:/);
  assert.match(current,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(current,/workflow_dispatch:/);
  assert.match(current,/expected_sha:/);
  assert.match(current,/required: true/);
  assert.match(current,/EXPECTED_SHA: \$\{\{ inputs\.expected_sha \|\| github\.event\.workflow_run\.head_sha \}\}/);
  assert.match(current,/ref: \$\{\{ inputs\.expected_sha \|\| github\.event\.workflow_run\.head_sha \}\}/);
});

test('Current Experience publishes status for the exact audited SHA in either trigger mode',()=>{
  assert.match(current,/sha: process\.env\.EXPECTED_SHA/);
  assert.match(current,/current-experience-\$\{\{ inputs\.expected_sha \|\| github\.event\.workflow_run\.head_sha \}\}/);
  assert.doesNotMatch(current,/sha: context\.payload\.workflow_run\.head_sha/);
});

test('workflow-dispatched Cloudflare releases explicitly hand off to Current Experience',()=>{
  assert.match(deploy,/actions: write/);
  assert.match(deploy,/github\.event_name == 'workflow_dispatch'/);
  assert.match(deploy,/actions\/workflows\/current-experience-browser\.yml\/dispatches/);
  assert.match(deploy,/inputs:\{expected_sha:\$expected_sha\}/);
  assert.match(deploy,/--arg expected_sha "\$GITHUB_SHA"/);
  assert.match(deploy,/Dispatched Titans Current Experience Audit for deployed SHA/);
});

test('postdeploy dispatch remains gated by the full production browser chain',()=>{
  for(const id of [
    'quality','deploy','frontdoor','smoke','fan_events_smoke','browser','media_browser','market_browser',
    'tickets_browser','command_browser','player_gameday_browser','ask_browser','change_browser',
    'runtime_365_browser','freshness_browser','account_browser','analytics_browser','headshot_browser'
  ]){
    assert.match(deploy,new RegExp(`steps\\.${id}\\.outcome == 'success'`));
  }
  assert.match(deploy,/steps\.source_guard\.outputs\.current == 'true'/);
});

test('postdeploy handoff uses only repository token and no new long-lived secret',()=>{
  assert.match(deploy,/GH_TOKEN: \$\{\{ github\.token \}\}/);
  assert.doesNotMatch(deploy,/TENX_AUTOMERGE_TOKEN/);
  assert.doesNotMatch(deploy,/PERSONAL_ACCESS_TOKEN/);
  assert.doesNotMatch(deploy,/GH_PAT/);
});
