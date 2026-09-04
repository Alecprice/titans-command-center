(() => {
  'use strict';
  if(window.__TitansTicketBudgetTouchGuardV192)return;
  window.__TitansTicketBudgetTouchGuardV192=true;

  const style=document.createElement('style');
  style.dataset.ticketsBudgetTouchGuardV192='1';
  style.textContent=`
    @media (max-width:620px){
      [data-ticket-outing-game],
      [data-ticket-outing-field],
      [data-ticket-outing-clear],
      [data-ticket-cost-edit]{min-height:48px!important}
      [data-ticket-outing-field]{font-size:16px!important}
    }
  `;
  document.head.append(style);
})();
