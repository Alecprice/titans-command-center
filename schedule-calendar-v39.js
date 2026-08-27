(() => {
  'use strict';
  if(window.__TitansScheduleCalendarV39)return;
  window.__TitansScheduleCalendarV39=true;

  const app=document.querySelector('#app');
  const runtime=window.TitansRuntime;
  const OFFICIAL_SCHEDULE='https://www.tennesseetitans.com/schedule/';
  let data=null,loading=null;

  const route=()=>runtime?.route?.()||location.hash.replace(/^#/,'').split('?')[0]||'home';
  const rows=value=>Array.isArray(value)?value:[];
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const ics=value=>String(value??'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const validDate=value=>{const date=new Date(value);return Number.isFinite(date.getTime())?date:null;};
  const exactGame=game=>Boolean(game&&game.status!=='bye'&&!game.dateTbd&&validDate(game.date));

  async function load(force=false){
    if(data&&!force)return data;
    if(loading)return loading;
    loading=Promise.resolve(runtime?.apiJson?.('/api/data',{ttl:30000,force}))
      .then(value=>{data=value?.ok?value:{};return data;})
      .catch(()=>{data={};return data;})
      .finally(()=>{loading=null;queueMicrotask(render);});
    return loading;
  }

  function scheduleFacts(){
    const all=rows(data?.games).filter(game=>game&&game.status!=='bye').slice(0,25);
    const exact=all.filter(exactGame);
    const tbd=all.filter(game=>!exactGame(game));
    const bye=rows(data?.games).filter(game=>game?.status==='bye').length;
    return {all,exact,tbd,bye};
  }

  function eventLines(game,index){
    const start=validDate(game.date);
    if(!start)return [];
    const end=new Date(start.getTime()+4*60*60*1000);
    const opponent=String(game.opponent||game.opponentAbbr||'Opponent TBD').trim();
    const home=game.homeAway==='home';
    const summary=`Tennessee Titans ${home?'vs':'at'} ${opponent}`;
    const description=[game.week?`Week: ${game.week}`:'',game.network?`Broadcast: ${game.network}`:'','Source: Tennessee Titans official schedule'].filter(Boolean).join(' · ');
    const uid=String(game.id||`${start.toISOString()}-${index}`).replace(/[^a-zA-Z0-9._-]/g,'-');
    return [
      'BEGIN:VEVENT',
      `UID:${ics(uid)}@titans-command-center`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${ics(summary)}`,
      `DESCRIPTION:${ics(description)}`,
      `LOCATION:${ics(game.venue||'')}`,
      `URL:${OFFICIAL_SCHEDULE}`,
      'END:VEVENT'
    ];
  }

  function calendarText(games){
    const body=games.flatMap(eventLines);
    return ['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','METHOD:PUBLISH','PRODID:-//Titans Command Center//2026 Schedule//EN','X-WR-CALNAME:Tennessee Titans 2026',...body,'END:VCALENDAR'].join('\r\n');
  }

  function announce(message){
    const toast=document.querySelector('#toast');
    if(!toast)return;
    toast.textContent=message;toast.classList.add('show');
    clearTimeout(announce.timer);announce.timer=setTimeout(()=>toast.classList.remove('show'),2800);
  }

  function downloadCalendar(){
    const {exact,tbd}=scheduleFacts();
    if(!exact.length)return announce('No fixed Titans kickoff times are loaded yet.');
    const blob=new Blob([calendarText(exact)],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='tennessee-titans-2026-schedule.ics';
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
    announce(`Calendar created with ${exact.length} fixed kickoff${exact.length===1?'':'s'}${tbd.length?`; ${tbd.length} TBD game${tbd.length===1?' was':'s were'} left out`:''}.`);
  }

  function injectStyle(){
    if(document.querySelector('#schedule-calendar-v39-style'))return;
    const style=document.createElement('style');
    style.id='schedule-calendar-v39-style';
    style.textContent='.v39-calendar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;margin:0 0 16px;padding:15px 16px;border:1px solid rgba(134,210,255,.22);border-radius:17px;background:linear-gradient(135deg,rgba(7,27,47,.96),rgba(12,44,72,.84))}.v39-calendar small{display:block;color:#9bd8ff;font-size:.68rem;font-weight:950;letter-spacing:.11em}.v39-calendar h2{margin:4px 0;color:#fff;font-size:1.05rem}.v39-calendar p{margin:0;color:#c5d7e5;font-size:.77rem;line-height:1.5}.v39-calendar-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}.v39-calendar button,.v39-calendar a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 13px;border-radius:11px;font:inherit;font-size:.76rem;font-weight:900;text-decoration:none}.v39-calendar button{border:1px solid #86d2ff;background:#4b92db;color:#071421;cursor:pointer}.v39-calendar a{border:1px solid rgba(134,210,255,.24);background:rgba(255,255,255,.045);color:#eaf6ff}.v39-calendar :focus-visible{outline:3px solid #fff;outline-offset:2px}@media(max-width:700px){.v39-calendar{grid-template-columns:1fr}.v39-calendar-actions{justify-content:stretch}.v39-calendar button,.v39-calendar a{flex:1 1 150px}}';
    document.head.appendChild(style);
  }

  function render(){
    if(!app||route()!=='games')return;
    const anchor=app.querySelector('.fan-schedule-tools')||app.querySelector('.page-head');
    if(!anchor)return;
    const facts=scheduleFacts();
    let root=app.querySelector('.v39-calendar');
    if(!root){root=document.createElement('section');root.className='v39-calendar';root.setAttribute('aria-label','Titans schedule calendar export');anchor.insertAdjacentElement('afterend',root);}
    const signature=JSON.stringify([facts.all.length,facts.exact.map(game=>[game.id,game.date,game.dateTbd]),facts.bye]);
    if(root.dataset.signature===signature)return;
    root.dataset.signature=signature;
    const detail=facts.all.length
      ?`${facts.exact.length} loaded game${facts.exact.length===1?' has':'s have'} fixed kickoff times${facts.tbd.length?`; ${facts.tbd.length} TBD game${facts.tbd.length===1?' is':'s are'} intentionally excluded`:''}${facts.bye?` · ${facts.bye} bye week`:''}.`
      :'Schedule data is not available right now.';
    root.innerHTML=`<div><small>2026 SCHEDULE · CALENDAR</small><h2>Add the Titans season to your calendar</h2><p>${esc(detail)} The export uses only loaded fixed kickoff times and does not guess TBD dates or times.</p></div><div class="v39-calendar-actions"><button type="button" data-v39-calendar ${facts.exact.length?'':'disabled'}>Download .ics</button><a href="${OFFICIAL_SCHEDULE}" target="_blank" rel="noopener noreferrer">Official schedule ↗</a></div>`;
  }

  document.addEventListener('click',event=>{
    const button=event.target instanceof Element?event.target.closest('[data-v39-calendar]'):null;
    if(button&&!button.disabled)downloadCalendar();
  });
  if(runtime){runtime.onRoute(()=>{if(route()==='games'&&!data&&!loading)load();queueMicrotask(render);},{immediate:true});runtime.onAppRender(()=>{if(route()==='games'&&!data&&!loading)load();queueMicrotask(render);},{immediate:true});runtime.onRefresh(()=>{data=null;if(route()==='games')load(true);});}
  else{addEventListener('hashchange',()=>{if(route()==='games')load();});if(route()==='games')load();}
  injectStyle();
})();
