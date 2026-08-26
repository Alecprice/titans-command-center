const num=v=>v==null||v===''||Number.isNaN(Number(v))?0:Number(v);
const clean=v=>String(v??'').trim();
const pair=v=>{const m=clean(v).match(/^(-?\d+(?:\.\d+)?)\s*[\/-]\s*(-?\d+(?:\.\d+)?)/);return m?[Number(m[1]),Number(m[2])]:[0,0]};
const labelAliases={
  'CMP/ATT':['CMP/ATT','C/ATT','COMP/ATT'],'SACK':['SACK','SACKS'],'ATT':['ATT','CAR'],'TAR':['TAR','TGTS','TGT'],
  'LG':['LG','LONG'],'FG LG':['FG LG','LNG','LONG'],'TKL':['TKL','SOLO'],'COMB':['COMB','TOT','TOTAL'],
  'SACK YDS':['SACK YDS','SACKYDS'],'QH':['QH','QB HTS','QB HITS'],'PD':['PD','PDEF'],'NO':['NO','RET','PUNTS']
};
const normLabel=v=>String(v??'').toUpperCase().replace(/[^A-Z0-9/]/g,'');
const field=(row,label)=>{const wanted=(labelAliases[label]||[label]).map(normLabel);return row?.fields?.find(x=>wanted.includes(normLabel(x.label)))?.value;};
const hasField=(rows,label)=>rows.some(row=>field(row,label)!=null&&field(row,label)!=='');
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const round=(v,d=1)=>Number(v).toFixed(d).replace(/\.0$/,'');
const canonicalCategory=v=>{const key=clean(v).toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ');return ({passing:'Passing',rushing:'Rushing',receiving:'Receiving',defense:'Defense',defensive:'Defense',kicking:'Kicking',punting:'Punting','kick return':'Kick Returns','kick returns':'Kick Returns','punt return':'Punt Returns','punt returns':'Punt Returns','special teams':'Special Teams',fumbles:'Fumbles'})[key]||clean(v)||'Stats'};

export const PRESEASON_POSITION_ORDER=['QB','RB','WR','TE','C','G','T','DE','DL','DT','LB','CB','DB','S','K','P','LS'];

function sumLabel(rows,label){return rows.reduce((s,row)=>s+num(field(row,label)),0)}
function maxLabel(rows,label){return rows.reduce((m,row)=>Math.max(m,num(field(row,label))),0)}
function out(label,value){return {label,value:String(value)}}
function aggregatePassing(rows){
  const [cmp,att]=rows.reduce(([c,a],r)=>{const [x,y]=pair(field(r,'CMP/ATT'));return [c+x,a+y]},[0,0]);
  const [sacks,sackYds]=rows.reduce(([c,a],r)=>{const [x,y]=pair(field(r,'SACK'));return [c+x,a+y]},[0,0]);
  const yds=sumLabel(rows,'YDS'),td=sumLabel(rows,'TD'),ints=sumLabel(rows,'INT'),lg=maxLabel(rows,'LG');
  let rating=0;if(att){const a=clamp((cmp/att-.3)*5,0,2.375),b=clamp((yds/att-3)*.25,0,2.375),c=clamp(td/att*20,0,2.375),d=clamp(2.375-ints/att*25,0,2.375);rating=(a+b+c+d)/6*100}
  return [out('CMP/ATT',`${cmp}/${att}`),out('YDS',yds),out('SACK',`${sacks}/${sackYds}`),out('TD',td),out('INT',ints),out('RTG',round(rating))].concat(lg?[out('LG',lg)]:[]);
}
function aggregateVolume(rows,{attempt='ATT',yards='YDS',avg='AVG',long='LG',td='TD',targets=null,receptions=null}={}){
  const attempts=sumLabel(rows,attempt),yds=sumLabel(rows,yards),result=[];
  if(targets&&hasField(rows,targets))result.push(out(targets,sumLabel(rows,targets)));
  if(receptions&&hasField(rows,receptions))result.push(out(receptions,sumLabel(rows,receptions)));
  result.push(out(attempt,attempts),out(yards,yds),out(avg,attempts?round(yds/attempts):'0'));
  if(hasField(rows,long))result.push(out(long,maxLabel(rows,long)));
  if(hasField(rows,td))result.push(out(td,sumLabel(rows,td)));
  return result;
}
function aggregateReceiving(rows){
  const rec=sumLabel(rows,'REC'),yds=sumLabel(rows,'YDS'),result=[];
  if(hasField(rows,'TAR'))result.push(out('TAR',sumLabel(rows,'TAR')));
  if(hasField(rows,'REC'))result.push(out('REC',rec));
  if(hasField(rows,'YDS'))result.push(out('YDS',yds));
  if(hasField(rows,'AVG')||hasField(rows,'REC'))result.push(out('AVG',rec?round(yds/rec):'0'));
  if(hasField(rows,'LG'))result.push(out('LG',maxLabel(rows,'LG'));
  if(hasField(rows,'TD'))result.push(out('TD',sumLabel(rows,'TD'));
  return result;
}
function aggregateKicking(rows){
  const [made,att]=rows.reduce(([m,a],r)=>{const [x,y]=pair(field(r,'FG'));return [m+x,a+y]},[0,0]);
  const [xm,xa]=rows.reduce(([m,a],r)=>{const [x,y]=pair(field(r,'XP'));return [m+x,a+y]},[0,0]);
  return [out('FG',`${made}/${att}`),out('FG LG',maxLabel(rows,'FG LG')),out('XP',`${xm}/${xa}`),out('PTS',sumLabel(rows,'PTS'))];
}
function aggregatePunting(rows){
  const punts=sumLabel(rows,'NO'),yds=sumLabel(rows,'YDS');
  const netNumerator=rows.reduce((s,r)=>s+num(field(r,'NET'))*num(field(r,'NO')),0);
  return [out('NO',punts),out('YDS',yds),out('AVG',punts?round(netNumerator?yds/punts:yds/punts):'0'),out('NET',punts?round(netNumerator/punts):'0'),out('IN20',sumLabel(rows,'IN20')),out('LG',maxLabel(rows,'LG'))];
}
function aggregateDefense(rows){
  const labels=['TKL','AST','COMB','SACK','SACK YDS','TFL','QH','PD','INT','INT YDS','FF','FR'];
  return labels.filter(label=>hasField(rows,label)).map(label=>out(label,round(sumLabel(rows,label))));
}
function aggregateSimple(rows){
  const labels=[...new Set(rows.flatMap(r=>(r.fields||[]).map(x=>x.label)))];
  return labels.map(label=>out(label,round(sumLabel(rows,label))));
}

export function aggregateCategory(category,rows){
  category=canonicalCategory(category);if(!rows.length)return [];
  if(category==='Passing')return aggregatePassing(rows);
  if(category==='Rushing')return aggregateVolume(rows);
  if(category==='Receiving')return aggregateReceiving(rows);
  if(category==='Kicking')return aggregateKicking(rows);
  if(category==='Punting')return aggregatePunting(rows);
  if(category==='Kick Returns'||category==='Punt Returns')return aggregateVolume(rows,{attempt:'NO',yards:'YDS',avg:'AVG',long:'LG',td:'TD'}).concat(hasField(rows,'FC')?[out('FC',sumLabel(rows,'FC'))]:[]);
  if(category==='Defense')return aggregateDefense(rows);
  return aggregateSimple(rows);
}

export function aggregatePlayerStats(rows=[]){
  const groups=new Map();for(const row of rows){const category=canonicalCategory(row.category);if(!groups.has(category))groups.set(category,[]);groups.get(category).push(row)}
  return [...groups].map(([category,items])=>({category,fields:aggregateCategory(category,items),eventId:'season',eventName:'Preseason totals',date:null,source:'Aggregated from completed preseason games'}));
}

export function positionCounts(players=[]){
  const counts=new Map();for(const p of players)counts.set(p.position||'Other',(counts.get(p.position||'Other')||0)+1);
  return [...counts].sort((a,b)=>{const ai=PRESEASON_POSITION_ORDER.indexOf(a[0]),bi=PRESEASON_POSITION_ORDER.indexOf(b[0]);return (ai<0?99:ai)-(bi<0?99:bi)||a[0].localeCompare(b[0])}).map(([position,count])=>({position,count}));
}

const statValue=(stats,category,label)=>{const raw=stats.find(x=>x.category===category)?.fields?.find(x=>x.label===label)?.value;if(raw==null||raw==='')return null;const n=Number(String(raw).replace(/[^0-9.-]/g,''));return Number.isFinite(n)?n:null};
export function buildLeaders(players=[]){
  const specs=[['Passing','YDS','Passing yards'],['Rushing','YDS','Rushing yards'],['Receiving','YDS','Receiving yards'],['Defense','COMB','Total tackles'],['Defense','SACK','Sacks'],['Kicking','PTS','Points']];
  return specs.map(([category,label,title])=>{const ranked=players.map(p=>({name:p.name,number:p.number,position:p.position,value:statValue(p.seasonStats||[],category,label)})).filter(x=>x.value!=null).sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name));return ranked.length?{category,label,title,...ranked[0]}:null}).filter(Boolean);
}

function sumPairText(values,sep='/'){
  const [a,b]=values.reduce(([x,y],v)=>{const [m,n]=pair(v);return [x+m,y+n]},[0,0]);return `${a}${sep}${b}`;
}
function sumClock(values){let seconds=0;for(const v of values){const m=clean(v).match(/^(\d+):(\d{2})$/);if(m)seconds+=Number(m[1])*60+Number(m[2])}return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
export function aggregateTeamStats(gameStats=[]){
  if(!gameStats.length)return {};
  const vals=k=>gameStats.map(s=>s?.[k]).filter(v=>v!=null&&v!=='');
  const sum=k=>vals(k).reduce((t,v)=>t+num(v),0);
  const third=sumPairText(vals('thirdDown'));const [thirdMade,thirdAtt]=pair(third);
  return {
    firstDowns:String(sum('firstDowns')),
    thirdDown:`${thirdMade}/${thirdAtt}${thirdAtt?` (${round(thirdMade/thirdAtt*100)}%)`:''}`,
    totalYards:String(sum('totalYards')),
    rushingYards:String(sum('rushingYards')),
    netPassingYards:String(sum('netPassingYards')),
    penalties:sumPairText(vals('penalties'),'-'),
    fumbles:sumPairText(vals('fumbles'),'-'),
    touchdowns:String(sum('touchdowns')),
    fieldGoals:sumPairText(vals('fieldGoals')),
    timeOfPossession:sumClock(vals('timeOfPossession'))
  };
}
