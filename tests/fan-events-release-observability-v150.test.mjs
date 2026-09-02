import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');
const setup=fs.readFileSync(new URL('../docs/FAN_EVENTS_PROVIDER_SETUP.md',import.meta.url),'utf8');

const indexOf=needle=>{
  const index=workflow.indexOf(needle);
  assert.ok(index>=0,`missing workflow contract: ${needle}`);
  return index;
};

test('Cloudflare deploy accepts the active Fan Event Radar secrets without reviving Bandsintown',()=>{
  for(const key of ['EVENTBRITE_PRIVATE_TOKEN','EVENTBRITE_ORGANIZATION_IDS','SKIDDLE_API_KEY']){
    assert.match(workflow,new RegExp(`${key}: \\${{ secrets\\.${key} }}`));
    assert.match(workflow,new RegExp(`'${key}'`));
  }
  assert.match(workflow,/echo "eventbrite=true"/);
  assert.match(workflow,/echo "skiddle=true"/);
  assert.doesNotMatch(workflow,/BANDSINTOWN_API_KEY|BANDSINTOWN_ARTISTS/);
});

test('Worker secret bundle remains optional and never prints credential values',()=>{
  assert.match(workflow,/const value = String\(process\.env\[key\] \|\| ''\)\.trim\(\);/);
  assert.match(workflow,/if \(value\) secrets\[key\] = value;/);
  assert.match(workflow,/without printing values/);
  assert.doesNotMatch(workflow,/echo[^\n]*(?:\$EVENTBRITE_PRIVATE_TOKEN|\$SKIDDLE_API_KEY)/);
  assert.doesNotMatch(workflow,/console\.log\([^\n]*(?:EVENTBRITE_PRIVATE_TOKEN|SKIDDLE_API_KEY)[^\n]*process\.env/);
});

test('Fan Event Radar production truth gates browser regressions without duplicating provider traffic in the browser',()=>{
  const production=indexOf('- name: Run production regression audit');
  const fanEvents=indexOf('- name: Run Fan Event Radar production regression');
  const selenium=indexOf('- name: Install Selenium for browser regressions');
  const browser=indexOf('- name: Run browser navigation stress test');
  assert.ok(production<fanEvents&&fanEvents<selenium&&selenium<browser);
  assert.match(workflow,/id: fan_events_smoke/);
  assert.match(workflow,/node scripts\/fan-events-production-regression\.mjs \| tee \/tmp\/fan-events-production-smoke\.json/);
  assert.match(workflow,/set -o pipefail/);
  assert.match(workflow,/Install Selenium for browser regressions[\s\S]*if: steps\.fan_events_smoke\.outcome == 'success'/);
  assert.match(workflow,/Run browser navigation stress test[\s\S]*if: steps\.fan_events_smoke\.outcome == 'success'/);
});

test('deployment status distinguishes GitHub secret availability from runtime provider truth',()=>{
  assert.match(workflow,/EVENTBRITE_READY: \$\{\{ steps\.creds\.outputs\.eventbrite \}\}/);
  assert.match(workflow,/SKIDDLE_READY: \$\{\{ steps\.creds\.outputs\.skiddle \}\}/);
  assert.match(workflow,/FAN_EVENTS_SMOKE_OUTCOME: \$\{\{ steps\.fan_events_smoke\.outcome \}\}/);
  assert.match(workflow,/Fan event GitHub-managed secrets available: Eventbrite=/);
  assert.match(workflow,/Fan Event Radar production regression:/);
  assert.match(workflow,/deployed \+ Fan Event Radar production regression/);
  assert.match(workflow,/## Fan Event Radar production regression/);
});

test('provider runbook preserves direct Worker secrets and explains the independent runtime check',()=>{
  assert.match(setup,/Direct Worker secrets remain a supported production path/);
  assert.match(setup,/Only non-empty GitHub Actions values are placed into the deployment `--secrets-file`/);
  assert.match(setup,/Wrangler preserves existing Worker secrets that are omitted from that file/);
  assert.match(setup,/A `false` value there does not prove the Worker lacks a directly configured secret/);
  assert.match(setup,/authoritative runtime check remains `GET \/api\/fan-events`/);
  assert.match(setup,/main Cloudflare deploy plus the standalone \*\*Fan Events Production Gate\*\*/);
});
