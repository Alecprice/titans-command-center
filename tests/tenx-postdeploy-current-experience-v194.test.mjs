import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const runtime365=readFileSync(new URL('../scripts/runtime-365-diagnostic.py',import.meta.url),'utf8');
const mobileNav=readFileSync(new URL('../scripts/mobile-navigation-browser-smoke.py',import.meta.url),'utf8');
const legacy=readFileSync(new URL('../scripts/legacy-browser-smoke.py',import.meta.url),'utf8');

test('TENX 365 diagnostic follows the active full or season-lens contract',()=>{
  assert.match(runtime365,/dataset\.v19Mode\|\|'full'/);
  assert.match(runtime365,/mode==='season-lens'\?2:4/);
  assert.match(runtime365,/count===expected/);
  assert.doesNotMatch(runtime365,/querySelectorAll\('\.v19-365-grid>a'\)\.length===4/);
});

test('TENX mobile navigation diagnostic treats the five-action dock as the mobile owner',()=>{
  assert.match(mobileNav,/if\(!dock\|\|!more\|\|!game\|\|!search\)return null/);
  assert.match(mobileNav,/desktop menu should be hidden when mobile dock owns navigation/);
  assert.match(mobileNav,/len\(state\['targets'\]\)!=5/);
  assert.match(mobileNav,/x\['h'\]<44 or x\['w'\]<44/);
  assert.doesNotMatch(mobileNav,/menu unreachable at/);
});

test('TENX Legacy resume verifies the routed Finder match instead of stale controller text',()=>{
  assert.match(legacy,/location\.hash\.includes\('trail=1999-run'\)/);
  assert.match(legacy,/location\.hash\.includes\('step=2'\)/);
  assert.match(legacy,/querySelector\('\[data-legacy-trail-player\]:not\(\[hidden\]\)'\)/);
  assert.match(legacy,/querySelectorAll\('\.legacy-finder-match'\)/);
  assert.match(legacy,/Steve McNair/);
  assert.match(legacy,/passport_after_resume\.get\('visited'\)!=\['1999-run:0','1999-run:1','1999-run:2'\]/);
});
