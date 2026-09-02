import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const sync=read('account-sync-v112.js');
const api=read('src/account-api.mjs');
const watch=read('fantasy-prop-watchlist-v137.js');

const LOCAL_EVIDENCE=[
  'titans-fantasy-prop-review-v1',
  'titans-fantasy-prop-observations-v1',
  'titans-fantasy-sleeper-player-index-v1'
];

test('prop watch targets join the existing account preference namespace',()=>{
  assert.ok(sync.includes("PROP_WATCHLIST_KEY='titans-fantasy-prop-watchlist-v1'"));
  assert.ok(sync.includes('FANTASY_PREF_KEY,PROP_WATCHLIST_KEY'));
  assert.ok(api.includes("PROP_WATCHLIST_KEY='titans-fantasy-prop-watchlist-v1'"));
  assert.ok(api.includes("'titans-fantasy-v1',PROP_WATCHLIST_KEY"));
});

test('browser-observed prop evidence never joins account sync or server allowlist',()=>{
  for(const key of LOCAL_EVIDENCE){
    assert.ok(!sync.includes(key),`${key} must stay out of browser account sync`);
    assert.ok(!api.includes(key),`${key} must stay out of server preference allowlist`);
  }
});

test('first account sync unions local and remote watch targets without losing either device',()=>{
  assert.ok(sync.includes('mergePropWatchlists=(local,remote)=>normalizePropWatchlist([...normalizePropWatchlist(local),...normalizePropWatchlist(remote)])'));
  assert.ok(sync.includes('merged[PROP_WATCHLIST_KEY]=mergePropWatchlists(local[PROP_WATCHLIST_KEY],remotePreferences[PROP_WATCHLIST_KEY])'));
  assert.ok(sync.includes("if(PROP_WATCHLIST_KEY in local||PROP_WATCHLIST_KEY in remotePreferences)"));
});

test('later signed-in edits push the current list so removals can propagate',()=>{
  assert.ok(sync.includes("try{await request('PUT',snapshot())"));
  assert.ok(sync.includes(".fpw-watch-button'))setTimeout(schedule,0)"));
});

test('client watchlist sync recomputes identity deduplicates newest-first and caps at 32',()=>{
  assert.ok(sync.includes('MAX_PROP_WATCHLIST=32'));
  assert.ok(sync.includes("propKey=(player,market)=>`${slug(player)}|${slug(market)}`"));
  assert.ok(sync.includes('savedAt:Number.isFinite(savedAt)&&savedAt>0?Math.floor(savedAt):0'));
  assert.ok(sync.includes('.sort((a,b)=>b.savedAt-a.savedAt)'));
  assert.ok(sync.includes('findIndex(candidate=>candidate.key===item.key)===index'));
  assert.ok(sync.includes('.slice(0,MAX_PROP_WATCHLIST)'));
});

test('server sanitizes watch targets instead of trusting client keys',()=>{
  assert.ok(api.includes('function sanitizePropWatchlist(value)'));
  assert.ok(api.includes('if(!Array.isArray(value))return null'));
  assert.ok(api.includes("const key=`${propSlug(player)}|${propSlug(market)}`"));
  assert.ok(api.includes("String(item.player??'').trim().slice(0,80)"));
  assert.ok(api.includes("String(item.market??'').trim().slice(0,80)"));
  assert.ok(api.includes('.slice(0,MAX_PROP_WATCHLIST)'));
  assert.ok(api.includes('if(key===PROP_WATCHLIST_KEY)'));
});

test('initial sync refreshes the live Fantasy surface when merged watch targets changed',()=>{
  assert.ok(sync.includes('const refreshPropWatchlist=PROP_WATCHLIST_KEY in merged'));
  assert.ok(sync.includes('refreshV10||refreshFantasy||refreshPropWatchlist'));
});

test('backup import normalizes synced watch targets through the same bounded contract',()=>{
  assert.ok(sync.includes('key===PROP_WATCHLIST_KEY?normalizePropWatchlist(preferences[key]):preferences[key]'));
  assert.ok(sync.includes('preferences:normalized'));
});

test('watchlist UI explains cross-device targets versus device-local evidence',()=>{
  assert.ok(watch.includes('Watch targets sync with your Titans account. Observed line history and review checkpoints stay on this browser.'));
  assert.ok(watch.includes('Watch targets stay on this browser until you sign in. Observed line history and review checkpoints always stay browser-local.'));
  assert.ok(watch.includes("signedIn?'in your synced watchlist':'saved on this browser'"));
});

test('watchlist rerenders when account or preference-sync state changes without adding network work',()=>{
  assert.ok(watch.includes("addEventListener('titans:account',queue)"));
  assert.ok(watch.includes("addEventListener('titans:preferences-synced'"));
  assert.ok(watch.includes("event.detail?.keys?.includes(STORE)"));
  assert.doesNotMatch(watch,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
});
