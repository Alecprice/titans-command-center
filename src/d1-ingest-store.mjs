import {getD1Snapshot,hasD1,putD1Snapshot} from './d1-store.mjs';

const BOOTSTRAP_SNAPSHOT_KEY='bootstrap:v1';
const SYNC_AUDIT_TTL_SECONDS=90*24*60*60;
const text=value=>String(value??'').trim();
const iso=value=>{
  const date=value instanceof Date?value:new Date(value);
  return Number.isNaN(date.getTime())?new Date().toISOString():date.toISOString();
};
const safeJob=value=>text(value).toLowerCase().replace(/[^a-z0-9:_-]+/g,'-').replace(/^-+|-+$/g,'')||'unknown';

function sourcePair(game={}){
  const opponent=text(game.opponentAbbr).toUpperCase();
  if(!opponent)return null;
  return game.homeAway==='home'?{home:'TEN',away:opponent}:{home:opponent,away:'TEN'};
}

function sameScore(game={},final={}){
  const home=game.homeAway==='home';
  const score=Number(game.score),opponentScore=Number(game.opponentScore);
  return Number.isFinite(score)&&Number.isFinite(opponentScore)&&
    (home?(score===final.homeScore&&opponentScore===final.awayScore):(score===final.awayScore&&opponentScore===final.homeScore));
}

function matchingGames(games=[],final={}){
  const kickoff=Date.parse(final.kickoff||'');
  if(!Number.isFinite(kickoff))return [];
  return games.filter(game=>{
    const pair=sourcePair(game),gameKickoff=Date.parse(game.date||'');
    if(!pair||!Number.isFinite(gameKickoff))return false;
    return Math.abs(gameKickoff-kickoff)<=6*60*60*1000&&pair.home===final.homeAbbr&&pair.away===final.awayAbbr;
  });
}

export function d1SyncAuditKey(job,startedAt=new Date()){
  return `sync-run:v1:${iso(startedAt)}:${safeJob(job)}`;
}

export async function recordD1SyncRun(env,job,{sourceSlug='titans-cc',status='failed',result={},startedAt=new Date(),metadata={}}={}){
  if(!hasD1(env))return {stored:false};
  const started=iso(startedAt),finished=new Date().toISOString(),key=d1SyncAuditKey(job,started);
  const payload={
    id:key,
    source:sourceSlug,
    sourceSlug,
    job,
    status,
    startedAt:started,
    finishedAt:finished,
    recordsSeen:Number(result.recordsSeen||0),
    recordsWritten:Number(result.recordsWritten||0),
    error:result.error?String(result.error).slice(0,500):'',
    metadata
  };
  await putD1Snapshot(env,key,payload,{source:'cloudflare-d1-sync-audit',fetchedAt:finished,ttlSeconds:SYNC_AUDIT_TTL_SECONDS});
  return {stored:true,status,source:sourceSlug,storage:'cloudflare-d1',key};
}

export async function reconcileD1FinalTitansScores(env,finals=[]){
  if(!hasD1(env))return {handled:false,recordsWritten:0,diagnostics:[]};
  const row=await getD1Snapshot(env,BOOTSTRAP_SNAPSHOT_KEY,{allowExpired:true});
  const payload=row?.payload;
  if(!payload||!Array.isArray(payload.games))return {handled:true,recordsWritten:0,diagnostics:[{status:'bootstrap-snapshot-unavailable'}]};

  const games=payload.games.map(game=>({...game}));
  let recordsWritten=0;
  const diagnostics=[];

  for(const final of finals.slice(0,3)){
    const matches=matchingGames(games,final);
    if(matches.length!==1){diagnostics.push({eventId:final.eventId,status:'ambiguous-match',matches:matches.length});continue;}
    const game=matches[0],alreadyFinal=/final/i.test(text(game.status));
    if(alreadyFinal){
      diagnostics.push({eventId:final.eventId,status:sameScore(game,final)?'already-current':'final-conflict'});
      continue;
    }
    const home=game.homeAway==='home';
    game.status='final';
    game.score=home?final.homeScore:final.awayScore;
    game.opponentScore=home?final.awayScore:final.homeScore;
    game.scoreSource='ESPN scoreboard (secondary)';
    game.scoreSourceEventId=final.eventId;
    game.scoreReconciledAt=new Date().toISOString();
    game.officialAuditRequired=true;
    recordsWritten+=1;
    diagnostics.push({eventId:final.eventId,status:'reconciled'});
  }

  if(recordsWritten){
    const originalFetched=row.fetched_at||payload.fetchedAt||new Date().toISOString();
    const fetchedMs=Date.parse(originalFetched),expiresMs=Date.parse(row.expires_at||'');
    const ttlSeconds=Number.isFinite(fetchedMs)&&Number.isFinite(expiresMs)?Math.max(0,Math.round((expiresMs-fetchedMs)/1000)):900;
    await putD1Snapshot(env,BOOTSTRAP_SNAPSHOT_KEY,{...payload,games},{source:row.source||'titans-command-center',fetchedAt:originalFetched,ttlSeconds});
  }

  return {handled:true,recordsWritten,diagnostics};
}
