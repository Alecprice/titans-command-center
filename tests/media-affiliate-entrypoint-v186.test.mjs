import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Listen / Watch loads the 2026 Titans Radio affiliate finder in the document shell', async () => {
  const [html, sw, affiliates] = await Promise.all([
    read('index.html'),
    read('sw.js'),
    read('media-affiliates-v14.js')
  ]);

  assert.match(html, /<script type="module" src="\/media-affiliates-v14\.js\?v=3"><\/script>/);
  assert.match(sw, /['"]\/media-affiliates-v14\.js['"]/);
  assert.match(affiliates, /Updated for 2026/);
  assert.match(affiliates, /WIKQ/);
  assert.match(affiliates, /Greeneville/);
  assert.match(affiliates, /Digital game audio remains subject to NFL geographic and device restrictions/);
  assert.match(affiliates, /noopener noreferrer/);
});
