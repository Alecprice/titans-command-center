import { fetchFreeOdds } from '../src/odds.mjs';
const TEAM_ID='10',SEASON=2026;
const sig=()=>typeof AbortSignal?.timeout==='function'?AbortSignal.timeout(6000):undefined;
async function json(url){const r=await fetch(url,{headers:{'User-Agent':'TitansCommandCenter/0.7'},signal:sig()});if(!r.ok)throw new Error(`ESPN ${r.status}`);return r.json()}
const titanEvent=e=>(e?.competitions||[]).some(c=>(c.competitors||[]).some(x=>String(x?.team?.id)===TEAM_ID||/tennessee titans/i.test(x?.team?.displayName||'')));
const num=v=>v==null||v===''||Number.isNaN(Number(v))?null:Number(v);
function rowsFor(e){const c=e?.competitions?.[0]||{}, competitors=c.competitors||[],home=competitors.find(x=>x.homeAway==='home'),away=competitors.find(x=>x.homeAway==='away'),o=(c.odds||[])[0]||e.odds?.[0]||null,base={provider:o?.provider?.name||'ESPN',providerEventId:String(e.id||''),eventName:e.shortName||e.name||'',eventDate:e.date||null,book:o?.provider?.name||'ESPN',available:true,capturedAt:new Date().toISOString()},rows=[];
  if(!o)return rows;
  const overUnder=num(o.overUnder);if(overUnder!=null){rows.push({...base,providerOddId:`${e.id}|total|over`,category:'game_line',marketName:'Total',side:'Over',line:overUnder,price:null});rows.push({...base,providerOddId:`${e.id}|total|under`,category:'game_line',marketName:'Total',side:'Under',line:overUnder,price:null});}
  const spread=num(o.spread);if(spread!=null){const detail=String(o.details||'');rows.push({...base,providerOddId:`${e.id}|spread`,category:'game_line',marketName:'Spread',side:detail||'Spread',line:spread,price:null});}
  const hml=num(o.homeTeamOdds?.moneyLine),aml=num(o.awayTeamOdds?.moneyLine);if(hml!=null)rows.push({...base,providerOddId:`${e.id}|ml|home`,category:'game_line',marketName:'Moneyline',side:home?.team?.abbreviation||home?.team?.displayName||'Home',line:null,price:hml});if(aml!=null)rows.push({...base,providerOddId:`${e.id}|ml|away`,category:'game_line',marketName:'Moneyline',side:away?.team?.abbreviation||away?.team?.displayName||'Away',line:null,price:aml});
  return rows;
}
async function espnFallback(){
  const urls=[
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${SEASON}&seasontype=1&limit=1000`,
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${SEASON}&seasontype=2&limit=1000`
  ];
  const results=await Promise.allSettled(urls.map(json));
  const all=results.flatMap(x=>x.status==='fulfilled'?(x.value.events||[]):[]),seen=new Set();
  const events=all.filter(e=>{const id=String(e?.id||'');if(!id||seen.has(id)||!titanEvent(e)||e?.status?.type?.completed)return false;seen.add(id);return true;}).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const odds=events.flatMap(rowsFor);
  return {ok:true,provider:'ESPN keyless fallback',unofficial:true,events:events.map(e=>({id:String(e.id),name:e.shortName||e.name,date:e.date,status:e.status?.type?.shortDetail||e.status?.type?.description||''})),odds,futures:[],propsAvailable:false,fetchedAt:new Date().toISOString(),message:odds.length?'Game lines loaded from ESPN public data. Player props require a configured dedicated provider.':'No current ESPN game lines are published yet. Player props require a configured dedicated provider.'}
}
export default async function handler(req,res){if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({ok:false,error:'Method not allowed'})}res.setHeader('Cache-Control','public, s-maxage=180, stale-while-revalidate=600');try{const configured=await fetchFreeOdds(process.env,{maxEvents:3});if(configured.ok&&(configured.odds?.length||configured.events?.length))return res.status(200).json({...configured,propsAvailable:true,sourceMode:'configured-provider'});}catch{}try{return res.status(200).json({...await espnFallback(),sourceMode:'keyless-fallback'});}catch(e){return res.status(200).json({ok:true,provider:'No live market source',events:[],odds:[],futures:[],propsAvailable:false,message:'Live market data is temporarily unavailable. Refresh will retry without showing a provider-configuration error.',diagnostics:[{provider:'ESPN keyless fallback',ok:false,error:e.message}],fetchedAt:new Date().toISOString()})}}
