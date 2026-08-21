import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('Listen Watch is a first-class route and PWA asset',()=>{
  const html=read('index.html'),sw=read('sw.js');
  assert.match(html,/href="#media" data-route="media"/);
  assert.match(html,/Listen \/ Watch/);
  assert.match(html,/media-center-v14\.css\?v=2/);
  assert.match(html,/media-center-v14\.js\?v=2/);
  assert.match(html,/media-interaction-hotfix-v14\.css\?v=1/);
  assert.match(sw,/const CACHE = 'titans-cc-brand-2026-v38'/);
  assert.match(sw,/\/media-center-v14\.css/);
  assert.match(sw,/\/media-center-v14\.js/);
  assert.match(sw,/\/media-interaction-hotfix-v14\.css/);
});

test('media center uses authorized providers and never proxies or hotlinks live media',()=>{
  const js=read('media-center-v14.js');
  for(const token of ['tennesseetitans.com','1045thezone.com','nfl.com/plus','nfl.com/international','tunein.com','siriusxm.com','paramountplus.com','foxsports.com','peacocktv.com','espn.com/watch','amazon.com','youtube.com','dazn.com'])assert.match(js,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(js,/does not hotlink or rebroadcast/i);
  assert.match(js,/There is no public third-party API that legally hands this site the raw game stream/);
  assert.doesNotMatch(js,/playerservices\.streamtheworld/);
  assert.doesNotMatch(js,/<audio id="media-zone-audio"/);
  assert.doesNotMatch(js,/\/api\/(?:radio|audio|stream|video)-proxy/);
});

test('104.5 launches current official player and Titans game audio',()=>{
  const js=read('media-center-v14.js'),headers=read('_headers');
  assert.match(js,/https:\/\/www\.1045thezone\.com\/player\/\?playerID=3234/);
  assert.match(js,/https:\/\/www\.tennesseetitans\.com\/broadcast\/titans-radio\/live-game-day-audio/);
  assert.match(js,/Open official game audio/);
  assert.match(js,/Open 104\.5/);
  assert.match(headers,/media-src 'self'/);
  assert.doesNotMatch(headers,/playerservices\.streamtheworld/);
  assert.match(headers,/frame-src 'none'/);
});

test('watch router covers core U.S. NFL distribution paths',()=>{
  const js=read('media-center-v14.js');
  for(const token of ['CBS','FOX','NBC','ESPN','ABC','PRIME','AMAZON','NFL NETWORK','NETFLIX','NFL Sunday Ticket','NFL+'])assert.match(js,new RegExp(token));
  assert.match(js,/Out of market/);
  assert.match(js,/Local CBS/);
  assert.match(js,/Local FOX/);
});

test('media center separates Nashville, elsewhere U.S. and international rights modes without geolocation',()=>{
  const js=read('media-center-v14.js');
  assert.match(js,/AREA_KEY='titans:v14MediaArea'/);
  assert.match(js,/savedArea==='outside'\?'us'/);
  assert.match(js,/Nashville \/ Middle Tennessee/);
  assert.match(js,/Elsewhere in U\.S\./);
  assert.match(js,/>International</);
  assert.match(js,/NFL International/);
  assert.match(js,/NFL Game Pass on DAZN/);
  assert.match(js,/U\.S\. broadcast network shown above is schedule context only/);
  assert.doesNotMatch(js,/navigator\.geolocation/);
});

test('media interactions tolerate storage restrictions and own media-link clicks',()=>{
  const js=read('media-center-v14.js');
  assert.match(js,/const storageGet=key=>\{try\{return localStorage\.getItem\(key\)\}catch\{return null\}\}/);
  assert.match(js,/const storageSet=/);
  assert.match(js,/closest\('a\[href="#media"\]'\)/);
  assert.match(js,/history\.pushState\(null,'','#media'\)/);
  assert.match(js,/closest\('\[data-media-area\]'\)/);
  assert.match(js,/aria-pressed/);
  assert.match(js,/observe\(app,\{childList:true,subtree:false\}\)/);
});

test('mobile media UI has safe simple responsive layouts',()=>{
  const css=`${read('media-center-v14.css')}\n${read('media-interaction-hotfix-v14.css')}`;
  assert.match(css,/@media\(max-width:759px\)/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/\.media-area-switch\{width:100%;display:grid;grid-template-columns:1fr\}/);
  assert.match(css,/\.media-radio-launch\{grid-template-columns:1fr\}/);
});
