import assert from 'node:assert/strict';
import { INGREDIENTS, STEPS, initialState, normaliseState, quantities, updateState } from './model.mjs';

let count = 0;
function check(name, fn) { fn(); count++; console.log(`✓ ${name}`); }
check('Quantidades exatas para 2, 4 e 6 pessoas e plurais', () => {
  assert.deepEqual(quantities(2).map(i => i.amount), [180, 250, 600, 1, 1, 15, 5]);
  assert.deepEqual(quantities(4).map(i => i.amount), [360, 500, 1200, 2, 2, 30, 10]);
  assert.deepEqual(quantities(6).map(i => i.amount), [540, 750, 1800, 3, 3, 45, 15]);
  assert.equal(quantities(2)[3].unit, 'unidade'); assert.equal(quantities(4)[3].unit, 'unidades');
  assert.equal(quantities(2)[4].unit, 'dente'); assert.equal(quantities(6)[4].unit, 'dentes');
});
check('Ingredientes assinalados mantêm-se ao alterar pessoas', () => {
  let s = updateState(initialState(), { type: 'ingredient', id: 'arroz' });
  s = updateState(s, { type: 'servings', value: 6 });
  assert.deepEqual(s.checked, ['arroz']); assert.equal(s.servings, 6);
  s = updateState(s, { type: 'ingredient', id: 'arroz' }); assert.deepEqual(s.checked, []);
});
check('Percurso completo exige conclusão explícita do quarto passo', () => {
  let s = updateState(initialState(), { type: 'start' });
  for (let i = 0; i < 3; i++) s = updateState(s, { type: 'advance' });
  assert.equal(s.phase, 'cook'); assert.equal(s.step, 3); assert.equal(s.completed, 3);
  s = updateState(s, { type: 'advance' });
  assert.equal(s.phase, 'done'); assert.equal(s.completed, 4);
});
check('Voltar e rever preservam os passos concluídos', () => {
  let s = updateState(initialState(), { type: 'start' });
  s = updateState(s, { type: 'advance' }); s = updateState(s, { type: 'advance' });
  s = updateState(s, { type: 'back' });
  assert.equal(s.step, 1); assert.equal(s.completed, 2);
  s = updateState(s, { type: 'visit', step: 0 }); assert.equal(s.step, 0); assert.equal(s.completed, 2);
  const blocked = updateState(s, { type: 'visit', step: 3 }); assert.equal(blocked.step, 0);
});
check('Estado serializado retoma pessoas, ingredientes e passo', () => {
  let s = updateState(initialState(4), { type: 'ingredient', id: 'cebola' });
  s = updateState(s, { type: 'start' }); s = updateState(s, { type: 'advance' });
  assert.deepEqual(normaliseState(JSON.parse(JSON.stringify(s))), s);
  for (let i = 0; i < 3; i++) s = updateState(s, { type: 'advance' });
  assert.deepEqual(normaliseState(JSON.parse(JSON.stringify(s))), s);
});
check('Recomeçar limpa preparação e preserva pessoas', () => {
  let s = updateState(initialState(6), { type: 'ingredient', id: 'salsa' });
  s = updateState(s, { type: 'start' }); s = updateState(s, { type: 'advance' });
  assert.deepEqual(updateState(s, { type: 'restart' }), initialState(6));
});
check('Estado inválido é limitado sem introduzir ingredientes arbitrários', () => {
  assert.deepEqual(normaliseState(null), initialState());
  const s = normaliseState({version:1,servings:9,checked:['arroz','arroz','x'],phase:'cook',step:99,completed:2});
  assert.equal(s.servings,2); assert.deepEqual(s.checked,['arroz']); assert.equal(s.step,2);
  assert.equal(updateState(initialState(),{type:'advance'}).phase,'gather');
});
check('Receita contém os sete ingredientes e os quatro passos fornecidos', () => {
  assert.equal(INGREDIENTS.length, 7); assert.equal(STEPS.length,4);
  assert.match(STEPS[1].text,/3 minutos.*4 minutos/); assert.match(STEPS[2].text,/15 minutos/);
  assert.match(STEPS[3].text,/repousar 2 minutos/);
});
console.log(`${count} verificações de lógica concluídas. Sem navegador ou testes visuais.`);
