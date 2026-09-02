const VERSION='10.5.0';
const ROUND_SIZE=5;
const OPTION_COUNT=4;
const MODE_META={
  fan:{label:'Fan',description:'Standard museum clues'},
  diehard:{label:'Diehard',description:'Reverse-direction clues'}
};

const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
const cleanChallengeUrl=()=>`${location.origin}${location.pathname}${location.search}#legacy`;

function shuffle(values){
  const copy=[...values];
  for(let i=copy.length-1;i>0;i-=1){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
}

const questionIdentity=item=>item?.key||`${item?.kind||'question'}:${clean(item?.prompt)}`;

function selectRound(bank,previousKeys=[]){
  const previous=new Set(previousKeys);
  const fresh=shuffle(bank.filter(item=>!previous.has(questionIdentity(item))));
  const repeats=shuffle(bank.filter(item=>previous.has(questionIdentity(item))));
  return [...fresh,...repeats].slice(0,Math.min(ROUND_SIZE,bank.length));
}

function collectQuestionBank(page){
  const records=[...page.querySelectorAll('.legacy-record-card')].map(card=>{
    const value=clean(card.querySelector(':scope>strong')?.textContent);
    const label=clean(card.querySelector(':scope>span')?.textContent);
    const answer=clean(card.querySelector('h3')?.textContent);
    if(!label||!answer)return null;
    return {kind:'record',prompt:`Who holds the franchise record for ${label.toLowerCase()}?`,answer,reference:value,card,key:card.dataset.legacyExhibitKey||''};
  }).filter(Boolean);

  const retired=[...page.querySelectorAll('.legacy-retired-card')].map(card=>{
    const number=clean(card.querySelector(':scope>strong')?.textContent);
    const name=clean(card.querySelector('span')?.textContent);
    if(!number||!name)return null;
    return {kind:'retired',prompt:`Which retired number belongs to ${name}?`,answer:`#${number}`,reference:'Retired number',card,key:card.dataset.legacyExhibitKey||''};
  }).filter(Boolean);

  const pools={
    record:[...new Set(records.map(item=>item.answer))],
    retired:[...new Set(retired.map(item=>item.answer))]
  };

  return [...records,...retired].map(item=>{
    const distractors=shuffle(pools[item.kind].filter(value=>value!==item.answer)).slice(0,OPTION_COUNT-1);
    if(distractors.length<OPTION_COUNT-1)return null;
    return {...item,options:shuffle([item.answer,...distractors])};
  }).filter(Boolean);
}

function collectDiehardQuestionBank(page){
  const records=[...page.querySelectorAll('.legacy-record-card')].map(card=>{
    const answer=clean(card.querySelector(':scope>strong')?.textContent);
    const label=clean(card.querySelector(':scope>span')?.textContent);
    const holder=clean(card.querySelector('h3')?.textContent);
    if(!answer||!label||!holder)return null;
    return {kind:'record',prompt:`What is the franchise record for ${label.toLowerCase()}, held by ${holder}?`,answer,reference:`Record holder: ${holder}`,card,key:card.dataset.legacyExhibitKey||''};
  }).filter(Boolean);

  const retired=[...page.querySelectorAll('.legacy-retired-card')].map(card=>{
    const number=clean(card.querySelector(':scope>strong')?.textContent);
    const answer=clean(card.querySelector('span')?.textContent);
    if(!number||!answer)return null;
    return {kind:'retired',prompt:`Who wore retired number #${number}?`,answer,reference:'Retired number',card,key:card.dataset.legacyExhibitKey||''};
  }).filter(Boolean);

  const pools={
    record:[...new Set(records.map(item=>item.answer))],
    retired:[...new Set(retired.map(item=>item.answer))]
  };

  return [...records,...retired].map(item=>{
    const distractors=shuffle(pools[item.kind].filter(value=>value!==item.answer)).slice(0,OPTION_COUNT-1);
    if(distractors.length<OPTION_COUNT-1)return null;
    return {...item,options:shuffle([item.answer,...distractors])};
  }).filter(Boolean);
}

function ensureStyle(){
  if(document.getElementById('legacy-challenge-v10-style'))return;
  const style=document.createElement('style');
  style.id='legacy-challenge-v10-style';
  style.textContent=`
    .legacy-challenge{display:grid;gap:16px;padding:24px;background:#06192e;color:#fff;border-top:5px solid var(--retro-red,#d5272c);box-shadow:0 18px 40px rgba(0,33,68,.14)}
    .legacy-challenge-head{display:grid;grid-template-columns:minmax(0,.8fr) minmax(300px,1.2fr);gap:20px;align-items:end}
    .legacy-challenge-head small{display:block;margin-bottom:6px;color:#75b7e2;font-size:8px;font-weight:950;letter-spacing:.16em;text-transform:uppercase}
    .legacy-challenge-head h2{margin:0;color:#fff;font-size:clamp(27px,3vw,40px);line-height:.95;letter-spacing:-.045em;text-transform:uppercase}
    .legacy-challenge-head p{margin:0;color:#b8ccdc;font-size:10px;line-height:1.65}
    .legacy-challenge-stage{display:grid;gap:14px;padding:18px;background:#fff;color:var(--retro-navy,#002144);border:1px solid rgba(255,255,255,.18)}
    .legacy-challenge-meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#557086;font-size:8px;font-weight:950;letter-spacing:.09em;text-transform:uppercase}
    .legacy-challenge-modes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .legacy-challenge-mode{min-height:44px;border:1px solid rgba(0,33,68,.18);background:#f5f8fb;color:var(--retro-navy,#002144);padding:10px 12px;text-align:left;cursor:pointer}
    .legacy-challenge-mode strong,.legacy-challenge-mode span{display:block}
    .legacy-challenge-mode strong{font-size:10px;letter-spacing:.05em;text-transform:uppercase}
    .legacy-challenge-mode span{margin-top:3px;color:#617c92;font-size:8px;line-height:1.4}
    .legacy-challenge-mode[aria-pressed="true"]{background:#06192e;border-color:#06192e;color:#fff}
    .legacy-challenge-mode[aria-pressed="true"] span{color:#b8ccdc}
    .legacy-challenge-mode:disabled{cursor:default;opacity:.62}
    .legacy-challenge-question{margin:0;font-size:clamp(19px,2.2vw,28px);line-height:1.08;letter-spacing:-.03em}
    .legacy-challenge-reference{margin:-5px 0 0;color:#658098;font-size:9px}
    .legacy-challenge-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .legacy-challenge-options button,.legacy-challenge-action{min-height:44px;border:1px solid rgba(0,33,68,.18);background:#f2f7fb;color:var(--retro-navy,#002144);padding:10px 12px;font-size:9px;font-weight:950;letter-spacing:.05em;cursor:pointer}
    .legacy-challenge-options button:hover:not(:disabled),.legacy-challenge-action:hover,.legacy-challenge-mode:hover:not(:disabled):not([aria-pressed="true"]){background:var(--retro-navy,#002144);color:#fff}
    .legacy-challenge-options button:disabled{cursor:default;opacity:1}
    .legacy-challenge-options button.is-correct{background:#e4f5e9;border-color:#3f8f59;color:#143d22}
    .legacy-challenge-options button.is-wrong{background:#fff0f1;border-color:#bd4050;color:#731d2a}
    .legacy-challenge-feedback{min-height:22px;margin:0;color:#49677e;font-size:10px;line-height:1.55}
    .legacy-challenge-actions{display:flex;gap:8px;flex-wrap:wrap}
    .legacy-challenge-action{min-width:140px;text-transform:uppercase}
    .legacy-challenge-action[hidden]{display:none}
    .legacy-challenge-share{background:#eaf4fb;border-color:#9fc8e4}
    .legacy-challenge-start{min-height:46px;width:min(320px,100%);border:0;background:var(--retro-blue,#4a95ce);color:#fff;padding:11px 14px;font-size:9px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border-bottom:4px solid var(--retro-red,#d5272c)}
    .legacy-challenge[data-legacy-challenge-state="idle"]{gap:10px;padding:18px 20px}
    .legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-head{grid-template-columns:minmax(0,1fr) minmax(280px,.9fr);gap:14px;align-items:center}
    .legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-head h2{font-size:clamp(24px,2.5vw,32px)}
    .legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-head p{font-size:9px;line-height:1.5}
    .legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-stage{grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 14px}
    .legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-meta,.legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-question,.legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-reference,.legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-options{display:none}
    .legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-feedback{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
    .legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-actions{justify-content:flex-end}
    .legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-start{width:auto;min-width:220px}
    .legacy-challenge button:focus-visible{outline:3px solid var(--titans-red,#c8102e);outline-offset:3px}
    @media(max-width:760px){.legacy-challenge-head{grid-template-columns:1fr}.legacy-challenge-options{grid-template-columns:1fr}.legacy-challenge-options button,.legacy-challenge-action,.legacy-challenge-start{min-height:48px;font-size:10px}.legacy-challenge-mode{min-height:48px}.legacy-challenge-actions{display:grid;grid-template-columns:1fr}.legacy-challenge[data-legacy-challenge-state="idle"]{padding:16px}.legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-head{grid-template-columns:1fr;gap:8px}.legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-head p{font-size:9px;line-height:1.45}.legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-stage{grid-template-columns:1fr;padding:12px}.legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-actions{display:block}.legacy-challenge[data-legacy-challenge-state="idle"] .legacy-challenge-start{width:100%;min-width:0}}
    @media(prefers-reduced-motion:reduce){.legacy-challenge button{transition:none}}
    @media(forced-colors:active){.legacy-challenge,.legacy-challenge-stage,.legacy-challenge-options button,.legacy-challenge-action,.legacy-challenge-start,.legacy-challenge-mode{border:1px solid CanvasText}.legacy-challenge button:focus-visible{outline:3px solid Highlight}}
  `;
  document.head.append(style);
}

function shellMarkup(){
  return `<section class="legacy-challenge" data-legacy-challenge data-version="${VERSION}" data-legacy-challenge-state="idle" aria-labelledby="legacy-challenge-title">
    <div class="legacy-challenge-head"><div><small>Fan challenge · museum-derived facts only</small><h2 id="legacy-challenge-title">Legacy Challenge</h2></div><p>Choose Fan for standard clues or Diehard to reverse the same museum facts. Both modes are generated from the Record Book and Retired Numbers already on this page.</p></div>
    <div class="legacy-challenge-stage" data-legacy-challenge-stage>
      <div class="legacy-challenge-meta"><span data-legacy-challenge-progress>Ready for kickoff</span><span data-legacy-challenge-score>Score 0</span></div>
      <div class="legacy-challenge-modes" role="group" aria-label="Challenge difficulty"><button type="button" class="legacy-challenge-mode" data-legacy-challenge-mode="fan" aria-pressed="true"><strong>Fan</strong><span>Standard museum clues</span></button><button type="button" class="legacy-challenge-mode" data-legacy-challenge-mode="diehard" aria-pressed="false"><strong>Diehard</strong><span>Reverse the clue direction</span></button></div>
      <h3 class="legacy-challenge-question" data-legacy-challenge-question>Think you know the franchise?</h3>
      <p class="legacy-challenge-reference" data-legacy-challenge-reference>Each answer can be revealed back in the audited museum.</p>
      <div class="legacy-challenge-options" data-legacy-challenge-options></div>
      <p class="legacy-challenge-feedback" data-legacy-challenge-feedback role="status" aria-live="polite">Fan mode selected. Start a five-question round.</p>
      <div class="legacy-challenge-actions"><button type="button" class="legacy-challenge-start" data-legacy-challenge-start>Start Fan challenge</button><button type="button" class="legacy-challenge-action" data-legacy-challenge-reveal hidden>Reveal in museum</button><button type="button" class="legacy-challenge-action" data-legacy-challenge-next hidden>Next question</button><button type="button" class="legacy-challenge-action legacy-challenge-share" data-legacy-challenge-share hidden>Challenge another fan</button></div>
    </div>
  </section>`;
}

function createGame(page,root,banks){
  const progress=root.querySelector('[data-legacy-challenge-progress]');
  const scoreNode=root.querySelector('[data-legacy-challenge-score]');
  const questionNode=root.querySelector('[data-legacy-challenge-question]');
  const referenceNode=root.querySelector('[data-legacy-challenge-reference]');
  const optionsNode=root.querySelector('[data-legacy-challenge-options]');
  const feedback=root.querySelector('[data-legacy-challenge-feedback]');
  const startButton=root.querySelector('[data-legacy-challenge-start]');
  const revealButton=root.querySelector('[data-legacy-challenge-reveal]');
  const nextButton=root.querySelector('[data-legacy-challenge-next]');
  const shareButton=root.querySelector('[data-legacy-challenge-share]');
  const modeButtons=[...root.querySelectorAll('[data-legacy-challenge-mode]')];
  let round=[],index=0,score=0,answered=false,completed=false;
  let mode='fan',roundMode='fan';
  const lastRoundKeysByMode={fan:[],diehard:[]};

  const current=()=>round[index]||null;
  const modeLabel=value=>MODE_META[value]?.label||MODE_META.fan.label;
  const setChallengeState=value=>{root.dataset.legacyChallengeState=value;};
  const focusQuestion=()=>{
    if(!questionNode.hasAttribute('tabindex'))questionNode.setAttribute('tabindex','-1');
    try{questionNode.focus({preventScroll:true});}catch{questionNode.focus();}
  };

  function updateModeControls(disabled=false){
    modeButtons.forEach(button=>{
      const value=button.dataset.legacyChallengeMode||'fan';
      button.setAttribute('aria-pressed',String(value===mode));
      button.disabled=disabled;
    });
  }

  function setMode(nextMode){
    if(round.length&&!completed)return;
    if(!banks[nextMode])return;
    mode=nextMode;
    updateModeControls(false);
    startButton.textContent=`Start ${modeLabel(mode)} challenge`;
    feedback.textContent=completed
      ?`${modeLabel(mode)} mode selected for the next round. Your completed ${modeLabel(roundMode)} score is still available to share.`
      :`${modeLabel(mode)} mode selected. Start a five-question round.`;
  }

  function renderQuestion(){
    const item=current();
    if(!item)return;
    setChallengeState('active');
    answered=false;
    progress.textContent=`${modeLabel(roundMode)} · Question ${index+1} of ${round.length}`;
    scoreNode.textContent=`Score ${score}`;
    questionNode.textContent=item.prompt;
    referenceNode.textContent=item.reference?`Museum reference: ${item.reference}`:'Choose the best answer.';
    optionsNode.innerHTML=item.options.map(option=>`<button type="button" data-legacy-challenge-answer="${esc(option)}">${esc(option)}</button>`).join('');
    feedback.textContent='Choose one answer.';
    revealButton.hidden=true;
    nextButton.hidden=true;
    shareButton.hidden=true;
    nextButton.textContent=index===round.length-1?'See score':'Next question';
    startButton.hidden=true;
    updateModeControls(true);
    focusQuestion();
  }

  function finish(){
    completed=true;
    setChallengeState('complete');
    progress.textContent=`${modeLabel(roundMode)} round complete`;
    scoreNode.textContent=`Final ${score} / ${round.length} · ${modeLabel(roundMode)}`;
    questionNode.textContent=`You scored ${score} out of ${round.length}.`;
    referenceNode.textContent='Every question came from the museum currently rendered on this page.';
    optionsNode.innerHTML='';
    feedback.textContent=score===round.length?'Perfect round. Titan Up.':'Run it back for another mix.';
    revealButton.hidden=true;
    nextButton.hidden=true;
    shareButton.hidden=false;
    startButton.hidden=false;
    startButton.textContent=`Play another ${modeLabel(mode)} round`;
    updateModeControls(false);
    focusQuestion();
  }

  function start(){
    const bank=banks[mode]||banks.fan;
    round=selectRound(bank,lastRoundKeysByMode[mode]||[]);
    lastRoundKeysByMode[mode]=round.map(questionIdentity);
    index=0;score=0;completed=false;
    roundMode=mode;
    shareButton.hidden=true;
    renderQuestion();
  }

  function answer(button){
    const item=current();
    if(!item||answered)return;
    answered=true;
    const selected=button.dataset.legacyChallengeAnswer||'';
    const correct=selected===item.answer;
    if(correct)score+=1;
    optionsNode.querySelectorAll('[data-legacy-challenge-answer]').forEach(option=>{
      option.disabled=true;
      const value=option.dataset.legacyChallengeAnswer||'';
      option.classList.toggle('is-correct',value===item.answer);
      option.classList.toggle('is-wrong',value===selected&&value!==item.answer);
    });
    scoreNode.textContent=`Score ${score}`;
    feedback.textContent=correct?`Correct — ${item.answer}.`:`Not quite — the museum answer is ${item.answer}.`;
    revealButton.hidden=false;
    nextButton.hidden=false;
    nextButton.focus();
  }

  function reveal(){
    const item=current();
    if(!item)return;
    const controller=page._legacyFinderController;
    if(item.key&&controller?.focusExhibit){controller.focusExhibit(item.key,{syncUrl:true,scroll:true});return;}
    const reduced=matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    item.card.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
    if(!item.card.hasAttribute('tabindex'))item.card.setAttribute('tabindex','-1');
    try{item.card.focus({preventScroll:true});}catch{item.card.focus();}
  }

  async function shareResult(){
    if(!completed||!round.length)return;
    const url=cleanChallengeUrl();
    const text=`I scored ${score}/${round.length} in the Titans Legacy Challenge. Think you can beat it? — ${modeLabel(roundMode)} mode.`;
    const payload={title:'Titans Legacy Challenge',text,url};
    try{
      if(navigator.share){await navigator.share(payload);feedback.textContent='Challenge share sheet opened.';return;}
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(`${text}\n${url}`);feedback.textContent='Challenge result copied.';return;}
      feedback.textContent='Sharing is unavailable on this browser.';
    }catch(error){
      if(error?.name==='AbortError'){feedback.textContent='Share cancelled.';return;}
      feedback.textContent='Challenge sharing is unavailable right now.';
    }
  }

  root.addEventListener('click',event=>{
    const modeControl=event.target.closest('[data-legacy-challenge-mode]');
    if(modeControl){setMode(modeControl.dataset.legacyChallengeMode||'fan');return;}
    const startControl=event.target.closest('[data-legacy-challenge-start]');
    if(startControl){start();return;}
    const answerButton=event.target.closest('[data-legacy-challenge-answer]');
    if(answerButton){answer(answerButton);return;}
    if(event.target.closest('[data-legacy-challenge-reveal]')){reveal();return;}
    if(event.target.closest('[data-legacy-challenge-share]')){void shareResult();return;}
    if(event.target.closest('[data-legacy-challenge-next]')){
      if(!answered)return;
      if(index>=round.length-1){finish();return;}
      index+=1;renderQuestion();
    }
  });

  return {start,setMode};
}

