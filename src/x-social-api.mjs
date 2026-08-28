const TITANS_NEWS_RSS='https://www.titansonline.com/rss/news';
const TITANS_VIDEO_RSS='https://www.titansonline.com/rss/videos';
const REDDIT_RSS='https://www.reddit.com/r/Tennesseetitans/new.rss?limit=10';
const BLUESKY_SEARCH='https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts';

export const FREE_SOURCE_LINKS=[
  {key:'official',label:'Titans News',url:'https://www.tennesseetitans.com/news/'},
  {key:'reddit',label:'r/TennesseeTitans',url:'https://www.reddit.com/r/Tennesseetitans/'},
  {key:'bluesky',label:'Bluesky',url:'https://bsky.app/search?q=Tennessee%20Titans'},
  {key:'facebook',label:'Facebook',url:'https://www.facebook.com/titans'},
  {key:'youtube',label:'YouTube',url:'https://www.youtube.com/titans'},
];

function methodOnly(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET'){res.status(405).json({ok:false,error:'Method not allowed'});return true;}
  return false;
}
function decodeXml(value){
  return String(value||'')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)||32))
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)||32))
    .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}
function stripHtml(value){return decodeXml(value).replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function blocks(xml,tag){const out=[];const re=new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`,'gi');let match;while((match=re.exec(String(xml||''))))out.push(match[1]);return out;}
function tagValue(block,tag){const escaped=tag.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const match=String(block||'').match(new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`,'i'));return match?decodeXml(match[1]).trim():'';}
function atomLink(block){const match=String(block||'').match(/<link\b[^>]*href=(['"])(.*?)\1[^>]*\/?\s*>/i);return match?decodeXml(match[2]).trim():'';}
function isoDate(value){const stamp=Date.parse(String(value||''));return Number.isFinite(stamp)?new Date(stamp).toISOString():'';}
function safeUrl(value,hosts,fallback){
  try{const url=new URL(String(value||''));const host=url.hostname.toLowerCase();return url.protocol==='https:'&&hosts.some(allowed=>host===allowed||host.endsWith(`.${allowed}`))?url.href:fallback;}catch{return fallback;}
}
function uniqueByUrl(items){const seen=new Set();return items.filter(item=>{if(!item.url||seen.has(item.url))return false;seen.add(item.url);return true;});}

export function parseTitansFeed(xml,{kind='official-news',source='Titans Official'}={}){
  const fallback=kind==='official-video'?'https://www.tennesseetitans.com/video/':'https://www.tennesseetitans.com/news/';
  return blocks(xml,'item').map((item,index)=>{
    const title=stripHtml(tagValue(item,'title'));
    const url=safeUrl(tagValue(item,'link'),['tennesseetitans.com','titansonline.com'],fallback);
    const summary=stripHtml(tagValue(item,'description')).slice(0,360);
    const createdAt=isoDate(tagValue(item,'pubDate')||tagValue(item,'dc:date'));
    return {id:`${kind}:${tagValue(item,'guid')||url||index}`,kind,source,title:title||'Tennessee Titans update',text:summary,author:'Tennessee Titans',createdAt,url,official:true};
  }).filter(item=>item.url&&item.title).slice(0,10);
}

export function parseRedditFeed(xml){
  return blocks(xml,'entry').map((entry,index)=>{
    const title=stripHtml(tagValue(entry,'title'));
    const url=safeUrl(atomLink(entry),['reddit.com'],'https://www.reddit.com/r/Tennesseetitans/');
    const author=stripHtml(tagValue(tagValue(entry,'author'),'name')).replace(/^\/u\//,'')||'r/TennesseeTitans';
    const text=stripHtml(tagValue(entry,'content')||tagValue(entry,'summary')).slice(0,320);
    const createdAt=isoDate(tagValue(entry,'updated')||tagValue(entry,'published'));
    return {id:`reddit:${tagValue(entry,'id')||url||index}`,kind:'reddit',source:'Reddit',title:title||'Titans fan discussion',text,author,createdAt,url,official:false};
  }).filter(item=>item.url&&item.title&&!/^\[removed\]$/i.test(item.title)).slice(0,10);
}

export function normalizeBlueskyPosts(payload={}){
  return uniqueByUrl((Array.isArray(payload?.posts)?payload.posts:[]).map(post=>{
    const handle=String(post?.author?.handle||post?.author?.did||'').trim();
    const uri=String(post?.uri||'');
    const rkey=uri.split('/').filter(Boolean).pop()||'';
    const url=handle&&rkey?safeUrl(`https://bsky.app/profile/${encodeURIComponent(handle)}/post/${encodeURIComponent(rkey)}`,['bsky.app'],'https://bsky.app/search?q=Tennessee%20Titans'):'https://bsky.app/search?q=Tennessee%20Titans';
    const text=String(post?.record?.text||'').trim();
    return {id:`bluesky:${uri||url}`,kind:'bluesky',source:'Bluesky',title:String(post?.author?.displayName||handle||'Titans fan'),text:text.slice(0,500),author:handle?`@${handle}`:'Bluesky',createdAt:isoDate(post?.record?.createdAt||post?.indexedAt),url,official:false};
  }).filter(item=>item.text&&item.url)).slice(0,10);
}

async function fetchText(url,accept){
  const upstream=await fetch(url,{headers:{Accept:accept,'User-Agent':'TitansCommandCenter/1.0 free-social-pulse'},signal:AbortSignal.timeout(2500)});
  if(!upstream.ok)throw new Error(`${new URL(url).hostname} ${upstream.status}`);
  return upstream.text();
}
async function fetchTitans(url,options){return parseTitansFeed(await fetchText(url,'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.5'),options);}
async function fetchReddit(){return parseRedditFeed(await fetchText(REDDIT_RSS,'application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5'));}
async function fetchBluesky(){
  const url=new URL(BLUESKY_SEARCH);url.searchParams.set('q','Tennessee Titans');url.searchParams.set('limit','12');url.searchParams.set('sort','latest');
  const upstream=await fetch(url,{headers:{Accept:'application/json','User-Agent':'TitansCommandCenter/1.0 free-social-pulse'},signal:AbortSignal.timeout(2500)});
  if(!upstream.ok)throw new Error(`Bluesky ${upstream.status}`);
  return normalizeBlueskyPosts(await upstream.json());
}
function resultState(result){return result.status==='fulfilled'?{available:true,count:result.value.length,error:null}:{available:false,count:0,error:'Source temporarily unavailable'};}

export async function xSocialRoute(req,res){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=3600');
  const [newsResult,videoResult,blueskyResult,redditResult]=await Promise.allSettled([
    fetchTitans(TITANS_NEWS_RSS,{kind:'official-news',source:'Titans Official'}),
    fetchTitans(TITANS_VIDEO_RSS,{kind:'official-video',source:'Titans Video'}),
    fetchBluesky(),
    fetchReddit(),
  ]);
  const news=newsResult.status==='fulfilled'?newsResult.value:[];
  const videos=videoResult.status==='fulfilled'?videoResult.value:[];
  const bluesky=blueskyResult.status==='fulfilled'?blueskyResult.value:[];
  const reddit=redditResult.status==='fulfilled'?redditResult.value:[];
  const items=uniqueByUrl([...news.slice(0,4),...videos.slice(0,2),...bluesky.slice(0,4),...reddit.slice(0,4)])
    .sort((a,b)=>(Date.parse(b.createdAt)||0)-(Date.parse(a.createdAt)||0))
    .slice(0,12);
  const sources={officialNews:resultState(newsResult),officialVideo:resultState(videoResult),bluesky:resultState(blueskyResult),reddit:resultState(redditResult)};
  const available=items.length>0;
  return res.status(200).json({
    ok:true,provider:'Free Titans Pulse',scope:'official-and-public-fan-feeds',freeOnly:true,configured:true,available,items,posts:items,count:items.length,sources,links:FREE_SOURCE_LINKS,fetchedAt:new Date().toISOString(),
    message:available?'Official Titans updates and public fan conversation from free sources.':'Free social sources are temporarily unavailable. Open the source links directly below.'
  });
}
