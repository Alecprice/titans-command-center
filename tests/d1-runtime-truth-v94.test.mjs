import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('base runtime earns live state only from the explicit D1 live contract',()=>{
  assert.doesNotMatch(app,/mode\s*=\s*['"]neon['"]/i);
  assert.doesNotMatch(app,/mode\s*===\s*['"]neon['"]/i);
  assert.match(app,/const live=d\.mode==='live-database'&&d\.storage==='cloudflare-d1'&&d\.databaseAvailable!==false&&d\.fallback\?\.active!==true/);
  assert.match(app,/mode=live\?'live':'fallback'/);
  assert.match(app,/db=\{connected:live,schemaVersion:d\.meta\?\.schema_version\|\|null,storage:d\.storage\|\|null,mode:d\.mode\|\|null\}/);
});

test('audited fallback and fetch failure stay visibly fail-closed',()=>{
  assert.match(app,/function badge\(\)\{return `<span class="tag official">\$\{mode==='live'\?'LIVE DATA':'VERIFIED BACKUP'\}<\/span>`\}/);
  assert.match(app,/mode==='live'\?'live roster feed':'verified backup'/);
  assert.match(app,/mode==='live'\?'Live':'Backup'/);
  assert.match(app,/catch\{mode='fallback';db=\{connected:false,schemaVersion:null,storage:null,mode:'audited-fallback'\}\}/);
});

test('base fan surfaces do not expose retired warehouse implementation copy',()=>{
  assert.doesNotMatch(app,/Analytics warehouse|warehouse fills in|Warehouse-ready analytics/i);
  assert.match(app,/Advanced analytics/);
  assert.match(app,/verified play-by-play snapshots/i);
});
