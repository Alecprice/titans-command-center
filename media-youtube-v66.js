(() => {
  'use strict';
  if(window.__titansOfficialYouTubeV66)return;
  window.__titansOfficialYouTubeV66=true;

  const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeId=value=>/^[A-Za-z0-9_-]{11}$/.test(String(value||''))?String(value):'';
  const safeHttps=value=>{try{const url=new URL(String(value||''));return url.protocol==='https:'?url.href:'#'}catch{return'#'}};
  const fmt=value=>{const date=new Date(value);return Number.isNaN(date.getTime())?'Recently published':new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(date)};
  const state={data:null,promise:null,playerApi:null,players:new Map()};

  async function loadFeed(){
    if(state.data)return state.data;
    if(state.promise)return state.promise;
    state.promise=fetch('/api/media-videos',{cache:'no-store',headers:{Accept:'application/json'}})
      .then(async response=>response.ok?response.json():null)
      .catch(()=>null)
      .then(data=>{state.data=data?.ok?data:null;return state.data})
      .finally(()=>state.promise=null);
    return state.promise;
  }

  function loadIframeApi(){
    if(window.YT?.Player)return Promise.resolve(window.YT);
    if(state.playerApi)return state.playerApi;
    state.playerApi=new Promise((resolve,reject)=>{
      const prior=window.onYouTubeIframeAPIReady;
      let settled=false;
      const finish=()=>{if(settled)return;settled=true;resolve(window.YT)};
      window.onYouTubeIframeAPIReady=()=>{try{if(typeof prior==='function')prior()}finally{finish()}};
      const existing=document.querySelector('script[data-titans-youtube-iframe-api]');
      if(existing){const timer=setInterval(()=>{if(window.YT?.Player){clearInterval(timer);finish()}},50);setTimeout(()=>{clearInterval(timer);if(!settled)reject(new Error('YouTube IFrame API timed out'))},8000);return;}
      const script=document.createElement('script');
      script.src='https://www.youtube.com/iframe_api';
      script.async=true;
      script.dataset.titansYoutubeIframeApi='true';
      script.onerror=()=>reject(new Error('YouTube IFrame API failed to load'));
      document.head.appendChild(script);
      setTimeout(()=>{if(!settled&&!window.YT?.Player)reject(new Error('YouTube IFrame API timed out'))},8000);
    }).catch(error=>{state.playerApi=null;throw error});
    return state.playerApi;
  }

  function fallbackPlayer(host,video,message){
    host.innerHTML=`<div class="media-youtube-unavailable"><strong>Embedding is unavailable here.</strong><span>${esc(message||'The rights holder or YouTube can change embed permission at any time.')}</span><a href="${safeHttps(video.watchUrl)}" target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a></div>`;
  }

  async function play(button){
    const card=button.closest('[data-youtube-video]');
    const id=safeId(card?.dataset.youtubeVideo);
    const video=state.data?.videos?.find(item=>item.id===id);
    const host=card?.querySelector('[data-youtube-player]');
    if(!id||!video||!host)return;
    button.disabled=true;
    button.textContent='Loading player…';
    host.hidden=false;
    host.innerHTML='<div class="media-youtube-loading" role="status">Loading official YouTube player…</div>';
    try{
      const YT=await loadIframeApi();
      if(!YT?.Player)throw new Error('YouTube player API unavailable');
      host.innerHTML='<div class="media-youtube-player-target"></div>';
      const target=host.firstElementChild;
      const player=new YT.Player(target,{
        width:'100%',height:'100%',videoId:id,
        playerVars:{autoplay:0,playsinline:1,rel:0,origin:location.origin},
        events:{
          onReady:event=>event.target.playVideo(),
          onError:event=>fallbackPlayer(host,video,`YouTube player error ${event?.data??'unknown'}. Open the official video directly instead.`)
        }
      });
      state.players.set(id,player);
    }catch(error){
      fallbackPlayer(host,video,error instanceof Error?error.message:'YouTube player unavailable');
    }finally{
      button.hidden=true;
    }
  }

  function card(video){
    const id=safeId(video?.id);if(!id)return'';
    return `<article class="media-youtube-card" data-youtube-video="${esc(id)}"><div class="media-youtube-thumb"><img src="${safeHttps(video.thumbnail)}" alt="" loading="lazy" decoding="async" referrerpolicy="strict-origin-when-cross-origin"><button type="button" data-youtube-play aria-label="Play ${esc(video.title)}"><span aria-hidden="true">▶</span> Play</button></div><div class="media-youtube-copy"><small>${esc(video.source)} · ${esc(fmt(video.publishedAt))}</small><h3>${esc(video.title)}</h3><p>${esc(video.description||'Official video from the rights holder.')}</p><div class="media-youtube-actions"><a href="${safeHttps(video.watchUrl)}" target="_blank" rel="noopener noreferrer">YouTube ↗</a><a href="${safeHttps(video.channelUrl)}" target="_blank" rel="noopener noreferrer">${esc(video.source)} channel ↗</a></div></div><div class="media-youtube-player" data-youtube-player hidden></div></article>`;
  }

  function section(data){
    const videos=Array.isArray(data?.videos)?data.videos:[];
    if(!data?.configured||!videos.length)return null;
    const element=document.createElement('section');
    element.className='media-youtube';
    element.dataset.youtubeOfficialShelf='true';
    element.innerHTML=`<header><div><small>OFFICIAL VIDEO</small><h2>Titans / NFL video shelf</h2><p>Recent official uploads that YouTube currently marks public and embeddable. Live and upcoming broadcasts are excluded.</p></div><span class="media-youtube-trust">Rights-holder uploads only</span></header><div class="media-youtube-grid">${videos.slice(0,6).map(card).join('')}</div><p class="media-rights-note"><strong>No live-game stream is sourced or proxied here.</strong> Playback uses YouTube's IFrame Player API only after you press Play, and an embed can stop working later if the rights holder changes permission.</p>`;
    element.addEventListener('click',event=>{const button=event.target.closest('[data-youtube-play]');if(button)play(button)});
    return element;
  }

  async function mount(){
    if(route()!=='media')return;
    const page=document.querySelector('.media-page');
    if(!page||page.querySelector('[data-youtube-official-shelf]'))return;
    const data=await loadFeed();
    if(route()!=='media'||!document.contains(page))return;
    const shelf=section(data);
    if(!shelf)return;
    const future=page.querySelector('.media-future');
    if(future)future.before(shelf);else page.appendChild(shelf);
  }

  const observer=new MutationObserver(()=>mount());
  observer.observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('hashchange',()=>mount());
  mount();
})();
