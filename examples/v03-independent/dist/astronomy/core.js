(function (root) {
  'use strict';
  const KEY = 'zenite.session.14-novembro.v1';
  const targets = Object.freeze([
    { id: 'lua', name: 'Lua', type: 'satellite', typeLabel: 'Satélite', time: '19h10', order: 1 },
    { id: 'saturno', name: 'Saturno', type: 'planet', typeLabel: 'Planeta', time: '20h00', order: 2 },
    { id: 'm42', name: 'M42', type: 'nebula', typeLabel: 'Nebulosa', time: '21h15', order: 3 },
    { id: 'pleiades', name: 'Plêiades', type: 'cluster', typeLabel: 'Aglomerado', time: '22h00', order: 4 }
  ]);
  const statuses = Object.freeze({ pending: { label: 'Pendente', symbol: '○' }, seen: { label: 'Visto', symbol: '✓' }, unseen: { label: 'Não visto', symbol: '×' } });
  function getStatus(records, id) { return records[id] ? records[id].status : 'pending'; }
  function filterTargets(records, type, status) {
    return targets.filter(target => (type === 'all' || type === target.type) && (status === 'all' || status === getStatus(records, target.id)));
  }
  function counts(records) {
    return targets.reduce((sum, target) => { sum[getStatus(records, target.id)] += 1; return sum; }, { pending: 0, seen: 0, unseen: 0 });
  }
  function saveRecord(records, id, status, note) {
    if (!targets.some(target => target.id === id)) throw new Error('Alvo inválido.');
    if (status !== 'seen' && status !== 'unseen') throw new Error('Escolha Visto ou Não visto.');
    if (typeof note !== 'string' || note.length > 600) throw new Error('A nota deve ter até 600 caracteres.');
    return { ...records, [id]: { status, note: note.trim(), updatedAt: new Date().toISOString() } };
  }
  function removeRecord(records, id) { const next = { ...records }; delete next[id]; return next; }
  function decode(raw) {
    if (raw === null) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !parsed.records || Array.isArray(parsed.records) || typeof parsed.records !== 'object') throw new Error('Formato de registros inválido.');
    const result = {};
    for (const target of targets) {
      const record = parsed.records[target.id];
      if (!record) continue;
      if (!['seen', 'unseen'].includes(record.status) || typeof record.note !== 'string' || record.note.length > 600 || typeof record.updatedAt !== 'string') throw new Error('Registro inválido.');
      result[target.id] = { status: record.status, note: record.note, updatedAt: record.updatedAt };
    }
    return result;
  }
  function encode(records) { return JSON.stringify({ version: 1, records }); }
  const api = { KEY, targets, statuses, getStatus, filterTargets, counts, saveRecord, removeRecord, decode, encode };
  root.ZeniteCore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
