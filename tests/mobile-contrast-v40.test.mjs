import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const css=read('readability-v34.css');
const mobile=read('mobile-navigation-v112.css');
const sw=read('sw.js');

const hex=name=>{
  const match=css.match(new RegExp(`${name}:?(#[0-9a-fA-F]{6})`));
  return match?.[1]||null;
};
const luminance=value=>{
  const rgb=[1,3,5].map(index=>parseInt(value.slice(index,index+2),16)/255).map(channel=>channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4);
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
};
const contrast=(foreground,background)=>{
  const [high,low]=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);
  return (high+.05)/(low+.05);
};

test('mobile readability palette keeps muted text at AAA contrast on Titans navy surfaces',()=>{
  const body=hex('--tcc-mobile-body');
  const muted=hex('--tcc-mobile-muted');
  const subtle=hex('--tcc-mobile-subtle');
  assert.ok(body&&muted&&subtle);
  for(const background of ['#0a1f33','#0c2340','#132b43']){
    assert.ok(contrast(body,background)>=7,`${body} should remain AAA on ${background}`);
    assert.ok(contrast(muted,background)>=7,`${muted} should remain AAA on ${background}`);
    assert.ok(contrast(subtle,background)>=7,`${subtle} should remain AAA on ${background}`);
  }
});

test('mobile dock and sheet text no longer shrink to legacy tiny label sizes',()=>{
  assert.match(css,/\.mobile-nav a,\.mobile-nav button\{[\s\S]*font-size:10\.5px!important/);
  assert.match(css,/@media\(max-width:430px\)[\s\S]*font-size:10px!important/);
  assert.match(css,/@media\(max-width:360px\)[\s\S]*font-size:10px!important/);
  assert.match(css,/\.sidebar \.brand-copy small\{[^}]*font-size:10px!important/);
  assert.match(css,/\.sidebar \.nav a b\{[^}]*font-size:10px!important/);
  assert.match(css,/\.sidebar \.nav a\{[^}]*font-size:12px!important/);
  assert.match(mobile,/min-height:58px!important/);
});

test('mobile secondary copy focus and filters use explicit high-contrast states',()=>{
  assert.match(css,/\.page-head p,[\s\S]*color:var\(--tcc-mobile-muted\)!important/);
  assert.match(css,/\.mobile-nav a:focus-visible,\.mobile-nav button:focus-visible\{outline:3px solid #fff!important/);
  assert.match(css,/\.ux-filter-row button:not\(\.active\)[^{]*\{[^}]*color:var\(--tcc-mobile-body\)!important/);
  assert.match(css,/\.ux-filter-row button\.active\{[^}]*background:#86d2ff!important/);
  assert.match(css,/\.v38-impact-card li span\{[^}]*font-size:13px!important/);
});

test('contrast layer and current PWA shell stay packaged together',()=>{
  assert.match(sw,/titans-cc-brand-2026-v\d+/);
  assert.match(sw,/'\/readability-v34\.css'/);
  assert.match(sw,/'\/roster-filter-guard-v40\.js'/);
});
