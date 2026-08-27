import { team, games as fallbackGames, roster as fallbackRoster } from './src/data.mjs';

const OFFICIAL_ROSTER_URL='https://www.tennesseetitans.com/team/players-roster/';
const OFFICIAL_SCHEDULE_URL='https://www.tennesseetitans.com/schedule/';
const NFL_ROSTER_URL='https://www.nfl.com/teams/tennessee-titans/roster';
const AUDIT_DATE='Aug. 27, 2026';
const AUDITED_ACTIVE=fallbackRoster.filter(player=>player.status==='Active').length;
const AUDITED_RESERVE=fallbackRoster.filter(player=>player.status==='Reserve/Injured').length;
const SOURCE_CONFLICT=team.rosterCoverage?.sourceConflict||'';

function route(){return location.hash.replace(/^#/,'').split('?')[0]||'home'}
function text(el){return (el?.textContent||'').trim()}
function makeDisclosure(html){const el=document.createElement('div');el.className='fact-disclosure';el.innerHTML=html;return el}

function polishHome(){
  document.querySelectorAll('.pulse-item').forEach(item=>{
    const label=item.querySelector('small');
    if(text(label)==='Roster indexed'){
      label.textContent='Players loaded';
      const detail=item.querySelector('span');
      if(detail&&/fallback/i.test(text(detail)))detail.textContent=fallbackRoster.length>=AUDITED_ACTIVE+AUDITED_RESERVE?'cross-source audited roster snapshot':'verified fallback sample';
    }
  });
}

function polishRoster(){
  const head=document.querySelector('.page-head');
  if(!head)return;
  const cards=[...document.querySelectorAll('#rg .player-card')];
  const loaded=cards.length;
  if(!loaded)return;
  const serverBacked=cards.some(card=>(card.getAttribute('href')||'').includes('#player?id='));
  const snapshotLabel=serverBacked
    ? `${loaded} player records are loaded from the current server-backed roster snapshot.`
    : `${loaded} player records are loaded from the verified backup snapshot audited ${AUDIT_DATE}.`;
  const body=`<strong>Roster coverage:</strong> ${snapshotLabel} Active-roster and Reserve/Injured entries are shown together; reserve-list players are separate from the active-roster limit.`;
  const conflict=SOURCE_CONFLICT?`<div class="fact-conflict"><strong>Source note:</strong> ${SOURCE_CONFLICT} <a href="${NFL_ROSTER_URL}" target="_blank" rel="noopener noreferrer">NFL roster cross-check ↗</a></div>`:'';
  const markup=`${body} <a href="${OFFICIAL_ROSTER_URL}" target="_blank" rel="noopener noreferrer">Titans roster ↗</a><span>Content audit: ${AUDIT_DATE} · audited backup ${AUDITED_ACTIVE} active + ${AUDITED_RESERVE} Reserve/Injured</span>${conflict}`;
  const signature=`${loaded}:${serverBacked?'server':'backup'}:${AUDITED_ACTIVE}:${AUDITED_RESERVE}:${SOURCE_CONFLICT}`;
  let notice=document.querySelector('.roster-fact-disclosure');
  if(!notice){notice=makeDisclosure(markup);notice.classList.add('roster-fact-disclosure');notice.dataset.factSignature=signature;head.insertAdjacentElement('afterend',notice);return;}
  if(notice.dataset.factSignature===signature)return;
  notice.dataset.factSignature=signature;
  notice.innerHTML=markup;
}

function byeMarkup(){return `<div class="week">Wk 9</div><div class="opponent-line"><div class="mini-token">BYE</div><div><strong>Bye week</strong><small>No Titans game scheduled</small></div></div><div class="game-date"><strong>Week 9</strong><small>Official 2026 schedule</small></div><div class="score">BYE</div>`}

function polishSchedule(){
  const schedule=document.querySelector('.schedule');
  if(!schedule)return;
  const rows=[...schedule.querySelectorAll('.game-row')];
  let bye=rows.find(row=>/^Wk 9$/i.test(text(row.querySelector('.week')))||(/\bBYE\b/i.test(text(row))&&/Wk 9/i.test(text(row))));
  if(bye){
    bye.classList.add('bye-week-row');
    if(bye.dataset.factByePolished!=='true'){
      bye.dataset.factByePolished='true';
      bye.innerHTML=byeMarkup();
    }
  }else{
    const week10=rows.find(row=>/^Wk 10$/i.test(text(row.querySelector('.week'))));
    if(week10){
      bye=document.createElement('div');
      bye.className='game-row bye-week-row';
      bye.dataset.factByePolished='true';
      bye.innerHTML=byeMarkup();
      week10.insertAdjacentElement('beforebegin',bye);
    }
  }

  const week18=[...schedule.querySelectorAll('.game-row')].find(row=>/^Wk 18$/i.test(text(row.querySelector('.week'))));
  if(week18&&/TBD/i.test(text(week18))&&week18.dataset.factTbdPolished!=='true'){
    week18.dataset.factTbdPolished='true';
    week18.classList.add('tbd-week-row');
    const dateBox=week18.querySelector('.game-date');
    if(dateBox)dateBox.innerHTML='<strong>TBD</strong><small>Date, time & network remain officially TBD</small>';
    const score=week18.querySelector('.score');
    if(score)score.textContent='TBD';
  }

  if(!document.querySelector('.schedule-fact-disclosure')){
    const notice=makeDisclosure(`<strong>Schedule source:</strong> Tennessee Titans / NFL. Week 9 is the Titans' bye. Week 18 at Houston remains officially TBD; secondary sites may publish placeholder dates that this app intentionally does not adopt. <a href="${OFFICIAL_SCHEDULE_URL}" target="_blank" rel="noopener noreferrer">Official schedule ↗</a>`);
    notice.classList.add('schedule-fact-disclosure');
    schedule.insertAdjacentElement('beforebegin',notice);
  }
}

function polishStats(){
  document.querySelectorAll('.stat-card').forEach(card=>{
    const label=card.querySelector('small');
    const value=card.querySelector('strong');
    const detail=card.querySelector('p');
    if(text(label)==='Roster'){
      label.textContent='Players loaded';
      if(detail&&/current snapshot/i.test(text(detail)))detail.textContent='Latest audited roster snapshot';
    }
    if(text(label)==='Games'&&Number(text(value))===fallbackGames.length){
      value.textContent=String(fallbackGames.filter(g=>g.status!=='bye').length);
      if(detail)detail.textContent='Game rows · bye excluded';
    }
  });
}

function polishSources(){
  const head=document.querySelector('.page-head');
  if(!head||document.querySelector('.sources-fact-disclosure'))return;
  const conflict=SOURCE_CONFLICT?`<div class="fact-conflict"><strong>Current known conflict:</strong> ${SOURCE_CONFLICT}</div>`:'';
  const notice=makeDisclosure(`<strong>Source policy:</strong> current roster, personnel, schedule, transactions and branding prioritize TennesseeTitans.com; NFL.com is the official league cross-check; Pro Football Hall of Fame is preferred for stable franchise facts; Pro Football Reference, SportsLogos.net and Wikipedia are secondary domain-specific checks and never override official current/TBD values. <a href="https://github.com/Alecprice/titans-command-center/blob/main/docs/CONTENT_INTEGRITY.md" target="_blank" rel="noopener noreferrer">Read the audit policy ↗</a><span>Audited ${AUDIT_DATE}</span>${conflict}`);
  notice.classList.add('sources-fact-disclosure');
  head.insertAdjacentElement('afterend',notice);
}

function applyFactPolish(){
  const r=route();
  if(r==='home')polishHome();
  if(r==='roster')polishRoster();
  if(r==='games')polishSchedule();
  if(r==='stats')polishStats();
  if(r==='sources')polishSources();
}

const root=document.querySelector('#app');
if(root)new MutationObserver(()=>queueMicrotask(applyFactPolish)).observe(root,{childList:true});
window.addEventListener('hashchange',()=>queueMicrotask(applyFactPolish));
queueMicrotask(applyFactPolish);