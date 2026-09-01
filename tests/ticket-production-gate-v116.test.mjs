import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Cloudflare release blocks later browser gates on Ticket Center health',async()=>{
  const [deploy,quality]=await Promise.all([read('.github/workflows/cloudflare-deploy.yml'),read('.github/workflows/quality.yml')]);
  assert.match(deploy,/- name: Run Ticket Center browser regression[\s\S]*id: tickets_browser[\s\S]*if: steps\.market_browser\.outcome == 'success'[\s\S]*python scripts\/tickets-browser-smoke\.py/);
  assert.match(deploy,/- name: Run Command Intelligence browser regression[\s\S]*if: steps\.tickets_browser\.outcome == 'success'/);
  assert.match(quality,/scripts\/tickets-browser-smoke\.py/);
});

test('deployment status identifies and preserves Ticket Center browser evidence',async()=>{
  const deploy=await read('.github/workflows/cloudflare-deploy.yml');
  assert.match(deploy,/TICKETS_BROWSER_OUTCOME: \$\{\{ steps\.tickets_browser\.outcome \}\}/);
  assert.match(deploy,/Ticket Center browser regression \$\{TICKETS_BROWSER_OUTCOME:-not-run\}/);
  assert.match(deploy,/full production \+ browser \+ media \+ market \+ tickets \+ command intelligence/);
  assert.match(deploy,/\/tmp\/tickets-browser-smoke\.json/);
  assert.match(deploy,/## Ticket Center browser regression/);
});

test('Ticket Center smoke accepts live comparison or truthful official fallback without requiring paid providers',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/mode:center\.querySelector\('\.tickets-comparison-board'\)\?'comparison':'fallback'/);
  assert.match(smoke,/expected_fallback_games/);
  assert.match(smoke,/if status in \('final','bye'\):continue/);
  assert.match(smoke,/if game\.get\('dateTbd'\) is True/);
  assert.match(smoke,/kickoff is not None and kickoff>now/);
  assert.match(smoke,/fallback rendered non-upcoming games/);
  assert.match(smoke,/fixed-date fallback card missed its game-specific official link/);
});

test('Ticket Center smoke exercises filters and mobile usability without opening checkout links',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/for value,side in \[\('home','VS'\),\('away','AT'\)\]/);
  assert.match(smoke,/driver\.set_window_size\(390,844\)/);
  assert.match(smoke,/control\['height'\]<44/);
  assert.match(smoke,/safe_ticket_url/);
  assert.match(smoke,/def load_route\(driver,route,attempts=2\)/);
  assert.doesNotMatch(smoke,/driver\.get\([^\n]*(?:seatgeek|ticketmaster|stubhub)/i);
});
