import {access,readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const dist=path.join(root,'dist');
const required=[
  'index.html','app.js','stats-hub.js','market-hub.js','sw.js','manifest.webmanifest',
  'src/core.mjs','src/data.mjs','src/odds.mjs','src/visual-audit.mjs','src/roster-audit-20260819.mjs',
  'assets/archive/current-shield-primary.webp','assets/brand/current-lockup.webp'
];
for(const relative of required)await access(path.join(dist,relative));
for(const forbidden of ['api','db','cloudflare','scripts','.env','.git']){
  try{await access(path.join(dist,forbidden));throw new Error(`Cloudflare static build leaked ${forbidden}`)}catch(error){if(error?.code!=='ENOENT')throw error}
}
const html=await readFile(path.join(dist,'index.html'),'utf8');
for(const asset of ['/app.js','/stats-hub.js','/market-hub.js','/assets/brand/current-lockup.webp']){
  if(!html.includes(asset))throw new Error(`index.html missing expected production asset ${asset}`);
}
const rootEntries=await readdir(dist);
if(rootEntries.some(name=>name.endsWith('.mjs')))throw new Error('Server/root .mjs files must not be copied to static output');
console.log('Cloudflare static build verification passed.');
