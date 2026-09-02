import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('Ticket production browser smoke now exercises the TENX saved compare lifecycle',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/def exercise_saved_compare\(driver,label,mobile=False\):/);
  assert.match(smoke,/data-ticket-tenx-save/);
  assert.match(smoke,/data-ticket-compare-v125/);
  assert.match(smoke,/data-ticket-compare-focus/);
  assert.match(smoke,/data-ticket-tenx-party=\\?"3\\?"/);
  assert.match(smoke,/data-ticket-tenx-budget=\\?"all\\?"/);
  assert.match(smoke,/data-ticket-filter=\\?"all\\?"/);
  assert.match(smoke,/viewOffersFocused/);
  assert.match(smoke,/removeLifecycle/);
  assert.match(smoke,/clearLifecycle/);
});

test('Ticket compare browser gate stays truthful when live marketplace comparison is unavailable',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/if card_count<2:/);
  assert.match(smoke,/need at least 2 live comparison cards/);
  assert.match(smoke,/elif mode=='comparison'/);
  assert.match(smoke,/if mobile_state\['mode'\]=='comparison'/);
  assert.match(smoke,/expected_fallback_games/);
  assert.match(smoke,/safe_ticket_url/);
});

test('Ticket compare browser gate is deterministic and validates mobile interaction geometry',async()=>{
  const smoke=await read('scripts/tickets-browser-smoke.py');
  assert.match(smoke,/SHORTLIST_KEY='titans:tickets-shortlist-v123'/);
  assert.match(smoke,/MEMORY_KEY='titans:tickets-price-memory-v124'/);
  assert.match(smoke,/localStorage\.removeItem\(arguments\[0\]\)/);
  assert.match(smoke,/short_actions=.*height.*<44/s);
  assert.match(smoke,/card\['right'\]>state\['viewport'\]\+1/);
  assert.match(smoke,/driver\.set_window_size\(390,844\)/);
  assert.match(smoke,/mobileViewportChecked/);
  assert.match(smoke,/before fees/i);
});

test('Ticket production gate still runs the strengthened smoke in the release chain',async()=>{
  const [deploy,quality]=await Promise.all([
    read('.github/workflows/cloudflare-deploy.yml'),
    read('.github/workflows/quality.yml')
  ]);
  assert.match(deploy,/Run Ticket Center browser regression[\s\S]*python scripts\/tickets-browser-smoke\.py/);
  assert.match(deploy,/Run Command Intelligence browser regression[\s\S]*if: steps\.tickets_browser\.outcome == 'success'/);
  assert.match(quality,/scripts\/tickets-browser-smoke\.py/);
});
