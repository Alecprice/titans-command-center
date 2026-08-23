import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Ask Titans 2.0 assets load after the stable Fan Hub layer',()=>{
  const html=read('index.html');
  assert.match(html,/ask-titans-v17\.css/);
  const base=html.indexOf('/fan-enrichment-v13.js?v=1'),ask=html.indexOf('/ask-titans-v17.js?v=1');
  assert.ok(base>=0&&ask>base);
});

test('Ask Titans 2.0 answers from internal structured APIs only',()=>{
  const js=read('ask-titans-v17.js');
  for(const route of ['/api/data','/api/fan-intel','/api/espn-scoreboard'])assert.match(js,new RegExp(route.replaceAll('/','\\/')));
  assert.doesNotMatch(js,/fetch\(['"]https?:\/\//);
  assert.match(js,/Structured-data answer engine/);
});

test('Ask Titans covers core fan intents with evidence and next actions',()=>{
  const js=read('ask-titans-v17.js');
  for(const token of ['nextGameAnswer','watchAnswer','standingsAnswer','injuryAnswer','moveAnswer','depthAnswer','playerAnswer','liveAnswer','changedAnswer','favoriteAnswer','metricAnswer'])assert.match(js,new RegExp(`function ${token}`));
  assert.match(js,/WHY IT MATTERS/);
  assert.match(js,/SOURCE \+ FRESHNESS/);
  assert.match(js,/supporting facts, source, and freshness/i);
});

test('Ask Titans refuses unsupported certainty and missing-data zero claims',()=>{
  const js=read('ask-titans-v17.js');
  assert.match(js,/I will not guess a kickoff or opponent/);
  assert.match(js,/does not mean the roster has zero injuries/);
  assert.match(js,/not treating missing stats as zero production/);
  assert.match(js,/prefers saying “I do not have that data” over inventing an answer/);
  assert.match(js,/not a medical diagnosis or guarantee/);
});

test('Ask Titans keeps advanced metrics explanatory instead of grading players',()=>{
  const js=read('ask-titans-v17.js');
  for(const metric of ['EPA','WPA','CPOE','Success rate','Pressure rate'])assert.match(js,new RegExp(metric));
  assert.match(js,/Advanced metrics are context tools, not standalone player grades/);
});

test('Ask Titans re-resolves the live result host after async hydration',()=>{
  const js=read('ask-titans-v17.js');
  assert.match(js,/const token=\+\+state\.serial/);
  assert.match(js,/await load\(\)/);
  assert.match(js,/token!==state\.serial\|\|route\(\)!=='fan'/);
  assert.match(js,/upgrade\(\);/);
  assert.match(js,/const liveOut=document\.querySelector\('\.v17-ask \[data-v17-result\]'\)/);
  assert.match(js,/!liveOut\|\|!liveOut\.isConnected/);
  assert.match(js,/liveOut\.innerHTML=renderAnswer/);
  assert.doesNotMatch(js,/await load\(\);if\(route\(\)!=='fan'\|\|!document\.querySelector\('\.v17-ask'\)\)return;\s*out\.innerHTML/);
});

test('Ask Titans uses a narrow two-level observer strategy',()=>{
  const js=read('ask-titans-v17.js');
  assert.match(js,/state\.viewObserver\.observe\(view,\{childList:true,subtree:false\}\)/);
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(js,/observe\(app,\{childList:true,subtree:true\}\)/);
});

test('Ask Titans remains mobile first and reduced-motion friendly',()=>{
  const css=read('ask-titans-v17.css');
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});

test('Ask Titans production smoke gates the real fantasy handoff and carried selections',()=>{
  const smoke=read('scripts/ask-titans-browser-smoke.py');
  assert.match(smoke,/Should I start Decision Smoke A or Decision Smoke B\?/);
  assert.match(smoke,/data-fantasy-ask-bridge/);
  assert.match(smoke,/No projection generated/);
  assert.match(smoke,/find_element\(By\.CSS_SELECTOR/);
  assert.match(smoke,/location\.hash==='#fantasy'/);
  assert.match(smoke,/selectedOptions\[0\]/);
  assert.match(smoke,/Decision Smoke A/);
  assert.match(smoke,/Decision Smoke B/);
  assert.match(smoke,/fantasy-handoff:mobile/);
  assert.match(smoke,/actionHeight/);
});

test('Ask Titans browser smoke closes first-run onboarding before real click interactions',()=>{
  const smoke=read('scripts/ask-titans-browser-smoke.py');
  assert.match(smoke,/def prepare_returning_user\(driver\):/);
  assert.match(smoke,/titans:v10Onboarded/);
  assert.match(smoke,/v10-modal-backdrop/);
  assert.match(smoke,/not d\.find_elements\(By\.CSS_SELECTOR,'#v10-onboarding,\.v10-modal-backdrop'\)/);
  assert.match(smoke,/driver\.get\(f'\{BASE\}\/\#fan'\)\n    prepare_returning_user\(driver\)/);
});
