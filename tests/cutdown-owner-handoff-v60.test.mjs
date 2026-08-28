import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../cutdown-command-v23.js',import.meta.url),'utf8');

test('Cutdown asks Team Room owner to reassert selected semantics after async panel rendering',()=>{
  assert.match(source,/const TEAM_ROOM_VIEW_REQUEST='titans:team-room-view-request'/);
  assert.match(source,/function requestCutdownOwner\(app\)/);
  assert.match(source,/view:'cutdown',persist:false,reason:'cutdown-panel-mounted'/);
  assert.match(source,/queueMicrotask\(\(\)=>requestCutdownOwner\(app\)\)/);
  assert.match(source,/requestAnimationFrame\(\(\)=>requestCutdownOwner\(app\)\)/);
});

test('Cutdown handoff never owns aria state or creates synthetic selector clicks',()=>{
  const handoff=source.slice(source.indexOf('function requestCutdownOwner'),source.indexOf('function mountHome'));
  assert.doesNotMatch(handoff,/setAttribute\(['"]aria-pressed/);
  assert.doesNotMatch(handoff,/\.click\(/);
  assert.doesNotMatch(handoff,/history\.(?:pushState|replaceState)/);
});
