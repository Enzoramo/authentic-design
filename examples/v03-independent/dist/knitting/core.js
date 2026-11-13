/* State transitions are independent of the DOM and persistence. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MalhaCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const TOTAL = 48;
  const ADVANCE_DELAY = 1400;
  const KINDS = ['advance', 'jump', 'finish', 'restart'];
  const PATTERN = [
    'Todos os pontos em meia.',
    'Todos os pontos em tricô.',
    'Alternar 2 meia e 2 tricô.',
    'Todos os pontos em tricô.'
  ];
  function initial(now = Date.now()) {
    return {version: 1, completed: 0, history: [], revision: 0, updatedAt: now, lastAdvanceAt: 0};
  }
  function isCount(value) { return Number.isInteger(value) && value >= 0 && value <= TOTAL; }
  function valid(value) {
    return Boolean(value && value.version === 1 && isCount(value.completed) &&
      Number.isSafeInteger(value.revision) && value.revision >= 0 &&
      Number.isFinite(value.updatedAt) && value.updatedAt >= 0 &&
      Number.isFinite(value.lastAdvanceAt) && value.lastAdvanceAt >= 0 &&
      Array.isArray(value.history) && value.history.length <= 80 &&
      value.history.every(item => item && isCount(item.completed) && KINDS.includes(item.kind)));
  }
  function parse(raw) {
    try { const value = JSON.parse(raw); return valid(value) ? value : null; }
    catch (_) { return null; }
  }
  function view(state) {
    const done = state.completed === TOTAL;
    const row = done ? null : state.completed + 1;
    const step = done ? null : (row - 1) % 4 + 1;
    return {done, row, step, cycle: done ? 12 : Math.ceil(row / 4), remaining: TOTAL - state.completed,
      instruction: done ? 'O cachecol está pronto.' : PATTERN[step - 1]};
  }
  function apply(state, action, now = Date.now()) {
    if (!valid(state)) return {ok: false, code: 'invalid-state'};
    let nextCount;
    if (action.type === 'undo') {
      if (!state.history.length) return {ok: false, code: 'no-history'};
      const previous = state.history[state.history.length - 1];
      return {ok: true, state: {...state, completed: previous.completed,
        history: state.history.slice(0, -1), revision: state.revision + 1,
        updatedAt: now, lastAdvanceAt: now}};
    }
    if (action.type === 'advance') {
      if (state.completed >= TOTAL) return {ok: false, code: 'already-done'};
      if (state.lastAdvanceAt && now >= state.lastAdvanceAt && now - state.lastAdvanceAt < ADVANCE_DELAY) return {ok: false, code: 'debounced'};
      if (state.completed === TOTAL - 1) return {ok: false, code: 'confirm-finish'};
      nextCount = state.completed + 1;
    } else if (action.type === 'jump') {
      if (!Number.isInteger(action.row) || action.row < 1 || action.row > TOTAL) return {ok: false, code: 'invalid-row'};
      nextCount = action.row - 1;
    } else if (action.type === 'finish') {
      nextCount = TOTAL;
    } else if (action.type === 'restart') {
      nextCount = 0;
    } else return {ok: false, code: 'invalid-action'};
    if (nextCount === state.completed) return {ok: false, code: 'unchanged'};
    return {ok: true, state: {...state, completed: nextCount,
      history: [...state.history, {completed: state.completed, kind: action.type}].slice(-80),
      revision: state.revision + 1, updatedAt: now,
      lastAdvanceAt: action.type === 'advance' ? now : 0}};
  }
  return {TOTAL, ADVANCE_DELAY, PATTERN, initial, valid, parse, view, apply};
});
