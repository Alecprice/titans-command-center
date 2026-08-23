import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const bridge=read('ask-fantasy-bridge-v1.js');
const decision=read('fantasy-decision-center-v3.js');

test('Ask fantasy bridge loads additively from Decision Center',()=>{
  assert.match(decision,/import\('\.\/ask-fantasy-bridge-v1\.js'\)\.catch/);
  assert.match(bridge,/data-fantasy-ask-bridge="ready"/);
  assert.match(bridge,/href="#fantasy"/);
});

test('bridge intercepts explicit fantasy intent without stealing normal Titans questions',()=>{
  assert.match(bridge,/function intercept\(query,event\)/);
  assert.match(bridge,/route\(\)!=='fan'\|\|!fantasyIntent\(query\)/);
  assert.match(bridge,/\bfantasy\b/);
  assert.match(bridge,/start\\s\*\\\/\\s\*sit/);
  assert.match(bridge,/who should i start/);
  assert.match(bridge,/\bwaiver\b/);
  assert.match(bridge,/stopImmediatePropagation/);
  assert.match(bridge,/addEventListener\('click',[\s\S]*,true\)/);
  assert.match(bridge,/addEventListener\('keydown',[\s\S]*,true\)/);
});

test('handoff is transparent and never fabricates a projection',()=>{
  assert.match(bridge,/without inventing a point projection or guarantee/);
  assert.match(bridge,/No projection generated/);
  assert.doesNotMatch(bridge,/projectedPoints|projection\s*[:=]\s*\d/i);
  assert.doesNotMatch(bridge,/method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
});

test('handoff stores bounded device-local intent and does not expose league id',()=>{
  assert.match(bridge,/titans-fantasy-pending-question-v1/);
  assert.match(bridge,/slice\(0,160\)/);
  assert.match(bridge,/Sleeper league/);
  assert.match(bridge,/Connected/);
  assert.doesNotMatch(bridge,/leagueId\}.*innerHTML|\$\{s\.leagueId\}/);
});

test('Decision Center consumes pending Ask intent and preselects up to two matching candidates',()=>{
  assert.match(decision,/PENDING_KEY='titans-fantasy-pending-question-v1'/);
  assert.match(decision,/function pendingMatches\(candidates\)/);
  assert.match(decision,/localStorage\.removeItem\(PENDING_KEY\)/);
  assert.match(decision,/name\.length>3&&q\.includes\(name\)/);
  assert.match(decision,/\.slice\(0,2\)/);
  assert.match(decision,/if\(pending\[0\]\)a\.value=pending\[0\]\.id/);
  assert.match(decision,/if\(pending\[1\]\)b\.value=pending\[1\]\.id/);
});
