import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {youtubeMediaInternals} from '../src/youtube-media-api.mjs';

const worker=fs.readFileSync(new URL('../cloudflare/worker.mjs',import.meta.url),'utf8');
const frontend=fs.readFileSync(new URL('../media-youtube-v66.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../media-youtube-v66.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const headers=fs.readFileSync(new URL('../_headers',import.meta.url),'utf8');
const envExample=fs.readFileSync(new URL('../.env.example',import.meta.url),'utf8');
const workflow=fs.readFileSync(new URL('../.github/workflows/cloudflare-deploy.yml',import.meta.url),'utf8');

const {OFFICIAL_CHANNELS,allowedVideo}=youtubeMediaInternals;
const titans={...OFFICIAL_CHANNELS.find(channel=>channel.key==='titans'),id:'UCtitans123',title:'Tennessee Titans'};
const nfl={...OFFICIAL_CHANNELS.find(channel=>channel.key==='nfl'),id:'UCnfl123',title:'NFL'};
function video(overrides={}){
  return {
    id:'abcDEF123_-',
    snippet:{channelId:titans.id,title:'Titans practice highlights',description:'Official Tennessee Titans video',liveBroadcastContent:'none',publishedAt:'2026-08-28T12:00:00Z'},
    status:{embeddable:true,privacyStatus:'public',madeForKids:false},
    contentDetails:{duration:'PT3M'},
    ...overrides,
  };
}

test('official YouTube sources are limited to the Titans and NFL handles',()=>{
  assert.deepEqual(OFFICIAL_CHANNELS.map(channel=>channel.handle),['@Titans','@NFL']);
  assert.ok(OFFICIAL_CHANNELS.every(channel=>/^https:\/\/www\.youtube\.com\/@(?:Titans|NFL)$/.test(channel.channelUrl)));
});

test('rights filter admits only public embeddable non-live official uploads',()=>{
  assert.equal(allowedVideo(titans,video()),true);
  assert.equal(allowedVideo(titans,video({status:{embeddable:false,privacyStatus:'public',madeForKids:false}})),false);
  assert.equal(allowedVideo(titans,video({status:{embeddable:true,privacyStatus:'private',madeForKids:false}})),false);
  assert.equal(allowedVideo(titans,video({status:{embeddable:true,privacyStatus:'public',madeForKids:true}})),false);
  assert.equal(allowedVideo(titans,video({snippet:{channelId:titans.id,title:'Titans LIVE',description:'Watch live',liveBroadcastContent:'live'}})),false);
  assert.equal(allowedVideo(titans,video({snippet:{channelId:titans.id,title:'Titans full game replay',description:'',liveBroadcastContent:'none'}})),false);
  assert.equal(allowedVideo(nfl,video({snippet:{channelId:nfl.id,title:'Tennessee Titans Top Plays',description:'',liveBroadcastContent:'none'}})),true);
  assert.equal(allowedVideo(nfl,video({snippet:{channelId:nfl.id,title:'Packers Top Plays',description:'Green Bay',liveBroadcastContent:'none'}})),false);
});

test('Worker exposes cached server-side media API and never sends the key to the browser',()=>{
  assert.match(worker,/youtubeMediaRoute/);
  assert.match(worker,/route==='media-videos'/);
  assert.match(worker,/youtubeData:Boolean\(env\?\.YOUTUBE_API_KEY\)/);
  assert.doesNotMatch(frontend,/YOUTUBE_API_KEY/);
  assert.match(frontend,/fetch\('\/api\/media-videos'/);
});

test('IFrame API loads only after explicit Play interaction and handles revoked embed permission',()=>{
  assert.match(frontend,/data-youtube-play/);
  assert.match(frontend,/async function play\(button\)/);
  assert.match(frontend,/function loadIframeApi\(\)/);
  assert.match(frontend,/https:\/\/www\.youtube\.com\/iframe_api/);
  assert.match(frontend,/document\.head\.appendChild\(script\)/);
  assert.equal((frontend.match(/loadIframeApi\(\)/g)||[]).length,2,'IFrame loader should have one definition and one call site');
  assert.match(frontend,/async function play\(button\)[\s\S]*const YT=await loadIframeApi\(\)/);
  assert.doesNotMatch(frontend,/^\s*loadIframeApi\(\);/m);
  assert.match(frontend,/autoplay:0/);
  assert.match(frontend,/onReady:event=>event\.target\.playVideo\(\)/);
  assert.match(frontend,/onError:event=>fallbackPlayer/);
});

test('media shell and CSP explicitly allow only the YouTube resources needed for embeds',()=>{
  assert.match(html,/media-youtube-v66\.css/);
  assert.match(html,/media-youtube-v66\.js/);
  assert.match(headers,/script-src[^\n]*https:\/\/www\.youtube\.com[^\n]*https:\/\/s\.ytimg\.com/);
  assert.match(headers,/img-src[^\n]*https:\/\/i\.ytimg\.com/);
  assert.match(headers,/connect-src 'self' https:\/\/api\.sleeper\.app;/);
  assert.match(headers,/frame-src https:\/\/www\.youtube\.com https:\/\/www\.youtube-nocookie\.com;/);
  assert.match(headers,/frame-ancestors 'none'/);
  assert.match(css,/min-height:44px/);
});

test('YouTube Data API key remains an optional server-only deployment secret',()=>{
  assert.match(envExample,/YOUTUBE_API_KEY=/);
  assert.match(workflow,/YOUTUBE_API_KEY: \$\{\{ secrets\.YOUTUBE_API_KEY \}\}/);
  assert.match(workflow,/'YOUTUBE_API_KEY'/);
  assert.match(workflow,/youtube=true/);
  assert.doesNotMatch(envExample,/NEXT_PUBLIC_YOUTUBE/);
});
