export const PRESEASON_P2_DATE='2026-08-24T00:00:00Z';
export const PRESEASON_P2_POSTGAME_URL='https://www.tennesseetitans.com/news/titans-seahawks-preseason-week-2-postgame-notes';

const row=(category,fields,sourceUrl)=>({
  category,
  fields:Object.entries(fields).map(([label,value])=>({label,value:String(value)})),
  eventId:'pre2-audited-partial',
  eventName:'SEA @ TEN',
  date:PRESEASON_P2_DATE,
  source:'NFL.com player log / Tennessee Titans official postgame notes',
  sourceUrl
});

export const auditedPartialP2PlayerStats={
  'Will Levis':[
    row('Passing',{'CMP/ATT':'4/9','YDS':15,'SACK':'1/6','TD':0,'INT':0,'RTG':'51.6'},'https://www.nfl.com/players/will-levis/stats/logs/2026/'),
    row('Rushing',{'ATT':4,'YDS':15,'AVG':'3.8','TD':0},'https://www.nfl.com/players/will-levis/stats/logs/2026/')
  ],
  'Julius Chestnut':[
    row('Rushing',{'ATT':8,'YDS':48,'AVG':'6.0','LG':15,'TD':0},'https://www.nfl.com/players/julius-chestnut/stats/logs/2026/'),
    row('Receiving',{'REC':3,'YDS':24,'AVG':'8.0','LG':16,'TD':0},'https://www.nfl.com/players/julius-chestnut/stats/logs/2026/')
  ],
  'Tyjae Spears':[
    row('Rushing',{'ATT':2,'YDS':2,'AVG':'1.0','LG':2,'TD':0},'https://www.nfl.com/players/tyjae-spears/stats/logs/2026/'),
    row('Receiving',{'REC':3,'YDS':14,'AVG':'4.7','LG':9,'TD':0},'https://www.nfl.com/players/tyjae-spears/stats/logs/2026/')
  ],
  'Elic Ayomanor':[
    row('Receiving',{'REC':2,'YDS':16,'AVG':'8.0','LG':13,'TD':0},'https://www.nfl.com/players/elic-ayomanor/stats/logs/2026/')
  ],
  'Joel Wilson':[
    row('Receiving',{'REC':3,'YDS':20,'AVG':'6.7','LG':15,'TD':0},'https://www.nfl.com/players/joel-wilson/stats/logs/2026/')
  ],
  'Truman Jones':[
    row('Defense',{'COMB':3,'TKL':1,'AST':1,'SACK':'1.5'},'https://www.nfl.com/players/truman-jones/stats/logs/2026/')
  ]
};

export const auditedPartialP2Sources=[
  {label:'Tennessee Titans · Seahawks P2 official postgame notes',url:PRESEASON_P2_POSTGAME_URL},
  {label:'NFL.com · Will Levis 2026 preseason log',url:'https://www.nfl.com/players/will-levis/stats/logs/2026/'},
  {label:'NFL.com · Julius Chestnut 2026 preseason log',url:'https://www.nfl.com/players/julius-chestnut/stats/logs/2026/'},
  {label:'NFL.com · Tyjae Spears 2026 preseason log',url:'https://www.nfl.com/players/tyjae-spears/stats/logs/2026/'},
  {label:'NFL.com · Elic Ayomanor 2026 preseason log',url:'https://www.nfl.com/players/elic-ayomanor/stats/logs/2026/'},
  {label:'NFL.com · Joel Wilson 2026 preseason log',url:'https://www.nfl.com/players/joel-wilson/stats/logs/2026/'},
  {label:'NFL.com · Truman Jones 2026 preseason log',url:'https://www.nfl.com/players/truman-jones/stats/logs/2026/'}
];

export function auditedPartialP2Rows(){
  return Object.entries(auditedPartialP2PlayerStats).flatMap(([name,rows])=>rows.map(stat=>({...stat,name})));
}
