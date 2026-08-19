import { getBootstrapData } from '../src/db.mjs';

const TEAM_ID='10';
const SEASON=2026;
const TIMEOUT=6500;
const signal=()=>typeof AbortSignal?.timeout==='function'?AbortSignal.timeout(TIMEOUT):undefined;
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b/g,'').replace(/\s+/g,' ').trim();
const asArray=v=>Array.isArray(v)?v:[];

async function json(url){const r=await fetch(url,{headers:{'User-Agent':'TitansCommandCenter/0.7'},signal:signal()});if(!r.ok)throw new Error(`ESPN ${r.status}`);return r.json();}

function rosterFromEspn(payload){
  const groups=asArray(payload?.athletes).length?payload.athletes:asArray(payload?.items);
  const out=[];
  const push=a=>{if(!a||!a.displayName)return;out.push({id:String(a.id||''),name:a.displayName,number:String(a.jersey||''),position:a.position?.abbreviation||a.position?.name||'',unit:a.position?.parent?.name||'',status:a.status?.name||a.status?.type?.name||'Current roster',experience:a.experience?.years!=null?String(a.experience.years):'',headshot:a.headshot?.href||''});};
  for(const group of groups){if(Array.isArray(group?.items))group.items.forEach(push);else if(Array.isArray(group?.athletes))group.athletes.forEach(push);else push(group);}
  if(!out.length){const walk=n=>{if(!n||typeof n!=='object')return;if(n.displayName&&n.position)push(n);for(const v of Object.values(n))if(v&&typeof v==='object')Array.isArray(v)?v.forEach(walk):walk(v)};walk(payload)}
  const seen=new Set();return out.filter(p=>{const k=norm(p.name);if(!k||seen.has(k))return false;seen.add(k);return true});
}

function dbRoster(data){return asArray(data?.roster).map(p=>({id:String(p.id||''),name:p.name||p.full_name||'',number:String(p.number??p.jerseyNumber??''),position:p.position||'',unit:p.unit||'',status:p.status||'Current roster',experience:p.experience||'',headshot:''})).filter(p=>p.name);}

function isPreseasonEvent(e){return Number(e?.season?.type??e?.seasonType?.type??e?.seasonType)===1||/preseason/i.test(`${e?.seasonType?.name||''} ${e?.week?.text||''} ${e?.name||''}`)}
function completed(e){return Boolean(e?.status?.type?.completed)||/final/i.test(e?.status?.type?.name||e?.status?.type?.description||'')}

function parseTeamBox(summary,event){
  const team=asArray(summary?.boxscore?.players).find(x=>String(x?.team?.id)===TEAM_ID||/tennessee titans/i.test(x?.team?.displayName||''));
  if(!team)return [];
  const rows=[];
  for(const category of asArray(team.statistics)){
    const labels=asArray(category.labels);const categoryName=category.displayName||category.name||'Stats';
    for(const entry of asArray(category.athletes)){
      const a=entry.athlete||{};const values=asArray(entry.stats);const fields=labels.map((label,i)=>({label,value:String(values[i]??'')}));
      rows.push({espnId:String(a.id||''),name:a.displayName||a.shortName||'',position:a.position?.abbreviation||'',category:categoryName,fields,eventId:String(event.id),eventName:event.shortName||event.name||'',date:event.date||null});
    }
  }
  return rows;
}

function attach(roster,statRows){
  const byName=new Map();for(const row of statRows){const k=norm(row.name);if(!byName.has(k))byName.set(k,[]);byName.get(k).push(row)}
  const used=new Set();const players=roster.map(p=>{const k=norm(p.name);const stats=byName.get(k)||[];if(stats.length)used.add(k);return {...p,stats}});
  const other=[];for(const [k,stats] of byName){if(used.has(k))continue;const first=stats[0];other.push({name:first.name,position:first.position,number:'',unit:'Preseason participant',status:'Not matched to current roster',experience:'',stats});}
  return {players,other};
}

export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({ok:false,error:'Method not allowed'})}
  res.setHeader('Cache-Control','public, s-maxage=120, stale-while-revalidate=600');
  const notes=[];let roster=[],rosterSource='';
  try{const db=await getBootstrapData(process.env);if(db?.ok&&asArray(db.roster).length){roster=dbRoster(db);rosterSource='Neon · audited Titans roster snapshot';}else notes.push('Production database unavailable; using ESPN roster fallback.')}catch{notes.push('Database roster unavailable; using ESPN roster fallback.')}
  if(!roster.length){try{roster=rosterFromEspn(await json(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${TEAM_ID}/roster`));rosterSource='ESPN public roster fallback';}catch(e){notes.push(`Roster fallback failed: ${e.message}`)}}
  let events=[],statRows=[];
  try{
    const schedule=await json(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${TEAM_ID}/schedule?season=${SEASON}`);
    events=asArray(schedule.events).filter(isPreseasonEvent).filter(completed).sort((a,b)=>new Date(a.date)-new Date(b.date));
    for(const event of events){try{statRows.push(...parseTeamBox(await json(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${encodeURIComponent(event.id)}`),event));}catch(e){notes.push(`Box score unavailable for ${event.shortName||event.id}: ${e.message}`)}}
  }catch(e){notes.push(`Preseason schedule unavailable: ${e.message}`)}
  const linked=attach(roster,statRows);
  return res.status(200).json({ok:true,season:SEASON,seasonType:'preseason',rosterSource,statsSource:'ESPN public game summaries · unofficial live fallback',rosterCount:linked.players.length,completedGames:events.map(e=>({id:String(e.id),name:e.shortName||e.name,date:e.date,status:e.status?.type?.shortDetail||'Final'})),players:linked.players,otherParticipants:linked.other,notes,fetchedAt:new Date().toISOString()});
}
