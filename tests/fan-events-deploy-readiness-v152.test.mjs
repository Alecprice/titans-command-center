import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');
const production=fs.readFileSync(new URL('../scripts/fan-events-production-regression.mjs',import.meta.url),'utf8');
const setup=fs.readFileSync(new URL('../docs/FAN_EVENTS_PROVIDER_SETUP.md',import.meta.url),'utf8');

test('primary Cloudflare deploy can optionally stage current Fan Event provider secrets',()=>{
  assert.match(workflow,/EVENTBRITE_PRIVATE_TOKEN: \$\{\{ secrets\.EVENTBRITE_PRIVATE_TOKEN \}\}/);
  assert.match(workflow,/EVENTBRITE_ORGANIZATION_IDS: \$\{\{ secrets\.EVENTBRITE_ORGANIZATION_IDS \}\}/);
  assert.match(workflow,/SKIDDLE_API_KEY: \$\{\{ secrets\.SKIDDLE_API_KEY \}\}/);
  for(const key of ['EVENTBRITE_PRIVATE_TOKEN','EVENTBRITE_ORGANIZATION_IDS','SKIDDLE_API_KEY']){
    assert.match(workflow,new RegExp(`'${key}'`));
  }
  assert.match(workflow,/const value = String\(process\.env\[key\] \|\| ''\)\.trim\(\);\s*if \(value\) secrets\[key\] = value;/);
  assert.match(workflow,/without printing values/);
});

test('GitHub secret staging is not mislabeled as runtime provider readiness',()=>{
  assert.match(workflow,/eventbrite_github=true/);
  assert.match(workflow,/skiddle_github=true/);
  assert.match(workflow,/Fan Event secrets staged in GitHub:/);
  assert.match(workflow,/Fan Event runtime readiness: see the production regression evidence below/);
  assert.match(workflow,/direct Worker secrets may be configured even when GitHub staging is false/);
  assert.doesNotMatch(workflow,/Fan Event providers configured: Eventbrite=\$\{EVENTBRITE_GITHUB_READY/);
});

test('Fan Events production contract blocks the browser release chain',()=>{
  const productionAudit=workflow.indexOf('- name: Run production regression audit');
  const fanEvents=workflow.indexOf('- name: Run Fan Events production regression');
  const selenium=workflow.indexOf('- name: Install Selenium for browser regressions');
  const browser=workflow.indexOf('- name: Run browser navigation stress test');
  assert.ok(productionAudit>=0&&fanEvents>productionAudit&&selenium>fanEvents&&browser>selenium);
  assert.match(workflow,/id: fan_events_smoke/);
  assert.match(workflow,/run: node scripts\/fan-events-production-regression\.mjs/);
  assert.match(workflow,/- name: Install Selenium for browser regressions\s+if: steps\.fan_events_smoke\.outcome == 'success'/);
  assert.match(workflow,/- name: Run browser navigation stress test\s+id: browser\s+if: steps\.fan_events_smoke\.outcome == 'success'/);
});

test('deployment status records Fan Events outcome and sanitized runtime evidence',()=>{
  assert.match(workflow,/FAN_EVENTS_OUTCOME: \$\{\{ steps\.fan_events_smoke\.outcome \}\}/);
  assert.match(workflow,/deployed \+ Fan Events production regression/);
  assert.match(workflow,/Fan Events production regression: \$\{FAN_EVENTS_OUTCOME:-not-run\}/);
  assert.match(workflow,/\/tmp\/fan-events-production-smoke\.json/);
  assert.match(workflow,/## Fan Events production regression/);
  assert.match(workflow,/full production \+ browser \+ media \+ market \+ tickets \+ command intelligence/);
  assert.match(workflow,/command intelligence \+ fan events \+ player intelligence/);
});

test('Fan Events production evidence contains readiness booleans and no provider credentials',()=>{
  assert.match(production,/const REPORT='\/tmp\/fan-events-production-smoke\.json'/);
  assert.match(production,/configuredProviders:Object\.fromEntries/);
  assert.match(production,/Boolean\(configuredProviders\[name\.toLowerCase\(\)\]\)/);
  assert.match(production,/writeReport\(report\)/);
  assert.match(production,/writeReport\(\{ok:false,endpoint:ENDPOINT,error:message,testedAt:new Date\(\)\.toISOString\(\)\}\)/);
  assert.doesNotMatch(production,/writeReport\(payload\)/);
  for(const marker of ['EVENTBRITE_PRIVATE_TOKEN','SKIDDLE_API_KEY','TICKETMASTER_API_KEY','SEATGEEK_CLIENT_ID','authorization','bearer','client_secret','access_token']){
    assert.match(production,new RegExp(marker,'i'));
  }
});

test('operator runbook preserves direct Worker secrets and makes GitHub mirroring optional',()=>{
  assert.match(setup,/Direct Cloudflare Worker secrets/);
  assert.match(setup,/Optional GitHub-managed deploy secrets/);
  assert.match(setup,/Do not duplicate a secret into GitHub merely to make the provider function/);
  assert.match(setup,/Wrangler preserves existing Worker secrets omitted from that file/);
  assert.match(setup,/staged in GitHub/);
  assert.match(setup,/runtime provider readiness/);
  assert.doesNotMatch(setup,/BANDSINTOWN_API_KEY\s+# optional/i);
});
