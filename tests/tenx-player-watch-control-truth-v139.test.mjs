import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../my-player-watch-v36.js',import.meta.url),'utf8');
const clickSource=source.slice(source.indexOf("document.addEventListener('click'"),source.indexOf("addEventListener('titans:player-watchlist'"));

test('TENX mounted Player Watch control reconciles from persisted watch intent instead of freezing first paint',()=>{
  assert.match(source,/let bar=command\.querySelector\('\.v36-watchbar'\)/);
  assert.match(source,/if\(!bar\)\{/);
  assert.doesNotMatch(source,/if\(!command\|\|command\.querySelector\('\.v36-watchbar'\)\)return/);
  assert.match(source,/button\.setAttribute\('aria-pressed',nextState\)/);
  assert.match(source,/button\.textContent=isWatched\?'✓ Watching':'＋ Watch player'/);
});

test('TENX successful Watch or Unwatch reconciles the existing control only after persistence succeeds',()=>{
  assert.match(clickSource,/if\(saveWatchlist\(list\)\)\{watchStatus\(button,''\);queueMicrotask\(mount\);return;\}/);
  assert.equal((clickSource.match(/queueMicrotask\(mount\)/g)||[]).length,1,'click path should schedule reconciliation only after a successful save');
  assert.match(source,/window\.dispatchEvent\(new CustomEvent\('titans:player-watchlist'/);
});

test('TENX failed Watch and Unwatch writes keep saved state authoritative and explain the retry',()=>{
  assert.match(clickSource,/Could not watch \$\{name\}\. Your watchlist is unchanged\. Retry\./);
  assert.match(clickSource,/Could not stop watching \$\{name\}\. Your watchlist is unchanged\. Retry\./);
  assert.match(clickSource,/Could not remove \$\{name\}\. Your watchlist is unchanged\. Retry\./);
  assert.doesNotMatch(clickSource,/if\(!saveWatchlist\(list\)\)[^}]*setAttribute\('aria-pressed'/s);
  assert.doesNotMatch(clickSource,/if\(!saveWatchlist\(list\)\)[^}]*textContent=isWatched/s);
});

test('TENX full watchlist is an explicit no-write state instead of a dead control',()=>{
  const full=clickSource.indexOf('Watchlist full · remove a player before adding another.');
  const save=clickSource.indexOf('if(saveWatchlist(list))');
  assert.ok(full>=0,'full-watchlist feedback must exist');
  assert.ok(save>full,'capacity guard must run before persistence');
  assert.match(clickSource,/else\{watchStatus\(button,`Watchlist full · remove a player before adding another\.`\);return;\}/);
});

test('TENX Player and Home watch failures use visible polite status regions with safe text insertion',()=>{
  assert.equal((source.match(/data-v36-watch-status role="status" aria-live="polite"/g)||[]).length,2);
  assert.match(source,/const watchStatus=\(button,message\)=>\{[^}]*status\.textContent=String\(message\|\|''\)/);
  assert.match(source,/\.v36-watch-status\{[^}]*font-weight:800/);
  assert.match(source,/\.v36-watch-status:empty\{display:none\}/);
});

test('TENX same-tab Watch truth repair keeps one persistence, provider, and lifecycle owner',()=>{
  assert.equal((source.match(/localStorage\.setItem/g)||[]).length,1);
  assert.equal((source.match(/runtime\.apiJson\('\/api\/data'/g)||[]).length,1);
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/new MutationObserver/);
  assert.doesNotMatch(source,/setInterval\s*\(|setTimeout\s*\(/);
  assert.match(source,/runtime\.onRoute\(mount,\{immediate:true\}\)/);
  assert.match(source,/runtime\.onAppRender\(mount,\{immediate:true\}\)/);
});

test('TENX Player Watch repair preserves touch and reduced-motion safeguards',()=>{
  assert.match(source,/min-height:44px/);
  assert.match(source,/\.v36-watch-remove\{[^}]*width:44px[^}]*height:44px/);
  assert.match(source,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(source,/@media\(max-width:560px\)/);
});
