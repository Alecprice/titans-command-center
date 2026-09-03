import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const smoke=fs.readFileSync(new URL('../scripts/account-browser-smoke.py',import.meta.url),'utf8');

test('TENX production Account smoke gates the real password reveal lifecycle',()=>{
  assert.match(smoke,/stage='password-initial'/);
  assert.match(smoke,/stage='password-reveal'/);
  assert.match(smoke,/stage='password-hide'/);
  assert.match(smoke,/find_element\(By\.CSS_SELECTOR,'\[data-account-password-toggle\]'\)\.click\(\)/);
  assert.match(smoke,/wait_password_control\(d,'text','Hide','current-password'\)/);
  assert.match(smoke,/wait_password_control\(d,'password','Show','current-password'\)/);
});

test('TENX production Account smoke rejects the conflicting aria-pressed semantic',()=>{
  assert.match(smoke,/pressed:toggle\.getAttribute\('aria-pressed'\)/);
  assert.match(smoke,/password_initial\['pressed'\] is not None/);
  assert.match(smoke,/password_revealed\['pressed'\] is not None/);
  assert.match(smoke,/password_hidden\['pressed'\] is not None/);
});

test('TENX production Account smoke verifies accessible name label ownership and touch geometry',()=>{
  assert.match(smoke,/name:toggle\.getAttribute\('aria-label'\)/);
  assert.match(smoke,/controls:toggle\.getAttribute\('aria-controls'\)/);
  assert.match(smoke,/fieldLabel:fieldLabel\?\.textContent\?\.trim\(\)\|\|''/);
  assert.match(smoke,/r\.width<44\|\|r\.height<48/);
  assert.match(smoke,/password_initial\['name'\]!='Show password'/);
  assert.match(smoke,/password_revealed\['name'\]!='Hide password'/);
  assert.match(smoke,/password_initial\['controls'\]!=password_initial\['inputId'\]/);
  assert.match(smoke,/password_initial\['fieldLabel'\]!='Password'/);
});

test('TENX production Account smoke proves sign-in and sign-up autocomplete survive remounts',()=>{
  assert.match(smoke,/stage='password-signup-remount'/);
  assert.match(smoke,/wait_password_control\(d,'password','Show','new-password'\)/);
  assert.match(smoke,/stage='password-signin-remount'/);
  assert.match(smoke,/wait_password_control\(d,'password','Show','current-password'\)/);
});

test('TENX production password smoke never submits credentials or records the test password',()=>{
  assert.match(smoke,/send_keys\('SmokePass123!'\)/);
  assert.match(smoke,/valueLength:input\.value\.length/);
  assert.doesNotMatch(smoke,/passwordInitial[^\n]*value:/);
  assert.doesNotMatch(smoke,/\.submit\(\)/);
});
