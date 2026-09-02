(() => {
  'use strict';
  const ROUTE='fantasy',ROOT='#fantasy-live-props-v122';
  const WATCH_STORE='titans-fantasy-prop-watchlist-v1',REVIEW_STORE='titans-fantasy-prop-review-v1';
  const MAX_ITEMS=32,MAX_BOOKS=6;
  const app=document.querySelector('#app');
  const state={changedOnly:false};
  let observer=null,queued=false;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const clean=value=>String(value??'').trim();
  const esc=value=>clean(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const slug=value=>clean(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const keyFor=(player,market)=>`${slug(player)}|${slug(market)}`;
  const num=value=>{const text=String(value??'').trim().replace(/,/g,'');if(!text)return null;const n=Number(text);return Number.isFinite(n)?n:null};
  const lineText=value=>{const n=Number(value);return Number.isFinite(n)?String(Number(n.toFixed(2))):'—'};
  const resumeObserver=()=>{if(observer&&app)observer.observe(app,{childList:true,subtree:true})};

  function loadWatchlist(){
    try{
      const parsed=JSON.parse(localStorage.getItem(WATCH_STORE)||'[]');
      if(!Array.isArray(parsed))return [];
      return parsed.filter(item=>item&&typeof item==='object'&&clean(item.player)&&clean(item.market))
        .map(item=>{const player=clean(item.player),market=clean(item.market);return {key:keyFor(player,market),player,market}})
        .filter((item,index,list)=>list.findIndex(candidate=>candidate.key===item.key)===index)
        .slice(0,MAX_ITEMS);
    }catch{return []}
  }

  function normalizeEntry(value){
    if(!value||typeof value!=='object'||Array.isArray(value))return null;
    const reviewedAt=Number(value.reviewedAt);
    if(!Number.isFinite(reviewedAt)||reviewedAt<=0)return null;
    const raw=value.books&&typeof value.books==='object'&&!Array.isArray(value.books)?value.books:{};
    const books={};
    for(const [bookKey,entry] of Object.entries(raw).slice(0,MAX_BOOKS)){
      const line=num(entry?.line),book=clean(entry?.book);
      if(!slug(bookKey)||!book||line==null)continue;
      books[slug(bookKey)]={book,line};
    }
    return Object.keys(books).length?{reviewedAt,books}:null;
  }

  function loadReview(){
    try{
      const parsed=JSON.parse(localStorage.getItem(REVIEW_STORE)||'{}');
      if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return {};
      const out={};
      for(const [key,value] of Object.entries(parsed).slice(0,MAX_ITEMS)){
        const entry=normalizeEntry(value);if(entry)out[clean(key)]=entry;
      }
      return out;
    }catch{return {}}
  }

  function saveReview(store){try{localStorage.setItem(REVIEW_STORE,JSON.stringify(store))}catch{}}

  function rowIdentity(row){
    const player=clean(row.querySelector('.fprop-player strong')?.textContent),market=clean(row.querySelector('.fprop-player span')?.textContent);
    return player&&market?{key:keyFor(player,market),player,market}:null;
  }

  function currentBooks(row){
    const books={};
    for(const quote of row.querySelectorAll('.fprop-quote')){
      const book=clean(quote.querySelector(':scope > strong')?.textContent),line=num(quote.querySelector('.fprop-line b')?.textContent);
      if(!book||line==null)continue;
      books[slug(book)]={book,line};
      if(Object.keys(books).length>=MAX_BOOKS)break;
    }
    return books;
  }

  function compare(row,baseline){
    const current=currentBooks(row);
    if(!baseline)return {kind:'unreviewed',lineChanges:[],reportingChanges:[],bookStates:[],score:0};
    const lineChanges=[],reportingChanges=[],bookStates=[];
    for(const [bookKey,now] of Object.entries(current)){
      const before=baseline.books[bookKey];
      if(!before){
        reportingChanges.push({book:now.book,kind:'now-reporting'});
        bookStates.push({book:now.book,kind:'now-reporting',before:null,now:now.line,delta:null});
        continue;
      }
      const delta=Number((now.line-before.line).toFixed(2));
      if(delta!==0){
        lineChanges.push({book:now.book,before:before.line,now:now.line,delta});
        bookStates.push({book:now.book,kind:delta>0?'up':'down',before:before.line,now:now.line,delta});
      }else{
        bookStates.push({book:now.book,kind:'same',before:before.line,now:now.line,delta:0});
      }
    }
    for(const [bookKey,before] of Object.entries(baseline.books)){
      if(!current[bookKey]){
        reportingChanges.push({book:before.book,kind:'not-reporting'});
        bookStates.push({book:before.book,kind:'not-reporting',before:before.line,now:null,delta:null});
      }
    }
    const score=Math.max(0,...lineChanges.map(change=>Math.abs(change.delta)))+reportingChanges.length*0.001;
    return {kind:lineChanges.length||reportingChanges.length?'changed':'same',lineChanges,reportingChanges,bookStates,score};
  }

  function pruneReview(store,watchedKeys){
    const next={};
    for(const key of watchedKeys){if(store[key])next[key]=store[key]}
    return next;
  }

  function sameStore(a,b){try{return JSON.stringify(a)===JSON.stringify(b)}catch{return false}}

  function formatTime(value){
    try{return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value))}
    catch{return 'earlier'}
  }

  function summaryReason(item){
    const line=item.result.lineChanges.length,reporting=item.result.reportingChanges.length;
    if(line&&reporting)return `${line} line change${line===1?'':'s'} · ${reporting} reporting change${reporting===1?'':'s'}`;
    if(line)return `${line} line change${line===1?'':'s'}`;
    return `${reporting} reporting change${reporting===1?'':'s'}`;
  }

  function bookStateLabel(value){
    if(value.kind==='up'||value.kind==='down')return `${value.book} ${value.kind==='up'?'↑':'↓'} ${lineText(Math.abs(value.delta))} · ${lineText(value.before)} → ${lineText(value.now)}`;
    if(value.kind==='same')return `${value.book} no change · ${lineText(value.now)}`;
    if(value.kind==='now-reporting')return `${value.book} now reporting · ${lineText(value.now)}`;
    return `${value.book} not reporting now · was ${lineText(value.before)}`;
  }

  function bookStateAria(value){
    if(value.kind==='up'||value.kind==='down')return `${value.book}, line ${value.kind}, ${lineText(Math.abs(value.delta))}, from ${lineText(value.before)} to ${lineText(value.now)}`;
    if(value.kind==='same')return `${value.book}, no line change, ${lineText(value.now)}`;
    if(value.kind==='now-reporting')return `${value.book}, now reporting, ${lineText(value.now)}`;
    return `${value.book}, not reporting now, previous line ${lineText(value.before)}`;
  }

  function markOneReviewed(row,identity){
    const liveIdentity=rowIdentity(row),watchedKeys=new Set(loadWatchlist().map(item=>item.key));
    if(!liveIdentity||liveIdentity.key!==identity.key||!watchedKeys.has(liveIdentity.key))return false;
    const books=currentBooks(row);if(!Object.keys(books).length)return false;
    const store=pruneReview(loadReview(),watchedKeys);
    store[liveIdentity.key]={reviewedAt:Date.now(),books};
    saveReview(store);decorate();return true;
  }

  function renderRowDetail(row,identity,result,baseline){
    let detail=row.querySelector(':scope > .fpr-row-detail');
    const lastQuote=[...row.querySelectorAll(':scope > .fprop-quote')].at(-1);
    if(!result||result.kind==='same'){
      detail?.remove();lastQuote?.classList.remove('fpr-before-detail');return;
    }
    if(!detail){
      detail=document.createElement('div');detail.className='fpr-row-detail';detail.setAttribute('role','group');row.append(detail);
    }
    lastQuote?.classList.add('fpr-before-detail');
    detail.setAttribute('aria-label',result.kind==='changed'?`Changes since review for ${identity.player} ${identity.market}`:`Review checkpoint for ${identity.player} ${identity.market}`);
    const canCapture=Object.keys(currentBooks(row)).length>0;
    const signature=JSON.stringify([result.kind,baseline?.reviewedAt||0,result.bookStates,canCapture]);
    if(detail.dataset.signature===signature)return;
    detail.dataset.signature=signature;detail.replaceChildren();
    const lead=document.createElement('strong');lead.className='fpr-row-detail-lead';lead.textContent=result.kind==='changed'?`Since review · ${formatTime(baseline.reviewedAt)}`:'No review checkpoint yet';detail.append(lead);
    for(const item of result.bookStates){
      const chip=document.createElement('span');chip.className=`fpr-book-state is-${item.kind}`;chip.textContent=bookStateLabel(item);chip.setAttribute('aria-label',bookStateAria(item));detail.append(chip);
    }
    const button=document.createElement('button');button.type='button';button.className='fpr-row-mark';button.textContent=result.kind==='changed'?'Mark this reviewed':'Set checkpoint';
    button.disabled=!canCapture;
    const action=result.kind==='changed'?'Mark this watched prop reviewed':'Set a review checkpoint for this watched prop';
    const unavailable=`Cannot mark ${identity.player} ${identity.market} reviewed because no current numeric sportsbook lines are reporting`;
    button.setAttribute('aria-label',canCapture?`${action}: ${identity.player} ${identity.market}`:unavailable);
    if(!canCapture)button.title=unavailable;
    button.addEventListener('click',()=>markOneReviewed(row,identity));
    detail.append(button);
  }

  function injectStyle(){
    if(document.querySelector('style[data-fantasy-prop-review-v138]'))return;
    const style=document.createElement('style');style.dataset.fantasyPropReviewV138='true';style.textContent=`
      .fpr-review{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;margin:0 0 14px;padding:13px 14px;border:1px solid rgba(126,184,238,.2);border-radius:14px;background:rgba(9,27,44,.76)}.fpr-copy strong,.fpr-copy span{display:block}.fpr-copy strong{font-size:.86rem;color:#f5f8fb}.fpr-copy span{margin-top:3px;color:#9db1c5;font-size:.76rem;line-height:1.4}.fpr-changes{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.fpr-change{padding:5px 7px;border:1px solid rgba(126,184,238,.18);border-radius:8px;background:rgba(75,146,219,.08);font-size:.7rem;color:#cfe8ff}.fpr-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:7px}.fpr-actions button{min-height:44px;border:1px solid rgba(126,184,238,.3);border-radius:10px;padding:0 11px;background:#102c49;color:#eaf5ff;font:inherit;font-size:.75rem;font-weight:900;cursor:pointer}.fpr-actions button[aria-pressed="true"]{background:#4b92db;color:#071321}.fpr-actions button:disabled{opacity:.48;cursor:not-allowed}.fpr-actions button:focus-visible{outline:3px solid #7eb8ee;outline-offset:2px}.fpr-review-badge{display:inline-flex;align-items:center;min-height:24px;margin-top:6px;padding:2px 7px;border:1px solid rgba(126,184,238,.25);border-radius:999px;background:rgba(75,146,219,.12);color:#cfe8ff;font-size:.67rem;font-weight:950}.fpr-review-badge.is-unreviewed{color:#ffd69a;background:rgba(255,181,71,.08);border-color:rgba(255,181,71,.25)}.fprop-row.is-filtered-by-review{display:none!important}.fprop-row.is-review-changed{box-shadow:inset 0 -2px 0 rgba(126,184,238,.45)}
      .fpr-row-detail{grid-column:1/-1;display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:9px 12px;border-top:1px solid rgba(126,184,238,.16);background:rgba(75,146,219,.055)}.fpr-row-detail-lead{margin-right:2px;color:#eaf5ff;font-size:.7rem;letter-spacing:.02em}.fpr-book-state{display:inline-flex;align-items:center;min-height:28px;padding:4px 8px;border:1px solid rgba(126,184,238,.18);border-radius:999px;background:rgba(4,24,43,.66);color:#cfe2f4;font-size:.69rem;font-weight:800;line-height:1.25}.fpr-book-state.is-up{border-color:rgba(126,217,170,.3)}.fpr-book-state.is-down{border-color:rgba(255,181,181,.3)}.fpr-book-state.is-now-reporting,.fpr-book-state.is-not-reporting{border-style:dashed}.fpr-row-mark{min-height:44px;margin-left:auto;border:1px solid rgba(126,184,238,.32);border-radius:10px;padding:0 11px;background:#102c49;color:#eaf5ff;font:inherit;font-size:.7rem;font-weight:900;cursor:pointer}.fpr-row-mark:disabled{opacity:.48;cursor:not-allowed}.fpr-row-mark:focus-visible{outline:3px solid #7eb8ee;outline-offset:2px}.fprop-row>.fpr-before-detail{border-right:0}
      @media(max-width:700px){.fpr-review{grid-template-columns:1fr;align-items:stretch}.fpr-actions{display:grid;grid-template-columns:1fr 1fr}.fpr-actions button{min-height:48px}}
      @media(max-width:620px){.fprop-row>.fpr-before-detail{border-bottom:0}.fpr-row-detail{padding:10px;align-items:stretch}.fpr-row-detail-lead{flex:1 0 100%;font-size:.76rem}.fpr-book-state{flex:1 1 155px;min-height:36px;border-radius:10px;font-size:.73rem}.fpr-row-mark{width:100%;min-height:48px;margin-left:0}}
      @media(max-width:430px){.fpr-actions{grid-template-columns:1fr}.fpr-copy strong{font-size:.9rem}.fpr-copy span{font-size:.79rem}.fpr-book-state{flex-basis:100%}}
      @media(forced-colors:active){.fpr-review,.fpr-actions button,.fpr-review-badge,.fpr-row-detail,.fpr-book-state,.fpr-row-mark{border:1px solid CanvasText}.fprop-row.is-review-changed{outline:1px solid Highlight}}
    `;document.head.append(style);
  }

  function ensureReview(root){
    let panel=root.querySelector('.fpr-review');
    if(!panel){panel=document.createElement('section');panel.className='fpr-review';panel.setAttribute('aria-live','polite');panel.setAttribute('aria-label','Watched prop review checkpoint')}
    const anchor=root.querySelector('.fpw-tools')||root.querySelector('.fpm-movers-lens')||root.querySelector('.fprop-controls');
    if(anchor&&panel.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',panel);
    return panel;
  }

  function markReviewed(root,watchedKeys){
    const store=pruneReview(loadReview(),watchedKeys),stamp=Date.now();
    let captured=0;
    for(const row of root.querySelectorAll('.fprop-row')){
      const identity=rowIdentity(row);if(!identity||!watchedKeys.has(identity.key))continue;
      const books=currentBooks(row);if(!Object.keys(books).length)continue;
      store[identity.key]={reviewedAt:stamp,books};captured++;
    }
    if(captured)saveReview(store);
    decorate();
  }

  function decorate(){
    if(route()!==ROUTE)return;
    const root=document.querySelector(ROOT);if(!root)return;
    observer?.disconnect();
    try{
      injectStyle();
      const watchlist=loadWatchlist(),watchedKeys=new Set(watchlist.map(item=>item.key));
      const loaded=loadReview(),review=pruneReview(loaded,watchedKeys);
      if(!sameStore(loaded,review))saveReview(review);
      const rows=[...root.querySelectorAll('.fprop-row')];
      if(!watchlist.length){
        state.changedOnly=false;
        for(const row of rows){row.classList.remove('is-review-changed','is-filtered-by-review');row.querySelector('.fpr-review-badge')?.remove();row.querySelector(':scope > .fpr-row-detail')?.remove();row.querySelector('.fpr-before-detail')?.classList.remove('fpr-before-detail')}
        root.querySelector('.fpr-review')?.remove();
        return;
      }

      const assessed=[],changed=[],unreviewed=[];
      let boardWatched=0;
      for(const row of rows){
        const identity=rowIdentity(row);if(!identity)continue;
        const watched=watchedKeys.has(identity.key),baseline=watched?review[identity.key]:null,result=watched?compare(row,baseline):null;
        const item={identity,row,watched,baseline,result};assessed.push(item);
        if(!watched)continue;
        boardWatched++;
        if(result.kind==='changed')changed.push(item);
        else if(result.kind==='unreviewed')unreviewed.push(item);
      }
      changed.sort((a,b)=>b.result.score-a.result.score||a.identity.player.localeCompare(b.identity.player));
      if(state.changedOnly&&!changed.length)state.changedOnly=false;

      for(const item of assessed){
        const {row,identity,watched,baseline,result}=item;
        row.classList.toggle('is-review-changed',Boolean(watched&&result?.kind==='changed'));
        row.classList.toggle('is-filtered-by-review',Boolean(state.changedOnly&&(!watched||result?.kind!=='changed')));
        renderRowDetail(row,identity,result,baseline);
        const host=row.querySelector('.fprop-player');if(!host)continue;
        let badge=host.querySelector('.fpr-review-badge');
        if(!watched||result?.kind==='same'){badge?.remove();continue}
        if(!badge){badge=document.createElement('span');badge.className='fpr-review-badge';host.append(badge)}
        badge.className=`fpr-review-badge${result.kind==='unreviewed'?' is-unreviewed':''}`;
        badge.textContent=result.kind==='changed'?'CHANGED SINCE REVIEW':'NEEDS REVIEW CHECKPOINT';
        badge.title=result.kind==='changed'?summaryReason({result}):'This watched prop has not been included in a review checkpoint yet';
      }

      const reviewedTimes=Object.values(review).map(entry=>entry.reviewedAt).filter(Number.isFinite),latest=reviewedTimes.length?Math.max(...reviewedTimes):0;
      const panel=ensureReview(root);
      const highlights=changed.slice(0,3).map(item=>`<span class="fpr-change"><b>${esc(item.identity.player)}</b> · ${esc(item.identity.market)} · ${esc(summaryReason(item))}</span>`).join('');
      const checkpoint=latest?`Latest checkpoint ${formatTime(latest)}.`:'No review checkpoint yet.';
      const detail=`${boardWatched} watched on this board · ${unreviewed.length} without a checkpoint. ${checkpoint} Compares only what this browser sees now with your explicit checkpoint; it does not monitor while closed.`;
      const markup=`<div class="fpr-copy"><strong>${changed.length} watched prop${changed.length===1?'':'s'} on this board changed since review</strong><span>${detail}</span>${highlights?`<div class="fpr-changes">${highlights}</div>`:''}</div><div class="fpr-actions"><button type="button" class="fpr-mark"${boardWatched?'':' disabled'}>Mark board reviewed</button><button type="button" class="fpr-only" aria-pressed="${state.changedOnly?'true':'false'}"${changed.length?'':' disabled'}>${state.changedOnly?'Show all props':'Changed only'}</button></div>`;
      if(panel.dataset.signature!==markup){panel.innerHTML=markup;panel.dataset.signature=markup}
      panel.querySelector('.fpr-mark')?.addEventListener('click',()=>markReviewed(root,watchedKeys),{once:true});
      panel.querySelector('.fpr-only')?.addEventListener('click',()=>{if(!changed.length)return;state.changedOnly=!state.changedOnly;decorate()},{once:true});
    }finally{resumeObserver()}
  }

  const queue=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;decorate()})};
  observer=new MutationObserver(queue);resumeObserver();
  addEventListener('hashchange',()=>{if(route()!==ROUTE)state.changedOnly=false;queue()});
  addEventListener('storage',event=>{if(event.key===WATCH_STORE||event.key===REVIEW_STORE)queue()});
  queue();
  window.TitansFantasyPropReview={loadReview,compare,keyFor,setChangedOnly:value=>{state.changedOnly=Boolean(value);decorate()}};
})();