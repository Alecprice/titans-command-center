(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  if(!runtime)return;

  let queued=false;
  let market=null,marketPromise=null;
  let data=null,dataPromise=null;

  const route=()=>runtime.route();
  const rows=value=>Array.isArray(value)?value:[];
  const validDate=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?null:d};
  const age=value=>{const d=validDate(value);if(!d)return'freshness unavailable';const minutes=Math.max(0,Math.round((Date.now()-d.getTime())/60000));return minutes<2?'just now':minutes<60?`${minutes} min ago`:minutes<1440?`${Math.round(minutes/60)} hr ago`:`${Math.round(minutes/1440)} day${Math.round(minutes/1440)===1?'':'s'} ago`};
  const gameTime=value=>{const d=validDate(value);return d?new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/Chicago',timeZoneName:'short'}).format(d):'TBD'};
  const countdown=value=>{const t=Date.parse(value),diff=t-Date.now();if(!Number.isFinite(t))return'Time TBD';if(diff<=0)return'Game time';const hours=Math.floor(diff/3600000);if(hours>=48)return`${Math.floor(hours/24)} days`;if(hours>=1)return`${hours} hours`;return`${Math.max(1,Math.floor(diff/60000))} min`};

  function dedupe(selector){
    const matches=[...document.querySelectorAll(selector)];
    for(const duplicate of matches.slice(1))duplicate.remove();
    return matches[0]||null;
  }

  async function loadMarket(){
    if(market)return market;
    if(marketPromise)return marketPromise;
    marketPromise=runtime.apiJson('/api/market-data',{ttl:30000}).then(value=>{market=value?.ok?value:null;return market}).finally(()=>marketPromise=null);
    return marketPromise;
  }

  async function loadData(){
    if(data)return data;
    if(dataPromise)return dataPromise;
    dataPromise=runtime.apiJson('/api/data',{ttl:30000}).then(value=>{data=value?.ok?value:null;return data}).finally(()=>dataPromise=null);
    return dataPromise;
  }

  function nextGame(payload){
    const now=Date.now();
    return rows(payload?.games).find(game=>{const t=Date.parse(game.date);return Number.isFinite(t)&&t>now&&!/final|bye/i.test(String(game.status||''))})||null;
  }

  async function repairMarketCards(){
    const board=document.querySelector('[data-v10-home]');
    if(!board)return;
    const marketCard=board.querySelector('.v10-market-card');
    const freshness=[...board.querySelectorAll('.v10-command-card')].find(card=>card.querySelector('small')?.textContent?.trim()==='DATA FRESHNESS');
    if(!marketCard&&!freshness)return;
    const current=await loadMarket();
    if(route()!=='home'||!current)return;
    const odds=rows(current.odds),provider=String(current.provider||'Market source');
    if(marketCard){
      const strong=marketCard.querySelector('strong'),copy=marketCard.querySelector('p');
      if(strong)strong.textContent=odds.length?`${odds.length} current market rows`:'No current market rows';
      if(copy)copy.textContent=odds.length?`${provider} · checked ${age(current.fetchedAt)}`:`${provider} · ${age(current.fetchedAt)}`;
    }
    if(freshness){
      const copy=freshness.querySelector('p');
      if(copy){
        const rosterIntel=copy.textContent.split('·').slice(0,2).map(x=>x.trim()).filter(Boolean);
        copy.textContent=[...rosterIntel,`Markets ${age(current.fetchedAt)}`].join(' · ');
      }
    }
  }

  async function repairPremiumNextGame(){
    const box=document.querySelector('.v14-now');
    if(!box)return;
    const main=box.querySelector('.v14-now-main');
    if(!main)return;
    const strong=main.querySelector('strong'),when=main.querySelector('span'),status=main.querySelector('b');
    const stale=/schedule tbd|schedule loading|^tbd$/i.test(`${strong?.textContent||''} ${when?.textContent||''} ${status?.textContent||''}`);
    if(!stale)return;
    const payload=await loadData(),game=nextGame(payload);
    if(route()!=='home'||!game)return;
    if(strong)strong.textContent=`${game.homeAway==='home'?'vs':'at'} ${game.opponent||game.opponentAbbr||'Opponent'}`;
    if(when)when.textContent=gameTime(game.date);
    if(status)status.textContent=`Starts in ${countdown(game.date)}`;
    const media=box.querySelector('a[href="#media"] strong');
    if(media)media.textContent=game.network||'Broadcast guide';
  }

  async function syncHome(){
    queued=false;
    if(route()!=='home')return;
    dedupe('[data-v10-home]');
    dedupe('[data-fan-v09="today"]');
    dedupe('.v14-now');
    await Promise.all([repairMarketCards(),repairPremiumNextGame()]);
    if(route()!=='home')return;
    dedupe('[data-v10-home]');
    dedupe('[data-fan-v09="today"]');
    dedupe('.v14-now');
  }

  function schedule(){
    if(queued)return;
    queued=true;
    queueMicrotask(syncHome);
  }

  runtime.onAppRender(schedule,{immediate:true});
  runtime.onRoute(schedule);
  runtime.onRefresh(()=>{market=null;data=null;marketPromise=null;dataPromise=null;schedule()});
})();
