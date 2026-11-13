(function () {
  'use strict';
  const M = window.VesperaModel;
  const $ = id => document.getElementById(id);
  let map = M.initial();
  let unseatedOnly = false;
  let selectedGuest = null;
  let opener = null;
  let toastTimer;
  const editor = $('editor');
  const review = $('review');
  const chevron = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';

  function storageWarning(message) {
    $('storage-warning').textContent = message;
    $('storage-warning').hidden = false;
    $('save-status').textContent = 'Mapa disponível só nesta sessão';
  }
  function save() {
    try {
      localStorage.setItem(M.storageKey, M.serialize(map));
      $('storage-warning').hidden = true;
      $('save-status').innerHTML = '<span class="save-dot" aria-hidden="true"></span>Guardado neste navegador';
      return true;
    } catch (_) {
      storageWarning('Não foi possível guardar neste navegador. Pode continuar a organizar, mas estas alterações podem perder-se ao recarregar.');
      return false;
    }
  }
  try {
    const restored = M.restore(localStorage.getItem(M.storageKey));
    map = restored.map;
    if (!restored.ok) {
      storageWarning('O mapa guardado não pôde ser recuperado. As pessoas aparecem sem lugar. A próxima alteração guarda um novo mapa.');
    } else if (restored.fresh) save();
  } catch (_) {
    storageWarning('Este navegador não permite ler o mapa guardado. Pode organizar nesta sessão; a conservação ao recarregar não está disponível.');
  }

  function seat(guest) {
    return guest
      ? `<button type="button" class="seat filled" data-guest="${guest.id}" data-origin="map" aria-label="${guest.name}, mesa ${map[guest.id]}. Mudar ou retirar">${guest.name}</button>`
      : '<span class="seat empty">Lugar livre</span>';
  }
  function renderTables() {
    $('tables').innerHTML = M.tables.map(table => {
      const people = M.members(map, table.id);
      const slots = Array.from({ length: table.capacity }, (_, index) => people[index] || null);
      const left = slots.slice(0, 2).map(seat).join('');
      const right = slots.slice(2).map(seat).join('');
      const free = table.capacity - people.length;
      return `<section class="table-block" aria-labelledby="table-title-${table.id}">
        <h3 id="table-title-${table.id}" class="sr-only">Mesa ${table.id}</h3>
        <div class="table-meta"><p class="table-capacity">${people.length} <span>/ ${table.capacity} lugares</span></p><p class="table-availability${free === 0 ? ' full' : ''}">${free === 0 ? 'Mesa cheia' : free === 1 ? '1 lugar livre' : `${free} lugares livres`}</p></div>
        <div class="table-scene"><div class="seat-column">${left}</div><div class="table-circle" aria-hidden="true"><small>Mesa</small><b>${table.id}</b></div><div class="seat-column">${right}</div></div>
      </section>`;
    }).join('');
  }
  function renderGuests() {
    const search = $('guest-search').value;
    const visible = M.findGuests(map, search, unseatedOnly);
    $('guest-list').innerHTML = visible.map(guest => {
      const table = map[guest.id];
      return `<li><button class="guest-row" data-guest="${guest.id}" data-origin="list" aria-label="${guest.name}, ${table === null ? 'sem lugar. Atribuir mesa' : `mesa ${table}. Mudar ou retirar`}"><span class="guest-name">${guest.name}</span><span class="guest-state${table === null ? '' : ' seated'}">${table === null ? 'Sem lugar' : `Mesa ${table}`}</span>${chevron}</button></li>`;
    }).join('');
    $('result-count').textContent = `${visible.length} ${visible.length === 1 ? 'convidado encontrado' : 'convidados encontrados'}.`;
    $('empty-guests').hidden = visible.length !== 0;
    if (visible.length === 0) {
      const searching = search.trim().length > 0;
      $('empty-heading').textContent = searching ? 'Não encontrámos esse nome' : 'Todos têm lugar';
      $('empty-copy').textContent = searching ? 'Experimente outro nome ou mostre todos os convidados.' : 'As dez pessoas já estão distribuídas. Pode rever o mapa ou fazer ajustes.';
      $('empty-guests').querySelector('.empty-mark').textContent = searching ? '—' : '✓';
      $('clear-filters').textContent = searching ? 'Limpar pesquisa e filtros' : 'Mostrar todos';
    }
  }
  function renderSummary() {
    const seated = M.seatedCount(map);
    $('seated-total').innerHTML = `${seated} <span>/ 10</span>`;
    $('unseated-total').textContent = 10 - seated;
    $('free-total').textContent = 11 - seated;
    $('filter-count').textContent = 10 - seated;
  }
  function render() { renderSummary(); renderTables(); renderGuests(); }
  function setFilter(value) {
    unseatedOnly = value;
    $('filter-all').classList.toggle('active', !value);
    $('filter-all').setAttribute('aria-pressed', String(!value));
    $('filter-unseated').classList.toggle('active', value);
    $('filter-unseated').setAttribute('aria-pressed', String(value));
    renderGuests();
  }
  function announce(message) {
    clearTimeout(toastTimer);
    $('toast').hidden = false;
    $('announcement').textContent = message;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 7000);
  }
  function restoreFocus() {
    if (!opener) return;
    const selector = `[data-guest="${opener.id}"][data-origin="${opener.origin}"]`;
    const target = document.querySelector(selector);
    if (target && target.getClientRects().length) target.focus({ preventScroll: true });
    else if ($('guest-search').getClientRects().length) $('guest-search').focus({ preventScroll: true });
    else $('show-tables').focus({ preventScroll: true });
  }
  function closeEditor() { editor.close(); }
  function openEditor(id, origin) {
    selectedGuest = M.guests.find(guest => guest.id === id);
    if (!selectedGuest) return;
    opener = { id, origin };
    const currentTable = map[id];
    $('editor-name').textContent = selectedGuest.name;
    $('editor-context').textContent = currentTable === null ? 'Ainda sem lugar. Escolha uma das três mesas.' : `Está na mesa ${currentTable}. Pode mudar de mesa ou retirar.`;
    $('assignment-error').hidden = true;
    $('assignment-error').textContent = '';
    $('table-options').innerHTML = M.tables.map(table => {
      const count = M.members(map, table.id).length;
      const free = table.capacity - count;
      const status = table.id === currentTable ? 'Mesa atual' : free === 0 ? 'Cheia' : free === 1 ? '1 lugar livre' : `${free} lugares livres`;
      return `<label class="table-option"><span class="option-number" aria-hidden="true">${table.id}</span><span class="option-text"><b>Mesa ${table.id}</b><small>${count} de ${table.capacity} ocupados · ${status}</small></span><input type="radio" name="destination" value="${table.id}" ${table.id === currentTable ? 'checked' : ''} aria-label="Mesa ${table.id}, ${count} de ${table.capacity} ocupados, ${status}"></label>`;
    }).join('');
    $('assign-button').textContent = currentTable === null ? 'Atribuir mesa' : 'Guardar alteração';
    $('remove-guest').hidden = currentTable === null;
    $('remove-guest').textContent = `Retirar da mesa ${currentTable}`;
    $('toast').hidden = true;
    editor.showModal();
    const checked = editor.querySelector('input:checked');
    (checked || editor.querySelector('input')).focus({ preventScroll: true });
  }
  function applyAssignment(destination) {
    if (!selectedGuest) return;
    const before = map[selectedGuest.id];
    const result = M.assign(map, selectedGuest.id, destination);
    if (!result.ok) {
      const origin = before === null ? `${selectedGuest.name} continua sem lugar.` : `${selectedGuest.name} continua na mesa ${before}.`;
      $('assignment-error').textContent = `A mesa ${destination} está cheia. Escolha outra mesa ou retire alguém dessa mesa primeiro. ${origin} As outras atribuições foram mantidas.`;
      $('assignment-error').hidden = false;
      return;
    }
    if (!result.changed) {
      closeEditor();
      announce(`${selectedGuest.name} mantém o lugar na mesa ${destination}.`);
      return;
    }
    map = result.map;
    const saved = save();
    render();
    closeEditor();
    const message = destination === null ? `O lugar de ${selectedGuest.name} na mesa ${before} foi libertado.` : before === null ? `${selectedGuest.name} ficou na mesa ${destination}.` : `${selectedGuest.name} passou da mesa ${before} para a mesa ${destination}.`;
    announce(message + (saved ? '' : ' Alteração disponível só nesta sessão.'));
  }
  function openReview() {
    const seated = M.seatedCount(map);
    $('review-summary').textContent = seated === 10 ? 'As dez pessoas têm lugar. Ficou 1 lugar livre.' : `${seated} de 10 pessoas à mesa · ${10 - seated} ${10 - seated === 1 ? 'pessoa ainda sem lugar' : 'pessoas ainda sem lugar'}.`;
    $('review-tables').innerHTML = M.tables.map(table => {
      const people = M.members(map, table.id);
      return `<section class="review-table"><h3><span aria-hidden="true">${table.id}</span>Mesa ${table.id}</h3><p class="review-capacity">${people.length} de ${table.capacity} lugares ocupados</p>${people.length ? `<ul>${people.map(guest => `<li>${guest.name}</li>`).join('')}</ul>` : '<p class="no-members">Ainda sem convidados</p>'}</section>`;
    }).join('');
    const unseated = M.findGuests(map, '', true);
    $('review-unseated-title').textContent = unseated.length ? `Ainda sem lugar · ${unseated.length}` : 'Todos têm lugar';
    $('review-unseated-names').textContent = unseated.length ? unseated.map(guest => guest.name).join(' · ') : 'A distribuição está completa. Pode voltar à organização para fazer ajustes.';
    $('toast').hidden = true;
    review.showModal();
    $('close-review').focus({ preventScroll: true });
  }
  function setMobilePanel(panel) {
    $('workspace').dataset.mobilePanel = panel;
    for (const name of ['guests', 'tables']) {
      $('show-' + name).classList.toggle('active', name === panel);
      $('show-' + name).setAttribute('aria-pressed', String(name === panel));
    }
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-guest]');
    if (trigger) openEditor(trigger.dataset.guest, trigger.dataset.origin);
  });
  $('guest-search').addEventListener('input', renderGuests);
  $('filter-all').addEventListener('click', () => setFilter(false));
  $('filter-unseated').addEventListener('click', () => setFilter(true));
  $('clear-filters').addEventListener('click', () => { $('guest-search').value = ''; setFilter(false); $('guest-search').focus(); });
  $('show-guests').addEventListener('click', () => setMobilePanel('guests'));
  $('show-tables').addEventListener('click', () => setMobilePanel('tables'));
  $('assignment-form').addEventListener('submit', event => {
    event.preventDefault();
    const choice = editor.querySelector('input[name="destination"]:checked');
    if (!choice) {
      $('assignment-error').textContent = 'Escolha a mesa onde esta pessoa vai ficar.';
      $('assignment-error').hidden = false;
      editor.querySelector('input').focus();
      return;
    }
    applyAssignment(Number(choice.value));
  });
  $('table-options').addEventListener('change', () => { $('assignment-error').hidden = true; });
  $('remove-guest').addEventListener('click', () => applyAssignment(null));
  $('close-editor').addEventListener('click', closeEditor);
  $('cancel-editor').addEventListener('click', closeEditor);
  editor.addEventListener('close', restoreFocus);
  $('open-review').addEventListener('click', openReview);
  $('close-review').addEventListener('click', () => review.close());
  $('back-to-map').addEventListener('click', () => review.close());
  review.addEventListener('close', () => $('open-review').focus({ preventScroll: true }));
  for (const dialog of [editor, review]) {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  }
  $('dismiss-toast').addEventListener('click', () => { $('toast').hidden = true; });
  window.addEventListener('storage', event => {
    if (event.key !== M.storageKey) return;
    const restored = M.restore(event.newValue);
    if (!restored.ok) { storageWarning('Outra janela guardou um mapa inválido. A sua distribuição foi mantida nesta janela.'); return; }
    map = restored.map;
    if (editor.open) editor.close();
    if (review.open) review.close();
    render();
    announce('O mapa foi atualizado com as alterações da outra janela.');
  });
  render();
})();
