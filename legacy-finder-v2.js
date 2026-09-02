import { ensureLegacyHeritage } from './legacy-heritage-v3.js';
import { ensureLegacyTrails } from './legacy-trails-v4.js';

const FINDER_VERSION='2.3.0';
const ROUTE='legacy';
const SECTION_MAP={
  story:{id:'legacy-story',label:'Story',selectors:['.legacy-story-card']},
  moments:{id:'legacy-moments',label:'Moments',selectors:['.legacy-moment-card']},
  legends:{id:'legacy-legends',label:'Legends',selectors:['.legacy-legend-card']},
  records:{id:'legacy-records',label:'Records',selectors:['.legacy-record-card','.legacy-retired-card']},
  heritage:{id:'legacy-heritage',label:'Heritage',selectors:['.legacy-venue-card','.legacy-honor-card']},
  identity:{id:'legacy-identity',label:'Identity',selectors:['.legacy-era','.archive-card','.visual-gap-card']}
};
const ITEM_SELECTOR=Object.values(SECTION_MAP).flatMap(section=>section.selectors).join(',');
const EXHIBIT_RULES=[
  {type:'story',selector:'.legacy-story-card',label:item=>item.querySelector('h3')?.textContent||''},
  {type:'moment',selector:'.legacy-moment-card',label:item=>item.querySelector('h3')?.textContent||''},
  {type:'legend',selector:'.legacy-legend-card',label:item=>item.querySelector('h3')?.textContent||''},
  {type:'record',selector:'.legacy-record-card',label:item=>`${item.querySelector('h3')?.textContent||''} ${item.querySelector('span')?.textContent||''}`.trim()},
  {type:'retired',selector:'.legacy-retired-card',label:item=>`${item.querySelector('span')?.textContent||''} ${item.querySelector('strong')?.textContent||''}`.trim()},
  {type:'venue',selector:'.legacy-venue-card',label:item=>item.querySelector('h3')?.textContent||''},
  {type:'honor',selector:'.legacy-honor-card',label:item=>item.querySelector('h4')?.textContent||''}
];

const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const normalize=value=>String(value||'').toLocaleLowerCase('en-US').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
const tokens=value=>normalize(value).split(' ').filter(Boolean);
const scopeForItem=item=>Object.entries(SECTION_MAP).find(([,section])=>section.selectors.some(selector=>item.matches(selector)))?.[0]||'all';
const slug=value=>normalize(value).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,72);
const exhibitRuleFor=item=>EXHIBIT_RULES.find(rule=>item.matches(rule.selector))||null;