function ensureChallenge(){
  if(route()!=='legacy')return false;
  const page=document.querySelector('.legacy-page[data-polished="true"]');
  if(!page)return false;
  if(page.querySelector('[data-legacy-challenge]'))return true;
  const bank=collectQuestionBank(page);
  const diehardBank=collectDiehardQuestionBank(page);
  if(bank.length<ROUND_SIZE||diehardBank.length<ROUND_SIZE)return false;
  ensureStyle();
  const anchor=page.querySelector('[data-legacy-anniversary]')||page.querySelector('#legacy-moments');
  if(!anchor)return false;
  anchor.insertAdjacentHTML(anchor.matches('[data-legacy-anniversary]')?'afterend':'beforebegin',shellMarkup());
  const root=page.querySelector('[data-legacy-challenge]');
  if(!root)return false;
  createGame(page,root,{fan:bank,diehard:diehardBank});
  page.dataset.legacyChallengeReady='true';
  page.dataset.legacyChallengeQuestionCount=String(bank.length);
  page.dataset.legacyChallengeModes='2';
  return true;
}

function scheduleEnsure(){
  let frame=0;
  const tick=()=>{
    if(ensureChallenge()||frame++>=12)return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

addEventListener('hashchange',scheduleEnsure);
scheduleEnsure();