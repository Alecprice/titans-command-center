import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const profileCss=fs.readFileSync(new URL('../player-polish.css',import.meta.url),'utf8');
const intelCss=fs.readFileSync(new URL('../player-intelligence-v16.css',import.meta.url),'utf8');

test('TENX Player profile makes source navigation and metadata readable on phones',()=>{
  assert.match(profileCss,/TENX v133 · Player Intelligence phone readability/);
  assert.match(profileCss,/\.player-back-row a\{display:inline-flex;align-items:center;min-height:44px;font-size:12px/);
  assert.match(profileCss,/\.player-source-line\{margin-top:16px;font-size:12px;line-height:1\.5/);
  assert.match(profileCss,/\.player-fact-grid small\{font-size:11px/);
  assert.match(profileCss,/\.player-fact-grid strong\{font-size:14px/);
  assert.match(profileCss,/\.player-context-meta\{font-size:12px/);
});

test('TENX Player stat, injury, and market rows clear the phone type floor',()=>{
  assert.match(profileCss,/\.player-data-empty p\{font-size:13px;line-height:1\.6\}/);
  assert.match(profileCss,/\.player-data-list small,\.player-market-list small\{font-size:11px/);
  assert.match(profileCss,/\.player-data-list strong,\.player-market-list strong\{font-size:13px/);
  assert.match(profileCss,/\.player-data-list article>span\{font-size:12px/);
  assert.match(profileCss,/\.player-market-note\{font-size:12px;line-height:1\.55\}/);
});

test('TENX Player narrow-phone layout wraps long identity and stacks dense rows',()=>{
  assert.match(profileCss,/@media\(max-width:430px\)/);
  assert.match(profileCss,/\.player-rich-copy h1\{font-size:clamp\(28px,10vw,42px\);line-height:1;overflow-wrap:anywhere\}/);
  assert.match(profileCss,/\.player-rich-copy>p\{font-size:13px/);
  assert.match(profileCss,/\.player-data-list article,\.player-market-list article\{display:grid;grid-template-columns:minmax\(0,1fr\)/);
  assert.match(profileCss,/\.player-back-row a\{width:100%;min-height:48px\}/);
});

test('TENX audited Player Command keeps tabs and source-backed copy readable',()=>{
  assert.match(intelCss,/TENX v133 · audited Player Command phone readability/);
  assert.match(intelCss,/\.v16-player-command p,\.v16-panel p,\.v16-note,\.v16-empty/);
  assert.match(intelCss,/font-size:13px;line-height:1\.55/);
  assert.match(intelCss,/\.v16-quick-grid small,\.v16-player-changed small/);
  assert.match(intelCss,/font-size:12px;line-height:1\.35/);
  assert.match(intelCss,/\.v16-player-tabs\{scroll-snap-type:x proximity/);
  assert.match(intelCss,/\.v16-player-tabs button\{flex:0 0 auto;min-height:48px;font-size:13px/);
  assert.match(intelCss,/\.v16-panel a,\.v16-player-pane a\{display:inline-flex;align-items:center;min-height:44px/);
});

test('TENX Player styles retain reduced-motion and high-contrast safeguards',()=>{
  assert.match(profileCss,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(profileCss,/@media\(prefers-contrast:more\)/);
  assert.match(intelCss,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(intelCss,/@media\(prefers-contrast:more\)/);
});