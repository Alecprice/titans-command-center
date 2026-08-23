import {access,readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const dist=path.join(root,'dist');
const required=[
  'index.html','app.js','usability-runtime.js','usability-runtime.css','transactions-hub.js','stats-hub.js','market-hub.js','sw.js','manifest.webmanifest','build-meta.json','_headers',
  'src/core.mjs','src/data.mjs','src/odds.mjs','src/visual-audit.mjs','src/roster-audit-20260819.mjs','src/roster-audit-20260822.mjs',
  'assets/archive/current-shield-primary.webp','assets/brand/current-lockup.webp','assets/icon-192.png','assets/icon-512.png'
];
for(const relative of required)await access(path.join(dist,relative));
for(const forbidden of ['api','db','cloudflare','scripts','.env','.git']){
  try{await access(path.join(dist,forbidden));throw new Error(`Cloudflare static build leaked ${forbidden}`)}catch(error){if(error?.code!=='ENOENT')throw error}
}
const html=await readFile(path.join(dist,'index.html'),'utf8');
for(const asset of ['/app.js','/usability-runtime.js','/usability-runtime.css','/transactions-hub.js','/stats-hub.js','/market-hub.js','/assets/brand/current-lockup.webp']){
  if(!html.includes(asset))throw new Error(`index.html missing expected production asset ${asset}`);
}
if(!html.includes('href="#transactions" data-route="transactions"')||!html.includes('id="mobile-more-button"'))throw new Error('Mobile navigation is missing Transactions or More');

// Every local resource referenced by the HTML shell must exist in the static build.
// Query strings are cache-busters and do not change the on-disk path.
const shellRefs=[];
for(const match of html.matchAll(/<(?:script|img|source)\b[^>]*?\bsrc=['"]([^'"]+)['"][^>]*>/gi))shellRefs.push(match[1]);
for(const match of html.matchAll(/<link\b[^>]*?\bhref=['"]([^'"]+)['"][^>]*>/gi))shellRefs.push(match[1]);
for(const raw of new Set(shellRefs)){
  if(!raw.startsWith('/')||raw.startsWith('//'))continue;
  const pathname=raw.split(/[?#]/,1)[0];
  if(!pathname||pathname==='/')continue;
  const relative=pathname.slice(1);
  if(relative.includes('..'))throw new Error(`index.html local asset escapes static root: ${raw}`);
  try{await access(path.join(dist,relative))}catch{throw new Error(`index.html references a missing local asset: ${raw}`)}
}

const meta=JSON.parse(await readFile(path.join(dist,'build-meta.json'),'utf8'));
if(meta.app!=='titans-command-center'||!meta.version||!meta.commit||!meta.builtAt)throw new Error('Cloudflare build metadata is incomplete');
const headers=await readFile(path.join(dist,'_headers'),'utf8');
for(const requiredHeader of ['X-Content-Type-Options: nosniff','X-Frame-Options: DENY','Referrer-Policy: strict-origin-when-cross-origin','Content-Security-Policy:','X-Robots-Tag: noindex']){
  if(!headers.includes(requiredHeader))throw new Error(`Cloudflare _headers is missing ${requiredHeader}`);
}
if(!headers.includes("frame-ancestors 'none'"))throw new Error('Cloudflare CSP must block framing');
if(!/https:\/\/:version\.:subdomain\.workers\.dev\/\*/.test(headers))throw new Error('workers.dev noindex rule is missing');
const sw=await readFile(path.join(dist,'sw.js'),'utf8');
const shellBlock=sw.match(/const SHELL\s*=\s*\[([\s\S]*?)\];/);
if(!shellBlock)throw new Error('Service worker SHELL precache list could not be parsed');
const shellPaths=[...shellBlock[1].matchAll(/['"]([^'"]+)['"]/g)].map(match=>match[1]);
if(!shellPaths.length)throw new Error('Service worker SHELL precache list is empty');
const shellPathSet=new Set(shellPaths);
for(const publicPath of shellPaths){
  if(publicPath==='/')continue;
  if(!publicPath.startsWith('/'))throw new Error(`Service worker precache path must be root-relative: ${publicPath}`);
  try{await access(path.join(dist,publicPath.slice(1)))}catch{throw new Error(`Service worker precache asset is missing from Cloudflare build: ${publicPath}`)}
}

const browserCode=[];
async function collectBrowserCode(dir,prefix=''){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const rel=path.join(prefix,entry.name);
    if(entry.isDirectory()){
      if(rel==='assets')continue;
      await collectBrowserCode(path.join(dir,entry.name),rel);
    }else if(/\.(?:js|mjs)$/.test(entry.name))browserCode.push(rel);
  }
}
await collectBrowserCode(dist);
const importPattern=/(?:\bfrom\s*|\bimport\s*\(\s*)['"]([^'"]+)['"]/g;
for(const relative of browserCode){
  const code=await readFile(path.join(dist,relative),'utf8');
  for(const match of code.matchAll(importPattern)){
    const specifier=match[1];
    if(!specifier.startsWith('.'))continue;
    const clean=specifier.split(/[?#]/,1)[0];
    const resolved=path.normalize(path.join(path.dirname(relative),clean));
    if(resolved.startsWith('..'))throw new Error(`Browser module escapes static root: ${relative} -> ${specifier}`);
    try{await access(path.join(dist,resolved))}catch{throw new Error(`Browser module import is missing from Cloudflare build: ${relative} -> ${specifier}`)}
    const importerPublic=`/${relative.split(path.sep).join('/')}`;
    const importedPublic=`/${resolved.split(path.sep).join('/')}`;
    if(shellPathSet.has(importerPublic)&&!shellPathSet.has(importedPublic))throw new Error(`Offline PWA dependency is not precached: ${importerPublic} -> ${importedPublic}`);
  }
}

try{
  const legacyEntries=await readdir(path.join(dist,'assets','legacy'));
  if(legacyEntries.length)throw new Error(`Retired duplicate legacy assets leaked into build: ${legacyEntries.join(', ')}`);
}catch(error){if(error?.code!=='ENOENT')throw error}
const rootEntries=await readdir(dist);
if(rootEntries.some(name=>name.endsWith('.mjs')))throw new Error('Server/root .mjs files must not be copied to static output');
console.log(`Cloudflare static build verification passed (${new Set(shellRefs).size} HTML shell refs, ${shellPaths.length} PWA shell paths, ${browserCode.length} browser modules verified, offline dependency closure checked, commit ${meta.commit}).`);
