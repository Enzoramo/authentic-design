(function (root) {
  'use strict';
  const KEY = 'quintal.reservas.v1';
  const places = Object.freeze({
    biblioteca: Object.freeze({ name: 'Biblioteca do bairro', time: 'Sábado, 10–12h' }),
    horta: Object.freeze({ name: 'Horta da escola', time: 'Domingo, 9–11h' })
  });
  const lots = Object.freeze([
    Object.freeze({ id: 'tomate', name: 'Tomate cereja', initial: 6, seeds: 12, donor: 'Ana', place: 'biblioteca' }),
    Object.freeze({ id: 'manjericao', name: 'Manjericão', initial: 3, seeds: 20, donor: 'Rui', place: 'horta' }),
    Object.freeze({ id: 'girassol', name: 'Girassol', initial: 5, seeds: 8, donor: 'Lia', place: 'biblioteca' }),
    Object.freeze({ id: 'coentro', name: 'Coentro', initial: 0, seeds: 30, donor: 'Bia', place: 'horta' })
  ]);
  const lotById = id => lots.find(lot => lot.id === id);
  function available(id, reservations) {
    const lot = lotById(id);
    if (!lot) throw new Error('Lote desconhecido.');
    return lot.initial - reservations.filter(r => r.lotId === id).reduce((sum, r) => sum + r.quantity, 0);
  }
  function validate(reservations) {
    if (!Array.isArray(reservations)) throw new Error('Reservas inválidas.');
    const seen = new Set();
    const clean = reservations.map(r => {
      if (!r || typeof r.id !== 'string' || !/^q-[a-z0-9-]{1,80}$/.test(r.id) || seen.has(r.id) || !lotById(r.lotId) || !Number.isInteger(r.quantity) || r.quantity < 1) throw new Error('Reserva inválida.');
      seen.add(r.id);
      return { id: r.id, lotId: r.lotId, quantity: r.quantity };
    });
    if (lots.some(lot => available(lot.id, clean) < 0)) throw new Error('Disponibilidade inválida.');
    return clean;
  }
  function read(storage) {
    const raw = storage.getItem(KEY);
    if (!raw) return [];
    const state = JSON.parse(raw);
    if (state.version !== 1) throw new Error('Formato de reservas desconhecido.');
    return validate(state.reservations);
  }
  function save(storage, reservations) {
    storage.setItem(KEY, JSON.stringify({ version: 1, reservations: validate(reservations) }));
  }
  function reserve(reservations, lotId, quantity, id) {
    validate(reservations);
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Escolha um número inteiro de envelopes, a partir de 1.');
    const stock = available(lotId, reservations);
    if (quantity > stock) throw new Error(stock === 0 ? 'Este lote já não tem envelopes disponíveis.' : `Pode reservar até ${stock} ${stock === 1 ? 'envelope' : 'envelopes'} deste lote.`);
    return validate([...reservations, { id, lotId, quantity }]);
  }
  function cancel(reservations, id) {
    validate(reservations);
    if (!reservations.some(r => r.id === id)) throw new Error('Esta reserva já não está ativa.');
    return reservations.filter(r => r.id !== id);
  }
  function normalize(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  function search(query, place, reservations) {
    return lots.filter(lot => normalize(lot.name).includes(normalize(query)) && (place === 'all' || lot.place === place));
  }
  root.QuintalModel = Object.freeze({ KEY, lots, places, lotById, available, validate, read, save, reserve, cancel, search });
})(globalThis);
