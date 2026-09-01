import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { FANTASY_PROP_BOOKS, buildFantasyPropBoard, normalizeOddsApiIoPlayerProps } from '../src/fantasy-props-api.mjs';

const payload={
  updatedAt:'2026-09-01T22:00:00Z',
  bookmakers:{
    DraftKings:[{name:'Player Props',odds:[
      {label:'Cam Ward - Passing Yards',hdp:241.5,over:'1.90',under:'1.90'},
      {label:'Tony Pollard - Rushing Yards',hdp:61.5,over:'1.91',under:'1.89'}
    ]}],
    FanDuel:[{name:'Player Props',odds:[
      {label:'Cam Ward - Passing Yards',hdp:239.5,over:'-105',under:'-115'}
    ]}],
    BetMGM:[{name:'Player Props',odds:[
      {label:'Cam Ward - Passing Yards',hdp:240.5,over:'1.95',under:'1.87'}
    ]}],
    OtherBook:[{name:'Player Props',odds:[
      {label:'Cam Ward - Passing Yards',hdp:240.5,over:'1.90',under:'1.90'}
    ]}]
  }
};

test('Odds-API.io player props normalize the three requested books without leaking other books',()=>{
  const rows=normalizeOddsApiIoPlayerProps(payload,{books:FANTASY_PROP_BOOKS,fetchedAt:'2026-09-01T22:01:00Z'});
  assert.equal(rows.length,4);
  assert.deepEqual(new Set(rows.map(row=>row.bookLabel)),new Set(['DraftKings','FanDuel','BetMGM']));
  const draftKings=rows.find(row=>row.bookKey==='draftkings'&&row.playerName==='Cam Ward');
  assert.ok(draftKings);
  assert.equal(draftKings.marketLabel,'Passing Yards');
  assert.equal(draftKings.line,241.5);
  assert.equal(draftKings.overPrice,-111);
  assert.equal(draftKings.underPrice,-111);
});

test('fantasy prop board groups the same player market across books and exposes reporting coverage',()=>{
  const rows=normalizeOddsApiIoPlayerProps(payload,{books:FANTASY_PROP_BOOKS});
  const board=buildFantasyPropBoard(rows,FANTASY_PROP_BOOKS);
  const cam=board.props.find(prop=>prop.playerName==='Cam Ward'&&prop.marketKey==='passing_yards');
  assert.ok(cam);
  assert.equal(cam.books.draftkings.line,241.5);
  assert.equal(cam.books.fanduel.line,239.5);
  assert.equal(cam.books.betmgm.line,240.5);
  assert.deepEqual(board.coverage,{requested:3,reporting:3});
  assert.equal(board.sources.find(source=>source.key==='draftkings').rowCount,2);
});

test('fantasy prop board keeps a missing source explicit instead of fabricating a quote',()=>{
  const rows=normalizeOddsApiIoPlayerProps({bookmakers:{DraftKings:payload.bookmakers.DraftKings,FanDuel:payload.bookmakers.FanDuel}},{books:FANTASY_PROP_BOOKS});
  const board=buildFantasyPropBoard(rows,FANTASY_PROP_BOOKS);
  assert.equal(board.coverage.reporting,2);
  const betmgm=board.sources.find(source=>source.key==='betmgm');
  assert.equal(betmgm.available,false);
  assert.equal(betmgm.rowCount,0);
});

test('fantasy live prop assets stay wired to the fan-facing three-book contract',()=>{
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const client=fs.readFileSync(new URL('../fantasy-props-v122.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../fantasy-props-v122.css',import.meta.url),'utf8');
  const api=fs.readFileSync(new URL('../api/index.js',import.meta.url),'utf8');
  assert.match(html,/fantasy-props-v122\.css/);
  assert.match(html,/fantasy-props-v122\.js/);
  assert.match(client,/\/api\/fantasy-props/);
  assert.match(client,/DraftKings/);
  assert.match(client,/FanDuel/);
  assert.match(client,/BetMGM/);
  assert.match(client,/NOT REPORTING/);
  assert.match(client,/missing book is shown as unavailable rather than estimated/);
  assert.match(css,/@media \(max-width:620px\)/);
  assert.match(api,/fantasy-props/);
  assert.match(api,/fantasyPropsRoute/);
});
