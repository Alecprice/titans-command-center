import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync('scripts/tickets-browser-smoke.py','utf8');
const trace=fs.readFileSync('scripts/tickets-browser-smoke-trace-v158.py','utf8');
const workflow=fs.readFileSync('.github/workflows/ticket-full-smoke-diagnostic-v158.yml','utf8');

test('v158 traces the unchanged production smoke instead of replacing its waits',()=>{
  assert.match(trace,/TARGET=Path\(__file__\)\.with_name\('tickets-browser-smoke\.py'\)/);
  assert.match(trace,/ORIGINAL_UNTIL=WebDriverWait\.until/);
  assert.match(trace,/runpy\.run_path\(str\(TARGET\),run_name='__main__'\)/);
  assert.match(trace,/value=ORIGINAL_UNTIL\(self,method,message\)/);
  assert.doesNotMatch(trace,/self\._timeout\s*=/);
  assert.doesNotMatch(trace,/time\.sleep\(/);

  const eightSecondWaits=[...smoke.matchAll(/WebDriverWait\(driver,8,poll_frequency=\.1\)/g)];
  assert.ok(eightSecondWaits.length>=10,`expected established 8-second Ticket waits, found ${eightSecondWaits.length}`);
  assert.match(smoke,/card\.contains\(document\.activeElement\)/);
});

test('v158 timeout evidence names the exact original callsite and Ticket owner state',()=>{
  for(const token of [
    'TICKET_SMOKE_WAIT_TIMEOUT_V158',
    "'callsite':site",
    "'browser':browser_snapshot(self._driver)",
    "'severeLogs':severe_logs(self._driver)",
    'compareConvergenceV156',
    'settle149',
    'rehydrate155',
    'compareAuthorityV156',
    'compareSavedV156',
    'ticketFinalistsView',
    'ticketFinalistsBudget',
    'ticketSignalFocus',
    'ticketTenxBudget'
  ]) assert.ok(trace.includes(token),`missing diagnostic contract: ${token}`);
});

test('v158 production diagnostic only traces the exact deployed revision',()=>{
  assert.match(workflow,/workflows: \['Titans Cloudflare Deploy'\]/);
  assert.match(workflow,/select\(\.name == "Deploy to Cloudflare"\)/);
  assert.match(workflow,/ref: \$\{\{ steps\.deployed\.outputs\.source_sha \}\}/);
  assert.match(workflow,/https:\/\/titans\.alecjprice\.com\/build-meta\.json/);
  assert.match(workflow,/\[\[ "\$DEPLOYED_SHA" == "\$EXPECTED_SHA" \]\]/);
  assert.match(workflow,/python scripts\/tickets-browser-smoke-trace-v158\.py/);
  assert.doesNotMatch(workflow,/continue-on-error:\s*true/);
});
