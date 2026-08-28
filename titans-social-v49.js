(() => {
  'use strict';
  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  const DEFAULT_LINKS=[
    {label:'#TitanUp',url:'https://x.com/search?q=%23TitanUp&src=typed_query&f=live'},
    {label:'#TitansNation',url:'https://x.com/search?q=%23TitansNation&src=typed_query&f=live'},
    {label:'Titans Nation',url:'https://x.com/search?q=%22Titans%20Nation%22&src=typed_query&f=live'},
    {label:'Tennessee Titans',url:'https://x.com/search?q=%22Tennessee%20Titans%22&src=typed_query&f=live'},
  ];
  const state={payload:null,loading:null};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const route=()=>runtime.route();
  const safeX=value=>{try{const url=new URL(String(value||''));const host=url.hostname.toLowerCase();return url.protocol==='https:'&&(host==='x.com'||host.endsWith('.x.com')||host==='t.co'||host==='pbs.twimg.com'||host.endsWith('.twimg.com'))?url.href:'#'}catch{return'#'}};
  const profileUrl=username=>`https://x.com/${encodeURIComponent(String(username||'').replace(/[^A-Za-z0-9_]/g,''))}`;
  function relativeTime(value){
    const stamp=Date.parse(value);if(!Number.isFinite(stamp))return'Recent';
    const seconds=Math.max(0,Math.round((Date.now()-stamp)/1000));
    if(seconds<60)return'Just now';if(seconds<3600)return`${Math.floor(seconds/60)}m`;if(seconds<86400)return`${Math.floor(seconds/3600)}h`;return`${Math.floor(seconds/86400)}d`;
  }
  function entityHref(entity){
    if(entity?.type==='hashtag'&&entity.tag)return`https://x.com/hashtag/${encodeURIComponent(entity.tag)}`;
    if(entity?.type==='mention'&&entity.username)return profileUrl(entity.username);
    if(entity?.type==='url')return safeX(entity.url||entity.expandedUrl);
    return'#';
  }
  function linkedText(post){
    const chars=Array.from(String(post?.text||''));
    const entities=(Array.isArray(post?.entities)?post.entities:[]).filter(entity=>Number.isInteger(entity?.start)&&Number.isInteger(entity?.end)&&entity.start>=0&&entity.end<=chars.length&&entity.end>entity.start).sort((a,b)=>a.start-b.start||a.end-b.end);
    let cursor=0,html='';
    for(const entity of entities){
      if(entity.start<cursor)continue;
      html+=esc(chars.slice(cursor,entity.start).join(''));
      const original=chars.slice(entity.start,entity.end).join('');
      const label=entity.type==='url'&&entity.displayUrl?entity.displayUrl:original;
      const href=entityHref(entity);
      html+=href==='#'?esc(label):`<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
      cursor=entity.end;
    }
    html+=esc(chars.slice(cursor).join(''));
    return html;
  }
  function postCard(post){
    const user=post?.author||{};
    const postUrl=safeX(post?.url);
    const userUrl=profileUrl(user.username);
    const avatar=safeX(user.profileImageUrl);
    return `<article class="social-post-v49">
      <header>
        <a class="social-author-v49" href="${esc(userUrl)}" target="_blank" rel="noopener noreferrer">${avatar!=='#'?`<img src="${esc(avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:'<span class="social-avatar-fallback-v49" aria-hidden="true">T</span>'}<span><strong>${esc(user.name||user.username)}</strong><small>@${esc(user.username)}</small></span></a>
        <a class="social-x-mark-v49" href="${esc(postUrl)}" target="_blank" rel="noopener noreferrer" aria-label="View this post on X">𝕏</a>
      </header>
      <div class="social-post-text-v49">${linkedText(post)}</div>
      <footer><a href="${esc(postUrl)}" target="_blank" rel="noopener noreferrer"><time datetime="${esc(post.createdAt)}">${esc(relativeTime(post.createdAt))}</time> · View on X</a></footer>
    </article>`;
  }
  function searchLinks(payload){
    const links=Array.isArray(payload?.searchLinks)&&payload.searchLinks.length?payload.searchLinks:DEFAULT_LINKS;
    return links.map(link=>`<a href="${esc(safeX(link.url))}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join('');
  }
  function sectionBody(){
    if(state.payload?.available&&Array.isArray(state.payload.posts)&&state.payload.posts.length)return `<div class="social-post-grid-v49">${state.payload.posts.slice(0,6).map(postCard).join('')}</div>`;
    if(state.loading&&!state.payload)return'<div class="social-pulse-loading-v49" role="status"><span></span><strong>Checking Titans Nation on X…</strong></div>';
    return `<div class="social-pulse-fallback-v49"><strong>${esc(state.payload?.configured?'X pulse temporarily unavailable':'Live X feed is ready to connect')}</strong><p>${esc(state.payload?.message||'Open a live Titans-branded search now, or connect an X API bearer token to surface recent public posts directly in this section.')}</p></div>`;
  }
  function render(){
    if(route()!=='home')return;
    let section=app.querySelector('[data-titans-social-pulse]');
    if(!section){section=document.createElement('section');section.className='titans-social-pulse-v49';section.dataset.titansSocialPulse='1';app.append(section);}
    section.innerHTML=`<header class="social-pulse-head-v49"><div><div class="eyebrow">TITANS SOCIAL PULSE · X</div><h2>What Titans Nation is saying</h2><p>Recent public posts matching #TitanUp, #TitansNation, “Titans Nation,” and Tennessee Titans. Fan posts are shown as public conversation, not endorsements.</p></div><a class="social-open-x-v49" href="https://x.com/search?q=%23TitanUp&src=typed_query&f=live" target="_blank" rel="noopener noreferrer">Open live X search ↗</a></header><div class="social-search-chips-v49" aria-label="Titans X searches">${searchLinks(state.payload)}</div>${sectionBody()}<footer class="social-pulse-note-v49"><span>Source: X recent public search · cached to keep Home fast and API usage low.</span><button type="button" data-social-refresh>Refresh pulse</button></footer>`;
  }
  async function load(force=false){
    if(state.loading&&!force)return state.loading;
    state.loading=runtime.apiJson('/api/social-pulse',{ttl:15*60*1000,force}).then(payload=>{if(payload)state.payload=payload;render();return payload;}).finally(()=>{state.loading=null;});
    render();
    return state.loading;
  }
  function reconcile(){if(route()!=='home')return;render();load(false);}
  app.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest('[data-social-refresh]'):null;
    if(!button||route()!=='home')return;
    button.disabled=true;
    load(true).finally(()=>{if(button.isConnected)button.disabled=false;});
  });
  runtime.onRoute(()=>queueMicrotask(reconcile),{immediate:true});
  runtime.onAppRender(()=>queueMicrotask(()=>{if(route()==='home'&&!app.querySelector('[data-titans-social-pulse]'))reconcile();}),{immediate:true});
})();
