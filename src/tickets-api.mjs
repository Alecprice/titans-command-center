const SEATGEEK_EVENTS='https://api.seatgeek.com/2/events';
const TICKETMASTER_EVENTS='https://app.ticketmaster.com/discovery/v2/events.json';
const STUBHUB_TOKEN='https://account.stubhub.com/oauth2/token';
const STUBHUB_EVENTS='https://api.stubhub.net/catalog/events/search';
export const TITANS_TICKETS_URL='https://seatgeek.com/tennessee-titans-tickets';
const TITANS_SLUG='tennessee-titans';
const LAST_GOOD_MAX_AGE_MS=6*60*60*1000;
let stubHubTokenCache={token:'',expiresAt:0};
let lastGoodSnapshot={savedAt:0,payload:null};

const finite=value=>{if(value==null||value==='')return null;const number=Number(value);return Number.isFinite(number)&&number>=0?number:null;};
const priceFinite=value=>{const number=finite(value);return number!=null&&number>0?number:null;};
const datePart=value=>String(value||'').match(/^(\d{4}-\d{2}-\d{2})/)?.[1]||'';
const simplify=value=>String(value||'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\b(nfl|football|tickets?|preseason|regular season)\b/g,' ').replace(/\s+/g,' ').trim();
function matchupIdentity(title){
  const raw=String(title||'').toLowerCase().replace(/\s+@\s+/g,' at ').replace(/\s+vs\.?\s+/g,' vs ');
  const patterns=[
    {needle:' at tennessee titans',side:'home',pick:'before'},
    {needle:'tennessee titans at ',side:'away',pick:'after'},
    {needle:' vs tennessee titans',side:'away',pick:'before'},
    {needle:'tennessee titans vs ',side:'home',pick:'after'},
  ];
  for(const pattern of patterns){
    const index=raw.indexOf(pattern.needle);
    if(index<0)continue;
    const opponent=pattern.pick==='before'?raw.slice(0,index):raw.slice(index+pattern.needle.length);
    return {homeAway:pattern.side,opponent:simplify(opponent)};
  }
  return {homeAway:'all',opponent:simplify(raw.replace(/tennessee titans/g,''))};
}
function venueIdentity(venue={}){return simplify([venue?.name,venue?.city,venue?.state].filter(Boolean).join(' '));}
export function ticketGameKey(event={}){
  const date=datePart(event?.datetimeLocal)||datePart(event?.datetimeUtc);
  if(!date)return`${event?.provider||'provider'}:${event?.id||'unknown'}`;
  const matchup=matchupIdentity(event?.title);
  const side=event?.homeAway&&event.homeAway!=='all'?event.homeAway:matchup.homeAway;
  const opponent=event?.opponent||matchup.opponent;
  if(opponent)return`${date}|${side||'all'}|${simplify(opponent)}`;
  const venue=venueIdentity(event?.venue);
  return`${date}|${side||'all'}|${venue||`${event?.provider||'provider'}:${event?.id||'unknown'}`}`;
}
export function safeSeatGeekUrl(value){
  try{
    const url=new URL(String(value||''));
    return url.protocol==='https:'&&(url.hostname==='seatgeek.com'||url.hostname.endsWith('.seatgeek.com'))?url.href:TITANS_TICKETS_URL;
  }catch{return TITANS_TICKETS_URL;}
}
export function safeTicketmasterUrl(value){
  try{
    const url=new URL(String(value||''));
    return url.protocol==='https:'&&(url.hostname==='ticketmaster.com'||url.hostname.endsWith('.ticketmaster.com'))?url.href:TITANS_TICKETS_URL;
  }catch{return TITANS_TICKETS_URL;}
}
export function safeStubHubUrl(value){
  try{
    const url=new URL(String(value||''));
    return url.protocol==='https:'&&(url.hostname==='stubhub.com'||url.hostname.endsWith('.stubhub.com'))?url.href:TITANS_TICKETS_URL;
  }catch{return TITANS_TICKETS_URL;}
}
export function ticketPriceBand(value){
  const price=priceFinite(value);
  if(price==null)return {key:'unknown',label:'Price unavailable',order:99};
  if(price<50)return {key:'under-50',label:'Under $50',order:0};
  if(price<100)return {key:'50-99',label:'$50–$99',order:1};
  if(price<200)return {key:'100-199',label:'$100–$199',order:2};
  return {key:'200-plus',label:'$200+',order:3};
}
function homeAway(title){return matchupIdentity(title).homeAway;}
function opponent(title){return matchupIdentity(title).opponent;}
function normalizeSeatGeekEvent(event){
  const stats=event?.stats||{};
  const lowestPrice=priceFinite(stats.lowest_price);
  return {
    id:String(event?.id||''),
    provider:'SeatGeek',
    title:String(event?.title||'Tennessee Titans tickets'),
    url:safeSeatGeekUrl(event?.url),
    datetimeLocal:String(event?.datetime_local||''),
    datetimeUtc:String(event?.datetime_utc||''),
    timeTbd:Boolean(event?.time_tbd),
    homeAway:homeAway(event?.title),
    opponent:opponent(event?.title),
    venue:{name:String(event?.venue?.name||'Venue TBD'),city:String(event?.venue?.city||''),state:String(event?.venue?.state||'')},
    listingCount:finite(stats.listing_count),
    lowestPrice,
    averagePrice:priceFinite(stats.average_price),
    highestPrice:priceFinite(stats.highest_price),
    priceBand:ticketPriceBand(lowestPrice),
  };
}
export function normalizeSeatGeekEvents(events=[]){
  return (Array.isArray(events)?events:[]).map(normalizeSeatGeekEvent).filter(event=>event.id&&event.url).sort(compareOffers);
}
function ticketmasterLocalDate(event){
  const start=event?.dates?.start||{};
  if(start.localDate&&start.localTime)return`${start.localDate}T${start.localTime}`;
  return String(start.localDate||start.dateTime||'');
}
function ticketmasterPriceRange(event){
  const ranges=Array.isArray(event?.priceRanges)?event.priceRanges:[];
  const minimums=ranges.map(range=>priceFinite(range?.min)).filter(value=>value!=null);
  const maximums=ranges.map(range=>priceFinite(range?.max)).filter(value=>value!=null);
  return {min:minimums.length?Math.min(...minimums):null,max:maximums.length?Math.max(...maximums):null};
}
function ticketmasterGameEvent(event,title){
  const text=String(title||event?.name||'').toLowerCase();
  if(!text.includes('tennessee titans'))return false;
  if(/\bparking\b/.test(text)||/\b(?:hotel|travel)\s+packages?\b/.test(text))return false;
  try{
    const host=new URL(String(event?.url||'')).hostname.toLowerCase();
    if(host==='travel.ticketmaster.com'||host.endsWith('.travel.ticketmaster.com'))return false;
  }catch{}
  return true;
}
function normalizeTicketmasterEvent(event){
  const title=String(event?.name||'');
  if(!ticketmasterGameEvent(event,title))return null;
  const range=ticketmasterPriceRange(event);
  const venue=Array.isArray(event?._embedded?.venues)?event._embedded.venues[0]:null;
  return {
    id:`tm:${String(event?.id||'')}`,
    provider:'Ticketmaster',
    title:title||'Tennessee Titans tickets',
    url:safeTicketmasterUrl(event?.url),
    datetimeLocal:ticketmasterLocalDate(event),
    datetimeUtc:String(event?.dates?.start?.dateTime||''),
    timeTbd:Boolean(event?.dates?.start?.timeTBA||event?.dates?.start?.noSpecificTime),
    homeAway:homeAway(title),
    opponent:opponent(title),
    venue:{name:String(venue?.name||'Venue TBD'),city:String(venue?.city?.name||''),state:String(venue?.state?.stateCode||venue?.state?.name||'')},
    listingCount:null,
    lowestPrice:range.min,
    averagePrice:null,
    highestPrice:range.max,
    priceBand:ticketPriceBand(range.min),
  };
}
export function normalizeTicketmasterEvents(events=[]){
  return (Array.isArray(events)?events:[]).map(normalizeTicketmasterEvent).filter(Boolean).filter(event=>event.id&&event.url).sort(compareOffers);
}
function stubHubWebUrl(event){return event?._links?.['event:webpage']?.href||event?._links?.webpage?.href||'';}
function normalizeStubHubEvent(event){
  const title=String(event?.name||'');
  if(!title.toLowerCase().includes('tennessee titans'))return null;
  const price=priceFinite(event?.min_ticket_price?.amount);
  const venue=event?._embedded?.venue||{};
  return {
    id:`sh:${String(event?.id||'')}`,
    provider:'StubHub',
    title:title||'Tennessee Titans tickets',
    url:safeStubHubUrl(stubHubWebUrl(event)),
    datetimeLocal:String(event?.start_date||''),
    datetimeUtc:String(event?.start_date||''),
    timeTbd:event?.time_confirmed===false,
    homeAway:homeAway(title),
    opponent:opponent(title),
    venue:{name:String(venue?.name||'Venue TBD'),city:String(venue?.city||''),state:String(venue?.state_province||'')},
    listingCount:null,
    lowestPrice:price,
    averagePrice:null,
    highestPrice:null,
    priceBand:ticketPriceBand(price),
  };
}
export function normalizeStubHubEvents(events=[]){
  return (Array.isArray(events)?events:[]).map(normalizeStubHubEvent).filter(Boolean).filter(event=>event.id&&event.url).sort(compareOffers);
}
function compareOffers(a,b){return (priceFinite(a.lowestPrice)??Number.MAX_SAFE_INTEGER)-(priceFinite(b.lowestPrice)??Number.MAX_SAFE_INTEGER)||String(a.datetimeUtc||'').localeCompare(String(b.datetimeUtc||''))||String(a.provider||'').localeCompare(String(b.provider||''));}
export function groupTicketOffers(events=[]){
  const groups=new Map();
  for(const event of Array.isArray(events)?events:[]){
    if(!event?.id||!event?.provider)continue;
    const key=ticketGameKey(event);
    if(!groups.has(key))groups.set(key,{key,title:event.title,datetimeLocal:event.datetimeLocal,datetimeUtc:event.datetimeUtc,timeTbd:event.timeTbd,homeAway:event.homeAway,opponent:event.opponent||opponent(event.title),venue:event.venue,offers:[]});
    const group=groups.get(key);
    const existing=group.offers.findIndex(offer=>offer.provider===event.provider);
    if(existing<0)group.offers.push(event);
    else if(compareOffers(event,group.offers[existing])<0)group.offers[existing]=event;
    if(group.homeAway==='all'&&event.homeAway!=='all')group.homeAway=event.homeAway;
    if(!group.opponent&&event.opponent)group.opponent=event.opponent;
  }
  return [...groups.values()].map(group=>{
    group.offers.sort(compareOffers);
    const priced=group.offers.filter(offer=>priceFinite(offer.lowestPrice)!=null);
    const cheapest=priced[0]||group.offers[0]||null;
    const nextBest=priced[1]||null;
    const lowestPrice=cheapest?priceFinite(cheapest.lowestPrice):null;
    const secondLowestPrice=nextBest?priceFinite(nextBest.lowestPrice):null;
    const priceSpread=lowestPrice!=null&&secondLowestPrice!=null?Math.max(0,secondLowestPrice-lowestPrice):null;
    const priceSpreadPct=lowestPrice!=null&&priceSpread!=null?Math.round((priceSpread/lowestPrice)*100):null;
    return {...group,cheapestProvider:cheapest?.provider||null,lowestPrice,secondLowestPrice,priceSpread,priceSpreadPct,providerCount:group.offers.length,pricedProviderCount:priced.length,priceBand:ticketPriceBand(lowestPrice)};
  }).sort((a,b)=>(a.lowestPrice??Number.MAX_SAFE_INTEGER)-(b.lowestPrice??Number.MAX_SAFE_INTEGER)||String(a.datetimeUtc||a.datetimeLocal||'').localeCompare(String(b.datetimeUtc||b.datetimeLocal||'')));
}
function methodOnly(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET'){res.status(405).json({ok:false,error:'Method not allowed'});return true;}
  return false;
}
async function fetchSeatGeek(clientId,aid){
  const url=new URL(SEATGEEK_EVENTS);
  url.searchParams.set('client_id',clientId);
  url.searchParams.set('performers.slug',TITANS_SLUG);
  url.searchParams.set('listing_count.gt','0');
  url.searchParams.set('datetime_utc.gte',new Date().toISOString().slice(0,10));
  url.searchParams.set('per_page','50');
  if(aid)url.searchParams.set('aid',aid);
  const upstream=await fetch(url,{headers:{Accept:'application/json','User-Agent':'TitansCommandCenter/1.0 tickets'},signal:AbortSignal.timeout(2400)});
  if(!upstream.ok)throw new Error(`SeatGeek ${upstream.status}`);
  const payload=await upstream.json();
  return normalizeSeatGeekEvents(payload?.events);
}
async function fetchTicketmaster(apiKey){
  const url=new URL(TICKETMASTER_EVENTS);
  url.searchParams.set('apikey',apiKey);
  url.searchParams.set('keyword','Tennessee Titans');
  url.searchParams.set('countryCode','US');
  url.searchParams.set('classificationName','football');
  url.searchParams.set('size','50');
  url.searchParams.set('sort','date,asc');
  const upstream=await fetch(url,{headers:{Accept:'application/json','User-Agent':'TitansCommandCenter/1.0 tickets'},signal:AbortSignal.timeout(2400)});
  if(!upstream.ok)throw new Error(`Ticketmaster ${upstream.status}`);
  const payload=await upstream.json();
  return normalizeTicketmasterEvents(payload?._embedded?.events);
}
function base64(value){
  if(typeof btoa==='function')return btoa(value);
  if(globalThis.Buffer)return globalThis.Buffer.from(value,'utf8').toString('base64');
  throw new Error('Base64 encoder unavailable');
}
async function stubHubToken(clientId,clientSecret){
  if(stubHubTokenCache.token&&stubHubTokenCache.expiresAt>Date.now()+60000)return stubHubTokenCache.token;
  const credentials=base64(`${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`);
  const body=new URLSearchParams({grant_type:'client_credentials',scope:'read:events'});
  const upstream=await fetch(STUBHUB_TOKEN,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded',Authorization:`Basic ${credentials}`},body,signal:AbortSignal.timeout(2200)});
  if(!upstream.ok)throw new Error(`StubHub auth ${upstream.status}`);
  const payload=await upstream.json();
  const token=String(payload?.access_token||'');
  if(!token)throw new Error('StubHub auth missing token');
  const ttl=Math.max(300,Number(payload?.expires_in)||3600);
  stubHubTokenCache={token,expiresAt:Date.now()+ttl*1000};
  return token;
}
async function fetchStubHub(clientId,clientSecret){
  const token=await stubHubToken(clientId,clientSecret);
  const url=new URL(STUBHUB_EVENTS);
  url.searchParams.set('q','Tennessee Titans');
  url.searchParams.set('country_code','US');
  url.searchParams.set('page_size','50');
  url.searchParams.set('exclude_parking_passes','true');
  const upstream=await fetch(url,{headers:{Accept:'application/hal+json',Authorization:`Bearer ${token}`,'User-Agent':'TitansCommandCenter/1.0 tickets'},signal:AbortSignal.timeout(2400)});
  if(!upstream.ok)throw new Error(`StubHub ${upstream.status}`);
  const payload=await upstream.json();
  return normalizeStubHubEvents(payload?._embedded?.events);
}
export function providerFailureReason(error){
  const text=String(error?.message||'');
  const name=String(error?.name||'');
  if(name==='AbortError'||name==='TimeoutError'||/timeout/i.test(text))return'timeout';
  if(/\b401\b|\b403\b/.test(text))return'authentication';
  if(/\b429\b/.test(text))return'rate-limited';
  if(/\b5\d\d\b/.test(text))return'upstream-error';
  return'unavailable';
}
async function runProvider(provider,run){
  const started=Date.now();
  try{
    const events=await run();
    return {provider,ok:true,status:'live',events,durationMs:Date.now()-started,checkedAt:new Date().toISOString(),count:events.length,priceCount:events.filter(event=>priceFinite(event.lowestPrice)!=null).length};
  }catch(error){
    console.error(`[tickets-${provider.toLowerCase()}]`,error);
    return {provider,ok:false,status:'unavailable',errorCode:providerFailureReason(error),events:[],durationMs:Date.now()-started,checkedAt:new Date().toISOString(),count:0,priceCount:0};
  }
}
function currentLastGood(){
  if(!lastGoodSnapshot.payload||!lastGoodSnapshot.savedAt)return null;
  const ageMs=Date.now()-lastGoodSnapshot.savedAt;
  if(ageMs>LAST_GOOD_MAX_AGE_MS)return null;
  return {payload:lastGoodSnapshot.payload,savedAt:lastGoodSnapshot.savedAt,ageMs};
}
export function __resetTicketCachesForTest(){stubHubTokenCache={token:'',expiresAt:0};lastGoodSnapshot={savedAt:0,payload:null};}
export async function ticketsRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=900');
  const clientId=String(env?.SEATGEEK_CLIENT_ID||'').trim();
  const aid=String(env?.SEATGEEK_AID||'').trim();
  const ticketmasterKey=String(env?.TICKETMASTER_API_KEY||'').trim();
  const stubHubClientId=String(env?.STUBHUB_CLIENT_ID||'').trim();
  const stubHubClientSecret=String(env?.STUBHUB_CLIENT_SECRET||'').trim();
  const configuredProviders={seatGeek:Boolean(clientId),ticketmaster:Boolean(ticketmasterKey),stubHub:Boolean(stubHubClientId&&stubHubClientSecret)};
  const jobs=[];
  if(configuredProviders.seatGeek)jobs.push(runProvider('SeatGeek',()=>fetchSeatGeek(clientId,aid)));
  if(configuredProviders.ticketmaster)jobs.push(runProvider('Ticketmaster',()=>fetchTicketmaster(ticketmasterKey)));
  if(configuredProviders.stubHub)jobs.push(runProvider('StubHub',()=>fetchStubHub(stubHubClientId,stubHubClientSecret)));
  const base={
    ok:true,
    providerType:'ticket-marketplace-price-comparison',
    officialUrl:TITANS_TICKETS_URL,
    scope:'event-level current marketplace minimums',
    pricing:'starting prices reported by each connected marketplace; fees, taxes, delivery, quantity, seat quality, and checkout totals may differ, so verify the final total before buying',
    cheapestFirst:true,
    fetchedAt:new Date().toISOString(),
    configuredProviders,
    providerCatalog:[
      {provider:'SeatGeek',key:'seatGeek',freeAccess:'developer key',priceField:'lowest_price'},
      {provider:'Ticketmaster',key:'ticketmaster',freeAccess:'Discovery API key',priceField:'priceRanges.min'},
      {provider:'StubHub',key:'stubHub',freeAccess:'approved application credentials',priceField:'min_ticket_price'},
    ],
  };
  if(!jobs.length)return res.status(200).json({...base,provider:'Comparison',configured:false,available:false,priceAvailable:false,events:[],games:[],providerResults:[],count:0,offerCount:0,providersConfigured:0,providersCompared:0,providerFailures:0,stale:false,message:'No live price providers are connected yet. Add any free SeatGeek, Ticketmaster, or approved StubHub credentials to start comparing current marketplace minimums.'});

  const providerResults=await Promise.all(jobs);
  const successful=providerResults.filter(result=>result.ok);
  const failed=providerResults.filter(result=>!result.ok);
  const events=providerResults.flatMap(result=>result.events).sort(compareOffers);
  const games=groupTicketOffers(events);
  const priceAvailable=games.some(game=>priceFinite(game.lowestPrice)!=null);
  const provider=successful.length>1?'Comparison':successful[0]?.provider||'Comparison';
  const health={providersConfigured:jobs.length,providersCompared:successful.length,providerFailures:failed.length};

  if(!successful.length){
    const previous=currentLastGood();
    if(previous){
      return res.status(200).json({...previous.payload,...base,...health,provider:'Comparison',configured:true,available:Boolean(previous.payload.games?.length),priceAvailable:Boolean(previous.payload.priceAvailable),providerResults:providerResults.map(({events:ignored,...result})=>result),stale:true,staleReason:'all-configured-providers-unavailable',lastGoodAt:new Date(previous.savedAt).toISOString(),staleAgeMs:previous.ageMs,message:'Live ticket providers are temporarily unavailable. Showing the last known good price comparison while we retry the connected sources.'});
    }
  }

  const response={...base,...health,provider,configured:true,available:Boolean(games.length),priceAvailable,events,games,count:games.length,offerCount:events.length,providerResults:providerResults.map(({events:ignored,...result})=>result),stale:false,message:priceAvailable?`Compared ${successful.length} of ${jobs.length} connected ticket source${jobs.length===1?'':'s'} and sorted Titans games by the lowest reported starting price.${failed.length?` ${failed.length} source${failed.length===1?' is':'s are'} temporarily unavailable.`:''}`:'Connected ticket sources did not return a current starting price. Official game links remain available.'};
  if(games.length&&successful.length)lastGoodSnapshot={savedAt:Date.now(),payload:response};
  return res.status(200).json(response);
}
