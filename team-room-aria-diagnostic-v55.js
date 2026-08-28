(() => {
  'use strict';
  if(window.__TitansTeamRoomAriaDiagnosticV55)return;
  window.__TitansTeamRoomAriaDiagnosticV55=true;
  const original=Element.prototype.setAttribute;
  Element.prototype.setAttribute=function(name,value){
    if(name==='aria-pressed'&&this.matches?.('[data-team-room-view]')){
      const stack=String(new Error().stack||'').split('\n').slice(1,7).join(' | ');
      console.warn('[team-room-aria-trace]',JSON.stringify({view:this.dataset?.teamRoomView||'',value:String(value),stack}));
    }
    return original.apply(this,arguments);
  };
})();
