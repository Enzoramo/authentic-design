const assert = require('node:assert/strict');
const model = require('./score-model.js');
const repeated = (player, count) => Array(count).fill(player);
let checks = 0;
function check(name, fn) { fn(); checks += 1; console.log('OK: ' + name); }

check('começa sem pontos e sem sets', () => {
  assert.deepEqual(model.summarize([]), { points:[0,0],sets:[0,0],completed:[],winner:null,setNumber:1 });
});
check('qualquer jogador recebe um ponto, sem alterar o histórico original', () => {
  const events = [];
  assert.deepEqual(model.add(events, 0), [0]);
  assert.deepEqual(model.add(events, 1), [1]);
  assert.deepEqual(events, []);
});
check('11–0 fecha o set e prepara o segundo', () => {
  const state = model.summarize(repeated(0,11));
  assert.deepEqual(state.points,[0,0]);
  assert.deepEqual(state.sets,[1,0]);
  assert.deepEqual(state.completed,[{points:[11,0],winner:0}]);
  assert.equal(state.setNumber,2);
});
check('10–10 e 11–10 mantêm o set; 12–10 fecha', () => {
  const draw = repeated(0,10).concat(repeated(1,10));
  assert.equal(model.summarize(draw).completed.length,0);
  assert.deepEqual(model.summarize(model.add(draw,0)).points,[11,10]);
  const won = model.summarize(draw.concat(0,0));
  assert.deepEqual(won.completed[0].points,[12,10]);
});
check('vantagens prolongadas e vitória de Ivo', () => {
  const draw = repeated(0,10).concat(repeated(1,10));
  for(let i=0;i<20;i++) draw.push(0,1);
  const state = model.summarize(draw.concat(1,1));
  assert.deepEqual(state.completed[0],{points:[30,32],winner:1});
});
check('desfazer o ponto final reabre o set anterior', () => {
  const state = model.summarize(model.undo(repeated(0,11)));
  assert.deepEqual(state.points,[10,0]);
  assert.deepEqual(state.sets,[0,0]);
  assert.equal(state.setNumber,1);
  assert.equal(state.completed.length,0);
});
check('desfazer atravessa o início do set seguinte', () => {
  const events = repeated(0,11).concat(1);
  const once = model.undo(events);
  assert.deepEqual(model.summarize(once).points,[0,0]);
  assert.deepEqual(model.summarize(model.undo(once)).points,[10,0]);
});
check('a partida termina aos dois sets e não aceita pontos adicionais', () => {
  const events = repeated(0,22);
  const state = model.summarize(events);
  assert.equal(state.winner,0);
  assert.deepEqual(state.sets,[2,0]);
  assert.deepEqual(model.add(events,1),events);
});
check('desfazer a vitória da partida reabre o set decisivo', () => {
  const state = model.summarize(model.undo(repeated(0,22)));
  assert.equal(state.winner,null);
  assert.deepEqual(state.sets,[1,0]);
  assert.deepEqual(state.points,[10,0]);
  assert.equal(state.setNumber,2);
});
check('partida em três sets conserva a súmula pela ordem', () => {
  const events = repeated(1,11).concat(repeated(0,11),repeated(1,11));
  const state = model.summarize(events);
  assert.equal(state.winner,1);
  assert.deepEqual(state.sets,[1,2]);
  assert.deepEqual(state.completed.map(set => set.winner),[1,0,1]);
  assert.equal(state.setNumber,3);
});
check('serialização recupera o mesmo resultado e permite desfazer', () => {
  const events = repeated(1,11).concat(0,0,1);
  const restored = model.parse(model.serialize(events));
  assert.deepEqual(model.summarize(restored),model.summarize(events));
  assert.deepEqual(model.summarize(model.undo(restored)).points,[2,0]);
});
check('registos inválidos e pontos após a vitória são rejeitados', () => {
  for(const invalid of ['{','null','{}','{"version":2,"points":[]}','{"version":1,"points":[2]}','{"version":1,"points":["0"]}']) assert.throws(()=>model.parse(invalid));
  assert.throws(()=>model.parse(JSON.stringify({version:1,points:repeated(0,23)})));
  assert.deepEqual(model.undo([]),[]);
});
console.log(`${checks} verificações concluídas.`);
