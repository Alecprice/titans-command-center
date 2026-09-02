import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const review=read('fantasy-prop-review-v138.js');
const watch=read('fantasy-prop-watchlist-v137.js');

test('review checkpoint loads additively from the merged watchlist layer',()=>{
  assert.ok(watch.includes("import('./fantasy-prop-review-v138.js').catch(()=>{});"));
});

test('review checkpoint is bounded device-local state with zero provider traffic',()=>{
  assert.ok(review.includes("REVIEW_STORE='titans-fantasy-prop-review-v1'"));
  assert.ok(review.includes('MAX_ITEMS=32,MAX_BOOKS=6'));
  assert.ok(review.includes('localStorage.getItem(REVIEW_STORE)'));
  assert.ok(review.includes('localStorage.setItem(REVIEW_STORE'));
  assert.doesNotMatch(review,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
});

test('checkpoint identity matches watchlist player plus market normalization',()=>{
  assert.ok(review.includes("const keyFor=(player,market)=>`${slug(player)}|${slug(market)}`;"));
  assert.ok(review.includes("normalize('NFKD')"));
  assert.ok(review.includes('key:keyFor(player,market)'));
  assert.ok(review.includes('findIndex(candidate=>candidate.key===item.key)===index'));
});

test('checkpoint creation is an explicit board review action',()=>{
  assert.ok(review.includes('function markReviewed(root,watchedKeys)'));
  assert.ok(review.includes('store[identity.key]={reviewedAt:stamp,books};captured++'));
  assert.ok(review.includes("const mark=panel.querySelector('.fpr-mark');if(mark)mark.onclick=()=>markReviewed(root,watchedKeys);"));
  assert.ok(review.includes('Mark board reviewed'));
  assert.doesNotMatch(review,/panel\.querySelector\('\.fpr-mark'\)\?\.addEventListener/);
});

test('comparison distinguishes line movement from reporting availability',()=>{
  assert.ok(review.includes("reportingChanges.push({book:now.book,kind:'now-reporting'})"));
  assert.ok(review.includes("reportingChanges.push({book:before.book,kind:'not-reporting'})"));
  assert.ok(review.includes('now.line-before.line'));
  assert.ok(review.includes("kind:lineChanges.length||reportingChanges.length?'changed':'same'"));
});

test('missing quote cells cannot coerce into fake zero lines',()=>{
  assert.ok(review.includes("const num=value=>{const text=String(value??'').trim().replace(/,/g,'');if(!text)return null;"));
  assert.ok(review.includes("line=num(quote.querySelector('.fprop-line b')?.textContent)"));
  assert.ok(review.includes('if(!book||line==null)continue'));
});

test('dynamic player and market copy is escaped before summary HTML insertion',()=>{
  assert.ok(review.includes("const esc=value=>clean(value).replace(/[&<>\"']/g"));
  assert.ok(review.includes('${esc(item.identity.player)}'));
  assert.ok(review.includes('${esc(item.identity.market)}'));
  assert.ok(review.includes('${esc(summaryReason(item))}'));
});

test('new watches remain unreviewed instead of inventing a prior checkpoint',()=>{
  assert.ok(review.includes("if(!baseline)return {kind:'unreviewed'"));
  assert.ok(review.includes('NEEDS REVIEW CHECKPOINT'));
  assert.ok(review.includes('without a checkpoint'));
});

test('changed-only filtering composes without owning hidden state',()=>{
  assert.ok(review.includes("classList.toggle('is-filtered-by-review'"));
  assert.ok(review.includes('.fprop-row.is-filtered-by-review{display:none!important}'));
  assert.doesNotMatch(review,/row\.hidden\s*=/);
  assert.ok(review.includes('Changed only'));
  assert.ok(review.includes('Show all props'));
});

test('changed-only fallback resolves before review filters are applied',()=>{
  const fallback=review.indexOf("if(state.changedOnly&&!changed.length)state.changedOnly=false;");
  const apply=review.indexOf("row.classList.toggle('is-filtered-by-review'",fallback);
  assert.ok(fallback>=0,'missing changed-only fallback');
  assert.ok(apply>fallback,'filter application must follow changed-only fallback');
});

test('review panel stays out of the way until at least one prop is watched',()=>{
  assert.ok(review.includes('if(!watchlist.length){'));
  assert.ok(review.includes("root.querySelector('.fpr-review')?.remove();"));
  assert.ok(review.includes("row.querySelector('.fpr-review-badge')?.remove()"));
});

test('truth copy does not imply background monitoring or betting advice',()=>{
  assert.ok(review.includes('it does not monitor while closed'));
  assert.ok(review.includes('explicit checkpoint'));
  assert.doesNotMatch(review,/\bbest bet\b|\block\b|\bedge score\b|\brecommend(?:ation|ed)?\b|projection/i);
});

test('review checkpoint observer is guarded and reacts to cross-tab state changes',()=>{
  assert.ok(review.includes('observer?.disconnect()'));
  assert.ok(review.includes('finally{resumeObserver()}'));
  assert.ok(review.includes('observer=new MutationObserver(queue)'));
  assert.ok(review.includes("event.key===WATCH_STORE||event.key===REVIEW_STORE"));
});

test('review checkpoint stays thumb-safe and accessible on phones',()=>{
  assert.ok(review.includes('min-height:44px'));
  assert.ok(review.includes('min-height:48px'));
  assert.ok(review.includes('@media(max-width:700px)'));
  assert.ok(review.includes('@media(max-width:430px)'));
  assert.ok(review.includes('@media(forced-colors:active)'));
  assert.ok(review.includes('focus-visible'));
  assert.ok(review.includes("aria-live','polite"));
});
