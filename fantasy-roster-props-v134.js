(() => {
  'use strict';
  const ROUTE='fantasy',PROP_ROOT='#fantasy-live-props-v122',STATE_KEY='titans-fantasy-v1',PLAYER_KEY='titans-fantasy-sleeper-player-index-v1';
  const PLAYER_TTL=24*60*60*1000,CONTEXT_TTL=5*60*1000,POSITIONS=['QB','RB','WR','TE','K'];
  const state={context:null,error:'',loading:false,connectionKey:'',loadedAt:0,rosterOnly:false};
  const app=document.querySelector('#app');
  let observer=null,requestSerial=0,queued=false;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const clean=value=>String(value??'').trim();
  const esc=value=>clean(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const parseObject=(raw,fallback={})=>{try{const value=JSON.parse(raw);return value&&typeof value==='object'&&!Array.isArray(value)?value:fallback}catch{return fallback}};
  const normName=value=>clean(value).toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\b(jr|sr|ii|iii|iv)\b/g,' ').replace(/\s+/g,' ').trim();
  const connection=()=>{const raw=parseObject(localStorage.getItem(STATE_KEY));return {username:clean(raw.sleeperUser).slice(0,64),leagueId:clean(raw.leagueId).slice(0,32)};};
  const validConnection=value=>Boolean(value.username&&/^\d{6,32}$/.test(value.leagueId));
  const connectionKey=value=>validConnection(value)?`${value.username.toLowerCase()}|${value.leagueId}`:'';
  const requestCurrent=(serial,key)=>serial===requestSerial&&route()===ROUTE&&connectionKey(connection())===key;
  const resumeObserver=()=>{if(observer&&app)observer.observe(app,{childList:true,subtree:true})};

  async function sleeper(path){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
    try{
      const response=await fetch(`https://api.sleeper.app/v1${path}`,{headers:{Accept:'application/json'},signal:controller.signal});
      if(!response.ok)throw new Error(`Sleeper returned ${response.status}`);
      return await response.json();
    }finally{clearTimeout(timer)}
  }

  const slimPlayer=(id,p={})=>({
    id:String(id),
    name:clean(p.full_name||[p.first_name,p.last_name].filter(Boolean).join(' ')||`Player ${id}`),
    position:clean(p.position||p.fantasy_positions?.[0]||''),
    team:clean(p.team||''),
    status:clean(p.status||''),
    injury:clean(p.injury_status||''),
    number:p.number==null?'':String(p.number)
  });
  async function playerIndex(){
    const cached=parseObject(localStorage.getItem(PLAYER_KEY));
    if(Number(cached.savedAt)>0&&Date.now()-Number(cached.savedAt)<PLAYER_TTL&&cached.players&&typeof cached.players==='object')return cached.players;
    const maps=await Promise.all(POSITIONS.map(position=>sleeper(`/players/nfl?position=${position}&active=true`)));
    const players={};
    for(const map of maps){for(const [id,p] of Object.entries(map||{}))players[id]=slimPlayer(id,p)}
    try{localStorage.setItem(PLAYER_KEY,JSON.stringify({savedAt:Date.now(),players}))}catch{}
    return players;
  }

  function buildContext(user,rosters,players){
    const owner=user?.user_id?(rosters||[]).find(roster=>String(roster.owner_id)===String(user.user_id)):null;
    if(!owner)return {matched:false,players:[],byName:{},starterCount:0,benchCount:0};
    const starterIds=new Set((owner.starters||[]).map(String));
    const rows=(owner.players||[]).map(id=>{
      const key=String(id),player=players[key];
      if(!player||!player.name)return null;
      const slot=starterIds.has(key)?'starter':'bench';
      return {...player,slot};
    }).filter(Boolean);
    const byName={};
    for(const player of rows){const key=normName(player.name);if(key&&!byName[key])byName[key]=player}
    return {matched:true,players:rows,byName,starterCount:rows.filter(player=>player.slot==='starter').length,benchCount:rows.filter(player=>player.slot==='bench').length};
  }

  function publish(){
    window.TitansFantasyRosterContext=state.context?{...state.context,connectionKey:state.connectionKey,loadedAt:state.loadedAt}:null;
    dispatchEvent(new CustomEvent('titans:fantasy-roster-context',{detail:window.TitansFantasyRosterContext}));
  }

  async function loadContext(force=false){
    if(route()!==ROUTE)return;
    const current=connection(),key=connectionKey(current);
    if(!key){
      requestSerial++;state.context=null;state.error='';state.loading=false;state.connectionKey='';state.loadedAt=0;state.rosterOnly=false;publish();decorate();return;
    }
    if(!force&&state.context&&state.connectionKey===key&&Date.now()-state.loadedAt<CONTEXT_TTL){decorate();return;}
    if(state.loading&&state.connectionKey===key)return;
    state.loading=true;state.error='';state.connectionKey=key;decorate();
    const serial=++requestSerial;
    try{
      const [user,rosters,players]=await Promise.all([
        sleeper(`/user/${encodeURIComponent(current.username)}`),
        sleeper(`/league/${current.leagueId}/rosters`),
        playerIndex()
      ]);
      if(!requestCurrent(serial,key))return;
      if(!user?.user_id)throw new Error('Sleeper user not found');
      state.context=buildContext(user,Array.isArray(rosters)?rosters:[],players||{});
      state.loadedAt=Date.now();
      if(!state.context.matched)state.rosterOnly=false;
      publish();
    }catch(error){
      if(!requestCurrent(serial,key))return;
      state.context=null;state.rosterOnly=false;
      state.error=error?.name==='AbortError'?'Sleeper roster check timed out':clean(error?.message||'Sleeper roster unavailable');
      publish();
    }finally{
      if(serial===requestSerial){
        state.loading=false;
        if(route()===ROUTE){
          if(connectionKey(connection())!==key)queue();
          else decorate();
        }
      }
    }
  }

  function playerMatch(row){
    const name=clean(row.querySelector('.fprop-player strong')?.textContent);
    if(!name||!state.context?.matched)return null;
    return state.context.byName?.[normName(name)]||null;
  }

  function ensureBadge(row,player){
    const host=row.querySelector('.fprop-player');if(!host)return;
    let badge=host.querySelector('.frp-roster-badge');
    if(!player){badge?.remove();return}
    if(!badge){badge=document.createElement('em');badge.className='frp-roster-badge';host.appendChild(badge)}
    const label=player.slot==='starter'?'MY STARTER':'MY BENCH';
    const className=`frp-roster-badge is-${player.slot}`;
    if(badge.className!==className)badge.className=className;
    if(badge.textContent!==label)badge.textContent=label;
    badge.title=`Matched to your connected Sleeper ${player.slot}`;
  }

  function toolbarMarkup(matches,total){
    const current=connection();
    if(!validConnection(current))return `<div class="frp-roster-copy"><strong>Personalize these props</strong><span>Connect Sleeper to mark your starters and bench on this board.</span></div><button type="button" class="frp-open-sleeper">Open Sleeper Connect</button>`;
    if(state.loading)return `<div class="frp-roster-copy"><strong>Matching your Sleeper roster…</strong><span>Player-prop lines stay visible while the read-only roster check runs.</span></div><button type="button" class="frp-refresh-roster" disabled>Checking…</button>`;
    if(state.error)return `<div class="frp-roster-copy"><strong>Sleeper roster unavailable</strong><span>${esc(state.error)}. No prop rows were guessed or hidden.</span></div><button type="button" class="frp-refresh-roster">Retry roster</button>`;
    if(!state.context?.matched)return `<div class="frp-roster-copy"><strong>Sleeper roster not matched</strong><span>The connected user does not own a roster in this selected league.</span></div><button type="button" class="frp-refresh-roster">Refresh roster</button>`;
    return `<div class="frp-roster-copy"><strong>${matches} of ${total} visible props match your roster</strong><span>${state.context.starterCount} starters · ${state.context.benchCount} bench players resolved from Sleeper.</span></div><div class="frp-roster-actions"><button type="button" class="frp-roster-toggle" aria-pressed="${state.rosterOnly?'true':'false'}">${state.rosterOnly?'Show all props':'My roster only'}</button><button type="button" class="frp-refresh-roster">Refresh roster</button></div>`;
  }

  function ensureToolbar(root,matches,total){
    let toolbar=root.querySelector('.frp-roster-tools');
    if(!toolbar){
      toolbar=document.createElement('div');toolbar.className='frp-roster-tools';toolbar.setAttribute('aria-live','polite');
      const controls=root.querySelector('.fprop-controls');(controls||root.querySelector('.fprop-board'))?.insertAdjacentElement('afterend',toolbar);
    }
    const markup=toolbarMarkup(matches,total);
    if(toolbar.dataset.signature!==markup){toolbar.innerHTML=markup;toolbar.dataset.signature=markup}
    toolbar.querySelector('.frp-open-sleeper')?.addEventListener('click',()=>document.querySelector('[data-ftab="sleeper"]')?.click(),{once:true});
    toolbar.querySelector('.frp-refresh-roster')?.addEventListener('click',()=>loadContext(true),{once:true});
    toolbar.querySelector('.frp-roster-toggle')?.addEventListener('click',()=>{state.rosterOnly=!state.rosterOnly;decorate()},{once:true});
  }

  function injectStyle(){
    if(document.querySelector('style[data-fantasy-roster-props-v134]'))return;
    const style=document.createElement('style');style.dataset.fantasyRosterPropsV134='true';style.textContent=`
      .frp-roster-tools{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 14px;padding:12px 14px;border:1px solid rgba(126,184,238,.22);border-radius:14px;background:rgba(75,146,219,.08)}
      .frp-roster-copy{min-width:0}.frp-roster-copy strong,.frp-roster-copy span{display:block}.frp-roster-copy strong{font-size:.86rem;color:#f5f8fb}.frp-roster-copy span{margin-top:3px;color:#9db1c5;font-size:.76rem;line-height:1.35}
      .frp-roster-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.frp-roster-tools button{min-height:44px;border:1px solid rgba(126,184,238,.3);border-radius:10px;padding:0 12px;background:#102c49;color:#eaf5ff;font:inherit;font-size:.78rem;font-weight:900;cursor:pointer}.frp-roster-tools button:hover{background:#183b60}.frp-roster-tools button:focus-visible{outline:3px solid #7eb8ee;outline-offset:2px}.frp-roster-tools button[aria-pressed="true"]{background:#4b92db;color:#071321}.frp-roster-tools button:disabled{opacity:.65;cursor:wait}
      .frp-roster-badge{display:inline-flex;align-items:center;align-self:flex-start;width:max-content;margin-top:7px;padding:4px 7px;border-radius:999px;font-style:normal;font-size:.65rem;font-weight:950;letter-spacing:.06em}.frp-roster-badge.is-starter{background:rgba(93,190,127,.16);border:1px solid rgba(93,190,127,.35);color:#bff2ce}.frp-roster-badge.is-bench{background:rgba(126,184,238,.12);border:1px solid rgba(126,184,238,.3);color:#bfe0ff}.fprop-row[hidden]{display:none!important}
      @media(max-width:620px){.frp-roster-tools{align-items:stretch;flex-direction:column}.frp-roster-actions{display:grid;grid-template-columns:1fr 1fr}.frp-roster-tools button{min-height:48px}.frp-open-sleeper,.frp-refresh-roster:only-child{width:100%}}
      @media(max-width:390px){.frp-roster-actions{grid-template-columns:1fr}.frp-roster-copy strong{font-size:.9rem}.frp-roster-copy span{font-size:.8rem}}
      @media(forced-colors:active){.frp-roster-tools,.frp-roster-badge{border:1px solid CanvasText}.frp-roster-tools button{border:1px solid ButtonText}}
    `;document.head.append(style);
  }

  function decorate(){
    if(route()!==ROUTE)return;
    const root=document.querySelector(PROP_ROOT);if(!root)return;
    observer?.disconnect();
    try{
      injectStyle();
      const rows=[...root.querySelectorAll('.fprop-row')],canFilter=Boolean(state.context?.matched),matches=[];
      for(const row of rows){
        const matched=playerMatch(row);if(matched)matches.push(row);
        ensureBadge(row,matched);
        row.hidden=Boolean(state.rosterOnly&&canFilter&&!matched);
      }
      ensureToolbar(root,matches.length,rows.length);
    }finally{resumeObserver()}
  }

  function maybeLoad(){
    if(route()!==ROUTE)return;
    const key=connectionKey(connection());
    if(key!==state.connectionKey){state.context=null;state.error='';state.loadedAt=0;state.rosterOnly=false;loadContext(true);return}
    if(!key){decorate();return}
    if(!state.context&&!state.loading&&!state.error)loadContext(false);else decorate();
  }

  const queue=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;maybeLoad()})};
  observer=new MutationObserver(queue);resumeObserver();
  addEventListener('hashchange',()=>{requestSerial++;state.loading=false;queue()});
  addEventListener('storage',event=>{if(event.key===STATE_KEY||event.key===PLAYER_KEY)queue()});
  queue();
  window.TitansFantasyRosterProps={refresh:()=>loadContext(true),buildContext,normName};
})();
