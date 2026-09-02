import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const home=read('my-titans-home-v35.js');
const watch=read('my-player-watch-v36.js');
const impact=read('my-player-impact-v38.js');

test('TENX My Titans owns one deterministic Home personalization sibling stack',()=>{
  assert.match(home,/function reconcilePersonalizationStack\(root,pulse\)/);
  assert.match(home,/const watch=app\.querySelector\('\.v36-watch-home'\)/);
  assert.match(home,/const impact=app\.querySelector\('\.v38-impact\[data-surface="home"\]'\)/);
  assert.match(impact,/root\.className='v38-impact'/);
  assert.match(impact,/root\.dataset\.surface=current/);
  assert.match(home,/const tail=impact\|\|watch\|\|root/);
  assert.match(home,/tail\.nextElementSibling===pulse/);
});

test('TENX personalization repair preserves My Titans then Watchlist then Player Impact then Fan Pulse',()=>{
  const rootMove=home.indexOf("host.insertBefore(root,pulse);");
  const watchMove=home.indexOf("if(watch)root.insertAdjacentElement('afterend',watch);");
  const impactMove=home.indexOf("if(impact)(watch||root).insertAdjacentElement('afterend',impact);");
  assert.ok(rootMove>=0,'My Titans must be placed before Fan Pulse');
  assert.ok(watchMove>rootMove,'Watchlist must be placed after My Titans');
  assert.ok(impactMove>watchMove,'Player Impact must be placed after Watchlist when present');
});

test('TENX personalization repair is idempotent before moving existing Home roots',()=>{
  assert.match(home,/const watchOrdered=!watch\|\|\(watch\.parentNode===host&&watch\.previousElementSibling===root\)/);
  assert.match(home,/const impactAnchor=watch\|\|root/);
  assert.match(home,/const impactOrdered=!impact\|\|\(impact\.parentNode===host&&impact\.previousElementSibling===impactAnchor\)/);
  assert.match(home,/const ordered=root\.parentNode===host&&watchOrdered&&impactOrdered&&tail\.nextElementSibling===pulse/);
  assert.match(home,/if\(ordered\)return/);
});

test('TENX ordering repair runs even when My Titans content signature is unchanged',()=>{
  const reconcile=home.indexOf('reconcilePersonalizationStack(root,pulse);');
  const signatureReturn=home.indexOf('if(root.dataset.signature===signature)return;');
  assert.ok(reconcile>=0,'Home must reconcile sibling position');
  assert.ok(signatureReturn>reconcile,'position repair must happen before the content early return');
});

test('TENX existing Watchlist and Player Impact owners still compose around My Titans',()=>{
  assert.match(watch,/const anchor=app\.querySelector\('\.my-titans-home-v35'\)\|\|app\.querySelector\('\.pulse-ribbon'\)/);
  assert.match(watch,/anchor\.insertAdjacentElement\('afterend',root\)/);
  assert.match(impact,/if\(current==='home'\)return app\?\.querySelector\('\.v36-watch-home'\)\|\|app\?\.querySelector\('\.my-titans-home-v35'\)\|\|app\?\.querySelector\('\.pulse-ribbon'\)/);
  assert.match(impact,/host\.insertAdjacentElement\('afterend',root\)/);
});

test('TENX personalization ordering adds no network persistence timer or observer owner',()=>{
  assert.match(home,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(home,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(home,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(home,/new MutationObserver/);
  assert.doesNotMatch(home,/setInterval\(|setTimeout\(/);
  assert.doesNotMatch(home,/localStorage\.setItem|sessionStorage\.setItem/);
  assert.equal((home.match(/apiJson\?\.\('\/api\/data'/g)||[]).length,1,'existing favorite roster verification remains the only Home API read');
});

test('TENX ordering pass preserves favorite route truth and compact accessible Home behavior',()=>{
  assert.match(home,/if\(id\)return `#player\?id=\$\{encodeURIComponent\(id\)\}`/);
  assert.match(home,/return canonical\?`#player\?name=\$\{encodeURIComponent\(canonical\)\}`:'#roster'/);
  assert.match(home,/Saved favorite is not on the loaded roster\. Review Team Room before opening a player page\./);
  assert.match(home,/:focus-visible\{outline:3px solid #fff;outline-offset:2px\}/);
  assert.match(home,/@media\(max-width:760px\)/);
  assert.match(home,/@media\(prefers-reduced-motion:reduce\)/);
});
