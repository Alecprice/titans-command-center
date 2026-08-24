import { auditedRoster20260822, ROSTER_SOURCE_CONFLICT } from './roster-audit-20260822.mjs';

export const team = {
  name:'Tennessee Titans',shortName:'Titans',abbreviation:'TEN',city:'Nashville',conference:'AFC',division:'AFC South',
  owner:'Amy Adams Strunk',generalManager:'Mike Borgonzi',president:'Burke Nihill',coach:'Robert Saleh',coachOfficialHireDate:'2026-01-22',
  season:2026,phase:'Preseason',stadium:'Nissan Stadium',franchiseGranted:'1959-08-14',firstSeason:1960,firstSeasonInTennessee:1997,firstSeasonAsTitans:1999,byeWeek:9,
  colors:['Titans blue','red','white','navy blue'],primaryLogo:'The Shield',
  rosterCoverage:{fallbackType:'cross-source-audited-snapshot',fallbackPlayers:95,officialActivePlayersAtAudit:91,officialReservePlayersAtAudit:4,asOf:'2026-08-22',sourceConflict:ROSTER_SOURCE_CONFLICT},auditedAt:'2026-08-22T20:00:00Z'
};

export const games = [
  {id:'pre1',week:'P1',date:'2026-08-14T01:00:00Z',opponent:'San Francisco 49ers',opponentAbbr:'SF',homeAway:'away',status:'final',score:19,opponentScore:13,venue:"Levi's Stadium",network:'WKRN-TV News 2',source:'Tennessee Titans'},
  {id:'pre2',week:'P2',date:'2026-08-24T00:00:00Z',opponent:'Seattle Seahawks',opponentAbbr:'SEA',homeAway:'home',status:'final',score:19,opponentScore:16,venue:'Nissan Stadium',network:'FOX',source:'Tennessee Titans'},
  {id:'pre3',week:'P3',date:'2026-08-29T22:00:00Z',opponent:'Chicago Bears',opponentAbbr:'CHI',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'NFL Network',source:'Tennessee Titans'},
  {id:'wk1',week:1,date:'2026-09-13T17:00:00Z',opponent:'New York Jets',opponentAbbr:'NYJ',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk2',week:2,date:'2026-09-20T17:00:00Z',opponent:'Philadelphia Eagles',opponentAbbr:'PHI',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'FOX',source:'Tennessee Titans'},
  {id:'wk3',week:3,date:'2026-09-27T17:00:00Z',opponent:'New York Giants',opponentAbbr:'NYG',homeAway:'away',status:'scheduled',venue:'MetLife Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk4',week:4,date:'2026-10-04T17:00:00Z',opponent:'Baltimore Ravens',opponentAbbr:'BAL',homeAway:'away',status:'scheduled',venue:'M&T Bank Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk5',week:5,date:'2026-10-11T17:00:00Z',opponent:'Houston Texans',opponentAbbr:'HOU',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk6',week:6,date:'2026-10-18T17:00:00Z',opponent:'Indianapolis Colts',opponentAbbr:'IND',homeAway:'away',status:'scheduled',venue:'Lucas Oil Stadium',network:'FOX',source:'Tennessee Titans'},
  {id:'wk7',week:7,date:'2026-10-25T17:00:00Z',opponent:'Cleveland Browns',opponentAbbr:'CLE',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk8',week:8,date:'2026-11-01T18:00:00Z',opponent:'Cincinnati Bengals',opponentAbbr:'CIN',homeAway:'away',status:'scheduled',venue:'Paycor Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'bye9',week:9,date:null,opponent:'BYE',opponentAbbr:'BYE',homeAway:'bye',status:'bye',venue:'',network:'',source:'Tennessee Titans'},
  {id:'wk10',week:10,date:'2026-11-15T18:00:00Z',opponent:'Jacksonville Jaguars',opponentAbbr:'JAX',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'FOX',source:'Tennessee Titans'},
  {id:'wk11',week:11,date:'2026-11-22T18:00:00Z',opponent:'Dallas Cowboys',opponentAbbr:'DAL',homeAway:'away',status:'scheduled',venue:'AT&T Stadium',network:'FOX',source:'Tennessee Titans'},
  {id:'wk12',week:12,date:'2026-11-29T21:05:00Z',opponent:'Jacksonville Jaguars',opponentAbbr:'JAX',homeAway:'away',status:'scheduled',venue:'EverBank Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk13',week:13,date:'2026-12-06T18:00:00Z',opponent:'Washington Commanders',opponentAbbr:'WAS',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk14',week:14,date:'2026-12-13T18:00:00Z',opponent:'Detroit Lions',opponentAbbr:'DET',homeAway:'away',status:'scheduled',venue:'Ford Field',network:'FOX',source:'Tennessee Titans'},
  {id:'wk15',week:15,date:'2026-12-20T18:00:00Z',opponent:'Indianapolis Colts',opponentAbbr:'IND',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk16',week:16,date:'2026-12-27T21:05:00Z',opponent:'Las Vegas Raiders',opponentAbbr:'LV',homeAway:'away',status:'scheduled',venue:'Allegiant Stadium',network:'FOX',source:'Tennessee Titans'},
  {id:'wk17',week:17,date:'2027-01-03T18:00:00Z',opponent:'Pittsburgh Steelers',opponentAbbr:'PIT',homeAway:'home',status:'scheduled',venue:'Nissan Stadium',network:'CBS',source:'Tennessee Titans'},
  {id:'wk18',week:18,date:null,opponent:'Houston Texans',opponentAbbr:'HOU',homeAway:'away',status:'scheduled',venue:'Reliant Stadium',network:'TBD',source:'Tennessee Titans / NFL',dateTbd:true}
];

export const roster = auditedRoster20260822.map(player=>({...player}));

export const feed = [
  {id:'n7',type:'transaction',tier:'official',source:'Tennessee Titans',title:'Titans sign Tanoh Kpassagnon and Milo Eifler',summary:'On Aug. 21, Tennessee signed DE Tanoh Kpassagnon and LB Milo Eifler, released TE Matt Lauter, and placed DB Nazeeh Johnson on Reserve/Injured.',publishedAt:'2026-08-21T15:38:00Z',topics:['transactions','roster'],url:'https://www.tennesseetitans.com/news/titans-sign-de-tanoh-kpassagnon-and-lb-milo-eifler-while-releasing-te-matt-lauter-and-placing-db-nazeeh-johnson-on-reserve-injured'},
  {id:'n6',type:'game',tier:'official',source:'Tennessee Titans',title:'Game preview: Titans host Seahawks on FOX',summary:'Tennessee enters preseason Week 2 at 1-0 and hosts Seattle at Nissan Stadium on Sunday, Aug. 23 at 7 p.m. CDT on FOX.',publishedAt:'2026-08-17T18:30:00Z',topics:['games','preseason','seahawks'],url:'https://www.tennesseetitans.com/news/game-preview-titans-host-seahawks-in-nationally-televised-game'},
  {id:'n0',type:'transaction',tier:'official',source:'Tennessee Titans',title:"Titans sign D'Ernest Johnson, waive Dominic Richardson",summary:"Tennessee's official Aug. 19 transaction log lists RB D'Ernest Johnson signed and RB Dominic Richardson waived.",publishedAt:'2026-08-19T16:00:00Z',topics:['transactions','roster'],url:'https://www.tennesseetitans.com/team/transactions/'},
  {id:'n1',type:'game',tier:'official',source:'Tennessee Titans',title:'Preseason Week 1: Titans 19, 49ers 13',summary:'Tennessee opened the 2026 preseason with a 19-13 road win at San Francisco on August 13.',publishedAt:'2026-08-14T04:30:00Z',topics:['games','preseason'],url:'https://www.tennesseetitans.com/schedule/'},
  {id:'n2',type:'news',tier:'official',source:'Tennessee Titans',title:'2026 preseason dates and times finalized',summary:'The Titans confirmed San Francisco on Aug. 13, Seattle at Nissan Stadium on Aug. 23, and Chicago at Nissan Stadium on Aug. 29.',publishedAt:'2026-06-03T15:16:00Z',topics:['schedule','preseason'],url:'https://www.tennesseetitans.com/news/titans-finalize-2026-preseason-dates-and-times'},
  {id:'n3',type:'news',tier:'official',source:'Tennessee Titans',title:'2026 training camp preview',summary:'The official camp preview documented the preseason schedule and Robert Saleh entering his first Titans training camp as head coach.',publishedAt:'2026-07-27T20:00:00Z',topics:['training-camp','roster','coach'],url:'https://www.tennesseetitans.com/news/tennessee-titans-training-camp-preview'},
  {id:'n4',type:'video',tier:'official',source:'Tennessee Titans',title:'Robert Saleh training-camp media availability',summary:'Official Titans training-camp media coverage from Vanderbilt Health Football Center.',publishedAt:'2026-08-21T17:30:00Z',topics:['coach','training-camp','video'],url:'https://www.tennesseetitans.com/live'},
  {id:'n5',type:'news',tier:'official',source:'Tennessee Titans',title:'Titans unveil new 2026 uniforms and logo',summary:'The March 12 rebrand introduced The Shield as the primary logo and the Nashville-inspired 6-String Stripe.',publishedAt:'2026-03-12T18:00:00Z',topics:['brand','history'],url:'https://www.tennesseetitans.com/news/titans-unveil-new-uniforms-logo-to-represent-the-next-chapter-of-franchise-history'}
];

export const sources = [
  {name:'Tennessee Titans',category:'Official',tier:'official',status:'Ready',method:'Official web / feeds',cost:'Free',cadence:'Minutes-hours',purpose:'Primary source for roster moves, schedule, coaching staff, brand, depth chart and team news'},
  {name:'NFL.com',category:'Official league',tier:'official',status:'Ready',method:'NFL.com public pages',cost:'Free',cadence:'Daily / game day',purpose:'Official league cross-check for roster status, schedule, stats and standings when team pages conflict or lag'},
  {name:'NFLverse',category:'Football data',tier:'media',status:'Dataset available · importer pending',method:'GitHub release data',cost:'Free',cadence:'Daily / postgame',purpose:'Play-by-play, roster, snap and advanced datasets; scheduled warehouse persistence is not active yet'},
  {name:'ESPN',category:'Live sports',tier:'media',status:'Scoreboard fallback · final-score reconciliation',method:'Unofficial JSON endpoints',cost:'Free / undocumented',cadence:'Near live',purpose:'Secondary near-live scoreboard and bounded final-score backfill; Tennessee Titans official sources remain the audit authority'},
  {name:'Wikipedia',category:'Reference',tier:'media',status:'Cross-check only',method:'Public encyclopedia',cost:'Free',cadence:'Variable',purpose:'Historical context; never primary for current roster/personnel'},
  {name:'Pro Football Hall of Fame',category:'Historical reference',tier:'official',status:'Cross-check',method:'Public reference pages',cost:'Free',cadence:'Stable',purpose:'Franchise grant date, first season, championships and other stable historical facts'},
  {name:'Pro Football Reference',category:'Statistical reference',tier:'media',status:'Secondary cross-check',method:'Public reference pages',cost:'Free',cadence:'Seasonal / game updates',purpose:'Stats/history cross-check only; cannot override official TBD schedule fields or current roster status'},
  {name:'SportsLogos.net',category:'Visual reference',tier:'media',status:'Secondary visual cross-check',method:'Public specialist archive',cost:'Free',cadence:'Brand changes',purpose:'Logo/uniform chronology cross-check; Titans official brand/history pages remain primary'},
  {name:'Bluesky',category:'Social',tier:'community',status:'API reachable · persistence pending',method:'Public API',cost:'Free',cadence:'Near live',purpose:'Community chatter only; not authoritative team facts'},
  {name:'NWS',category:'Weather',tier:'official',status:'API available · persistence pending',method:'api.weather.gov',cost:'Free',cadence:'Hourly',purpose:'Official game-day forecast/alerts source; warehouse persistence is not active yet'},
  {name:'PropLine',category:'Market',tier:'media',status:'Server key optional',method:'PropLine v1',cost:'Free · no card',cadence:'Quota-aware',purpose:'Titans game lines, player props, period lines and futures'},
  {name:'Odds-API.io',category:'Market',tier:'media',status:'Server key optional',method:'Odds-API.io v3',cost:'Free · no card',cadence:'Live / pregame',purpose:'Second free NFL odds source for cross-checks and fallback'}
];

export const metrics=[{label:'Preseason',value:'2–0',delta:'W 19–16 vs SEA',tone:'good'},{label:'Next game',value:'CHI',delta:'Aug 29 · 5 PM CDT · NFL Network',tone:'neutral'},{label:'Audited roster',value:'95',delta:'91 active · 4 reserve/injured',tone:'good'},{label:'Bye week',value:'9',delta:'Official 2026 schedule',tone:'neutral'}];