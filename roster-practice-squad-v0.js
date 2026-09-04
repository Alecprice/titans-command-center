import {
  auditedPracticeSquad20260902,
  PRACTICE_SQUAD_SOURCE_URL,
  ROSTER_AUDIT_DATE
} from './src/roster-audit-20260831.mjs';

const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>String(v||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();

function ensureStyles(){
  if(document.querySelector('#roster-practice-squad-v0-styles'))return;
  const style=document.createElement('style');
  style.id='roster-practice-squad-v0-styles';
  style.textContent=`
    .roster-group-summary{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:12px 0 16px;padding:12px 14px;border-left:4px solid var(--titans-blue,#4B92DB);background:#fff;box-shadow:0 6px 18px rgba(12,35,64,.06)}
    .roster-group-summary strong{display:block;color:var(--titans-navy,#0C2340);font-size:12px;text-transform:uppercase;letter-spacing:.06em}.roster-group-summary span{display:block;margin-top:3px;color:var(--muted,#5D7187);font-size:11px;line-height:1.45}.roster-group-summary a{flex:0 0 auto;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--titans-navy,#0C2340);text-decoration:underline;text-underline-offset:3px}
    #roster-group{min-width:170px}
    .practice-squad-grid{margin-top:14px}.practice-squad-grid[hidden]{display:none!important}
    .practice-squad-card{display:grid;grid-template-columns:54px minmax(0,1fr) auto;gap:12px;align-items:center;padding:13px 14px;background:#fff;border:1px solid rgba(12,35,64,.1);box-shadow:0 6px 18px rgba(12,35,64,.05)}
    .practice-squad-card .jersey{display:grid;place-items:center;min-height:48px}.practice-squad-card h3{margin:0;color:var(--titans-navy,#0C2340);font-size:15px}.practice-squad-card p{margin:3px 0 0;color:var(--muted,#5D7187);font-size:11px}.practice-squad-card .player-tag{white-space:nowrap}
    .practice-squad-empty{grid-column:1/-1}
    @media(max-width:620px){.roster-group-summary{align-items:flex-start;flex-direction:column}.practice-squad-card{grid-template-columns:48px minmax(0,1fr)}.practice-squad-card .player-tag{grid-column:2;justify-self:start}.filterbar #roster-group{width:100%;min-height:44px}}
  `;
  document.head.appendChild(style);
}

function practiceCard(player){
  return `<article class="practice-squad-card" data-practice-squad-player="${esc(player.name)}"><div class="jersey" aria-label="Jersey number ${esc(player.number||'not listed')}">${esc(player.number||'—')}</div><div><h3>${esc(player.name)}</h3><p>${esc(player.position)} · ${esc(player.unit||'')}</p></div><span class="player-tag">Practice Squad</span></article>`;
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
