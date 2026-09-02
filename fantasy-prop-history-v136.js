(() => {
  'use strict';
  const ROUTE='fantasy',ROOT='#fantasy-live-props-v122',STORE='titans-fantasy-prop-observations-v1',MAX_POINTS=8;
  const app=document.querySelector('#app');
  const state={selection:null,opener:null};
  let observer=null,queued=false;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const clean=value=>String(value??'').trim();
  const esc=value=>clean(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const slug=value=>clean(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const observationKey=(player,market,book)=>`${slug(player)}|${slug(market)}|${slug(book)}`;
  const resumeObserver=()=>{if(observer&&app)observer.observe(app,{childList:true,subtree:true})};

  function loadStore(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORE)||'{}');
      return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
    }catch{return {}}
  }

  function pointsFor(store,player,market,book){
    const raw=store[observationKey(player,market,book)];
    if(!Array.isArray(raw))return [];
    return raw.filter(point=>Number.isFinite(Number(point?.line))&&Number.isFinite(Number(point?.at))&&Number(point.at)>0)
      .map(point=>({line:Number(point.line),at:Number(point.at)}))
      .sort((a,b)=>a.at-b.at)
      .slice(-MAX_POINTS);
  }

  const formatLine=value=>Number(value).toLocaleString(undefined,{maximumFractionDigits:2});
  const formatTime=value=>new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
  const iso=value=>{try{return new Date(value).toISOString()}catch{return ''}};
  const deltaLabel=delta=>{
    if(delta==null)return 'First saved';
    if(delta===0)return 'No change';
    return `${delta>0?'↑ +':'↓ '}${Math.abs(delta).toLocaleString(undefined,{maximumFractionDigits:2})}`;
  };

  function enrich(points){
    return points.map((point,index)=>({
      ...point,
      delta:index?Number((point.line-points[index-1].line).toFixed(2)):null,
      latest:index===points.length-1
    }));
  }

  function bookMarkup(book,points){
    const enriched=enrich(points);
    if(!enriched.length)return `<section class="fph-book"><div class="fph-book-head"><strong>${esc(book)}</strong><span>0 saved</span></div><p class="fph-empty">No saved observations for this sportsbook yet.</p></section>`;
    const newestFirst=[...enriched].reverse();
    return `<section class="fph-book"><div class="fph-book-head"><strong>${esc(book)}</strong><span>${enriched.length} saved</span></div><ol class="fph-points">${newestFirst.map(point=>`<li${point.latest?' class="is-latest"':''}><div><b>${esc(formatLine(point.line))}</b><span class="fph-delta ${point.delta>0?'is-up':point.delta<0?'is-down':'is-flat'}">${esc(deltaLabel(point.delta))}</span></div><time datetime="${esc(iso(point.at))}">${esc(formatTime(point.at))}${point.latest?' · latest':''}</time></li>`).join('')}</ol></section>`;
  }

  function injectStyle(){
    if(document.querySelector('style[data-fantasy-prop-history-v136]'))return;
    const style=document.createElement('style');style.dataset.fantasyPropHistoryV136='true';style.textContent=`
      .fph-history-button{align-self:flex-start;min-height:44px;margin-top:7px;border:1px solid rgba(126,184,238,.28);border-radius:10px;padding:0 10px;background:rgba(16,44,73,.88);color:#dceeff;font:inherit;font-size:.7rem;font-weight:900;cursor:pointer}.fph-history-button:hover{background:#183b60}.fph-history-button:focus-visible,.fph-close:focus-visible{outline:3px solid #7eb8ee;outline-offset:2px}
      .fph-history-sheet{position:fixed;inset:auto 0 12px 0;width:min(760px,calc(100% - 24px));max-width:none;max-height:min(78vh,720px);margin:auto;padding:0;border:1px solid rgba(126,184,238,.28);border-radius:18px;background:#091b2c;color:#edf6ff;box-shadow:0 24px 80px rgba(0,0,0,.55);overflow:auto}.fph-history-sheet::backdrop{background:rgba(2,10,18,.72);backdrop-filter:blur(3px)}
      .fph-sheet-head{position:sticky;top:0;z-index:2;display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:16px;border-bottom:1px solid rgba(126,184,238,.18);background:rgba(9,27,44,.96)}.fph-sheet-head h3{margin:0;font-size:1.05rem}.fph-sheet-head p{margin:4px 0 0;color:#9db1c5;font-size:.78rem;line-height:1.4}.fph-close{flex:none;min-height:44px;border:1px solid rgba(126,184,238,.3);border-radius:10px;padding:0 13px;background:#102c49;color:#eaf5ff;font:inherit;font-size:.78rem;font-weight:900;cursor:pointer}.fph-close:hover{background:#183b60}
      .fph-truth{margin:14px 16px 0;padding:11px 12px;border:1px solid rgba(75,146,219,.2);border-radius:12px;background:rgba(75,146,219,.08);color:#bad3e9;font-size:.76rem;line-height:1.45}.fph-books{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:14px 16px 18px}.fph-book{min-width:0;padding:12px;border:1px solid rgba(126,184,238,.15);border-radius:14px;background:rgba(255,255,255,.025)}.fph-book-head{display:flex;justify-content:space-between;gap:8px;align-items:center;padding-bottom:9px;border-bottom:1px solid rgba(126,184,238,.12)}.fph-book-head strong{font-size:.82rem}.fph-book-head span{color:#829bb1;font-size:.68rem;font-weight:800}.fph-points{display:grid;gap:7px;margin:10px 0 0;padding:0;list-style:none}.fph-points li{display:grid;gap:3px;padding:8px 9px;border-radius:10px;background:rgba(255,255,255,.025)}.fph-points li.is-latest{outline:1px solid rgba(126,184,238,.2);background:rgba(75,146,219,.08)}.fph-points li>div{display:flex;align-items:center;justify-content:space-between;gap:8px}.fph-points b{font-size:.85rem}.fph-points time{color:#8fa7bc;font-size:.68rem}.fph-delta{font-size:.67rem;font-weight:950}.fph-delta.is-up{color:#9ed8af}.fph-delta.is-down{color:#ffb2b8}.fph-delta.is-flat{color:#9db1c5}.fph-empty{margin:10px 0 0;color:#8fa7bc;font-size:.73rem;line-height:1.4}
      @media(max-width:700px){.fph-books{grid-template-columns:1fr}.fph-history-sheet{inset:auto 0 0 0;width:100%;max-height:88dvh;margin:0;border-radius:18px 18px 0 0}.fph-history-button,.fph-close{min-height:48px}.fph-sheet-head{padding:14px}.fph-truth{margin:12px 14px 0}.fph-books{padding:12px 14px 18px}}
      @media(forced-colors:active){.fph-history-button,.fph-history-sheet,.fph-close,.fph-book,.fph-truth{border:1px solid CanvasText}}
    `;document.head.append(style);
  }

  function ensureDialog(){
    let dialog=document.querySelector('.fph-history-sheet');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');dialog.className='fph-history-sheet';dialog.setAttribute('aria-labelledby','fph-history-title');
    dialog.addEventListener('close',()=>{const opener=state.opener;state.opener=null;if(opener?.isConnected)opener.focus({preventScroll:true})});
    dialog.addEventListener('cancel',()=>{state.selection=null});
    document.body.append(dialog);
    return dialog;
  }

  function closeDialog(){
    const dialog=document.querySelector('.fph-history-sheet');if(!dialog)return;
    state.selection=null;
    if(typeof dialog.close==='function'&&dialog.open)dialog.close();
    else{dialog.removeAttribute('open');const opener=state.opener;state.opener=null;if(opener?.isConnected)opener.focus({preventScroll:true})}
  }

  function renderDialog(){
    const selected=state.selection,dialog=ensureDialog();
    if(!selected)return;
    const store=loadStore();
    const books=selected.books.map(book=>({book,points:pointsFor(store,selected.player,selected.market,book)}));
    const total=books.reduce((sum,item)=>sum+item.points.length,0);
    dialog.innerHTML=`<div class="fph-sheet-head"><div><h3 id="fph-history-title">${esc(selected.player)} · ${esc(selected.market)}</h3><p>${total} saved observation${total===1?'':'s'} across ${books.length} sportsbook${books.length===1?'':'s'} on this browser.</p></div><button type="button" class="fph-close" aria-label="Close observed history">Close</button></div><p class="fph-truth">Saved on this browser only. Up to 8 observations are retained per sportsbook. Gaps mean this browser did not observe intermediate line changes; this is not complete sportsbook market history.</p><div class="fph-books">${books.map(item=>bookMarkup(item.book,item.points)).join('')}</div>`;
    dialog.querySelector('.fph-close')?.addEventListener('click',closeDialog,{once:true});
  }

  function openHistory(row,button){
    const player=clean(row.querySelector('.fprop-player strong')?.textContent),market=clean(row.querySelector('.fprop-player span')?.textContent);
    const books=[...row.querySelectorAll('.fprop-quote > strong')].map(node=>clean(node.textContent)).filter(Boolean);
    if(!player||!market||!books.length)return;
    state.selection={player,market,books:[...new Set(books)]};state.opener=button;
    const dialog=ensureDialog();renderDialog();
    if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal()}
    else dialog.setAttribute('open','');
  }

  function decorate(){
    if(route()!==ROUTE){closeDialog();return}
    const root=document.querySelector(ROOT);if(!root)return;
    observer?.disconnect();
    try{
      injectStyle();
      for(const row of root.querySelectorAll('.fprop-row')){
        const host=row.querySelector('.fprop-player');if(!host)continue;
        const player=clean(host.querySelector('strong')?.textContent),market=clean(host.querySelector('span')?.textContent);
        if(!player||!market)continue;
        let button=host.querySelector('.fph-history-button');
        if(!button){
          button=document.createElement('button');button.type='button';button.className='fph-history-button';button.textContent='Observed history';host.append(button);
          button.addEventListener('click',()=>openHistory(row,button));
        }
        button.setAttribute('aria-label',`Open browser-observed history for ${player} ${market}`);
      }
      if(state.selection&&document.querySelector('.fph-history-sheet')?.open)renderDialog();
    }finally{resumeObserver()}
  }

  const queue=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;decorate()})};
  observer=new MutationObserver(queue);resumeObserver();
  addEventListener('hashchange',queue);
  addEventListener('keydown',event=>{if(event.key==='Escape'&&document.querySelector('.fph-history-sheet[open]')&&typeof document.querySelector('.fph-history-sheet')?.close!=='function')closeDialog()});
  queue();
  window.TitansFantasyPropHistory={pointsFor,observationKey,enrich,open:openHistory};
})();
