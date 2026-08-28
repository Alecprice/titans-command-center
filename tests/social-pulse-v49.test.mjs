import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeXPosts,safeXPostUrl,TITANS_SOCIAL_QUERY,xSearchLinks} from '../src/x-social-api.mjs';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Titans X query covers branded fan conversation without retweets or replies',()=>{
  assert.match(TITANS_SOCIAL_QUERY,/#TitanUp/);
  assert.match(TITANS_SOCIAL_QUERY,/#TitansNation/);
  assert.match(TITANS_SOCIAL_QUERY,/Titans Nation/);
  assert.match(TITANS_SOCIAL_QUERY,/Tennessee Titans/);
  assert.match(TITANS_SOCIAL_QUERY,/-is:retweet/);
  assert.match(TITANS_SOCIAL_QUERY,/-is:reply/);
  assert.ok(xSearchLinks().length>=4);
});

test('X post normalization preserves attribution and safe permalinks',()=>{
  const posts=normalizeXPosts({
    data:[{id:'1234567890123456789',author_id:'42',text:'#TitanUp from Nashville',created_at:'2026-08-28T16:00:00Z',public_metrics:{like_count:5},entities:{hashtags:[{start:0,end:8,tag:'TitanUp'}]}}],
    includes:{users:[{id:'42',username:'TitansFan',name:'Titans Fan',verified:false,profile_image_url:'https://pbs.twimg.com/profile_images/example_normal.jpg'}]},
  });
  assert.equal(posts.length,1);
  assert.equal(posts[0].text,'#TitanUp from Nashville');
  assert.equal(posts[0].author.username,'TitansFan');
  assert.equal(posts[0].url,'https://x.com/TitansFan/status/1234567890123456789');
  assert.equal(posts[0].entities[0].type,'hashtag');
  assert.match(safeXPostUrl('TitansFan','1234567890123456789'),/^https:\/\/x\.com\//);
});

test('X bearer token remains server-only and social route is edge cached',async()=>{
  const [api,worker,client,env]=await Promise.all([read('src/x-social-api.mjs'),read('cloudflare/worker.mjs'),read('titans-social-v49.js'),read('.env.example')]);
  assert.match(api,/X_BEARER_TOKEN/);
  assert.match(api,/s-maxage=900, stale-while-revalidate=3600/);
  assert.match(worker,/route==='social-pulse'\)return await cachedAdapterData/);
  assert.doesNotMatch(client,/X_BEARER_TOKEN/);
  assert.match(env,/X_BEARER_TOKEN=/);
});

test('Home social pulse is lightweight, accessible, and PWA packaged',async()=>{
  const [client,css,sw,tickets]=await Promise.all([read('titans-social-v49.js'),read('titans-social-v49.css'),read('sw.js'),read('tickets-v47.js')]);
  assert.match(tickets,/import '\.\/titans-social-v49\.js'/);
  assert.match(client,/What Titans Nation is saying/);
  assert.match(client,/data-social-refresh/);
  assert.match(client,/View on X/);
  assert.match(client,/profileImageUrl/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(sw,/titans-social-v49\.js/);
  assert.match(sw,/titans-social-v49\.css/);
});
