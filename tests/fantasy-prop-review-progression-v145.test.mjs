import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const review=fs.readFileSync(new URL('../fantasy-prop-review-v138.js',import.meta.url),'utf8');

test('single-prop acknowledgement advances only after revalidating live review need',()=>{
  assert.ok(review.includes("const result=compare(row,store[liveIdentity.key]);"));
  assert.ok(review.includes("if(result.kind!=='changed'&&result.kind!=='unreviewed')return false;"));
  assert.ok(review.includes("decorate({kind:'advance',reviewKind:result.kind,key:liveIdentity.key})"));
  const save=review.indexOf('saveReview(store);decorate({kind:\'advance\'');
  assert.ok(save>=0,'successful single review should carry an explicit focus intent');
});

test('review progression is one-shot rerender state rather than another persisted preference',()=>{
  assert.ok(review.includes('function decorate(preferredFocusRequest=null)'));
  assert.ok(review.includes('const focusRequest=preferredFocusRequest||reviewFocusRequest(root);'));
  assert.doesNotMatch(review,/focusAfterReview|reviewProgression.*localStorage|sessionStorage/);
});

test('next review target revalidates current watch checkpoint and visible filter truth',()=>{
  assert.ok(review.includes('function focusNextReview(root,reviewKind,afterKey)'));
  const start=review.indexOf('function focusNextReview(root,reviewKind,afterKey)');
  const end=review.indexOf('function reviewFocusRequest',start);
  assert.ok(start>=0&&end>start,'missing progression helper boundary');
  const helper=review.slice(start,end);
  assert.ok(helper.includes('new Set(loadWatchlist().map(item=>item.key))'));
  assert.ok(helper.includes('pruneReview(loadReview(),watchedKeys)'));
  assert.ok(helper.includes("if(!identity||!watchedKeys.has(identity.key)||!row.getClientRects().length)continue;"));
  assert.ok(helper.includes('if(compare(row,store[identity.key]).kind!==reviewKind)continue;'));
  assert.doesNotMatch(helper,/setChangedOnly\(|setOnly\(|dispatchEvent\(|\.click\(\)/);
});

test('progression moves forward from the reviewed row and wraps once in board order',()=>{
  assert.ok(review.includes("const rows=[...root.querySelectorAll('.fprop-row')];"));
  assert.ok(review.includes('const start=rows.findIndex(row=>rowIdentity(row)?.key===afterKey);'));
  assert.ok(review.includes('const ordered=start>=0?[...rows.slice(start+1),...rows.slice(0,start)]:rows;'));
});

test('progression prefers the next enabled review action with row fallback and reduced motion',()=>{
  assert.ok(review.includes("const actionable=candidates.find(row=>row.querySelector('.fpr-row-mark:not(:disabled)'));"));
  assert.ok(review.includes('const next=actionable||candidates[0];'));
  assert.ok(review.includes("const target=next.querySelector('.fpr-row-mark:not(:disabled)');"));
  assert.ok(review.includes("if(focusControl(target))return true;"));
  assert.ok(review.includes("return focusTemporary(next,'fpr-focus-anchor')"));
  assert.ok(review.includes("next.scrollIntoView({block:'center',behavior:reduced?'auto':'smooth'})"));
});

test('explicit progression handles changed and needs-checkpoint rows before generic focus recovery',()=>{
  const restore=review.indexOf('function restoreReviewFocus(root,request)');
  const advance=review.indexOf("if(request.kind==='advance')",restore);
  const generic=review.indexOf("if(request.kind!=='row')return false;",restore);
  assert.ok(advance>restore&&generic>advance,'advance focus should resolve before generic row recovery');
  assert.ok(review.includes('focusNextReview(root,request.reviewKind,request.key)'));
  assert.ok(review.includes("request.reviewKind==='changed'"));
});

test('review progression adds no provider traffic timer storage silo or observer owner',()=>{
  assert.equal((review.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(review,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(review,/setInterval\(|setTimeout\(/);
  assert.ok(review.includes("REVIEW_STORE='titans-fantasy-prop-review-v1'"));
  assert.doesNotMatch(review,/titans-fantasy-prop-review-(?:progress|advance|queue)/);
});
