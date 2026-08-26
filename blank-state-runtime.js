const isBlankValue=value=>value==null||String(value).trim()===''||/^(?:--|—)$/.test(String(value).trim());
const setText=(node,value)=>{if(node&&node.textContent!==value)node.textContent=value;};
const fillBlank=(node,value)=>{if(node&&isBlankValue(node.textContent))setText(node,value);};
const cleanSeparatorText=node=>{if(!node)return;const next=(node.textContent||'').replace(/\s*·\s*$/,'').replace(/^\s*·\s*/,'').replace(/\s{2,}/g,' ').trim();setText(node,next);};

function sanitizeSchedule(root=document){
  root.querySelectorAll('.game-row').forEach(row=>{
    const opponent=(row.querySelector('.opponent-line strong')?.textContent||'').trim();
    const venue=row.querySelector('.opponent-line small');
    if(isBlankValue(venue?.textContent))fillBlank(venue,/BYE/i.test(opponent)?'Bye week':'Venue TBD');
  });
  root.querySelectorAll('.ps-schedule article').forEach(card=>{
    const meta=card.querySelector('em');
    if(!meta)return;
    cleanSeparatorText(meta);
    if(isBlankValue(meta.textContent))setText(meta,'Venue / TV not announced');
  });
}

function sanitizeRoster(root=document){
  root.querySelectorAll('.player-card p').forEach(meta=>{
    const raw=(meta.textContent||'').split('·').map(x=>x.trim()).filter(Boolean);
    const position=raw[0]||'Position unavailable';
    const unit=raw[1]||'Unit not classified';
    setText(meta,`${position} · ${unit}`);
  });
  root.querySelectorAll('.ps-leaders article:not(.is-unavailable) span').forEach(cleanSeparatorText);
}

function sanitizeSources(root=document){
  root.querySelectorAll('.source-card').forEach(card=>{
    const purpose=card.querySelector(':scope > p');
    if(isBlankValue(purpose?.textContent))fillBlank(purpose,'Purpose not documented.');
    card.querySelectorAll('.source-meta > div').forEach(item=>{
      const label=(item.querySelector('small')?.textContent||'').trim().toLowerCase();
      const value=item.querySelector('strong');
      if(!isBlankValue(value?.textContent))return;
      fillBlank(value,label==='method'?'Method not documented':label==='cost'?'Free':'Not documented');
    });
  });
  root.querySelectorAll('.source-domain-card').forEach(card=>{
    card.querySelectorAll('.source-level span').forEach(value=>fillBlank(value,'Not documented'));
    const note=card.querySelector(':scope > p');
    if(isBlankValue(note?.textContent))fillBlank(note,'No additional source-policy note is documented.');
  });
}

function sanitizeTeamRoom(root=document){
  root.querySelectorAll('.leadership-grid article').forEach(card=>{
    fillBlank(card.querySelector('small'),'Role unavailable');
    fillBlank(card.querySelector('strong'),'Name unavailable');
  });
  root.querySelectorAll('.staff-row').forEach(row=>{
    fillBlank(row.querySelector('span'),'Role unavailable');
    fillBlank(row.querySelector('strong'),'Name unavailable');
  });
  root.querySelectorAll('.depth-position li a span').forEach(name=>fillBlank(name,'Player unavailable'));
}

function sanitizeTransactions(root=document){
  root.querySelectorAll('.transaction-row').forEach(row=>{
    const description=row.querySelector('p');
    if(isBlankValue(description?.textContent)&&!row.hidden){
      row.hidden=true;
      row.setAttribute('data-invalid-transaction','missing-description');
    }
  });
}

function sanitizeMarkets(root=document){
  root.querySelectorAll('.market-row').forEach(row=>{
    const descriptor=row.querySelector(':scope > div:first-child p');
    if(descriptor&&isBlankValue(descriptor.textContent))descriptor.remove();
  });
}

function applyBlankStateGuard(root=document){
  sanitizeSchedule(root);
  sanitizeRoster(root);
  sanitizeSources(root);
  sanitizeTeamRoom(root);
  sanitizeTransactions(root);
  sanitizeMarkets(root);
}

const app=document.querySelector('#app');
if(app){
  let queued=false;
  const queue=()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{queued=false;applyBlankStateGuard(app)});
  };
  new MutationObserver(queue).observe(app,{childList:true,subtree:true,characterData:true});
  queue();
}

export {applyBlankStateGuard,isBlankValue};
