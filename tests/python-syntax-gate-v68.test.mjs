import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const syntax=fs.readFileSync(new URL('../scripts/check-syntax.mjs',import.meta.url),'utf8');
const freshness=fs.readFileSync(new URL('../scripts/freshness-browser-smoke.py',import.meta.url),'utf8');

test('syntax gate validates Python scripts with SyntaxWarning promoted to failure',()=>{
  assert.match(syntax,/entry\.name\.endsWith\('\.py'\)/);
  assert.match(syntax,/error::SyntaxWarning/);
  assert.match(syntax,/compile\(p\.read_text/);
  assert.match(syntax,/Python is required to validate browser regression scripts/);
});

test('freshness smoke keeps embedded JavaScript regex inside a raw Python string',()=>{
  assert.match(freshness,/driver\.execute_script\(r"""/);
  assert.match(freshness,/\.replace\(\/\\s\+\/g,' '\)/);
});
