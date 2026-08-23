import './account-interaction-v117.js?v=1';

(() => {
  'use strict';
  if(window.__TitansAccountImportV116)return;
  window.__TitansAccountImportV116=true;
  const MAX_FILE_BYTES=64000;
  let pending=null;
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function ensureCss(){if(document.querySelector('link[data-account-import-v116]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='/account-import-v116.css?v=1';link.dataset.accountImportV116='';document.head.appendChild(link);}
  function previewHost(){return document.querySelector('.account-import-preview');}
  function renderPreview(preview,error=''){
    const host=previewHost();if(!host)return;
    if(error){host.hidden=false;host.className='account-import-preview error';host.innerHTML=`<strong>Backup not accepted</strong><span>${esc(error)}</span><button type="button" class="account-tool" data-account-import-cancel>Dismiss</button>`;return;}
    if(!preview){host.hidden=true;host.className='account-import-preview';host.innerHTML='';return;}
    const date=preview.exportedAt?new Date(preview.exportedAt):null;
    const dateLabel=date&&!Number.isNaN(date.getTime())?new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(date):'Date not included';
    host.hidden=false;host.className='account-import-preview ready';host.innerHTML=`<small>READY TO RESTORE</small><strong>${preview.keys.length} setting group${preview.keys.length===1?'':'s'}</strong><span>${esc(dateLabel)} · ${esc(preview.scope||'unknown source')}</span>${preview.accountEmail?`<span>Backup account: ${esc(preview.accountEmail)}</span>`:''}<p>Nothing has changed yet. Applying restores only recognized Titans preferences from this file.</p><div><button type="button" class="account-primary" data-account-import-apply>Apply imported settings</button><button type="button" class="account-tool" data-account-import-cancel>Cancel</button></div>`;
  }
  function enhance(){
    const tools=document.querySelector('.account-tools'),grid=tools?.querySelector('.account-tool-grid');if(!tools||!grid||tools.dataset.importV116==='true')return;
    tools.dataset.importV116='true';
    const exportButton=grid.querySelector('[data-account-export]');
    const importButton=document.createElement('button');importButton.type='button';importButton.className='account-tool';importButton.dataset.accountImport='';importButton.textContent='Import backup';
    if(exportButton)exportButton.insertAdjacentElement('afterend',importButton);else grid.appendChild(importButton);
    const input=document.createElement('input');input.type='file';input.accept='application/json,.json';input.className='account-import-file';input.dataset.accountImportFile='';input.setAttribute('aria-label','Choose Titans settings backup');tools.appendChild(input);
    const preview=document.createElement('section');preview.className='account-import-preview';preview.hidden=true;preview.setAttribute('aria-live','polite');tools.appendChild(preview);
  }
  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;if(!target)return;
    if(target.closest('#account-button,[data-account-open]')){queueMicrotask(enhance);return;}
    if(target.closest('[data-account-import]')){const input=document.querySelector('[data-account-import-file]');if(input){input.value='';input.click();}return;}
    if(target.closest('[data-account-import-cancel]')){pending=null;renderPreview(null);return;}
    const apply=target.closest('[data-account-import-apply]');if(apply&&pending){apply.disabled=true;apply.textContent='Applying…';Promise.resolve(window.TitansAccountSync?.importSettings?.(pending.raw)).then(result=>{if(!result?.ok){apply.disabled=false;apply.textContent='Apply imported settings';renderPreview(null,'The backup could not be applied.');}}).catch(error=>{apply.disabled=false;apply.textContent='Apply imported settings';renderPreview(null,error instanceof Error?error.message:'The backup could not be applied.');});}
  });
  document.addEventListener('change',async event=>{
    const input=event.target;if(!(input instanceof HTMLInputElement)||!input.matches('[data-account-import-file]'))return;
    const file=input.files?.[0];if(!file)return;
    pending=null;
    if(file.size>MAX_FILE_BYTES){renderPreview(null,'This backup file is too large.');return;}
    try{
      const raw=JSON.parse(await file.text());
      const preview=window.TitansAccountSync?.prepareImport?.(raw);if(!preview)throw new Error('Backup restore is not available in this version.');
      pending={raw,preview};renderPreview(preview);
    }catch(error){renderPreview(null,error instanceof Error?error.message:'This backup could not be read.');}
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&previewHost()&&!previewHost().hidden){pending=null;renderPreview(null);}});
  const mountObserver=new MutationObserver(enhance);
  mountObserver.observe(document.body,{childList:true,subtree:false});
  ensureCss();enhance();
  window.TitansAccountImport={enhance,get pending(){return pending?.preview||null;}};
})();
