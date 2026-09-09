import {appendFile, readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const DEFAULT_STALE_HOURS=24;
const GENERATED_PATHS=new Set(['docs/CLOUDFLARE_STATUS.md']);

export function classifyAreas(files=[]){
  const areas=new Set();
  for(const file of files){
    const value=String(file).toLowerCase();
    if(/ticket/.test(value))areas.add('tickets');
    if(/fantasy/.test(value))areas.add('fantasy');
    if(/legacy/.test(value))areas.add('legacy');
    if(/media|listen|watch/.test(value))areas.add('media');
    if(/game[-_]?day|gameday/.test(value))areas.add('gameday');
    if(/player|headshot/.test(value))areas.add('player');
    if(/home/.test(value))areas.add('home');
    if(/account|auth/.test(value))areas.add('account');
    if(/mobile|responsive/.test(value))areas.add('mobile');
    if(/roster|schedule|src\/data|source-policy/.test(value))areas.add('data');
    if(/^\.github\/workflows\//.test(value)||/cloudflare|deploy|release/.test(value))areas.add('release');
    if(/(^|\/)(app|runtime|index|sw)\.(?:js|mjs|html)$/.test(value))areas.add('core');
  }
  return [...areas].sort();
}

export function isStale(updatedAt,{now=Date.now(),staleHours=DEFAULT_STALE_HOURS}={}){
  const stamp=Date.parse(updatedAt||'');
  if(!Number.isFinite(stamp))return false;
  return now-stamp>staleHours*60*60*1000;
}

export function analyzeCoordination({currentPr,otherPrs,staleHours=DEFAULT_STALE_HOURS,now=Date.now()}){
  const currentFiles=(currentPr.files||[]).filter(file=>!GENERATED_PATHS.has(file));
  const currentAreas=classifyAreas(currentFiles);
  const currentSet=new Set(currentFiles);
  const exact=[];
  const activeArea=[];
  const stale=[];

  for(const pr of otherPrs||[]){
    const files=(pr.files||[]).filter(file=>!GENERATED_PATHS.has(file));
    const overlaps=files.filter(file=>currentSet.has(file)).sort();
    const areas=classifyAreas(files);
    const sharedAreas=currentAreas.filter(area=>areas.includes(area));
    const expired=isStale(pr.updated_at,{now,staleHours});
    const record={number:pr.number,title:pr.title||'',url:pr.html_url||pr.url||'',updated_at:pr.updated_at||'',files:overlaps,areas:sharedAreas};
    if(overlaps.length)exact.push({...record,stale:expired});
    if(expired)stale.push({...record,files,areas});
    else if(sharedAreas.length)activeArea.push(record);
  }

  return {currentFiles,currentAreas,exact,activeArea,stale,ok:exact.length===0};
}

function apiHeaders(token){
  return {
    Accept:'application/vnd.github+json',
    Authorization:`Bearer ${token}`,
    'X-GitHub-Api-Version':'2022-11-28',
    'User-Agent':'titans-tenx-coordination'
  };
}

async function getJson(url,token){
  const response=await fetch(url,{headers:apiHeaders(token)});
  if(!response.ok)throw new Error(`GitHub API ${response.status} for ${url}`);
  return response.json();
}

async function listPages(url,token){
  const rows=[];
  for(let page=1;page<=10;page+=1){
    const separator=url.includes('?')?'&':'?';
    const batch=await getJson(`${url}${separator}per_page=100&page=${page}`,token);
    if(!Array.isArray(batch))throw new Error(`Expected array from ${url}`);
    rows.push(...batch);
    if(batch.length<100)break;
  }
  return rows;
}

async function loadPullFiles(repository,number,token){
  const rows=await listPages(`https://api.github.com/repos/${repository}/pulls/${number}/files`,token);
  return rows.map(row=>row.filename).filter(Boolean);
}

async function resolvePrNumber(){
  if(process.env.TENX_PR_NUMBER)return Number(process.env.TENX_PR_NUMBER);
  if(!process.env.GITHUB_EVENT_PATH)return null;
  const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8'));
  return Number(event?.pull_request?.number||event?.number)||null;
}

function markdown(result,currentNumber,staleHours){
  const lines=[
    '## TENX coordination guard',
    '',
    `PR #${currentNumber} claims ${result.currentFiles.length} changed file(s).`,
    `Detected areas: ${result.currentAreas.length?result.currentAreas.join(', '):'none classified'}.`,
    '',
    result.ok?'✅ No exact-file collision with another open PR.':'❌ Exact-file collision detected with another open PR.',
  ];
  if(result.exact.length){
    lines.push('','### Blocking exact-file overlaps');
    for(const item of result.exact){
      lines.push(`- #${item.number}${item.stale?' (stale claim)':''}: ${item.files.map(file=>`\`${file}\``).join(', ')}`);
    }
  }
  if(result.activeArea.length){
    lines.push('','### Active same-area work (advisory)');
    for(const item of result.activeArea){
      lines.push(`- #${item.number}: ${item.areas.join(', ')}`);
    }
  }
  if(result.stale.length){
    lines.push('','### Stale open work');
    lines.push(`These PRs have had no update for more than ${staleHours} hours. Their area claim is considered expired, but exact-file overlap still blocks.`);
    for(const item of result.stale){
      lines.push(`- #${item.number}: last update ${item.updated_at||'unknown'}`);
    }
  }
  lines.push('','Recovery rule: a restarted chat should resume from GitHub `main` + its open PR/branch state, not from conversation state. See `.tenx/RECOVERY.md`.');
  return `${lines.join('\n')}\n`;
}

export async function main(){
  const repository=process.env.GITHUB_REPOSITORY;
  const token=process.env.GITHUB_TOKEN;
  const staleHours=Number(process.env.TENX_STALE_HOURS)||DEFAULT_STALE_HOURS;
  const number=await resolvePrNumber();
  if(!repository||!token||!number)throw new Error('GITHUB_REPOSITORY, GITHUB_TOKEN, and pull request number are required');

  const [current,open]=await Promise.all([
    getJson(`https://api.github.com/repos/${repository}/pulls/${number}`,token),
    listPages(`https://api.github.com/repos/${repository}/pulls?state=open`,token)
  ]);
  const others=open.filter(pr=>pr.number!==number);
  const [currentFiles,...otherFiles]=await Promise.all([
    loadPullFiles(repository,number,token),
    ...others.map(pr=>loadPullFiles(repository,pr.number,token))
  ]);
  const result=analyzeCoordination({
    currentPr:{...current,files:currentFiles},
    otherPrs:others.map((pr,index)=>({...pr,files:otherFiles[index]})),
    staleHours
  });
  const report=markdown(result,number,staleHours);
  process.stdout.write(report);
  if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,report,'utf8');
  if(!result.ok)process.exitCode=1;
}

const invoked=process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(invoked)main().catch(error=>{console.error(error);process.exitCode=1;});
