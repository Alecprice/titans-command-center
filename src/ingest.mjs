import crypto from 'node:crypto';
import { fetchFreeOdds } from './odds.mjs';

const safeEqual=(a,b)=>{a=String(a||'');b=String(b||'');if(!a||!b)return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)};
const bearer=req=>String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'').trim();

export function requireIngestAuth(req, env=process.env){
  const ingest=env.INGEST_SECRET, cron=env.CRON_SECRET;
  if(!ingest&&!cron)return {ok:false,status:503,error:'Ingestion auth is not configured'};
  const suppliedHeader=String(req.headers?.['x-ingest-secret']||'').trim();
  const suppliedBearer=bearer(req);
  const ok=[ingest,cron].filter(Boolean).some(expected=>safeEqual(suppliedHeader,expected)||safeEqual(suppliedBearer,expected));
  return ok?{ok:true,status:200}:{ok:false,status:401,error:'Unauthorized'};
}

export function requireAdminAuth(req, env=process.env){
  const expected=env.INGEST_SECRET||env.CRON_SECRET;
  if(!expected)return {ok:false,status:503,error:'Admin auth is not configured'};
  const ok=safeEqual(String(req.headers?.['x-ingest-secret']||''),expected)||safeEqual(bearer(req),expected);
  return ok?{ok:true,status:200}:{ok:false,status:401,error:'Unauthorized'};
}

async function json(url,options={}){const r=await fetch(url,{...options,signal:AbortSignal.timeout(8000)});if(!r.ok)throw new Error(`Upstream returned ${r.status}`);return r.json();}

export async function syncEspn(){
  const data=await json('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',{headers:{'User-Agent':'TitansCommandCenter/0.5.2'}});
  const events=(data.events||[]).filter(e=>/Tennessee Titans|\bTEN\b/i.test(JSON.stringify(e)));
  return {ok:true,source:'espn',recordsSeen:events.length,recordsWritten:0,note:'Live scoreboard adapter verified; persistence is handled by the full warehouse importer.'};
}

export async function syncBluesky(_env=process.env,query='Tennessee Titans',limit=30){
  const u=new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts');u.searchParams.set('q',query);u.searchParams.set('limit',String(Math.min(50,limit)));u.searchParams.set('sort','latest');
  const data=await json(u);return {ok:true,source:'bluesky',recordsSeen:(data.posts||[]).length,recordsWritten:0,note:'Public feed reachable.'};
}

export async function syncNflverseRoster(){return {ok:true,skipped:true,source:'nflverse',recordsSeen:0,recordsWritten:0,note:'Use the long-running warehouse importer for roster refresh.'};}
export async function syncNflverseStats(){return {ok:true,skipped:true,source:'nflverse',recordsSeen:0,recordsWritten:0,note:'Use the long-running warehouse importer for stats refresh.'};}
export async function syncNwsNextHomeGame(){return {ok:true,skipped:true,source:'nws',recordsSeen:0,recordsWritten:0,note:'Weather widget uses stored snapshots when available; forecast persistence will be enabled after deployment verification.'};}

export async function syncFreeOdds(env=process.env){
  const data=await fetchFreeOdds(env,{maxEvents:2});
  return {ok:Boolean(data.ok),source:data.provider||'free-odds-stack',recordsSeen:(data.odds||[]).length+(data.futures||[]).length,recordsWritten:0,provider:data.provider,diagnostics:data.diagnostics||[],note:'Provider fetch verified. Market persistence will be re-enabled after live parser verification.'};
}
