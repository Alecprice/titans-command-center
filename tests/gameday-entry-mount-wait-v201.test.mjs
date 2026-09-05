import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/gameday-browser-smoke-v186.py',import.meta.url),'utf8');

test('Game Day production smoke waits for the async entry enhancement when the home guide exists',()=>{
  assert.match(smoke,/if driver\.execute_script\("return Boolean\(document\.querySelector\('\.v22-home-guide'\)\)"\):/);
  assert.match(smoke,/guide\?\.querySelector\('\.v185-entry-ready'\)/);
  assert.match(smoke,/entry&&entry\.querySelectorAll\('a'\)\.length>=3/);
  assert.match(smoke,/WebDriverWait\(driver,15,poll_frequency=\.1\)/);
});

test('Game Day production smoke keeps the strict mobile entry truth and safety contracts',()=>{
  assert.match(smoke,/two hours before kickoff/);
  assert.match(smoke,/screenshots and pdf printouts are not accepted/);
  assert.match(smoke,/len\(state\['links'\]\)<3/);
  assert.match(smoke,/item\['height'\]<48/);
  assert.match(smoke,/item\['target'\]!='_blank'/);
  assert.match(smoke,/'noopener' not in \(item\['rel'\] or ''\)/);
  assert.match(smoke,/\/tickets\/mobile-tickets\//);
  assert.match(smoke,/\/fans\/mobile-app\//);
  assert.match(smoke,/\/stadium\/policies/);
  assert.match(smoke,/state\['overflow'\]/);
});
