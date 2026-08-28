const SEATGEEK_EVENTS='https://api.seatgeek.com/2/events';
const TICKETMASTER_EVENTS='https://app.ticketmaster.com/discovery/v2/events.json';
export const TITANS_TICKETS_URL='https://seatgeek.com/tennessee-titans-tickets';
const TITANS_SLUG='tennessee-titans';

const finite=value=>{if(value==null||value==='')return null;const number=Number(value);return Number.isFinite(number)&&number>=0?number:null;};
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
export function ticketPriceBand(value){
  const price=finite(value);
  if(price==null)return {key:'unknown',label:'Price unavailable',order:99};
  if(price<50)return {key:'under-50',label:'Under $50',order:0};
  if(price<100)return {key:'50-99',label:'$50–$99',order:1};
  if(price<200)return {key:'100-199',label:'$100–$199',order:2};
  return {key:'200-plus',label:'$200+',order:3};
}
function homeAway(title){
  const value=String(title||'').toLowerCase();
  if(value.includes(' at tennessee titans'))return'home';
  if(value.includes('tennessee titans at '))return'away';
  return'all';
}
function normalizeSeatGeekEvent(event){
  const stats=event?.stats||{};
  const lowestPrice=finite(stats.lowest_price);
  return {
    id:String(event?.id||''),
    provider:'SeatGeek',
    title:String(event?.title||'Tennessee Titans tickets'),
    url:safeSeatGeekUrl(event?.url),
    datetimeLocal:String(event?.datetime_local||''),
    datetimeUtc:String(event?.datetime_utc||''),
    timeTbd:Boolean(event?.time_tbd),
    homeAway:homeAway(event?.title),
    venue:{
      name:String(event?.venue?.name||'Venue TBD'),
      city:String(event?.venue?.city||''),
      state:String(event?.venue?.state||''),
    },
    listingCount:finite(stats.listing_count),
    lowestPrice,
    averagePrice:finite(stats.average_price),
    highestPrice:finite(stats.highest_price),
    priceBand:ticketPriceBand(lowestPrice),
  };
}
export function normalizeSeatGeekEvents(events=[]){
  return (Array.isArray(events)?events:[])
    .map(normalizeSeatGeekEvent)
    .filter(event=>event.id&&event.url)
    .sort((a,b)=>(a.lowestPrice??Number.MAX_SAFE_INTEGER)-(b.lowestPrice??Number.MAX_SAFE_INTEGER)||String(a.datetimeUtc).localeCompare(String(b.datetimeUtc))||a.title.localeCompare(b.title));
}
function ticketmasterLocalDate(event){
  const start=event?.dates?.start||{};
  if(start.localDate&&start.localTime)return`${start.localDate}T${start.localTime}`;
  return String(start.localDate||start.dateTime||'');
}
function ticketmasterPriceRange(event){
  const ranges=Array.isArray(event?.priceRanges)?event.priceRanges:[];
  const minimums=ranges.map(range=>finite(range?.min)).filter(value=>value!=null);
  const maximums=ranges.map(range=>finite(range?.max)).filter(value=>value!=null);
  return {min:minimums.length?Math.min(...minimums):null,max:maximums.length?Math.max(...maximums):null};
}
function normalizeTicketmasterEvent(event){
  const title=String(event?.name||'');
  if(!title.toLowerCase().includes('tennessee titans'))return null;
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
    venue:{
      name:String(venue?.name||'Venue TBD'),
      city:String(venue?.city?.name||''),
      state:String(venue?.state?.stateCode||venue?.state?.name||''),
    },
    listingCount:null,
    lowestPrice:range.min,
    averagePrice:null,
    highestPrice:range.max,
    priceBand:ticketPriceBand(range.min),
  };
}
export function normalizeTicketmasterEvents(events=[]){
  return (Array.isArray(events)?events:[])
    .map(normalizeTicketmasterEvent)
    .filter(Boolean)
    .filter(event=>event.id&&event.url)
    .sort((a,b)=>(a.lowestPrice??Number.MAX_SAFE_INTEGER)-(b.lowestPrice??Number.MAX_SAFE_INTEGER)||String(a.datetimeUtc).localeCompare(String(b.datetimeUtc))||a.title.localeCompare(b.title));
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
  const upstream=await fetch(url,{headers:{Accept:'application/json','User-Agent':'TitansCommandCenter/1.0 tickets'},signal:AbortSignal.timeout(2200)});
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
  const upstream=await fetch(url,{headers:{Accept:'application/json','User-Agent':'TitansCommandCenter/1.0 tickets'},signal:AbortSignal.timeout(2200)});
  if(!upstream.ok)throw new Error(`Ticketmaster ${upstream.status}`);
  const payload=await upstream.json();
  return normalizeTicketmasterEvents(payload?._embedded?.events);
}
export async function ticketsRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=3600');
  const clientId=String(env?.SEATGEEK_CLIENT_ID||'').trim();
  const aid=String(env?.SEATGEEK_AID||'').trim();
  const ticketmasterKey=String(env?.TICKETMASTER_API_KEY||'').trim();
  const base={
    ok:true,
    providerType:'ticket-marketplace-event-summary',
    officialUrl:TITANS_TICKETS_URL,
    scope:'event-inventory-summary',
    pricing:'lowest available event price when exposed by the active provider; marketplace taxes, delivery, fees, or optional add-ons may vary by source',
    cheapestFirst:true,
    fetchedAt:new Date().toISOString(),
    configuredProviders:{seatGeek:Boolean(clientId),ticketmaster:Boolean(ticketmasterKey)},
  };

  if(clientId){
    try{
      const events=await fetchSeatGeek(clientId,aid);
      if(events.length)return res.status(200).json({...base,provider:'SeatGeek',configured:true,available:true,events,count:events.length});
    }catch(error){console.error('[tickets-seatgeek]',error);}
  }

  if(ticketmasterKey){
    try{
      const events=await fetchTicketmaster(ticketmasterKey);
      if(events.length)return res.status(200).json({...base,provider:'Ticketmaster',configured:true,available:true,events,count:events.length,message:'Ticketmaster Discovery is providing event-level price ranges while the SeatGeek summary feed is unavailable.'});
    }catch(error){console.error('[tickets-ticketmaster]',error);}
  }

  if(!clientId&&!ticketmasterKey)return res.status(200).json({...base,provider:'SeatGeek',configured:false,available:false,events:[],message:'Live ticket pricing is not connected to this deployment yet.'});
  return res.status(200).json({...base,provider:clientId?'SeatGeek':'Ticketmaster',configured:true,available:false,events:[],message:'Live ticket pricing is temporarily unavailable. Open SeatGeek for the complete current marketplace.'});
}
