import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const review=fs.readFileSync(new URL('../fantasy-prop-review-v138.js',import.meta.url),'utf8');

test('unreviewed watched props get an explicit needs-checkpoint queue',()=>{
  assert.ok(review.includes('const newHighlights=visibleUnreviewed.slice(0,3).map(item=>'));
  assert.ok(review.includes('class=\"fpr-new\" data-review-key=\"${esc(item.identity.key)}\"'));
  assert.ok(review.includes('Needs checkpoint'));
  assert.ok(review.includes("capturable?'Set checkpoint':'View status'"));
});

test('needs-checkpoint navigation revalidates watch membership and unreviewed state',()=>{
  assert.ok(review.includes('function jumpToUnreviewed(root,key)'));
  assert.ok(review.includes('if(!watchedKeys.has(key)){decorate();return false}'));
  assert.ok(review.includes("find(candidate=>rowIdentity(candidate)?.key===key)"));
  assert.ok(review.includes("if(baseline||compare(row,baseline).kind!=='unreviewed'){decorate();return false}"));
});

test('review summary jumps only target rows visible under the current filter stack',()=>{
  assert.ok(review.includes('if(!row.getClientRects().length){decorate();return false}'));
  assert.ok(review.includes('const visibleChanged=changed.filter(item=>item.row.getClientRects().length);'));
  assert.ok(review.includes('const visibleUnreviewed=unreviewed.filter(item=>item.row.getClientRects().length);'));
  assert.ok(review.includes('currently hidden by another active Fantasy filter'));
  assert.doesNotMatch(review,/TitansFantasyPropWatchlist\.setOnly|TitansFantasyPropMover|setChangedOnly\(/);
});

test('new-watch queue never creates a checkpoint before the fan uses the row action',()=>{
  assert.ok(review.includes("button.onclick=()=>jumpToUnreviewed(root,button.dataset.reviewKey)"));
  assert.doesNotMatch(review,/fpr-new[^\n]{0,500}markOneReviewed/);
  assert.doesNotMatch(review,/newHighlights[^\n]{0,800}saveReview\(/);
});

test('unavailable new watches remain inspectable instead of receiving an empty baseline',()=>{
  assert.ok(review.includes('const unreviewedCapturable=unreviewed.filter(item=>Object.keys(currentBooks(item.row)).length>0).length;'));
  assert.ok(review.includes("capturable?'Set review checkpoint for':'View review checkpoint status for'"));
  assert.ok(review.includes("without a checkpoint currently ${unavailableUnreviewed===1?'has':'have'} no numeric line to set one"));
  assert.ok(review.includes("const target=row.querySelector('.fpr-row-mark:not(:disabled)')||row;"));
});

test('needs-checkpoint summaries participate in focus continuity',()=>{
  assert.ok(review.includes("active.matches('.fpr-new[data-review-key]')"));
  assert.ok(review.includes("request.kind==='new-summary'"));
  assert.ok(review.includes("root.querySelectorAll('.fpr-new[data-review-key]')"));
  assert.ok(review.includes("focusControl(summary)||focusReviewPanel(root,['.fpr-only:not(:disabled)','.fpr-mark:not(:disabled)'])"));
});

test('new-watch queue stays phone and forced-colors safe',()=>{
  assert.ok(review.includes('.fpr-new{min-height:44px'));
  assert.ok(review.includes('.fpr-new{min-height:48px;flex:1 1 220px}'));
  assert.ok(review.includes('.fpr-new:focus-visible'));
  assert.ok(review.includes('@media(forced-colors:active){.fpr-review,.fpr-change,.fpr-new'));
});

test('new-watch queue adds no provider traffic persistence timer or lifecycle owner',()=>{
  assert.equal((review.match(/new MutationObserver\(/g)||[]).length,1);
  assert.doesNotMatch(review,/fetch\(|XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(review,/setInterval\(|setTimeout\(/);
  assert.ok(review.includes("REVIEW_STORE='titans-fantasy-prop-review-v1'"));
  assert.doesNotMatch(review,/titans-fantasy-prop-review-new-watch/);
});