function hashState(){
  const [,query='']=location.hash.replace(/^#/,'').split('?');
  const params=new URLSearchParams(query);
  const scope=params.get('scope');
  return {q:params.get('q')||'',scope:scope&&SECTION_MAP[scope]?scope:'all',exhibit:params.get('exhibit')||''};
}

function writeHashState(q,scope){
  if(route()!==ROUTE)return;
  const [,query='']=location.hash.replace(/^#/,'').split('?');
  const params=new URLSearchParams(query);
  const cleanQ=String(q||'').trim();
  if(cleanQ)params.set('q',cleanQ);else params.delete('q');
  if(scope&&scope!=='all'&&SECTION_MAP[scope])params.set('scope',scope);else params.delete('scope');
  params.delete('exhibit');
  const nextQuery=params.toString();
  const next=`#${ROUTE}${nextQuery?`?${nextQuery}`:''}`;
  if(location.hash!==next)history.replaceState(history.state,'',`${location.pathname}${location.search}${next}`);
}

function writeExhibitState(key){
  if(route()!==ROUTE)return;
  const [,query='']=location.hash.replace(/^#/,'').split('?');
  const params=new URLSearchParams(query);
  params.delete('q');params.delete('scope');params.delete('trail');params.delete('step');
  if(key)params.set('exhibit',key);else params.delete('exhibit');
  const nextQuery=params.toString();
  const next=`#${ROUTE}${nextQuery?`?${nextQuery}`:''}`;
  if(location.hash!==next)history.replaceState(history.state,'',`${location.pathname}${location.search}${next}`);
}

function exactExhibitUrl(key){
  const clean=String(key||'').trim();
  return `${location.origin}${location.pathname}${location.search}#${ROUTE}?exhibit=${encodeURIComponent(clean)}`;
}

function finderMarkup(counts){
  const tabs=[['all','All'],...Object.entries(SECTION_MAP).map(([key,value])=>[key,value.label])];
  return `<section class="legacy-finder" data-legacy-finder data-version="${FINDER_VERSION}" aria-labelledby="legacy-finder-title">
    <div class="legacy-finder-head">
      <div><small>Fast path through franchise history</small><h2 id="legacy-finder-title">Legacy Finder</h2><p>Search names, years, games, records, venues, honors, retired numbers and identity history without digging through the full museum.</p></div>
      <div class="legacy-finder-audit"><span>History pass</span><strong>Source-backed · Sep. 1, 2026</strong></div>
    </div>
    <div class="legacy-finder-controls">
      <label class="legacy-finder-search" for="legacy-finder-input"><span>Search Legacy</span><div><span aria-hidden="true">⌕</span><input id="legacy-finder-input" type="search" inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="Try McNair, Astrodome, 1999, Mike Keith, #34…"><kbd>/</kbd></div></label>
      <button type="button" class="legacy-finder-clear" data-legacy-finder-clear hidden>Clear</button>
      <button type="button" class="legacy-finder-share" data-legacy-finder-share>Share view</button>
    </div>
    <div class="legacy-finder-scopes" role="group" aria-label="Limit Legacy Finder to a museum section">${tabs.map(([key,label])=>`<button type="button" data-legacy-finder-scope="${key}" aria-pressed="${key==='all'}">${label}<span>${key==='all'?counts.total:counts[key]}</span></button>`).join('')}</div>
    <div class="legacy-finder-feedback"><span id="legacy-finder-count" role="status" aria-live="polite"></span><span id="legacy-finder-action" role="status" aria-live="polite"></span><button type="button" class="legacy-exhibit-clear" data-legacy-exhibit-clear hidden>Back to full museum</button></div>
    <div class="legacy-finder-empty" data-legacy-finder-empty hidden><strong>No museum entries match.</strong><span>Try a player, venue, season, team era or a broader section.</span><button type="button" data-legacy-finder-clear>Reset Legacy Finder</button></div>
  </section>`;
}

function searchableText(item){
  const clone=item.cloneNode(true);
  clone.querySelectorAll('.legacy-history-sources,.archive-source-list,.archive-inline-sources,.visual-audit-source-chips,.legacy-exhibit-actions').forEach(node=>node.remove());
  clone.querySelectorAll('.legacy-heritage-sources').forEach(node=>node.remove());
  return normalize(clone.textContent);
}

function decorateExhibit(item,usedKeys){
  const rule=exhibitRuleFor(item);
  if(!rule)return null;
  const label=String(rule.label(item)||'').replace(/\s+/g,' ').trim();
  if(!label)return null;
  const base=`${rule.type}-${slug(label)}`;
  if(!base||base.endsWith('-'))return null;
  let key=base,suffix=2;
  while(usedKeys.has(key))key=`${base}-${suffix++}`;
  usedKeys.add(key);
  item.dataset.legacyExhibitKey=key;
  item.dataset.legacyExhibitLabel=label;
  item.setAttribute('tabindex','-1');
  if(!item.querySelector('[data-legacy-exhibit-share]'))item.insertAdjacentHTML('beforeend',`<div class="legacy-exhibit-actions"><button type="button" data-legacy-exhibit-share="${key}" aria-label="Share Legacy exhibit: ${label.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}">Share exhibit</button></div>`);
  return key;
}

function indexMuseum(page){
  const items=[...page.querySelectorAll(ITEM_SELECTOR)];
  const byExhibit=new Map(),usedKeys=new Set();
  items.forEach(item=>{
    item.dataset.legacyFinderItem='true';
    item.dataset.legacyFinderScope=scopeForItem(item);
    item.dataset.legacyFinderText=searchableText(item);
    const key=decorateExhibit(item,usedKeys);
    if(key)byExhibit.set(key,item);
  });
  const counts={total:items.length,story:0,moments:0,legends:0,records:0,heritage:0,identity:0};
  items.forEach(item=>{const scope=item.dataset.legacyFinderScope;if(scope in counts)counts[scope]+=1;});
  return {items,counts,byExhibit};
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
  const heritageAll=page.querySelector('[data-heritage-honor-filter="all"]');
  if(heritageAll){
    page.querySelectorAll('[data-heritage-honor-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button===heritageAll)));
    page.querySelectorAll('.legacy-honor-card').forEach(card=>{card.hidden=false;});
  }
}

function createController(page,finder,index){
  const input=finder.querySelector('#legacy-finder-input');
  const count=finder.querySelector('#legacy-finder-count');
  const action=finder.querySelector('#legacy-finder-action');
  const empty=finder.querySelector('[data-legacy-finder-empty]');
  const exhibitClear=finder.querySelector('[data-legacy-exhibit-clear]');
  const sectionNodes=Object.fromEntries(Object.entries(SECTION_MAP).map(([key,section])=>[key,page.querySelector(`#${CSS.escape(section.id)}`)]));
  let state={q:'',scope:'all'},spotlight=null;

  function updateSections(active){
    Object.entries(sectionNodes).forEach(([key,section])=>{
      if(!section)return;
      if(!active){section.classList.remove('legacy-finder-section-hidden');return;}
      const matches=index.items.some(item=>item.dataset.legacyFinderScope===key&&!item.classList.contains('legacy-finder-filtered'));
      section.classList.toggle('legacy-finder-section-hidden',!matches);
    });
  }

  function clearSpotlight({syncUrl=true,announce=true}={}){
    if(spotlight)spotlight.classList.remove('legacy-exhibit-focus');
    spotlight=null;
    page.classList.remove('legacy-exhibit-active');
    exhibitClear.hidden=true;
    if(announce)action.textContent='';
    if(syncUrl){
      const current=hashState();
      if(current.exhibit)writeExhibitState('');
    }
  }

  function focusExhibit(key,{syncUrl=false,scroll=true}={}){
    const item=index.byExhibit.get(String(key||''));
    if(!item)return false;
    resetMuseumNativeFilters(page);
    apply({q:'',scope:'all'},{syncUrl:false,announce:false,preserveSpotlight:true});
    clearSpotlight({syncUrl:false,announce:false});
    spotlight=item;
    item.classList.add('legacy-exhibit-focus');
    page.classList.add('legacy-exhibit-active');
    exhibitClear.hidden=false;
    const label=item.dataset.legacyExhibitLabel||'Legacy exhibit';
    count.textContent=`Exhibit spotlight · ${label}`;
    action.textContent='Exact exhibit link loaded.';
    if(syncUrl)writeExhibitState(item.dataset.legacyExhibitKey);
    if(scroll)requestAnimationFrame(()=>{
      const reduced=matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      item.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
      try{item.focus({preventScroll:true});}catch{item.focus();}
    });
    return true;
  }

  function apply(next,{syncUrl=true,announce=true,preserveSpotlight=false}={}){
    if(!preserveSpotlight&&spotlight)clearSpotlight({syncUrl:false,announce:false});
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

  async function shareView(){
    const payload={title:'Titans Legacy Finder',text:state.q?`Titans Legacy: ${state.q}`:'Titans franchise legacy museum',url:location.href};
    try{
      if(navigator.share){await navigator.share(payload);action.textContent='Share sheet opened.';return;}
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(location.href);action.textContent='Legacy link copied.';return;}
      action.textContent='Copy the current address to share this view.';
    }catch(error){if(error?.name!=='AbortError')action.textContent='Sharing is unavailable right now.';}
  }

  async function shareExhibit(button){
    const key=button?.dataset.legacyExhibitShare||'';
    const item=index.byExhibit.get(key);
    if(!item)return;
    const label=item.dataset.legacyExhibitLabel||'Legacy exhibit';
    const url=exactExhibitUrl(key);
    const payload={title:`Titans Legacy · ${label}`,text:`Tennessee Titans Legacy exhibit: ${label}`,url};
    try{
      if(navigator.share){await navigator.share(payload);action.textContent=`Shared exhibit · ${label}`;return;}
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);action.textContent=`Exhibit link copied · ${label}`;return;}
      action.textContent=`Copy this exhibit link: ${url}`;
    }catch(error){if(error?.name!=='AbortError')action.textContent='Exhibit sharing is unavailable right now.';}
  }

  finder.addEventListener('input',event=>{
    if(event.target===input)apply({q:input.value,scope:state.scope});
  });
  finder.addEventListener('click',event=>{
    const scopeButton=event.target.closest('[data-legacy-finder-scope]');
    if(scopeButton){apply({q:state.q,scope:scopeButton.dataset.legacyFinderScope});return;}
    if(event.target.closest('[data-legacy-exhibit-clear]')){clearSpotlight();apply({q:'',scope:'all'},{syncUrl:false});input.focus();return;}
    if(event.target.closest('[data-legacy-finder-clear]')){apply({q:'',scope:'all'});input.focus();return;}
    if(event.target.closest('[data-legacy-finder-share]'))void shareView();
  });

  page.addEventListener('click',event=>{
    const exhibitShare=event.target.closest('[data-legacy-exhibit-share]');
    if(exhibitShare){event.preventDefault();event.stopPropagation();void shareExhibit(exhibitShare);return;}
    const jump=event.target.closest('[data-legacy-scroll]');
    const nativeFilter=event.target.closest('.legacy-era-filter,.archive-filter,[data-heritage-honor-filter]');
    if(jump||nativeFilter){
      if(spotlight)clearSpotlight();
      if(state.q||state.scope!=='all')apply({q:'',scope:'all'});
    }
  },true);

  const initial=hashState();
  apply(initial,{syncUrl:false,announce:false});
  if(initial.exhibit&&!focusExhibit(initial.exhibit,{syncUrl:false,scroll:true})){
    action.textContent='That exhibit link is no longer available.';
    writeExhibitState('');
  }

  return {apply,input,focusExhibit,clearSpotlight,getState:()=>({...state}),getSpotlight:()=>spotlight?.dataset.legacyExhibitKey||''};
}

function enhanceLegacy(){
  if(route()!==ROUTE)return;
  const page=document.querySelector('.legacy-page[data-polished="true"]');
  if(!page||page.querySelector('[data-legacy-finder]'))return;
  const jump=page.querySelector('.legacy-museum-jump');
  if(!jump)return;
  ensureLegacyHeritage(page);
  const index=indexMuseum(page);
  jump.insertAdjacentHTML('afterend',finderMarkup(index.counts));
  const finder=page.querySelector('[data-legacy-finder]');
  if(!finder)return;
  const controller=createController(page,finder,index);
  ensureLegacyTrails(page,controller);
  page.dataset.legacyFinderReady='true';
  page.dataset.legacyExhibitLinksReady='true';
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
  if(event.key==='Escape'&&controller.getSpotlight()){event.preventDefault();controller.clearSpotlight();controller.apply({q:'',scope:'all'},{syncUrl:false});return;}
  if(event.key==='Escape'&&document.activeElement===controller.input&&controller.getState().q){event.preventDefault();controller.apply({q:'',scope:'all'});}
}

const observer=new MutationObserver(()=>requestAnimationFrame(enhanceLegacy));
const root=document.querySelector('#app');
if(root)observer.observe(root,{childList:true,subtree:true});
addEventListener('hashchange',()=>requestAnimationFrame(enhanceLegacy));
addEventListener('keydown',focusFinderShortcut);
requestAnimationFrame(enhanceLegacy);