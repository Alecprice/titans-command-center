import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const review=fs.readFileSync(new URL('../fantasy-prop-review-v138.js',import.meta.url),'utf8');

test('review rerenders capture only active review controls for focus continuity',()=>{
  assert.ok(review.includes('function reviewFocusRequest(root)'));
  assert.ok(review.includes('const active=document.activeElement;'));
  assert.ok(review.includes("if(!active||!root.contains(active))return null;"));
  assert.ok(review.includes("active.matches('.fpr-row-mark')"));
  assert.ok(review.includes("active.matches('.fpr-change[data-review-key]')"));
  assert.ok(review.includes("active.matches('.fpr-new[data-review-key]')"));
  assert.ok(review.includes("active.matches('.fpr-mark')"));
  assert.ok(review.includes("active.matches('.fpr-mark-changed')"));
  assert.ok(review.includes("active.matches('.fpr-only')"));
  const start=review.indexOf('function reviewFocusRequest(root)');
  const end=review.indexOf('function focusReviewPanel',start);
  assert.ok(start>=0&&end>start,'missing scoped focus capture helpers');
  const focusCapture=review.slice(start,end);
  assert.doesNotMatch(focusCapture,/querySelectorAll\('\.fprop-row'\)/);
});

test('focus restoration happens after the review DOM settles and before observer ownership resumes',()=>{
  assert.ok(review.includes('const focusRequest=preferredFocusRequest||reviewFocusRequest(root);'));
  const restore=review.indexOf('restoreReviewFocus(root,focusRequest)');
  const resume=review.indexOf('resumeObserver()',restore);
  assert.ok(restore>=0,'missing focus restore');
  assert.ok(resume>restore,'focus should settle before mutation observation resumes');
  assert.ok(review.includes('}finally{restoreReviewFocus(root,focusRequest)}'));
  assert.ok(review.includes('}finally{resumeObserver()}'));
});

test('focus restoration uses preventScroll and temporary tabindex only as a fallback',()=>{
  assert.ok(review.includes('target.focus({preventScroll:true})'));
  assert.ok(review.includes("function focusTemporary(target,className='')"));
  assert.ok(review.includes("const addedTabindex=!target.hasAttribute('tabindex');"));
  assert.ok(review.includes('if(addedTabindex)target.tabIndex=-1;'));
  assert.ok(review.includes("target.addEventListener('blur',cleanup,{once:true})"));
  assert.ok(review.includes("if(addedTabindex)target.removeAttribute('tabindex')"));
});

test('a reviewed row keeps focus on its surviving control when it remains visible',()=>{
  assert.ok(review.includes("find(candidate=>rowIdentity(candidate)?.key===request.key)"));
  assert.ok(review.includes('if(row&&row.getClientRects().length)'));
  assert.ok(review.includes("row.querySelector('.fpr-row-mark:not(:disabled)')||row.querySelector('.fpw-watch-button:not(:disabled)')"));
  assert.ok(review.includes("focusTemporary(row,'fpr-focus-anchor')"));
});

test('changed-only review flow advances only to an already visible changed row',()=>{
  assert.ok(review.includes("root.querySelectorAll('.fprop-row.is-review-changed')"));
  assert.ok(review.includes('find(candidate=>candidate.getClientRects().length)'));
  assert.ok(review.includes("next.scrollIntoView({block:'center',behavior:reduced?'auto':'smooth'})"));
  assert.ok(review.includes("window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches"));
  assert.doesNotMatch(review,/setChangedOnly\(|TitansFantasyPropWatchlist\.setOnly|TitansFantasyPropMover/);
});

test('panel and summary controls recover semantically without synthetic clicks',()=>{
  assert.ok(review.includes('focusReviewPanel(root,request.selectors)'));
  assert.ok(review.includes('find(button=>button.dataset.reviewKey===request.key)'));
  assert.ok(review.includes("['.fpr-mark-changed:not(:disabled)','.fpr-mark:not(:disabled)','.fpr-only:not(:disabled)']"));
  assert.ok(review.includes("['.fpr-only:not(:disabled)','.fpr-mark:not(:disabled)']"));
  assert.doesNotMatch(review,/\.click\(\)/);
});

test('focus fallback is keyboard-visible and forced-colors safe',()=>{
  assert.ok(review.includes('.fpr-review.fpr-focus-anchor:focus-visible,.fprop-row.fpr-focus-anchor:focus-visible'));
  assert.ok(review.includes('.fpr-review.fpr-focus-anchor,.fprop-row.fpr-focus-anchor{outline:1px solid Highlight}'));
});

test('focus continuity adds no network persistence timer or observer owner',()=>{
  assert.equal((review.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(review,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(review,/setInterval\(|setTimeout\(/);
  assert.ok(review.includes("REVIEW_STORE='titans-fantasy-prop-review-v1'"));
  assert.doesNotMatch(review,/titans-fantasy-prop-review-focus/);
});
