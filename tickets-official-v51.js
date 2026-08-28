(() => {
  'use strict';

  const runtime=window.TitansRuntime;
  const app=document.querySelector('#app');
  if(!runtime||!app)return;

  if(!document.querySelector('link[data-tickets-official-v51]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/tickets-official-v51.css';
    link.dataset.ticketsOfficialV51='1';
    document.head.append(link);
  }

  const TEAM_HUB='https://www.tennesseetitans.com/tickets/';
  const OFFICIAL_LINKS={
    '08-29':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076599'},
    '09-13':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076604'},
    '09-20':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076605'},
    '09-27':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/00006491C2E8E049'},
    '10-04':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/1500648DB7AD9D7D'},
    '10-11':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076601'},
    '10-18':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/05006474BEDEA72C'},
    '10-25':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076600'},
    '11-01':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/16006469BBD893F2'},
    '11-15':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076603'},
    '11-22':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/0C00646CBC939043'},
    '11-29':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/2200646A920D4DA3'},
    '12-06':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076607'},
    '12-13':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/080064718D7239E3'},
    '12-20':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076602'},
    '12-27':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/1700646CC3A0C3A4'},
    '01-03':{marketplace:'SeatGeek',url:'https://seatgeek.com/tennessee-titans-tickets/primary-only/event/18076606'},
    '01-10':{marketplace:'Ticketmaster',url:'https://www.ticketmaster.com/event/3A00647B804947ED'},
  };
  const MONTHS={jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',sept:'09',oct:'10',nov:'11',dec:'12'};
  let scheduled=false;

  function dateKey(text){
    const match=String(text||'').match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2})\b/i);
    if(!match)return'';
    const month=MONTHS[match[1].toLowerCase()];
    return month?`${month}-${String(Number(match[2])).padStart(2,'0')}`:'';
  }
  function setText(node,value){if(node&&node.textContent!==value)node.textContent=value;}
  function currentFilter(center){return center.querySelector('[data-ticket-filter][aria-pressed="true"]')?.dataset.ticketFilter||'all';}
  function gameSide(card){return card.querySelector('b')?.textContent?.trim()==='VS'?'home':'away';}

  function enhance(){
    scheduled=false;
    if(runtime.route()!=='tickets')return;
    const center=app.querySelector('[data-ticket-center]');
    if(!center)return;
    const priceGroups=center.querySelector('.tickets-price-group');
    const comparisonBoard=center.querySelector('.tickets-comparison-board');
    const toolbarLink=center.querySelector('.tickets-toolbar>a');
    if(toolbarLink){toolbarLink.href=TEAM_HUB;setText(toolbarLink,'Official Titans tickets ↗');}

    if(priceGroups||comparisonBoard)return;

    center.classList.add('tickets-free-mode-v51');
    const eyebrow=center.querySelector('.tickets-hero .eyebrow');
    setText(eyebrow,'TICKETS · OFFICIAL GAME LINKS');
    setText(center.querySelector('.tickets-hero h1'),'Titans Ticket Center');
    setText(center.querySelector('.tickets-hero p'),'Jump straight to the official ticket destination for each Titans matchup. No paid API is required for game-by-game purchase links; optional marketplace feeds only add price summaries.');
    const rule=center.querySelector('.tickets-hero-price-rule');
    if(rule){setText(rule.querySelector('small'),'FREE CORE');setText(rule.querySelector('strong'),'Game-specific links are live.');setText(rule.querySelector('span'),'No ticket API key required.');}

    const trust=[...center.querySelectorAll('.tickets-trust-strip span')];
    if(trust[0])trust[0].innerHTML='<b>Official source:</b> TennesseeTitans.com publishes the Buy Tickets destination for every scheduled matchup.';
    if(trust[1])trust[1].innerHTML='<b>Marketplace routing:</b> Titans home games go to SeatGeek; road games follow the marketplace linked by the Titans for the host venue.';

    const offline=center.querySelector('.tickets-offline-state');
    if(offline){
      setText(offline.querySelector('small'),'FREE OFFICIAL ROUTING');
      setText(offline.querySelector('h2'),'Official game links are live');
      setText(offline.querySelector('p'),'The price-summary feed is optional. Every matchup below now opens its Titans-published game destination instead of sending every game to the same generic page.');
      const primary=offline.querySelector('a');
      if(primary){primary.href=TEAM_HUB;setText(primary,'Open official Titans ticket hub ↗');}
    }

    const upcoming=center.querySelector('.tickets-upcoming');
    if(upcoming){
      setText(upcoming.querySelector('header small'),'UPCOMING TITANS GAMES · OFFICIAL LINKS');
      setText(upcoming.querySelector('header h2'),'Pick a matchup and go directly to its ticket marketplace.');
    }

    const cards=[...center.querySelectorAll('.tickets-upcoming-list a')];
    const filter=currentFilter(center);
    let firstVisible=true;
    let linked=0;
    for(const card of cards){
      const key=dateKey(card.querySelector('em')?.textContent);
      const official=OFFICIAL_LINKS[key];
      const side=gameSide(card);
      const visible=filter==='all'||filter===side;
      card.hidden=!visible;
      card.classList.remove('tickets-next-official-v51');
      card.querySelector('.tickets-next-label-v51')?.remove();
      if(official){
        card.href=official.url;
        card.dataset.officialTicketLink='1';
        card.dataset.ticketMarketplace=official.marketplace;
        const action=card.querySelector('i');
        setText(action,`${official.marketplace} · View tickets ↗`);
        linked++;
      }else{
        card.href=TEAM_HUB;
        delete card.dataset.officialTicketLink;
        delete card.dataset.ticketMarketplace;
        setText(card.querySelector('i'),'Official ticket hub ↗');
      }
      if(visible&&firstVisible){
        firstVisible=false;
        card.classList.add('tickets-next-official-v51');
        const badge=document.createElement('small');
        badge.className='tickets-next-label-v51';
        badge.textContent='NEXT UP';
        card.prepend(badge);
      }
    }

    const toolbar=center.querySelector('.tickets-toolbar');
    let summary=center.querySelector('[data-ticket-free-summary]');
    if(!summary&&toolbar){summary=document.createElement('div');summary.className='tickets-free-summary-v51';summary.dataset.ticketFreeSummary='1';toolbar.after(summary);}
    if(summary)summary.innerHTML=`<span><b>${linked}</b> game-specific links</span><span><b>$0</b> API cost</span><span><b>Home</b> SeatGeek</span><span><b>Away</b> host marketplace</span><a href="${TEAM_HUB}" target="_blank" rel="noopener noreferrer">Source: TennesseeTitans.com ↗</a>`;

    const note=center.querySelector('.tickets-source-note');
    if(note){setText(note.querySelector('strong'),'What is free here?');setText(note.querySelector('span'),'Official game-by-game purchase destinations are available without an API key. Live starting-price summaries remain optional because marketplace pricing APIs require separate credentials and do not expose unrestricted seat-by-seat inventory.');}
  }

  function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(enhance);}
  app.addEventListener('click',event=>{const filter=event.target instanceof Element?event.target.closest('[data-ticket-filter]'):null;if(filter)schedule();});
  const observer=new MutationObserver(schedule);
  observer.observe(app,{childList:true,subtree:false});
  runtime.onRoute(schedule,{immediate:true});
  runtime.onAppRender(schedule,{immediate:true});
})();
