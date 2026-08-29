export const PRESEASON_P2_AUDIT_DATE='2026-08-28';
export const PRESEASON_P2_GAME_CENTER_URL='https://www.tennesseetitans.com/game-day/2026/pre/seahawks-at-titans/box-score';
export const PRESEASON_P2_NOTES_URL='https://www.tennesseetitans.com/news/titans-seahawks-preseason-week-2-postgame-notes';

export const auditedPreseasonGameP2={
  id:'p2-sea',
  name:'SEA @ TEN',
  date:'2026-08-24T00:00:00Z',
  status:'Final · TEN 19–16 SEA',
  opponent:'Seattle Seahawks',
  source:'Tennessee Titans official Game Center / postgame notes',
  sourceUrl:PRESEASON_P2_GAME_CENTER_URL,
  sourceScope:'Official passing, rushing and receiving box score plus explicitly published defensive and special-teams notes; unlisted defensive stats are not inferred.'
};

const raw=`Cam Ward|Passing|CMP/ATT=8/12,YDS=69,TD=0,INT=0
Mitchell Trubisky|Passing|CMP/ATT=7/9,YDS=49,TD=0,INT=0
Hendon Hooker|Passing|CMP/ATT=2/2,YDS=35,TD=0,INT=0
Will Levis|Passing|CMP/ATT=4/9,YDS=15,TD=0,INT=0
Julius Chestnut|Rushing|ATT=8,YDS=48,LG=15,TD=0
Michael Carter|Rushing|ATT=7,YDS=28,LG=11,TD=0
D'Ernest Johnson|Rushing|ATT=10,YDS=25,LG=7,TD=1
Will Levis|Rushing|ATT=4,YDS=15,LG=11,TD=0
Tony Pollard|Rushing|ATT=2,YDS=12,LG=9,TD=0
Tyjae Spears|Rushing|ATT=2,YDS=2,LG=2,TD=0
Hendon Hooker|Rushing|ATT=3,YDS=-2,LG=0,TD=0
Tony Pollard|Receiving|REC=1,YDS=33,LG=33,TD=0
Julius Chestnut|Receiving|REC=3,YDS=24,LG=16,TD=0
Joel Wilson|Receiving|REC=3,YDS=20,LG=15,TD=0
Tyren Montgomery|Receiving|REC=1,YDS=20,LG=20,TD=0
Elic Ayomanor|Receiving|REC=2,YDS=16,LG=13,TD=0
Tyjae Spears|Receiving|REC=3,YDS=14,LG=9,TD=0
Wan'Dale Robinson|Receiving|REC=2,YDS=11,LG=6,TD=0
Xavier Restrepo|Receiving|REC=2,YDS=10,LG=12,TD=0
Daniel Bellinger|Receiving|REC=1,YDS=8,LG=8,TD=0
D'Ernest Johnson|Receiving|REC=1,YDS=8,LG=8,TD=0
Hank Beatty|Receiving|REC=1,YDS=2,LG=2,TD=0
Chimere Dike|Receiving|REC=1,YDS=2,LG=2,TD=0
Derrick Canteen|Defense|TKL=1,INT=1
Derrick Canteen|Special Teams|TKL=2
Mohamoud Diabate|Defense|COMB=4,SACK=0.5
Jordan Elliott|Defense|COMB=1
Cedric Gray|Defense|COMB=5,TFL=1,PD=1
Marcus Harris|Defense|COMB=2,TFL=1
Anthony Hill Jr.|Defense|COMB=7,INT=1
Truman Jones|Defense|COMB=2,SACK=1.5
Truman Jones|Special Teams|TKL=1
Jacob Martin|Defense|COMB=1
Jalen McMurray|Special Teams|FR=1
Julius Chestnut|Special Teams|TKL=1
Joey Slye|Kicking|FG=4/4,FG LG=55,XP=1/1,PTS=13
Tommy Townsend|Punting|NO=4,YDS=216,AVG=54.0,NET=45.5,IN20=2`;

export const auditedPlayerPreseasonStatsP2={};
for(const line of raw.split('\n')){
  const [name,category,values]=line.split('|');
  const fields=values.split(',').map(pair=>{const i=pair.indexOf('=');return {label:pair.slice(0,i),value:pair.slice(i+1)}});
  (auditedPlayerPreseasonStatsP2[name]??=[]).push({
    category,
    fields,
    eventId:auditedPreseasonGameP2.id,
    eventName:auditedPreseasonGameP2.name,
    date:auditedPreseasonGameP2.date,
    source:category==='Defense'||category==='Special Teams'||category==='Kicking'||category==='Punting'?'Tennessee Titans official postgame notes':'Tennessee Titans official Game Center box score',
    sourceUrl:category==='Defense'||category==='Special Teams'||category==='Kicking'||category==='Punting'?PRESEASON_P2_NOTES_URL:PRESEASON_P2_GAME_CENTER_URL
  });
}

export const auditedPreseasonSourcesP2=[
  {label:'Tennessee Titans official Game Center box score · SEA at TEN · Aug. 23, 2026',url:PRESEASON_P2_GAME_CENTER_URL},
  {label:'Tennessee Titans official postgame notes · SEA at TEN · Aug. 23, 2026',url:PRESEASON_P2_NOTES_URL}
];
