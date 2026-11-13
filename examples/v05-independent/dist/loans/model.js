(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RevezModel = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const TODAY = '2026-11-13';
  const clone = value => JSON.parse(JSON.stringify(value));
  const catalog = [
    { id: 'F01', name: 'Furadeira', status: 'available', loan: null, history: [] },
    { id: 'P02', name: 'Projetor', status: 'loaned', loan: { person: 'Lia', due: '2026-11-14' }, history: [{ kind: 'loan', date: null, person: 'Lia', due: '2026-11-14', initial: true }] },
    { id: 'M03', name: 'Máquina de costura', status: 'available', loan: null, history: [] },
    { id: 'C04', name: 'Caixa de som', status: 'loaned', loan: { person: 'Rui', due: '2026-11-10' }, history: [{ kind: 'loan', date: null, person: 'Rui', due: '2026-11-10', initial: true }] },
    { id: 'E05', name: 'Escada', status: 'maintenance', loan: null, history: [] }
  ];
  function fresh() { return { version: 1, objects: clone(catalog), lastOperation: null }; }
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T12:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function validateLoan(person, due) {
    const errors = {};
    if (!String(person || '').trim()) errors.person = 'Indique o nome da pessoa.';
    else if (String(person).trim().length > 80) errors.person = 'Use um nome com até 80 caracteres.';
    if (!validDate(due)) errors.due = 'Escolha uma data de devolução válida.';
    else if (due < TODAY) errors.due = 'A devolução deve ser em 13/11/2026 ou depois.';
    return errors;
  }
  function transact(state, id, kind, details) {
    const item = state.objects.find(item => item.id === id);
    if (!item) throw new Error('Objeto não encontrado.');
    if (kind === 'loan' && item.status !== 'available') throw new Error('Este objeto não está disponível para empréstimo.');
    if (kind === 'return' && item.status !== 'loaned') throw new Error('Este objeto não tem um empréstimo para devolver.');
    if (kind !== 'loan' && kind !== 'return') throw new Error('Operação desconhecida.');
    if (kind === 'loan' && Object.keys(validateLoan(details.person, details.due)).length) throw new Error('Reveja o nome e a data de devolução.');
    const next = clone(state);
    const updated = next.objects.find(item => item.id === id);
    if (kind === 'loan') {
      updated.status = 'loaned';
      updated.loan = { person: details.person.trim(), due: details.due };
      updated.history.unshift({ kind: 'loan', date: TODAY, ...updated.loan });
    } else {
      updated.history.unshift({ kind: 'return', date: TODAY, ...updated.loan });
      updated.status = 'available';
      updated.loan = null;
    }
    next.lastOperation = { label: `${kind === 'loan' ? 'Empréstimo' : 'Devolução'} de ${item.name}`, id, beforeObjects: clone(state.objects) };
    return next;
  }
  function undo(state) {
    if (!state.lastOperation) throw new Error('Não há uma operação para desfazer.');
    return { version: 1, objects: clone(state.lastOperation.beforeObjects), lastOperation: null };
  }
  function validObjects(objects) {
    if (!Array.isArray(objects) || objects.length !== catalog.length) return false;
    return catalog.every(base => {
      const object = objects.find(item => item && item.id === base.id);
      if (!object || object.name !== base.name || !['available', 'loaned', 'maintenance'].includes(object.status) || !Array.isArray(object.history)) return false;
      if (object.status === 'loaned' && (!object.loan || typeof object.loan.person !== 'string' || !object.loan.person.trim() || !validDate(object.loan.due))) return false;
      if (object.status !== 'loaned' && object.loan !== null) return false;
      return object.history.every(event => event && ['loan', 'return'].includes(event.kind) && (event.date === null || validDate(event.date)) && typeof event.person === 'string' && validDate(event.due));
    });
  }
  function decode(raw) {
    const state = JSON.parse(raw);
    if (!state || state.version !== 1 || !validObjects(state.objects)) throw new Error('Registo guardado inválido.');
    if (state.lastOperation !== null && (!state.lastOperation || !validObjects(state.lastOperation.beforeObjects) || typeof state.lastOperation.label !== 'string' || !catalog.some(item => item.id === state.lastOperation.id))) throw new Error('Última operação inválida.');
    return state;
  }
  function overdueDays(item) {
    return item.status === 'loaned' && item.loan.due < TODAY ? Math.round((new Date(TODAY+'T12:00:00Z') - new Date(item.loan.due+'T12:00:00Z')) / 86400000) : 0;
  }
  function search(objects, query, filter) {
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt');
    const term = normalize(query.trim());
    return objects.filter(item => (filter === 'all' || item.status === filter) && normalize(item.name+' '+item.id).includes(term));
  }
  return { TODAY, fresh, validDate, validateLoan, transact, undo, decode, overdueDays, search };
});
