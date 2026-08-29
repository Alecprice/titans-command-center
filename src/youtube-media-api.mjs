const YOUTUBE_API='https://www.googleapis.com/youtube/v3';
const OFFICIAL_CHANNELS=[
  {key:'titans',handle:'@Titans',label:'Tennessee Titans',channelUrl:'https://www.youtube.com/@Titans',playlistLimit:18},
  {key:'nfl',handle:'@NFL',label:'NFL',channelUrl:'https://www.youtube.com/@NFL',playlistLimit:36},
];
const LIVE_OR_FULL_GAME=/\b(live stream|watch live|full game|full-game|game replay|full broadcast|live broadcast)\b/i;
const TITANS_RELEVANCE=/\b(tennessee titans|titans)\b/i;

function methodOnly(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET'){res.status(405).json({ok:false,error:'Method not allowed'});return true;}
  return false;
}
function clean(value){return String(value??'').replace(/\s+/g,' ').trim();}
function isoDate(value){const stamp=Date.parse(String(value||''));return Number.isFinite(stamp)?new Date(stamp).toISOString():'';}
function safeVideoId(value){const id=String(value||'').trim();return /^[A-Za-z0-9_-]{11}$/.test(id)?id:'';}
function apiError(status){const error=new Error(`YouTube Data API ${status}`);error.status=status;return error;}
async function youtubeJson(path,params,key){
  const url=new URL(`${YOUTUBE_API}/${path}`);
  for(const [name,value] of Object.entries(params||{})){if(value!==undefined&&value!==null&&value!=='')url.searchParams.set(name,String(value));}
  url.searchParams.set('key',key);
  const response=await fetch(url,{headers:{Accept:'application/json','User-Agent':'TitansCommandCenter/1.0 official-youtube-media'},signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw apiError(response.status);
  return response.json();
}
async function resolveChannel(config,key){
  const payload=await youtubeJson('channels',{part:'id,snippet,contentDetails',forHandle:config.handle},key);
  const channel=Array.isArray(payload?.items)?payload.items[0]:null;
  const id=clean(channel?.id),uploads=clean(channel?.contentDetails?.relatedPlaylists?.uploads);
  if(!id||!uploads)throw new Error(`YouTube channel ${config.handle} did not expose an uploads playlist`);
  return {...config,id,uploads,title:clean(channel?.snippet?.title)||config.label};
}
async function uploadVideoIds(channel,key){
  const payload=await youtubeJson('playlistItems',{part:'snippet,contentDetails',playlistId:channel.uploads,maxResults:Math.min(50,channel.playlistLimit||25)},key);
  return (Array.isArray(payload?.items)?payload.items:[]).map(item=>safeVideoId(item?.contentDetails?.videoId||item?.snippet?.resourceId?.videoId)).filter(Boolean);
}
function sourceRelevant(channel,video){
  if(channel.key==='titans')return true;
  const text=`${clean(video?.snippet?.title)} ${clean(video?.snippet?.description)}`;
  return TITANS_RELEVANCE.test(text);
}
function allowedVideo(channel,video){
  const id=safeVideoId(video?.id),snippet=video?.snippet||{},status=video?.status||{};
  const text=`${clean(snippet.title)} ${clean(snippet.description)}`;
  if(!id||String(snippet.channelId||'')!==channel.id)return false;
  if(status.embeddable!==true||status.privacyStatus!=='public')return false;
  if(status.madeForKids===true||status.selfDeclaredMadeForKids===true)return false;
  if(String(snippet.liveBroadcastContent||'none')!=='none')return false;
  if(LIVE_OR_FULL_GAME.test(text))return false;
  return sourceRelevant(channel,video);
}
function normalizeVideo(channel,video){
  const id=safeVideoId(video.id),snippet=video.snippet||{};
  return {
    id,
    title:clean(snippet.title)||'Official Titans video',
    description:clean(snippet.description).slice(0,280),
    publishedAt:isoDate(snippet.publishedAt),
    channelId:channel.id,
    channelTitle:channel.title,
    source:channel.label,
    official:true,
    embeddable:true,
    live:false,
    madeForKids:false,
    duration:clean(video?.contentDetails?.duration),
    thumbnail:`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`,
    watchUrl:`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`,
    channelUrl:channel.channelUrl,
  };
}
async function channelVideos(config,key){
  const channel=await resolveChannel(config,key);
  const ids=await uploadVideoIds(channel,key);
  if(!ids.length)return {channel,videos:[]};
  const payload=await youtubeJson('videos',{part:'snippet,status,contentDetails',id:ids.join(',')},key);
  const videos=(Array.isArray(payload?.items)?payload.items:[]).filter(video=>allowedVideo(channel,video)).map(video=>normalizeVideo(channel,video));
  return {channel,videos};
}
function sourceState(config,result){
  if(result.status==='fulfilled')return {key:config.key,label:config.label,available:true,count:result.value.videos.length,channelId:result.value.channel.id,channelUrl:config.channelUrl,error:null};
  return {key:config.key,label:config.label,available:false,count:0,channelId:null,channelUrl:config.channelUrl,error:'Official YouTube source temporarily unavailable'};
}

export async function youtubeMediaRoute(req,res,env={}){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=3600');
  const key=String(env?.YOUTUBE_API_KEY||'').trim();
  if(!key){
    return res.status(200).json({
      ok:true,configured:false,available:false,provider:'YouTube Data API v3',scope:'official-embeddable-vod-only',videos:[],sources:OFFICIAL_CHANNELS.map(channel=>({key:channel.key,label:channel.label,available:false,count:0,channelId:null,channelUrl:channel.channelUrl,error:'YouTube Data API key not configured'})),liveRightsExcluded:true,iframeApi:'https://www.youtube.com/iframe_api',fetchedAt:new Date().toISOString(),message:'Official video shelf is ready for a server-side YouTube Data API key.'
    });
  }
  const results=await Promise.allSettled(OFFICIAL_CHANNELS.map(channel=>channelVideos(channel,key)));
  const videos=results.flatMap(result=>result.status==='fulfilled'?result.value.videos:[])
    .sort((a,b)=>(Date.parse(b.publishedAt)||0)-(Date.parse(a.publishedAt)||0))
    .slice(0,10);
  const sources=OFFICIAL_CHANNELS.map((channel,index)=>sourceState(channel,results[index]));
  return res.status(200).json({
    ok:true,configured:true,available:videos.length>0,provider:'YouTube Data API v3',scope:'official-embeddable-vod-only',videos,sources,liveRightsExcluded:true,iframeApi:'https://www.youtube.com/iframe_api',fetchedAt:new Date().toISOString(),
    message:videos.length?'Official Titans/NFL videos verified as public, non-live and embeddable by YouTube.':'No current official Titans/NFL uploads passed the non-live embeddability filter.'
  });
}

export const youtubeMediaInternals={OFFICIAL_CHANNELS,LIVE_OR_FULL_GAME,TITANS_RELEVANCE,safeVideoId,allowedVideo,normalizeVideo};
