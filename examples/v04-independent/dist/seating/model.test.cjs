const assert = require('node:assert/strict');
const test = require('node:test');
const M = require('./model.js');
function fill(table, ids, start = M.initial()) {
  return ids.reduce((map, id) => { const result = M.assign(map, id, table); assert.equal(result.ok, true); return result.map; }, start);
}
test('todos os convidados começam sem mesa; capacidades são 4, 4 e 3', () => {
  assert.equal(M.guests.length, 10);
  assert.equal(M.seatedCount(M.initial()), 0);
  assert.deepEqual(M.tables.map(t => t.capacity), [4, 4, 3]);
});
test('atribuir, mudar e retirar atualiza uma única pessoa', () => {
  let map = M.assign(M.initial(), 'ana', 1).map;
  map = M.assign(map, 'ana', 2).map;
  assert.equal(M.members(map, 1).length, 0);
  assert.deepEqual(M.members(map, 2).map(g => g.id), ['ana']);
  map = M.assign(map, 'ana', null).map;
  assert.deepEqual(map, M.initial());
});
test('mesa cheia recusa a quinta pessoa sem alterar nenhuma atribuição', () => {
  const map = fill(1, ['ana', 'beto', 'caio', 'dora']);
  const previous = M.serialize(map);
  const result = M.assign(map, 'elisa', 1);
  assert.equal(result.code, 'full');
  assert.strictEqual(result.map, map);
  assert.equal(M.serialize(map), previous);
  assert.equal(map.elisa, null);
});
test('mudar para mesa cheia mantém a pessoa na mesa de origem', () => {
  const map = fill(2, ['elisa'], fill(1, ['ana', 'beto', 'caio', 'dora']));
  const result = M.assign(map, 'elisa', 1);
  assert.equal(result.ok, false);
  assert.equal(result.map.elisa, 2);
  assert.equal(M.members(result.map, 1).length, 4);
});
test('mesa 3 tem limite de três, e uma pessoa pode manter a sua mesa cheia', () => {
  const map = fill(3, ['ana', 'beto', 'caio']);
  assert.equal(M.assign(map, 'dora', 3).ok, false);
  assert.equal(M.assign(map, 'ana', 3).ok, true);
  assert.equal(M.assign(map, 'ana', 3).changed, false);
});
test('há onze lugares para dez pessoas e a distribuição completa é possível', () => {
  const map = fill(3, ['ines', 'joao'], fill(2, ['elisa', 'fabio', 'gabi', 'hugo'], fill(1, ['ana', 'beto', 'caio', 'dora'])));
  assert.equal(M.seatedCount(map), 10);
  assert.equal(M.findGuests(map, '', true).length, 0);
  assert.deepEqual(M.tables.map(t => M.members(map, t.id).length), [4, 4, 2]);
});
test('serialização e recarga preservam o mapa completo', () => {
  const map = fill(3, ['ines', 'joao'], fill(1, ['ana', 'beto']));
  assert.deepEqual(M.restore(M.serialize(map)).map, map);
  assert.equal(M.restore(M.serialize(map)).fresh, false);
  assert.equal(M.restore(null).fresh, true);
});
test('dados inválidos e capacidade corrompida não entram no mapa', () => {
  assert.equal(M.restore('{').ok, false);
  assert.equal(M.restore('{"version":1,"assignments":{}}').ok, false);
  assert.equal(M.restore(M.serialize({ ...M.initial(), ana: 9 })).ok, false);
  const overfull = { ...M.initial(), ana: 3, beto: 3, caio: 3, dora: 3 };
  assert.equal(M.restore(M.serialize(overfull)).ok, false);
});
test('pesquisa ignora acentos e filtra pessoas sem lugar', () => {
  const map = M.assign(M.initial(), 'joao', 1).map;
  assert.equal(M.findGuests(map, 'joao')[0].name, 'João');
  assert.equal(M.findGuests(map, ' inês ')[0].name, 'Inês');
  assert.equal(M.findGuests(map, 'joao', true).length, 0);
  assert.equal(M.findGuests(map, 'fabi')[0].name, 'Fábio');
  assert.equal(M.findGuests(map, 'ninguém').length, 0);
});
test('destinos e pessoas desconhecidos não mudam o mapa', () => {
  const map = M.initial();
  assert.equal(M.assign(map, 'ana', 9).ok, false);
  assert.equal(M.assign(map, 'outra', 1).ok, false);
  assert.deepEqual(map, M.initial());
});
