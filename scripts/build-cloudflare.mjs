import {cp,mkdir,readdir,rm,stat,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const dist=path.join(root,'dist');
const browserModules=[
  'src/core.mjs',
  'src/data.mjs',
  'src/odds.mjs',
  'src/visual-audit.mjs',
  'src/roster-audit-20260819.mjs',
  'src/roster-audit-20260822.mjs',
  'src/roster-audit-20260824.mjs',
  'src/roster-audit-20260827.mjs'
];

const isRootStatic=name=>name==='index.html'||name==='manifest.webmanifest'||name==='sw.js'||name==='_headers'||name.endsWith('.css')||name.endsWith('.js');

async function copyFile(relative){
  const from=path.join(root,relative),to=path.join(dist,relative);
  await mkdir(path.dirname(to),{recursive:true});
  await cp(from,to);
}

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const entry of await readdir(root,{withFileTypes:true})){
  if(entry.isFile()&&isRootStatic(entry.name))await copyFile(entry.name);
}
await cp(path.join(root,'assets'),path.join(dist,'assets'),{recursive:true});
for(const module of browserModules)await copyFile(module);

const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
await writeFile(path.join(dist,'build-meta.json'),JSON.stringify({
  app:'titans-command-center',
  version:pkg.version,
  commit:process.env.GITHUB_SHA||'local',
  builtAt:new Date().toISOString()
},null,2));

const files=[];
async function walk(dir,prefix=''){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const rel=path.join(prefix,entry.name);
    if(entry.isDirectory())await walk(path.join(dir,entry.name),rel);
    else files.push(rel);
  }
}
await walk(dist);
const total=(await Promise.all(files.map(async file=>(await stat(path.join(dist,file))).size))).reduce((a,b)=>a+b,0);
console.log(`Cloudflare static build: ${files.length} files, ${(total/1024).toFixed(1)} KiB`);