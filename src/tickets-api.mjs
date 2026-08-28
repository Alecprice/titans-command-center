const SEATGEEK_EVENTS='https://api.seatgeek.com/2/events';
export const TITANS_TICKETS_URL='https://seatgeek.com/tennessee-titans-tickets';
const TITANS_SLUG='tennessee-titans';

const finite=value=>{const number=Number(value);return Number.isFinite(number)&&number>=0?number:null;};
export function safeSeatGeekUrl(value){
  try{
    const url=new URL(String(value||''));
    return url.protocol==='https:'&&(url.hostname==='seatgeek.com'||url.hostname.endsWith('.seatgeek.com'))?url.href:TITANS_TICKETS_URL;
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
function normalizeEvent(event){
  const stats=event?.stats||{};
  const lowestPrice=finite(stats.lowest_price);
  return {
    id:String(event?.id||''),
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
    .map(normalizeEvent)
    .filter(event=>event.id&&event.url)
    .sort((a,b)=>(a.lowestPrice??Number.MAX_SAFE_INTEGER)-(b.lowestPrice??Number.MAX_SAFE_INTEGER)||String(a.datetimeUtc).localeCompare(String(b.datetimeUtc))||a.title.localeCompare(b.title));
}
function methodOnly(req,res){
  res.setHeader('Allow','GET');
  if(req.method!=='GET'){res.status(405).json({ok:false,error:'Method not allowed'});return true;}
  return false;
}
export async function ticketsRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=180');
  const clientId=String(env?.SEATGEEK_CLIENT_ID||'').trim();
  const base={
    ok:true,
    provider:'SeatGeek',
    providerType:'official-primary-ticketing-partner',
    officialUrl:TITANS_TICKETS_URL,
    scope:'event-inventory-summary',
    pricing:'lowest available ticket price per event; mandatory SeatGeek fees are included in displayed marketplace prices, while taxes, delivery, or optional add-ons may still apply',
    cheapestFirst:true,
    fetchedAt:new Date().toISOString(),
  };
  if(!clientId)return res.status(200).json({...base,configured:false,available:false,events:[],message:'Live SeatGeek event pricing is not connected to this deployment.'});
  const url=new URL(SEATGEEK_EVENTS);
  url.searchParams.set('client_id',clientId);
  url.searchParams.set('performers.slug',TITANS_SLUG);
  url.searchParams.set('listing_count.gt','0');
  url.searchParams.set('datetime_utc.gte',new Date().toISOString().slice(0,10));
  url.searchParams.set('per_page','50');
  if(env?.SEATGEEK_AID)url.searchParams.set('aid',String(env.SEATGEEK_AID).trim());
  try{
    const upstream=await fetch(url,{headers:{Accept:'application/json','User-Agent':'TitansCommandCenter/1.0 tickets'},signal:AbortSignal.timeout(5000)});
    if(!upstream.ok)throw new Error(`SeatGeek ${upstream.status}`);
    const payload=await upstream.json();
    const events=normalizeSeatGeekEvents(payload?.events);
    return res.status(200).json({...base,configured:true,available:true,events,count:events.length});
  }catch(error){
    console.error('[tickets-seatgeek]',error);
    return res.status(200).json({...base,configured:true,available:false,events:[],message:'Live SeatGeek event pricing is temporarily unavailable.'});
  }
}
