export const adapters = {
  titans:{id:'titans',tier:'official',serverOnly:true,capabilities:['news','transactions','schedule','roster','depth-chart','brand','history']},
  nfl:{id:'nfl',tier:'official',serverOnly:true,capabilities:['schedule','game-status','league-reference']},
  nflverse:{id:'nflverse',tier:'media',serverOnly:true,capabilities:['pbp','rosters','stats','snaps','advanced']},
  espn:{id:'espn',tier:'media',serverOnly:true,unofficial:true,capabilities:['scoreboard','game-state','basic-odds']},
  bluesky:{id:'bluesky',tier:'community',serverOnly:false,capabilities:['public-search','accounts']},
  nws:{id:'nws',tier:'official',serverOnly:false,capabilities:['forecast','alerts','observations']},
  propline:{id:'propline',tier:'media',serverOnly:true,requires:['PROPLINE_API_KEY'],freeOnly:true,noCreditCard:true,capabilities:['live-odds','pregame-odds','spread','total','moneyline','player-props','period-lines','futures']},
  oddsapiio:{id:'odds-api-io',tier:'media',serverOnly:true,requires:['ODDS_API_IO_KEY'],freeOnly:true,noCreditCard:true,capabilities:['live-odds','spread','total','moneyline','player-props','team-props','futures']}
};
export function configuredAdapterIds(env={}){return Object.values(adapters).filter(adapter=>(adapter.requires||[]).every(key=>Boolean(env[key]))).map(adapter=>adapter.id)}
