import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const review=fs.readFileSync(new URL('../fantasy-prop-review-v138.js',import.meta.url),'utf8');

test('changed summaries are real buttons with live review keys',()=>{
  assert.ok(review.includes('<button type="button" class="fpr-change" data-review-key="${esc(item.identity.key)}"'));
  assert.ok(review.includes('aria-label="Jump to review details for ${esc(item.identity.player)} ${esc(item.identity.market)}"'));
  assert.ok(review.includes(' · Review</button>'));
  assert.doesNotMatch(review,/<span class="fpr-change">/);
});

test('jump revalidates current watch and changed state',()=>{
  assert.ok(review.includes('function jumpToChanged(root,key)'));
  assert.ok(review.includes('if(!watchedKeys.has(key)){decorate();return false}'));
  assert.ok(review.includes("find(candidate=>rowIdentity(candidate)?.key===key)"));
  assert.ok(review.includes("if(!baseline||compare(row,baseline).kind!=='changed'){decorate();return false}"));
});

test('jump moves focus to the row review action with safe fallback',()=>{
  assert.ok(review.includes("const target=row.querySelector('.fpr-row-mark:not(:disabled)')||row;"));
  assert.ok(review.includes('if(addedTabindex)row.tabIndex=-1;'));
  assert.ok(review.includes("target.addEventListener('blur',cleanup,{once:true});"));
  assert.ok(review.includes('target.focus({preventScroll:true});'));
  assert.ok(review.includes('if(document.activeElement!==target){cleanup();return false}'));
});

test('jump respects reduced motion',()=>{
  assert.ok(review.includes("window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches"));
  assert.ok(review.includes("row.scrollIntoView({block:'center',behavior:reduced?'auto':'smooth'});"));
});

test('summary and target controls stay touch and high-contrast safe',()=>{
  assert.ok(review.includes('.fpr-change{min-height:44px'));
  assert.ok(review.includes('.fpr-change{min-height:48px;flex:1 1 220px}'));
  assert.ok(review.includes('.fpr-change:focus-visible'));
  assert.ok(review.includes('.fprop-row.fpr-jump-target{outline:2px solid #7eb8ee'));
  assert.ok(review.includes('@media(forced-colors:active){.fpr-review,.fpr-change'));
});

test('panel controls overwrite handlers instead of stacking listeners on rerender',()=>{
  assert.ok(review.includes("button.onclick=()=>jumpToChanged(root,button.dataset.reviewKey)"));
  assert.ok(review.includes("if(mark)mark.onclick=()=>markReviewed(root,watchedKeys);"));
  assert.ok(review.includes("if(markChanged)markChanged.onclick=()=>markChangedReviewed(changed,watchedKeys);"));
  assert.ok(review.includes("if(only)only.onclick=()=>{if(!changed.length)return;state.changedOnly=!state.changedOnly;decorate()};"));
  assert.doesNotMatch(review,/panel\.querySelector\('\.fpr-mark'\)\?\.addEventListener/);
  assert.doesNotMatch(review,/panel\.querySelector\('\.fpr-mark-changed'\)\?\.addEventListener/);
  assert.doesNotMatch(review,/panel\.querySelector\('\.fpr-only'\)\?\.addEventListener/);
});

test('jump enhancement adds no network, storage, timer, or observer owner',()=>{
  assert.equal((review.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(review,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(review,/setInterval\(|setTimeout\(/);
  assert.ok(review.includes("REVIEW_STORE='titans-fantasy-prop-review-v1'"));
});
