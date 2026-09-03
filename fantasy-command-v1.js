(() => {
  'use strict';
  const ROUTE='fantasy',STORE='titans-fantasy-v1',SEASON='2026';
  const app=()=>document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeJson=(raw,fallback)=>{try{return JSON.parse(raw)}catch{return fallback}};
  const loadState=()=>{const parsed=safeJson(localStorage.getItem(STORE),{}),raw=parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};return {scoring:['standard','half','ppr'].includes(raw.scoring)?raw.scoring:'half',manual:Array.isArray(raw.manual)?raw.manual.slice(0,40):[],sleeperUser:String(raw.sleeperUser||'').slice(0,64),leagueId:String(raw.leagueId||'').slice(0,32),week:Number.isInteger(raw.week)&&raw.week>=1&&raw.week<=18?raw.week:1,tab:['lab','my','sleeper','draft'].includes(raw.tab)?raw.tab:'lab'};};
  let state=loadState(),data=null,renderSerial=0,connectSerial=0,leagueLoadSerial=0,sleeper={user:null,leagues:[],league:null,rosters:[],users:[],matchups:[],drafts:[],picks:[],error:'',draftError:'',connecting:false,connectingUser:'',loading:false,draftLoading:false};
  const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}};
  const clearLeagueData=()=>{sleeper.league=null;sleeper.rosters=[];sleeper.users=[];sleeper.matchups=[];sleeper.drafts=[];sleeper.picks=[];sleeper.draftLoading=false;};
  const normalizedSleeperUser=value=>String(value||'').trim().toLowerCase();
  const leagueRequestCurrent=(serial,leagueId,week)=>serial===leagueLoadSerial&&state.leagueId===leagueId&&state.week===week;
  const scoringPoints=(line,mode=state.scoring)=>{
    const n=k=>Number(line[k]||0),rec=mode==='ppr'?1:mode==='half'?0.5:0;
    return n('passYds')/25+n('passTd')*4-n('int')*2+n('rushYds')/10+n('rushTd')*6+n('rec')*rec+n('recYds')/10+n('recTd')*6+n('twoPt')*2-n('fumbles')*2;
  };
  const isSkill=p=>['QB','RB','FB','WR','TE','K'].includes(String(p.position||'').toUpperCase());
  const posPriority=p=>({QB:1,RB:2,FB:3,WR:4,TE:5,K:6}[String(p.position||'').toUpperCase()]||9);
  const fantasySignal=p=>{
    const pos=String(p.position||'').toUpperCase(),status=String(p.status||p.tag||'').toLowerCase();
    if(/injured|reserve|pup|suspend|inactive/.test(status))return ['Availability watch','warn'];
    if(['QB','RB','WR','TE'].includes(pos))return ['Fantasy relevant','good'];
    if(pos==='K')return ['Kicker watch','neutral'];
    return ['Depth watch','neutral'];
  };
  const matchupPoints=row=>{
    const raw=row?.points;
    if(raw==null||raw==='')return null;
    const value=Number(raw);
    return Number.isFinite(value)?value:null;
  };
  const matchupScore=row=>{const value=matchupPoints(row);return value==null?'—':value.toFixed(2)};
  const resolvedRosterCounts=owner=>{
    const players=Array.isArray(owner?.players)?owner.players.map(String).filter(id=>id&&id!=='0'):[];
    const rostered=new Set(players),starters=Array.isArray(owner?.starters)?owner.starters.map(String):[];
    return {starters:starters.filter(id=>id&&id!=='0'&&rostered.has(id)).length,rostered:players.length};
  };
  const sleeperFetch=async path=>{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6500);
    try{const r=await fetch(`https://api.sleeper.app/v1${path}`,{headers:{Accept:'application/json'},signal:controller.signal});if(!r.ok)throw new Error(`Sleeper returned ${r.status}`);return await r.json();}finally{clearTimeout(timer)}
  };
  async function loadTitans(){if(data)return data;try{const r=await fetch('/api/data',{headers:{Accept:'application/json'}}),d=await r.json();data=r.ok&&d.ok?d:{};}catch{data={};}return data;}
  async function connectSleeper(username=state.sleeperUser){
    const clean=String(username||'').trim();if(!clean){connectSerial++;sleeper.connecting=false;sleeper.connectingUser='';sleeper.error='Enter a Sleeper username.';render();return;}
    if(sleeper.connecting)return;
    const switchingUser=normalizedSleeperUser(clean)!==normalizedSleeperUser(state.sleeperUser),serial=++connectSerial;
    leagueLoadSerial++;sleeper.connecting=true;sleeper.connectingUser=clean;sleeper.loading=false;sleeper.error='';sleeper.draftError='';clearLeagueData();
    if(switchingUser){sleeper.user=null;sleeper.leagues=[];}
    render();
    try{
      const user=await sleeperFetch(`/user/${encodeURIComponent(clean)}`);if(serial!==connectSerial)return;if(!user?.user_id)throw new Error('Sleeper user not found');
      const leagues=await sleeperFetch(`/user/${encodeURIComponent(user.user_id)}/leagues/nfl/${SEASON}`);if(serial!==connectSerial)return;
      sleeper.user=user;sleeper.leagues=Array.isArray(leagues)?leagues:[];state.sleeperUser=clean;sleeper.connectingUser='';
      if(state.leagueId&&!sleeper.leagues.some(l=>String(l.league_id)===state.leagueId))state.leagueId='';
      if(!state.leagueId&&sleeper.leagues[0])state.leagueId=String(sleeper.leagues[0].league_id);
      sleeper.connecting=false;save();if(state.leagueId)await loadLeague(state.leagueId);else render();
    }catch(e){if(serial!==connectSerial)return;sleeper.connecting=false;sleeper.error=e?.name==='AbortError'?'Sleeper request timed out.':String(e?.message||'Sleeper unavailable');render();}
    finally{if(serial===connectSerial)sleeper.connecting=false;}
  }
  async function loadDraftData(serial,leagueId,requestWeek){
    try{
      const drafts=await sleeperFetch(`/league/${leagueId}/drafts`);if(!leagueRequestCurrent(serial,leagueId,requestWeek))return;
      const safeDrafts=Array.isArray(drafts)?drafts:[];sleeper.drafts=safeDrafts;sleeper.picks=[];
      const draft=safeDrafts[0];
      if(!draft?.draft_id)return;
      render();
      try{const picks=await sleeperFetch(`/draft/${encodeURIComponent(draft.draft_id)}/picks`);if(!leagueRequestCurrent(serial,leagueId,requestWeek))return;sleeper.picks=Array.isArray(picks)?picks:[];}
      catch(e){if(!leagueRequestCurrent(serial,leagueId,requestWeek))return;sleeper.picks=[];sleeper.draftError=e?.name==='AbortError'?'Sleeper draft-picks request timed out.':String(e?.message||'Sleeper draft picks unavailable');}
    }catch(e){if(!leagueRequestCurrent(serial,leagueId,requestWeek))return;sleeper.drafts=[];sleeper.picks=[];sleeper.draftError=e?.name==='AbortError'?'Sleeper drafts request timed out.':String(e?.message||'Sleeper draft data unavailable');}
    finally{if(leagueRequestCurrent(serial,leagueId,requestWeek)){sleeper.draftLoading=false;render();}}
  }
  async function loadLeague(id){
    const leagueId=String(id||'');
    if(!/^\d{6,32}$/.test(leagueId)){leagueLoadSerial++;sleeper.loading=false;clearLeagueData();sleeper.error='Invalid Sleeper league id.';render();return;}
    const requestWeek=state.week,serial=++leagueLoadSerial;
    state.leagueId=leagueId;save();sleeper.error='';sleeper.draftError='';sleeper.loading=true;clearLeagueData();render();
    try{
      const [league,rosters,users,matchups]=await Promise.all([
        sleeperFetch(`/league/${leagueId}`),sleeperFetch(`/league/${leagueId}/rosters`),sleeperFetch(`/league/${leagueId}/users`),sleeperFetch(`/league/${leagueId}/matchups/${requestWeek}`)
      ]);
      if(!leagueRequestCurrent(serial,leagueId,requestWeek))return;
      sleeper.league=league;sleeper.rosters=Array.isArray(rosters)?rosters:[];sleeper.users=Array.isArray(users)?users:[];sleeper.matchups=Array.isArray(matchups)?matchups:[];sleeper.loading=false;sleeper.draftLoading=true;render();
      void loadDraftData(serial,leagueId,requestWeek);
    }catch(e){if(!leagueRequestCurrent(serial,leagueId,requestWeek))return;clearLeagueData();sleeper.error=e?.name==='AbortError'?'Sleeper request timed out.':String(e?.message||'Sleeper league unavailable');sleeper.loading=false;render();}
  }
  function header(){return `<div class="fantasy-head"><div><div class="fantasy-kicker">FANTASY COMMAND</div><h1>Fantasy football, with Titans context.</h1><p>Run your fantasy decisions beside the same roster, game-day, change and analytics intelligence already in Titans Command Center.</p></div><div class="fantasy-score-mode" role="group" aria-label="Fantasy scoring format">${[['standard','STD'],['half','HALF PPR'],['ppr','PPR']].map(([v,l])=>`<button type="button" data-scoring="${v}" class="${state.scoring===v?'active':''}">${l}</button>`).join('')}</div></div>`}
  function tabs(){return `<nav class="fantasy-tabs" aria-label="Fantasy sections">${[['lab','Fantasy Lab'],['my','My Fantasy'],['sleeper','Sleeper Connect'],['draft','Draft Command']].map(([v,l])=>`<button type="button" data-ftab="${v}" class="${state.tab===v?'active':''}">${l}</button>`).join('')}</nav>`}
  function lab(){
    const roster=(data?.roster||[]).filter(isSkill).sort((a,b)=>posPriority(a)-posPriority(b)||String(a.name).localeCompare(String(b.name)));
    const moves=(data?.transactions||[]).slice(0,5);
    return `<section class="fantasy-grid"><article class="fantasy-panel fantasy-span-2"><div class="fantasy-panel-head"><div><small>TITANS FANTASY BOARD</small><h2>Players to track</h2></div><a href="#roster">Full roster →</a></div><div class="fantasy-player-grid">${roster.map(p=>{const [label,tone]=fantasySignal(p);return `<a class="fantasy-player" href="${p.id?`#player?id=${encodeURIComponent(p.id)}`:'#roster'}"><div><strong>${esc(p.name)}</strong><span>${esc(p.position||'')} ${p.number?`· #${esc(p.number)}`:''}</span></div><em class="${tone}">${label}</em></a>`}).join('')||'<div class="fantasy-empty">Titans roster data is not available yet.</div>'}</div></article><article class="fantasy-panel"><small>FANTASY IMPACT ENGINE</small><h2>What changed?</h2><p>Use roster movement as a review trigger, not as invented certainty. When a role changes, re-check volume, availability and your lineup.</p><div class="fantasy-impact-list">${moves.map(m=>`<div><strong>${esc(m.type||'Roster move')}</strong><span>${esc(m.description||'')}</span></div>`).join('')||'<div class="fantasy-empty">No recent move data.</div>'}</div><a class="fantasy-action" href="#transactions">Open Change context →</a></article><article class="fantasy-panel"><small>POINTS CALCULATOR</small><h2>Score a stat line</h2><p>Exact math under your selected scoring preset. Enter a projection or final stat line; the app does not invent one for you.</p><form id="fantasy-calc" class="fantasy-calc"><label>Pass yds<input name="passYds" inputmode="decimal" value="0"></label><label>Pass TD<input name="passTd" inputmode="decimal" value="0"></label><label>INT<input name="int" inputmode="decimal" value="0"></label><label>Rush yds<input name="rushYds" inputmode="decimal" value="0"></label><label>Rush TD<input name="rushTd" inputmode="decimal" value="0"></label><label>Rec<input name="rec" inputmode="decimal" value="0"></label><label>Rec yds<input name="recYds" inputmode="decimal" value="0"></label><label>Rec TD<input name="recTd" inputmode="decimal" value="0"></label><output id="fantasy-points">0.0 pts</output></form></article></section>`;
  }
  function myFantasy(){
    return `<section class="fantasy-grid"><article class="fantasy-panel fantasy-span-2"><div class="fantasy-panel-head"><div><small>MY FANTASY</small><h2>Personal lineup board</h2></div><span>${state.manual.length}/40 saved</span></div><form id="fantasy-add" class="fantasy-add"><input name="name" maxlength="50" placeholder="Player name" required><input name="position" maxlength="5" placeholder="POS" required><input name="team" maxlength="4" placeholder="TEAM" required><select name="slot"><option value="starter">Starter</option><option value="bench">Bench</option><option value="watch">Watchlist</option></select><button class="fantasy-action" type="submit">Add player</button></form><div class="fantasy-lineup">${['starter','bench','watch'].map(slot=>`<section><h3>${slot==='starter'?'Starters':slot==='bench'?'Bench':'Watchlist'}</h3>${state.manual.filter(p=>p.slot===slot).map(p=>`<div class="fantasy-lineup-row"><div><strong>${esc(p.name)}</strong><span>${esc(p.position)} · ${esc(p.team)}</span></div><button type="button" data-remove-player="${esc(p.id)}" aria-label="Remove ${esc(p.name)}">Remove</button></div>`).join('')||'<div class="fantasy-empty">Nothing saved here yet.</div>'}</section>`).join('')}</div></article><article class="fantasy-panel"><small>DECISION WORKSPACE</small><h2>Start / sit without fake certainty</h2><p>Add your actual options above, then use Player Intelligence, Game Day and the scoring calculator together. This release deliberately avoids fabricated projections.</p><div class="fantasy-decision-links"><a href="#stats">Stats Lab →</a><a href="#live">Game Day →</a><a href="#fan">Ask Titans →</a></div></article></section>`;
  }
  function sleeperTab(){
    const leagues=sleeper.leagues||[],league=sleeper.league,usernameValue=sleeper.connectingUser||state.sleeperUser;
    const owner=sleeper.user?.user_id?sleeper.rosters.find(r=>String(r.owner_id)===String(sleeper.user.user_id)):null;
    const matchup=owner?sleeper.matchups.find(m=>Number(m.roster_id)===Number(owner.roster_id)):null;
    const opp=matchup?sleeper.matchups.find(m=>Number(m.matchup_id)===Number(matchup.matchup_id)&&Number(m.roster_id)!==Number(owner.roster_id)):null;
    const counts=resolvedRosterCounts(owner);
    const userByRoster=id=>{const r=sleeper.rosters.find(x=>Number(x.roster_id)===Number(id));const u=sleeper.users.find(x=>String(x.user_id)===String(r?.owner_id));return u?.metadata?.team_name||u?.display_name||`Roster ${id}`};
    const ownerScoreNote=matchup?`Your points · Week ${state.week}`:`Week ${state.week} matchup not returned by Sleeper`;
    const opponentLabel=opp?userByRoster(opp.roster_id):matchup?'Opponent unavailable':'Opponent not returned';
    const connecting=sleeper.connecting?`<div class="fantasy-empty" role="status" aria-live="polite">Connecting Sleeper account… Previous league, matchup and draft data stays hidden until Sleeper confirms this username.</div>`:'';
    const loading=sleeper.loading?`<article class="fantasy-panel fantasy-span-2" role="status" aria-live="polite"><small>SLEEPER</small><h2>Loading selected league · Week ${state.week}</h2><p>Previous league and matchup data stays hidden until Sleeper returns this selection.</p></article>`:'';
    return `<section class="fantasy-grid"><article class="fantasy-panel fantasy-span-2"><small>SLEEPER CONNECT</small><h2>Import your league, read-only</h2><p>Sleeper requires no API token for its read-only API. Your username is stored on this device and sent directly to Sleeper only when you connect or refresh.</p><form id="sleeper-connect" class="fantasy-connect"><input name="username" maxlength="64" value="${esc(usernameValue)}" placeholder="Sleeper username" required><button class="fantasy-action" type="submit"${sleeper.connecting?' disabled':''}>${sleeper.connecting?'Connecting…':'Connect / refresh'}</button></form>${connecting}${sleeper.error?`<div class="fantasy-error" role="alert">${esc(sleeper.error)}</div>`:''}${leagues.length?`<label class="fantasy-select">League<select id="sleeper-league"${sleeper.connecting||sleeper.loading?' disabled':''}>${leagues.map(l=>`<option value="${esc(l.league_id)}"${String(l.league_id)===state.leagueId?' selected':''}>${esc(l.name||'Unnamed league')}</option>`).join('')}</select></label>`:''}</article>${loading}${!sleeper.connecting&&!sleeper.loading&&league?`<article class="fantasy-panel"><small>LEAGUE</small><h2>${esc(league.name||'Sleeper league')}</h2><div class="fantasy-facts"><span><b>${esc(league.total_rosters||sleeper.rosters.length)}</b> teams</span><span><b>${esc(league.status||'')}</b> status</span><span><b>${esc(league.season||SEASON)}</b> season</span></div><label class="fantasy-select">Week<select id="sleeper-week">${Array.from({length:18},(_,i)=>i+1).map(w=>`<option value="${w}"${w===state.week?' selected':''}>Week ${w}</option>`).join('')}</select></label></article><article class="fantasy-panel"><small>MY MATCHUP</small><h2>${owner?esc(userByRoster(owner.roster_id)):'Roster not matched'}</h2>${owner?`<div class="fantasy-matchup"><div><strong>${matchupScore(matchup)}</strong><span>${esc(ownerScoreNote)}</span></div><div><strong>${matchupScore(opp)}</strong><span>${esc(opponentLabel)}</span></div></div><p>${counts.starters} resolved starters · ${counts.rostered} rostered players</p>`:'<div class="fantasy-empty">Could not match this Sleeper user to a roster in the selected league.</div>'}</article>`:''}</section>`;
  }
  function draftTab(){
    const draft=sleeper.drafts?.[0],picks=sleeper.picks||[],hasConnection=Boolean(state.sleeperUser&&/^\d{6,32}$/.test(state.leagueId));
    if(sleeper.connecting)return `<section class="fantasy-grid"><article class="fantasy-panel fantasy-span-2" role="status" aria-live="polite"><small>DRAFT COMMAND</small><h2>Connecting Sleeper account…</h2><p>Previous draft data stays hidden until Sleeper confirms this username.</p></article></section>`;
    if(sleeper.loading)return `<section class="fantasy-grid"><article class="fantasy-panel fantasy-span-2" role="status" aria-live="polite"><small>DRAFT COMMAND</small><h2>Loading selected Sleeper league…</h2><p>Previous draft data stays hidden until the current league request finishes.</p></article></section>`;
    if(sleeper.draftLoading&&!draft)return `<section class="fantasy-grid"><article class="fantasy-panel fantasy-span-2" role="status" aria-live="polite"><small>DRAFT COMMAND</small><h2>League ready · loading draft data…</h2><p>Your selected league and matchup are already available while Sleeper returns the optional draft board.</p></article><article class="fantasy-panel"><small>DRAFT ASSIST</small><h2>Roster-construction checks</h2><p>Draft data loads separately so a slow optional endpoint never hides a valid Sleeper matchup.</p></article></section>`;
    return `<section class="fantasy-grid"><article class="fantasy-panel fantasy-span-2"><div class="fantasy-panel-head"><div><small>DRAFT COMMAND</small><h2>${draft?esc(draft.metadata?.name||draft.type||'Sleeper draft'):hasConnection?'Draft data unavailable':'Connect a Sleeper league first'}</h2></div>${draft?`<span>${esc(draft.status||'')}</span>`:''}</div>${draft?`<div class="fantasy-draft-summary"><span><b>${esc(draft.settings?.teams||'—')}</b> teams</span><span><b>${esc(draft.settings?.rounds||'—')}</b> rounds</span><span><b>${esc(draft.settings?.pick_timer||'—')}</b> sec/pick</span><span><b>${sleeper.draftLoading||sleeper.draftError?'—':picks.length}</b> ${sleeper.draftLoading?'picks loading':sleeper.draftError?'picks unavailable':'picks loaded'}</span></div><div class="fantasy-draft-board">${sleeper.draftLoading?'<div class="fantasy-empty" role="status">Draft metadata loaded. Loading picks…</div>':sleeper.draftError?`<div class="fantasy-empty" role="status">Draft metadata loaded, but picks are unavailable right now. ${esc(sleeper.draftError)}</div>`:picks.slice(-36).reverse().map(p=>{const m=p.metadata||{},name=[m.first_name,m.last_name].filter(Boolean).join(' ')||m.player_name||`Player ${p.player_id||''}`;return `<div><span>${esc(p.round)}.${esc(p.draft_slot||p.pick_no||'')}</span><strong>${esc(name)}</strong><small>${esc(m.position||'')} ${m.team?`· ${esc(m.team)}`:''}</small></div>`}).join('')||'<div class="fantasy-empty">No picks have been recorded yet.</div>'}</div>`:hasConnection?`<p>${esc(sleeper.draftError||sleeper.error||'Sleeper has not returned draft data for the selected league.')}</p>`:'<p>Once Sleeper is connected, Draft Command loads the league draft and recent picks. It stays read-only: no drafting or roster mutations are sent from this app.</p>'}</article><article class="fantasy-panel"><small>DRAFT ASSIST</small><h2>Roster-construction checks</h2><p>Use the live pick board beside your league roster settings. The next iteration can add ADP/value data only from a licensed or clearly permitted source; this release does not scrape rankings.</p>${draft?.roster_positions?`<div class="fantasy-positions">${draft.roster_positions.map(p=>`<span>${esc(p)}</span>`).join('')}</div>`:''}</article></section>`;
  }
  function bind(root){
    root.querySelectorAll('[data-ftab]').forEach(b=>b.addEventListener('click',()=>{state.tab=b.dataset.ftab;save();render()}));
    root.querySelectorAll('[data-scoring]').forEach(b=>b.addEventListener('click',()=>{state.scoring=b.dataset.scoring;save();render()}));
    root.querySelector('#fantasy-calc')?.addEventListener('input',e=>{const fd=new FormData(e.currentTarget),line=Object.fromEntries(fd.entries()),out=root.querySelector('#fantasy-points');if(out)out.textContent=`${scoringPoints(line).toFixed(1)} pts`;});
    root.querySelector('#fantasy-add')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget),name=String(fd.get('name')||'').trim(),position=String(fd.get('position')||'').trim().toUpperCase(),team=String(fd.get('team')||'').trim().toUpperCase(),slot=String(fd.get('slot')||'bench');if(!name||!position||!team||state.manual.length>=40)return;state.manual.push({id:crypto.randomUUID(),name,position,team,slot});save();render();});
    root.querySelectorAll('[data-remove-player]').forEach(b=>b.addEventListener('click',()=>{state.manual=state.manual.filter(p=>p.id!==b.dataset.removePlayer);save();render()}));
    root.querySelector('#sleeper-connect')?.addEventListener('submit',e=>{e.preventDefault();connectSleeper(new FormData(e.currentTarget).get('username'));});
    root.querySelector('#sleeper-league')?.addEventListener('change',e=>loadLeague(e.target.value));
    root.querySelector('#sleeper-week')?.addEventListener('change',e=>{state.week=Math.max(1,Math.min(18,Number(e.target.value)||1));save();loadLeague(state.leagueId)});
  }
  async function render(){
    if(route()!==ROUTE)return;const root=app();if(!root)return;const serial=++renderSerial;
    await loadTitans();if(serial!==renderSerial||route()!==ROUTE)return;
    root.innerHTML=`${header()}${tabs()}<div class="fantasy-content">${state.tab==='my'?myFantasy():state.tab==='sleeper'?sleeperTab():state.tab==='draft'?draftTab():lab()}</div><div class="fantasy-disclaimer">Fantasy information is a planning aid, not a guarantee. Sleeper integration is read-only. External provider terms and availability apply.</div>`;
    root.dataset.fantasyCommand='ready';bind(root);
    if((state.tab==='sleeper'||state.tab==='draft')&&state.sleeperUser&&!sleeper.user&&!sleeper.connecting&&!sleeper.error)connectSleeper(state.sleeperUser);
  }
  const observer=new MutationObserver(()=>{if(route()===ROUTE&&app()?.dataset.fantasyCommand!=='ready')queueMicrotask(render)});
  if(app())observer.observe(app(),{childList:true});
  addEventListener('hashchange',()=>{renderSerial++;if(route()===ROUTE){const root=app();if(root)delete root.dataset.fantasyCommand;queueMicrotask(render)}});
  queueMicrotask(render);
  window.TitansFantasy={scoringPoints};
})();