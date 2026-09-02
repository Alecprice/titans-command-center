import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const review=fs.readFileSync(new URL('../fantasy-prop-review-v138.js',import.meta.url),'utf8');

test('review comparison retains a complete per-book state for changed watched props',()=>{
  assert.ok(review.includes("const lineChanges=[],reportingChanges=[],bookStates=[];"));
  assert.ok(review.includes("kind:delta>0?'up':'down'"));
  assert.ok(review.includes("kind:'same',before:before.line,now:now.line,delta:0"));
  assert.ok(review.includes("kind:'now-reporting',before:null,now:now.line,delta:null"));
  assert.ok(review.includes("kind:'not-reporting',before:before.line,now:null,delta:null"));
  assert.ok(review.includes('reportingChanges,bookStates,score'));
});

test('row detail reports exact observed before and current lines without recommendation language',()=>{
  assert.ok(review.includes("value.kind==='up'?'↑':'↓'"));
  assert.ok(review.includes('${lineText(value.before)} → ${lineText(value.now)}'));
  assert.ok(review.includes('${value.book} no change · ${lineText(value.now)}'));
  assert.ok(review.includes('${value.book} now reporting · ${lineText(value.now)}'));
  assert.ok(review.includes('${value.book} not reporting now · was ${lineText(value.before)}'));
  assert.doesNotMatch(review,/\bbest bet\b|\block\b|\bedge score\b|\brecommend(?:ation|ed)?\b|projection/i);
});

test('changed row detail uses safe DOM text rather than dynamic innerHTML',()=>{
  assert.ok(review.includes("detail=document.createElement('div')"));
  assert.ok(review.includes("detail.setAttribute('aria-label',`Changes since review for ${identity.player} ${identity.market}`)"));
  assert.ok(review.includes('lead.textContent=`Since review · ${formatTime(baseline.reviewedAt)}`'));
  assert.ok(review.includes('chip.textContent=bookStateLabel(item)'));
  assert.ok(review.includes('detail.replaceChildren()'));
});

test('row detail exists only for a real changed checkpoint and cleans up otherwise',()=>{
  assert.ok(review.includes("if(result?.kind!=='changed'||!baseline){"));
  assert.ok(review.includes("detail?.remove();lastQuote?.classList.remove('fpr-before-detail');return;"));
  assert.ok(review.includes('renderRowDetail(row,identity,result,baseline)'));
  assert.ok(review.includes("row.querySelector(':scope > .fpr-row-detail')?.remove()"));
});

test('full-width detail preserves desktop and phone prop-row borders',()=>{
  assert.ok(review.includes('.fpr-row-detail{grid-column:1/-1'));
  assert.ok(review.includes("lastQuote?.classList.add('fpr-before-detail')"));
  assert.ok(review.includes('.fprop-row>.fpr-before-detail{border-right:0}'));
  assert.ok(review.includes('@media(max-width:620px){.fprop-row>.fpr-before-detail{border-bottom:0}'));
});

test('per-book review detail remains phone readable and forced-colors compatible',()=>{
  assert.ok(review.includes('.fpr-book-state{display:inline-flex'));
  assert.ok(review.includes('min-height:36px'));
  assert.ok(review.includes('flex-basis:100%'));
  assert.ok(review.includes('.fpr-row-detail,.fpr-book-state{border:1px solid CanvasText}'));
});

test('detail stays inside the existing review lifecycle with no new traffic or persistence silo',()=>{
  assert.equal((review.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(review,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.ok(review.includes("REVIEW_STORE='titans-fantasy-prop-review-v1'"));
  assert.doesNotMatch(review,/titans-fantasy-prop-review-detail/);
});
