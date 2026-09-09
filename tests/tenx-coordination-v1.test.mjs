import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {analyzeCoordination,classifyAreas,isStale} from '../scripts/tenx-coordination.mjs';

const workflow=readFileSync(new URL('../.github/workflows/tenx-coordination.yml',import.meta.url),'utf8');
const recovery=readFileSync(new URL('../.tenx/RECOVERY.md',import.meta.url),'utf8');
const script=readFileSync(new URL('../scripts/tenx-coordination.mjs',import.meta.url),'utf8');

const NOW=Date.parse('2026-09-09T13:00:00Z');

test('coordination classifier separates common Titans work lanes',()=>{
  assert.deepEqual(classifyAreas(['tickets-compare-v125.js','tests/fantasy-board.test.mjs','.github/workflows/cloudflare-deploy.yml']).sort(),['fantasy','release','tickets']);
  assert.deepEqual(classifyAreas(['legacy-finder.js','mobile-nav.js','src/account-api.mjs']).sort(),['account','legacy','mobile']);
});

test('exact file overlap blocks even when the competing PR is stale',()=>{
  const result=analyzeCoordination({
    currentPr:{files:['tickets-compare-v125.js','tests/new.test.mjs']},
    otherPrs:[{number:10,title:'old ticket work',updated_at:'2026-09-07T00:00:00Z',files:['tickets-compare-v125.js']}],
    staleHours:24,
    now:NOW
  });
  assert.equal(result.ok,false);
  assert.equal(result.exact.length,1);
  assert.equal(result.exact[0].stale,true);
  assert.deepEqual(result.exact[0].files,['tickets-compare-v125.js']);
});

test('active same-area work warns without blocking different files',()=>{
  const result=analyzeCoordination({
    currentPr:{files:['tickets-compare-v125.js']},
    otherPrs:[{number:11,title:'ticket budget',updated_at:'2026-09-09T12:30:00Z',files:['tickets-budget-v1.js']}],
    staleHours:24,
    now:NOW
  });
  assert.equal(result.ok,true);
  assert.equal(result.exact.length,0);
  assert.equal(result.activeArea.length,1);
  assert.deepEqual(result.activeArea[0].areas,['tickets']);
});

test('stale area claims expire after 24 hours but remain visible',()=>{
  assert.equal(isStale('2026-09-08T12:59:59Z',{now:NOW,staleHours:24}),true);
  assert.equal(isStale('2026-09-08T13:00:01Z',{now:NOW,staleHours:24}),false);
  const result=analyzeCoordination({
    currentPr:{files:['fantasy-board-v1.js']},
    otherPrs:[{number:12,title:'old fantasy work',updated_at:'2026-09-07T10:00:00Z',files:['fantasy-history-v1.js']}],
    staleHours:24,
    now:NOW
  });
  assert.equal(result.ok,true);
  assert.equal(result.activeArea.length,0);
  assert.equal(result.stale.length,1);
});

test('generated deployment status does not become a false work claim',()=>{
  const result=analyzeCoordination({
    currentPr:{files:['docs/CLOUDFLARE_STATUS.md','scripts/new-release-check.mjs']},
    otherPrs:[{number:13,updated_at:'2026-09-09T12:00:00Z',files:['docs/CLOUDFLARE_STATUS.md']}],
    staleHours:24,
    now:NOW
  });
  assert.equal(result.ok,true);
  assert.equal(result.exact.length,0);
});

test('coordination workflow is read-only bounded and runs on PR updates',()=>{
  assert.match(workflow,/name: TENX Coordination Guard/);
  assert.match(workflow,/pull_request:[^]*types: \[opened, synchronize, reopened, ready_for_review\]/);
  assert.match(workflow,/permissions:[^]*contents: read[^]*pull-requests: read/);
  assert.match(workflow,/timeout-minutes: 5/);
  assert.match(workflow,/node scripts\/tenx-coordination\.mjs/);
  assert.doesNotMatch(workflow,/contents: write|pull-requests: write|issues: write/);
});

test('guard uses GitHub as recovery truth and never mutates repository state',()=>{
  assert.match(script,/GITHUB_REPOSITORY/);
  assert.match(script,/\/pulls\?state=open/);
  assert.match(script,/\/pulls\/\$\{number\}\/files/);
  assert.match(script,/GITHUB_STEP_SUMMARY/);
  assert.doesNotMatch(script,/method:\s*['"](?:POST|PATCH|PUT|DELETE)['"]/);
  assert.doesNotMatch(script,/setInterval\s*\(|setTimeout\s*\(/);
});

test('restart documentation makes GitHub state authoritative after a hung chat',()=>{
  assert.match(recovery,/Do not keep meaningful work only in conversation state/);
  assert.match(recovery,/open PR is the durable work claim/);
  assert.match(recovery,/Exact changed-file overlap with another open PR is blocking/);
  assert.match(recovery,/no update for more than 24 hours has an expired area claim/);
  assert.match(recovery,/Fetch current `main`/);
  assert.match(recovery,/CI and PR state, not chat history, are the recovery source of truth/);
});
