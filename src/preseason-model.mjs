const num=v=>v==null||v===''||Number.isNaN(Number(v))?0:Number(v);
const clean=v=>String(v??'').trim();
const pair=v=>{const m=clean(v).match(/^(-?\d+(?:\.\d+)?)\s*[\/-]\s*(-?\d+(?:\.\d+)?)/);return m?[Number(m[1]),Number(m[2])]:[0,0]};
const field=(row,label)=>row?.fields?.find(x=>x.label===label)?.value;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const round=(v,d=1)=>Number(v).toFixed(d).replace(/\.0$/,'');

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
  if(targets)result.push(out(targets,sumLabel(rows,targets)));
  if(receptions)result.push(out(receptions,sumLabel(rows,receptions)));
  result.push(out(attempt,attempts),out(yards,yds),out(avg,attempts?round(yds/attempts):'0'));
  if(rows.some(r=>field(r,long)!=null))result.push(out(long,maxLabel(rows,long)));
  if(rows.some(r=>field(r,td)!=null))result.push(out(td,sumLabel(rows,td)));
  return result;
}
function aggregateReceiving(rows){
  const tar=sumLabel(rows,'TAR'),rec=sumLabel(rows,'REC'),yds=sumLabel(rows,'YDS');
  return [out('TAR',tar),out('REC',rec),out('YDS',yds),out('AVG',rec?round(yds/rec):'0'),out('LG',maxLabel(rows,'LG')),out('TD',sumLabel(rows,'TD'))];
}
function aggregateKicking(rows){
  const [made,att]=rows.reduce(([m,a],r)=>{const [x,y]=pair(field(r,'FG'));return [m+x,a+y]},[0,0]);
  const [xm,xa]=rows.reduce(([m,a],r)=>{const [x,y]=pair(field(r,'XP'));return [m+x,a+y]},[0,0]);
  return [out('FG',`${made}/${att}`),out('FG LG',maxLabel(rows,'FG LG')),out('XP',`${xm}/${xa}`),out('PTS',sumLabel(rows,'PTS'))];
}
function aggregatePunting(rows){
  const punts=sumLabel(rows,'NO'),yds=sumLabel(rows,'YDS');
  const netNumerator=rows.reduce((s,r)=>s+num(field(r,'NET'))*num(field(r,'NO')),0);
  return [out('NO',punts),out('YDS',yds),out('AVG',punts?round(yds/punts):'0'),out('NET',punts?round(netNumerator/punts):'0'),out('IN20',sumLabel(rows,'IN20')),out('LG',maxLabel(rows,'LG'))];
}
function aggregateDefense(rows){
  const labels=['TKL','AST','COMB','SACK','SACK YDS','TFL','QH','PD','INT','INT YDS','FF','FR'];
  return labels.filter(label=>rows.some(r=>field(r,label)!=null)).map(label=>out(label,round(sumLabel(rows,label))));
}
function aggregateSimple(rows){
  const labels=[...new Set(rows.flatMap(r=>(r.fields||[]).map(x=>x.label)))];
  return labels.map(label=>out(label,round(sumLabel(rows,label))));
}

export function aggregateCategory(category,rows){
  if(!rows.length)return [];
  if(category==='Passing')return aggregatePassing(rows);
  if(category==='Rushing')return aggregateVolume(rows);
  if(category==='Receiving')return aggregateReceiving(rows);
  if(category==='Kicking')return aggregateKicking(rows);
  if(category==='Punting')return aggregatePunting(rows);
  if(category==='Kick Returns'||category==='Punt Returns')return aggregateVolume(rows,{attempt:'NO',yards:'YDS',avg:'AVG',long:'LG',td:'TD'}).concat(rows.some(r=>field(r,'FC')!=null)?[out('FC',sumLabel(rows,'FC'))]:[]);
  if(category==='Defense')return aggregateDefense(rows);
  return aggregateSimple(rows);
}

export function aggregatePlayerStats(rows=[]){
  const groups=new Map();for(const row of rows){const category=row.category||'Stats';if(!groups.has(category))groups.set(category,[]);groups.get(category).push(row)}
  return [...groups].map(([category,items])=>({category,fields:aggregateCategory(category,items),eventId:'season',eventName:'Preseason totals',date:null,source:'Aggregated from completed preseason games'}));
}

export function positionCounts(players=[]){
  const counts=new Map();for(const p of players)counts.set(p.position||'Other',(counts.get(p.position||'Other')||0)+1);
  return [...counts].sort((a,b)=>{const ai=PRESEASON_POSITION_ORDER.indexOf(a[0]),bi=PRESEASON_POSITION_ORDER.indexOf(b[0]);return (ai<0?99:ai)-(bi<0?99:bi)||a[0].localeCompare(b[0])}).map(([position,count])=>({position,count}));
}

const statNumber=(stats,category,label)=>num(stats.find(x=>x.category===category)?.fields?.find(x=>x.label===label)?.value);
export function buildLeaders(players=[]){
  const specs=[['Passing','YDS','Passing yards'],['Rushing','YDS','Rushing yards'],['Receiving','YDS','Receiving yards'],['Defense','COMB','Total tackles'],['Defense','SACK','Sacks'],['Kicking','PTS','Points']];
  return specs.map(([category,label,title])=>{const ranked=players.map(p=>({name:p.name,number:p.number,position:p.position,value:statNumber(p.seasonStats||[],category,label)})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name));return ranked.length?{category,label,title,...ranked[0]}:null}).filter(Boolean);
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
