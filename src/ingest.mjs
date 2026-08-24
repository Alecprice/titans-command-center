import crypto from 'node:crypto';
import { fetchFreeOdds } from './odds.mjs';
import { getSql } from './db.mjs';

const APP_VERSION='1.0.0';
const secretDigest=value=>crypto.createHash('sha256').update(String(value??''),'utf8').digest();
const safeEqual=(a,b)=>{const aText=String(a??''),bText=String(b??''),match=crypto.timingSafeEqual(secretDigest(aText),secretDigest(bText));return match&&Boolean(aText)&&Boolean(bText)};
const bearer=req=>String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'').trim();
export function requireIngestAuth(req,env=process.env){const ingest=env.INGEST_SECRET,cron=env.CRON_SECRET;if(!ingest&&!cron)return {ok:false,status:503,error:'Ingestion auth is not configured'};const h=String(req.headers?.['x-ingest-secret']||'').trim(),b=bearer(req),ok=[ingest,cron].filter(Boolean).some(expected=>safeEqual(h,expected)||safeEqual(b,expected));return ok?{ok:true,status:200}:{ok:false,status:401,error:'Unauthorized'};}
export function requireAdminAuth(req,env=process.env){const expected=env.INGEST_SECRET||env.CRON_SECRET;if(!expected)return {ok:false,status:503,error:'Admin auth is not configured'};const ok=safeEqual(String(req.headers?.['x-ingest-secret']||''),expected)||safeEqual(bearer(req),expected);return ok?{ok:true,status:200}:{ok:false,status:401,error:'Unauthorized'};}
async function response(url,options={}){const r=await fetch(url,{...options,signal:AbortSignal.timeout(8000)});if(!r.ok)throw new Error(`Upstream returned ${r.status}`);return r;}
async function json(url,options={}){return (await response(url,options)).json();}
async function text(url,options={}){return (await response(url,options)).text();}
export function summarizeRefreshResults(results=[]){const succeeded=results.filter(r=>r?.ok&&!r?.skipped).length,skipped=results.filter(r=>r?.skipped).length,failed=results.length-succeeded-skipped;return {ok:succeeded>0,partial:skipped>0||failed>0,succeeded,skipped,failed};}
export function classifySyncResult(result={}){return result.skipped?'skipped':result.ok?'success':'failed';}
function sourceSlug(result={}){const raw=String(result.source||result.provider||'titans-cc').toLowerCase();if(raw.includes('prop'))return 'propline';if(raw.includes('odds-api'))return 'odds-api-io';if(raw.includes('espn'))return 'espn';if(raw.includes('blue'))return 'bluesky';if(raw.includes('nflverse'))return 'nflverse';if(raw.includes('nws'))return 'nws';if(raw.includes('titan'))return 'titans';return 'titans-cc';}
export async function recordSyncRun(env=process.env,job,result={},startedAt=new Date()){
  try{
    const sql=await getSql(env);if(!sql)return {stored:false};
    const slug=sourceSlug(result),[source]=await sql`select id from sources where slug=${slug} limit 1`;if(!source)return {stored:false};
    const status=classifySyncResult(result),metadata={note:result.note||'',provider:result.provider||null,skipped:Boolean(result.skipped),checks:Array.isArray(result.checks)?result.checks.map(c=>({slug:c.slug,ok:Boolean(c.ok),bytes:Number(c.bytes||0),url:c.url||''})):[],diagnostics:Array.isArray(result.diagnostics)?result.diagnostics.slice(0,8):[],finalsSeen:Number(result.finalsSeen||0)};
    const meta=JSON.stringify(metadata),error=result.error?String(result.error).slice(0,500):null;
    await sql`insert into sync_runs(source_id,job_type,status,started_at,finished_at,records_seen,records_written,error_message,metadata) values(${source.id},${job},${status},${startedAt},now(),${Number(result.recordsSeen||0)},${Number(result.recordsWritten||0)},${error},${meta}::jsonb)`;
    return {stored:true,status,source:slug};
  }catch(error){console.error('[recordSyncRun]',job,error);return {stored:false};}
}
export async function syncTitansOfficialAudit(){const checks=[{slug:'roster',url:'https://www.tennesseetitans.com/team/players-roster/',marker:/Titans Roster|Player\s*\|\s*#/i},{slug:'transactions',url:'https://www.tennesseetitans.com/team/transactions/',marker:/TRANSACTIONS|Titans Transactions/i},{slug:'schedule',url:'https://www.tennesseetitans.com/schedule/',marker:/2026 Schedule|WEEK 18|Titans 2026 Schedule/i},{slug:'depth-chart',url:'https://www.tennesseetitans.com/team/depth-chart',marker:/DEPTH CHART|Depth Chart/i}];const results=await Promise.all(checks.map(async check=>{try{const body=await text(check.url,{headers:{'User-Agent':`TitansCommandCenter/${APP_VERSION}`}});return {slug:check.slug,ok:check.marker.test(body),bytes:body.length,url:check.url};}catch{return {slug:check.slug,ok:false,bytes:0,url:check.url,error:'Official source unavailable'};}})),healthy=results.filter(x=>x.ok).length;return {ok:healthy===results.length,source:'titans',recordsSeen:results.length,recordsWritten:0,checks:results,note:'Official-source reachability/marker audit only; no HTML data is persisted by this job.'};}
const scoreValue=value=>{const n=Number(value);return Number.isInteger(n)&&n>=0?n:null};
export function extractFinalTitansScores(data={}){
  const out=[];
  for(const event of Array.isArray(data.events)?data.events:[]){
    const competition=event?.competitions?.[0];if(!competition)continue;
    const competitors=Array.isArray(competition.competitors)?competition.competitors:[];
    const ten=competitors.find(x=>x?.team?.abbreviation==='TEN');if(!ten)continue;
    const home=competitors.find(x=>x?.homeAway==='home'),away=competitors.find(x=>x?.homeAway==='away');
    if(!home||!away)continue;
    const status=competition.status||event.status||{},statusText=`${status?.type?.description||''} ${status?.type?.name||''} ${status?.type?.state||''}`;
    if(!status?.type?.completed&&!/\bfinal\b|\bpost\b/i.test(statusText))continue;
    const homeScore=scoreValue(home.score),awayScore=scoreValue(away.score),kickoffMs=Date.parse(event.date||competition.date||'');
    if(homeScore==null||awayScore==null||!Number.isFinite(kickoffMs))continue;
    out.push({eventId:String(event.id||''),kickoff:new Date(kickoffMs).toISOString(),homeAbbr:String(home.team?.abbreviation||''),awayAbbr:String(away.team?.abbreviation||''),homeScore,awayScore});
    if(out.length>=3)break;
  }
  return out;
}
async function reconcileFinalTitansScores(env,finals=[]){
  const sql=await getSql(env);if(!sql)return {recordsWritten:0,diagnostics:[{status:'database-unavailable'}]};
  let recordsWritten=0;const diagnostics=[];
  for(const final of finals.slice(0,3)){
    const kickoffMs=Date.parse(final.kickoff),start=new Date(kickoffMs-6*3600000),end=new Date(kickoffMs+6*3600000);
    const rows=await sql`select g.id,g.status,g.home_score,g.away_score
      from games g
      join teams ht on ht.id=g.home_team_id
      join teams at on at.id=g.away_team_id
      where g.season=2026
        and g.kickoff between ${start} and ${end}
        and ht.abbreviation=${final.homeAbbr}
        and at.abbreviation=${final.awayAbbr}
      order by abs(extract(epoch from (g.kickoff-${new Date(kickoffMs)}))) asc
      limit 2`;
    if(rows.length!==1){diagnostics.push({eventId:final.eventId,status:'ambiguous-match',matches:rows.length});continue;}
    const row=rows[0],alreadyFinal=/final/i.test(String(row.status||''));
    if(alreadyFinal){
      const same=Number(row.home_score)===final.homeScore&&Number(row.away_score)===final.awayScore;
      diagnostics.push({eventId:final.eventId,status:same?'already-current':'final-conflict'});
      continue;
    }
    const meta=JSON.stringify({score_source:'ESPN scoreboard (secondary)',score_source_event_id:final.eventId,score_reconciled_at:new Date().toISOString(),official_audit_required:true});
    const updated=await sql`update games
      set status='final',home_score=${final.homeScore},away_score=${final.awayScore},
          metadata=coalesce(metadata,'{}'::jsonb)||${meta}::jsonb,updated_at=now()
      where id=${row.id}
        and lower(status) not in ('final','postponed','cancelled','canceled')
      returning id`;
    recordsWritten+=updated.length;
    diagnostics.push({eventId:final.eventId,status:updated.length===1?'reconciled':'write-skipped'});
  }
  return {recordsWritten,diagnostics};
}
export async function syncEspn(env=process.env){
  const data=await json('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',{headers:{'User-Agent':`TitansCommandCenter/${APP_VERSION}`}});
  const events=(data.events||[]).filter(e=>/Tennessee Titans|\bTEN\b/i.test(JSON.stringify(e))),finals=extractFinalTitansScores({events}),reconciled=await reconcileFinalTitansScores(env,finals);
  return {ok:true,source:'espn',recordsSeen:events.length,recordsWritten:reconciled.recordsWritten,finalsSeen:finals.length,diagnostics:reconciled.diagnostics,note:'Near-live scoreboard check; final scores persist only for one unambiguous matching Titans game. TennesseeTitans.com remains the audit authority.'};
}
export async function syncBluesky(_env=process.env,query='Tennessee Titans',limit=30){const u=new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts');u.searchParams.set('q',query);u.searchParams.set('limit',String(Math.min(50,limit)));u.searchParams.set('sort','latest');const data=await json(u);return {ok:true,source:'bluesky',recordsSeen:(data.posts||[]).length,recordsWritten:0,note:'Public API reachable; this job does not persist feed rows.'};}
export async function syncNflverseRoster(){return {ok:true,skipped:true,source:'nflverse',recordsSeen:0,recordsWritten:0,note:'Dataset is available; roster warehouse importer is not enabled in this scheduled job.'};}
export async function syncNflverseStats(){return {ok:true,skipped:true,source:'nflverse',recordsSeen:0,recordsWritten:0,note:'Dataset is available; stats warehouse importer is not enabled in this scheduled job.'};}
export async function syncNwsNextHomeGame(){return {ok:true,skipped:true,source:'nws',recordsSeen:0,recordsWritten:0,note:'NWS API is approved; forecast persistence is not enabled in this scheduled job.'};}
export async function syncFreeOdds(env=process.env){const data=await fetchFreeOdds(env,{maxEvents:2,bypassCache:true});return {ok:Boolean(data.ok),source:data.provider||'free-odds-stack',recordsSeen:(data.odds||[]).length+(data.futures||[]).length,recordsWritten:0,provider:data.provider,diagnostics:data.diagnostics||[],note:'Fresh provider reachability fetch verified. Market persistence remains intentionally disabled; the live board uses normalized provider responses.'};}
