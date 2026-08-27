import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../team-room.js',import.meta.url),'utf8');

test('Team Room constructs deep-linked controls with the requested semantic state already applied',()=>{
  assert.match(source,/const teamRoomButton=\(view,label,selected\)=>/);
  assert.match(source,/aria-pressed="\$\{selected\?'true':'false'\}"/);
  assert.match(source,/const initialView=requestedRosterView\(\)\|\|trPreferredRosterView/);
  assert.match(source,/switcher\.innerHTML=teamRoomSwitcherMarkup\(initialView\)/);
  assert.match(source,/cutdown\.hidden=initialView!=='cutdown'/);
  assert.match(source,/setRosterView\(initialView,\{persist:false\}\)/);
});

test('Team Room no longer creates a hardcoded Roster-selected frame before applying a Cutdown deep link',()=>{
  assert.doesNotMatch(source,/switcher\.innerHTML='<button type="button" data-team-room-view="roster" class="active" aria-pressed="true"/);
  assert.match(source,/teamRoomButton\('cutdown','Cutdown',view==='cutdown'\)/);
});
