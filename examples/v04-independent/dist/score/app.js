(function () {
  'use strict';
  const model = window.PodioScore;
  const names = ['Clara', 'Ivo'];
  const storageKey = 'podio.match.v1';
  const el = (id) => document.getElementById(id);
  const ids = ['clara','ivo'];
  let events = [];
  let lastAction = '';
  const dialog = el('reset-dialog');

  function storageError(message) {
    el('storage-warning').hidden = false;
    el('storage-warning').textContent = message;
    el('save-status').textContent = 'Placar apenas nesta sessão';
  }
  function save() {
    try {
      localStorage.setItem(storageKey, model.serialize(events));
      el('storage-warning').hidden = true;
      el('save-status').textContent = 'Guardado neste dispositivo';
    } catch (_) {
      storageError('Não foi possível guardar neste dispositivo. Pode continuar a jogar, mas o placar pode perder-se ao fechar ou recarregar.');
    }
  }
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      try {
        events = model.parse(saved);
        if (events.length) lastAction = 'Placar recuperado. Pode continuar ou desfazer o último ponto.';
      } catch (_) {
        storageError('O placar guardado não pôde ser recuperado. Esta partida começa em 0–0; o próximo ponto substituirá o registo anterior.');
        el('save-status').textContent = 'Registo anterior não recuperado';
      }
    } else save();
  } catch (_) {
    storageError('O armazenamento está indisponível. Pode jogar, mas o placar não será conservado ao recarregar.');
  }

  function pluralSets(number) { return `${number} ${number === 1 ? 'set ganho' : 'sets ganhos'}`; }
  function describeSet(state) {
    const [a,b] = state.points;
    if (state.winner !== null) return `Set ${state.setNumber} · resultado final: ${a}–${b}`;
    if (a === b) return a >= 10 ? `Empate ${a}–${b} · é preciso vencer por 2` : `Set empatado · ${a}–${b}`;
    const leader = a > b ? 0 : 1;
    return `${names[leader]} lidera o set · ${Math.max(a,b)}–${Math.min(a,b)}`;
  }
  function describeMatch(state) {
    if (state.winner !== null) return `${state.sets[state.winner]}–${state.sets[1-state.winner]} em sets · partida terminada`;
    if (state.sets[0] === state.sets[1]) return `Partida empatada · ${state.sets[0]}–${state.sets[1]} em sets`;
    const leader = state.sets[0] > state.sets[1] ? 0 : 1;
    return `${names[leader]} à frente · ${state.sets[leader]}–${state.sets[1-leader]} em sets`;
  }
  function render(announce) {
    const state = model.summarize(events);
    const finished = state.winner !== null;
    document.querySelector('.match').classList.toggle('is-finished',finished);
    el('phase').textContent = finished ? 'Fim da partida' : events.length === 0 ? 'Pronto para jogar' : state.points[0]+state.points[1] === 0 ? 'Próximo set' : 'Em jogo';
    el('match-title').textContent = finished ? `${names[state.winner]} venceu` : `Set ${state.setNumber}`;
    el('match-status').textContent = describeMatch(state);
    el('set-status').textContent = describeSet(state);
    ids.forEach((id,index) => {
      const score = el(`${id}-score`);
      score.textContent = state.points[index];
      score.setAttribute('aria-label',`${names[index]}: ${state.points[index]} pontos no ${finished ? 'último' : 'atual'} set`);
      score.classList.toggle('double',state.points[index] >= 10 && state.points[index] < 100);
      score.classList.toggle('triple',state.points[index] >= 100);
      el(`${id}-sets`).textContent = pluralSets(state.sets[index]);
      Array.from(el(`${id}-marks`).children).forEach((mark,i) => mark.classList.toggle('won',i < state.sets[index]));
      el(`point-${id}`).disabled = finished;
      el(`${id}-name`).closest('.player').classList.toggle('is-winner',finished && state.winner === index);
    });
    el('undo').disabled = events.length === 0;
    el('last-action').textContent = lastAction || 'O primeiro ponto dá início ao set.';
    el('play-guidance').textContent = finished ? 'Pode desfazer o último ponto ou começar uma nova partida.' : state.points[0] >= 10 && state.points[1] >= 10 ? 'Vantagens: o set só termina com 2 pontos de diferença.' : 'Set a 11 pontos, com 2 de vantagem.';
    el('empty-history').hidden = state.completed.length > 0;
    el('set-table').hidden = state.completed.length === 0;
    const rows = document.createDocumentFragment();
    state.completed.forEach((set,index) => {
      const row = document.createElement('tr');
      const number = document.createElement('th');
      number.scope = 'row';
      number.textContent = index + 1;
      row.append(number);
      set.points.forEach((points,player) => {
        const cell = document.createElement('td');
        const value = document.createElement('span');
        value.textContent = points;
        if(player === set.winner) value.className = 'winner-score';
        cell.append(value);
        row.append(cell);
      });
      const winner = document.createElement('td');
      winner.className = 'set-winner';
      winner.textContent = names[set.winner];
      row.append(winner);
      rows.append(row);
    });
    el('set-rows').replaceChildren(rows);
    if (announce) el('announcement').textContent = `${lastAction} ${finished ? names[state.winner] + ' venceu a partida.' : 'Set ' + state.setNumber + '. Clara ' + state.points[0] + ', Ivo ' + state.points[1] + '.'} ${describeMatch(state)}.`;
    return state;
  }

  function addPoint(player) {
    const before = model.summarize(events);
    if (before.winner !== null) return;
    events = model.add(events,player);
    const after = model.summarize(events);
    if(after.completed.length > before.completed.length) {
      const set = after.completed[after.completed.length-1];
      lastAction = `${names[player]} ganhou o set ${before.setNumber} por ${set.points[player]}–${set.points[1-player]}.`;
    } else lastAction = `Último ponto: ${names[player]}.`;
    save();
    render(true);
    if(after.winner !== null) el('undo').focus();
  }
  ids.forEach((id,index) => el(`point-${id}`).addEventListener('click',() => addPoint(index)));
  el('undo').addEventListener('click',() => {
    if (!events.length) return;
    const before = model.summarize(events);
    const removed = events[events.length-1];
    events = model.undo(events);
    const after = model.summarize(events);
    lastAction = after.completed.length < before.completed.length
      ? `Ponto de ${names[removed]} desfeito. Set ${after.setNumber} reaberto.`
      : `Ponto de ${names[removed]} desfeito.`;
    save();
    render(true);
    if(!events.length) el('point-clara').focus();
  });
  el('new-match').addEventListener('click',() => {
    dialog.returnValue = '';
    dialog.showModal();
  });
  dialog.addEventListener('close',() => {
    if(dialog.returnValue === 'confirm') {
      events = [];
      lastAction = 'Nova partida. Clara e Ivo começam em 0–0.';
      save();
      render(true);
      el('point-clara').focus();
    } else el('new-match').focus();
  });
  render(false);
})();
