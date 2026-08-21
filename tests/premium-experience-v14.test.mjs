import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('premium layer prioritizes what matters now and media access',()=>{
  const js=read('premium-experience-v14.js');
  assert.match(js,/What matters right now/);
  assert.match(js,/LISTEN \/ WATCH/);
  assert.match(js,/What changed/);
  assert.match(js,/QUICK READ/);
  assert.match(js,/href="#media"/);
});

test('plain-English football glossary covers core advanced terms',()=>{
  const js=read('premium-experience-v14.js');
  for(const term of ['EPA','CPOE','Success rate','Pressure rate','WPA','YAC','Target share','Snap share','Rest days'])assert.match(js,new RegExp(term));
  assert.match(js,/Football terms, without the homework/);
  assert.match(js,/Stats, made simple/i);
});

test('365 seasonal context covers major NFL calendar modes',()=>{
  const js=read('premium-experience-v14.js');
  for(const phase of ['DRAFT SEASON','FREE AGENCY','OFFSEASON','TRAINING CAMP','PRESEASON','REGULAR SEASON','PLAYOFF PUSH'])assert.match(js,new RegExp(phase));
  assert.match(js,/dataset\.v14Season/);
});

test('premium UI remains mobile and reduced-motion friendly',()=>{
  const css=read('premium-experience-v14.css');
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});

test('premium assets are loaded and precached',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/premium-experience-v14\.css\?v=1/);
  assert.match(html,/premium-experience-v14\.js\?v=1/);
  assert.match(sw,/titans-cc-brand-2026-v35/);
  assert.match(sw,/premium-experience-v14\.css/);
  assert.match(sw,/premium-experience-v14\.js/);
});
