import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const regression=fs.readFileSync(new URL('../scripts/fan-events-production-regression.mjs',import.meta.url),'utf8');
const workflow=fs.readFileSync(new URL('../.github/workflows/fan-events-production.yml',import.meta.url),'utf8');

test('Fan Events production gate targets the canonical same-origin API contract',()=>{
  assert.match(regression,/https:\/\/titans\.alecjprice\.com/);
  assert.match(regression,/\/api\/fan-events/);
  assert.match(regression,/providerType==='fan-event-discovery'/);
  assert.match(regression,/region\?\.label==='Nashville, TN'/);
  assert.match(regression,/radiusMiles/);
  assert.match(regression,/lookaheadDays/);
});

test('production gate distinguishes responding providers from displayed-source contribution',()=>{
  assert.match(regression,/providersAvailable/);
  assert.match(regression,/providersContributing/);
  assert.match(regression,/providerFailures/);
  assert.match(regression,/displayedCount/);
  assert.match(regression,/contributing\.size===providersContributing/);
  assert.match(regression,/contributing provider/);
  assert.match(regression,/connected provider/);
});

test('production gate protects provider credentials and retired provider boundaries',()=>{
  for(const marker of ['EVENTBRITE_PRIVATE_TOKEN','SKIDDLE_API_KEY','TICKETMASTER_API_KEY','SEATGEEK_CLIENT_ID']){
    assert.match(regression,new RegExp(marker));
  }
  assert.match(regression,/credentialFreeUrl/);
  assert.match(regression,/client_secret/);
  assert.match(regression,/access_token/);
  assert.match(regression,/bandsintown/i);
  assert.match(regression,/retired Bandsintown provider reappeared/);
});

test('Fan Events gate follows completed main Cloudflare workflows and verifies the real deploy step',()=>{
  assert.match(workflow,/workflow_run:/);
  assert.match(workflow,/workflows: \["Titans Cloudflare Deploy"\]/);
  assert.match(workflow,/types: \[completed\]/);
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/workflow_run\.head_branch == 'main'/);
  assert.match(workflow,/Deploy to Cloudflare/);
  assert.match(workflow,/DEPLOY_OUTCOME/);
  assert.match(workflow,/should_run=true/);
  assert.doesNotMatch(workflow,/workflow_run\.conclusion == 'success'/);
});

test('Fan Events production workflow is read-only bounded and checks the exact deployed SHA',()=>{
  assert.match(workflow,/permissions:\s*\n\s*contents: read\s*\n\s*actions: read/);
  assert.match(workflow,/timeout-minutes: 10/);
  assert.match(workflow,/source_sha=\$\{WORKFLOW_HEAD_SHA\}/);
  assert.match(workflow,/ref: \$\{\{ steps\.deployed\.outputs\.source_sha \}\}/);
  assert.match(workflow,/persist-credentials: false/);
  assert.match(workflow,/node-version: '24'/);
  assert.match(workflow,/node scripts\/fan-events-production-regression\.mjs/);
  assert.doesNotMatch(workflow,/secrets\./);
  assert.doesNotMatch(workflow,/CLOUDFLARE_API_TOKEN|SKIDDLE_API_KEY|EVENTBRITE_PRIVATE_TOKEN|SEATGEEK_CLIENT_ID/);
});
