const EVENTBRITE_BASE='https://www.eventbriteapi.com/v3';
const SKIDDLE_SEARCH='https://www.skiddle.com/api/v1/events/search/';
const TICKETMASTER_EVENTS='https://app.ticketmaster.com/discovery/v2/events.json';
const SEATGEEK_EVENTS='https://api.seatgeek.com/2/events';
const USER_AGENT='TitansCommandCenter/1.0 fan-events';
const DEFAULT_LAT=36.1665;
const DEFAULT_LON=-86.7713;
const DEFAULT_RADIUS_MILES=25;
const DEFAULT_LOOKAHEAD_DAYS=30;
const DEFAULT_LIMIT=18;
const EARTH_RADIUS_MILES=3958.8;

const text=value=>String(value??'').trim();
const finite=value=>{if(value==null||value==='')return null;const number=Number(value);return Number.isFinite(number)?number:null;};
const bounded=(value,fallback,min,max)=>{const number=finite(value);return number==null?fallback:Math.max(min,Math.min(max,number));};
const csv=(value,max=8)=>text(value).split(',').map(item=>item.trim()).filter(Boolean).slice(0,max);
const dateMs=value=>{const stamp=Date.parse(String(value||''));return Number.isFinite(stamp)?stamp:null;};
const isoDay=value=>{const stamp=dateMs(value);return stamp==null?'':new Date(stamp).toISOString().slice(0,10);};
const normalize=value=>text(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const queryOf=req=>Object.fromEntries(Object.entries(req?.query||{}).filter(([key])=>key!=='route'));
const seatGeekUtc=value=>{const raw=text(value);if(!raw)return'';return /(?:Z|[+-]\d\d:\d\d)$/i.test(raw)?raw:`${raw}Z`;};

export function fanEventsConfig(env={}){
  const lookaheadDays=Math.round(bounded(env.FAN_EVENTS_LOOKAHEAD_DAYS,DEFAULT_LOOKAHEAD_DAYS,7,60));
  const limit=Math.round(bounded(env.FAN_EVENTS_LIMIT,DEFAULT_LIMIT,6,24));
  const lat=bounded(env.FAN_EVENTS_LAT,DEFAULT_LAT,-90,90);
  const lon=bounded(env.FAN_EVENTS_LON,DEFAULT_LON,-180,180);
  const radiusMiles=Math.round(bounded(env.FAN_EVENTS_RADIUS_MILES,DEFAULT_RADIUS_MILES,5,50));
  const start=new Date();
  const end=new Date(start.getTime()+lookaheadDays*86400000);
  return {lat,lon,radiusMiles,lookaheadDays,limit,regionLabel:text(env.FAN_EVENTS_REGION_LABEL)||'Nashville, TN',start,end};
}

function safeUrl(value,provider){
  try{
    const url=new URL(text(value));
    if(url.protocol!=='https:')return'';
    const host=url.hostname.toLowerCase();
    const allowed=provider==='Eventbrite'?(host==='eventbrite.com'||host.endsWith('.eventbrite.com'))
      :provider==='Skiddle'?(host==='skiddle.com'||host.endsWith('.skiddle.com'))
      :provider==='SeatGeek'?(host==='seatgeek.com'||host.endsWith('.seatgeek.com'))
      :provider==='Ticketmaster'?(host==='ticketmaster.com'||host.endsWith('.ticketmaster.com'))
      :false;
    return allowed?url.href:'';
  }catch{return'';}
}

function eventShape({id,provider,title,start,end='',venue={},url='',category='',artist='',distanceMiles=null,lat=null,lon=null}){
  return {
    id:text(id),provider,title:text(title)||'Event',start:text(start),end:text(end),
    venue:{name:text(venue?.name)||'Venue TBD',city:text(venue?.city),state:text(venue?.state),country:text(venue?.country)},
    url:safeUrl(url,provider),category:text(category),artist:text(artist),distanceMiles:finite(distanceMiles),
    coordinates:{lat:finite(lat),lon:finite(lon)}
  };
}

export function normalizeEventbriteEvents(events=[]){
  return (Array.isArray(events)?events:[]).map(event=>{
    const venue=event?.venue||event?._embedded?.venue||{};
    const address=venue?.address||{};
    return eventShape({
      id:`eb:${text(event?.id)}`,provider:'Eventbrite',title:event?.name?.text||event?.name?.html||event?.name,
      start:event?.start?.utc||event?.start?.local,end:event?.end?.utc||event?.end?.local,
      venue:{name:venue?.name,city:address?.city,state:address?.region,country:address?.country},url:event?.url,category:'Eventbrite organizer event',
      lat:address?.latitude??venue?.latitude,lon:address?.longitude??venue?.longitude
    });
  }).filter(event=>event.id!=='eb:'&&event.start&&event.url);
}

export function normalizeSkiddleEvents(events=[]){
  return (Array.isArray(events)?events:[]).map(event=>{
    const venue=event?.venue||{};
    const start=event?.startdate||event?.startDate||event?.date||event?.openingtimes?.doorsopen||'';
    return eventShape({
      id:`sk:${text(event?.id||event?.eventid)}`,provider:'Skiddle',title:event?.eventname||event?.name,
      start,end:event?.enddate||event?.endDate||event?.openingtimes?.lastentry||'',
      venue:{name:venue?.name||event?.venuename,city:venue?.town||venue?.city,state:venue?.county||venue?.state,country:venue?.country},
      url:event?.link||event?.url,category:event?.eventcode||event?.type,distanceMiles:event?.distance,
      lat:event?.latitude??venue?.latitude,lon:event?.longitude??venue?.longitude
    });
  }).filter(event=>event.id!=='sk:'&&event.start&&event.url);
}

export function normalizeSeatGeekEvents(events=[]){
  return (Array.isArray(events)?events:[]).map(event=>{
    const venue=event?.venue||{};
    const taxonomy=Array.isArray(event?.taxonomies)?event.taxonomies[0]||{}:{};
    return eventShape({
      id:`sg-event:${text(event?.id)}`,provider:'SeatGeek',title:event?.title,
      start:seatGeekUtc(event?.datetime_utc)||event?.datetime_local,
      venue:{name:venue?.name||venue?.name_v2,city:venue?.city,state:venue?.state,country:venue?.country},
      url:event?.url,category:taxonomy?.name||event?.type,
      lat:venue?.location?.lat??venue?.location?.latitude,lon:venue?.location?.lon??venue?.location?.longitude
    });
  }).filter(event=>event.id!=='sg-event:'&&event.start&&event.url);
}

export function normalizeTicketmasterEvents(events=[]){
  return (Array.isArray(events)?events:[]).map(event=>{
    const venue=event?._embedded?.venues?.[0]||{};
    const classification=event?.classifications?.[0]||{};
    return eventShape({
      id:`tm-event:${text(event?.id)}`,provider:'Ticketmaster',title:event?.name,start:event?.dates?.start?.dateTime||event?.dates?.start?.localDate,
      venue:{name:venue?.name,city:venue?.city?.name,state:venue?.state?.stateCode||venue?.state?.name,country:venue?.country?.countryCode||venue?.country?.name},
      url:event?.url,category:classification?.segment?.name||classification?.genre?.name,lat:venue?.location?.latitude,lon:venue?.location?.longitude
    });
  }).filter(event=>event.id!=='tm-event:'&&event.start&&event.url);
}

function eventSignature(event){return `${isoDay(event.start)}|${normalize(event.title)}|${normalize(event.venue?.name)}`;}
function sourceOf(event){return {provider:event.provider,url:event.url,attribution:event.provider==='Skiddle'?'Skiddle':event.provider};}
function radians(value){return Number(value)*Math.PI/180;}
function distanceMiles(lat1,lon1,lat2,lon2){
  const aLat=radians(lat1),bLat=radians(lat2),dLat=radians(Number(lat2)-Number(lat1)),dLon=radians(Number(lon2)-Number(lon1));
  const a=Math.sin(dLat/2)**2+Math.cos(aLat)*Math.cos(bLat)*Math.sin(dLon/2)**2;
  return 2*EARTH_RADIUS_MILES*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function regionParts(label='Nashville, TN'){
  const [city='',state='']=String(label).split(',').map(value=>normalize(value));
  return {city,state};
}
function stateMatches(value,expected){
  const actual=normalize(value);
  if(!expected)return true;
  if(actual===expected)return true;
  if(expected==='tn'&&actual==='tennessee')return true;
  if(expected==='tennessee'&&actual==='tn')return true;
  return false;
}
export function eventInRegion(event,config={}){
  const radius=bounded(config.radiusMiles,DEFAULT_RADIUS_MILES,5,50);
  const reported=finite(event?.distanceMiles);
  if(reported!=null)return reported>=0&&reported<=radius;
  const lat=finite(event?.coordinates?.lat),lon=finite(event?.coordinates?.lon);
  const centerLat=bounded(config.lat,DEFAULT_LAT,-90,90),centerLon=bounded(config.lon,DEFAULT_LON,-180,180);
  if(lat!=null&&lon!=null)return distanceMiles(centerLat,centerLon,lat,lon)<=radius;
  const expected=regionParts(config.regionLabel||'Nashville, TN');
  return normalize(event?.venue?.city)===expected.city&&stateMatches(event?.venue?.state,expected.state);
}

export function groupFanEvents(events=[],config={start:new Date(),end:new Date(Date.now()+DEFAULT_LOOKAHEAD_DAYS*86400000),limit:DEFAULT_LIMIT}){
  const startMs=config.start instanceof Date?config.start.getTime():dateMs(config.start);
  const endMs=config.end instanceof Date?config.end.getTime():dateMs(config.end);
  const groups=new Map();
  for(const event of Array.isArray(events)?events:[]){
    const stamp=dateMs(event?.start);
    if(stamp==null||stamp<(startMs??0)||stamp>(endMs??Number.MAX_SAFE_INTEGER)||!event?.url||!eventInRegion(event,config))continue;
    const signature=eventSignature(event);
    const existing=groups.get(signature);
    if(!existing){groups.set(signature,{...event,sources:[sourceOf(event)],providerCount:1});continue;}
    if(!existing.sources.some(source=>source.provider===event.provider&&source.url===event.url))existing.sources.push(sourceOf(event));
    existing.providerCount=existing.sources.length;
    if(existing.venue?.name==='Venue TBD'&&event.venue?.name!=='Venue TBD')existing.venue=event.venue;
  }
  return [...groups.values()].sort((a,b)=>(dateMs(a.start)??Number.MAX_SAFE_INTEGER)-(dateMs(b.start)??Number.MAX_SAFE_INTEGER)||a.title.localeCompare(b.title)).slice(0,Math.max(1,Number(config.limit)||DEFAULT_LIMIT));
}

async function getJson(url,options={}){
  const {label='Provider',...requestOptions}=options;
  const response=await fetch(url,{...requestOptions,headers:{Accept:'application/json','User-Agent':USER_AGENT,...(requestOptions.headers||{})},signal:AbortSignal.timeout(4200)});
  if(!response.ok)throw new Error(`${label} ${response.status}`);
  return response.json();
}

async function eventbriteOrganizations(token,configuredIds){
  if(configuredIds.length)return configuredIds;
  const payload=await getJson(`${EVENTBRITE_BASE}/users/me/organizations/`,{headers:{Authorization:`Bearer ${token}`},label:'Eventbrite organizations'});
  return (payload?.organizations||[]).map(org=>text(org?.id)).filter(Boolean).slice(0,4);
}

async function fetchEventbrite(token,config,env){
  const orgIds=await eventbriteOrganizations(token,csv(env.EVENTBRITE_ORGANIZATION_IDS,4));
  if(!orgIds.length)return {events:[],scope:'authorized-organizations',message:'The connected Eventbrite account has no organizations available to this token.'};
  const payloads=await Promise.all(orgIds.map(async id=>{
    const url=new URL(`${EVENTBRITE_BASE}/organizations/${encodeURIComponent(id)}/events/`);
    url.searchParams.set('status','live');
    url.searchParams.set('time_filter','current_future');
    url.searchParams.set('order_by','start_asc');
    url.searchParams.set('expand','venue');
    return getJson(url,{headers:{Authorization:`Bearer ${token}`},label:'Eventbrite events'});
  }));
  const events=normalizeEventbriteEvents(payloads.flatMap(payload=>payload?.events||[]));
  return {events,scope:'authorized-organizations',message:'Eventbrite is limited to events owned by organizations authorized for this token; only events verified inside the configured Nashville region are displayed. The retired public Event Search API is not used.'};
}

async function fetchSkiddle(apiKey,config){
  const url=new URL(SKIDDLE_SEARCH);
  url.searchParams.set('api_key',apiKey);
  url.searchParams.set('latitude',String(config.lat));
  url.searchParams.set('longitude',String(config.lon));
  url.searchParams.set('radius',String(config.radiusMiles));
  url.searchParams.set('getdistance','1');
  url.searchParams.set('minDate',config.start.toISOString().slice(0,10));
  url.searchParams.set('maxDate',config.end.toISOString().slice(0,10));
  url.searchParams.set('order','date');
  url.searchParams.set('limit',String(Math.min(24,config.limit)));
  const payload=await getJson(url,{label:'Skiddle'});
  return {events:normalizeSkiddleEvents(payload?.results||payload?.events||[]),scope:'nashville-radius',message:'Skiddle provides geographic event discovery for the configured Nashville radius. Every displayed Skiddle result keeps the direct Skiddle event link and required Skiddle source attribution.'};
}

async function fetchSeatGeek(clientId,aid,config){
  const url=new URL(SEATGEEK_EVENTS);
  url.searchParams.set('client_id',clientId);
  if(aid)url.searchParams.set('aid',aid);
  url.searchParams.set('lat',String(config.lat));
  url.searchParams.set('lon',String(config.lon));
  url.searchParams.set('range',`${config.radiusMiles}mi`);
  url.searchParams.set('datetime_utc.gte',config.start.toISOString().slice(0,19));
  url.searchParams.set('datetime_utc.lte',config.end.toISOString().slice(0,19));
  url.searchParams.set('per_page',String(Math.min(24,config.limit)));
  url.searchParams.set('sort','datetime_utc.asc');
  const payload=await getJson(url,{label:'SeatGeek'});
  return {events:normalizeSeatGeekEvents(payload?.events||[]),scope:'nashville-radius',message:'SeatGeek provides live-event discovery around the same bounded Nashville radius using the existing server-side SeatGeek client ID.'};
}

async function fetchTicketmaster(apiKey,config){
  const url=new URL(TICKETMASTER_EVENTS);
  url.searchParams.set('apikey',apiKey);
  url.searchParams.set('latlong',`${config.lat},${config.lon}`);
  url.searchParams.set('radius',String(config.radiusMiles));
  url.searchParams.set('unit','miles');
  url.searchParams.set('startDateTime',config.start.toISOString().replace(/\.\d{3}Z$/,'Z'));
  url.searchParams.set('endDateTime',config.end.toISOString().replace(/\.\d{3}Z$/,'Z'));
  url.searchParams.set('size',String(Math.min(24,config.limit)));
  url.searchParams.set('sort','date,asc');
  const payload=await getJson(url,{label:'Ticketmaster'});
  return {events:normalizeTicketmasterEvents(payload?._embedded?.events||[]),scope:'nashville-radius',message:'Ticketmaster provides broad event discovery around the configured Nashville radius when its existing Discovery API key is available.'};
}

async function runProvider(provider,run){
  const started=Date.now();
  try{
    const result=await run();
    return {ok:true,provider,events:Array.isArray(result?.events)?result.events:[],scope:result?.scope||'',message:result?.message||'',durationMs:Date.now()-started};
  }catch(error){
    console.warn(`[fan-events:${provider.toLowerCase()}]`,error);
    return {ok:false,provider,events:[],scope:'',message:`${provider} is temporarily unavailable.`,durationMs:Date.now()-started};
  }
}

function methodOnly(req,res){res.setHeader('Allow','GET');if(req.method!=='GET'){res.status(405).json({ok:false,error:'Method not allowed'});return true;}return false;}

export async function fanEventsRoute(req,res,env=process.env){
  if(methodOnly(req,res))return;
  if(Object.keys(queryOf(req)).length){res.setHeader('Cache-Control','no-store');return res.status(400).json({ok:false,error:'Fan Events does not accept public query parameters'});}
  res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=1800');
  const config=fanEventsConfig(env);
  const eventbriteToken=text(env.EVENTBRITE_PRIVATE_TOKEN||env.EVENTBRITE_OAUTH_TOKEN);
  const skiddleKey=text(env.SKIDDLE_API_KEY);
  const seatGeekClientId=text(env.SEATGEEK_CLIENT_ID);
  const seatGeekAid=text(env.SEATGEEK_AID);
  const ticketmasterKey=text(env.TICKETMASTER_API_KEY);
  const configuredProviders={
    ticketmaster:Boolean(ticketmasterKey),
    seatgeek:Boolean(seatGeekClientId),
    eventbrite:Boolean(eventbriteToken),
    skiddle:Boolean(skiddleKey),
  };
  const jobs=[];
  if(ticketmasterKey)jobs.push(runProvider('Ticketmaster',()=>fetchTicketmaster(ticketmasterKey,config)));
  if(seatGeekClientId)jobs.push(runProvider('SeatGeek',()=>fetchSeatGeek(seatGeekClientId,seatGeekAid,config)));
  if(eventbriteToken)jobs.push(runProvider('Eventbrite',()=>fetchEventbrite(eventbriteToken,config,env)));
  if(skiddleKey)jobs.push(runProvider('Skiddle',()=>fetchSkiddle(skiddleKey,config)));
  const providerCatalog=[
    {provider:'Ticketmaster',key:'ticketmaster',scope:'broad Nashville-radius discovery',terms:'Existing Discovery API integration.'},
    {provider:'SeatGeek',key:'seatgeek',scope:'broad Nashville-radius discovery',terms:'Existing SeatGeek client ID is reused server-side for event discovery.'},
    {provider:'Eventbrite',key:'eventbrite',scope:'authorized-organization events that also pass Nashville-region verification',terms:'Public Event Search was retired; this integration does not call it.'},
    {provider:'Skiddle',key:'skiddle',scope:'geographic search around the configured Nashville radius',terms:'Skiddle results retain the direct event link and are displayed with Skiddle name and official brand-logo attribution.'},
  ];
  const base={
    ok:true,providerType:'fan-event-discovery',region:{label:config.regionLabel,lat:config.lat,lon:config.lon,radiusMiles:config.radiusMiles},
    window:{start:config.start.toISOString(),end:config.end.toISOString(),lookaheadDays:config.lookaheadDays},
    configuredProviders,providerCatalog,fetchedAt:new Date().toISOString()
  };
  if(!jobs.length)return res.status(200).json({...base,configured:false,available:false,events:[],count:0,providersConfigured:0,providersAvailable:0,providersContributing:0,providerFailures:0,providerResults:[],message:'No fan-event providers are configured yet. Server-side credentials can be added without exposing API keys to the browser.'});

  const providerResults=await Promise.all(jobs);
  const successful=providerResults.filter(result=>result.ok);
  const failed=providerResults.filter(result=>!result.ok);
  const events=groupFanEvents(providerResults.flatMap(result=>result.events),config);
  const displayedCounts=new Map();
  for(const event of events){
    for(const source of Array.isArray(event?.sources)?event.sources:[]){
      displayedCounts.set(source.provider,(displayedCounts.get(source.provider)||0)+1);
    }
  }
  const providersContributing=displayedCounts.size;
  const contributingLabel=`${providersContributing} contributing provider${providersContributing===1?'':'s'}`;
  const respondingLabel=`${successful.length} connected provider${successful.length===1?'':'s'} responded`;
  return res.status(200).json({
    ...base,configured:true,available:Boolean(events.length),events,count:events.length,providersConfigured:jobs.length,
    providersAvailable:successful.length,providersContributing,providerFailures:failed.length,
    providerResults:providerResults.map(({events:rows,...result})=>({...result,count:rows.length,events:displayedCounts.get(result.provider)||0,displayedCount:displayedCounts.get(result.provider)||0})),
    message:events.length?`Showing ${events.length} upcoming event${events.length===1?'':'s'} from ${contributingLabel}; ${respondingLabel} around ${config.regionLabel}.`:`${respondingLabel}, but none returned an upcoming event verified inside the current ${config.radiusMiles}-mile ${config.regionLabel} window.`
  });
}
