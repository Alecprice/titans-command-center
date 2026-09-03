import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const feature=read('schedule-calendar-v39.js');
const runtime=read('accessibility-runtime.js');
const sw=read('sw.js');

test('schedule calendar is driven only by the loaded schedule and excludes byes and TBD kickoffs',()=>{
  assert.match(feature,/runtime\?\.apiJson\?\.\('\/api\/data',\{ttl:30000,force\}\)/);
  assert.match(feature,/game\.status!=='bye'/);
  assert.match(feature,/!game\.dateTbd&&validDate\(game\.date\)/);
  assert.match(feature,/TBD game/);
  assert.match(feature,/does not guess TBD dates or times/);
});

test('calendar export produces a standards-shaped multi-event ICS with bounded loaded games',()=>{
  assert.match(feature,/slice\(0,25\)/);
  assert.match(feature,/'BEGIN:VCALENDAR'/);
  assert.match(feature,/'BEGIN:VEVENT'/);
  assert.match(feature,/DTSTART:/);
  assert.match(feature,/DTEND:/);
  assert.match(feature,/UID:/);
  assert.match(feature,/X-WR-CALNAME:Tennessee Titans 2026/);
  assert.match(feature,/tennessee-titans-2026-schedule\.ics/);
});

test('schedule calendar keeps official schedule provenance and safe calendar text escaping',()=>{
  assert.match(feature,/OFFICIAL_SCHEDULE='https:\/\/www\.tennesseetitans\.com\/schedule\/'/);
  assert.match(feature,/Source: Tennessee Titans official schedule/);
  assert.match(feature,/replace\(\/,\/g,'\\\\,'\)/);
  assert.match(feature,/target="_blank" rel="noopener noreferrer"/);
});

test('TENX schedule refresh captures a publication revision before the shared API read',()=>{
  assert.match(feature,/let data=null,loading=null,publicationRevision=0/);
  const capture=feature.indexOf('const revision=publicationRevision;');
  const request=feature.indexOf("runtime?.apiJson?.('/api/data',{ttl:30000,force})");
  assert.ok(capture>=0&&request>capture,'publication revision must be captured before the request starts');
});

test('TENX stale schedule success and failure cannot publish into a refreshed view',()=>{
  assert.match(feature,/\.then\(value=>\{if\(revision===publicationRevision\)data=value\?\.ok\?value:\{\};return data;\}\)/);
  assert.match(feature,/\.catch\(\(\)=>\{if\(revision===publicationRevision\)data=\{\};return data;\}\)/);
});

test('TENX stale schedule loads restart the current generation before any empty-state render',()=>{
  const lifecycle=feature.slice(feature.indexOf('.finally(()=>{'),feature.indexOf('return loading;',feature.indexOf('.finally(()=>{')));
  assert.match(lifecycle,/const stale=revision!==publicationRevision/);
  assert.match(lifecycle,/loading=null/);
  assert.match(lifecycle,/if\(stale\)\{if\(route\(\)==='games'\)load\(true\);return;\}/);
  assert.ok(lifecycle.indexOf("if(stale){if(route()==='games')load(true);return;}")<lifecycle.indexOf('queueMicrotask(render)'),'stale generation must restart before render');
});

test('TENX shared refresh invalidates Schedule publication before requesting refreshed data',()=>{
  const refresh="runtime.onRefresh(()=>{data=null;publicationRevision++;if(route()==='games')load(true);});";
  assert.ok(feature.includes(refresh));
  assert.equal((feature.match(/runtime\.onRefresh/g)||[]).length,1);
  assert.equal((feature.match(/runtime\?\.apiJson\?\./g)||[]).length,1);
  assert.doesNotMatch(feature,/\bfetch\s*\(/);
});

test('schedule calendar load lifecycle returns to the real render function without an undefined mount callback',()=>{
  assert.match(feature,/queueMicrotask\(render\)/);
  assert.doesNotMatch(feature,/queueMicrotask\(mount\)/);
});

test('schedule calendar is Schedule-only observer-light touch-safe and packaged offline',()=>{
  assert.match(feature,/route\(\)!=='games'/);
  assert.match(feature,/runtime\.onRoute/);
  assert.match(feature,/runtime\.onAppRender/);
  assert.doesNotMatch(feature,/new MutationObserver/);
  assert.match(feature,/min-height:44px/);
  assert.match(feature,/@media\(max-width:700px\)/);
  assert.match(runtime,/import '\.\/schedule-calendar-v39\.js';/);
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/'\/schedule-calendar-v39\.js'/);
  assert.doesNotMatch(runtime,/my-player-compare-v39/);
  assert.doesNotMatch(sw,/my-player-compare-v39/);
});
