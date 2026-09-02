const FINDER_VERSION='2.0.0';
const ROUTE='legacy';
const SECTION_MAP={
  story:{id:'legacy-story',label:'Story',selectors:['.legacy-story-card']},
  moments:{id:'legacy-moments',label:'Moments',selectors:['.legacy-moment-card']},
  legends:{id:'legacy-legends',label:'Legends',selectors:['.legacy-legend-card']},
  records:{id:'legacy-records',label:'Records',selectors:['.legacy-record-card','.legacy-retired-card']},
  identity:{id:'legacy-identity',label:'Identity',selectors:['.legacy-era','.archive-card','.visual-gap-card']}
};
const ITEM_SELECTOR=Object.values(SECTION_MAP).flatMap(section=>section.selectors).join(',');

const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const normalize=value=>String(value||'').toLocaleLowerCase('en-US').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
const tokens=value=>normalize(value).split(' ').filter(Boolean);
const scopeForItem=item=>Object.entries(SECTION_MAP).find(([,section])=>section.selectors.some(selector=>item.matches(selector)))?.[0]||'all';

function hashState(){
  const [,query='']=location.hash.replace(/^#/,'').split('?');
  const params=new URLSearchParams(query);
  const scope=params.get('scope');
  return {q:params.get('q')||'',scope:scope&&SECTION_MAP[scope]?scope:'all'};
}

function writeHashState(q,scope){
  if(route()!==ROUTE)return;
  const params=new URLSearchParams();
  const cleanQ=String(q||'').trim();
  if(cleanQ)params.set('q',cleanQ);
  if(scope&&scope!=='all'&&SECTION_MAP[scope])params.set('scope',scope);
  const query=params.toString();
  const next=`#${ROUTE}${query?`?${query}`:''}`;
  if(location.hash!==next)history.replaceState(history.state,'',`${location.pathname}${location.search}${next}`);
}

function finderMarkup(counts){
  const tabs=[['all','All'],...Object.entries(SECTION_MAP).map(([key,value])=>[key,value.label])];
  return `<section class="legacy-finder" data-legacy-finder data-version="${FINDER_VERSION}" aria-labelledby="legacy-finder-title">
    <div class="legacy-finder-head">
      <div><small>Fast path through franchise history</small><h2 id="legacy-finder-title">Legacy Finder</h2><p>Search names, years, games, records, eras, retired numbers and identity history without digging through the full museum.</p></div>
      <div class="legacy-finder-audit"><span>History pass</span><strong>Source-backed · Sep. 1, 2026</strong></div>
    </div>
    <div class="legacy-finder-controls">
      <label class="legacy-finder-search" for="legacy-finder-input"><span>Search Legacy</span><div><span aria-hidden="true">⌕</span><input id="legacy-finder-input" type="search" inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="Try McNair, Oilers, 1999, Henry, #34…"><kbd>/</kbd></div></label>
      <button type="button" class="legacy-finder-clear" data-legacy-finder-clear hidden>Clear</button>
      <button type="button" class="legacy-finder-share" data-legacy-finder-share>Share view</button>
    </div>
    <div class="legacy-finder-scopes" role="group" aria-label="Limit Legacy Finder to a museum section">${tabs.map(([key,label])=>`<button type="button" data-legacy-finder-scope="${key}" aria-pressed="${key==='all'}">${label}<span>${key==='all'?counts.total:counts[key]}</span></button>`).join('')}</div>
    <div class="legacy-finder-feedback"><span id="legacy-finder-count" role="status" aria-live="polite"></span><span id="legacy-finder-action" role="status" aria-live="polite"></span></div>
    <div class="legacy-finder-empty" data-legacy-finder-empty hidden><strong>No museum entries match.</strong><span>Try a player name, season, team era or a broader section.</span><button type="button" data-legacy-finder-clear>Reset Legacy Finder</button></div>
  </section>`;
}

function searchableText(item){
  const clone=item.cloneNode(true);
  clone.querySelectorAll('.legacy-history-sources,.archive-source-list,.archive-inline-sources,.visual-audit-source-chips').forEach(node=>node.remove());
  return normalize(clone.textContent);
}

function indexMuseum(page){
  const items=[...page.querySelectorAll(ITEM_SELECTOR)];
  items.forEach(item=>{
    item.dataset.legacyFinderItem='true';
    item.dataset.legacyFinderScope=scopeForItem(item);
    item.dataset.legacyFinderText=searchableText(item);
  });
  const counts={total:items.length,story:0,moments:0,legends:0,records:0,identity:0};
  items.forEach(item=>{const scope=item.dataset.legacyFinderScope;if(scope in counts)counts[scope]+=1;});
  return {items,counts};
}

function resetMuseumNativeFilters(page){
  const eraAll=page.querySelector('.legacy-era-filter[data-era-filter="all"]');
  if(eraAll){
    page.querySelectorAll('.legacy-era-filter').forEach(button=>{
      const active=button===eraAll;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    page.querySelectorAll('.legacy-story-card').forEach(card=>{card.hidden=false;});
  }
  const archiveAll=page.querySelector('.archive-filter[data-filter="all"]');
  if(archiveAll){
    page.querySelectorAll('.archive-filter').forEach(button=>{
      const active=button===archiveAll;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    page.querySelectorAll('.archive-card').forEach(card=>{card.hidden=false;});
  }
}

function createController(page,finder,index){
  const input=finder.querySelector('#legacy-finder-input');
  const count=finder.querySelector('#legacy-finder-count');
  const action=finder.querySelector('#legacy-finder-action');
  const empty=finder.querySelector('[data-legacy-finder-empty]');
  const sectionNodes=Object.fromEntries(Object.entries(SECTION_MAP).map(([key,section])=>[key,page.querySelector(`#${CSS.escape(section.id)}`)]));
  let state={q:'',scope:'all'};

  function updateSections(active){
    Object.entries(sectionNodes).forEach(([key,section])=>{
      if(!section)return;
      if(!active){section.classList.remove('legacy-finder-section-hidden');return;}
      const matches=index.items.some(item=>item.dataset.legacyFinderScope===key&&!item.classList.contains('legacy-finder-filtered'));
      section.classList.toggle('legacy-finder-section-hidden',!matches);
    });
  }

  function apply(next,{syncUrl=true,announce=true}={}){
    state={q:String(next.q||''),scope:SECTION_MAP[next.scope]?next.scope:'all'};
    const terms=tokens(state.q);
    const active=terms.length>0||state.scope!=='all';
    if(active)resetMuseumNativeFilters(page);

    let visible=0;
    index.items.forEach(item=>{
      const scopeMatch=state.scope==='all'||item.dataset.legacyFinderScope===state.scope;
      const text=item.dataset.legacyFinderText||'';
      const textMatch=!terms.length||terms.every(term=>text.includes(term));
      const match=scopeMatch&&textMatch;
      item.classList.toggle('legacy-finder-filtered',active&&!match);
      item.classList.toggle('legacy-finder-match',active&&match);
      if(match)visible+=1;
    });
    updateSections(active);

    input.value=state.q;
    finder.querySelectorAll('[data-legacy-finder-scope]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.legacyFinderScope===state.scope)));
    finder.querySelectorAll('[data-legacy-finder-clear]').forEach(button=>{button.hidden=!active;});
    empty.hidden=visible!==0||!active;
    count.textContent=active?`${visible} matching museum ${visible===1?'entry':'entries'}`:`${index.counts.total} museum entries indexed`;
    if(announce)action.textContent='';
    page.classList.toggle('legacy-finder-active',active);
    if(syncUrl)writeHashState(state.q,state.scope);
  }

  async function share(){
    const payload={title:'Titans Legacy Finder',text:state.q?`Titans Legacy: ${state.q}`:'Titans franchise legacy museum',url:location.href};
    try{
      if(navigator.share){await navigator.share(payload);action.textContent='Share sheet opened.';return;}
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(location.href);action.textContent='Legacy link copied.';return;}
      action.textContent='Copy the current address to share this view.';
    }catch(error){if(error?.name!=='AbortError')action.textContent='Sharing is unavailable right now.';}
  }

  finder.addEventListener('input',event=>{
    if(event.target===input)apply({q:input.value,scope:state.scope});
  });
  finder.addEventListener('click',event=>{
    const scopeButton=event.target.closest('[data-legacy-finder-scope]');
    if(scopeButton){apply({q:state.q,scope:scopeButton.dataset.legacyFinderScope});return;}
    if(event.target.closest('[data-legacy-finder-clear]')){apply({q:'',scope:'all'});input.focus();return;}
    if(event.target.closest('[data-legacy-finder-share]'))void share();
  });

  page.addEventListener('click',event=>{
    const jump=event.target.closest('[data-legacy-scroll]');
    const nativeFilter=event.target.closest('.legacy-era-filter,.archive-filter');
    if((jump||nativeFilter)&&(state.q||state.scope!=='all'))apply({q:'',scope:'all'});
  },true);

  const initial=hashState();
  apply(initial,{syncUrl:false,announce:false});

  return {apply,input,getState:()=>({...state})};
}

function enhanceLegacy(){
  if(route()!==ROUTE)return;
  const page=document.querySelector('.legacy-page[data-polished="true"]');
  if(!page||page.querySelector('[data-legacy-finder]'))return;
  const jump=page.querySelector('.legacy-museum-jump');
  if(!jump)return;
  const index=indexMuseum(page);
  jump.insertAdjacentHTML('afterend',finderMarkup(index.counts));
  const finder=page.querySelector('[data-legacy-finder]');
  if(!finder)return;
  const controller=createController(page,finder,index);
  page.dataset.legacyFinderReady='true';
  page._legacyFinderController=controller;
}

function focusFinderShortcut(event){
  if(route()!==ROUTE)return;
  const page=document.querySelector('.legacy-page[data-legacy-finder-ready="true"]');
  const controller=page?._legacyFinderController;
  if(!controller)return;
  const target=event.target;
  const typing=target instanceof HTMLElement&&(/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)||target.isContentEditable);
  if(event.key==='/'&&!typing){event.preventDefault();controller.input.focus();controller.input.select();}
  if(event.key==='Escape'&&document.activeElement===controller.input&&controller.getState().q){event.preventDefault();controller.apply({q:'',scope:'all'});}
}

const observer=new MutationObserver(()=>requestAnimationFrame(enhanceLegacy));
const root=document.querySelector('#app');
if(root)observer.observe(root,{childList:true,subtree:true});
addEventListener('hashchange',()=>requestAnimationFrame(enhanceLegacy));
addEventListener('keydown',focusFinderShortcut);
requestAnimationFrame(enhanceLegacy);
