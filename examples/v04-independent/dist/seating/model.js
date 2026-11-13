/* Véspera: regras independentes da apresentação. Sem dependências. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VesperaModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const guests = Object.freeze([
    { id: 'ana', name: 'Ana' }, { id: 'beto', name: 'Beto' },
    { id: 'caio', name: 'Caio' }, { id: 'dora', name: 'Dora' },
    { id: 'elisa', name: 'Elisa' }, { id: 'fabio', name: 'Fábio' },
    { id: 'gabi', name: 'Gabi' }, { id: 'hugo', name: 'Hugo' },
    { id: 'ines', name: 'Inês' }, { id: 'joao', name: 'João' }
  ].map(Object.freeze));
  const tables = Object.freeze([
    { id: 1, capacity: 4 }, { id: 2, capacity: 4 }, { id: 3, capacity: 3 }
  ].map(Object.freeze));
  const storageKey = 'vespera-family-seating-v1';
  const initial = () => Object.fromEntries(guests.map(guest => [guest.id, null]));
  const members = (map, tableId) => guests.filter(guest => map[guest.id] === tableId);
  const seatedCount = map => guests.filter(guest => map[guest.id] !== null).length;
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt');
  const findGuests = (map, search = '', unseatedOnly = false) => guests.filter(guest =>
    (!unseatedOnly || map[guest.id] === null) && normalize(guest.name).includes(normalize(search).trim())
  );
  function assign(map, guestId, tableId) {
    if (!guests.some(guest => guest.id === guestId)) return { ok: false, code: 'guest', map };
    if (tableId !== null && !tables.some(table => table.id === tableId)) return { ok: false, code: 'table', map };
    if (map[guestId] === tableId) return { ok: true, changed: false, map };
    const target = tables.find(table => table.id === tableId);
    if (target && members(map, tableId).length >= target.capacity) return { ok: false, code: 'full', map, tableId };
    return { ok: true, changed: true, map: { ...map, [guestId]: tableId } };
  }
  function serialize(map) { return JSON.stringify({ version: 1, assignments: map }); }
  function restore(raw) {
    if (raw === null) return { ok: true, map: initial(), fresh: true };
    try {
      const data = JSON.parse(raw);
      if (data.version !== 1 || !data.assignments || typeof data.assignments !== 'object') throw new Error('shape');
      const map = initial();
      for (const guest of guests) {
        const value = data.assignments[guest.id];
        if (value !== null && !tables.some(table => table.id === value)) throw new Error('assignment');
        map[guest.id] = value;
      }
      if (tables.some(table => members(map, table.id).length > table.capacity)) throw new Error('capacity');
      return { ok: true, map, fresh: false };
    } catch (_) { return { ok: false, map: initial(), code: 'corrupt' }; }
  }
  return Object.freeze({ guests, tables, storageKey, initial, members, seatedCount, findGuests, assign, serialize, restore });
});
