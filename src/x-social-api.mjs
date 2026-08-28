const X_RECENT_SEARCH='https://api.x.com/2/tweets/search/recent';
export const TITANS_SOCIAL_QUERY='(#TitanUp OR #TitansNation OR "Titans Nation" OR "Tennessee Titans") lang:en -is:retweet -is:reply';

function methodOnly(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET'){res.status(405).json({ok:false,error:'Method not allowed'});return true;}
  return false;
}
function cleanHandle(value){return String(value||'').replace(/[^A-Za-z0-9_]/g,'').slice(0,15);}
function cleanId(value){return /^\d{5,30}$/.test(String(value||''))?String(value):'';}
function cleanImageUrl(value){
  try{const url=new URL(String(value||''));return url.protocol==='https:'&&(url.hostname==='pbs.twimg.com'||url.hostname.endsWith('.twimg.com'))?url.href:'';}catch{return'';}
}
function normalizeEntities(entities={}){
  const pick=(items,type)=>Array.isArray(items)?items.map(item=>({type,start:Number(item?.start),end:Number(item?.end),tag:String(item?.tag||''),username:cleanHandle(item?.username),url:String(item?.url||''),expandedUrl:String(item?.expanded_url||''),displayUrl:String(item?.display_url||'')})).filter(item=>Number.isInteger(item.start)&&Number.isInteger(item.end)&&item.start>=0&&item.end>item.start):[];
  return [...pick(entities.hashtags,'hashtag'),...pick(entities.mentions,'mention'),...pick(entities.urls,'url')].sort((a,b)=>a.start-b.start||a.end-b.end);
}
export function safeXPostUrl(username,id){
  const handle=cleanHandle(username),postId=cleanId(id);
  return handle&&postId?`https://x.com/${handle}/status/${postId}`:'https://x.com/search?q=%23TitanUp&f=live';
}
export function xSearchLinks(){
  const tags=['#TitanUp','#TitansNation','"Titans Nation"','"Tennessee Titans"'];
  return tags.map(label=>({label,url:`https://x.com/search?q=${encodeURIComponent(label)}&src=typed_query&f=live`}));
}
export function normalizeXPosts(payload={}){
  const users=new Map((Array.isArray(payload?.includes?.users)?payload.includes.users:[]).map(user=>[String(user.id||''),user]));
  return (Array.isArray(payload?.data)?payload.data:[]).map(post=>{
    const user=users.get(String(post?.author_id||''))||{};
    const username=cleanHandle(user.username);
    const metrics=post?.public_metrics||{};
    return {
      id:cleanId(post?.id),
      text:String(post?.text||''),
      createdAt:String(post?.created_at||''),
      author:{name:String(user?.name||username||'X user').slice(0,120),username,verified:Boolean(user?.verified),profileImageUrl:cleanImageUrl(user?.profile_image_url)},
      metrics:{likes:Number(metrics.like_count)||0,reposts:Number(metrics.retweet_count)||0,replies:Number(metrics.reply_count)||0,quotes:Number(metrics.quote_count)||0},
      entities:normalizeEntities(post?.entities),
      url:safeXPostUrl(username,post?.id),
    };
  }).filter(post=>post.id&&post.text&&post.author.username).slice(0,8);
}
export async function xSocialRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=3600');
  const bearer=String(env?.X_BEARER_TOKEN||'').trim();
  const base={ok:true,provider:'X',scope:'recent-search-last-7-days',query:TITANS_SOCIAL_QUERY,searchLinks:xSearchLinks(),fetchedAt:new Date().toISOString()};
  if(!bearer)return res.status(200).json({...base,configured:false,available:false,posts:[],message:'Connect an X API bearer token to show recent Titans fan posts here.'});
  const url=new URL(X_RECENT_SEARCH);
  url.searchParams.set('query',TITANS_SOCIAL_QUERY);
  url.searchParams.set('max_results','10');
  url.searchParams.set('sort_order','recency');
  url.searchParams.set('tweet.fields','created_at,author_id,public_metrics,lang,entities');
  url.searchParams.set('expansions','author_id');
  url.searchParams.set('user.fields','username,name,verified,profile_image_url');
  try{
    const upstream=await fetch(url,{headers:{Accept:'application/json',Authorization:`Bearer ${bearer}`,'User-Agent':'TitansCommandCenter/1.0 social-pulse'},signal:AbortSignal.timeout(2500)});
    if(!upstream.ok)throw new Error(`X ${upstream.status}`);
    const payload=await upstream.json();
    const posts=normalizeXPosts(payload);
    return res.status(200).json({...base,configured:true,available:true,posts,count:posts.length});
  }catch(error){
    console.error('[x-social-pulse]',error);
    return res.status(200).json({...base,configured:true,available:false,posts:[],message:'Recent X posts are temporarily unavailable. Use the live hashtag links below.'});
  }
}
