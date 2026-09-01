(() => {
  'use strict';
  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  const KEY='titans:v13FanPicks';
  const parse=(value,fallback)=>{try{return JSON.parse(value)??fallback}catch{return fallback}};
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={base:null,intel:null,loading:null};

  async function load(){
    if(state.base&&state.intel)return;
    if(state.loading)return state.loading;
    const request=runtime?[
      runtime.apiJson('/api/data',{ttl:30000}),
      runtime.apiJson('/api/fan-intel',{ttl:30000})
    ]:[
      fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null),
      fetch('/api/fan-intel',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
    ];
    state.loading=Promise.all(request).then(([base,intel])=>{state.base=base?.ok?base:null;state.intel=intel?.ok?intel:null}).finally(()=>state.loading=null);
    return state.loading;
  }

  function card(title,body,className=''){const el=document.createElement('article');el.className=`v13-card ${className}`;el.innerHTML=`<h3>${esc(title)}</h3>${body}`;return el}
  function findCard(title){return [...document.querySelectorAll('.v13-card')].find(el=>el.querySelector('h3')?.textContent?.trim()===title)||null}
  function options(players,selected=''){return `<option value="">Choose</option>${players.map(p=>`<option value="${esc(p.id)}" ${String(p.id)===String(selected)?'selected':''}>#${esc(p.number||'—')} ${esc(p.name)} · ${esc(p.position)}</option>`).join('')}`}
  function stat(stats,keys){for(const key of keys)if(stats?.[key]!=null&&Number.isFinite(Number(stats[key])))return Number(stats[key]);return null}

  function addFanPicks(){
    const grid=document.querySelector('.v13-section .v13-grid');if(!grid||findCard('Fan picks'))return;
    const roster=state.base?.roster||[],saved=parse(localStorage.getItem(KEY),{}),qbs=roster.filter(p=>p.position==='QB'),rbs=roster.filter(p=>p.position==='RB'),wrs=roster.filter(p=>p.position==='WR');
    const latest=[...(state.base?.games||[])].reverse().find(g=>/final/i.test(String(g.status||'')));
    const body=`<div class="v13-fan-picks"><label>Season MVP<select data-pick="mvp">${options(roster,saved.mvp)}</select></label>${latest?`<label>Player of the game · ${esc(String(latest.week))}<select data-pick="playerGame">${options(roster,saved.playerGame)}</select></label>`:''}<fieldset><legend>My starting skill group</legend><label>QB<select data-pick="qb">${options(qbs,saved.qb)}</select></label><label>RB<select data-pick="rb">${options(rbs,saved.rb)}</select></label><label>WR<select data-pick="wr">${options(wrs,saved.wr)}</select></label></fieldset><button class="button primary" type="button" data-save-fan-picks>Save my picks</button><small>Private to this device. No account needed.</small></div><details class="v13-trivia"><summary>Quick Titans trivia</summary><div data-trivia-question><p><strong>What was the franchise's first season?</strong></p><button type="button" data-trivia="1959">1959</button><button type="button" data-trivia="1960">1960</button><button type="button" data-trivia="1961">1961</button><span data-trivia-answer></span></div><div data-trivia-question><p><strong>What is the current 2026 primary mark called?</strong></p><button type="button" data-trivia="Fireball T">Fireball T</button><button type="button" data-trivia="The Shield">The Shield</button><button type="button" data-trivia="Derrick">Derrick</button><span data-trivia-answer></span></div></details>`;
    const el=card('Fan picks',body);grid.appendChild(el);
    el.querySelector('[data-save-fan-picks]')?.addEventListener('click',()=>{const next={};el.querySelectorAll('[data-pick]').forEach(select=>next[select.dataset.pick]=select.value);localStorage.setItem(KEY,JSON.stringify(next));const button=el.querySelector('[data-save-fan-picks]');button.textContent='Saved ✓';setTimeout(()=>button.textContent='Save my picks',1400)});
    el.querySelectorAll('[data-trivia-question]').forEach((row,index)=>row.addEventListener('click',event=>{const button=event.target.closest('[data-trivia]');if(!button)return;const correct=index===0?'1960':'The Shield',answer=row.querySelector('[data-trivia-answer]');answer.textContent=button.dataset.trivia===correct?'Correct ✓':`Answer: ${correct}`}));
  }

  function addMovementTracker(){
    const grid=document.querySelector('.v13-section .v13-grid');if(!grid||findCard('Roster movement tracker'))return;
    const moves=(state.base?.transactions||[]).slice(0,10),favorites=new Set(parse(localStorage.getItem('titans:favoritePlayers'),[]).map(String)),favNames=(state.base?.roster||[]).filter(p=>favorites.has(String(p.id))).map(p=>p.name.toLowerCase());
    const body=moves.length?`<div class="v13-move-track">${moves.map(m=>{const hit=favNames.some(name=>String(m.description||'').toLowerCase().includes(name));return `<div class="${hit?'favorite':''}"><time>${esc(String(m.date||'').slice(0,10)||'Date TBD')}</time><strong>${esc(m.type||'Move')}</strong><p>${esc(m.description)}</p>${hit?'<span>Favorite-player update</span>':''}</div>`}).join('')}</div>`:'<p>No roster moves are loaded yet.</p>';
    grid.appendChild(card('Roster movement tracker',body,'v13-wide'));
  }

  function addOpponentDetail(){
    const target=findCard('Opponent scout');if(!target||target.dataset.v13OpponentExtra)return;target.dataset.v13OpponentExtra='1';const o=state.intel?.opponent;if(!o)return;
    const finals=(o.recent||[]).filter(g=>g.result&&g.score);let scored=0,allowed=0,count=0;
    for(const g of finals){const [home,away]=String(g.score).split('-').map(Number);if(!Number.isFinite(home)||!Number.isFinite(away))continue;const oppHome=g.home===o.name;scored+=oppHome?home:away;allowed+=oppHome?away:home;count++}
    if(!count)return;
    const pf=scored/count,pa=allowed/count,watch=[];
    watch.push(pf>=24?'They have scored well in the loaded games. Keep explosive plays down.':'Their loaded scoring pace is modest. Make them sustain long drives.');
    watch.push(pa<=20?'Their defense has limited points in the loaded games. Field position matters.':'Opponents have found points in the loaded games. Finish drives in the red zone.');
    const extra=document.createElement('div');extra.className='v13-scout-extra';extra.innerHTML=`<div><strong>${pf.toFixed(1)}</strong><span>points scored / loaded final</span></div><div><strong>${pa.toFixed(1)}</strong><span>points allowed / loaded final</span></div><h4>What to watch</h4><ul>${watch.map(x=>`<li>${esc(x)}</li>`).join('')}<li>Protect the football; turnover margin can swing any matchup.</li></ul><small>Simple scouting summary from loaded 2026 results, not a coaching grade.</small>`;target.appendChild(extra);
  }

  function addMomentumChart(){
    const target=findCard('Game timeline');if(!target||target.querySelector('.v13-momentum-chart'))return;const rows=(state.intel?.gameDay?.plays||[]).filter(p=>p.winProbability!=null).slice(0,18).reverse();if(rows.length<2)return;
    const points=rows.map((p,i)=>`${(i/(rows.length-1)*100).toFixed(1)},${(40-Math.max(0,Math.min(1,Number(p.winProbability)))*40).toFixed(1)}`).join(' '),last=Math.round(Number(rows.at(-1).winProbability)*100);
    const el=document.createElement('div');el.className='v13-momentum-chart';el.innerHTML=`<h4>Game momentum</h4><svg viewBox="0 0 100 40" role="img" aria-label="Win probability trend"><line x1="0" y1="20" x2="100" y2="20"></line><polyline points="${points}"></polyline></svg><span>Latest loaded win probability: <strong>${last}%</strong></span><small>Moves with the play-by-play data. It is a model output, not certainty.</small>`;target.appendChild(el);
  }

  function addScenarioSandbox(){
    const grid=document.querySelector('.v13-section .v13-grid');if(!grid||findCard('What-if standings'))return;const rows=(state.intel?.standings||[]).filter(r=>r.division==='AFC South'),ten=rows.find(r=>r.abbreviation==='TEN'),rival=rows.filter(r=>r.abbreviation!=='TEN').sort((a,b)=>(a.divisionRank??99)-(b.divisionRank??99))[0];if(!ten)return;
    const el=card('What-if standings',`<div class="v13-whatif"><p>Try one simple result. This does <strong>not</strong> replace official NFL tiebreakers.</p><label>Tennessee<select data-whatif-ten><option value="win">Wins next</option><option value="loss">Loses next</option></select></label>${rival?`<label>${esc(rival.abbreviation)}<select data-whatif-rival><option value="win">Wins next</option><option value="loss">Loses next</option></select></label>`:''}<div data-whatif-result></div></div>`);
    grid.appendChild(el);
    const draw=()=>{const tenWin=el.querySelector('[data-whatif-ten]').value==='win',tw=ten.wins+(tenWin?1:0),tl=ten.losses+(tenWin?0:1);let copy=`TEN would be ${tw}-${tl}.`;if(rival){const rw=rival.wins+(el.querySelector('[data-whatif-rival]').value==='win'?1:0),rl=rival.losses+(el.querySelector('[data-whatif-rival]').value==='loss'?1:0);copy+=` ${rival.abbreviation} would be ${rw}-${rl}.`; }copy+=' Exact playoff rank still depends on every applicable tiebreaker.';el.querySelector('[data-whatif-result]').textContent=copy};
    el.querySelectorAll('select').forEach(s=>s.addEventListener('change',draw));draw();
  }

  function aggregate2026(name){
    const rows=(state.intel?.playerStats||[]).filter(r=>r.name===name),seen=new Set(),totals={};
    for(const row of rows){const key=`${row.week}:${row.statGroup}`;if(seen.has(key))continue;seen.add(key);for(const [k,v] of Object.entries(row.stats||{}))if(Number.isFinite(Number(v)))totals[k]=(totals[k]||0)+Number(v)}
    const picks=[['Pass yds',stat(totals,['passing_yards','pass_yds'])],['Rush yds',stat(totals,['rushing_yards','rush_yds'])],['Rec yds',stat(totals,['receiving_yards','rec_yds'])],['Tackles',stat(totals,['total_tackles','tackles'])],['Sacks',stat(totals,['sacks'])]].filter(([,v])=>v!=null);
    return picks;
  }

  function addEraComparison(){
    const grid=document.querySelector('.v13-section .v13-grid');if(!grid||findCard('2025 vs 2026'))return;const baseline=state.base?.teamContext?.baselineStats?.players||[];if(!baseline.length)return;
    const body=`<div class="v13-era-compare"><label>Player<select data-era-player>${baseline.map((p,i)=>`<option value="${i}">${esc(p.name)}</option>`).join('')}</select></label><div data-era-compare-body></div></div>`;
    const el=card('2025 vs 2026',body,'v13-wide');grid.appendChild(el);
    const draw=()=>{const player=baseline[Number(el.querySelector('[data-era-player]').value)||0],current=aggregate2026(player.name),out=el.querySelector('[data-era-compare-body]');out.innerHTML=`<div><section><small>2025 verified baseline</small><strong>${esc(player.name)} · ${esc(player.position)}</strong><ul>${(player.lines||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section><small>2026 currently loaded</small><strong>${current.length?'Current totals':'Not enough matching stats yet'}</strong>${current.length?`<ul>${current.map(([k,v])=>`<li>${esc(k)}: ${esc(v)}</li>`).join('')}</ul>`:'<p>This side fills as verified 2026 player stats are imported.</p>'}</section></div>`};el.querySelector('[data-era-player]').addEventListener('change',draw);draw();
  }

  async function enhance(){
    if(location.hash.replace(/^#/,'').split('?')[0]!=='fan')return;const view=document.querySelector('#v13-view');if(!view||view.dataset.v13Addons==='1')return;view.dataset.v13Addons='1';await load();const title=view.querySelector('.v13-section>header h2')?.textContent?.trim();
    if(title==='Today')addFanPicks();
    if(title==='Game'){addOpponentDetail();addMomentumChart()}
    if(title==='Team')addMovementTracker();
    if(title==='Season')addScenarioSandbox();
    if(title==='History')addEraComparison();
  }

  const observer=new MutationObserver(()=>queueMicrotask(enhance));
  if(app)observer.observe(app,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(enhance,30));
  setTimeout(enhance,60);
})();
