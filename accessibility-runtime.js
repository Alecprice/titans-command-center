const menu=document.querySelector('#menu-button');
const sidebar=document.querySelector('#sidebar');
const app=document.querySelector('#app');

if(app&&!app.hasAttribute('tabindex'))app.setAttribute('tabindex','-1');

function syncMenuState(){
  if(!menu||!sidebar)return;
  menu.setAttribute('aria-controls','sidebar');
  menu.setAttribute('aria-expanded',String(sidebar.classList.contains('open')));
}

if(menu&&sidebar){
  syncMenuState();
  new MutationObserver(syncMenuState).observe(sidebar,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&sidebar.classList.contains('open')){
      sidebar.classList.remove('open');
      menu.focus();
    }
  });
}
