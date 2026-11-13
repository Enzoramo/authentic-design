(function () {
  'use strict';
  const M = window.QuintalModel;
  const $ = id => document.getElementById(id);
  const dialog = $('reservation-dialog');
  const content = $('dialog-content');
  let reservations = [];
  let selection = null;
  let returnFocus = null;
  let busy = false;
  const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
  const envelopes = count => plural(count, 'envelope', 'envelopes');
  const availableText = count => `${envelopes(count)} ${count === 1 ? 'disponível' : 'disponíveis'}`;
  const seedImage = lot => `<img class="seed-art" src="assets/${lot.id}.svg" alt="" width="104" height="132">`;
  const envelopeArt = '<svg class="summary-envelope" viewBox="0 0 60 45" aria-hidden="true"><path d="M5 9h50v32H5zM5 9l25 19L55 9M5 41l19-17m31 17L36 24"/><path d="M26 9V3m8 6V1m8 8V4"/></svg>';
  const pickup = lot => `<div class="pickup-detail">${M.places[lot.place].name}<span>${M.places[lot.place].time}</span></div>`;
  const pickupReview = lot => `<div class="pickup-review"><p class="eyebrow">Retirada simulada</p><strong>${M.places[lot.place].name}</strong><p>${M.places[lot.place].time}</p></div>`;
  function showNotice(text) { $('notification').textContent = text; $('notification').hidden = false; }
  function storageWarning() {
    $('storage-warning').textContent = 'Não foi possível aceder às reservas guardadas. Verifique se este navegador permite armazenamento local e recarregue a página. Não confirmaremos uma reserva sem a guardar.';
    $('storage-warning').hidden = false;
  }
  function freshReservations() {
    try {
      const state = M.read(window.localStorage);
      $('storage-warning').hidden = true;
      return state;
    } catch (error) {
      storageWarning();
      throw new Error('Não foi possível ler as reservas guardadas neste navegador.');
    }
  }
  function renderCatalog() {
    const filtered = M.search($('search').value, $('pickup-filter').value, reservations);
    $('result-count').textContent = `${plural(filtered.length, 'lote', 'lotes')} ${$('search').value || $('pickup-filter').value !== 'all' ? (filtered.length === 1 ? 'encontrado' : 'encontrados') : 'na comunidade'}`;
    $('seed-list').innerHTML = filtered.map(lot => {
      const stock = M.available(lot.id, reservations);
      return `<article class="seed-row ${stock === 0 ? 'exhausted' : ''}" data-id="${lot.id}" aria-labelledby="seed-${lot.id}">
        ${seedImage(lot)}
        <div class="seed-info"><p class="donor">Partilhado por ${lot.donor}</p><h2 id="seed-${lot.id}">${lot.name}</h2><p class="seed-count">${lot.seeds} sementes por envelope</p>${pickup(lot)}</div>
        <div class="stock-block"><span class="available-count">${stock}</span><span class="available-label">${stock === 1 ? 'envelope disponível' : 'envelopes disponíveis'}</span>${stock > 0 ? `<button type="button" class="button" data-reserve="${lot.id}" aria-label="Reservar ${lot.name}">Reservar</button>` : '<span class="unavailable">Esgotado</span>'}</div>
      </article>`;
    }).join('');
    $('no-results').hidden = filtered.length > 0;
    $('total-stock').textContent = M.lots.reduce((sum, lot) => sum + M.available(lot.id, reservations), 0);
  }
  function renderSummary() {
    $('reservation-count').textContent = reservations.length;
    if (!reservations.length) {
      $('reservation-summary').innerHTML = `${envelopeArt}<p class="summary-empty">Ainda não guardou sementes.<br>O primeiro cultivo começa com um envelope.</p><p class="summary-hint">Escolha um lote para reservar.</p>`;
      return;
    }
    $('reservation-summary').innerHTML = M.lots.filter(lot => reservations.some(r => r.lotId === lot.id)).map(lot => {
      const amount = reservations.filter(r => r.lotId === lot.id).reduce((sum, r) => sum + r.quantity, 0);
      return `<p class="summary-item"><span>${lot.name}</span><span>${envelopes(amount)}</span></p>`;
    }).join('') + '<a class="summary-link" href="#reservas">Consultar as minhas reservas</a>';
  }
  function renderReservations() {
    $('reservations-list').innerHTML = reservations.length ? reservations.map(r => {
      const lot = M.lotById(r.lotId);
      return `<article class="reservation-item" aria-label="Reserva de ${lot.name}">${seedImage(lot)}<div><span class="reserved-status">Reserva simulada</span><h2>${lot.name}</h2><p class="quantity">${envelopes(r.quantity)}</p><p class="seeds-detail">${r.quantity * lot.seeds} sementes · Partilhado por ${lot.donor}</p></div>${pickup(lot)}<button type="button" class="button secondary" data-cancel="${r.id}" aria-label="Cancelar reserva de ${lot.name}">Cancelar reserva</button></article>`;
    }).join('') : `<div class="empty-reservations">${envelopeArt}<h2>Um quintal por começar.</h2><p>Ainda não tem reservas. Explore os lotes da comunidade e escolha as sementes que quer plantar.</p><a href="#sementes" class="button">Encontrar sementes</a></div>`;
  }
  function renderAll() { renderCatalog(); renderSummary(); renderReservations(); }
  function route() {
    const isReservations = window.location.hash === '#reservas';
    $('catalog-view').hidden = isReservations;
    $('reservations-view').hidden = !isReservations;
    $('catalog-nav').toggleAttribute('aria-current', !isReservations);
    $('reservations-nav').toggleAttribute('aria-current', isReservations);
    (isReservations ? $('reservations-nav') : $('catalog-nav')).setAttribute('aria-current', 'page');
    document.title = isReservations ? 'As minhas reservas — Quintal' : 'Quintal — sementes para partilhar';
  }
  function setDialogStep(step) { $('dialog-step').textContent = step; }
  function openDialog() {
    if (!dialog.open) { returnFocus = document.activeElement; dialog.showModal(); }
  }
  function focusTitle() { const title = $('dialog-title'); title.tabIndex = -1; title.focus(); }
  function errorInDialog(message) {
    const error = $('dialog-error');
    error.textContent = message;
    error.hidden = false;
    error.tabIndex = -1;
    error.focus();
  }
  function showQuantity(lotId, quantity = 1, focus = false) {
    const lot = M.lotById(lotId);
    const stock = M.available(lotId, reservations);
    selection = { lotId, quantity, stage: 'quantity' };
    setDialogStep('1 de 2 · Escolher quantidade');
    content.innerHTML = `<div class="dialog-plant">${seedImage(lot)}<div><p class="donor">Partilhado por ${lot.donor}</p><h2 id="dialog-title">${lot.name}</h2><p class="dialog-subtitle">${lot.seeds} sementes por envelope</p></div></div>
      <form id="quantity-form" novalidate><label class="quantity-title" for="quantity">Quantos envelopes quer?</label><div class="quantity-controls"><div class="stepper"><button type="button" id="decrease" aria-label="Diminuir quantidade">−</button><input id="quantity" name="quantity" type="number" min="1" max="${stock}" step="1" value="${quantity}" inputmode="numeric" aria-describedby="quantity-help dialog-error" required><button type="button" id="increase" aria-label="Aumentar quantidade">+</button></div><p id="quantity-help" class="quantity-help"><strong id="seed-total">${quantity * lot.seeds} sementes</strong><span id="stock-help">${envelopes(stock)} disponíveis</span></p></div><p id="dialog-error" class="field-error" role="alert" hidden></p>${pickupReview(lot)}<p class="dialog-disclaimer">A sua escolha só fica reservada depois de rever e confirmar. Esta é uma simulação local.</p><div class="dialog-actions"><button type="button" class="button secondary" data-close>Voltar aos lotes</button><button type="submit" class="button" ${stock === 0 ? 'disabled' : ''}>Rever reserva</button></div></form>`;
    updateQuantityFeedback();
    openDialog();
    $('stock-help').textContent = availableText(stock);
    $('quantity').focus();
  }
  function updateQuantityFeedback() {
    if (!selection || selection.stage !== 'quantity') return;
    const value = Number($('quantity').value);
    const lot = M.lotById(selection.lotId);
    const stock = M.available(lot.id, reservations);
    $('decrease').disabled = Number.isFinite(value) && value <= 1;
    $('increase').disabled = Number.isFinite(value) && value >= stock;
    $('seed-total').textContent = Number.isInteger(value) && value > 0 ? `${value * lot.seeds} sementes` : 'Escolha a quantidade';
  }
  function reviewQuantity(event) {
    event.preventDefault();
    const raw = $('quantity').value;
    const amount = Number(raw);
    try {
      reservations = freshReservations();
      M.reserve(reservations, selection.lotId, amount, 'q-validation');
      selection.quantity = amount;
      selection.stage = 'review';
      renderAll();
      showReview();
    } catch (error) {
      $('quantity').setAttribute('aria-invalid', 'true');
      errorInDialog(error.message);
    }
  }
  function showReview() {
    const lot = M.lotById(selection.lotId);
    setDialogStep('2 de 2 · Rever e confirmar');
    content.innerHTML = `<h2 id="dialog-title">Tudo pronto para reservar?</h2><p class="dialog-subtitle">Confira a quantidade e o ponto de retirada.</p><dl class="review-lines"><div><dt>Sementes</dt><dd>${lot.name}</dd></div><div><dt>Quantidade</dt><dd>${envelopes(selection.quantity)}</dd></div><div><dt>Total de sementes</dt><dd>${selection.quantity * lot.seeds}</dd></div><div><dt>Partilhado por</dt><dd>${lot.donor}</dd></div></dl>${pickupReview(lot)}<p class="dialog-disclaimer">Reserva fictícia, guardada apenas neste navegador. Sem pagamento e sem mensagens para ${lot.donor}. Pode cancelar a qualquer momento.</p><p id="dialog-error" class="field-error" role="alert" hidden></p><div class="dialog-actions"><button type="button" class="button secondary" id="edit-quantity">Alterar quantidade</button><button type="button" class="button" id="confirm-reservation">Confirmar reserva</button></div>`;
    focusTitle();
  }
  async function mutateReservations(mutator) {
    const operation = () => {
      const latest = freshReservations();
      const updated = mutator(latest);
      try { M.save(window.localStorage, updated); }
      catch (error) { storageWarning(); throw new Error('Não foi possível guardar a alteração. Verifique o armazenamento do navegador e tente novamente.'); }
      reservations = updated;
      renderAll();
    };
    if (navigator.locks && navigator.locks.request) await navigator.locks.request('quintal-reservas', operation);
    else operation();
  }
  async function confirmReservation() {
    if (busy) return;
    busy = true;
    const button = $('confirm-reservation');
    button.disabled = true;
    button.textContent = 'A guardar…';
    try {
      const chosen = { ...selection };
      await mutateReservations(latest => M.reserve(latest, chosen.lotId, chosen.quantity, `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`));
      selection.stage = 'success';
      const lot = M.lotById(chosen.lotId);
      setDialogStep('Reserva guardada');
      content.innerHTML = `<span class="success-mark" aria-hidden="true">✓</span><h2 id="dialog-title">Sementes guardadas para si.</h2><p class="success-description">Reservou <strong>${envelopes(chosen.quantity)} de ${lot.name.toLowerCase()}</strong>, com ${chosen.quantity * lot.seeds} sementes no total.</p>${pickupReview(lot)}<p class="dialog-disclaimer">Esta retirada é fictícia. A sua reserva fica guardada neste navegador, mesmo depois de recarregar.</p><div class="dialog-actions"><button type="button" class="button secondary" data-close>Explorar mais sementes</button><button type="button" class="button" id="view-reservations">Ver as minhas reservas</button></div>`;
      focusTitle();
    } catch (error) {
      errorInDialog(error.message);
      button.disabled = false;
      button.textContent = 'Confirmar reserva';
    } finally { busy = false; }
  }
  function requestCancel(id) {
    try { reservations = freshReservations(); } catch (error) { showNotice(error.message); return; }
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) { renderAll(); showNotice('Esta reserva já foi cancelada.'); return; }
    const lot = M.lotById(reservation.lotId);
    selection = { stage: 'cancel', reservationId: id, lotId: lot.id, quantity: reservation.quantity };
    setDialogStep('Cancelar reserva');
    content.innerHTML = `<h2 id="dialog-title">Devolver estas sementes?</h2><p class="cancel-description">Ao cancelar a reserva de <strong>${lot.name.toLowerCase()}</strong>, ${envelopes(reservation.quantity)} ${reservation.quantity === 1 ? 'volta a ficar disponível' : 'voltam a ficar disponíveis'} para a comunidade.</p>${pickupReview(lot)}<p id="dialog-error" class="field-error" role="alert" hidden></p><div class="dialog-actions"><button type="button" class="button secondary" data-close>Manter reserva</button><button type="button" class="button danger" id="confirm-cancel">Cancelar reserva</button></div>`;
    openDialog();
  }
  async function confirmCancel() {
    if (busy) return;
    busy = true;
    const button = $('confirm-cancel');
    button.disabled = true;
    try {
      const chosen = { ...selection };
      await mutateReservations(latest => M.cancel(latest, chosen.reservationId));
      showNotice(`Reserva cancelada. ${envelopes(chosen.quantity)} de ${M.lotById(chosen.lotId).name.toLowerCase()} ${chosen.quantity === 1 ? 'voltou a ficar disponível' : 'voltaram a ficar disponíveis'}.`);
      dialog.close();
      $('reservations-title').tabIndex = -1;
      $('reservations-title').focus();
    } catch (error) { errorInDialog(error.message); button.disabled = false; }
    finally { busy = false; }
  }
  $('filters').addEventListener('submit', event => event.preventDefault());
  $('search').addEventListener('input', renderCatalog);
  $('pickup-filter').addEventListener('change', renderCatalog);
  $('clear-filters').addEventListener('click', () => { $('filters').reset(); renderCatalog(); $('search').focus(); });
  $('seed-list').addEventListener('click', event => {
    const button = event.target.closest('[data-reserve]');
    if (!button) return;
    try { reservations = freshReservations(); showQuantity(button.dataset.reserve); }
    catch (error) { showNotice(error.message); }
  });
  $('reservations-list').addEventListener('click', event => { const button = event.target.closest('[data-cancel]'); if (button) requestCancel(button.dataset.cancel); });
  $('close-dialog').addEventListener('click', () => { if (!busy) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  dialog.addEventListener('close', () => {
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
    else if (selection && selection.lotId) {
      const replacement = document.querySelector(`[data-reserve="${selection.lotId}"]`);
      if (replacement && !$('catalog-view').hidden) replacement.focus();
      else { const title = $($('catalog-view').hidden ? 'reservations-title' : 'catalog-title'); title.tabIndex = -1; title.focus(); }
    }
    selection = null;
  });
  content.addEventListener('input', event => { if (event.target.id === 'quantity') { event.target.removeAttribute('aria-invalid'); $('dialog-error').hidden = true; updateQuantityFeedback(); } });
  content.addEventListener('submit', event => { if (event.target.id === 'quantity-form') reviewQuantity(event); });
  content.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || busy) return;
    if (button.hasAttribute('data-close')) { dialog.close(); return; }
    if (button.id === 'decrease' || button.id === 'increase') {
      const stock = M.available(selection.lotId, reservations);
      const old = Number($('quantity').value);
      const current = Number.isInteger(old) ? old : 1;
      $('quantity').value = Math.min(stock, Math.max(1, current + (button.id === 'increase' ? 1 : -1)));
      $('quantity').removeAttribute('aria-invalid'); $('dialog-error').hidden = true; updateQuantityFeedback();
    }
    if (button.id === 'edit-quantity') showQuantity(selection.lotId, selection.quantity, true);
    if (button.id === 'confirm-reservation') confirmReservation();
    if (button.id === 'confirm-cancel') confirmCancel();
    if (button.id === 'view-reservations') { dialog.close(); window.location.hash = 'reservas'; }
  });
  window.addEventListener('hashchange', () => { route(); const title = $($('catalog-view').hidden ? 'reservations-title' : 'catalog-title'); title.tabIndex = -1; title.focus(); });
  window.addEventListener('storage', event => {
    if (event.key !== M.KEY && event.key !== null) return;
    try { reservations = freshReservations(); renderAll(); } catch (error) { return; }
    if (dialog.open && selection && (selection.stage === 'quantity' || selection.stage === 'review')) {
      if (selection.stage === 'quantity') { $('quantity').max = M.available(selection.lotId, reservations); $('stock-help').textContent = availableText(M.available(selection.lotId, reservations)); updateQuantityFeedback(); }
      errorInDialog('A disponibilidade mudou noutra janela. Confira a quantidade antes de continuar.');
    } else showNotice('As reservas foram atualizadas a partir de outra janela.');
  });
  try { reservations = freshReservations(); } catch (error) { /* Warning is visible; browsing remains available. */ }
  renderAll();
  route();
})();
