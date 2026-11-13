(() => {
  'use strict';
  const M = window.MinutoModel;
  const STORAGE_KEY = 'minuto.chapter-editor.v1';
  const $ = id => document.getElementById(id);
  const initialDraft = chapters => ({ id: chapters[Math.min(1, chapters.length - 1)].id, title: chapters[Math.min(1, chapters.length - 1)].title, time: M.formatTime(chapters[Math.min(1, chapters.length - 1)].time) });
  let state = { chapters: M.clone(M.INITIAL), undo: null, draft: initialDraft(M.INITIAL) };
  let storageAvailable = true;
  let startupWarning = '';
  let pendingAction = null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (!saved || saved.version !== 1 || !M.validChapters(saved.chapters)) throw new Error('invalid-data');
      state.chapters = M.clone(saved.chapters);
      state.undo = saved.undo && M.validChapters(saved.undo.chapters) ? { chapters: M.clone(saved.undo.chapters), id: saved.undo.id } : null;
      const draft = saved.draft;
      state.draft = draft && typeof draft.title === 'string' && typeof draft.time === 'string' && (draft.id === null || state.chapters.some(c => c.id === draft.id)) ? { id: draft.id, title: draft.title, time: draft.time } : initialDraft(state.chapters);
    }
  } catch (error) {
    storageAvailable = false;
    startupWarning = error.message === 'invalid-data' || error instanceof SyntaxError
      ? 'Não foi possível recuperar os dados salvos. A lista inicial foi carregada; os dados anteriores não serão sobrescritos. Exporte seu trabalho para guardar as próximas alterações.'
      : 'O navegador não permitiu acessar os dados locais. As alterações desta sessão funcionam, mas não serão preservadas ao recarregar. Exporte a lista antes de sair.';
  }

  function dirty() {
    if (state.draft.id === null) return Boolean(state.draft.title || state.draft.time);
    const saved = state.chapters.find(c => c.id === state.draft.id);
    return !saved || saved.title !== state.draft.title || M.formatTime(saved.time) !== state.draft.time;
  }
  function updateStatus() {
    $('draft-status').textContent = dirty() ? 'Edição não aplicada' : state.draft.id === null ? 'Novo capítulo' : 'Salvo';
    $('storage-status').textContent = storageAvailable ? (dirty() ? 'Rascunho preservado' : 'Salvo neste navegador') : 'Apenas nesta sessão';
    $('discard-button').hidden = !(dirty() || state.draft.id === null);
    $('undo-button').disabled = !state.undo;
  }
  function persist() {
    if (storageAvailable) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...state })); }
      catch (_) {
        storageAvailable = false;
        startupWarning = 'Não foi possível salvar no navegador. As alterações continuam nesta sessão. Exporte a lista antes de fechar ou recarregar.';
        showStorageWarning();
      }
    }
    updateStatus();
  }
  function showStorageWarning() {
    $('storage-warning').hidden = !startupWarning;
    $('storage-warning').textContent = startupWarning;
  }
  function announce(message) { $('feedback').textContent = message; }
  function clearErrors() {
    for (const field of ['title', 'time']) {
      $(`${field}-error`).hidden = true;
      $(`${field}-error`).textContent = '';
      $(`chapter-${field}`).removeAttribute('aria-invalid');
    }
  }
  function setDraft(id) {
    const chapter = state.chapters.find(c => c.id === id) || state.chapters[0];
    state.draft = { id: chapter.id, title: chapter.title, time: M.formatTime(chapter.time) };
  }
  function focusEditor() {
    if (window.matchMedia('(max-width: 700px)').matches) $('edit-panel').scrollIntoView({ block: 'start', behavior: 'instant' });
    $('chapter-title').focus({ preventScroll: true });
  }
  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function renderSequence() {
    const fragment = document.createDocumentFragment();
    const map = document.createDocumentFragment();
    M.intervals(state.chapters).forEach((chapter, index) => {
      const li = element('li', 'chapter-item');
      const button = element('button', 'chapter-button');
      button.type = 'button';
      button.dataset.chapterId = chapter.id;
      button.setAttribute('aria-current', String(chapter.id === state.draft.id));
      button.setAttribute('aria-label', `${M.formatTime(chapter.time)}, ${chapter.title}. Duração ${M.formatTime(chapter.duration)}.${index === 0 ? ' Primeiro capítulo, horário fixo.' : ''}`);
      button.append(element('span', 'chapter-time', M.formatTime(chapter.time)));
      const title = element('span', 'chapter-title', chapter.title);
      if (index === 0) title.append(element('span', 'fixed-tag', 'início fixo'));
      button.append(title);
      const duration = element('span', 'chapter-duration', M.formatTime(chapter.duration));
      duration.append(element('small', '', `até ${M.formatTime(chapter.end)}`));
      button.append(duration);
      button.addEventListener('click', () => guardDraft(() => { setDraft(chapter.id); persist(); render(); focusEditor(); }));
      li.append(button);
      fragment.append(li);
      const segment = element('span', `map-segment${chapter.id === state.draft.id ? ' selected' : ''}`);
      segment.style.flex = `${chapter.duration} 0 0px`;
      map.append(segment);
    });
    $('chapter-list').replaceChildren(fragment);
    $('map-segments').replaceChildren(map);
    $('chapter-count').textContent = state.chapters.length;
    $('map-count').textContent = state.chapters.length;
  }
  function renderForm() {
    clearErrors();
    const chapter = M.intervals(state.chapters).find(c => c.id === state.draft.id);
    const first = state.draft.id === state.chapters[0].id;
    $('chapter-title').value = state.draft.title;
    $('chapter-time').value = state.draft.time;
    $('chapter-time').readOnly = first;
    $('time-help').textContent = first ? 'Este horário é fixo: o episódio começa em 00:00.' : 'Use um horário antes de 18:40.';
    $('edit-heading').textContent = chapter ? 'Editar capítulo' : 'Adicionar capítulo';
    $('save-button').textContent = chapter ? 'Salvar alteração' : 'Adicionar capítulo';
    $('delete-button').hidden = first || !chapter;
    $('fixed-note').hidden = !first;
    $('interval-preview').hidden = !chapter;
    if (chapter) {
      $('interval-range').textContent = `${M.formatTime(chapter.time)} — ${M.formatTime(chapter.end)}`;
      $('interval-duration').textContent = `${M.formatTime(chapter.duration)} de duração`;
    }
    updateStatus();
  }
  function render() { renderSequence(); renderForm(); showStorageWarning(); }
  function confirmAction({ title, message, cancel, accept, dangerous = false, action }) {
    $('confirm-heading').textContent = title;
    $('confirm-description').textContent = message;
    $('confirm-cancel').textContent = cancel;
    $('confirm-accept').textContent = accept;
    $('confirm-accept').className = `button ${dangerous ? 'button-danger' : 'button-primary'}`;
    pendingAction = action;
    $('confirm-dialog').showModal();
    $('confirm-cancel').focus();
  }
  function guardDraft(action) {
    if (!dirty()) return action();
    confirmAction({
      title: 'Há uma edição não aplicada',
      message: 'O que você digitou ainda não alterou a lista. Continue editando para salvar ou descarte este rascunho para seguir.',
      cancel: 'Continuar editando', accept: 'Descartar rascunho', dangerous: true,
      action
    });
  }
  function remember() { state.undo = { chapters: M.clone(state.chapters), id: state.draft.id }; }
  function openReview() {
    // Only the committed sequence is exported; discard accepted by guardDraft.
    if (dirty()) { setDraft(state.draft.id); persist(); render(); }
    $('review-count').textContent = `${state.chapters.length} ${state.chapters.length === 1 ? 'capítulo' : 'capítulos'}`;
    const rows = document.createDocumentFragment();
    M.intervals(state.chapters).forEach(chapter => {
      const row = element('tr');
      const title = element('td', '', chapter.title);
      title.append(element('small', '', `Até ${M.formatTime(chapter.end)}${chapter.end === M.DURATION ? ' · fim do episódio' : ''}`));
      row.append(title, element('td', '', M.formatTime(chapter.time)), element('td', '', M.formatTime(chapter.duration)));
      rows.append(row);
    });
    $('review-rows').replaceChildren(rows);
    $('download-feedback').textContent = '';
    $('review-dialog').showModal();
    $('close-review').focus();
  }

  for (const field of ['title', 'time']) {
    $(`chapter-${field}`).addEventListener('input', event => {
      state.draft[field] = event.target.value;
      $(`${field}-error`).hidden = true;
      $(`chapter-${field}`).removeAttribute('aria-invalid');
      persist();
    });
  }
  $('chapter-form').addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();
    const newId = `chapter-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const result = M.saveDraft(state.chapters, state.draft, newId);
    if (Object.keys(result.errors).length) {
      for (const [field, message] of Object.entries(result.errors)) {
        $(`${field}-error`).textContent = message;
        $(`${field}-error`).hidden = false;
        $(`chapter-${field}`).setAttribute('aria-invalid', 'true');
      }
      $(`chapter-${Object.keys(result.errors)[0]}`).focus();
      announce('Revise os campos indicados. A edição digitada foi mantida.');
      persist();
      return;
    }
    if (!dirty()) { announce('Este capítulo já está salvo.'); return; }
    const added = state.draft.id === null;
    remember();
    state.chapters = result.chapters;
    setDraft(result.id);
    persist(); render();
    announce(added ? 'Capítulo adicionado. A ordem e os intervalos foram atualizados.' : 'Alteração salva. A ordem e os intervalos foram atualizados.');
    $('save-button').focus({ preventScroll: true });
  });
  $('add-button').addEventListener('click', () => guardDraft(() => {
    state.draft = { id: null, time: '', title: '' };
    persist(); render(); focusEditor(); announce('Novo capítulo: informe um título e o horário de início.');
  }));
  $('discard-button').addEventListener('click', () => {
    const reset = () => { setDraft(state.draft.id); persist(); render(); focusEditor(); announce('Rascunho descartado. A lista não foi alterada.'); };
    if (dirty()) guardDraft(reset); else reset();
  });
  $('delete-button').addEventListener('click', () => guardDraft(() => {
    const id = state.draft.id;
    const index = state.chapters.findIndex(c => c.id === id);
    if (index <= 0) return;
    // A discarded draft must not survive the confirmation's cancellation.
    setDraft(id); persist(); render();
    const chapter = state.chapters[index];
    const end = state.chapters[index + 1]?.time ?? M.DURATION;
    confirmAction({
      title: 'Excluir capítulo?',
      message: `“${chapter.title}”, em ${M.formatTime(chapter.time)}, será removido. O intervalo anterior passará a terminar em ${M.formatTime(end)}. Você pode desfazer a exclusão.`,
      cancel: 'Manter capítulo', accept: 'Excluir capítulo', dangerous: true,
      action: () => {
        remember(); state.chapters = M.removeChapter(state.chapters, id);
        setDraft(state.chapters[index - 1].id); persist(); render(); focusEditor();
        announce('Capítulo excluído. Use Desfazer para recuperá-lo.');
      }
    });
  }));
  $('undo-button').addEventListener('click', () => guardDraft(() => {
    if (!state.undo) return;
    const previous = state.undo;
    state.chapters = M.clone(previous.chapters); state.undo = null;
    setDraft(previous.id); persist(); render(); focusEditor(); announce('Última alteração desfeita.');
  }));
  $('review-button').addEventListener('click', () => guardDraft(openReview));
  for (const id of ['close-review', 'back-review']) $(id).addEventListener('click', () => $('review-dialog').close());
  $('confirm-cancel').addEventListener('click', () => { pendingAction = null; $('confirm-dialog').close(); });
  $('confirm-dialog').addEventListener('cancel', () => { pendingAction = null; });
  $('confirm-accept').addEventListener('click', () => { const action = pendingAction; pendingAction = null; $('confirm-dialog').close(); if (action) action(); });
  for (const dialog of [$('confirm-dialog'), $('review-dialog')]) {
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')].filter(control => control.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if ((!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    });
  }
  $('back-button').addEventListener('click', () => {
    $('chapter-list').scrollIntoView({ block: 'start', behavior: 'instant' });
    const selected = $('chapter-list').querySelector('[aria-current="true"]');
    (selected || $('add-button')).focus({ preventScroll: true });
  });
  $('export-button').addEventListener('click', () => {
    const blob = new Blob([M.exportText(state.chapters)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = element('a');
    link.href = url; link.download = 'como-nasce-uma-ideia-capitulos.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('download-feedback').textContent = 'Download solicitado: como-nasce-uma-ideia-capitulos.txt';
  });
  render();
  if (storageAvailable) persist();
})();
