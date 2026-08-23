(() => {
  'use strict';
  const ROUTE='fantasy',STATE_KEY='titans-fantasy-v1',PLAYER_KEY='titans-fantasy-sleeper-player-index-v1',PLAYER_TTL=24*60*60*1000;
  const POSITIONS=['QB','RB','WR','TE','K'];
  let serial=0,lastKey='',running=false;
  const root=()=>document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const parseObject=(raw,fallback={})=>{try{const value=JSON.parse(raw);return value&&typeof value==='object'&&!Array.isArray(value)?value:fallback}catch{return fallback}};
  const state=()=>{const raw=parseObject(localStorage.getItem(STATE_KEY));return {username:String(raw.sleeperUser||'').slice(0,64),leagueId:String(raw.leagueId||'').slice(0,32),week:Number.isInteger(raw.week)?Math.max(1,Math.min(18,raw.week)):1};};
  const saveScoring=mode=>{const raw=parseObject(localStorage.getItem(STATE_KEY));raw.scoring=mode;try{localStorage.setItem(STATE_KEY,JSON.stringify(raw))}catch{};document.querySelector(`[data-scoring='${mode}']`)?.click()};
  const sleeper=async path=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);try{const r=await fetch(`https://api.sleeper.app/v1${path}`,{headers:{Accept:'application/json'},signal:controller.signal});if(!r.ok)throw new Error(`Sleeper returned ${r.status}`);return await r.json()}finally{clearTimeout(timer)}};
  const slimPlayer=(id,p={})=>({id:String(id),name:String(p.full_name||[p.first_name,p.last_name].filter(Boolean).join(' ')||`Player ${id}`),position:String(p.position||p.fantasy_positions?.[0]||''),team:String(p.team||''),status:String(p.status||''),injury:String(p.injury_status||''),number:p.number==null?'':String(p.number)});
  async function playerIndex(){
    const cached=parseObject(localStorage.getItem(PLAYER_KEY));
    if(Number(cached.savedAt)>0&&Date.now()-Number(cached.savedAt)<PLAYER_TTL&&cached.players&&typeof cached.players==='object')return cached.players;
    const maps=await Promise.all(POSITIONS.map(position=>sleeper(`/players/nfl?position=${position}&active=true`)));
    const players={};for(const map of maps){for(const [id,p] of Object.entries(map||{}))players[id]=slimPlayer(id,p)}
    try{localStorage.setItem(PLAYER_KEY,JSON.stringify({savedAt:Date.now(),players}))}catch{}
    return players;
  }
  const playerFor=(id,index)=>{const key=String(id||'');if(index[key])return index[key];if(/^[A-Z]{2,4}$/.test(key))return {id:key,name:`${key} D/ST`,position:'DEF',team:key,status:'',injury:'',number:''};return {id:key,name:`Player ${key}`,position:'',team:'',status:'',injury:'',number:''}};
  const scoringMode=league=>{const rec=Number(league?.scoring_settings?.rec??NaN);return rec===1?'ppr':rec===0.5?'half':rec===0?'standard':'custom'};
  const scoringLabel=mode=>mode==='ppr'?'PPR':mode==='half'?'Half-PPR':mode==='standard'?'Standard':'Custom';
  const ownerTeam=(user,rosters)=>user?.user_id?(rosters||[]).find(r=>String(r.owner_id)===String(user.user_id)):null;
  const rosteredIds=rosters=>new Set((rosters||[]).flatMap(r=>Array.isArray(r.players)?r.players:[]).map(String));
  function playerRow(p,label=''){
    const injury=p.injury?` · ${esc(p.injury)}`:'',team=p.team?` · ${esc(p.team)}`:'';
    return `<div class="fsi-player"><div><strong>${esc(p.name)}</strong><span>${esc(p.position||'—')}${team}${injury}</span></div>${label?`<em>${esc(label)}</em>`:''}</div>`;
  }
  function style(){if(document.querySelector('style[data-fantasy-sleeper-v2]'))return;const node=document.createElement('style');node.dataset.fantasySleeperV2='true';node.textContent=`.fsi-wrap{grid-column:1/-1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.fsi-card{border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:18px;background:linear-gradient(180deg,rgba(13,39,67,.86),rgba(6,21,37,.94));min-width:0}.fsi-card h2{margin:.25rem 0 .45rem}.fsi-card>small{color:#7eb8ee;font-weight:900;letter-spacing:.12em}.fsi-note{color:#98adc1;font-size:.82rem;line-height:1.45}.fsi-list{display:grid;gap:7px;margin-top:12px}.fsi-player{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 11px;border-radius:11px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}.fsi-player strong,.fsi-player span{display:block}.fsi-player span{font-size:.75rem;color:#96abc0;margin-top:2px}.fsi-player em{font-style:normal;color:#82c5ff;font-size:.72rem;font-weight:900}.fsi-split{display:grid;grid-template-columns:1fr 1fr;gap:10px}.fsi-score{display:flex;gap:8px;flex-wrap:wrap}.fsi-score span{padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.05);font-size:.78rem}.fsi-score b{display:block;color:#fff}.fsi-button{min-height:44px;border:0;border-radius:10px;background:#4b92db;color:#071321;font-weight:900;padding:0 13px;cursor:pointer}.fsi-attribution{margin-top:10px;font-size:.72rem;color:#7890a7}.fsi-error{grid-column:1/-1;border:1px solid rgba(255,110,110,.35);border-radius:12px;padding:11px;color:#ffd1d1;background:rgba(145,25,25,.14)}@media(max-width:800px){.fsi-wrap,.fsi-split{grid-template-columns:1fr}}@media(max-width:560px){.fsi-card{padding:14px}.fsi-button{width:100%}.fsi-player{min-height:52px}}`;document.head.append(node)}
  function renderIntel(host,{league,user,rosters,players,adds,drops}){
    host.querySelector('.fsi-wrap')?.remove();
    const mine=ownerTeam(user,rosters),starters=new Set((mine?.starters||[]).map(String)),all=(mine?.players||[]).map(String),bench=all.filter(id=>!starters.has(id));
    const occupied=rosteredIds(rosters),availableAdds=(adds||[]).filter(row=>!occupied.has(String(row.player_id))&&players[String(row.player_id)]).slice(0,10),dropRows=(drops||[]).filter(row=>players[String(row.player_id)]).slice(0,6);
    const mode=scoringMode(league),score=league?.scoring_settings||{};
    const wrap=document.createElement('section');wrap.className='fsi-wrap';
    wrap.innerHTML=`<article class="fsi-card"><small>MY SLEEPER LINEUP</small><h2>${mine?'Starters & bench':'Roster match unavailable'}</h2>${mine?`<div class="fsi-split"><section><h3>Starters</h3><div class="fsi-list">${(mine.starters||[]).map(id=>playerRow(playerFor(id,players),'START')).join('')||'<div class="fantasy-empty">No starters returned.</div>'}</div></section><section><h3>Bench</h3><div class="fsi-list">${bench.map(id=>playerRow(playerFor(id,players),'BENCH')).join('')||'<div class="fantasy-empty">No bench players returned.</div>'}</div></section></div>`:'<p class="fsi-note">The connected Sleeper user could not be matched to an owned roster in this league.</p>'}</article><article class="fsi-card"><small>LEAGUE SCORING</small><h2>${scoringLabel(mode)}</h2><div class="fsi-score"><span><b>${esc(score.rec??'—')}</b> per reception</span><span><b>${esc(score.pass_td??'—')}</b> pass TD</span><span><b>${esc(score.rush_td??'—')}</b> rush TD</span><span><b>${esc(score.rec_td??'—')}</b> rec TD</span></div>${mode!=='custom'?`<button type="button" class="fsi-button" data-fsi-scoring="${mode}">Use ${scoringLabel(mode)} preset</button>`:'<p class="fsi-note">This league uses custom scoring. The calculator stays on your manually selected preset rather than pretending to reproduce every custom rule.</p>'}</article><article class="fsi-card"><small>WAIVER PULSE</small><h2>Trending adds available in this league</h2><p class="fsi-note">These are Sleeper-wide add trends filtered against every roster in the selected league, so “available” means unrostered here—not universally available.</p><div class="fsi-list">${availableAdds.map(row=>playerRow(playerFor(row.player_id,players),`${row.count} adds`)).join('')||'<div class="fantasy-empty">No resolved trending adds are currently unrostered in this league.</div>'}</div><div class="fsi-attribution">Trending data: Sleeper · 24-hour lookback</div></article><article class="fsi-card"><small>DROP WATCH</small><h2>Trending drops</h2><p class="fsi-note">A trend is context, not a recommendation. Check injury, role and your league settings before making a move.</p><div class="fsi-list">${dropRows.map(row=>playerRow(playerFor(row.player_id,players),`${row.count} drops`)).join('')||'<div class="fantasy-empty">No resolved drop trends.</div>'}</div><div class="fsi-attribution">Trending data: Sleeper · 24-hour lookback</div></article>`;
    host.append(wrap);wrap.querySelector('[data-fsi-scoring]')?.addEventListener('click',e=>saveScoring(e.currentTarget.dataset.fsiScoring));
  }
  async function hydrate(){
    if(route()!==ROUTE||running)return;const s=state(),content=root()?.querySelector('.fantasy-content');if(!content||!s.username||!/^\d{6,32}$/.test(s.leagueId))return;
    const visibleSleeper=Boolean(content.querySelector('#sleeper-connect'));if(!visibleSleeper){content.querySelector('.fsi-wrap')?.remove();return}
    const key=`${s.username}|${s.leagueId}|${s.week}`;if(key===lastKey&&content.querySelector('.fsi-wrap'))return;lastKey=key;running=true;const mine=++serial;
    try{
      style();
      const [user,league,rosters,players,adds,drops]=await Promise.all([
        sleeper(`/user/${encodeURIComponent(s.username)}`),sleeper(`/league/${s.leagueId}`),sleeper(`/league/${s.leagueId}/rosters`),playerIndex(),sleeper('/players/nfl/trending/add?lookback_hours=24&limit=25'),sleeper('/players/nfl/trending/drop?lookback_hours=24&limit=15')
      ]);
      if(mine!==serial||route()!==ROUTE)return;renderIntel(content,{league,user,rosters,players,adds,drops});
    }catch(error){if(mine!==serial)return;const box=document.createElement('div');box.className='fsi-error';box.textContent=error?.name==='AbortError'?'Sleeper intelligence timed out. Try again from Sleeper Connect.':`Sleeper intelligence unavailable: ${error?.message||error}`;content.querySelector('.fsi-wrap')?.remove();content.append(box)}finally{running=false}
  }
  const observer=new MutationObserver(()=>queueMicrotask(hydrate));if(root())observer.observe(root(),{childList:true,subtree:true});
  addEventListener('hashchange',()=>{serial++;lastKey='';queueMicrotask(hydrate)});queueMicrotask(hydrate);
})();
