(function () {
  'use strict';
  const C = window.ZeniteCore;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  let records = {};
  let selectedId = 'lua';
  let typeFilter = 'all';
  let statusFilter = 'all';
  let activeView = 'notebook';
  let editing = false;
  let storageAvailable = true;
  let protectedData = false;
  const illustrations = {
    lua: '<circle class="fine" cx="80" cy="70" r="61"/><path class="fine" d="M6 70h148M80 1v138"/><circle cx="80" cy="70" r="42"/><path class="fill soft" d="M80 28a42 42 0 0 1 0 84c22-15 22-69 0-84"/><path d="M80 28c22 15 22 69 0 84"/><circle class="soft" cx="66" cy="53" r="6"/><circle class="soft" cx="56" cy="76" r="9"/><circle class="soft" cx="80" cy="91" r="4"/>',
    saturno: '<circle class="fine" cx="80" cy="70" r="61"/><path class="fine" d="M6 70h148M80 1v138"/><circle class="fill soft" cx="80" cy="70" r="31"/><circle cx="80" cy="70" r="31"/><ellipse cx="80" cy="70" rx="65" ry="17" transform="rotate(-28 80 70)"/><ellipse class="soft" cx="80" cy="70" rx="57" ry="12" transform="rotate(-28 80 70)"/>',
    m42: '<circle class="fine" cx="80" cy="70" r="61"/><path class="fine" d="M6 70h148M80 1v138"/><path class="soft" d="M37 63Q32 35 65 41Q88 15 106 47Q133 53 115 76Q124 108 95 103Q62 121 57 93Q25 95 37 63Z"/><path d="M51 64Q48 47 69 52Q89 30 97 59Q117 66 100 81Q103 103 83 91Q64 106 64 84Q39 82 51 64Z"/><path d="M80 59v18M71 68h18M93 79v8M89 83h8"/><circle class="fill" cx="58" cy="69" r="1.5"/>',
    pleiades: '<circle class="fine" cx="80" cy="70" r="61"/><path class="fine" d="M6 70h148M80 1v138"/><path class="fine" d="M42 76l22-24 22 19 23-20-9 40-32 6-26-21"/><path d="M64 45v14M57 52h14M86 63v16M78 71h16M109 44v14M102 51h14M100 85v12M94 91h12M42 70v12M36 76h12M68 92v10M63 97h10"/><circle class="fill" cx="76" cy="40" r="2"/><circle class="fill" cx="116" cy="77" r="1.5"/>'
  };
  function warn(message) { $('storage-warning').textContent = message; $('storage-warning').hidden = false; }
  function announce(message) { $('announcer').textContent = ''; window.setTimeout(() => { $('announcer').textContent = message; }, 40); }
  try {
    const raw = localStorage.getItem(C.KEY);
    try { records = C.decode(raw); }
    catch (error) {
      protectedData = true;
      storageAvailable = false;
      warn('Os registros deste navegador não puderam ser lidos. Para preservar os dados anteriores, novos registros ficarão apenas nesta aba.');
    }
  } catch (error) {
    storageAvailable = false;
    warn('O armazenamento local está indisponível. Você pode usar o caderno, mas os registros desta aba serão perdidos ao recarregar.');
  }
  function persist() {
    if (protectedData) return false;
    try {
      localStorage.setItem(C.KEY, C.encode(records));
      storageAvailable = true;
      $('storage-warning').hidden = true;
      return true;
    } catch (error) {
      storageAvailable = false;
      warn('Não foi possível guardar os registros neste navegador. Eles continuam disponíveis nesta aba, mas serão perdidos ao recarregar.');
      return false;
    }
  }
  function badge(status) {
    return '<span class="status ' + status + '"><span class="status-symbol" aria-hidden="true">' + C.statuses[status].symbol + '</span>' + C.statuses[status].label + '</span>';
  }
  function renderHeader() {
    const total = C.counts(records);
    const done = total.seen + total.unseen;
    $('done-count').textContent = done;
    $('summary-count').textContent = done;
    $('progress-percent').textContent = Math.round(done / C.targets.length * 100) + '%';
    $('pending-copy').textContent = total.pending ? total.pending + (total.pending === 1 ? ' alvo à espera de um registro' : ' alvos à espera de um registro') : 'Todos os alvos têm um registro';
    $('progress-track').innerHTML = C.targets.map(target => '<span class="progress-step ' + C.getStatus(records, target.id) + '"></span>').join('');
    const footer = document.querySelector('.footer p');
    footer.innerHTML = '<span class="local-dot" aria-hidden="true"></span>' + (storageAvailable ? 'Registros guardados neste navegador' : 'Registros temporários · apenas nesta aba');
    document.querySelectorAll('[data-view]').forEach(button => {
      if (button.dataset.view === activeView) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    $('notebook-view').hidden = activeView !== 'notebook';
    $('summary-view').hidden = activeView !== 'summary';
  }
  function renderList() {
    const filtered = C.filterTargets(records, typeFilter, statusFilter);
    $('filtered-count').textContent = filtered.length + (filtered.length === 1 ? ' ALVO' : ' ALVOS');
    $('target-list').innerHTML = filtered.map(target => '<button class="target-row" type="button" data-target="' + target.id + '" aria-pressed="' + (target.id === selectedId) + '" aria-controls="target-detail" aria-label="' + target.name + ', ' + target.typeLabel + ', ' + target.time + ', ' + C.statuses[C.getStatus(records, target.id)].label + '"><span class="target-time">' + target.time + '</span><span><span class="target-name">' + target.name + '</span><span class="target-meta"><span class="target-category">' + target.typeLabel + '</span>' + badge(C.getStatus(records, target.id)) + '</span></span><span class="row-arrow" aria-hidden="true">→</span></button>').join('');
    $('list-empty').hidden = filtered.length > 0;
    document.querySelectorAll('[data-target]').forEach(button => button.addEventListener('click', () => selectTarget(button.dataset.target, true)));
  }
  function currentDirty() {
    const form = $('observation-form');
    if (!form || activeView !== 'notebook') return false;
    const formData = new FormData(form);
    const record = records[selectedId];
    return (formData.get('outcome') || '') !== (record ? record.status : '') || (formData.get('note') || '') !== (record ? record.note : '');
  }
  function mayLeave() { return !currentDirty() || window.confirm('Há alterações ainda não salvas. Deseja descartá-las e continuar?'); }
  function focusDetail(scroll) {
    const title = $('detail-title');
    if (!title) return;
    title.focus({ preventScroll: true });
    if (scroll && window.matchMedia('(max-width: 800px)').matches) $('target-detail').scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  function selectTarget(id, scroll) {
    if (id !== selectedId && !mayLeave()) return;
    if (id === selectedId && activeView === 'notebook') { focusDetail(scroll); return; }
    selectedId = id;
    editing = false;
    renderList(); renderDetail();
    focusDetail(scroll);
  }
  function renderDetail() {
    const target = C.targets.find(item => item.id === selectedId);
    if (!target) {
      $('target-detail').innerHTML = '<div class="empty-detail"><svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="22"/><path d="M30 0v60M0 30h60"/></svg><h2>Um olhar de cada vez.</h2><p>Escolha um alvo no roteiro para registrar sua observação.</p></div>';
      return;
    }
    const record = records[target.id];
    const status = C.getStatus(records, target.id);
    const outside = !C.filterTargets(records, typeFilter, statusFilter).some(item => item.id === target.id);
    let html = outside ? '<p class="outside-filter">Este alvo está fora dos filtros atuais. <button type="button" class="text-button" id="show-all">Mostrar todos</button></p>' : '';
    html += '<div class="detail-topline"><p class="eyebrow">ALVO ' + String(target.order).padStart(2, '0') + ' / 04</p>' + badge(status) + '</div><div class="detail-head"><div><span class="target-kind">' + target.typeLabel.toUpperCase() + '</span><h2 id="detail-title" tabindex="-1">' + target.name + '</h2><span class="detail-time"><strong>' + target.time + '</strong> · horário ilustrativo</span></div><svg class="celestial" viewBox="0 0 160 140" aria-hidden="true">' + illustrations[target.id] + '</svg></div>';
    if (!record || editing) {
      html += '<form id="observation-form" class="record-form"><fieldset><legend>' + (editing ? 'Editar resultado da observação' : 'Conseguiu observar este alvo?') + '</legend><div class="outcome-options"><label class="outcome-option"><input type="radio" name="outcome" value="seen" required ' + (record && record.status === 'seen' ? 'checked' : '') + '>Visto</label><label class="outcome-option"><input type="radio" name="outcome" value="unseen" required ' + (record && record.status === 'unseen' ? 'checked' : '') + '>Não visto</label></div></fieldset><label class="note-label" for="observation-note">Nota de campo <span>opcional</span></label><textarea id="observation-note" name="note" maxlength="600" rows="3" aria-describedby="note-help" placeholder="O que chamou sua atenção? Ou o que impediu a observação?">' + escape(record ? record.note : '') + '</textarea><div class="note-meta"><span id="note-help">Detalhes para lembrar depois da noite.</span><span class="note-count"><span id="note-length">' + (record ? record.note.length : 0) + '</span>/600</span></div><p id="record-error" class="record-error" role="alert" hidden></p><div class="form-actions"><button type="submit" class="primary-button">' + (editing ? 'Salvar alterações' : 'Salvar observação') + '<span aria-hidden="true">↗</span></button>' + (editing ? '<button type="button" class="text-button" id="cancel-edit">Cancelar edição</button>' : '') + '</div><p class="form-help">' + (storageAvailable ? 'O registro fica guardado neste navegador, mesmo ao fechar a página.' : 'Armazenamento indisponível. O registro ficará apenas nesta aba.') + '</p></form>';
    } else {
      const nextTarget = C.targets.find(item => C.getStatus(records, item.id) === 'pending');
      html += '<div class="record-reading"><p class="saved-label">' + (storageAvailable ? '✓ REGISTRO SALVO NESTE NAVEGADOR' : 'REGISTRO TEMPORÁRIO NESTA ABA') + '</p><h3>' + (record.status === 'seen' ? 'Visto nesta sessão.' : 'Não visto nesta sessão.') + '</h3><p class="record-note ' + (!record.note ? 'no-note' : '') + '">' + (record.note ? escape(record.note) : 'Nenhuma nota adicionada.') + '</p><div class="saved-actions"><button type="button" class="secondary-button" id="edit-record">Editar registro</button><button type="button" class="text-button" id="reset-record">Voltar a pendente</button></div><div class="next-target"><p>' + (nextTarget ? 'Ainda no roteiro<br><strong>' + nextTarget.name + ' · ' + nextTarget.time + '</strong>' : 'Quatro alvos, uma noite.<br><strong>Todos os registros concluídos.</strong>') + '</p><button type="button" class="text-button" id="next-action">' + (nextTarget ? 'Abrir próximo pendente →' : 'Revisar a sessão →') + '</button></div></div>';
    }
    $('target-detail').innerHTML = html;
    if ($('show-all')) $('show-all').addEventListener('click', clearFilters);
    const form = $('observation-form');
    if (form) {
      $('observation-note').addEventListener('input', event => { $('note-length').textContent = event.target.value.length; });
      form.addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(form);
        try { records = C.saveRecord(records, target.id, data.get('outcome'), data.get('note')); }
        catch (error) { $('record-error').textContent = error.message; $('record-error').hidden = false; return; }
        const persisted = persist();
        editing = false;
        renderAll();
        focusDetail(false);
        announce(target.name + ': ' + C.statuses[records[target.id].status].label + '. ' + (persisted ? 'Registro salvo.' : 'Registro disponível apenas nesta aba.'));
      });
    }
    if ($('cancel-edit')) $('cancel-edit').addEventListener('click', () => { if (!mayLeave()) return; editing = false; renderDetail(); $('edit-record').focus(); });
    if ($('edit-record')) $('edit-record').addEventListener('click', () => { editing = true; renderDetail(); document.querySelector('input[name="outcome"]:checked').focus(); });
    if ($('reset-record')) $('reset-record').addEventListener('click', () => {
      if (!window.confirm('Voltar ' + target.name + ' a pendente? O resultado e a nota deste alvo serão removidos.')) return;
      records = C.removeRecord(records, target.id);
      const persisted = persist();
      editing = false;
        renderAll(); focusDetail(false);
      announce(target.name + ' voltou a pendente.' + (persisted ? '' : ' A mudança ficou apenas nesta aba.'));
    });
    if ($('next-action')) $('next-action').addEventListener('click', () => {
      const nextTarget = C.targets.find(item => C.getStatus(records, item.id) === 'pending');
      if (nextTarget) { setAllFilters(); selectTarget(nextTarget.id, true); }
      else changeView('summary');
    });
  }
  function setAllFilters() {
    typeFilter = 'all'; statusFilter = 'all';
    $('type-filter').value = 'all'; $('status-filter').value = 'all';
  }
  function clearFilters() {
    if (!mayLeave()) return;
    setAllFilters();
    if (!selectedId) selectedId = C.targets[0].id;
    editing = false;
    renderList(); renderDetail();
    announce('Filtros removidos. Quatro alvos disponíveis.');
  }
  function renderSummary() {
    const total = C.counts(records);
    const groupNames = { seen: 'Vistos', unseen: 'Não vistos', pending: 'Pendentes' };
    const groupHints = { seen: 'Observação realizada', unseen: 'Tentativa registrada', pending: 'Sem registro ainda' };
    let html = '<div class="summary-heading"><div><h2 id="summary-title" tabindex="-1">O que ficou desta noite</h2><p>14 de novembro · Pátio do clube · sessão fictícia</p></div><button type="button" class="text-button" id="back-notebook">← Voltar ao caderno</button></div><div class="summary-stats">';
    ['seen', 'unseen', 'pending'].forEach(status => { html += '<div class="summary-stat ' + status + '"><strong>' + total[status] + '</strong><div><span>' + groupNames[status] + '</span><small>' + groupHints[status] + '</small></div></div>'; });
    html += '</div>';
    ['seen', 'unseen', 'pending'].forEach(status => {
      const filtered = C.filterTargets(records, 'all', status);
      html += '<section class="summary-group"><h3><span class="status ' + status + '"><span class="status-symbol" aria-hidden="true">' + C.statuses[status].symbol + '</span>' + groupNames[status] + '</span><small>' + filtered.length + (filtered.length === 1 ? ' alvo' : ' alvos') + '</small></h3><div>';
      if (!filtered.length) html += '<p class="summary-empty">' + (status === 'pending' ? 'Todos os alvos têm um registro.' : status === 'seen' ? 'Nenhum alvo marcado como visto.' : 'Nenhum alvo marcado como não visto.') + '</p>';
      filtered.forEach(target => {
        const record = records[target.id];
        html += '<article class="summary-item"><time>' + target.time + '</time><div><h4>' + target.name + '<span class="item-type">' + target.typeLabel + '</span></h4><p>' + (record ? (record.note ? escape(record.note) : 'Sem nota de campo.') : 'À espera da sua observação.') + '</p></div><button type="button" class="text-button" data-review="' + target.id + '" aria-label="' + (record ? 'Revisar registro de ' : 'Registrar observação de ') + target.name + '">' + (record ? 'Revisar' : 'Registrar') + ' ↗</button></article>';
      });
      html += '</div></section>';
    });
    $('summary-view').innerHTML = html;
    $('back-notebook').addEventListener('click', () => changeView('notebook'));
    document.querySelectorAll('[data-review]').forEach(button => button.addEventListener('click', () => {
      setAllFilters(); selectedId = button.dataset.review; editing = false; activeView = 'notebook'; renderAll(); focusDetail(true);
    }));
  }
  function renderAll() { renderHeader(); renderList(); renderDetail(); renderSummary(); }
  function changeView(view) {
    if (view === activeView) return;
    if (!mayLeave()) return;
    activeView = view; editing = false;
    renderAll();
    if (view === 'summary') $('summary-title').focus({ preventScroll: true });
    else focusDetail(false);
  }
  function applyFilters() {
    if (!mayLeave()) { $('type-filter').value = typeFilter; $('status-filter').value = statusFilter; return; }
    typeFilter = $('type-filter').value; statusFilter = $('status-filter').value;
    const filtered = C.filterTargets(records, typeFilter, statusFilter);
    if (!filtered.some(target => target.id === selectedId)) selectedId = filtered.length ? filtered[0].id : null;
    editing = false;
    renderList(); renderDetail();
    announce(filtered.length + (filtered.length === 1 ? ' alvo encontrado.' : ' alvos encontrados.'));
  }
  $('type-filter').addEventListener('change', applyFilters);
  $('status-filter').addEventListener('change', applyFilters);
  $('clear-filters').addEventListener('click', clearFilters);
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => changeView(button.dataset.view)));
  window.addEventListener('beforeunload', event => { if (currentDirty()) { event.preventDefault(); event.returnValue = ''; } });
  renderAll();
})();
