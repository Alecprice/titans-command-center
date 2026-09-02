import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('../runtime-v19.js',import.meta.url),'utf8');
const home=fs.readFileSync(new URL('../home-command-v123.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('TENX home command layer is loaded fail-soft after the shared runtime is ready',()=>{
  assert.match(runtime,/window\.TitansRuntime=\{/);
  assert.match(runtime,/import\('\.\/home-command-v123\.js'\)\.catch/);
  assert.match(home,/if\(window\.__TitansHomeCommandV123\)return/);
  assert.match(home,/if\(!runtime\|\|!app\)return/);
});

test('TENX home screen uses canonical schedule truth and the shared API cache',()=>{
  assert.match(home,/runtime\.apiJson\('\/api\/data',\{ttl:30000,force\}\)/);
  assert.match(home,/runtime\.scheduleFocus\?\.\(games\)/);
  assert.match(home,/runtime\.formatTeamKickoff\?\.\(game\.date\)/);
  assert.doesNotMatch(home,/\bfetch\(/);
});

test('TENX home screen stays route-scoped and mounts directly after the existing hero',()=>{
  assert.match(home,/if\(route\(\)!=='home'\)return/);
  assert.match(home,/app\.querySelector\('\.fan-hero'\)/);
  assert.match(home,/hero\.insertAdjacentElement\('afterend',root\)/);
  assert.match(home,/aria-labelledby','home-command-v123-title'/);
});

test('TENX home launchpad exposes the highest-intent fan destinations',()=>{
  for(const hash of ['#tickets','#media','#fantasy','#roster','#stats','#legacy'])assert.match(home,new RegExp(hash));
  assert.match(home,/aria-label="Fan launchpad"/);
  assert.match(home,/What do you want to do next\?/);
});

test('TENX home game focus changes its primary actions with fan context',()=>{
  assert.match(home,/state==='game-window'/);
  assert.match(home,/game\?\.homeAway==='home'/);
  assert.match(home,/label:'Find tickets'/);
  assert.match(home,/label:'Watch \/ Listen'/);
  assert.match(home,/label:'Open Game Day'/);
});

test('TENX home screen keeps mobile controls thumb-ready and motion-respectful',()=>{
  assert.match(home,/@media\(max-width:760px\)/);
  assert.match(home,/min-height:44px/);
  assert.match(home,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(home,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(home,/focus-visible/);
});

test('TENX home screen escapes dynamic API-backed strings before HTML insertion',()=>{
  assert.match(home,/const esc=value=>/);
  assert.match(home,/esc\(matchup\)/);
  assert.match(home,/esc\(description\)/);
  assert.match(home,/meta\.map\(item=>`<span>\$\{esc\(item\)\}<\/span>`\)/);
});

test('TENX home command ships with the offline PWA shell and a refreshed cache generation',()=>{
  assert.match(sw,/titans-cc-brand-2026-v80/);
  assert.match(sw,/'\/runtime-v19\.js', '\/home-command-v123\.js'/);
  assert.match(sw,/'\/legacy-heritage-v3\.js'/);
});
