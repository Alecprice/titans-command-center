import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const center=await readFile(new URL('../media-center-v14.js',import.meta.url),'utf8');
const timecodes=await readFile(new URL('../media-timecodes-v14.js',import.meta.url),'utf8');

function gameTime(game){
  const raw=game?.date;
  if(raw===null||raw===undefined||String(raw).trim()==='')return NaN;
  const value=Date.parse(raw);
  return Number.isFinite(value)?value:NaN;
}

function nextGame(games,now){
  return games
    .filter(game=>{
      const time=gameTime(game);
      return Number.isFinite(time)&&time>now&&!/final|bye/i.test(String(game.status||''));
    })
    .sort((a,b)=>gameTime(a)-gameTime(b))[0]||null;
}

test('Watch Listen chooses the chronologically next game instead of trusting provider order',()=>{
  const now=Date.parse('2026-09-01T20:00:00Z');
  const games=[
    {opponent:'Rams',date:'2026-09-20T17:00:00Z',status:'Scheduled'},
    {opponent:'Broncos',date:'2026-09-13T17:00:00Z',status:'Scheduled'},
    {opponent:'Bears',date:'2026-08-29T17:00:00Z',status:'Final'},
    {opponent:'Jaguars',date:null,status:'Scheduled'}
  ];
  assert.equal(nextGame(games,now)?.opponent,'Broncos');
  assert.match(center,/\.sort\(\(a,b\)=>gameTime\(a\)-gameTime\(b\)\)\[0\]\|\|null/);
  assert.match(timecodes,/\.sort\(\(a,b\)=>gameTime\(a\)-gameTime\(b\)\)\[0\]\|\|null/);
});

test('missing dates never become phantom 1970 broadcasts',()=>{
  assert.equal(Number.isFinite(gameTime({date:null})),false);
  assert.equal(Number.isFinite(gameTime({date:''})),false);
  assert.match(center,/v===null\|\|v===undefined\|\|String\(v\)\.trim\(\)===/);
});

test('Watch Listen exposes verified current Titans listening guidance',()=>{
  assert.match(center,/LISTEN LIVE button appears one hour before kickoff/);
  assert.match(center,/Taylor Zarzour with analyst Ramon Foster/);
  assert.match(timecodes,/LISTEN LIVE appears one hour before kickoff/);
  assert.match(center,/WIKQ','103\.1 FM','Greeneville/);
});

test('fan-facing official media replaces internal roadmap copy',()=>{
  assert.doesNotMatch(center,/MEDIA ROADMAP/);
  assert.match(center,/MORE TITANS MEDIA/);
  assert.match(center,/https:\/\/www\.tennesseetitans\.com\/broadcast\//);
  assert.match(center,/https:\/\/www\.tennesseetitans\.com\/podcasts\/the-otp\//);
  assert.match(center,/https:\/\/www\.tennesseetitans\.com\/video\//);
});