import { fetchFreeOdds } from '../src/odds.mjs';

let memoryCache = { expiresAt: 0, value: null, inflight: null };
const requestedCacheSeconds = Number(process.env.ODDS_CACHE_SECONDS || 300);
const CACHE_SECONDS = Number.isFinite(requestedCacheSeconds) ? Math.max(300, Math.min(900, requestedCacheSeconds)) : 300;

function hasUnexpectedQuery(query = {}) {
  return Object.keys(query).length > 0;
}

export default async function handler(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Method not allowed'});
  // Keep one canonical public URL so arbitrary query strings cannot bypass CDN caching
  // and exhaust the free provider quotas. Deep cross-check/period refreshes happen via
  // the protected /api/sync odds job.
  if (hasUnexpectedQuery(req.query)) {
    res.setHeader('Cache-Control','no-store');
    return res.status(400).json({ok:false,error:'Public odds endpoint does not accept query parameters'});
  }

  const now = Date.now();
  if (memoryCache.value && now < memoryCache.expiresAt) {
    res.setHeader('Cache-Control',`public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=300`);
    return res.status(200).json({...memoryCache.value, cache:'memory'});
  }

  try{
    if (!memoryCache.inflight) {
      memoryCache.inflight = fetchFreeOdds(process.env,{live:null,compare:false,includePeriods:false,includePlayerProps:true,includeFutures:true,maxEvents:2})
        .finally(() => { memoryCache.inflight = null; });
    }
    const data = await memoryCache.inflight;
    if(!data.ok){res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=120');return res.status(503).json(data)}
    memoryCache.value = data;
    memoryCache.expiresAt = Date.now() + CACHE_SECONDS * 1000;
    res.setHeader('Cache-Control',`public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=300`);
    return res.status(200).json({...data,cache:'miss'});
  }catch(error){
    console.error('[odds]', error);
    res.setHeader('Cache-Control','public, s-maxage=30, stale-while-revalidate=60');
    return res.status(502).json({ok:false,provider:'free-odds-stack',error:'Odds providers unavailable'});
  }
}
