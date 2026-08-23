import test from 'node:test';
import assert from 'node:assert/strict';
import {auditedPreseasonGames,auditedTeamPreseasonStats,auditedPlayerPreseasonStats,PRESEASON_GAMEBOOK_URL} from '../src/preseason-p1-20260813.mjs';

const fields=(name,category)=>Object.fromEntries((auditedPlayerPreseasonStats[name]||[]).find(row=>row.category===category)?.fields?.map(row=>[row.label,row.value])||[]);

test('P1 score and team totals match the official TEN at SF gamebook',()=>{
  assert.equal(auditedPreseasonGames.length,1);
  assert.equal(auditedPreseasonGames[0].status,'Final · TEN 19–13 SF');
  assert.equal(auditedPreseasonGames[0].source,'NFL official gamebook');
  assert.match(PRESEASON_GAMEBOOK_URL,/static\.www\.nfl\.com/);
  assert.equal(auditedTeamPreseasonStats.totalYards,'279');
  assert.equal(auditedTeamPreseasonStats.rushingYards,'167');
  assert.equal(auditedTeamPreseasonStats.netPassingYards,'112');
  assert.equal(auditedTeamPreseasonStats.fieldGoals,'4/4');
});

test('Cam Ward and Mitchell Trubisky P1 passing lines stay source-accurate',()=>{
  assert.deepEqual(fields('Cam Ward','Passing'),{'CMP/ATT':'5/12',YDS:'57',TD:'0',INT:'0',RTG:'56.6'});
  assert.deepEqual(fields('Mitchell Trubisky','Passing'),{'CMP/ATT':'2/3',YDS:'23',TD:'0',INT:'0',RTG:'89.6'});
});

test('Tyjae Spears and Gunnar Helm P1 skill lines stay source-accurate',()=>{
  const rushing=fields('Tyjae Spears','Rushing'),receiving=fields('Tyjae Spears','Receiving'),helm=fields('Gunnar Helm','Receiving');
  assert.equal(rushing.ATT,'4');assert.equal(rushing.YDS,'35');assert.equal(rushing.LG,'25');
  assert.equal(receiving.REC,'1');assert.equal(receiving.YDS,'4');
  assert.equal(helm.REC,'1');assert.equal(helm.YDS,'16');assert.equal(helm.LG,'16');
});

test("Cor'Dale Flott and Joey Slye P1 lines stay source-accurate",()=>{
  const flott=fields("Cor'Dale Flott",'Defense'),slye=fields('Joey Slye','Kicking');
  assert.equal(flott.TKL,'4');assert.equal(flott.AST,'1');assert.equal(flott.COMB,'5');
  assert.equal(slye.FG,'4/4');assert.equal(slye['FG LG'],'58');assert.equal(slye.XP,'1/1');assert.equal(slye.PTS,'13');
});
