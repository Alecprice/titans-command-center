import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const trails=read('legacy-trails-v4.js');

test('final Trail stop offers an intentional Finish action instead of a dead Next control',()=>{
  assert.match(trails,/const nextAction=step===trail\.stops\.length-1\?'<button type="button" data-legacy-trail-finish>Finish trail<\/button>':'<button type="button" data-legacy-trail-next>Next →<\/button>'/);
  assert.match(trails,/\$\{nextAction\}<button type="button" data-legacy-trail-exit>Exit trail<\/button>/);
  assert.doesNotMatch(trails,/data-legacy-trail-next \$\{step===trail\.stops\.length-1\?'disabled':''\}/);
});

test('Finish is accepted only for the active final stop',()=>{
  assert.match(trails,/event\.target\.closest\('\[data-legacy-trail-finish\]'\)&&active&&step===active\.stops\.length-1/);
  assert.match(trails,/data-legacy-trail-next\]'\)&&active&&step<active\.stops\.length-1/);
});

test('Finish reuses existing Trail teardown and returns focus to the completed chooser card',()=>{
  const start=trails.indexOf("if(event.target.closest('[data-legacy-trail-finish]')");
  const end=trails.indexOf("if(event.target.closest('[data-legacy-trail-exit]')",start);
  assert.ok(start>=0&&end>start,'Finish handler should be present before Exit');
  const finish=trails.slice(start,end);
  assert.match(finish,/const trailId=active\.id/);
  assert.match(finish,/deactivate\(\)/);
  assert.match(finish,/focusTrailChooser\(root,trailId\)/);
  assert.match(finish,/return/);
});

test('Passport remains the single completion authority and final activation earns the stamp before Finish',()=>{
  assert.match(trails,/if\(record\)passport=stampPassport\(passport,active,step\);\s*paint\(\)/);
  const start=trails.indexOf("if(event.target.closest('[data-legacy-trail-finish]')");
  const end=trails.indexOf("if(event.target.closest('[data-legacy-trail-exit]')",start);
  const finish=trails.slice(start,end);
  assert.doesNotMatch(finish,/stampPassport|persistPassport|resetPassport|localStorage/);
});

test('Finish inherits existing desktop and phone action accessibility without another lifecycle owner',()=>{
  assert.match(trails,/\.legacy-trail-actions button\{min-height:44px/);
  assert.match(trails,/@media\(max-width:760px\)[^\n]*\.legacy-trail-actions button\{min-height:48px;font-size:12px\}/);
  assert.match(trails,/\.legacy-trail-actions button:focus-visible/);
  assert.doesNotMatch(trails,/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|setInterval\(|new MutationObserver/);
});
