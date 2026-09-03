import {
  auditedPracticeSquad20260902,
  PRACTICE_SQUAD_SOURCE_URL,
  ROSTER_AUDIT_DATE
} from './src/roster-audit-20260831.mjs';

const NFL_ROSTER_RULES_SOURCE_URL='https://operations.nfl.com/calendar-events/nfl-free-agency/contract-language';
const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>String(v||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();

function ensureStyles(){
  if(document.querySelector('#roster-practice-squad-v0-styles'))return;
  const style=document.createElement('style');
  style.id='roster-practice-squad-v0-styles';
  style.textContent=`
    .roster-group-summary{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:12px 0 10px;padding:12px 14px;border-left:4px solid var(--titans-blue,#4B92DB);background:#fff;box-shadow:0 6px 18px rgba(12,35,64,.06)}
    .roster-group-summary strong{display:block;color:var(--titans-navy,#0C2340);font-size:12px;text-transform:uppercase;letter-spacing:.06em}.roster-group-summary span{display:block;margin-top:3px;color:var(--muted,#5D7187);font-size:11px;line-height:1.45}.roster-group-summary a{flex:0 0 auto;min-height:44px;display:inline-flex;align-items:center;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--titans-navy,#0C2340);text-decoration:underline;text-underline-offset:3px}
    .roster-eligibility-guide{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:start;margin:0 0 16px;padding:14px;border:1px solid rgba(75,146,219,.28);border-radius:14px;background:rgba(75,146,219,.07)}
    .roster-eligibility-guide strong{display:block;color:var(--titans-navy,#0C2340);font-size:12px;text-transform:uppercase;letter-spacing:.06em}.roster-eligibility-guide p{margin:5px 0 0;color:var(--muted,#5D7187);font-size:11px;line-height:1.55}.roster-eligibility-guide b{color:var(--titans-navy,#0C2340)}.roster-eligibility-guide a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 12px;border:1px solid rgba(12,35,64,.18);border-radius:999px;color:var(--titans-navy,#0C2340);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;text-decoration:none}.roster-eligibility-guide a:focus-visible,.roster-group-summary a:focus-visible{outline:3px solid var(--titans-blue,#4B92DB);outline-offset:2px}
    #roster-group{min-width:170px}
    .practice-squad-grid{margin-top:14px}.practice-squad-grid[hidden]{display:none!important}
    .practice-squad-card{display:grid;grid-template-columns:54px minmax(0,1fr) auto;gap:12px;align-items:center;padding:13px 14px;background:#fff;border:1px solid rgba(12,35,64,.1);box-shadow:0 6px 18px rgba(12,35,64,.05)}
    .practice-squad-card .jersey{display:grid;place-items:center;min-height:48px}.practice-squad-card h3{margin:0;color:var(--titans-navy,#0C2340);font-size:15px}.practice-squad-card p{margin:3px 0 0;color:var(--muted,#5D7187);font-size:11px}.practice-squad-card .player-tag{white-space:nowrap}
    .practice-squad-empty{grid-column:1/-1}
    @media(max-width:620px){.roster-group-summary,.roster-eligibility-guide{align-items:flex-start;grid-template-columns:1fr}.roster-group-summary{flex-direction:column}.roster-eligibility-guide a{min-height:48px;width:100%;box-sizing:border-box}.practice-squad-card{grid-template-columns:48px minmax(0,1fr)}.practice-squad-card .player-tag{grid-column:2;justify-self:start}.filterbar #roster-group{width:100%;min-height:44px}}
    @media(forced-colors:active){.roster-eligibility-guide{border-color:CanvasText}.roster-eligibility-guide a,.roster-group-summary a{color:LinkText;border-color:LinkText}}
  `;
  document.head.appendChild(style);
}

function practiceCard(player){
  const tag=String(player.status||'').includes('International')?'Practice Squad · International':'Practice Squad';
  return `<article class="practice-squad-card" data-practice-squad-player="${esc(player.name)}"><div class="jersey" aria-label="Jersey number ${esc(player.number||'not listed')}">${esc(player.number||'—')}</div><div><h3>${esc(player.name)}</h3><p>${esc(player.position)} · ${esc(player.unit||'')}</p></div><span class="player-tag">${esc(tag)}</span></article>`;
}

function enhanceRoster(){
  if(route()!=='roster')return;
  const root=document.querySelector('#app'),filterbar=root?.querySelector('.filterbar'),mainGrid=root?.querySelector('#rg');
  if(!root||!filterbar||!mainGrid||root.querySelector('[data-practice-squad-enhanced]'))return;
  ensureStyles();

  const group=document.createElement('select');
  group.id='roster-group';
  group.setAttribute('aria-label','Filter roster by roster group');
  group.innerHTML='<option value="main">Active + Reserve</option><option value="practice">Practice Squad</option><option value="all">All current groups</option>';
  filterbar.appendChild(group);

  const summary=document.createElement('div');
  summary.className='roster-group-summary';
  summary.dataset.practiceSquadEnhanced='true';
  summary.innerHTML=`<div><strong>Current roster groups · audited ${esc(ROSTER_AUDIT_DATE)}</strong><span>53 Active · 7 Reserve · ${auditedPracticeSquad20260902.length} Practice Squad. Latest dated official transactions control practice-squad membership when the roster table lags.</span></div><a href="${esc(PRACTICE_SQUAD_SOURCE_URL)}" target="_blank" rel="noopener noreferrer">Official practice-squad source ↗</a>`;
  filterbar.insertAdjacentElement('afterend',summary);

  const eligibility=document.createElement('aside');
  eligibility.className='roster-eligibility-guide';
  eligibility.dataset.rosterEligibilityGuide='true';
  eligibility.setAttribute('aria-label','NFL roster and Game Day eligibility guide');
  eligibility.innerHTML=`<div><strong>Game Day eligibility</strong><p><b>Practice Squad is separate from the 53-player Active/Inactive list.</b> A club may standard-elevate up to two practice-squad players for a week, temporarily expanding that list to 54 or 55. On game day, 47 players may be active, or 48 when at least eight offensive linemen are active. This 17-player Titans practice squad includes one International player exception.</p></div><a href="${esc(NFL_ROSTER_RULES_SOURCE_URL)}" target="_blank" rel="noopener noreferrer">NFL roster rules ↗</a>`;
  summary.insertAdjacentElement('afterend',eligibility);

  const practiceGrid=document.createElement('div');
  practiceGrid.id='practice-squad-grid';
  practiceGrid.className='grid roster-grid practice-squad-grid';
  practiceGrid.hidden=true;
  mainGrid.insertAdjacentElement('afterend',practiceGrid);

  const search=root.querySelector('#rs'),unit=root.querySelector('#ru');
  const draw=()=>{
    const q=normalize(search?.value),selectedUnit=unit?.value||'all',selectedGroup=group.value;
    const rows=auditedPracticeSquad20260902.filter(player=>(selectedUnit==='all'||player.unit===selectedUnit)&&(!q||normalize(`${player.name} ${player.position} ${player.number} ${player.status}`).includes(q)));
    practiceGrid.innerHTML=rows.map(practiceCard).join('')||'<div class="empty practice-squad-empty">No matching practice-squad players.</div>';
    mainGrid.hidden=selectedGroup==='practice';
    practiceGrid.hidden=selectedGroup==='main';
  };
  group.addEventListener('change',draw);
  search?.addEventListener('input',draw);
  unit?.addEventListener('input',draw);
  draw();
}

let queued=false;
const queueEnhance=()=>{
  if(queued)return;
  queued=true;
  queueMicrotask(()=>{queued=false;enhanceRoster()});
};

addEventListener('hashchange',queueEnhance);
const app=document.querySelector('#app');
if(app)new MutationObserver(queueEnhance).observe(app,{childList:true});
queueEnhance();
