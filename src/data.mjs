export const team = {
  name: 'Tennessee Titans',
  shortName: 'Titans',
  abbreviation: 'TEN',
  city: 'Nashville',
  conference: 'AFC',
  division: 'AFC South',
  owner: 'Amy Adams Strunk',
  generalManager: 'Mike Borgonzi',
  president: 'Burke Nihill',
  coach: 'Robert Saleh',
  coachOfficialHireDate: '2026-01-22',
  season: 2026,
  phase: 'Preseason',
  stadium: 'Nissan Stadium',
  franchiseGranted: '1959-08-14',
  firstSeason: 1960,
  firstSeasonInTennessee: 1997,
  firstSeasonAsTitans: 1999,
  byeWeek: 9,
  colors: ['Titans blue', 'red', 'white', 'navy blue'],
  primaryLogo: 'The Shield',
  rosterCoverage: {
    fallbackType: 'featured-sample',
    fallbackPlayers: 17,
    officialActivePlayersAtAudit: 91,
    asOf: '2026-08-19'
  },
  auditedAt: '2026-08-19T12:00:00Z'
};

export const games = [
  {id:'pre1', week:'P1', date:'2026-08-14T01:00:00Z', opponent:'San Francisco 49ers', opponentAbbr:'SF', homeAway:'away', status:'final', score:19, opponentScore:13, venue:"Levi's Stadium", network:'WKRN-TV News 2', source:'Tennessee Titans'},
  {id:'pre2', week:'P2', date:'2026-08-24T00:00:00Z', opponent:'Seattle Seahawks', opponentAbbr:'SEA', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'FOX', source:'Tennessee Titans'},
  {id:'pre3', week:'P3', date:'2026-08-29T22:00:00Z', opponent:'Chicago Bears', opponentAbbr:'CHI', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'NFL Network / WKRN-TV News 2', source:'Tennessee Titans + NFL'},
  {id:'wk1', week:1, date:'2026-09-13T17:00:00Z', opponent:'New York Jets', opponentAbbr:'NYJ', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk2', week:2, date:'2026-09-20T17:00:00Z', opponent:'Philadelphia Eagles', opponentAbbr:'PHI', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'FOX', source:'Tennessee Titans'},
  {id:'wk3', week:3, date:'2026-09-27T17:00:00Z', opponent:'New York Giants', opponentAbbr:'NYG', homeAway:'away', status:'scheduled', venue:'MetLife Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk4', week:4, date:'2026-10-04T17:00:00Z', opponent:'Baltimore Ravens', opponentAbbr:'BAL', homeAway:'away', status:'scheduled', venue:'M&T Bank Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk5', week:5, date:'2026-10-11T17:00:00Z', opponent:'Houston Texans', opponentAbbr:'HOU', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk6', week:6, date:'2026-10-18T17:00:00Z', opponent:'Indianapolis Colts', opponentAbbr:'IND', homeAway:'away', status:'scheduled', venue:'Lucas Oil Stadium', network:'FOX', source:'Tennessee Titans'},
  {id:'wk7', week:7, date:'2026-10-25T17:00:00Z', opponent:'Cleveland Browns', opponentAbbr:'CLE', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk8', week:8, date:'2026-11-01T18:00:00Z', opponent:'Cincinnati Bengals', opponentAbbr:'CIN', homeAway:'away', status:'scheduled', venue:'Paycor Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'bye9', week:9, date:null, opponent:'BYE', opponentAbbr:'BYE', homeAway:'bye', status:'bye', venue:'', network:'', source:'Tennessee Titans'},
  {id:'wk10', week:10, date:'2026-11-15T18:00:00Z', opponent:'Jacksonville Jaguars', opponentAbbr:'JAX', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'FOX', source:'Tennessee Titans'},
  {id:'wk11', week:11, date:'2026-11-22T18:00:00Z', opponent:'Dallas Cowboys', opponentAbbr:'DAL', homeAway:'away', status:'scheduled', venue:'AT&T Stadium', network:'FOX', source:'Tennessee Titans'},
  {id:'wk12', week:12, date:'2026-11-29T21:05:00Z', opponent:'Jacksonville Jaguars', opponentAbbr:'JAX', homeAway:'away', status:'scheduled', venue:'EverBank Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk13', week:13, date:'2026-12-06T18:00:00Z', opponent:'Washington Commanders', opponentAbbr:'WAS', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk14', week:14, date:'2026-12-13T18:00:00Z', opponent:'Detroit Lions', opponentAbbr:'DET', homeAway:'away', status:'scheduled', venue:'Ford Field', network:'FOX', source:'Tennessee Titans'},
  {id:'wk15', week:15, date:'2026-12-20T18:00:00Z', opponent:'Indianapolis Colts', opponentAbbr:'IND', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk16', week:16, date:'2026-12-27T21:05:00Z', opponent:'Las Vegas Raiders', opponentAbbr:'LV', homeAway:'away', status:'scheduled', venue:'Allegiant Stadium', network:'FOX', source:'Tennessee Titans'},
  {id:'wk17', week:17, date:'2027-01-03T18:00:00Z', opponent:'Pittsburgh Steelers', opponentAbbr:'PIT', homeAway:'home', status:'scheduled', venue:'Nissan Stadium', network:'CBS', source:'Tennessee Titans'},
  {id:'wk18', week:18, date:null, opponent:'Houston Texans', opponentAbbr:'HOU', homeAway:'away', status:'scheduled', venue:'NRG Stadium', network:'TBD', source:'Tennessee Titans / NFL', dateTbd:true}
];

// This is intentionally a verified fallback sample, not the complete active roster.
// The live roster should come from Neon/official ingestion. Do not present this count as roster size.
export const roster = [
  {name:'Cam Ward', number:1, position:'QB', unit:'Offense', status:'Active', experience:'2'},
  {name:'Tony Pollard', number:20, position:'RB', unit:'Offense', status:'Active', experience:'8'},
  {name:'Tyjae Spears', number:2, position:'RB', unit:'Offense', status:'Active', experience:'4'},
  {name:'Nicholas Singleton', number:32, position:'RB', unit:'Offense', status:'Active', experience:'R'},
  {name:'Calvin Ridley', number:0, position:'WR', unit:'Offense', status:'Active', experience:'8'},
  {name:'Wan\'Dale Robinson', number:4, position:'WR', unit:'Offense', status:'Active', experience:'5'},
  {name:'Elic Ayomanor', number:5, position:'WR', unit:'Offense', status:'Active', experience:'2'},
  {name:'Carnell Tate', number:14, position:'WR', unit:'Offense', status:'Active', experience:'R'},
  {name:'Daniel Bellinger', number:82, position:'TE', unit:'Offense', status:'Active', experience:'5'},
  {name:'Peter Skoronski', number:77, position:'G', unit:'Offense', status:'Active', experience:'4'},
  {name:'Jeffery Simmons', number:98, position:'DT', unit:'Defense', status:'Active', experience:'8'},
  {name:'Jermaine Johnson II', number:11, position:'DE', unit:'Defense', status:'Active', experience:'5'},
  {name:'Cody Barton', number:50, position:'LB', unit:'Defense', status:'Active', experience:'8'},
  {name:'Alontae Taylor', number:24, position:'CB', unit:'Defense', status:'Active', experience:'5'},
  {name:'Tony Adams', number:38, position:'S', unit:'Defense', status:'Active', experience:'5'},
  {name:'Kevin Winston Jr.', number:23, position:'S', unit:'Defense', status:'Active', experience:'2'},
  {name:'Joey Slye', number:6, position:'K', unit:'Special Teams', status:'Active', experience:'8'}
];

// Fallback editorial feed: only claims cross-checked against official Titans pages.
export const feed = [
  {id:'n1', type:'game', tier:'official', source:'Tennessee Titans', title:'Preseason Week 1: Titans 19, 49ers 13', summary:'Tennessee opened the 2026 preseason with a 19-13 road win at San Francisco on August 13.', publishedAt:'2026-08-14T04:30:00Z', topics:['games','preseason'], url:'https://www.tennesseetitans.com/schedule/'},
  {id:'n2', type:'news', tier:'official', source:'Tennessee Titans', title:'2026 preseason dates and times finalized', summary:'The Titans confirmed San Francisco on Aug. 13, Seattle at Nissan Stadium on Aug. 23, and Chicago at Nissan Stadium on Aug. 29.', publishedAt:'2026-06-03T15:16:00Z', topics:['schedule','preseason'], url:'https://www.tennesseetitans.com/news/titans-finalize-2026-preseason-dates-and-times'},
  {id:'n3', type:'news', tier:'official', source:'Tennessee Titans', title:'2026 training camp preview', summary:'The official camp preview listed a 91-man camp roster and Robert Saleh entering his first Titans training camp as head coach.', publishedAt:'2026-07-27T20:00:00Z', topics:['training-camp','roster','coach'], url:'https://www.tennesseetitans.com/news/tennessee-titans-training-camp-preview'},
  {id:'n4', type:'video', tier:'official', source:'Tennessee Titans', title:'Robert Saleh talks Cam Ward, Calvin Ridley and camp ramp-up', summary:'Official July 29 press conference from Titans training camp.', publishedAt:'2026-07-29T20:00:00Z', topics:['coach','cam-ward','calvin-ridley','video'], url:'https://www.tennesseetitans.com/video/press-conferences'},
  {id:'n5', type:'news', tier:'official', source:'Tennessee Titans', title:'Titans unveil new 2026 uniforms and logo', summary:'The March 12 rebrand introduced The Shield as the primary logo and the Nashville-inspired 6-String Stripe.', publishedAt:'2026-03-12T18:00:00Z', topics:['brand','history'], url:'https://www.tennesseetitans.com/news/titans-unveil-new-uniforms-logo-to-represent-the-next-chapter-of-franchise-history'},
  {id:'n6', type:'transaction', tier:'official', source:'Tennessee Titans', title:'Titans make six roster moves on Aug. 2', summary:'Tennessee signed Derrick Canteen, Khalen Saunders and Laki Tasi while releasing Hudson Clark, David Ebuka Agoha and Cam Horsley.', publishedAt:'2026-08-02T19:56:00Z', topics:['transactions','roster'], url:'https://www.tennesseetitans.com/news/titans-make-a-flurry-of-roster-moves-signing-three-players-and-waiving-three-others'}
];

export const sources = [
  {name:'Tennessee Titans', category:'Official', tier:'official', status:'Ready', method:'Official web / feeds', cost:'Free', cadence:'Minutes-hours', purpose:'Primary source for roster moves, schedule, coaching staff, brand, depth chart and team news'},
  {name:'NFL', category:'Official league', tier:'official', status:'Ready', method:'NFL.com public pages', cost:'Free', cadence:'Game / schedule updates', purpose:'Cross-check schedule, game status and league information'},
  {name:'NFLverse', category:'Football data', tier:'media', status:'Ready', method:'GitHub release data', cost:'Free', cadence:'Daily / postgame', purpose:'Play-by-play, rosters, snaps and advanced stats'},
  {name:'ESPN', category:'Live sports', tier:'media', status:'Adapter ready', method:'Unofficial JSON endpoints', cost:'Free / undocumented', cadence:'Near live', purpose:'Replaceable near-live scoreboard and basic fallback data'},
  {name:'Wikipedia', category:'Reference', tier:'media', status:'Cross-check only', method:'Public encyclopedia', cost:'Free', cadence:'Variable', purpose:'Historical cross-check; not authoritative for current roster/personnel'},
  {name:'Pro Football Hall of Fame / PFR', category:'Historical reference', tier:'media', status:'Ready', method:'Public reference pages', cost:'Free', cadence:'Seasonal', purpose:'Franchise milestones, records and historical cross-checks'},
  {name:'Bluesky', category:'Social', tier:'community', status:'Ready', method:'Public API', cost:'Free', cadence:'Near live', purpose:'Public posts and community chatter'},
  {name:'NWS', category:'Weather', tier:'official', status:'Ready', method:'api.weather.gov', cost:'Free', cadence:'Hourly', purpose:'Game-day forecast and alerts'},
  {name:'PropLine', category:'Market', tier:'media', status:'Server key optional', method:'PropLine v1', cost:'Free · no card', cadence:'Quota-aware', purpose:'Titans game lines, player props, period lines and futures'},
  {name:'Odds-API.io', category:'Market', tier:'media', status:'Server key optional', method:'Odds-API.io v3', cost:'Free · no card', cadence:'Live / pregame', purpose:'Second free NFL odds source for cross-checks and fallback'}
];

export const metrics = [
  {label:'Preseason', value:'1–0', delta:'W 19–13 at SF', tone:'good'},
  {label:'Next game', value:'SEA', delta:'Aug 23 · Nissan Stadium', tone:'neutral'},
  {label:'Fallback roster', value:'17', delta:'Featured sample · not full roster', tone:'warn'},
  {label:'Bye week', value:'9', delta:'Official 2026 schedule', tone:'neutral'}
];
