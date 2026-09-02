import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const review=fs.readFileSync(new URL('../fantasy-prop-review-v138.js',import.meta.url),'utf8');

test('one watched prop can be checkpointed without rewriting the whole board',()=>{
  assert.ok(review.includes('function markOneReviewed(row,identity)'));
  assert.ok(review.includes('const store=pruneReview(loadReview(),watchedKeys);'));
  assert.ok(review.includes('store[liveIdentity.key]={reviewedAt:Date.now(),books};'));
  assert.ok(review.includes('saveReview(store);decorate();return true;'));
  assert.equal((review.match(/function markReviewed\(/g)||[]).length,1);
});

test('per-prop review revalidates live row identity and watch membership before writing',()=>{
  assert.ok(review.includes('const liveIdentity=rowIdentity(row),watchedKeys=new Set(loadWatchlist().map(item=>item.key));'));
  assert.ok(review.includes('if(!liveIdentity||liveIdentity.key!==identity.key||!watchedKeys.has(liveIdentity.key))return false;'));
});

test('per-prop checkpoint refuses to invent an empty sportsbook baseline',()=>{
  assert.ok(review.includes('const books=currentBooks(row);if(!Object.keys(books).length)return false;'));
  assert.ok(review.includes('const canCapture=Object.keys(currentBooks(row)).length>0;'));
  assert.ok(review.includes('button.disabled=!canCapture;'));
  assert.ok(review.includes('no current numeric sportsbook lines are reporting'));
});

test('changed and unreviewed watched props both expose an individual review action',()=>{
  assert.ok(review.includes("button.textContent=result.kind==='changed'?'Mark this reviewed':'Set checkpoint';"));
  assert.ok(review.includes("lead.textContent=result.kind==='changed'?"));
  assert.ok(review.includes("'No review checkpoint yet'"));
  assert.ok(review.includes("if(!result||result.kind==='same'){"));
});

test('individual review action is not a one-shot dead control after a stale-row rejection',()=>{
  assert.ok(review.includes("button.addEventListener('click',()=>markOneReviewed(row,identity));"));
  assert.doesNotMatch(review,/fpr-row-mark[^\n]*once:true/);
});

test('individual review keeps the board-wide checkpoint control intact',()=>{
  assert.ok(review.includes('function markReviewed(root,watchedKeys)'));
  assert.ok(review.includes('Mark board reviewed'));
  assert.ok(review.includes("const mark=panel.querySelector('.fpr-mark');if(mark)mark.onclick=()=>markReviewed(root,watchedKeys);"));
  assert.doesNotMatch(review,/panel\.querySelector\('\.fpr-mark'\)\?\.addEventListener/);
});

test('per-book direction has plain-language screen reader labels',()=>{
  assert.ok(review.includes('function bookStateAria(value)'));
  assert.ok(review.includes('line ${value.kind}'));
  assert.ok(review.includes("chip.setAttribute('aria-label',bookStateAria(item))"));
});

test('per-prop action meets desktop and phone touch target floors',()=>{
  assert.ok(review.includes('.fpr-row-mark{min-height:44px'));
  assert.ok(review.includes('.fpr-row-mark{width:100%;min-height:48px'));
  assert.ok(review.includes('.fpr-row-mark:focus-visible'));
  assert.ok(review.includes('.fpr-row-mark{border:1px solid CanvasText}'));
});

test('per-prop checkpoint adds no provider traffic, observer, or storage namespace',()=>{
  assert.equal((review.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(review,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.ok(review.includes("REVIEW_STORE='titans-fantasy-prop-review-v1'"));
  assert.doesNotMatch(review,/titans-fantasy-prop-review-one/);
});

test('changed-only fallback still resolves before row filters after individual acknowledgement',()=>{
  const fallback=review.indexOf("if(state.changedOnly&&!changed.length)state.changedOnly=false;");
  const apply=review.indexOf("row.classList.toggle('is-filtered-by-review'",fallback);
  assert.ok(fallback>=0,'missing changed-only fallback');
  assert.ok(apply>fallback,'filter application must follow fallback');
});
