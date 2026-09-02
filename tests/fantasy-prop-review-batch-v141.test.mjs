import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const review=fs.readFileSync(new URL('../fantasy-prop-review-v138.js',import.meta.url),'utf8');

test('batch review checkpoints only the currently changed watched set',()=>{
  assert.ok(review.includes('function markChangedReviewed(changed,watchedKeys)'));
  assert.ok(review.includes('for(const item of changed){'));
  assert.ok(review.includes("if(!baseline||compare(item.row,baseline).kind!=='changed')continue;"));
  assert.ok(review.includes('store[liveIdentity.key]={reviewedAt:stamp,books};captured++;'));
  assert.ok(review.includes('decorate();return captured;'));
});

test('batch review preserves unreviewed and unchanged checkpoints',()=>{
  assert.ok(review.includes('const baseline=store[liveIdentity.key];'));
  assert.ok(review.includes("compare(item.row,baseline).kind!=='changed'"));
  assert.doesNotMatch(review,/markChangedReviewed[\s\S]{0,900}for\(const row of root\.querySelectorAll/);
});

test('batch review revalidates live identity and watch membership before writing',()=>{
  assert.ok(review.includes('const liveIdentity=rowIdentity(item.row);'));
  assert.ok(review.includes('if(!liveIdentity||liveIdentity.key!==item.identity.key||!watchedKeys.has(liveIdentity.key))continue;'));
});

test('batch review skips changed rows that cannot form a numeric checkpoint',()=>{
  assert.ok(review.includes('const books=currentBooks(item.row);if(!Object.keys(books).length)continue;'));
  assert.ok(review.includes('const batchCapturable=changed.filter(item=>Object.keys(currentBooks(item.row)).length>0).length;'));
  assert.ok(review.includes('currently ${unavailableChanged===1?\'has\':\'have\'} no numeric line to checkpoint'));
});

test('batch review action is explicit, scoped, and disabled without capturable changed rows',()=>{
  assert.ok(review.includes('class=\"fpr-mark-changed\"${batchCapturable?\'\':\' disabled\'}'));
  assert.ok(review.includes('Mark changed reviewed'));
  assert.ok(review.includes('Mark currently changed watched props with reporting lines reviewed'));
  assert.ok(review.includes("const markChanged=panel.querySelector('.fpr-mark-changed');if(markChanged)markChanged.onclick=()=>markChangedReviewed(changed,watchedKeys);"));
  assert.doesNotMatch(review,/panel\.querySelector\('\.fpr-mark-changed'\)\?\.addEventListener/);
});

test('batch acknowledgement keeps individual and board-wide review controls intact',()=>{
  assert.ok(review.includes('function markOneReviewed(row,identity)'));
  assert.ok(review.includes('function markReviewed(root,watchedKeys)'));
  assert.ok(review.includes('Mark this reviewed'));
  assert.ok(review.includes('Mark board reviewed'));
});

test('batch action composes with changed-only fallback after acknowledgement',()=>{
  const fallback=review.indexOf("if(state.changedOnly&&!changed.length)state.changedOnly=false;");
  const apply=review.indexOf("row.classList.toggle('is-filtered-by-review'",fallback);
  assert.ok(fallback>=0,'missing changed-only fallback');
  assert.ok(apply>fallback,'filter application must remain after fallback');
});

test('batch action stays phone-safe without another lifecycle or persistence owner',()=>{
  assert.ok(review.includes('.fpr-actions .fpr-mark-changed{grid-column:1/-1}'));
  assert.ok(review.includes('.fpr-actions button{min-height:48px}'));
  assert.equal((review.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(review,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.ok(review.includes("REVIEW_STORE='titans-fantasy-prop-review-v1'"));
  assert.doesNotMatch(review,/titans-fantasy-prop-review-batch/);
});
