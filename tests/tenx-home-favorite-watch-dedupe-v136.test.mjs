import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const home=read('my-titans-home-v35.js');
const watch=read('my-player-watch-v36.js');
const impact=read('my-player-impact-v38.js');

test('TENX Home removes the Favorite Player duplicate from Watchlist presentation only',()=>{
  assert.match(home,/FAVORITE PLAYER/);
  assert.match(watch,/const samePlayerName=\(left,right\)=>/);
  assert.match(watch,/const favoriteWatched=Boolean\(favorite&&list\.some\(item=>samePlayerName\(item\.name,favorite\)\)\)/);
  assert.match(watch,/const visibleList=favorite\?list\.filter\(item=>!samePlayerName\(item\.name,favorite\)\):list/);
  assert.match(watch,/visibleList\.map\(item=>/);
  assert.doesNotMatch(watch,/list=list\.filter\(item=>!samePlayerName\(item\.name,favorite\)\)/);
});

test('TENX saved watch intent remains intact when Favorite Player is hidden from the Home rail',()=>{
  assert.match(watch,/profile\.watchlist=list\.slice\(0,MAX_WATCHED\)\.map/);
  assert.match(watch,/const list=watched\(profile\)/);
  assert.match(watch,/const signature=JSON\.stringify\(\[list,visibleList,Boolean\(favorite\),favoriteWatched,rosterSettled\]\)/);
  assert.doesNotMatch(watch,/saveWatchlist\(visibleList\)/);
  assert.doesNotMatch(watch,/profile\.watchlist=visibleList/);
});

test('TENX player-page watch toggle still reads the full saved watchlist',()=>{
  assert.match(watch,/function mountPlayer\(\)/);
  assert.match(watch,/const list=watched\(getProfile\(\)\)/);
  assert.match(watch,/const isWatched=list\.some\(item=>/);
  assert.match(watch,/\?['"]✓ Watching['"]:['"]＋ Watch player['"]/);
});

test('TENX favorite-only duplicate does not trigger Home roster hydration',()=>{
  const visible=watch.indexOf('const visibleList=favorite?list.filter(item=>!samePlayerName(item.name,favorite)):list;');
  const load=watch.indexOf('if(visibleList.length)ensureRoster();');
  assert.ok(visible>=0,'visible secondary list must be derived');
  assert.ok(load>visible,'roster hydration must wait for visible secondary watch entries');
  assert.doesNotMatch(watch,/if\(list\.length\)ensureRoster\(\)/);
});

test('TENX Watchlist copy tells the fan when Favorite Player is already pinned',()=>{
  assert.match(watch,/Favorite already pinned · \$\{list\.length\}\/\$\{MAX_WATCHED\} tracked/);
  assert.match(watch,/Your Favorite Player is already pinned in My Titans\. Watch another roster player to add quick access beyond your favorite\./);
  assert.match(watch,/\$\{visibleList\.length\} beyond favorite · \$\{list\.length\}\/\$\{MAX_WATCHED\} tracked/);
});

test('TENX Player Impact continues to dedupe favorite and watch intent independently',()=>{
  assert.match(impact,/const add=item=>\{if\(!item\.name\|\|result\.some\(x=>norm\(x\.name\)===norm\(item\.name\)\)\)return;result\.push\(item\);\}/);
  assert.match(impact,/if\(favorite\)add\(\{id:'',name:favorite,favorite:true\}\);/);
  assert.match(impact,/watched\.forEach\(add\)/);
  assert.match(impact,/return result\.slice\(0,MAX_FOLLOWED\)/);
});

test('TENX Home favorite-watch dedupe adds no new state network or lifecycle owner',()=>{
  assert.match(watch,/PROFILE_KEY='titans:v15MyTitans'/);
  assert.match(watch,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(watch,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
  assert.doesNotMatch(watch,/\bfetch\s*\(/);
  assert.doesNotMatch(watch,/sessionStorage\.setItem/);
  assert.doesNotMatch(watch,/new MutationObserver/);
  assert.doesNotMatch(watch,/setInterval\(|setTimeout\(/);
  assert.match(watch,/min-height:44px/);
  assert.match(watch,/@media\(prefers-reduced-motion:reduce\)/);
});
