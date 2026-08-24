(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  if(!runtime)return;

  const observed=new WeakSet();
  const mounted=new WeakSet();
  const route=()=>runtime.route();
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function playerMeta(button){
    const detail=button.querySelector('small')?.textContent||'';
    const [position='Other',unit='Other']=detail.split('·').map(x=>x.trim());
    return {
      key:button.dataset.my53Player||'',
      name:button.querySelector('b')?.textContent?.trim()||'Unknown player',
      number:button.querySelector('.my53-number')?.textContent?.trim()||'#—',
      position:position||'Other',
      unit:unit||'Other',
      selected:button.getAttribute('aria-pressed')==='true'
    };
  }

  function selectionText(root){
    const selected=[...root.querySelectorAll('[data-my53-player][aria-pressed="true"]')].map(playerMeta);
    if(!selected.length)return '';
    selected.sort((a,b)=>a.unit.localeCompare(b.unit)||a.position.localeCompare(b.position)||a.name.localeCompare(b.name));
    const lines=['My Titans 53 · fan roster board',`${selected.length} of 53 selected`,''];
    let unit='';
    for(const player of selected){
      if(player.unit!==unit){unit=player.unit;lines.push(unit.toUpperCase());}
      lines.push(`${player.number} ${player.name} · ${player.position}`);
    }
    lines.push('','Fan-made roster exercise · not an official Titans projection.');
    return lines.join('\n');
  }

  async function copyText(text){
    if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return true}catch{}}
    try{
      const area=document.createElement('textarea');
      area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';
      document.body.appendChild(area);area.select();const ok=document.execCommand('copy');area.remove();return Boolean(ok);
    }catch{return false}
  }

  function mount(root){
    if(!root||mounted.has(root))return;
    const list=root.querySelector('.my53-list');
    if(!list)return;
    mounted.add(root);

    const buttons=[...root.querySelectorAll('[data-my53-player]')];
    const positions=[...new Set(buttons.map(b=>playerMeta(b).position))].sort();
    const toolbar=document.createElement('div');
    toolbar.className='my53-tools';
    toolbar.innerHTML=`<div class="my53-tools-row"><label class="my53-search"><span>Find player</span><input type="search" data-my53-search placeholder="Search name or number…" autocomplete="off"></label><label><span>Position</span><select data-my53-position><option value="all">All positions</option>${positions.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('')}</select></label></div><div class="my53-tools-actions"><button type="button" data-my53-selected aria-pressed="false">Selected only</button><button type="button" data-my53-share>Share / Copy My 53</button><span data-my53-visible aria-live="polite"></span></div><div class="my53-unit-shape" data-my53-units aria-live="polite"></div>`;
    list.insertAdjacentElement('beforebegin',toolbar);

    const search=toolbar.querySelector('[data-my53-search]');
    const position=toolbar.querySelector('[data-my53-position]');
    const selectedOnly=toolbar.querySelector('[data-my53-selected]');
    const visible=toolbar.querySelector('[data-my53-visible]');
    const units=toolbar.querySelector('[data-my53-units]');
    const share=toolbar.querySelector('[data-my53-share]');
    const note=root.querySelector('[data-my53-note]');

    const refresh=()=>{
      const query=String(search?.value||'').trim().toLowerCase();
      const positionValue=position?.value||'all';
      const onlySelected=selectedOnly?.getAttribute('aria-pressed')==='true';
      let shown=0;
      const selected=[];
      for(const button of buttons){
        const meta=playerMeta(button);
        if(meta.selected)selected.push(meta);
        const hay=`${meta.name} ${meta.number}`.toLowerCase();
        const show=(!query||hay.includes(query))&&(positionValue==='all'||meta.position===positionValue)&&(!onlySelected||meta.selected);
        button.hidden=!show;if(show)shown++;
      }
      if(visible)visible.textContent=`${shown} shown · ${selected.length} selected`;
      const counts=new Map();
      for(const player of selected)counts.set(player.unit,(counts.get(player.unit)||0)+1);
      if(units)units.innerHTML=selected.length?[...counts.entries()].map(([unit,total])=>`<span><b>${total}</b> ${esc(unit)}</span>`).join(''):'<span>Composition appears as you make picks.</span>';
      share.disabled=selected.length===0;
    };

    search?.addEventListener('input',refresh);
    position?.addEventListener('change',refresh);
    selectedOnly?.addEventListener('click',()=>{const next=selectedOnly.getAttribute('aria-pressed')!=='true';selectedOnly.setAttribute('aria-pressed',String(next));selectedOnly.classList.toggle('active',next);refresh();});
    root.addEventListener('click',event=>{if(event.target.closest('[data-my53-player],[data-my53-clear]'))setTimeout(refresh,0);});
    share?.addEventListener('click',async()=>{
      const text=selectionText(root);
      if(!text){if(note)note.textContent='Pick at least one player before sharing My 53.';return;}
      if(navigator.share){try{await navigator.share({title:'My Titans 53',text});if(note)note.textContent='My 53 share sheet opened.';return}catch(error){if(error?.name==='AbortError')return;}}
      const copied=await copyText(text);
      if(note)note.textContent=copied?'My 53 copied to your clipboard.':'Could not copy My 53 in this browser.';
    });
    refresh();
  }

  function observePanel(panel){
    if(!panel||observed.has(panel))return;
    observed.add(panel);
    const observer=new MutationObserver(()=>mount(panel.querySelector('[data-my53]')));
    observer.observe(panel,{childList:true});
    mount(panel.querySelector('[data-my53]'));
  }

  function scan(){
    if(route()!=='roster')return;
    observePanel(document.querySelector('.team-room-panel[data-panel="cutdown"]'));
  }

  runtime.onAppRender(()=>queueMicrotask(scan),{immediate:true});
  runtime.onRoute(()=>queueMicrotask(scan));
})();
