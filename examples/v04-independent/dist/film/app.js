(function () {
  'use strict';
  const { Store, STAGES, ORDERS } = window.RevelaModel;
  const lab = new Store({ getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) });
  const $ = id => document.getElementById(id);
  const setText = (id, text) => { $(id).textContent = text; };
  let selectedId = ORDERS[0].id;
  let editing = false;
  let pendingAction = null;
  let reviewStage = null;
  let queueScroll = 0;
  const review = $('review-dialog');
  const discard = $('discard-dialog');
  const mobile = () => window.matchMedia('(max-width: 850px)').matches;
  const dirty = () => editing && $('note-input').value !== lab.order(selectedId).note;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function feedback(message, error = false) {
    $('feedback').classList.toggle('error', error);
    setText('feedback', message);
  }
  function showError(id, message) { setText(id, message); $(id).hidden = !message; }
  function renderList() {
    const list = lab.search($('search').value, $('stage-filter').value);
    $('orders').replaceChildren();
    for (const order of list) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `order-row state-${order.stage}${order.id === selectedId ? ' selected' : ''}`;
      button.dataset.order = order.id;
      button.setAttribute('aria-label', `Abrir ${order.id}, ${order.name}, ${order.format}, ${order.frames} poses, ${STAGES[order.stage].label}`);
      if (order.id === selectedId) button.setAttribute('aria-current', 'true');
      button.innerHTML = `<span class="order-code">${escape(order.id)}</span><span><span class="order-name">${escape(order.name)}</span><span class="order-film">${escape(order.format)} · ${order.frames} poses</span></span><span class="order-state"><span class="state-mark" aria-hidden="true"></span>${STAGES[order.stage].label}</span><span class="row-arrow" aria-hidden="true">›</span>`;
      button.addEventListener('click', () => requestLeave(() => openOrder(order.id)));
      $('orders').append(button);
    }
    setText('result-count', `${list.length} de ${ORDERS.length}`);
    $('empty-state').hidden = list.length > 0;
    $('orders').hidden = list.length === 0;
    document.querySelector('.list-labels').hidden = list.length === 0;
  }
  function renderSummary() {
    const ready = lab.snapshot().orders.filter(order => order.stage === 3).length;
    const active = ORDERS.length - ready;
    $('summary').innerHTML = `<span><strong>${active}</strong> em processo</span><span><strong>${ready}</strong> ${ready === 1 ? 'pronto' : 'prontos'}</span>`;
  }
  function renderDetail() {
    const order = lab.order(selectedId);
    setText('detail-code', order.id);
    setText('detail-name', order.name);
    setText('detail-format', order.format);
    setText('detail-frames', order.frames);
    setText('detail-stage', STAGES[order.stage].label);
    setText('detail-position', `${ORDERS.findIndex(item => item.id === order.id) + 1} / ${ORDERS.length}`);
    $('progress').replaceChildren();
    STAGES.forEach((stage, index) => {
      const item = document.createElement('li');
      item.className = index === order.stage ? 'current' : index < order.stage ? 'past' : '';
      if (index === order.stage) item.setAttribute('aria-current', 'step');
      item.innerHTML = `<span class="step-index" aria-hidden="true">0${index + 1}</span>${stage.label}<span class="sr-only">${index === order.stage ? ', etapa atual' : index < order.stage ? ', concluída' : ', por iniciar'}</span>`;
      $('progress').append(item);
    });
    setText('note-content', order.note || 'Sem observações para este pedido.');
    $('note-content').classList.toggle('empty', !order.note);
    $('note-content').hidden = editing;
    $('note-form').hidden = !editing;
    $('edit-note').hidden = editing;
    $('note-input').value = order.note;
    updateNoteCount();
    showError('note-error', '');
    const complete = order.stage === 3;
    $('completed').hidden = !complete;
    $('advance').hidden = complete;
    $('next-stage').hidden = complete;
    $('advance').disabled = editing;
    if (!complete) setText('next-stage', editing ? 'Guarde ou cancele a edição para avançar.' : `Próxima etapa: ${STAGES[order.stage + 1].label}`);
  }
  function renderChange() {
    const change = lab.snapshot().lastChange;
    $('change-strip').hidden = !change;
    if (!change) return;
    const description = change.type === 'stage' ? `${change.id} · ${STAGES[change.before].label} → ${STAGES[change.after].label}` : `${change.id} · Nota guardada`;
    setText('change-description', description);
    $('undo').setAttribute('aria-label', `Desfazer última alteração: ${description}`);
  }
  function renderAll() {
    renderList(); renderSummary(); renderDetail(); renderChange();
    showError('storage-warning', lab.warning);
  }
  function openOrder(id) {
    selectedId = id;
    editing = false;
    if (mobile()) {
      queueScroll = window.scrollY;
      document.body.classList.add('mobile-detail');
      window.scrollTo(0, 0);
    }
    renderList(); renderDetail();
    $('detail-code').focus({ preventScroll: true });
    feedback('');
  }
  function requestLeave(action) {
    if (dirty()) {
      pendingAction = action;
      discard.showModal();
      $('keep-editing').focus();
    } else { editing = false; action(); }
  }
  function updateNoteCount() { setText('note-count', `${$('note-input').value.length} / 2000`); }
  function endEditing() { editing = false; renderDetail(); $('edit-note').focus(); }

  $('search').addEventListener('input', renderList);
  $('stage-filter').addEventListener('change', renderList);
  $('clear-filters').addEventListener('click', () => {
    $('search').value = ''; $('stage-filter').value = 'all'; renderList(); $('search').focus();
  });
  $('back-to-list').addEventListener('click', () => requestLeave(() => {
    document.body.classList.remove('mobile-detail');
    renderDetail();
    const row = document.querySelector(`[data-order="${selectedId}"]`);
    (row || $('search')).focus({ preventScroll: true });
    window.scrollTo(0, queueScroll);
  }));
  $('edit-note').addEventListener('click', () => { editing = true; renderDetail(); $('note-input').focus(); });
  $('note-input').addEventListener('input', updateNoteCount);
  $('cancel-note').addEventListener('click', endEditing);
  $('note-form').addEventListener('submit', event => {
    event.preventDefault();
    const wasChanged = $('note-input').value.trim() !== lab.order(selectedId).note;
    try {
      lab.updateNote(selectedId, $('note-input').value);
      editing = false;
      renderAll();
      feedback(wasChanged ? `Nota de ${selectedId} guardada neste navegador.` : 'A nota já está guardada.');
      $('edit-note').focus();
    } catch (error) { showError('note-error', error.message); }
  });
  $('advance').addEventListener('click', () => {
    const order = lab.order(selectedId);
    if (editing || order.stage === 3) return;
    reviewStage = order.stage;
    setText('review-code', order.id); setText('review-name', order.name);
    setText('review-format', `${order.format} · ${order.frames} poses`);
    setText('review-from', STAGES[order.stage].label);
    setText('review-to', STAGES[order.stage + 1].label);
    showError('review-error', '');
    review.showModal();
    $('cancel-review').focus();
  });
  $('close-review').addEventListener('click', () => review.close());
  $('cancel-review').addEventListener('click', () => review.close());
  review.addEventListener('close', () => {
    if (!$('advance').hidden) $('advance').focus();
    else $('detail-code').focus();
  });
  $('review-form').addEventListener('submit', event => {
    event.preventDefault();
    try {
      lab.advance(selectedId, reviewStage);
      renderAll();
      review.close();
      feedback(`${selectedId} passou para ${STAGES[lab.order(selectedId).stage].label.toLowerCase()}. Alteração guardada.`);
    } catch (error) { showError('review-error', error.message); }
  });
  $('undo').addEventListener('click', () => requestLeave(() => {
    const change = lab.snapshot().lastChange;
    if (!change) return;
    try {
      lab.undo(); renderAll();
      feedback(change.type === 'stage' ? `${change.id} voltou para ${STAGES[change.before].label.toLowerCase()}.` : `A nota anterior de ${change.id} foi restaurada.`);
      if (mobile() && !document.body.classList.contains('mobile-detail')) {
        const row = document.querySelector(`[data-order="${change.id}"]`);
        (row || $('search')).focus({ preventScroll: true });
      } else $('detail-code').focus({ preventScroll: true });
    } catch (error) { feedback(error.message, true); }
  }));
  $('keep-editing').addEventListener('click', () => { pendingAction = null; discard.close(); });
  $('discard-edit').addEventListener('click', () => {
    const action = pendingAction;
    pendingAction = null; editing = false;
    discard.close();
    if (action) action();
  });
  discard.addEventListener('close', () => { pendingAction = null; if (editing) $('note-input').focus(); });
  window.addEventListener('beforeunload', event => { if (dirty()) { event.preventDefault(); event.returnValue = ''; } });
  window.matchMedia('(max-width: 850px)').addEventListener('change', event => { if (!event.matches) document.body.classList.remove('mobile-detail'); });
  renderAll();
})();
