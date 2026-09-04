import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Command Intelligence differentiator add-ons load in browser and PWA shell',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/command-intelligence-addons-v15\.css\?v=1/);
  assert.match(html,/command-intelligence-addons-v15\.js\?v=1/);
  assert.match(sw,/command-intelligence-addons-v15\.css/);
  assert.match(sw,/command-intelligence-addons-v15\.js/);
});

test('One-Minute Titans summarizes loaded facts without inventing missing injury data',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/ONE-MINUTE TITANS/);
  assert.match(js,/Five things to know right now/);
  assert.match(js,/Latest move:/);
  assert.match(js,/No current injury-report rows are loaded; that is not the same as zero injuries/);
  assert.match(js,/Top intel:/);
});

test('Position Battle Tracker is driven by depth snapshot changes',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/POSITION BATTLE TRACKER/);
  assert.match(js,/const rows=depth\(\)/);
  assert.match(js,/two depth-chart snapshots can be compared/);
  assert.match(js,/x\.from/);
  assert.match(js,/x\.to/);
});

test('Titans Knowledge Graph uses roster and feed evidence only',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/TITANS KNOWLEDGE GRAPH/);
  assert.match(js,/Same position room/);
  assert.match(js,/Same experience marker/);
  assert.match(js,/Loaded intel connections/);
  assert.match(js,/does not infer personal relationships or unseen team data/);
});

test('Play Explainer uses structured play evidence and refuses film-only causal claims',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/WHY DID THAT PLAY WORK\?/);
  assert.match(js,/Play Explainer/);
  assert.match(js,/EPA/);
  assert.match(js,/WPA/);
  assert.match(js,/coverage responsibility, blocking assignments and route concepts need trusted charting\/All-22 labels/i);
});

test('My Titans profile and smart alert preferences stay device-local',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/titans:v15MyTitans/);
  assert.match(js,/Personal fan profile/);
  assert.match(js,/Favorite player/);
  assert.match(js,/Default briefing/);
  assert.match(js,/titans:v15SmartAlerts/);
  for(const term of ['Roster moves','Injury-status changes','Depth-chart changes','Game / kickoff reminders','Press-conference updates','Milestone-watch changes'])assert.match(js,new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/True closed-app Web Push still requires the server-side subscription\/VAPID sender that is not deployed yet/);
});

test('Trip Planner uses the loaded chronological away-game schedule and does not guess live travel inventory',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/TITANS TRIP PLANNER/);
  assert.match(js,/const futureGames=\(\)=>games\(\)\.map\(game=>\(\{game,at:Date\.parse\(game\?\.date\)\}\)\)/);
  assert.match(js,/\.filter\(row=>Number\.isFinite\(row\.at\)&&row\.at>Date\.now\(\)/);
  assert.match(js,/\.sort\(\(a,b\)=>a\.at-b\.at\)/);
  assert.match(js,/futureGames\(\)\.find\(row=>row\.game\?\.homeAway==='away'\)/);
  assert.match(js,/Tickets \/ entry method/);
  assert.match(js,/Travel & parking plan/);
  assert.match(js,/Live hotel, flight, restaurant and local transit recommendations should use current travel\/business data/);
});

test('Global fan share card is opt-in and does not fabricate nearby-fan counts',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/GLOBAL FAN NETWORK · SHARE CARD/);
  assert.match(js,/Copy fan card text/);
  assert.match(js,/not a fake nearby-fan count/);
  assert.match(js,/accounts, consent, moderation and location privacy controls/);
});

test('Front Office Sandbox stores fan decisions but refuses to fake cap calculations',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/FRONT OFFICE SANDBOX/);
  for(const action of ['Keep','Release idea','Trade idea','Re-sign idea','Practice-squad idea'])assert.match(js,new RegExp(action));
  assert.match(js,/contractFor/);
  assert.match(js,/This is a roster sandbox, not a cap calculator/);
  assert.match(js,/will not invent dead money, guarantees or cap savings/);
});

test('Fan GM Score counts only saved picks that later match final game results',()=>{
  const js=read('command-intelligence-addons-v15.js');
  assert.match(js,/titans:v15PickHistory/);
  assert.match(js,/FAN GM SCORE/);
  assert.match(js,/\/final\/i\.test/);
  assert.match(js,/pick\.pick==='TEN'/);
  assert.match(js,/Only timestamped pre-kickoff picks count/);
});

test('differentiator add-ons keep a narrow observer and mobile-safe controls',()=>{
  const js=read('command-intelligence-addons-v15.js'),css=read('command-intelligence-addons-v15.css');
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
  assert.doesNotMatch(js,/observe\(app,\{childList:true,subtree:true\}\)/);
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});