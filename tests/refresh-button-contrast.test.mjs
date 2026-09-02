import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const css = fs.readFileSync(new URL('../readability-v34.css', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function ruleBodies(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]]+)\\}`, 'g'))].map((match) => match[1]);
}

function finalRule(selector) {
  const bodies = ruleBodies(selector);
  assert.ok(bodies.length, `missing CSS rule for ${selector}`);
  return bodies.at(-1);
}

function hexProperty(block, property) {
  const match = block.match(new RegExp(`${property}\\s*:\\s*(#[0-9a-f]{3,6})`, 'i'));
  assert.ok(match, `missing hexadecimal ${property}`);
  return match[1];
}

function rgb(hex) {
  const raw = hex.slice(1);
  const normalized = raw.length === 3 ? raw.split('').map((value) => value + value).join('') : raw;
  return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255);
}

function relativeLuminance(hex) {
  const channels = rgb(hex).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrast(a, b) {
  const lighter = Math.max(relativeLuminance(a), relativeLuminance(b));
  const darker = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

test('home refresh button keeps a visible accessible label', () => {
  assert.match(
    html,
    /<button[^>]+id="refresh-button"[^>]+aria-label="Refresh scoreboard"[^>]*>↻<\/button>/,
  );
});

test('home refresh button clears AA contrast in default and interaction states', () => {
  for (const selector of ['#refresh-button', '#refresh-button:hover', '#refresh-button:active']) {
    const block = finalRule(selector);
    const foreground = hexProperty(block, 'color');
    const background = hexProperty(block, 'background');
    assert.ok(
      contrast(foreground, background) >= 4.5,
      `${selector} foreground/background contrast must be at least 4.5:1`,
    );
  }

  const base = finalRule('#refresh-button');
  assert.ok(
    contrast(hexProperty(base, 'background'), '#06101c') >= 3,
    'refresh control boundary must remain distinguishable from the dark topbar',
  );
});

test('home refresh button exposes a strong keyboard focus treatment', () => {
  const focus = finalRule('#refresh-button:focus-visible');
  assert.match(focus, /outline\s*:\s*3px\s+solid\s+#fff\s*!important/i);
  assert.match(focus, /outline-offset\s*:\s*3px\s*!important/i);
});
