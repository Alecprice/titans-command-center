(() => {
  'use strict';
  const input=document.querySelector('#global-search');
  if(!input)return;
  const terms=/\b(command intel|command intelligence|what changed|change engine|press room|press conference|scheme lab|global fan|fan gm|time machine|stadium transition|farewell season|records watch|milestone watch|spoiler free)\b/i;
  input.addEventListener('keydown',event=>{
    if(event.key!=='Enter'||!terms.test(input.value.trim()))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    history.pushState(null,'','#command');
    window.dispatchEvent(new PopStateEvent('popstate'));
  },true);
})();
