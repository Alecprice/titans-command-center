import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Command Intelligence is a first-class route and PWA asset',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/href="#command" data-route="command"/);
  assert.match(html,/Command Intel/);
  assert.match(html,/command-intelligence-v15\.css\?v=1/);
  assert.match(html,/command-search-v15\.js\?v=1/);
  assert.match(html,/command-intelligence-v15\.js\?v=1/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v\d+'/);
  for(const asset of ['command-intelligence-v15.css','command-intelligence-v15.js','command-search-v15.js'])assert.match(sw,new RegExp(asset.replaceAll('.','\\.')));
});

test('Command Intelligence keeps seven focused internal workspaces',()=>{
  const js=read('command-intelligence-v15.js');
  for(const token of ["['changes','Changes']","['press','Press Room']","['scheme','Scheme Lab']","['global','Global Fans']","['stadium','Stadium']","['gm','Fan GM']","['history','Time Machine']"])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/role="tablist"/);
  assert.match(js,/data-v15-tab/);
});

test('Change Engine compares real loaded categories and stores a previous snapshot',()=>{
  const js=read('command-intelligence-v15.js');
  assert.match(js,/titans:v15ChangeSnapshot/);
  for(const token of ['transactions:transactions()','injuries:injuries()','roster:roster()','games:games()','depth:depthChanges()'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/Titans Change Engine/);
  assert.match(js,/Baseline created/);
  assert.match(js,/Why it matters/);
  assert.match(js,/No detected changes since the saved snapshot/);
});

test('source reliability labels provenance without inventing reporter accuracy scores',()=>{
  const js=read('command-intelligence-v15.js');
  for(const token of ['VERIFIED','Official team / league','MAJOR OUTLET','COMMUNITY','Community signal, not confirmation','EXTERNAL','Needs cross-check'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/We do not invent an accuracy percentage without a verified history/);
  assert.doesNotMatch(js,/\b(?:97|98|99|100)% accurate\b/i);
});

test('Press Room supports official sourcing and browser-local transcript analysis',()=>{
  const js=read('command-intelligence-v15.js');
  assert.match(js,/tennesseetitans\.com\/video\/press-conferences/);
  assert.match(js,/Press Room/);
  assert.match(js,/Analyze a transcript locally/);
  assert.match(js,/Paste text you already have/);
  assert.match(js,/players=roster\(\)\.map\(playerName\)/);
  assert.match(js,/change-language/i);
  assert.doesNotMatch(js,/fetch\(['"]\/api\/(?:transcript|press|ai|summar)/i);
});

test('Scheme Lab is explanatory and does not claim access to a private playbook',()=>{
  const js=read('command-intelligence-v15.js');
  for(const token of ['11 personnel','Nickel defense','Four-man pressure','Zone run family','Play action'])assert.match(js,new RegExp(token));
  assert.match(js,/educational concept maps, not claims about a private Titans playbook/i);
  assert.match(js,/actual Titans snaps, success rate and EPA/);
});

test('Global Fan Desk handles world time, passport privacy and spoiler mode',()=>{
  const js=read('command-intelligence-v15.js'),css=read('command-intelligence-v15.css');
  assert.match(js,/GLOBAL FAN DESK/);
  assert.match(js,/resolvedOptions\(\)\.timeZone/);
  assert.match(js,/America\/New_York/);
  assert.match(js,/America\/Chicago/);
  assert.match(js,/zoneFmt\(kickoff,'UTC'\)/);
  assert.match(js,/titans:v15FanPassport/);
  assert.match(js,/Save on this device/);
  assert.match(js,/titans:v15SpoilerFree/);
  assert.match(js,/Community map \/ nearby-fan counts are intentionally not fabricated/);
  assert.match(css,/body\.v15-spoiler-free/);
});

test('Stadium Transition Center preserves the 2026 farewell and 2027 handoff',()=>{
  const js=read('command-intelligence-v15.js');
  assert.match(js,/Stadium Transition Center/);
  assert.match(js,/targeted completion February 2027/);
  assert.match(js,/First Titans games are planned for fall 2027/);
  assert.match(js,/Farewell season/);
  assert.match(js,/ETFE translucent roof/);
  assert.match(js,/tennesseetitans\.com\/new-stadium/);
});

test('Fan GM saves timestamped receipts and locks next-game picks after kickoff',()=>{
  const js=read('command-intelligence-v15.js');
  assert.match(js,/PREDICTIONS WITH RECEIPTS/);
  assert.match(js,/savedAt:new Date\(\)\.toISOString\(\)/);
  assert.match(js,/Date\.parse\(g\.date\)<=Date\.now\(\)/);
  for(const status of ['Lock','Likely','Bubble','Long shot'])assert.match(js,new RegExp(`<option>${status}<\\/option>`));
  assert.match(js,/No retroactive picks/);
});

test('milestone watch uses loaded stats but refuses to fake franchise-record baselines',()=>{
  const js=read('command-intelligence-v15.js');
  assert.match(js,/Records & milestone watch/);
  assert.match(js,/Automatic franchise-record baselines are not claimed until a verified record dataset is loaded/);
  assert.match(js,/aggregateStats/);
  assert.match(js,/fan-saved milestone/);
});

test('Time Machine covers the verified franchise identity eras without pretending the archive is complete',()=>{
  const js=read('command-intelligence-v15.js');
  for(const token of ['Houston Oilers','Tennessee Oilers','Tennessee Titans · Fireball era','The Shield era begins','New Nissan Stadium era'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/historical warehouse is expanded/);
  assert.match(js,/will not claim era-to-era statistical similarity without normalized historical data/);
});

test('player journey uses loaded roster and evidence instead of guessed relationships',()=>{
  const js=read('command-intelligence-v15.js');
  assert.match(js,/PLAYER JOURNEY \+ CONNECTIONS/);
  assert.match(js,/Timeline evidence/);
  assert.match(js,/Connections use current position \/ experience metadata, not guessed friendships/);
  assert.match(js,/transactions\(\),\.\.\.feed\(\)/);
});

test('Command Intelligence remains mobile-first and reduced-motion friendly',()=>{
  const css=read('command-intelligence-v15.css');
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/min-height:48px/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/grid-template-columns:1fr/);
});

test('universal search recognizes the new differentiating features',()=>{
  const js=read('command-search-v15.js');
  for(const term of ['what changed','press room','scheme lab','global fan','fan gm','time machine','stadium transition','records watch','spoiler free'])assert.match(js,new RegExp(term));
  assert.match(js,/history\.pushState\(null,'','#command'\)/);
  assert.match(js,/PopStateEvent\('popstate'\)/);
});

test('merged custom-media-link feature is actually loaded, not only precached',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/media-custom-links-v14\.css\?v=1/);
  assert.match(html,/media-custom-links-v14\.js\?v=1/);
  assert.match(sw,/media-custom-links-v14\.css/);
  assert.match(sw,/media-custom-links-v14\.js/);
});

test('media tune guide loads data after pushState route navigation',()=>{
  const js=read('media-timecodes-v14.js');
  assert.match(js,/if\(route\(\)==='media'&&!data\)run\(\);else renderGuide\(\)/);
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
});

test('Cloudflare deploy cannot report full success without Command Intelligence browser health',()=>{
  const workflow=read('.github/workflows/cloudflare-deploy.yml'),smoke=read('scripts/command-intelligence-browser-smoke.py');
  assert.match(workflow,/Run Command Intelligence browser regression/);
  assert.match(workflow,/id: command_browser/);
  assert.match(workflow,/steps\.command_browser\.outcome/);
  assert.match(workflow,/command-intelligence-browser-smoke\.py/);
  assert.match(workflow,/Command Intelligence browser regression/);
  assert.match(smoke,/document\.querySelectorAll\('\[data-v15-tab\]'\)\.length === 7/);
  assert.match(smoke,/mediaTuneGuideAfterPushState/);
  assert.match(smoke,/390px command/);
  assert.match(smoke,/SEVERE/);
});
