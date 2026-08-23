import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root=new URL('../',import.meta.url).pathname;
const ignored=new Set(['node_modules','.git','.vercel','coverage']);
const textExt=new Set(['.js','.mjs','.json','.md','.html','.css','.sql','.txt','.yml','.yaml','.webmanifest','']);
const findings=[];
const patterns=[
  {name:'hard-coded PropLine key',re:/PROPLINE_API_KEY\s*[:=]\s*["']?[a-f0-9]{24,}/i},
  {name:'hard-coded Odds-API.io key',re:/ODDS_API_IO_KEY\s*[:=]\s*["']?[a-f0-9]{24,}/i},
  {name:'literal API-key header',re:/["']X-API-Key["']\s*:\s*["'][A-Za-z0-9_-]{20,}["']/},
  {name:'database credential',re:/postgres(?:ql)?:\/\/[^\s:@]+:[^\s@]+@/i},
  {name:'Neon password token',re:/\bnpg_[A-Za-z0-9_-]{20,}\b/},
  {name:'literal apiKey query credential',re:/apiKey=[A-Za-z0-9_-]{24,}/i},
  {name:'GitHub classic token',re:/\bgh[pousr]_[A-Za-z0-9]{36,}\b/},
  {name:'GitHub fine-grained token',re:/\bgithub_pat_[A-Za-z0-9_]{70,}\b/},
  {name:'AWS access key id',re:/\bAKIA[0-9A-Z]{16}\b/},
  {name:'private key material',re:/-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/},
  {name:'literal bearer credential',re:/authorization["']?\s*[:=]\s*["']Bearer\s+[A-Za-z0-9._~+\/-]{20,}["']/i},
  {name:'hard-coded Cloudflare API token',re:/CLOUDFLARE_API_TOKEN\s*[:=]\s*["']?[A-Za-z0-9_-]{30,}/i},
  {name:'hard-coded ingest secret',re:/\b(?:INGEST_SECRET|CRON_SECRET)\s*[:=]\s*["'][^"']{16,}["']/}
];
function shouldScan(name){return name==='.env.example'||textExt.has(extname(name));}
async function walk(dir){
  for(const ent of await readdir(dir,{withFileTypes:true})){
    if(ignored.has(ent.name)||(ent.name==='.env'||(ent.name.startsWith('.env.')&&ent.name!=='.env.example')))continue;
    const file=join(dir,ent.name);
    if(ent.isDirectory()){await walk(file);continue}
    if(!shouldScan(ent.name))continue;
    let body='';try{body=await readFile(file,'utf8')}catch{continue}
    for(const p of patterns)if(p.re.test(body))findings.push(`${relative(root,file)}: ${p.name}`);
  }
}
await walk(root);
if(findings.length){console.error('Secret scan failed:\n'+findings.map(x=>' - '+x).join('\n'));process.exit(1)}
console.log('Secret scan passed: no embedded deployment credentials detected.');
