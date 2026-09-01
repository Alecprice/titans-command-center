import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const js=fs.readFileSync(new URL('../fan-enrichment-v13.js',import.meta.url),'utf8');
const data=fs.readFileSync(new URL('../src/data.mjs',import.meta.url),'utf8');

function fmtDateValue(value){
  if(value==null||String(value).trim()==='')return'TBD';
  const d=new Date(value);
  return Number.isNaN(d.getTime())?'TBD':'dated';
}

test('Fan Hub date formatting fails closed for unknown kickoff values',()=>{
  assert.equal(fmtDateValue(null),'TBD');
  assert.equal(fmtDateValue(undefined),'TBD');
  assert.equal(fmtDateValue(''),'TBD');
  assert.equal(fmtDateValue('   '),'TBD');
  assert.equal(fmtDateValue('not-a-date'),'TBD');
  assert.equal(fmtDateValue('2026-09-13T17:00:00Z'),'dated');
});

test('Fan Hub source cannot render null schedule dates as Unix epoch',()=>{
  assert.match(js,/const fmtDate=value=>\{if\(value==null\|\|String\(value\)\.trim\(\)===''\)return'TBD';/);
  assert.doesNotMatch(js,/const fmtDate=value=>\{const d=new Date\(value\)/);
  assert.match(js,/detail:\/final\/i\.test\(String\(g\.status\|\|''\)\)\?`Final \$\{g\.score\}-\$\{g\.opponentScore\}`:fmtDate\(g\.date\)/);
  assert.match(data,/id:'wk18',[^\n]*date:null,[^\n]*dateTbd:true/);
});
