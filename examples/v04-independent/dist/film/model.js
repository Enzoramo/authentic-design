(function (root) {
  'use strict';
  const STAGES = Object.freeze([
    { id: 'recebido', label: 'Recebido' },
    { id: 'revelacao', label: 'Em revelação' },
    { id: 'digitalizando', label: 'Digitalizando' },
    { id: 'pronto', label: 'Pronto' }
  ]);
  const ORDERS = Object.freeze([
    { id: 'R-104', name: 'Marina', format: '35 mm', frames: 36, stage: 0, note: '' },
    { id: 'R-105', name: 'Tiago', format: '120', frames: 12, stage: 1, note: 'Preservar as margens na digitalização.' },
    { id: 'R-106', name: 'Sol', format: '35 mm', frames: 24, stage: 2, note: '' },
    { id: 'R-107', name: 'André', format: '120', frames: 12, stage: 3, note: '' }
  ]);
  const KEY = 'revela-lab-v1';
  const copy = value => JSON.parse(JSON.stringify(value));
  const normal = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const initial = () => ({ version: 1, orders: copy(ORDERS), lastChange: null });
  const validStage = value => Number.isInteger(value) && value >= 0 && value < STAGES.length;
  const validNote = value => typeof value === 'string' && value.length <= 2000;
  function validChange(change, orders) {
    if (change === null) return true;
    if (!change || !ORDERS.some(order => order.id === change.id)) return false;
    const order = orders.find(item => item.id === change.id);
    if (change.type === 'stage') return validStage(change.before) && validStage(change.after) && change.after === change.before + 1 && order.stage === change.after;
    if (change.type === 'note') return validNote(change.before) && validNote(change.after) && order.note === change.after;
    return false;
  }
  class Store {
    constructor(storage) {
      this.storage = storage;
      this.state = initial();
      this.warning = '';
      try {
        const raw = storage.getItem(KEY);
        if (!raw) return;
        const stored = JSON.parse(raw);
        if (stored.version !== 1 || !Array.isArray(stored.orders) || stored.orders.length !== ORDERS.length) throw new Error('invalid');
        const ids = new Set();
        const orders = ORDERS.map(base => {
          const item = stored.orders.find(order => order.id === base.id);
          if (!item || ids.has(item.id) || !validStage(item.stage) || !validNote(item.note)) throw new Error('invalid');
          ids.add(item.id);
          return { ...base, stage: item.stage, note: item.note };
        });
        const lastChange = stored.lastChange ?? null;
        if (!validChange(lastChange, orders)) throw new Error('invalid');
        this.state = { version: 1, orders, lastChange };
      } catch (error) {
        this.warning = 'Não foi possível ler os dados guardados. Estão visíveis os pedidos de demonstração.';
      }
    }
    snapshot() { return copy(this.state); }
    order(id) { const order = this.state.orders.find(item => item.id === id); return order ? copy(order) : null; }
    search(query = '', stage = 'all') {
      const term = normal(query);
      return copy(this.state.orders.filter(order => (stage === 'all' || STAGES[order.stage].id === stage) && (!term || normal(order.id).includes(term) || normal(order.name).includes(term))));
    }
    commit(next) {
      try { this.storage.setItem(KEY, JSON.stringify(next)); }
      catch (error) { throw new Error('Não foi possível guardar neste navegador. A alteração não foi aplicada. Verifique o armazenamento local e tente novamente.'); }
      this.state = next;
      this.warning = '';
      return this.snapshot();
    }
    advance(id, expectedStage) {
      const next = this.snapshot();
      const order = next.orders.find(item => item.id === id);
      if (!order) throw new Error('Pedido não encontrado.');
      if (order.stage === STAGES.length - 1) throw new Error('Este pedido já está pronto.');
      if (order.stage !== expectedStage) throw new Error('A etapa mudou. Reveja o pedido antes de continuar.');
      next.lastChange = { type: 'stage', id, before: order.stage, after: order.stage + 1 };
      order.stage += 1;
      return this.commit(next);
    }
    updateNote(id, value) {
      if (!validNote(value)) throw new Error('A nota pode ter até 2000 caracteres.');
      const next = this.snapshot();
      const order = next.orders.find(item => item.id === id);
      if (!order) throw new Error('Pedido não encontrado.');
      const note = value.trim();
      if (note === order.note) return this.snapshot();
      next.lastChange = { type: 'note', id, before: order.note, after: note };
      order.note = note;
      return this.commit(next);
    }
    undo() {
      const next = this.snapshot();
      const change = next.lastChange;
      if (!change) throw new Error('Não há uma alteração para desfazer.');
      const order = next.orders.find(item => item.id === change.id);
      order[change.type === 'stage' ? 'stage' : 'note'] = change.before;
      next.lastChange = null;
      return this.commit(next);
    }
  }
  const api = { Store, STAGES, ORDERS, KEY };
  root.RevelaModel = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
