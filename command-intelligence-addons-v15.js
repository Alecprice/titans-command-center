(() => {
  'use strict';

  const app=document.querySelector('#app');
  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const PROFILE_KEY='titans:v15MyTitans';
  const ALERT_KEY='titans:v15SmartAlerts';
  const OFFICE_KEY='titans:v15FrontOffice';
  const TRIP_KEY='titans:v15TripNotes';
  const HISTORY_KEY='titans:v15PickHistory';
  const GM_KEY='titans:v15FanGM';
  const PASSPORT_KEY='titans:v15FanPassport';
  let data=null,fan=null,loading=null,selectedPlay='',selectedGraphPlayer='';

  const safeArr=v=>Array.isArray(v)?v:[];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getJson=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const setJson=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const playerName=p=>p?.name||p?.fullName||p?.full_name||'Player';
  const playerPos=p=>p?.position||p?.pos||'';
  const playerNumber=p=>p?.number??p?.jerseyNumber??p?.jersey_number??'';
  const fmtDate=value=>{try{const d=new Date(value);return Number.isNaN(d.getTime())?'TBD':new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(d)}catch{return'TBD'}};
  const slug=v=>String(v??'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const safeSourceUrl=item=>{try{const u=new URL(item?.url,location.href);return u.protocol==='https:'?u.href:''}catch{return''}};

  async function load(){
    if(data||loading)return loading||{data,fan};
    loading=Promise.all([
      fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ]).then(([d,f])=>{data=d?.ok?d:{};fan=f?.ok?f:{};return{data,fan}}).finally(()=>loading=null);
    return loading;
  }

  const roster=()=>safeArr(data?.roster);
  const games=()=>safeArr(data?.games);
  const feed=()=>safeArr(data?.feed);
  const transactions=()=>safeArr(data?.transactions);
  const injuries=()=>safeArr(fan?.injuries);
  const depth=()=>safeArr(fan?.depthChart?.changes);
  const plays=()=>safeArr(fan?.gameDay?.plays);
  const contracts=()=>safeArr(fan?.contracts);
  const futureGames=()=>games().map(game=>({game,at:Date.parse(game?.date)})).filter(row=>Number.isFinite(row.at)&&row.at>Date.now()&&!/final|bye/i.test(String(row.game?.status||''))).sort((a,b)=>a.at-b.at);
  const nextGame=()=>futureGames()[0]?.game||null;
  const nextAway=()=>futureGames().find(row=>row.game?.homeAway==='away')?.game||null;

  function tab(){return document.querySelector('[data-v15-tab][aria-selected="true"]')?.dataset.v15Tab||'changes'}
  function rootFor(name){const pane=document.querySelector('.v15-pane');if(!pane)return null;const old=pane.querySelector('.v15-addon-root');if(old?.dataset.tab===name)return null;old?.remove();const root=document.createElement('div');root.className='v15-addon-root';root.dataset.tab=name;pane.append(root);return root}

  function oneMinute(){
    const game=nextGame(),tx=transactions()[0],story=feed()[0],injuryRows=injuries(),depthRows=depth();
    const bits=[
      game?`Next: ${game.homeAway==='home'?'vs':'at'} ${game.opponent} · ${fmtDate(game.date)} · ${game.network||'network TBD'}`:'Next game time is not loaded.',
      tx?`Latest move: ${tx.title||tx.summary||tx.name||'transaction update'}`:'No newer transaction row is loaded.',
      injuryRows.length?`${injuryRows.length} current injury-report rows are loaded.`:'No current injury-report rows are loaded; that is not the same as zero injuries.',
      depthRows.length?`${depthRows.length} depth-chart changes are currently detected.`:'No depth-chart change is currently detected.',
      story?`Top intel: ${story.title||story.summary||'latest feed item'}`:'No intel-feed item is loaded.'
    ];
    return `<section class="v15-addon-panel v15-minute"><header><div><small>ONE-MINUTE TITANS</small><h3>Five things to know right now</h3></div><span>${esc(new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(new Date()))}</span></header><ol>${bits.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>`
  }

  function sourceEvidenceCard(item){
    const href=safeSourceUrl(item),summary=item?.summary||'No source summary is loaded.';
    return `<article class="v15-intel-item"><strong>${esc(item?.title||'Official update')}</strong><p>${esc(summary)}</p>${href?`<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">Official source · ${esc(fmtDate(item?.publishedAt))}</a>`:''}</article>`
  }

  function weekIntelligence(){
    const game=nextGame();
    if(!game)return `<section class="v15-addon-panel v15-intel-desk"><header><div><small>INTELLIGENCE DESK</small><h3>Next-game evidence</h3></div></header><div class="v15-addon-empty"><strong>No future matchup is loaded.</strong><span>The intelligence desk will stay closed rather than attach evidence to the wrong opponent.</span></div></section>`;
    const weekKey=`week-${game.week}`,weekFeed=feed().filter(item=>safeArr(item?.topics).includes(weekKey));
    const confirmed=weekFeed.filter(item=>item?.evidence==='coach-confirmed');
    const practice=weekFeed.filter(item=>item?.evidence==='practice-observation');
    const formal=injuries();
    const matchup=game.homeAway==='home'?`${game.opponent} at Titans`:`Titans at ${game.opponent}`;
    const confirmedBody=confirmed.length?confirmed.slice(0,2).map(sourceEvidenceCard).join(''):`<div class="v15-intel-empty"><strong>No coach-confirmed Week ${esc(game.week)} change is loaded.</strong><span>This lane stays empty instead of promoting rumor or depth-chart inference.</span></div>`;
    const practiceBody=practice.length?practice.slice(0,2).map(sourceEvidenceCard).join(''):`<div class="v15-intel-empty"><strong>No source-backed practice watch is loaded.</strong><span>No practice absence or return is inferred from silence.</span></div>`;
    const formalBody=formal.length?formal.slice(0,4).map(row=>{const name=row?.name||row?.player||row?.playerName||'Player',status=row?.status||row?.designation||row?.gameStatus||'status loaded';return `<article class="v15-intel-item"><strong>${esc(name)}</strong><p>${esc(status)}</p></article>`}).join(''):`<div class="v15-intel-empty"><strong>No current regular-season injury-report rows are loaded.</strong><span>Do not infer Week ${esc(game.week)} availability from practice observations.</span></div>`;
    return `<section class="v15-addon-panel v15-intel-desk"><header><div><small>WEEK ${esc(game.week)} INTELLIGENCE DESK</small><h3>${esc(matchup)} · evidence ranked</h3></div><span class="v15-intel-network">${esc(game.network||'Network TBD')}</span></header><p class="v15-intel-kickoff">${esc(fmtDate(game.date))} · ${esc(game.venue||'Venue TBD')}</p><div class="v15-intel-grid"><section class="v15-intel-lane confirmed"><div class="v15-intel-status">CONFIRMED</div>${confirmedBody}</section><section class="v15-intel-lane practice"><div class="v15-intel-status">PRACTICE WATCH</div>${practiceBody}</section><section class="v15-intel-lane ${formal.length?'formal':'unknown'}"><div class="v15-intel-status">${formal.length?'FORMAL STATUS':'NOT YET CONFIRMED'}</div>${formalBody}</section></div><p class="v15-addon-note"><b>Evidence boundary:</b> coach-confirmed role news, practice observations and formal injury-report rows stay separate. Practice reporting is context, not an injury designation or availability prediction.</p></section>`
  }

  function battleTracker(){
    const rows=depth();
    const body=rows.length?rows.slice(0,16).map(x=>`<article><div><small>${esc(x.unit||x.position||'DEPTH')}</small><strong>${esc(x.name||'Player')}</strong></div><span>${esc(x.type||'changed')}${x.from!=null||x.to!=null?` · ${esc(x.from??'—')} → ${esc(x.to??'—')}`:''}</span></article>`).join(''):`<div class="v15-addon-empty"><strong>No verified depth movement loaded.</strong><span>This tracker activates when two depth-chart snapshots can be compared.</span></div>`;
    return `<section class="v15-addon-panel"><header><div><small>POSITION BATTLE TRACKER</small><h3>Who is moving?</h3></div><a href="#roster">Open roster →</a></header><div class="v15-battle-list">${body}</div></section>`
  }

  function graphPanel(){
    const players=roster().slice().sort((a,b)=>playerName(a).localeCompare(playerName(b)));if(!players.length)return'';
    const profile=getJson(PROFILE_KEY,{});if(!selectedGraphPlayer)selectedGraphPlayer=profile.favorite&&players.some(p=>playerName(p)===profile.favorite)?profile.favorite:playerName(players[0]);
    const p=players.find(x=>playerName(x)===selectedGraphPlayer)||players[0],name=playerName(p),pos=playerPos(p),exp=String(p?.experience||p?.exp||'');
    const samePos=players.filter(x=>playerName(x)!==name&&playerPos(x)===pos).slice(0,10);
    const sameExp=exp?players.filter(x=>playerName(x)!==name&&String(x?.experience||x?.exp||'')===exp).slice(0,8):[];
    const mentions=feed().filter(x=>slug([x?.title,x?.summary].join(' ')).includes(slug(name))).slice(0,5);
    return `<section class="v15-addon-panel"><header><div><small>TITANS KNOWLEDGE GRAPH</small><h3>Explore roster relationships</h3></div><select data-v15-graph-player>${players.map(x=>`<option ${playerName(x)===name?'selected':''}>${esc(playerName(x))}</option>`).join('')}</select></header><div class="v15-graph-focus"><strong>#${esc(playerNumber(p)||'—')} ${esc(name)}</strong><span>${esc(pos||'Position TBD')}${exp?` · experience ${esc(exp)}`:''}</span></div><div class="v15-addon-grid"><div><h4>Same position room</h4><p>${samePos.length?samePos.map(x=>esc(playerName(x))).join(' · '):'No peers loaded.'}</p></div><div><h4>Same experience marker</h4><p>${sameExp.length?sameExp.map(x=>esc(playerName(x))).join(' · '):'Experience metadata is not available for a useful match.'}</p></div><div><h4>Loaded intel connections</h4><p>${mentions.length?mentions.map(x=>esc(x.title||x.summary)).join(' · '):'No matching feed mentions loaded.'}</p></div></div><p class="v15-addon-note">Relationships come only from loaded roster and feed metadata. This does not infer personal relationships or unseen team data.</p></section>`
  }

  function changesAddons(){const root=rootFor('changes');if(!root)return;root.innerHTML=oneMinute()+weekIntelligence()+`<div class="v15-addon-grid two">${battleTracker()}${graphPanel()}</div>`}

  function explainPlay(play){
    if(!play)return{headline:'No play selected',body:'No play-level data is loaded.',evidence:''};
    const down=play.down?`${play.down}${play.down===1?'st':play.down===2?'nd':play.down===3?'rd':'th'} & ${play.yardsToGo??'?'}`:'Down/distance unavailable';
    const yards=Number(play.yards);const epa=Number(play.epa),wpa=Number(play.winProbabilityAdded);
    const outcome=Number.isFinite(yards)?`${yards>=0?'+':''}${yards} yards`:'yardage unavailable';
    const quality=play.explosive?'an explosive gain':play.success?'a successful play by the loaded success flag':'not marked successful by the loaded success flag';
    const epaText=Number.isFinite(epa)?`EPA ${epa>=0?'+':''}${epa.toFixed(2)}`:'EPA unavailable';
    const wpaText=Number.isFinite(wpa)?`WPA ${wpa>=0?'+':''}${(wpa*100).toFixed(1)} pts`:'WPA unavailable';
    return{headline:`${down} → ${outcome}`,body:`The structured data marks this as ${quality}. ${epaText}; ${wpaText}.`,evidence:play.description||'No play description loaded.'}
  }

  function playLab(){
    const rows=plays().slice(0,24);if(!selectedPlay&&rows.length)selectedPlay=String(rows[0].id||rows[0].play||'');const p=rows.find(x=>String(x.id||x.play||'')===selectedPlay)||rows[0],why=explainPlay(p);
    return `<section class="v15-addon-panel"><header><div><small>WHY DID THAT PLAY WORK?</small><h3>Play Explainer</h3></div><select data-v15-play>${rows.length?rows.map(x=>`<option value="${esc(String(x.id||x.play||''))}" ${p===x?'selected':''}>${esc(`Q${x.quarter||'?'} ${x.clock||''} · ${String(x.description||x.type||'Play').slice(0,56)}`)}</option>`).join(''):'<option>No plays loaded</option>'}</select></header><div class="v15-play-answer"><strong>${esc(why.headline)}</strong><p>${esc(why.body)}</p><blockquote>${esc(why.evidence)}</blockquote></div><p class="v15-addon-note"><b>Limit:</b> this explains the verified play data, not film-only causation. Coverage responsibility, blocking assignments and route concepts need trusted charting/All-22 labels before the site should claim them.</p></section>`
  }

  function schemeAddons(){const root=rootFor('scheme');if(!root)return;root.innerHTML=playLab()}

  function profilePanel(){
    const players=roster().slice().sort((a,b)=>playerName(a).localeCompare(playerName(b))),profile=getJson(PROFILE_KEY,{favorite:'',briefing:'quick'});
    return `<section class="v15-addon-panel"><header><div><small>MY TITANS</small><h3>Personal fan profile</h3></div></header><div class="v15-addon-form"><label>Favorite player<select data-v15-profile="favorite"><option value="">No favorite selected</option>${players.map(p=>`<option ${profile.favorite===playerName(p)?'selected':''}>${esc(playerName(p))}</option>`).join('')}</select></label><label>Default briefing<select data-v15-profile="briefing"><option value="quick" ${profile.briefing!=='deep'?'selected':''}>Quick answer</option><option value="deep" ${profile.briefing==='deep'?'selected':''}>Deep detail</option></select></label><button type="button" data-v15-profile-save>Save on this device</button></div></section>`
  }

  function alertPanel(){
    const a=getJson(ALERT_KEY,{roster:true,injuries:true,depth:true,kickoff:true,press:false,records:false});
    const choices=[['roster','Roster moves'],['injuries','Injury-status changes'],['depth','Depth-chart changes'],['kickoff','Game / kickoff reminders'],['press','Press-conference updates'],['records','Milestone-watch changes']];
    return `<section class="v15-addon-panel"><header><div><small>SMART ALERTS</small><h3>Tell me only what I care about</h3></div></header><div class="v15-alert-grid">${choices.map(([key,label])=>`<label><input type="checkbox" data-v15-alert="${key}" ${a[key]?'checked':''}><span>${esc(label)}</span></label>`).join('')}</div><button type="button" data-v15-alert-save>Save alert preferences</button><p class="v15-addon-note">These preferences are ready for targeted alerts while the app is active. True closed-app Web Push still requires the server-side subscription/VAPID sender that is not deployed yet.</p></section>`
  }

  function tripPlanner(){
    const g=nextAway(),notes=getJson(TRIP_KEY,{}),key=String(g?.id||g?.week||'next-away'),note=notes[key]||'';
    return `<section class="v15-addon-panel"><header><div><small>TITANS TRIP PLANNER</small><h3>${esc(g?`Road trip: at ${g.opponent}`:'Next away game')}</h3></div><a href="#media">Tune-in guide →</a></header>${g?`<div class="v15-trip-facts"><span><b>Kickoff</b>${esc(fmtDate(g.date))}</span><span><b>Venue</b>${esc(g.venue||'Venue TBD')}</span><span><b>TV</b>${esc(g.network||'Network TBD')}</span></div><div class="v15-trip-checks"><span>□ Tickets / entry method</span><span>□ Travel & parking plan</span><span>□ Weather check</span><span>□ Titans gear</span><span>□ Listen/Watch backup</span></div><label>My trip note<textarea data-v15-trip-note rows="3" placeholder="Hotel, meetup, parking, section…">${esc(note)}</textarea></label><button type="button" data-v15-trip-save data-game="${esc(key)}">Save trip note</button>`:'<div class="v15-addon-empty"><strong>No future away game is loaded.</strong><span>The planner will populate from the schedule.</span></div>'}<p class="v15-addon-note">Live hotel, flight, restaurant and local transit recommendations should use current travel/business data when we add that integration; this planner does not guess them.</p></section>`
  }

  function fanCard(){const p=getJson(PASSPORT_KEY,{city:'',country:'',note:''});const where=[p.city,p.country].filter(Boolean).join(', ')||'somewhere in the world';return `<section class="v15-addon-panel"><header><div><small>GLOBAL FAN NETWORK · SHARE CARD</small><h3>Titans from ${esc(where)}</h3></div></header><p>${esc(p.note||'Titan Up from wherever game day finds me.')}</p><button type="button" data-v15-copy-fan-card>Copy fan card text</button><p class="v15-addon-note">This is an opt-in share tool, not a fake nearby-fan count. A true map/network needs accounts, consent, moderation and location privacy controls.</p></section>`}

  function globalAddons(){const root=rootFor('global');if(!root)return;root.innerHTML=`<div class="v15-addon-grid two">${profilePanel()}${alertPanel()}${tripPlanner()}${fanCard()}</div>`}

  function contractFor(name){return contracts().find(x=>x?.name===name)||null}
  function frontOffice(){
    const players=roster().slice().sort((a,b)=>playerName(a).localeCompare(playerName(b))),office=getJson(OFFICE_KEY,{decisions:{}}),rows=Object.entries(office.decisions||{}).map(([name,d])=>`<article><div><strong>${esc(name)}</strong><span>${esc(d.action)}</span></div><small>${esc(d.note||'No note')} · saved ${esc(fmtDate(d.savedAt))}</small><button data-v15-office-remove="${esc(name)}" type="button">Remove</button></article>`).join('')||'<div class="v15-addon-empty"><strong>No simulated moves yet.</strong><span>Try a roster decision below.</span></div>';
    const first=players[0],known=contractFor(playerName(first));
    return `<section class="v15-addon-panel"><header><div><small>FRONT OFFICE SANDBOX</small><h3>Build your version of the Titans</h3></div></header><div class="v15-office-form"><select data-v15-office-player>${players.map(p=>`<option>${esc(playerName(p))}</option>`).join('')}</select><select data-v15-office-action><option>Keep</option><option>Release idea</option><option>Trade idea</option><option>Re-sign idea</option><option>Practice-squad idea</option></select><input data-v15-office-note maxlength="100" placeholder="Why?"><button type="button" data-v15-office-add>Save move</button></div><div class="v15-contract-hint" data-v15-contract-hint>${known?`Loaded contract context for ${esc(playerName(first))}: APY ${Number(known.apy||0).toLocaleString()} · total ${Number(known.totalValue||0).toLocaleString()}`:'No verified contract row is loaded for the selected player.'}</div><div class="v15-office-list">${rows}</div><p class="v15-addon-note">This is a roster sandbox, not a cap calculator. It will not invent dead money, guarantees or cap savings that are not in the verified contract data.</p></section>`
  }

  function syncPickHistory(){
    const gm=getJson(GM_KEY,{}),pick=gm.nextPick;if(!pick?.savedAt)return;
    const history=getJson(HISTORY_KEY,[]);if(!history.some(x=>x.savedAt===pick.savedAt)){history.push({...pick});setJson(HISTORY_KEY,history.slice(-40))}
  }
  function scorePanel(){
    syncPickHistory();const history=getJson(HISTORY_KEY,[]),resolved=[];
    for(const pick of history){const g=games().find(x=>String(x.id||x.week)===String(pick.gameId));if(!g||!/final/i.test(String(g.status||''))||g.score==null||g.opponentScore==null)continue;const tenWon=Number(g.score)>Number(g.opponentScore),correct=(pick.pick==='TEN')===tenWon;resolved.push({...pick,opponent:g.opponent,correct})}
    const wins=resolved.filter(x=>x.correct).length,accuracy=resolved.length?Math.round(wins/resolved.length*100):null;
    return `<section class="v15-addon-panel"><header><div><small>FAN GM SCORE</small><h3>${resolved.length?`${wins}/${resolved.length} correct · ${accuracy}%`:'No picks have resolved yet'}</h3></div></header>${resolved.length?resolved.slice(-8).reverse().map(x=>`<div class="v15-score-row"><strong>${x.correct?'✓':'×'} ${esc(x.opponent||'Opponent')}</strong><span>${esc(x.pick==='TEN'?'Titans':'Opponent')} · confidence ${esc(x.confidence)}/10</span></div>`).join(''):'<p class="v15-addon-note">Only timestamped pre-kickoff picks count. Results are scored after a matching game is loaded as final.</p>'}</section>`
  }

  function gmAddons(){const root=rootFor('gm');if(!root)return;root.innerHTML=`<div class="v15-addon-grid two">${frontOffice()}${scorePanel()}</div>`}

  function render(){
    if(route()!=='command')return;
    load().then(()=>{if(route()!=='command')return;const current=tab();if(current==='changes')changesAddons();else if(current==='scheme')schemeAddons();else if(current==='global')globalAddons();else if(current==='gm')gmAddons()});
  }

  document.addEventListener('click',event=>{
    if(!(event.target instanceof Element)||route()!=='command')return;
    if(event.target.closest('[data-v15-tab]')){setTimeout(render,30);return}
    if(event.target.closest('[data-v15-profile-save]')){const value={};document.querySelectorAll('[data-v15-profile]').forEach(el=>value[el.dataset.v15Profile]=el.value);setJson(PROFILE_KEY,value);render();return}
    if(event.target.closest('[data-v15-alert-save]')){const value={};document.querySelectorAll('[data-v15-alert]').forEach(el=>value[el.dataset.v15Alert]=el.checked);setJson(ALERT_KEY,value);render();return}
    const trip=event.target.closest('[data-v15-trip-save]');if(trip){const notes=getJson(TRIP_KEY,{});notes[trip.dataset.game]=document.querySelector('[data-v15-trip-note]')?.value||'';setJson(TRIP_KEY,notes);render();return}
    if(event.target.closest('[data-v15-copy-fan-card]')){const p=getJson(PASSPORT_KEY,{city:'',country:'',note:''}),text=`Titan Up from ${[p.city,p.country].filter(Boolean).join(', ')||'wherever I am'}! ${p.note||''}`.trim();navigator.clipboard?.writeText?.(text).catch(()=>{});return}
    if(event.target.closest('[data-v15-office-add]')){const name=document.querySelector('[data-v15-office-player]')?.value,action=document.querySelector('[data-v15-office-action]')?.value,note=document.querySelector('[data-v15-office-note]')?.value||'';if(name){const office=getJson(OFFICE_KEY,{decisions:{}});office.decisions={...(office.decisions||{}),[name]:{action,note,savedAt:new Date().toISOString()}};setJson(OFFICE_KEY,office);render()}return}
    const remove=event.target.closest('[data-v15-office-remove]');if(remove){const office=getJson(OFFICE_KEY,{decisions:{}});delete office.decisions?.[remove.dataset.v15OfficeRemove];setJson(OFFICE_KEY,office);render();return}
    if(event.target.closest('[data-v15-save-game]'))setTimeout(()=>{syncPickHistory();render()},50);
  },true);

  document.addEventListener('change',event=>{
    if(!(event.target instanceof Element)||route()!=='command')return;
    if(event.target.matches('[data-v15-play]')){selectedPlay=event.target.value;document.querySelector('.v15-addon-root')?.remove();render()}
    if(event.target.matches('[data-v15-graph-player]')){selectedGraphPlayer=event.target.value;document.querySelector('.v15-addon-root')?.remove();render()}
    if(event.target.matches('[data-v15-office-player]')){const c=contractFor(event.target.value),hint=document.querySelector('[data-v15-contract-hint]');if(hint)hint.textContent=c?`Loaded contract context for ${event.target.value}: APY ${Number(c.apy||0).toLocaleString()} · total ${Number(c.totalValue||0).toLocaleString()}`:'No verified contract row is loaded for the selected player.'}
  });

  window.addEventListener('hashchange',()=>setTimeout(render,50));
  window.addEventListener('popstate',()=>setTimeout(render,50));
  if(app)new MutationObserver(()=>{if(route()==='command')setTimeout(render,20)}).observe(app,{childList:true,subtree:false});
  setTimeout(render,150);
})();