'use strict';
// Code-level checks only. These do not launch a browser.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
vm.runInThisContext(fs.readFileSync(path.join(__dirname, 'model.js'), 'utf8'));
const M = globalThis.QuintalModel;
let checked = 0;
function check(name, run) { run(); checked++; console.log(`PASS ${name}`); }
const fakeStorage = () => {
  const map = new Map();
  return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) };
};
check('Dados exatos do brief e disponibilidade inicial', () => {
  assert.deepEqual(M.lots.map(lot => [lot.name, lot.initial, lot.seeds, lot.donor, lot.place]), [
    ['Tomate cereja', 6, 12, 'Ana', 'biblioteca'], ['Manjericão', 3, 20, 'Rui', 'horta'],
    ['Girassol', 5, 8, 'Lia', 'biblioteca'], ['Coentro', 0, 30, 'Bia', 'horta']
  ]);
  assert.equal(M.lots.reduce((sum, lot) => sum + M.available(lot.id, []), 0), 14);
  assert.equal(M.places.biblioteca.name, 'Biblioteca do bairro');
  assert.equal(M.places.biblioteca.time, 'Sábado, 10–12h');
  assert.equal(M.places.horta.time, 'Domingo, 9–11h');
});
check('Reserva reduz disponibilidade sem alterar os dados anteriores', () => {
  const before = [];
  const after = M.reserve(before, 'tomate', 2, 'q-test-1');
  assert.equal(before.length, 0);
  assert.equal(after.length, 1);
  assert.equal(M.available('tomate', after), 4);
});
check('Recusa quantidades acima do stock, zero, negativas, fracionárias e não numéricas', () => {
  [7, 0, -1, 1.5, NaN, Infinity, '2'].forEach(quantity => assert.throws(() => M.reserve([], 'tomate', quantity, 'q-test-2')));
  assert.throws(() => M.reserve([], 'coentro', 1, 'q-test-3'));
});
check('Reservas sucessivas respeitam a disponibilidade total', () => {
  let state = M.reserve([], 'girassol', 2, 'q-test-4');
  state = M.reserve(state, 'girassol', 3, 'q-test-5');
  assert.equal(M.available('girassol', state), 0);
  assert.throws(() => M.reserve(state, 'girassol', 1, 'q-test-6'));
});
check('Cancelamento restitui exatamente a quantidade reservada', () => {
  let state = M.reserve([], 'manjericao', 2, 'q-test-7');
  state = M.reserve(state, 'manjericao', 1, 'q-test-8');
  state = M.cancel(state, 'q-test-7');
  assert.equal(M.available('manjericao', state), 2);
  assert.equal(state.length, 1);
  assert.throws(() => M.cancel(state, 'q-missing'));
});
check('Guardar e recarregar preserva reservas e disponibilidade', () => {
  const storage = fakeStorage();
  const state = M.reserve([], 'tomate', 4, 'q-test-9');
  M.save(storage, state);
  const restored = M.read(storage);
  assert.deepEqual(restored, state);
  assert.equal(M.available('tomate', restored), 2);
  M.save(storage, M.cancel(restored, 'q-test-9'));
  assert.equal(M.available('tomate', M.read(storage)), 6);
});
check('Pesquisa tolera maiúsculas e acentos e combina com ponto de retirada', () => {
  assert.deepEqual(M.search('MANJERICAO', 'all', []).map(lot => lot.id), ['manjericao']);
  assert.deepEqual(M.search('tomate', 'horta', []), []);
  assert.equal(M.search('', 'biblioteca', []).length, 2);
  assert.equal(M.search('inexistente', 'all', []).length, 0);
});
check('Estado guardado corrompido ou acima da capacidade é rejeitado', () => {
  const storage = fakeStorage();
  storage.setItem(M.KEY, '{broken'); assert.throws(() => M.read(storage));
  storage.setItem(M.KEY, JSON.stringify({ version: 1, reservations: [{ id: 'q-test-10', lotId: 'tomate', quantity: 20 }] })); assert.throws(() => M.read(storage));
  assert.throws(() => M.validate([{ id: '<script>', lotId: 'tomate', quantity: 1 }]));
  assert.throws(() => M.validate([{ id: 'q-test-10', lotId: 'other', quantity: 1 }]));
  assert.throws(() => M.validate([{ id: 'q-test-10', lotId: 'tomate', quantity: 1 }, { id: 'q-test-10', lotId: 'tomate', quantity: 1 }]));
});
check('Falha de armazenamento não é apresentada pelo modelo como sucesso', () => {
  assert.throws(() => M.save({ setItem: () => { throw new Error('quota'); } }, M.reserve([], 'tomate', 1, 'q-test-11')));
});
check('Todos os recursos usados existem localmente', () => {
  ['styles.css', 'model.js', 'app.js', ...M.lots.map(lot => `assets/${lot.id}.svg`)].forEach(file => assert.ok(fs.existsSync(path.join(__dirname, file)), file));
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.ok(!/https?:\/\//.test(html));
  assert.ok(html.includes('<html lang="pt">'));
  assert.ok(html.includes('<dialog'));
  assert.ok(html.includes('name="viewport"'));
});
function luminance(hex) {
  const rgb = hex.match(/\w\w/g).map(v => parseInt(v, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
check('Contraste dos principais pares de texto é pelo menos 4.5:1', () => {
  [['243e30', 'f6f3e9'], ['5d675c', 'f6f3e9'], ['fffdf6', '294b3a'], ['e1e7d8', '294b3a'], ['5d675c', 'e9eddf'], ['9b312a', 'fffdf6'], ['ffffff', '9b312a']].forEach(([text, background]) => {
    const a = luminance(text), b = luminance(background);
    const contrast = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    assert.ok(contrast >= 4.5, `${text}/${background}: ${contrast}`);
    console.log(`  ${text}/${background}: ${contrast.toFixed(2)}:1`);
  });
});
console.log(`\n${checked} verificações de código concluídas. Renderização e interação no navegador não verificadas.`);
