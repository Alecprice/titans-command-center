export const PRESEASON_P3_AUDIT_DATE='2026-09-01';
export const PRESEASON_P3_GAME_CENTER_URL='https://www.tennesseetitans.com/game-day/2026/pre/bears-at-titans/box-score';
export const PRESEASON_P3_RECAP_URL='https://www.tennesseetitans.com/news/titans-end-preseason-with-24-15-loss-to-the-bears';

export const auditedPreseasonGameP3={
  id:'p3-chi',
  name:'CHI @ TEN',
  date:'2026-08-29T22:00:00Z',
  status:'Final · CHI 24–15 TEN',
  opponent:'Chicago Bears',
  source:'Tennessee Titans official Game Center / game recap',
  sourceUrl:PRESEASON_P3_GAME_CENTER_URL,
  sourceScope:'Official passing, rushing and receiving box score plus team summary and explicitly published kicking/turnover facts; unlisted defensive and special-teams stats are not inferred.'
};

export const auditedTeamPreseasonStatsP3={
  totalYards:'259',
  penalties:'7-46',
  timeOfPossession:'24:16'
};

const raw=`Will Levis|Passing|CMP/ATT=14/22,YDS=143,TD=0,INT=0
Hendon Hooker|Passing|CMP/ATT=5/8,YDS=37,TD=0,INT=0
D'Ernest Johnson|Rushing|ATT=6,YDS=29,LG=9,TD=1
Hendon Hooker|Rushing|ATT=2,YDS=29,LG=17,TD=0
Nicholas Singleton|Rushing|ATT=7,YDS=26,LG=9,TD=0
Will Levis|Rushing|ATT=2,YDS=1,LG=1,TD=0
Julius Chestnut|Rushing|ATT=1,YDS=0,LG=0,TD=0
Xavier Restrepo|Receiving|REC=4,YDS=71,LG=21,TD=0
Kylen Granson|Receiving|REC=3,YDS=39,LG=28,TD=0
Michael Carter|Receiving|REC=3,YDS=20,LG=12,TD=0
Nicholas Singleton|Receiving|REC=2,YDS=18,LG=12,TD=0
Elic Ayomanor|Receiving|REC=1,YDS=10,LG=10,TD=0
Chimere Dike|Receiving|REC=1,YDS=9,LG=9,TD=0
D'Ernest Johnson|Receiving|REC=1,YDS=6,LG=6,TD=0
Tyren Montgomery|Receiving|REC=1,YDS=5,LG=5,TD=0
David Martin-Robinson|Receiving|REC=2,YDS=4,LG=3,TD=0
Joel Wilson|Receiving|REC=1,YDS=-2,LG=-2,TD=0
Joey Slye|Kicking|FG=3/3,FG LG=56,PTS=9
Jacob Martin|Defense|FR=1`;

export const auditedPlayerPreseasonStatsP3={};
for(const line of raw.split('\n')){
  const [name,category,values]=line.split('|');
  const fields=values.split(',').map(pair=>{const i=pair.indexOf('=');return {label:pair.slice(0,i),value:pair.slice(i+1)}});
  (auditedPlayerPreseasonStatsP3[name]??=[]).push({
    category,
    fields,
    eventId:auditedPreseasonGameP3.id,
    eventName:auditedPreseasonGameP3.name,
    date:auditedPreseasonGameP3.date,
    source:category==='Kicking'||category==='Defense'?'Tennessee Titans official game recap':'Tennessee Titans official Game Center box score',
    sourceUrl:category==='Kicking'||category==='Defense'?PRESEASON_P3_RECAP_URL:PRESEASON_P3_GAME_CENTER_URL
  });
}

export const auditedPreseasonSourcesP3=[
  {label:'Tennessee Titans official Game Center box score · CHI at TEN · Aug. 29, 2026',url:PRESEASON_P3_GAME_CENTER_URL},
  {label:'Tennessee Titans official game recap · CHI at TEN · Aug. 29, 2026',url:PRESEASON_P3_RECAP_URL}
];
