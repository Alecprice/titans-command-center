import fs from 'node:fs';

const PRODUCTION_URL=String(process.env.PRODUCTION_URL||'https://titans.alecjprice.com').replace(/\/+$/,'');
const ENDPOINT=`${PRODUCTION_URL}/api/fan-events`;
const REPORT='/tmp/fan-events-production-smoke.json';
const ALLOWED_PROVIDERS=new Set(['Ticketmaster','SeatGeek','Eventbrite','Skiddle']);
const SECRET_MARKERS=['EVENTBRITE_PRIVATE_TOKEN','EVENTBRITE_OAUTH_TOKEN','EVENTBRITE_ORGANIZATION_IDS','SKIDDLE_API_KEY','TICKETMASTER_API_KEY','SEATGEEK_CLIENT_ID','SEATGEEK_AID','SEATGEEK_CLIENT_SECRET','STUBHUB_CLIENT_SECRET','authorization','bearer','client_secret','access_token'];

function fail(message){
  throw new Error(`[fan-events-production] ${message}`);
}
function assert(condition,message){if(!condition)fail(message);}
function number(value){return Number.isFinite(Number(value))?Number(value):null;}
function httpsUrl(value){
  try{return new URL(String(value||'')).protocol==='https:';}
  catch{return false;}
}
function credentialFreeUrl(value){
  try{
    const url=new URL(String(value||''));
    const keys=[...url.searchParams.keys()].map(key=>key.toLowerCase());
    return !keys.some(key=>['apikey','api_key','client_id','client_secret','token','access_token'].includes(key));
  }catch{return false;}
}
function writeReport(value){
  try{fs.writeFileSync(REPORT,JSON.stringify(value,null,2));}catch{}
}

try{
  const response=await fetch(ENDPOINT,{headers:{Accept:'application/json','User-Agent':'TitansCommandCenter/FanEventsProductionGate'},signal:AbortSignal.timeout(12000)});
  assert(response.ok,`endpoint returned HTTP ${response.status}`);
  const payload=await response.json();
  assert(payload?.ok===true,'payload ok flag is not true');
  assert(payload?.providerType==='fan-event-discovery','unexpected providerType');
  assert(payload?.region?.label==='Nashville, TN','production region label drifted');
  assert(Math.abs(Number(payload?.region?.lat)-36.1665)<0.05,'production latitude drifted outside Nashville guardrail');
  assert(Math.abs(Number(payload?.region?.lon)-(-86.7713))<0.05,'production longitude drifted outside Nashville guardrail');
  assert(number(payload?.region?.radiusMiles)>=5&&number(payload?.region?.radiusMiles)<=50,'radius is outside server bounds');
  assert(number(payload?.window?.lookaheadDays)>=7&&number(payload?.window?.lookaheadDays)<=60,'lookahead is outside server bounds');

  const events=Array.isArray(payload?.events)?payload.events:[];
  const providerResults=Array.isArray(payload?.providerResults)?payload.providerResults:[];
  const configuredProviders=payload?.configuredProviders&&typeof payload.configuredProviders==='object'?payload.configuredProviders:{};
  const configuredCount=Object.values(configuredProviders).filter(Boolean).length;
  const providersConfigured=number(payload?.providersConfigured);
  const providersAvailable=number(payload?.providersAvailable);
  const providersContributing=number(payload?.providersContributing);
  const providerFailures=number(payload?.providerFailures);

  assert(number(payload?.count)===events.length,'count does not match events length');
  assert(providersConfigured===configuredCount,'providersConfigured does not match configuredProviders');
  assert(providerResults.length===providersConfigured,'providerResults length does not match providersConfigured');
  assert(providersAvailable>=0&&providersAvailable<=providersConfigured,'providersAvailable invariant failed');
  assert(providersContributing>=0&&providersContributing<=providersAvailable,'providersContributing invariant failed');
  assert(providerFailures===providersConfigured-providersAvailable,'providerFailures invariant failed');

  const resultNames=new Set();
  for(const result of providerResults){
    assert(ALLOWED_PROVIDERS.has(result?.provider),`unexpected provider result ${String(result?.provider)}`);
    assert(!resultNames.has(result.provider),`duplicate provider result ${result.provider}`);
    resultNames.add(result.provider);
    assert(number(result?.count)>=0,`${result.provider} count is invalid`);
    assert(number(result?.displayedCount)>=0,`${result.provider} displayedCount is invalid`);
    assert(number(result?.events)===number(result?.displayedCount),`${result.provider} compatibility events count drifted`);
    if(result?.ok===false)assert(number(result?.displayedCount)===0,`${result.provider} failed but claims displayed events`);
  }

  const contributing=new Set();
  for(const event of events){
    assert(ALLOWED_PROVIDERS.has(event?.provider),`unexpected event provider ${String(event?.provider)}`);
    assert(httpsUrl(event?.url),'event URL is not HTTPS');
    assert(credentialFreeUrl(event?.url),'event URL contains provider credentials');
    const sources=Array.isArray(event?.sources)?event.sources:[];
    assert(sources.length>=1,'displayed event has no source attribution');
    assert(number(event?.providerCount)===sources.length,'providerCount does not match source attribution length');
    for(const source of sources){
      assert(ALLOWED_PROVIDERS.has(source?.provider),`unexpected source provider ${String(source?.provider)}`);
      assert(httpsUrl(source?.url),'source URL is not HTTPS');
      assert(credentialFreeUrl(source?.url),'source URL contains provider credentials');
      contributing.add(source.provider);
    }
  }
  assert(contributing.size===providersContributing,'providersContributing does not match displayed source provenance');

  const serialized=JSON.stringify(payload);
  for(const marker of SECRET_MARKERS)assert(!serialized.toLowerCase().includes(marker.toLowerCase()),`response leaked secret marker ${marker}`);
  assert(!/bandsintown/i.test(serialized),'retired Bandsintown provider reappeared in production');
  if(events.length){
    assert(/contributing provider/.test(String(payload?.message||'')),'event summary does not distinguish contributing providers');
    assert(/connected provider/.test(String(payload?.message||'')),'event summary does not distinguish responding providers');
  }

  const report={
    ok:true,
    endpoint:ENDPOINT,
    events:events.length,
    providersConfigured,
    providersAvailable,
    providersContributing,
    providerFailures,
    configuredProviders:Object.fromEntries([...ALLOWED_PROVIDERS].map(name=>[name.toLowerCase(),Boolean(configuredProviders[name.toLowerCase()])])),
    providers:[...resultNames],
    fetchedAt:payload?.fetchedAt||null,
    testedAt:new Date().toISOString(),
  };
  writeReport(report);
  console.log(JSON.stringify(report,null,2));
}catch(error){
  const message=error instanceof Error?error.message:String(error);
  writeReport({ok:false,endpoint:ENDPOINT,error:message,testedAt:new Date().toISOString()});
  throw error;
}
