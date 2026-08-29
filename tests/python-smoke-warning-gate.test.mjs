import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const runtime=read('scripts/runtime-365-browser-smoke.py');
const analytics=read('scripts/analytics-browser-smoke.py');
const quality=read('.github/workflows/quality.yml');

test('browser smokes use raw Python strings where embedded JavaScript contains regex escapes',()=>{
  assert.match(runtime,/execute_script\(r"""[\s\S]*?replace\(\/\\s\+\/g,' '\)/);
  const rawAnalytics=[...analytics.matchAll(/execute_script\(r"""[\s\S]*?replace\(\/\\s\+\/g,' '\)/g)];
  assert.equal(rawAnalytics.length,4,'all analytics regex-bearing execute_script blocks should use raw Python strings');
});

test('quality gate promotes Python SyntaxWarning to a CI failure',()=>{
  assert.match(quality,/python -W error::SyntaxWarning -m py_compile/);
});
