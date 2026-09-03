import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const smoke=readFileSync(new URL('../scripts/runtime-365-browser-smoke.py',import.meta.url),'utf8');
const mode=readFileSync(new URL('../mode-365-v19.js',import.meta.url),'utf8');
const premium=readFileSync(new URL('../premium-experience-v14.js',import.meta.url),'utf8');

test('home 365 composition keeps Premium and Season Lens ownership aligned',()=>{
  assert.match(mode,/desiredMode=\(\)=>document\.querySelector\('\.v14-now'\)\?'season-lens':'full'/);
  assert.match(mode,/regular:\['standings','changes'\]/);
  assert.match(mode,/section\.dataset\.v19Mode=integrated\?'season-lens':'full'/);
  assert.match(premium,/box\.className='v14-now'/);
  assert.match(premium,/<small>TEAM STATUS<\/small>/);
});

test('production smoke waits for the intended integrated two-card contract without extending its SLA',()=>{
  assert.match(smoke,/def wait_365_panel\(driver,timeout=15,expected_mode='season-lens'\):/);
  assert.match(smoke,/expected==='season-lens'&&\(!now\|\|mode!=='season-lens'\|\|cards\.length!==2\|\|!text\.includes\('SEASON LENS'\)\)/);
  assert.match(smoke,/expected==='full'&&\(mode!=='full'\|\|cards\.length!==4\)/);
  assert.doesNotMatch(smoke,/timeout=30/);
});

test('regular-season integrated readiness preserves status, standings, and change truth',()=>{
  assert.match(smoke,/standings:read\('\.v19-365-grid','AFC SOUTH'\)/);
  assert.match(smoke,/changes:read\('\.v19-365-grid','WHAT CHANGED\?'\)/);
  assert.match(smoke,/teamStatus:read\('\.v14-now-grid','TEAM STATUS'\)/);
  assert.match(smoke,/if mode=='season-lens':/);
  assert.match(smoke,/Regular-season season-lens changes readiness is incomplete/);
  assert.match(smoke,/Regular-season home team-status readiness is incomplete/);
  assert.match(smoke,/Availability fallback overclaims certainty/);
});

test('production failures expose the active home and 365 composition',()=>{
  assert.match(smoke,/def home_state\(driver\):/);
  for(const field of ['homeNow','panelMode','panelCards','panelLabels','panelText']){
    assert.match(smoke,new RegExp(field));
  }
  assert.match(smoke,/if d is not None: result\['desktopState'\]=home_state\(d\)/);
  assert.match(smoke,/if m is not None: result\['mobileState'\]=mobile_state\(m\)/);
});
