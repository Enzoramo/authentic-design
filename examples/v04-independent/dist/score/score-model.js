(function (root) {
  'use strict';

  function summarize(events) {
    if (!Array.isArray(events)) throw new Error('Histórico inválido.');
    const state = { points: [0, 0], sets: [0, 0], completed: [], winner: null, setNumber: 1 };
    for (const player of events) {
      if ((player !== 0 && player !== 1) || state.winner !== null) {
        throw new Error('Ponto inválido no histórico.');
      }
      state.points[player] += 1;
      const opponent = 1 - player;
      if (state.points[player] >= 11 && state.points[player] - state.points[opponent] >= 2) {
        state.completed.push({ points: state.points.slice(), winner: player });
        state.sets[player] += 1;
        if (state.sets[player] === 2) {
          state.winner = player;
        } else {
          state.points = [0, 0];
          state.setNumber += 1;
        }
      }
    }
    return state;
  }

  function add(events, player) {
    if (player !== 0 && player !== 1) throw new Error('Jogador inválido.');
    if (summarize(events).winner !== null) return events.slice();
    return events.concat(player);
  }

  function undo(events) { return events.slice(0, -1); }
  function serialize(events) {
    summarize(events);
    return JSON.stringify({ version: 1, points: events });
  }
  function parse(value) {
    const data = JSON.parse(value);
    if (!data || data.version !== 1) throw new Error('Registo incompatível.');
    summarize(data.points);
    return data.points.slice();
  }

  const model = Object.freeze({ summarize, add, undo, serialize, parse });
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  else root.PodioScore = model;
})(typeof globalThis !== 'undefined' ? globalThis : this);
