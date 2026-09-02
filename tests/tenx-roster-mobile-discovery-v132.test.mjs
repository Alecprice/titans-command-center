import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../team-room-state-repair-v54.js',import.meta.url),'utf8');

test('TENX roster adds a thumb-friendly unit rail without replacing the canonical select',()=>{
  assert.match(source,/className='roster-unit-quickrail'/);
  assert.match(source,/aria-label','Quick roster unit filters'/);
  assert.match(source,/data-roster-unit-quick="Offense"/);
  assert.match(source,/data-roster-unit-quick="Defense"/);
  assert.match(source,/data-roster-unit-quick="Special Teams"/);
  assert.match(source,/const unit=app\.querySelector\('\.filterbar #ru'\)/);
  assert.match(source,/unit\.dispatchEvent\(new Event\('input',\{bubbles:true\}\)\)/);
  assert.match(source,/unit\.dispatchEvent\(new Event\('change',\{bubbles:true\}\)\)/);
});

test('unit rail stays synchronized with select and clear-filter changes',()=>{
  assert.match(source,/function syncRosterUnitRail\(\)/);
  assert.match(source,/control\.setAttribute\('aria-pressed',String\(active\)\)/);
  assert.match(source,/target\?\.closest\('\[data-roster-clear\]'\)\)queueMicrotask\(syncRosterUnitRail\)/);
  assert.match(source,/event\.target\.matches\('#ru'\)/);
});

test('TENX roster mobile controls meet phone input and touch floors',()=>{
  assert.match(source,/@media\(max-width:640px\)/);
  assert.match(source,/\.filterbar>input,body\[data-route="roster"\] \.filterbar>select\{width:100%;min-width:0;min-height:48px;font-size:16px\}/);
  assert.match(source,/\.roster-unit-quickrail button\{min-height:48px;font-size:13px/);
  assert.match(source,/scroll-snap-type:x proximity/);
});

test('TENX roster cards stop squeezing status into a third phone column',()=>{
  assert.match(source,/@media\(max-width:430px\)/);
  assert.match(source,/\.roster-grid \.player-card\{grid-template-columns:52px minmax\(0,1fr\)/);
  assert.match(source,/\.roster-grid \.player-tag\{grid-column:2;justify-self:start;max-width:100%/);
  assert.match(source,/\.roster-grid \.player-card h3\{font-size:16px;line-height:1\.25;overflow-wrap:anywhere\}/);
});

test('narrow 360px roster keeps jersey identity without crowding player copy',()=>{
  assert.match(source,/@media\(max-width:360px\)/);
  assert.match(source,/grid-template-columns:46px minmax\(0,1fr\)/);
  assert.match(source,/\.roster-grid \.jersey\{width:46px;height:46px/);
});