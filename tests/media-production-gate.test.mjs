import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('production deployment gates on Listen Watch browser interactions',()=>{
  const workflow=read('.github/workflows/cloudflare-deploy.yml');
  const smoke=read('scripts/media-browser-smoke.py');
  assert.match(workflow,/Run Listen Watch browser regression/);
  assert.match(workflow,/id: media_browser/);
  assert.match(workflow,/python scripts\/media-browser-smoke\.py/);
  assert.match(workflow,/steps\.media_browser\.outcome == 'success'/);
  assert.match(workflow,/Listen Watch browser regression/);
  assert.match(smoke,/territory_checks/);
  assert.match(smoke,/1045thezone\.com\/player\/\?playerID=3234/);
  assert.match(smoke,/broadcast\/titans-radio\/live-game-day-audio/);
  assert.match(smoke,/rawEmbeddedAudio/);
  assert.match(smoke,/Mobile territory controls invalid/);
  assert.match(smoke,/Media browser console has severe errors/);
});
