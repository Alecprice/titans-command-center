import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const responsive=fs.readFileSync(new URL('../scripts/responsive-matrix-smoke.py',import.meta.url),'utf8');
const readability=fs.readFileSync(new URL('../scripts/readability-browser-smoke.py',import.meta.url),'utf8');

for(const [name,source] of [['responsive',responsive],['readability',readability]]){
  test(`${name} audit waits for the hydrated Fantasy route instead of a generic heading`,()=>{
    assert.match(source,/ROUTE_READY_SELECTORS=\{/);
    assert.match(source,/'fantasy':'#app\[data-fantasy-command="ready"\]'/);
    assert.match(source,/location\.hash!==expected/);
    assert.match(source,/if\(selector\)return Boolean\(document\.querySelector\(selector\)\)/);
    assert.match(source,/'stage':current/);
  });
}

test('readability audit alpha-composites translucent ancestor backgrounds before WCAG contrast math',()=>{
  assert.match(readability,/const composite=\(fg,bg\)=>/);
  assert.match(readability,/if\(bg&&bg\.a>0\)layers\.push\(bg\)/);
  assert.match(readability,/for\(let i=layers\.length-1;i>=0;i--\)result=composite\(layers\[i\],result\)/);
  assert.match(readability,/const required=large\?3:4\.5/,'WCAG thresholds must remain unchanged');
  assert.match(readability,/backgroundImage&&s\.backgroundImage!==['"]none['"]/,'complex image backgrounds remain skipped instead of guessed');
});
