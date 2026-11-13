(function () {
  'use strict';
  const C = window.MalhaCore;
  const STORAGE_KEY = 'malha.cachecol-miguel.v1';
  const $ = id => document.getElementById(id);
  const ui = {
    panel: $('trabalho'), number: $('row-number'), total: $('row-total'), label: $('current-label'),
    cycle: $('cycle-label'), step: $('step-label'), instruction: $('instruction'), context: $('current-context'),
    advance: $('advance-button'), advanceLabel: $('advance-label'), undo: $('undo-button'),
    undoLabel: $('undo-label'), feedback: $('feedback'), ruler: $('progress-ruler'),
    finish: $('finish-button'), restart: $('restart-button'), jump: $('jump-button'),
    dialog: $('progress-dialog'), form: $('dialog-form'), title: $('dialog-title'),
    description: $('dialog-description'), kicker: $('dialog-kicker'), input: $('row-input'),
    field: $('jump-field'), error: $('row-error'), preview: $('change-preview'),
    confirm: $('dialog-confirm'), cancel: $('dialog-cancel'), close: $('dialog-close')
  };
  let state = C.initial();
  let storageOK = true;
  let cooldownTimer;
  let dialogMode = null;
  let dialogRevision = null;
  let returnFocus = null;
  let suppressStorageRead = false;

  function warnStorage(message) {
    storageOK = false;
    $('storage-warning').hidden = false;
    $('storage-warning').textContent = message;
    $('save-status').classList.add('has-error');
    $('save-text').textContent = 'Progresso só nesta sessão';
  }
  function save(next) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      storageOK = true;
      suppressStorageRead = false;
      $('storage-warning').hidden = true;
      $('save-status').classList.remove('has-error');
      $('save-text').textContent = 'Progresso guardado';
      $('save-status').title = 'Guardado neste navegador às ' + new Date(next.updatedAt).toLocaleTimeString('pt-PT', {hour: '2-digit', minute: '2-digit'});
    } catch (_) {
      warnStorage('O navegador não permitiu guardar o progresso. Pode continuar nesta sessão, mas as alterações podem perder-se ao fechar ou recarregar. Ative o armazenamento local para as conservar.');
    }
  }
  function load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) { save(state); return; }
      const saved = C.parse(raw);
      if (saved) {
        state = saved;
        $('save-text').textContent = 'Progresso guardado';
        ui.feedback.textContent = C.view(state).done ? 'O projeto ficou concluído. Pode desfazer a última alteração.' : 'Retomado: carreira ' + (state.completed + 1) + ' em curso. ' + completedSentence(state.completed);
      } else {
        suppressStorageRead = true;
        warnStorage('Não foi possível ler o progresso guardado. A contagem apresentada começa em 1. Use “Ir para uma carreira” para recuperar a posição; a próxima alteração substitui os dados inválidos.');
      }
    } catch (_) {
      warnStorage('O armazenamento local está indisponível. Pode contar nesta sessão, mas o progresso não ficará guardado ao recarregar.');
    }
  }
  function completedSentence(count) {
    return count === 0 ? 'Nenhuma carreira concluída.' : count === 1 ? '1 carreira concluída.' : count + ' carreiras concluídas.';
  }
  function renderRuler() {
    ui.ruler.replaceChildren();
    for (let group = 0; group < 12; group++) {
      const block = document.createElement('div');
      block.className = 'ruler-group';
      block.setAttribute('aria-hidden', 'true');
      for (let item = 1; item <= 4; item++) {
        const row = group * 4 + item;
        const stripe = document.createElement('span');
        stripe.className = 'ruler-row' + (row <= state.completed ? ' is-done' : row === state.completed + 1 ? ' is-current' : '');
        stripe.title = 'Carreira ' + row + (row <= state.completed ? ' — concluída' : row === state.completed + 1 ? ' — em curso' : ' — por trabalhar');
        block.append(stripe);
      }
      ui.ruler.append(block);
    }
    ui.ruler.setAttribute('aria-label', state.completed + ' de 48 carreiras concluídas.' + (state.completed < 48 ? ' Carreira ' + (state.completed + 1) + ' em curso.' : ' Projeto concluído.'));
  }
  function updateAdvance() {
    clearTimeout(cooldownTimer);
    const v = C.view(state);
    const elapsed = Date.now() - state.lastAdvanceAt;
    const remaining = state.lastAdvanceAt && elapsed >= 0 ? Math.max(0, C.ADVANCE_DELAY - elapsed) : 0;
    if (remaining && !v.done) {
      ui.advance.disabled = true;
      ui.advanceLabel.textContent = storageOK ? 'Posição guardada' : 'Carreira registada';
      cooldownTimer = setTimeout(updateAdvance, remaining + 20);
    } else {
      ui.advance.disabled = false;
      ui.advanceLabel.textContent = v.done ? 'Reiniciar este projeto' : 'Concluir carreira ' + v.row;
    }
  }
  function render() {
    const v = C.view(state);
    ui.panel.classList.toggle('is-complete', v.done);
    ui.number.textContent = String(v.done ? 48 : v.row).padStart(2, '0');
    ui.total.textContent = v.done ? 'concluídas' : 'de 48';
    // Keep the visual marker while updating the accessible heading text.
    ui.label.lastChild.textContent = v.done ? 'Trabalho concluído' : 'Carreira em curso';
    ui.cycle.textContent = v.done ? '12 repetições completas' : 'Repetição ' + v.cycle + ' de 12';
    ui.step.textContent = v.done ? 'Todas as 48 carreiras' : 'Passo ' + v.step + ' de 4';
    ui.instruction.textContent = v.instruction;
    ui.context.textContent = v.done ? 'Não há nenhuma carreira em curso.' : 'Esta é a carreira que está a trabalhar.';
    $('tap-help').textContent = v.done ? (storageOK ? 'O seu progresso continua guardado aqui.' : 'Conclusão registada apenas nesta sessão.') : 'Toques seguidos contam só uma vez.';
    $('completed-count').textContent = state.completed;
    $('completed-label').textContent = state.completed === 1 ? ' concluída' : ' concluídas';
    $('remaining-count').textContent = v.done ? 'Tudo feito' : (v.remaining === 1 ? 'Falta 1' : 'Faltam ' + v.remaining);
    ui.undo.disabled = state.history.length === 0;
    const last = state.history[state.history.length - 1];
    ui.undoLabel.textContent = last && last.kind === 'restart' ? 'Desfazer reinício' : last && last.kind === 'finish' ? 'Desfazer conclusão' : 'Desfazer';
    ui.undo.title = last ? 'Restaurar ' + last.completed + ' carreiras concluídas' : 'Ainda não há alterações para desfazer';
    ui.finish.hidden = v.done;
    ui.restart.disabled = state.completed === 0;
    ui.restart.hidden = v.done;
    document.querySelectorAll('.pattern-row').forEach(row => {
      const active = Number(row.dataset.step) === v.step;
      row.classList.toggle('is-current', active);
      if (active) row.setAttribute('aria-current', 'step'); else row.removeAttribute('aria-current');
      const caption = row.querySelector('.pattern-state');
      caption.hidden = !active;
      caption.textContent = active ? 'Agora · carreira ' + v.row : '';
    });
    renderRuler();
    updateAdvance();
    document.title = v.done ? 'Concluído — Malha' : 'Carreira ' + v.row + ' — Malha';
  }
  function syncBeforeAction() {
    if (!storageOK || suppressStorageRead) return true;
    try {
      const latest = C.parse(window.localStorage.getItem(STORAGE_KEY));
      if (latest && (latest.revision !== state.revision || latest.updatedAt !== state.updatedAt)) {
        state = latest;
        render();
        ui.feedback.textContent = 'O progresso foi atualizado noutra janela. Confira a carreira antes de continuar.';
        return false;
      }
    } catch (_) { /* save() will report if persistence is unavailable. */ }
    return true;
  }
  function commit(action) {
    if (!syncBeforeAction()) return false;
    const before = state.completed;
    const result = C.apply(state, action);
    if (!result.ok) {
      if (result.code === 'confirm-finish') openDialog('finish', ui.advance);
      if (result.code === 'unchanged') ui.feedback.textContent = 'Já está nessa carreira. O progresso ficou igual.';
      return result.code === 'unchanged';
    }
    state = result.state;
    save(state);
    render();
    const row = state.completed + 1;
    if (action.type === 'advance') ui.feedback.textContent = 'Carreira ' + (before + 1) + ' concluída. Agora, trabalhe a carreira ' + row + '.';
    if (action.type === 'undo') ui.feedback.textContent = 'Alteração desfeita. ' + (state.completed === 48 ? 'Projeto concluído.' : 'Carreira ' + row + ' em curso.') + ' ' + completedSentence(state.completed);
    if (action.type === 'jump') ui.feedback.textContent = 'Carreira ' + row + ' em curso. ' + completedSentence(state.completed);
    if (action.type === 'finish') ui.feedback.textContent = 'As 48 carreiras estão concluídas. Pode desfazer a conclusão.';
    if (action.type === 'restart') ui.feedback.textContent = 'Projeto reiniciado na carreira 1. Pode desfazer para recuperar o progresso anterior.';
    if (!storageOK) ui.feedback.textContent += ' Atenção: esta alteração não ficou guardada.';
    return true;
  }
  function validRowInput() {
    const raw = ui.input.value.trim();
    const row = Number(raw);
    return raw !== '' && Number.isInteger(row) && row >= 1 && row <= 48 ? row : null;
  }
  function jumpPreview() {
    const row = validRowInput();
    ui.input.removeAttribute('aria-invalid');
    ui.error.hidden = true;
    if (!row) {
      ui.preview.textContent = 'Indique a carreira que quer deixar em curso.';
      ui.confirm.textContent = 'Retomar nesta carreira';
      return;
    }
    ui.preview.replaceChildren();
    const strong = document.createElement('strong');
    strong.textContent = 'Carreira ' + row + ' em curso';
    ui.preview.append(strong);
    const detail = document.createElement('span');
    detail.textContent = row === 1 ? 'Nenhuma carreira ficará concluída.' : row === 2 ? 'A carreira 1 ficará concluída.' : 'As carreiras 1 a ' + (row - 1) + ' ficarão concluídas.';
    ui.preview.append(detail);
    if (row - 1 < state.completed) {
      const note = document.createElement('span');
      note.style.display = 'block';
      note.textContent = 'As carreiras a partir da ' + row + ' voltarão a ficar por trabalhar.';
      ui.preview.append(note);
    }
    ui.confirm.textContent = 'Retomar na carreira ' + row;
  }
  function openDialog(mode, trigger) {
    if (!syncBeforeAction()) return;
    dialogMode = mode;
    dialogRevision = state.revision;
    returnFocus = trigger || document.activeElement;
    ui.field.hidden = mode !== 'jump';
    ui.input.disabled = mode !== 'jump';
    ui.error.hidden = true;
    ui.input.removeAttribute('aria-invalid');
    ui.confirm.classList.toggle('destructive', mode === 'restart');
    if (mode === 'jump') {
      ui.kicker.textContent = 'Ajustar progresso';
      ui.title.textContent = 'Ir para uma carreira';
      ui.description.textContent = 'Escolha a carreira que vai trabalhar agora. As anteriores ficam marcadas como concluídas.';
      ui.input.value = String(Math.min(state.completed + 1, 48));
      jumpPreview();
    } else if (mode === 'finish') {
      ui.kicker.textContent = 'Confirmar conclusão';
      ui.title.textContent = 'Terminou o cachecol?';
      const left = 48 - state.completed;
      ui.description.textContent = left === 1 ? 'A carreira 48 é a última. Confirme quando a tiver terminado.' : 'Ainda há ' + left + ' carreiras por marcar. Confirme apenas se já terminou todas.';
      ui.preview.textContent = 'Todas as 48 carreiras ficarão concluídas. Não ficará nenhuma carreira em curso.';
      ui.confirm.textContent = 'Concluir as 48 carreiras';
    } else {
      ui.kicker.textContent = 'Recomeçar este trabalho';
      ui.title.textContent = 'Voltar à carreira 1?';
      ui.description.textContent = 'Tem ' + state.completed + (state.completed === 1 ? ' carreira concluída.' : ' carreiras concluídas.') + ' O reinício coloca a contagem a zero.';
      ui.preview.textContent = 'A carreira 1 ficará em curso e as 48 carreiras ficarão por trabalhar. A sequência mantém-se igual.';
      ui.confirm.textContent = 'Recomeçar na carreira 1';
    }
    ui.dialog.showModal();
    if (mode === 'jump') { ui.input.focus(); ui.input.select(); }
    else ui.cancel.focus();
  }
  function closeDialog() { ui.dialog.close(); }
  ui.advance.addEventListener('click', () => {
    if (C.view(state).done) openDialog('restart', ui.advance);
    else commit({type: 'advance'});
  });
  ui.undo.addEventListener('click', () => commit({type: 'undo'}));
  ui.jump.addEventListener('click', () => openDialog('jump', ui.jump));
  ui.finish.addEventListener('click', () => openDialog('finish', ui.finish));
  ui.restart.addEventListener('click', () => openDialog('restart', ui.restart));
  ui.close.addEventListener('click', closeDialog);
  ui.cancel.addEventListener('click', closeDialog);
  ui.input.addEventListener('input', jumpPreview);
  ui.form.addEventListener('submit', event => {
    event.preventDefault();
    if (!dialogMode) return;
    if (state.revision !== dialogRevision) {
      closeDialog();
      ui.feedback.textContent = 'O progresso mudou enquanto esta janela estava aberta. Reveja a posição e tente novamente.';
      return;
    }
    let action = {type: dialogMode};
    if (dialogMode === 'jump') {
      const row = validRowInput();
      if (!row) {
        ui.error.hidden = false;
        ui.error.textContent = 'Introduza um número inteiro entre 1 e 48.';
        ui.input.setAttribute('aria-invalid', 'true');
        ui.input.focus();
        return;
      }
      action.row = row;
    }
    if (commit(action)) closeDialog();
    else if (state.revision !== dialogRevision) closeDialog();
  });
  ui.dialog.addEventListener('close', () => {
    dialogMode = null;
    const focus = returnFocus && !returnFocus.hidden && !returnFocus.disabled ? returnFocus : ui.advance;
    focus.focus();
  });
  // Native Escape dismisses the dialog without committing. Held keys never count rows repeatedly.
  document.addEventListener('keydown', event => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ') && event.target.closest('button')) event.preventDefault();
  });
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    const external = C.parse(event.newValue);
    if (external) {
      state = external;
      storageOK = true;
      $('save-text').textContent = 'Progresso guardado';
      render();
      ui.feedback.textContent = 'Progresso atualizado noutra janela. ' + (state.completed === 48 ? 'Projeto concluído.' : 'Carreira ' + (state.completed + 1) + ' em curso.');
    }
  });
  load();
  render();
})();
