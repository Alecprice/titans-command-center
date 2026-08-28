import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {FREE_SOURCE_LINKS,normalizeBlueskyPosts,parseRedditFeed,parseTitansFeed} from '../src/x-social-api.mjs';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('official Titans RSS normalization stays source-backed and safe',()=>{
  const rss=`<rss><channel><item><title><![CDATA[Cam Ward update]]></title><link>https://www.tennesseetitans.com/news/cam-ward-update</link><guid>news-1</guid><description><![CDATA[<p>Official team update.</p>]]></description><pubDate>Fri, 28 Aug 2026 16:00:00 GMT</pubDate></item></channel></rss>`;
  const items=parseTitansFeed(rss,{kind:'official-news',source:'Titans Official'});
  assert.equal(items.length,1);
  assert.equal(items[0].official,true);
  assert.equal(items[0].source,'Titans Official');
  assert.equal(items[0].text,'Official team update.');
  assert.match(items[0].url,/^https:\/\/www\.tennesseetitans\.com\/news\//);
});

test('Reddit RSS and Bluesky public results normalize without paid credentials',()=>{
  const atom=`<feed><entry><id>t3_abc</id><title>Titans fan thread</title><updated>2026-08-28T16:00:00Z</updated><author><name>/u/titanfan</name></author><link href="https://www.reddit.com/r/Tennesseetitans/comments/abc/thread/"/><content type="html">&lt;p&gt;Titan Up&lt;/p&gt;</content></entry></feed>`;
  const reddit=parseRedditFeed(atom);
  assert.equal(reddit.length,1);
  assert.equal(reddit[0].source,'Reddit');
  assert.equal(reddit[0].author,'titanfan');
  assert.equal(reddit[0].text,'Titan Up');
  const bluesky=normalizeBlueskyPosts({posts:[{uri:'at://did:plc:test/app.bsky.feed.post/3abc',author:{handle:'fan.bsky.social',displayName:'Titans Fan'},record:{text:'#TitanUp from Nashville',createdAt:'2026-08-28T16:00:00Z'}}]});
  assert.equal(bluesky.length,1);
  assert.equal(bluesky[0].source,'Bluesky');
  assert.match(bluesky[0].url,/^https:\/\/bsky\.app\/profile\//);
});

test('social pulse is free-only, cached, and has no X credential dependency',async()=>{
  const [api,worker,client,env]=await Promise.all([read('src/x-social-api.mjs'),read('cloudflare/worker.mjs'),read('titans-social-v49.js'),read('.env.example')]);
  assert.match(api,/freeOnly:true/);
  assert.match(api,/public\.api\.bsky\.app/);
  assert.match(api,/reddit\.com\/r\/Tennesseetitans\/new\.rss/);
  assert.match(api,/titansonline\.com\/rss\/news/);
  assert.match(api,/s-maxage=600, stale-while-revalidate=3600/);
  assert.match(worker,/route==='social-pulse'\)return await cachedAdapterData/);
  assert.doesNotMatch(api,/X_BEARER_TOKEN|api\.x\.com/);
  assert.doesNotMatch(client,/X_BEARER_TOKEN|x\.com\/search|View on X/);
  assert.doesNotMatch(env,/X_BEARER_TOKEN=/);
  assert.ok(FREE_SOURCE_LINKS.some(link=>link.label==='Facebook'));
  assert.ok(FREE_SOURCE_LINKS.some(link=>link.label==='YouTube'));
});

test('Home pulse communicates free sources and remains mobile/PWA packaged',async()=>{
  const [client,css,sw,tickets]=await Promise.all([read('titans-social-v49.js'),read('titans-social-v49.css'),read('sw.js'),read('tickets-v47.js')]);
  assert.match(tickets,/import '\.\/titans-social-v49\.js'/);
  assert.match(client,/Official updates \+ Titans fan conversation/);
  assert.match(client,/FREE SOURCES/);
  assert.match(client,/data-social-refresh/);
  assert.match(client,/Titans RSS \+ Bluesky public API \+ Reddit RSS/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/@media\(max-width:390px\)/);
  assert.match(sw,/titans-cc-brand-2026-v72/);
  assert.match(sw,/titans-social-v49\.js/);
  assert.match(sw,/titans-social-v49\.css/);
});
