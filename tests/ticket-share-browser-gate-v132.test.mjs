import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const smoke=await readFile(new URL('../scripts/tickets-browser-smoke.py',import.meta.url),'utf8');

test('Ticket production smoke exercises both safe Share plan paths',()=>{
  assert.ok(smoke.includes("mode='clipboard' if mobile else 'native'"));
  assert.ok(smoke.includes("Object.defineProperty(navigator,'share'"));
  assert.ok(smoke.includes("Object.defineProperty(navigator,'clipboard'"));
  assert.ok(smoke.includes('window.__ticketShareCapture'));
  assert.ok(smoke.includes('[data-ticket-center] [data-ticket-compare-share]'));
  assert.ok(smoke.includes("'sharePlanVerified':True"));
  assert.ok(smoke.includes("'shareMode':share_result['mode']"));
});

test('Share browser gate proves payload truth without inventing a recommendation',()=>{
  for(const phrase of [
    'Tennessee Titans ticket shortlist',
    '3 tickets:',
    'before fees',
    'Browser-observed movement:',
    'Seat quality and checkout fees are not inferred.',
    'Open Ticket Center:',
    '#tickets'
  ])assert.ok(smoke.includes(phrase),`missing share truth check: ${phrase}`);

  for(const phrase of ['deal score','buy now','wait to buy','guaranteed deal']){
    assert.ok(smoke.includes(phrase),`missing forbidden share-copy guard: ${phrase}`);
  }
});

test('Share browser gate is read-only and verifies accessible mobile geometry',()=>{
  assert.ok(smoke.includes('Share plan mutated shortlist count'));
  assert.ok(smoke.includes("state['share']['height']<44"));
  assert.ok(smoke.includes("state['share']['left']<-1"));
  assert.ok(smoke.includes("state['share']['right']>state['viewport']+1"));
  assert.ok(smoke.includes('copied to your clipboard'));
  assert.ok(smoke.includes('shared your saved ticket center plan'));
  assert.ok(smoke.includes("'shareDestinationVerified':share_result['destinationVerified']"));
});
