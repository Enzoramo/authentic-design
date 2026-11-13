/* Verificação local opcional: node verify.js. Não é necessário para abrir o produto. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const S = require('./story.js');
let completePaths = 0;
function visit(state) {
  for (const choice of S.current(state).choices) {
    const next = S.choose(state, choice.to);
    assert.deepEqual(S.back(next).path, state.path);
    assert.deepEqual(S.normalize(JSON.parse(JSON.stringify(next))), next);
    visit(next);
  }
  if (!S.current(state).choices.length) {
    completePaths++;
    assert.ok(['vozes', 'partilha', 'guardia'].includes(state.path.at(-1)));
  }
}
visit(S.fresh());
assert.equal(completePaths, 8);
const enlarged = { ...S.choose(S.fresh(), 'tomas'), size: 130 };
assert.equal(S.restart(enlarged).size, 130);
assert.deepEqual(S.restart(enlarged).path, ['inicio']);
assert.deepEqual(S.choose(S.fresh(), 'vozes'), S.fresh());
assert.deepEqual(S.normalize({version:1,path:['inicio','armario','vozes'],size:115}).path, ['inicio','armario']);
assert.deepEqual(S.normalize(null), S.fresh());
assert.equal(S.normalize({version:1,path:['inicio'],size:900}).size, 100);
const source = fs.readFileSync(`${__dirname}/persistence.js`, 'utf8');
let raw = null;
const context = {localStorage:{getItem:()=>raw,setItem:(_, value)=>{raw=value;}}};
vm.createContext(context); vm.runInContext(source, context);
assert.equal(context.VeredaPersistence.read().value, null);
assert.equal(context.VeredaPersistence.write(enlarged), true);
assert.deepEqual(JSON.parse(JSON.stringify(context.VeredaPersistence.read().value)), enlarged);
raw = '{invalid JSON';
assert.equal(context.VeredaPersistence.read().recovered, true);
const blocked = { localStorage:{getItem:()=>{throw new Error('blocked');},setItem:()=>{throw new Error('blocked');}}};
vm.createContext(blocked); vm.runInContext(source, blocked);
assert.equal(blocked.VeredaPersistence.read().available, false);
assert.equal(blocked.VeredaPersistence.write(S.fresh()), false);
console.log('PASS: 8 percursos completos; voltar; serialização; escolhas inválidas; reinício mantém tamanho; estado inválido; persistência válida, corrompida e indisponível.');
