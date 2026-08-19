import { getBootstrapData } from '../src/db.mjs';
import { auditedRoster20260819, ROSTER_AUDIT_DATE } from '../src/roster-audit-20260819.mjs';
import { auditedPreseasonGames, auditedPlayerPreseasonStats, auditedTeamPreseasonStats, auditedPreseasonSources, PRESEASON_GAMEBOOK_URL } from '../src/preseason-p1-20260813.mjs';

const TEAM_ID='10',SEASON=2026,TIMEOUT=5500;
const signal=()=>typeof AbortSignal?.timeout==='function'?AbortSignal.timeout(TIMEOUT):undefined;
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b/g,'').replace(/\s+/g,' ').trim();
const asArray=v=>Array.isArray(v)?v:[];
async function json(url){const r=await fetch(url,{headers:{'User-Agent':'TitansCommandCenter/0.7'},signal:signal()});if(!r.ok)throw new Error(`ESPN ${r.status}`);return r.json();}
function dbRoster(data){return asArray(data?.roster).map(p=>({id:String(p.id||''),name:p.name||p.full_name||'',number:String(p.number??p.jerseyNumber??''),position:p.position||'',unit:p.unit||'',status:p.status||'Current roster',experience:p.experience||'',headshot:''})).filter(p=>p.name);}
function isPreseasonEvent(e){return Number(e?.season?.type??e?.seasonType?.type??e?.seasonType)===1||/preseason/i.test(`${e?.seasonType?.name||''} ${e?.week?.text||''} ${e?.name||''}`)}
function completed(e){return Boolean(e?.status?.type?.completed)||/final/i.test(e?.status?.type?.name||e?.status?.type?.description||'')}
function parseTeamBox(summary,event){const team=asArray(summary?.boxscore?.players).find(x=>String(x?.team?.id)===TEAM_ID||/tennessee titans/i.test(x?.team?.displayName||''));if(!team)return [];const rows=[];for(const category of asArray(team.statistics)){const labels=asArray(category.labels),categoryName=category.displayName||category.name||'Stats';for(const entry of asArray(category.athletes)){const a=entry.athlete||{},values=asArray(entry.stats);rows.push({name:a.displayName||a.shortName||'',position:a.position?.abbreviation||'',category:categoryName,fields:labels.map((label,i)=>({label,value:String(values[i]??'')})),eventId:String(event.id),eventName:event.shortName||event.name||'',date:event.date||null,source:'ESPN live fallback'});}}return rows;}
function auditedRows(){return Object.entries(auditedPlayerPreseasonStats).flatMap(([name,rows])=>rows.map(row=>({...row,name,source:'NFL official gamebook',sourceUrl:PRESEASON_GAMEBOOK_URL})));}
function attach(roster,statRows){const byName=new Map();for(const row of statRows){const k=norm(row.name);if(!byName.has(k))byName.set(k,[]);byName.get(k).push(row)}const used=new Set();const players=roster.map(p=>{const k=norm(p.name),stats=byName.get(k)||[];if(stats.length)used.add(k);return {...p,stats}});const other=[];for(const [k,stats] of byName){if(used.has(k))continue;const first=stats[0];other.push({name:first.name,position:first.position||'',number:'',unit:'Preseason participant',status:'Not matched to current roster',experience:'',stats});}return {players,other};}
export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({ok:false,error:'Method not allowed'})}
  res.setHeader('Cache-Control','public, s-maxage=180, stale-while-revalidate=900');
  const diagnostics=[];let roster=auditedRoster20260819.map(x=>({...x,id:'',headshot:''})),rosterSource=`Audited Titans roster snapshot · ${ROSTER_AUDIT_DATE}`;
  try{const db=await getBootstrapData(process.env);const live=db?.ok?dbRoster(db):[];if(live.length>=90){roster=live;rosterSource='Neon · latest audited Titans roster snapshot';}else diagnostics.push('Neon production connection unavailable; serving the dated 95-player audited roster snapshot.');}catch{diagnostics.push('Neon production connection unavailable; serving the dated 95-player audited roster snapshot.');}
  let events=[...auditedPreseasonGames],statRows=auditedRows(),statsSource='NFL official gamebook · Titans at 49ers · Aug. 13, 2026';
  try{const schedule=await json(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${TEAM_ID}/schedule?season=${SEASON}`);const liveEvents=asArray(schedule.events).filter(isPreseasonEvent).filter(completed).sort((a,b)=>new Date(a.date)-new Date(b.date));const liveRows=[];for(const event of liveEvents){try{liveRows.push(...parseTeamBox(await json(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${encodeURIComponent(event.id)}`),event));}catch{}}
    if(liveRows.length&&liveEvents.length>events.length){events=liveEvents.map(e=>({id:String(e.id),name:e.shortName||e.name,date:e.date,status:e.status?.type?.shortDetail||'Final',source:'ESPN live fallback'}));statRows=liveRows;statsSource='ESPN public game summaries · live fallback';}
  }catch{diagnostics.push('ESPN server-side feed is currently blocked from Vercel; official NFL gamebook fallback remains active.');}
  const linked=attach(roster,statRows);
  return res.status(200).json({ok:true,season:SEASON,seasonType:'preseason',rosterSource,statsSource,rosterCount:linked.players.length,completedGames:events,teamStats:auditedTeamPreseasonStats,players:linked.players,otherParticipants:linked.other,sources:auditedPreseasonSources,diagnostics,fetchedAt:new Date().toISOString()});
}
