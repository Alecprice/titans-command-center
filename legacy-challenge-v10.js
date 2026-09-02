const VERSION='10.0.0';
const ROUND_SIZE=5;
const OPTION_COUNT=4;

const route=()=>location.hash.replace(/^#/,'').split('?')[0]||'home';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clean=value=>String(value||'').replace(/\s+/g,' ').trim();

function shuffle(values){
  const copy=[...values];
  for(let i=copy.length-1;i>0;i-=1){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
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
    .legacy-challenge-question{margin:0;font-size:clamp(19px,2.2vw,28px);line-height:1.08;letter-spacing:-.03em}
    .legacy-challenge-reference{margin:-5px 0 0;color:#658098;font-size:9px}
    .legacy-challenge-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .legacy-challenge-options button,.legacy-challenge-action{min-height:44px;border:1px solid rgba(0,33,68,.18);background:#f2f7fb;color:var(--retro-navy,#002144);padding:10px 12px;font-size:9px;font-weight:950;letter-spacing:.05em;cursor:pointer}
    .legacy-challenge-options button:hover:not(:disabled),.legacy-challenge-action:hover{background:var(--retro-navy,#002144);color:#fff}
    .legacy-challenge-options button:disabled{cursor:default;opacity:1}
    .legacy-challenge-options button.is-correct{background:#e4f5e9;border-color:#3f8f59;color:#143d22}
    .legacy-challenge-options button.is-wrong{background:#fff0f1;border-color:#bd4050;color:#731d2a}
    .legacy-challenge-feedback{min-height:22px;margin:0;color:#49677e;font-size:10px;line-height:1.55}
    .legacy-challenge-actions{display:flex;gap:8px;flex-wrap:wrap}
    .legacy-challenge-action{min-width:140px;text-transform:uppercase}
    .legacy-challenge-action[hidden]{display:none}
    .legacy-challenge-start{min-height:46px;width:min(320px,100%);border:0;background:var(--retro-blue,#4a95ce);color:#fff;padding:11px 14px;font-size:9px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border-bottom:4px solid var(--retro-red,#d5272c)}
    .legacy-challenge button:focus-visible{outline:3px solid var(--titans-red,#c8102e);outline-offset:3px}
    @media(max-width:760px){.legacy-challenge-head{grid-template-columns:1fr}.legacy-challenge-options{grid-template-columns:1fr}.legacy-challenge-options button,.legacy-challenge-action,.legacy-challenge-start{min-height:48px;font-size:10px}.legacy-challenge-actions{display:grid;grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){.legacy-challenge button{transition:none}}
    @media(forced-colors:active){.legacy-challenge,.legacy-challenge-stage,.legacy-challenge-options button,.legacy-challenge-action,.legacy-challenge-start{border:1px solid CanvasText}.legacy-challenge button:focus-visible{outline:3px solid Highlight}}
  `;
  document.head.append(style);
}

function shellMarkup(){
  return `<section class="legacy-challenge" data-legacy-challenge data-version="${VERSION}" aria-labelledby="legacy-challenge-title">
    <div class="legacy-challenge-head"><div><small>Fan challenge · museum-derived facts only</small><h2 id="legacy-challenge-title">Legacy Challenge</h2></div><p>Five quick questions are generated from the Record Book and Retired Numbers already on this page. No separate answer database is used.</p></div>
    <div class="legacy-challenge-stage" data-legacy-challenge-stage>
      <div class="legacy-challenge-meta"><span data-legacy-challenge-progress>Ready for kickoff</span><span data-legacy-challenge-score>Score 0</span></div>
      <h3 class="legacy-challenge-question" data-legacy-challenge-question>Think you know the franchise?</h3>
      <p class="legacy-challenge-reference" data-legacy-challenge-reference>Each answer can be revealed back in the audited museum.</p>
      <div class="legacy-challenge-options" data-legacy-challenge-options></div>
      <p class="legacy-challenge-feedback" data-legacy-challenge-feedback role="status" aria-live="polite">Start a five-question round.</p>
      <div class="legacy-challenge-actions"><button type="button" class="legacy-challenge-start" data-legacy-challenge-start>Start 5-question challenge</button><button type="button" class="legacy-challenge-action" data-legacy-challenge-reveal hidden>Reveal in museum</button><button type="button" class="legacy-challenge-action" data-legacy-challenge-next hidden>Next question</button></div>
    </div>
  </section>`;
}

function createGame(page,root,bank){
  const progress=root.querySelector('[data-legacy-challenge-progress]');
  const scoreNode=root.querySelector('[data-legacy-challenge-score]');
  const questionNode=root.querySelector('[data-legacy-challenge-question]');
  const referenceNode=root.querySelector('[data-legacy-challenge-reference]');
  const optionsNode=root.querySelector('[data-legacy-challenge-options]');
  const feedback=root.querySelector('[data-legacy-challenge-feedback]');
  const startButton=root.querySelector('[data-legacy-challenge-start]');
  const revealButton=root.querySelector('[data-legacy-challenge-reveal]');
  const nextButton=root.querySelector('[data-legacy-challenge-next]');
  let round=[],index=0,score=0,answered=false;

  const current=()=>round[index]||null;

  function renderQuestion(){
    const item=current();
    if(!item)return;
    answered=false;
    progress.textContent=`Question ${index+1} of ${round.length}`;
    scoreNode.textContent=`Score ${score}`;
    questionNode.textContent=item.prompt;
    referenceNode.textContent=item.reference?`Museum reference: ${item.reference}`:'Choose the best answer.';
    optionsNode.innerHTML=item.options.map(option=>`<button type="button" data-legacy-challenge-answer="${esc(option)}">${esc(option)}</button>`).join('');
    feedback.textContent='Choose one answer.';
    revealButton.hidden=true;
    nextButton.hidden=true;
    nextButton.textContent=index===round.length-1?'See score':'Next question';
    startButton.hidden=true;
  }

  function finish(){
    progress.textContent='Round complete';
    scoreNode.textContent=`Final ${score} / ${round.length}`;
    questionNode.textContent=`You scored ${score} out of ${round.length}.`;
    referenceNode.textContent='Every question came from the museum currently rendered on this page.';
    optionsNode.innerHTML='';
    feedback.textContent=score===round.length?'Perfect round. Titan Up.':'Run it back for a different mix.';
    revealButton.hidden=true;
    nextButton.hidden=true;
    startButton.hidden=false;
    startButton.textContent='Play another round';
  }

  function start(){
    round=shuffle(bank).slice(0,Math.min(ROUND_SIZE,bank.length));
    index=0;score=0;
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

  root.addEventListener('click',event=>{
    const start=event.target.closest('[data-legacy-challenge-start]');
    if(start){start();return;}
    const answerButton=event.target.closest('[data-legacy-challenge-answer]');
    if(answerButton){answer(answerButton);return;}
    if(event.target.closest('[data-legacy-challenge-reveal]')){reveal();return;}
    if(event.target.closest('[data-legacy-challenge-next]')){
      if(!answered)return;
      if(index>=round.length-1){finish();return;}
      index+=1;renderQuestion();
    }
  });

  return {start};
}

function ensureChallenge(){
  if(route()!=='legacy')return false;
  const page=document.querySelector('.legacy-page[data-polished="true"]');
  if(!page)return false;
  if(page.querySelector('[data-legacy-challenge]'))return true;
  const bank=collectQuestionBank(page);
  if(bank.length<ROUND_SIZE)return false;
  ensureStyle();
  const anchor=page.querySelector('[data-legacy-anniversary]')||page.querySelector('#legacy-moments');
  if(!anchor)return false;
  anchor.insertAdjacentHTML(anchor.matches('[data-legacy-anniversary]')?'afterend':'beforebegin',shellMarkup());
  const root=page.querySelector('[data-legacy-challenge]');
  if(!root)return false;
  createGame(page,root,bank);
  page.dataset.legacyChallengeReady='true';
  page.dataset.legacyChallengeQuestionCount=String(bank.length);
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
