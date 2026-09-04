import('./fantasy-sleeper-intelligence-v2.js').catch(()=>{});
import('./fantasy-decision-center-v3.js').catch(()=>{});
(() => {
  'use strict';
  const runtime=window.TitansRuntime;
  const input=document.querySelector('#global-search');
  const wrap=input?.closest('.search-wrap');
  if(!runtime||!input||!wrap||document.querySelector('.v111-search-panel'))return;

  const sections=[
    ['#home','Home','today next game dashboard'],
    ['#live','Game Day','live score kickoff game opponent'],
    ['#games','Schedule','schedule games weeks opponents'],
    ['#tickets','Tickets','tickets buy tickets seats seatgeek nissan stadium cheapest price'],
    ['#roster','Roster','players depth personnel numbers positions'],
    ['#transactions','Transactions','moves signings waivers releases cuts'],
    ['#stats','Stats Lab','stats analytics epa cpoe success rate'],
    ['#fantasy','Fantasy Command','fantasy football lineup sleeper draft start sit ppr points decision compare waiver'],
    ['#feed','Intel Feed','news updates reports stories'],
    ['#fan','Fan Hub','injuries standings opponent ask titans'],
    ['#media','Listen / Watch','watch tv radio stream broadcast channel'],
    ['#command','Command Intel','what changed press scheme fan gm history'],
    ['#legacy','Legacy','history oilers throwback retro logos'],
    ['#sources','Sources','data provenance verification'],
  ];
  const quick=[
    ['#fan','Ask: What changed?','what changed since last visit'],
    ['#fan','Ask: Who is next?','next game opponent kickoff'],
    ['#fan','Ask: Injuries','injuries availability practice status'],
    ['#tickets','Find cheapest tickets','buy tickets cheapest seatgeek seats price'],
    ['#fantasy','Compare Start / Sit','fantasy start sit decision compare sleeper lineup'],
    ['#fantasy','Open Fantasy Command','fantasy start sit sleeper draft lineup scoring'],
    ['#media','How do I watch?','watch listen tv radio network'],
    ['#stats','Explain EPA','epa expected points added'],
  ];
  const state={data:null,open:false,index:-1,items:[],query:'',loading:null};
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=value=>String(value??'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const playerHref=p=>p?.id?`#player?id=${encodeURIComponent(p.id)}`:p?.name?`#player?name=${encodeURIComponent(p.name)}`:'#roster';

  const panel=document.createElement('div');
  panel.className='v111-search-panel';
  panel.id='v111-search-panel';
  panel.hidden=true;
  panel.setAttribute('role','listbox');
  panel.setAttribute('aria-label','Titans search suggestions');
  wrap.appendChild(panel);
  input.setAttribute('aria-controls',panel.id);
  input.setAttribute('aria-expanded','false');
  input.setAttribute('aria-autocomplete','list');

  async function load(){
    if(state.data)return state.data;
    if(state.loading)return state.loading;
    state.loading=runtime.apiJson('/api/data',{ttl:30000}).then(data=>state.data=data?.ok?data:{}).finally(()=>state.loading=null);
    return state.loading;
  }

  function score(query,text){
    const q=norm(query),hay=norm(text);if(!q)return 1;
    if(hay.startsWith(q))return 8;
    if(hay.includes(q))return 5;
    const parts=q.split(' ').filter(Boolean);return parts.reduce((n,p)=>n+(hay.includes(p)?1:0),0);
  }

  function buildItems(query){
    const q=norm(query),rows=[];
    for(const [href,label,terms] of sections){const s=score(q,`${label} ${terms}`);if(!q||s>0)rows.push({kind:'SECTION',label,detail:terms.split(' ').slice(0,4).join(' · '),href,score:s+2});}
    for(const [href,label,terms] of quick){const s=score(q,`${label} ${terms}`);if(q&&s>0)rows.push({kind:'QUICK ANSWER',label,detail:'Open Ask Titans / related center',href,score:s+1});}
    for(const p of Array.isArray(state.data?.roster)?state.data.roster:[]){
      const label=p.name||'Player',detail=[p.position,p.number?`#${p.number}`:'',p.status||p.tag||''].filter(Boolean).join(' · '),s=score(q,`${label} ${detail} ${p.unit||''}`);
      if(q&&s>0)rows.push({kind:'PLAYER',label,detail,href:playerHref(p),score:s+3});
    }
    return rows.sort((a,b)=>b.score-a.score||a.label.localeCompare(b.label)).slice(0,8);
  }

  function render(){
    const items=buildItems(state.query);state.items=items;
    if(state.index>=items.length)state.index=items.length-1;
    if(!items.length){panel.innerHTML='<div class="v111-search-empty"><strong>No direct match.</strong><span>Press Enter to search the full site.</span></div>';return;}
    panel.innerHTML=`<div class="v111-search-head"><span>${state.query?'QUICK MATCHES':'QUICK JUMP'}</span><small>${state.query?'Enter opens the highlighted result':'Type a player, page, or question'}</small></div>${items.map((item,i)=>`<a role="option" aria-selected="${i===state.index?'true':'false'}" class="${i===state.index?'active':''}" data-v111-index="${i}" href="${esc(item.href)}"><small>${esc(item.kind)}</small><strong>${esc(item.label)}</strong><span>${esc(item.detail)}</span></a>`).join('')}<footer><span>↑↓ move · Enter open · Esc close</span><span>⌘K / Ctrl+K focus</span></footer>`;
  }

  function open(){state.open=true;panel.hidden=false;input.setAttribute('aria-expanded','true');render();}
  function close(){state.open=false;state.index=-1;panel.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');}
  function activate(index){const item=state.items[index];if(!item)return;close();input.blur();location.hash=item.href.replace(/^#/,'');}
  function syncActive(){
    panel.querySelectorAll('[data-v111-index]').forEach((el,i)=>{const active=i===state.index;el.classList.toggle('active',active);el.setAttribute('aria-selected',String(active));if(active){el.id='v111-search-active';input.setAttribute('aria-activedescendant',el.id);}else if(el.id==='v111-search-active')el.removeAttribute('id');});
  }
  function hydrateActiveQuery(query){
    load().then(()=>{
      if(!state.open||document.activeElement!==input||state.query!==query||input.value!==query||state.index>=0)return;
      render();
    });
  }

  input.addEventListener('focus',()=>{const query=input.value;state.query=query;open();hydrateActiveQuery(query);});
  input.addEventListener('input',()=>{const query=input.value;state.query=query;state.index=-1;open();hydrateActiveQuery(query);});
  input.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();close();input.blur();return;}
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();if(!state.open)open();
      const delta=event.key==='ArrowDown'?1:-1;
      state.index=Math.max(0,Math.min(state.items.length-1,state.index<0?(delta>0?0:state.items.length-1):state.index+delta));syncActive();return;
    }
    if(event.key==='Enter'&&state.open&&state.index>=0){event.preventDefault();event.stopImmediatePropagation();activate(state.index);}
  },true);
  panel.addEventListener('pointerdown',event=>{const link=event.target.closest?.('[data-v111-index]');if(link)event.preventDefault();});
  panel.addEventListener('click',event=>{const link=event.target.closest?.('[data-v111-index]');if(!link)return;event.preventDefault();activate(Number(link.dataset.v111Index));});
  document.addEventListener('pointerdown',event=>{if(state.open&&!wrap.contains(event.target))close();});
  runtime.onRoute(()=>close());
  runtime.onRefresh(()=>{
    state.data=null;state.loading=null;
    if(document.activeElement===input){const query=input.value;state.query=query;open();hydrateActiveQuery(query);}
  });
})();
