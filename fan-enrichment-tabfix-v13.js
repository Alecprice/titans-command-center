(() => {
  'use strict';
  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest('[data-tab]'):null;
    if(!target)return;
    document.querySelector('#v13-view')?.removeAttribute('data-v13-addons');
  },true);
})();
