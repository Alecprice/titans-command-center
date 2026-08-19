export const team = {
  name: 'Tennessee Titans',
  shortName: 'Titans',
  abbreviation: 'TEN',
  city: 'Nashville',
  coach: 'Robert Saleh',
  season: 2026,
  phase: 'Preseason'
};

export const games = [
  {id:'pre1', week:'P1', date:'2026-08-14T01:00:00Z', opponent:'San Francisco 49ers', opponentAbbr:'SF', homeAway:'away', status:'final', score:19, opponentScore:13, venue:"Levi's Stadium", network:'WKRN', source:'Titans'},
  {id:'pre2', week:'P2', date:'2026-08-24T00:00:00Z', opponent:'Seattle Seahawks', opponentAbbr:'SEA', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'FOX', source:'Titans'},
  {id:'pre3', week:'P3', date:'2026-08-29T22:00:00Z', opponent:'Chicago Bears', opponentAbbr:'CHI', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'NFL Network', source:'Titans'},
  {id:'wk1', week:1, date:'2026-09-13T17:00:00Z', opponent:'New York Jets', opponentAbbr:'NYJ', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Titans'},
  {id:'wk2', week:2, date:'2026-09-20T17:00:00Z', opponent:'Philadelphia Eagles', opponentAbbr:'PHI', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'FOX', source:'Titans'},
  {id:'wk3', week:3, date:'2026-09-27T17:00:00Z', opponent:'New York Giants', opponentAbbr:'NYG', homeAway:'away', status:'scheduled', venue:'MetLife Stadium', network:'CBS', source:'Titans'},
  {id:'wk4', week:4, date:'2026-10-04T17:00:00Z', opponent:'Baltimore Ravens', opponentAbbr:'BAL', homeAway:'away', status:'scheduled', venue:'M&T Bank Stadium', network:'CBS', source:'Titans'},
  {id:'wk5', week:5, date:'2026-10-11T17:00:00Z', opponent:'Houston Texans', opponentAbbr:'HOU', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Titans'},
  {id:'wk6', week:6, date:'2026-10-18T17:00:00Z', opponent:'Indianapolis Colts', opponentAbbr:'IND', homeAway:'away', status:'scheduled', venue:'Lucas Oil Stadium', network:'FOX', source:'Titans'},
  {id:'wk7', week:7, date:'2026-10-25T17:00:00Z', opponent:'Cleveland Browns', opponentAbbr:'CLE', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Titans'},
  {id:'wk8', week:8, date:'2026-11-01T18:00:00Z', opponent:'Cincinnati Bengals', opponentAbbr:'CIN', homeAway:'away', status:'scheduled', venue:'Paycor Stadium', network:'CBS', source:'Titans'},
  {id:'wk10', week:10, date:'2026-11-15T18:00:00Z', opponent:'Jacksonville Jaguars', opponentAbbr:'JAX', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'FOX', source:'Titans'},
  {id:'wk11', week:11, date:'2026-11-22T18:00:00Z', opponent:'Dallas Cowboys', opponentAbbr:'DAL', homeAway:'away', status:'scheduled', venue:'AT&T Stadium', network:'', source:'Titans'},
  {id:'wk12', week:12, date:'2026-11-29T21:05:00Z', opponent:'Jacksonville Jaguars', opponentAbbr:'JAX', homeAway:'away', status:'scheduled', venue:'EverBank Stadium', network:'', source:'Titans'},
  {id:'wk13', week:13, date:'2026-12-06T18:00:00Z', opponent:'Washington Commanders', opponentAbbr:'WAS', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'', source:'Titans'},
  {id:'wk14', week:14, date:'2026-12-13T18:00:00Z', opponent:'Detroit Lions', opponentAbbr:'DET', homeAway:'away', status:'scheduled', venue:'Ford Field', network:'', source:'Titans'},
  {id:'wk15', week:15, date:'2026-12-20T18:00:00Z', opponent:'Indianapolis Colts', opponentAbbr:'IND', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'', source:'Titans'},
  {id:'wk16', week:16, date:'2026-12-27T21:05:00Z', opponent:'Las Vegas Raiders', opponentAbbr:'LV', homeAway:'away', status:'scheduled', venue:'Allegiant Stadium', network:'', source:'Titans'},
  {id:'wk17', week:17, date:'2027-01-03T18:00:00Z', opponent:'Pittsburgh Steelers', opponentAbbr:'PIT', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'', source:'Titans'},
  {id:'wk18', week:18, date:'2027-01-10T18:00:00Z', opponent:'Houston Texans', opponentAbbr:'HOU', homeAway:'away', status:'scheduled', venue:'NRG Stadium', network:'TBD', source:'Titans', dateTbd:true}
];

export const roster = [
  {name:'Cam Ward', number:1, position:'QB', unit:'Offense', status:'Active', experience:'2', tag:'QB1'},
  {name:'Tony Pollard', number:20, position:'RB', unit:'Offense', status:'Active', experience:'8', tag:'Veteran'},
  {name:'Tyjae Spears', number:2, position:'RB', unit:'Offense', status:'Active', experience:'4', tag:'Backfield'},
  {name:'Nicholas Singleton', number:32, position:'RB', unit:'Offense', status:'Active', experience:'R', tag:'Rookie'},
  {name:'Calvin Ridley', number:0, position:'WR', unit:'Offense', status:'Active', experience:'8', tag:'Veteran'},
  {name:'Wan\'Dale Robinson', number:4, position:'WR', unit:'Offense', status:'Active', experience:'5', tag:'New'},
  {name:'Elic Ayomanor', number:5, position:'WR', unit:'Offense', status:'Active', experience:'2', tag:'Young core'},
  {name:'Carnell Tate', number:14, position:'WR', unit:'Offense', status:'Active', experience:'R', tag:'Rookie'},
  {name:'Daniel Bellinger', number:82, position:'TE', unit:'Offense', status:'Active', experience:'5', tag:'New'},
  {name:'Peter Skoronski', number:77, position:'OL', unit:'Offense', status:'Active', experience:'4', tag:'Core'},
  {name:'Jeffery Simmons', number:98, position:'DT', unit:'Defense', status:'Active', experience:'8', tag:'Leader'},
  {name:'Jermaine Johnson II', number:11, position:'DE', unit:'Defense', status:'Active', experience:'5', tag:'New'},
  {name:'Cody Barton', number:50, position:'LB', unit:'Defense', status:'Active', experience:'8', tag:'Veteran'},
  {name:'Alontae Taylor', number:24, position:'CB', unit:'Defense', status:'Active', experience:'5', tag:'New'},
  {name:'Tony Adams', number:38, position:'S', unit:'Defense', status:'Active', experience:'5', tag:'New'},
  {name:'Kevin Winston Jr.', number:23, position:'S', unit:'Defense', status:'Active', experience:'2', tag:'Watch'},
  {name:'Joey Slye', number:6, position:'K', unit:'Special Teams', status:'Active', experience:'8', tag:'Special teams'}
];

export const feed = [
  {id:'n1', type:'news', tier:'official', source:'Tennessee Titans', title:'Titans win preseason opener 19-13 over San Francisco', summary:'Tennessee opened the 2026 preseason with a road win. Cam Ward played roughly the first quarter-plus before the backups took over.', publishedAt:'2026-08-14T04:30:00Z', topics:['games','cam-ward'], url:'https://www.tennesseetitans.com/news/titans-win-preseason-opener-19-13-over-the-49ers'},
  {id:'n2', type:'news', tier:'official', source:'Tennessee Titans', title:'First unofficial 2026 depth chart is out', summary:'The first unofficial depth chart gives an early snapshot of camp roles and position battles.', publishedAt:'2026-08-11T14:00:00Z', topics:['depth-chart','roster'], url:'https://www.tennesseetitans.com/news/20-things-that-caught-my-eye-on-the-first-unofficial-depth-chart-for-the-titans-in-2026'},
  {id:'n3', type:'transaction', tier:'official', source:'Tennessee Titans', title:'Roster churn continues during preseason', summary:'The club has continued making camp roster moves as injuries and evaluations reshape the 90-man group.', publishedAt:'2026-08-12T17:45:00Z', topics:['transactions','injuries'], url:'https://www.tennesseetitans.com/'},
  {id:'n4', type:'video', tier:'official', source:'Tennessee Titans', title:'Robert Saleh talks camp ramp-up and Cam Ward', summary:'Coach press conference covering quarterback development, camp intensity, and team preparation.', publishedAt:'2026-07-29T20:00:00Z', topics:['coach','cam-ward','video'], url:'https://www.tennesseetitans.com/video/press-conferences'},
  {id:'n5', type:'social', tier:'reporter', source:'Reporter watchlist', title:'Joint-practice watch: Seattle arrives Friday', summary:'Reporter feed slot ready for X/Threads/Bluesky ingestion. Connect provider credentials to replace this fallback item.', publishedAt:'2026-08-18T19:10:00Z', topics:['practice','seahawks'], url:'#sources'},
  {id:'n6', type:'analytics', tier:'media', source:'Titans CC', title:'Preseason sample size warning', summary:'Early preseason efficiency should be segmented by starter/back-up snaps before drawing conclusions.', publishedAt:'2026-08-18T18:20:00Z', topics:['analytics','games'], url:'#stats'}
];

export const sources = [
  {name:'Tennessee Titans', category:'Official', tier:'official', status:'Ready', method:'Official web / feeds', cost:'Free', cadence:'Minutes-hours', purpose:'Roster moves, schedule, depth chart, team news'},
  {name:'NFLverse', category:'Football data', tier:'media', status:'Ready', method:'GitHub release data', cost:'Free', cadence:'Daily / postgame', purpose:'Play-by-play, rosters, snaps, advanced stats'},
  {name:'ESPN', category:'Live sports', tier:'media', status:'Adapter ready', method:'Unofficial JSON endpoints', cost:'Free / undocumented', cadence:'Near live', purpose:'Scores, game states, basic odds fallback, roster, injuries'},
  {name:'Bluesky', category:'Social', tier:'community', status:'Ready', method:'Public API', cost:'Free', cadence:'Near live', purpose:'Public posts and community chatter'},
  {name:'NWS', category:'Weather', tier:'official', status:'Ready', method:'api.weather.gov', cost:'Free', cadence:'Hourly', purpose:'Game-day forecast and alerts'},
  {name:'PropLine', category:'Market', tier:'media', status:'Needs free API key', method:'PropLine v1', cost:'Free · no card', cadence:'Quota-aware', purpose:'Titans game lines, player props, period lines and futures'},
  {name:'Odds-API.io', category:'Market', tier:'media', status:'Optional free key', method:'Odds-API.io v3', cost:'Free · no card', cadence:'Live / pregame', purpose:'Second free NFL odds source for cross-checks and fallback'}
];

export const metrics = [
  {label:'Preseason', value:'1–0', delta:'W at SF', tone:'good'},
  {label:'Next game', value:'SEA', delta:'Aug 23 · Home', tone:'neutral'},
  {label:'Camp roster', value:'90+', delta:'Evaluation mode', tone:'neutral'},
  {label:'Source health', value:'6/9', delta:'3 need credentials', tone:'warn'}
];
