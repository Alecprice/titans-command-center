import('./ask-fantasy-bridge-v1.js').catch(()=>{});
(() => {
  'use strict';
  const ROUTE='fantasy',STATE_KEY='titans-fantasy-v1',PLAYER_KEY='titans-fantasy-sleeper-player-index-v1',PENDING_KEY='titans-fantasy-pending-question-v1';
  const app=()=>document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const plain=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
  const read=(key,fallback={})=>{try{return plain(JSON.parse(localStorage.getItem(key)||'null'))}catch{return fallback}};
  const state=()=>read(STATE_KEY,{});
  const playerIndex=()=>plain(read(PLAYER_KEY,{}).players);
  const sleeper=async path=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6500);try{const r=await fetch(`https://api.sleeper.app/v1${path}`,{headers:{Accept:'application/json'},signal:controller.signal});if(!r.ok)throw new Error(`Sleeper ${r.status}`);return await r.json()}finally{clearTimeout(timer)}};
  const norm=v=>String(v??'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  let context=null,contextKey='',contextPromise=null,promiseKey='';

  function manualCandidates(){return Array.isArray(state().manual)?state().manual.slice(0,40).map((p,i)=>({id:`manual:${i}`,name:String(p.name||'Player'),position:String(p.position||''),team:String(p.team||''),slot:String(p.slot||'watch'),source:'manual'})):[]}
  function meta(id){const p=playerIndex()[String(id)]||{};return {id:String(id),name:p.full_name||[p.first_name,p.last_name].filter(Boolean).join(' ')||`Player ${id}`,position:p.position||'',team:p.team||'',injury:p.injury_status||'',status:p.status||'',source:'sleeper'}}
  function trendMap(rows=[]){const map=new Map();for(const r of rows||[])map.set(String(r.player_id),Number(r.count)||0);return map}
  function pendingMatches(candidates){
    let query='';try{query=String(localStorage.getItem(PENDING_KEY)||'').slice(0,160)}catch{}
    if(!query)return [];
    try{localStorage.removeItem(PENDING_KEY)}catch{}
    const q=norm(query);if(!q)return [];
    return candidates.filter(p=>{const name=norm(p.name);return name.length>3&&q.includes(name)}).slice(0,2);
  }
  function evidence(player,ctx){
    let score=0;const reasons=[];
    if(player.slot==='starter'){score+=2;reasons.push('currently in a starter slot')}
    if(player.slot==='bench'){reasons.push('currently on the bench')}
    const injury=String(player.injury||player.status||'').toLowerCase();
    if(/out|ir|injured reserve|pup|inactive/.test(injury)){score-=4;reasons.push(`availability flag: ${player.injury||player.status}`)}
    else if(/questionable|doubtful/.test(injury)){score-=2;reasons.push(`availability flag: ${player.injury||player.status}`)}
    const adds=ctx.adds.get(String(player.id))||0,drops=ctx.drops.get(String(player.id))||0;
    if(adds>0){score+=Math.min(2,adds>=100?2:1);reasons.push(`${adds} Sleeper trending adds`)}
    if(drops>0){score-=Math.min(2,drops>=100?2:1);reasons.push(`${drops} Sleeper trending drops`)}
    const titan=ctx.titans.find(p=>norm(p.name)===norm(player.name));
    if(titan){const s=String(titan.status||titan.tag||'').toLowerCase();if(/reserve|inactive|pup|injur/.test(s)){score-=3;reasons.push(`Titans roster status: ${titan.status||titan.tag}`)}else{reasons.push('matched to the current Titans roster')}}
    return {score,reasons:reasons.length?reasons:['No strong evidence signal loaded']};
  }
  function buildContext(key){
    return (async()=>{
      const s=state(),base={candidates:manualCandidates(),adds:new Map(),drops:new Map(),titans:[]};
      const data=await fetch('/api/data',{headers:{Accept:'application/json'}}).then(r=>r.ok?r.json():null).catch(()=>null);base.titans=Array.isArray(data?.roster)?data.roster:[];
      if(!s.sleeperUser||!s.leagueId)return base;
      const user=await sleeper(`/user/${encodeURIComponent(s.sleeperUser)}`);const rosters=await sleeper(`/league/${encodeURIComponent(s.leagueId)}/rosters`);
      const owner=(rosters||[]).find(r=>String(r.owner_id)===String(user?.user_id));
      const [adds,drops]=await Promise.all([sleeper('/players/nfl/trending/add?lookback_hours=24&limit=25'),sleeper('/players/nfl/trending/drop?lookback_hours=24&limit=15')]);
      base.adds=trendMap(adds);base.drops=trendMap(drops);
      if(owner){const starters=new Set((owner.starters||[]).map(String));for(const id of owner.players||[]){const p=meta(id);p.slot=starters.has(String(id))?'starter':'bench';base.candidates.push(p)}}
      const seen=new Set();base.candidates=base.candidates.filter(p=>{const k=`${norm(p.name)}|${p.team}|${p.position}`;if(seen.has(k))return false;seen.add(k);return true}).slice(0,80);
      return base;
    })().catch(()=>({candidates:manualCandidates(),adds:new Map(),drops:new Map(),titans:[]})).then(value=>{if(key===`${state().sleeperUser||''}|${state().leagueId||''}`){context=value;contextKey=key}return value});
  }
  function loadContext(){
    const s=state(),key=`${s.sleeperUser||''}|${s.leagueId||''}`;
    if(context&&contextKey===key)return Promise.resolve(context);
    if(contextPromise&&promiseKey===key)return contextPromise;
    promiseKey=key;contextPromise=buildContext(key).finally(()=>{if(promiseKey===key){contextPromise=null;promiseKey=''}});return contextPromise;
  }
  function option(p){return `<option value="${esc(p.id)}">${esc(p.name)}${p.position?` · ${esc(p.position)}`:''}${p.team?` · ${esc(p.team)}`:''}</option>`}
  function card(player,ev){return `<div class="fdc-player"><strong>${esc(player.name)}</strong><span>${esc([player.position,player.team,player.slot].filter(Boolean).join(' · '))}</span><b>${ev.score>0?'+':''}${ev.score} evidence</b><ul>${ev.reasons.slice(0,4).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`}
  function verdict(a,b,ea,eb){const diff=ea.score-eb.score;if(Math.abs(diff)<2)return 'Too close to call from the loaded evidence. Check late availability and your league rules.';const lead=diff>0?a:b;return `Evidence leans ${lead.name}, but this is not a point projection or guarantee.`}
  function syncDistinctSelects(a,b,prefer='a'){
    for(const opt of [...a.options,...b.options])opt.disabled=false;
    if(a.value&&a.value===b.value){
      const keeper=prefer==='b'?b:a,mover=prefer==='b'?a:b;
      const next=[...mover.options].find(opt=>opt.value!==keeper.value);
      if(next)mover.value=next.value;
    }
    const av=a.value,bv=b.value;
    for(const opt of a.options)opt.disabled=Boolean(bv&&opt.value===bv);
    for(const opt of b.options)opt.disabled=Boolean(av&&opt.value===av);
    return Boolean(av&&bv&&av!==bv);
  }
  async function mount(){
    if(route()!==ROUTE)return;const host=app()?.querySelector('.fantasy-content');if(!host||host.querySelector('[data-fantasy-decision]'))return;
    const ctx=await loadContext();if(route()!==ROUTE||!host.isConnected||host.querySelector('[data-fantasy-decision]'))return;
    const candidates=ctx.candidates;if(candidates.length<2)return;
    const section=document.createElement('section');section.dataset.fantasyDecision='ready';section.className='fdc';
    section.innerHTML=`<div class="fdc-head"><div><small>DECISION CENTER</small><h2>Start / Sit Compare</h2><p>Compare transparent evidence—not invented projections. Choose two different players.</p></div></div><div class="fdc-controls"><label>Player A<select data-fdc-a>${candidates.map(option).join('')}</select></label><label>Player B<select data-fdc-b>${candidates.map(option).join('')}</select></label></div><div data-fdc-result></div><p class="fdc-note">Signals can include starter/bench status, current availability flags, Titans roster status and Sleeper 24-hour add/drop trends. Always confirm late news and your league scoring.</p>`;
    const style=document.createElement('style');style.textContent='.fdc{margin-top:18px;padding:18px;border:1px solid rgba(120,180,255,.22);border-radius:18px;background:rgba(7,20,38,.72)}.fdc h2{margin:.2rem 0}.fdc p{margin:.3rem 0 .8rem}.fdc-controls{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fdc-controls label{display:grid;gap:6px}.fdc select{min-height:44px;border-radius:10px;padding:8px}.fdc-compare{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.fdc-player{padding:12px;border:1px solid rgba(255,255,255,.12);border-radius:12px}.fdc-player span,.fdc-player b{display:block;margin-top:4px}.fdc-player ul{padding-left:18px}.fdc-verdict{grid-column:1/-1;padding:12px;border-radius:12px;background:rgba(80,160,220,.12);font-weight:700}.fdc-note{font-size:.9rem;opacity:.78}@media(max-width:560px){.fdc-controls,.fdc-compare{grid-template-columns:1fr}.fdc-verdict{grid-column:auto}}';section.appendChild(style);host.appendChild(section);
    const a=section.querySelector('[data-fdc-a]'),b=section.querySelector('[data-fdc-b]'),out=section.querySelector('[data-fdc-result]');if(candidates[1])b.selectedIndex=1;
    const pending=pendingMatches(candidates);if(pending[0])a.value=pending[0].id;if(pending[1])b.value=pending[1].id;syncDistinctSelects(a,b,'a');
    const draw=()=>{const pa=candidates.find(p=>p.id===a.value),pb=candidates.find(p=>p.id===b.value);if(!pa||!pb)return;if(pa.id===pb.id){out.innerHTML='<div class="fdc-compare"><div class="fdc-verdict">Choose two different players to compare loaded evidence.</div></div>';return}const ea=evidence(pa,ctx),eb=evidence(pb,ctx);out.innerHTML=`<div class="fdc-compare">${card(pa,ea)}${card(pb,eb)}<div class="fdc-verdict">${esc(verdict(pa,pb,ea,eb))}</div></div>`};a.addEventListener('change',()=>{syncDistinctSelects(a,b,'a');draw()});b.addEventListener('change',()=>{syncDistinctSelects(a,b,'b');draw()});draw();
  }
  const observer=new MutationObserver(()=>{if(route()===ROUTE)queueMicrotask(mount)});if(app())observer.observe(app(),{childList:true,subtree:true});addEventListener('hashchange',()=>{contextKey='';context=null;if(route()===ROUTE)queueMicrotask(mount)});queueMicrotask(mount);
})();