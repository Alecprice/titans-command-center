import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');
const regression=fs.readFileSync(new URL('../scripts/fan-events-production-regression.mjs',import.meta.url),'utf8');
const setup=fs.readFileSync(new URL('../docs/FAN_EVENTS_PROVIDER_SETUP.md',import.meta.url),'utf8');

test('primary Cloudflare release accepts optional GitHub-managed Eventbrite and Skiddle inputs',()=>{
  assert.match(workflow,/EVENTBRITE_PRIVATE_TOKEN: \$\{\{ secrets\.EVENTBRITE_PRIVATE_TOKEN \}\}/);
  assert.match(workflow,/EVENTBRITE_ORGANIZATION_IDS: \$\{\{ secrets\.EVENTBRITE_ORGANIZATION_IDS \}\}/);
  assert.match(workflow,/SKIDDLE_API_KEY: \$\{\{ secrets\.SKIDDLE_API_KEY \}\}/);
  for(const key of ['EVENTBRITE_PRIVATE_TOKEN','EVENTBRITE_ORGANIZATION_IDS','SKIDDLE_API_KEY']){
    assert.ok(workflow.indexOf(`'${key}'`)>workflow.indexOf('Build Worker secret bundle'),`${key} missing from Worker secret bundle`);
  }
  assert.match(workflow,/if \(value\) secrets\[key\] = value/);
  assert.match(workflow,/without printing values/);
  assert.doesNotMatch(workflow,/echo\s+["']?\$EVENTBRITE_PRIVATE_TOKEN|echo\s+["']?\$SKIDDLE_API_KEY/);
});

test('credential diagnostics distinguish GitHub inputs from actual production configuration',()=>{
  assert.match(workflow,/eventbrite_github=true/);
  assert.match(workflow,/eventbrite_orgs_github=true/);
  assert.match(workflow,/skiddle_github=true/);
  assert.match(workflow,/GitHub-managed fan-event secret inputs:/);
  assert.match(workflow,/direct Worker secrets may also exist/);
  assert.doesNotMatch(workflow,/Fan event providers configured:.*EVENTBRITE_GITHUB_READY/);
});

test('Fan Event Radar contract blocks browser gates without weakening the existing production audit',()=>{
  const smoke=workflow.indexOf('id: smoke');
  const fanEvents=workflow.indexOf('id: fan_events');
  const selenium=workflow.indexOf('Install Selenium for browser regressions');
  const browser=workflow.indexOf('id: browser');
  assert.ok(smoke>=0&&fanEvents>smoke&&selenium>fanEvents&&browser>selenium);
  assert.match(workflow,/id: fan_events[\s\S]*if: steps\.smoke\.outcome == 'success'[\s\S]*node scripts\/fan-events-production-regression\.mjs/);
  assert.match(workflow,/Install Selenium for browser regressions[\s\S]*if: steps\.fan_events\.outcome == 'success'/);
  assert.match(workflow,/id: browser[\s\S]*if: steps\.fan_events\.outcome == 'success'/);
});

test('deployment status cannot claim full success when Fan Event Radar production truth fails',()=>{
  assert.match(workflow,/FAN_EVENTS_OUTCOME: \$\{\{ steps\.fan_events\.outcome \}\}/);
  assert.match(workflow,/elif \[\[ "\$FAN_EVENTS_OUTCOME" != "success" \]\]; then STATUS="deployed \+ Fan Event Radar production regression/);
  assert.match(workflow,/Fan Event Radar production regression: \$\{FAN_EVENTS_OUTCOME:-not-run\}/);
  assert.match(workflow,/full production \+ fan events \+ browser/);
  assert.match(workflow,/\/tmp\/fan-events-production-smoke\.json/);
});

test('production evidence reports sanitized configured and provider health state',()=>{
  assert.match(regression,/const REPORT_PATH='\/tmp\/fan-events-production-smoke\.json'/);
  assert.match(regression,/configuredProviders/);
  assert.match(regression,/providerHealth/);
  assert.match(regression,/writeReport\(result\)/);
  assert.match(regression,/writeReport\(\{ok:false,endpoint:ENDPOINT,error:message/);
  for(const marker of ['EVENTBRITE_PRIVATE_TOKEN','EVENTBRITE_OAUTH_TOKEN','SKIDDLE_API_KEY','TICKETMASTER_API_KEY'])assert.match(regression,new RegExp(marker));
  assert.match(regression,/response leaked secret marker/);
  assert.match(regression,/event URL contains provider credentials/);
});

test('setup guide preserves direct Worker secret ownership and makes GitHub management optional',()=>{
  assert.match(setup,/Direct Cloudflare Worker secrets remain a supported production setup/);
  assert.match(setup,/secrets omitted from the deploy secret file are preserved/);
  assert.match(setup,/Only non-empty GitHub values are added/);
  assert.match(setup,/GitHub-managed input/);
  assert.match(setup,/does not claim the production provider is disabled/);
  assert.match(setup,/Actual provider readiness is determined after deploy by `GET \/api\/fan-events`/);
});
