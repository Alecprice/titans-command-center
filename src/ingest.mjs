import crypto from 'node:crypto';
import { fetchFreeOdds } from './odds.mjs';

const APP_VERSION='0.6.5';
const safeEqual=(a,b)=>{a=String(a||'');b=String(b||'');if(!a||!b)return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)};
const bearer=req=>String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'').trim();

export function requireIngestAuth(req, env=process.env){const ingest=env.INGEST_SECRET,cron=env.CRON_SECRET;if(!ingest&&!cron)return {ok:false,status:503,error:'Ingestion auth is not configured'};const suppliedHeader=String(req.headers?.['x-ingest-secret']||'').trim(),suppliedBearer=bearer(req),ok=[ingest,cron].filter(Boolean).some(expected=>safeEqual(suppliedHeader,expected)||safeEqual(suppliedBearer,expected));return ok?{ok:true,status:200}:{ok:false,status:401,error:'Unauthorized'};}
export function requireAdminAuth(req, env=process.env){const expected=env.INGEST_SECRET||env.CRON_SECRET;if(!expected)return {ok:false,status:503,error:'Admin auth is not configured'};const ok=safeEqual(String(req.headers?.['x-ingest-secret']||''),expected)||safeEqual(bearer(req),expected);return ok?{ok:true,status:200}:{ok:false,status:401,error:'Unauthorized'};}

async function response(url,options={}){const r=await fetch(url,{...options,signal:AbortSignal.timeout(8000)});if(!r.ok)throw new Error(`Upstream returned ${r.status}`);return r;}
async function json(url,options={}){return (await response(url,options)).json();}
async function text(url,options={}){return (await response(url,options)).text();}

export function summarizeRefreshResults(results=[]){
  const succeeded=results.filter(r=>r?.ok&&!r?.skipped).length;
  const skipped=results.filter(r=>r?.skipped).length;
  const failed=results.length-succeeded-skipped;
  return {ok:succeeded>0,partial:skipped>0||failed>0,succeeded,skipped,failed};
}

export async function syncTitansOfficialAudit(){
  const checks=[
    {slug:'roster',url:'https://www.tennesseetitans.com/team/players-roster/',marker:/Titans Roster|Player\s*\|\s*#/i},
    {slug:'transactions',url:'https://www.tennesseetitans.com/team/transactions/',marker:/TRANSACTIONS|Titans Transactions/i},
    {slug:'schedule',url:'https://www.tennesseetitans.com/schedule/',marker:/2026 Schedule|WEEK 18|Titans 2026 Schedule/i},
    {slug:'depth-chart',url:'https://www.tennesseetitans.com/team/depth-chart',marker:/DEPTH CHART|Depth Chart/i}
  ];
  const results=await Promise.all(checks.map(async check=>{
    try{const body=await text(check.url,{headers:{'User-Agent':`TitansCommandCenter/${APP_VERSION}`}});return {slug:check.slug,ok:check.marker.test(body),bytes:body.length,url:check.url};}
    catch(error){return {slug:check.slug,ok:false,bytes:0,url:check.url,error:'Official source unavailable'};}
  }));
  const healthy=results.filter(x=>x.ok).length;
  return {ok:healthy===results.length,source:'titans',recordsSeen:results.length,recordsWritten:0,checks:results,note:'Official-source reachability/marker audit only; no HTML data is persisted by this job.'};
}

export async function syncEspn(){const data=await json('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',{headers:{'User-Agent':`TitansCommandCenter/${APP_VERSION}`}});const events=(data.events||[]).filter(e=>/Tennessee Titans|\bTEN\b/i.test(JSON.stringify(e)));return {ok:true,source:'espn',recordsSeen:events.length,recordsWritten:0,note:'Near-live scoreboard adapter reachable; this job does not persist warehouse rows.'};}
export async function syncBluesky(_env=process.env,query='Tennessee Titans',limit=30){const u=new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts');u.searchParams.set('q',query);u.searchParams.set('limit',String(Math.min(50,limit)));u.searchParams.set('sort','latest');const data=await json(u);return {ok:true,source:'bluesky',recordsSeen:(data.posts||[]).length,recordsWritten:0,note:'Public API reachable; this job does not persist feed rows.'};}
export async function syncNflverseRoster(){return {ok:true,skipped:true,source:'nflverse',recordsSeen:0,recordsWritten:0,note:'Dataset is available; roster warehouse importer is not enabled in this scheduled job.'};}
export async function syncNflverseStats(){return {ok:true,skipped:true,source:'nflverse',recordsSeen:0,recordsWritten:0,note:'Dataset is available; stats warehouse importer is not enabled in this scheduled job.'};}
export async function syncNwsNextHomeGame(){return {ok:true,skipped:true,source:'nws',recordsSeen:0,recordsWritten:0,note:'NWS API is approved; forecast persistence is not enabled in this scheduled job.'};}
export async function syncFreeOdds(env=process.env){const data=await fetchFreeOdds(env,{maxEvents:2});return {ok:Boolean(data.ok),source:data.provider||'free-odds-stack',recordsSeen:(data.odds||[]).length+(data.futures||[]).length,recordsWritten:0,provider:data.provider,diagnostics:data.diagnostics||[],note:'Provider fetch verified. Market persistence remains disabled until the live parser is fully verified.'};}
