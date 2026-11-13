(() => {
  'use strict';
  const M = window.RevezModel;
  const KEY = 'revez-demo-v1';
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const formatDate = value => value.split('-').reverse().join('/');
  const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24">${({ arrow:'<path d="m9 5 7 7-7 7"/>', back:'<path d="m14 5-7 7 7 7"/>', plus:'<path d="M12 5v14M5 12h14"/>', close:'<path d="m6 6 12 12M6 18 18 6"/>', return:'<path d="M7 8h9a5 5 0 0 1 0 10h-4M7 8l4-4M7 8l4 4"/>' })[name]}</svg>`;
  let state = M.fresh(), readOnly = false, query = '', filter = 'all', selected = 'F01';
  let pending = null, opener = null;
  const dialog = $('#transaction');
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) state = M.decode(saved);
  } catch (error) {
    readOnly = true;
    $('#storage-error').hidden = false;
    $('#storage-error').textContent = 'Não foi possível ler os registos guardados. A demonstração está em modo de consulta para evitar substituí-los. Verifique o armazenamento do navegador.';
  }
  function commit(next, message) {
    if (readOnly) return false;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      state = next;
      render();
      $('#feedback').textContent = message + ' Guardado neste navegador.';
      return true;
    } catch (error) {
      const message = 'Não foi possível guardar. O registo não foi alterado. Verifique o espaço ou as permissões de armazenamento e tente novamente.';
      if (dialog.open) {
        let box = $('#modal-error');
        if (!box) { box = document.createElement('p'); box.id = 'modal-error'; box.className = 'modal-error'; box.setAttribute('role','alert'); $('#dialog-content .modal-inner').append(box); }
        box.textContent = message;
      } else {
        $('#storage-error').hidden = false;
        $('#storage-error').textContent = message;
      }
      return false;
    }
  }
  function itemStatus(item) {
    if (item.status === 'available') return 'Disponível para empréstimo';
    if (item.status === 'maintenance') return 'Em manutenção · indisponível';
    const late = M.overdueDays(item);
    return late ? `Com ${item.loan.person} · em atraso há ${late} ${late===1?'dia':'dias'}` : `Com ${item.loan.person} · devolver ${formatDate(item.loan.due)}`;
  }
  function renderFilters() {
    $('#filters').innerHTML = [['all','Todos'],['available','Disponíveis'],['loaned','Emprestados'],['maintenance','Manutenção']].map(([key,label])=>`<button class="filter-button" type="button" data-filter="${key}" aria-pressed="${key===filter}">${label}<span>${key==='all'?state.objects.length:state.objects.filter(item=>item.status===key).length}</span></button>`).join('');
  }
  function renderList() {
    const objects = M.search(state.objects, query, filter);
    $('#result-count').textContent = `${objects.length} ${objects.length===1?'objeto':'objetos'}`;
    $('#object-list').innerHTML = objects.map(item => `<button type="button" class="object-row" data-object="${item.id}" aria-current="${item.id===selected}" aria-label="Abrir ${escape(item.name)}, ${item.id}. ${escape(itemStatus(item))}"><span class="code-block">${item.id}</span><span class="object-copy"><span class="object-name">${escape(item.name)}</span><span class="object-status ${M.overdueDays(item)?'late':''}">${escape(itemStatus(item))}</span></span><span class="row-arrow">${icon('arrow')}</span></button>`).join('');
    $('#empty').hidden = objects.length > 0;
  }
  function history(item) {
    if (!item.history.length) return `<p class="empty-history">Ainda não há movimentos registados.<br>${item.status==='maintenance'?'Este objeto está em manutenção na demonstração.':'O próximo empréstimo ficará registado aqui.'}</p>`;
    return `<ol class="history-list">${item.history.map(event=>`<li><span class="history-date">${event.initial?'Registo inicial da demonstração':formatDate(event.date)}</span><span class="history-title">${event.kind==='loan'?'Empréstimo':'Devolução'} · ${escape(event.person)}</span><span class="history-meta">${event.kind==='loan'?'Devolução prevista':'Prazo do empréstimo'}: ${formatDate(event.due)}</span></li>`).join('')}</ol>`;
  }
  function renderDetail() {
    const item = state.objects.find(item => item.id===selected);
    const statusNames = { available:'Disponível', loaned:'Emprestado', maintenance:'Em manutenção' };
    let action;
    if (item.status==='available') {
      action = `<p class="availability-note">Pronto para a próxima pessoa.<small>Indique quem leva o objeto e quando o devolve.</small></p><button class="primary-button full" data-action="loan" ${readOnly?'disabled':''}>${icon('plus')}Registar empréstimo</button>`;
    } else if (item.status==='loaned') {
      const late = M.overdueDays(item);
      action = `<dl class="loan-data"><div><dt>Com</dt><dd>${escape(item.loan.person)}</dd></div><div><dt>Devolução prevista</dt><dd>${formatDate(item.loan.due)}</dd></div></dl>${late?`<p class="late-notice">Em atraso há <strong>${late} ${late===1?'dia':'dias'}</strong></p>`:`<p class="due-notice">${item.loan.due===M.TODAY?'A devolução está prevista para hoje.':item.loan.due==='2026-11-14'?'A devolução está prevista para amanhã.':'Empréstimo dentro do prazo.'}</p>`}<button class="primary-button full" data-action="return" ${readOnly?'disabled':''}>${icon('return')}Registar devolução</button>`;
    } else {
      action = `<p class="availability-note">Temporariamente fora de circulação.<small>Este objeto não pode ser emprestado enquanto estiver em manutenção.</small></p><button class="primary-button full" disabled>Empréstimo indisponível</button>`;
    }
    $('#detail').innerHTML = `<button class="back-button" data-action="back">${icon('back')}Voltar aos objetos</button><div class="detail-top"><span>Ficha do objeto</span><span class="detail-code">${item.id}</span></div><h2 id="detail-title" tabindex="-1">${escape(item.name)}</h2><div class="detail-status"><span class="status-badge ${item.status}">${statusNames[item.status]}</span></div>${action}<section class="history" aria-labelledby="history-title"><h3 id="history-title">Histórico do objeto</h3>${history(item)}</section>`;
  }
  function render() {
    renderFilters();renderList();renderDetail();
    const overdue = state.objects.filter(item=>M.overdueDays(item)).length;
    $('#overdue-summary').textContent = overdue ? `${overdue} em atraso` : 'Devoluções em dia';
    $('#undo').disabled = !state.lastOperation || readOnly;
    $('#undo').title = state.lastOperation ? `Desfazer: ${state.lastOperation.label}` : 'Disponível depois de registar um movimento';
  }
  function openObject(id) {
    selected = id;
    renderList();renderDetail();
    document.body.classList.add('detail-open');
    $('#detail-title').focus({preventScroll:true});
    if (window.matchMedia('(max-width:760px)').matches) window.scrollTo({top:0,behavior:'instant'});
  }
  function modalShell(title, phase, content) {
    return `<div class="modal-inner"><div class="modal-top"><span>${phase}</span><button class="close-button" data-modal="cancel" aria-label="Fechar e cancelar">${icon('close')}</button></div><h2 id="dialog-title" tabindex="-1">${title}</h2>${content}</div>`;
  }
  function objectSummary(item) { return `<div class="modal-object"><span class="code">${item.id}</span><strong>${escape(item.name)}</strong></div>`; }
  function showLoanForm(errors={}) {
    const item = state.objects.find(item=>item.id===pending.id);
    pending.step = 'form';
    $('#dialog-content').innerHTML = modalShell('Registar empréstimo','1 de 2 · Dados do empréstimo',`<p class="modal-intro">Quem leva este objeto e quando o devolve?</p>${objectSummary(item)}<form id="loan-form" novalidate><div class="field"><label for="person">Nome da pessoa</label><input id="person" name="person" type="text" maxlength="80" autocomplete="off" required value="${escape(pending.person)}" placeholder="Ex.: Ana Silva" ${errors.person?'aria-invalid="true" aria-describedby="person-error"':''}>${errors.person?`<p id="person-error" class="field-error">${errors.person}</p>`:''}</div><div class="field"><label for="due">Data de devolução</label><input id="due" name="due" type="date" min="${M.TODAY}" required value="${escape(pending.due)}" aria-describedby="due-hint${errors.due?' due-error':''}" ${errors.due?'aria-invalid="true"':''}><small id="due-hint">Em 13/11/2026 ou depois, a data fixa desta demonstração.</small>${errors.due?`<p id="due-error" class="field-error">${errors.due}</p>`:''}</div><div class="modal-actions"><button class="secondary-button" type="button" data-modal="cancel">Cancelar</button><button class="primary-button" type="submit">Rever empréstimo</button></div></form>`);
    if (dialog.open) $(errors.person?'#person':errors.due?'#due':'#person').focus();
  }
  function showLoanReview() {
    const item = state.objects.find(item=>item.id===pending.id);
    pending.step = 'review';
    $('#dialog-content').innerHTML = modalShell('Confirmar este empréstimo?','2 de 2 · Rever e confirmar',`${objectSummary(item)}<dl class="review-data"><div><dt>Pessoa</dt><dd>${escape(pending.person)}</dd></div><div><dt>Devolução prevista</dt><dd>${formatDate(pending.due)}</dd></div></dl><button class="text-button review-edit" data-modal="edit">Editar dados</button><p class="review-note">Ao confirmar, o objeto passa a emprestado. Pode desfazer a operação depois de a registar.</p><div class="modal-actions"><button class="secondary-button" data-modal="cancel">Cancelar</button><button class="primary-button" data-modal="confirm-loan">Confirmar empréstimo</button></div>`);
    $('#dialog-title').focus();
  }
  function begin(kind) {
    const item = state.objects.find(item=>item.id===selected);
    if (readOnly || (kind==='loan' && item.status!=='available') || (kind==='return' && item.status!=='loaned')) return;
    opener = document.activeElement;
    pending = { id:item.id, kind, person:'', due:'' };
    if (kind==='loan') showLoanForm();
    else $('#dialog-content').innerHTML = modalShell('Registar esta devolução?','Devolução do objeto',`${objectSummary(item)}<dl class="review-data"><div><dt>Emprestado a</dt><dd>${escape(item.loan.person)}</dd></div><div><dt>Devolução prevista</dt><dd>${formatDate(item.loan.due)}</dd></div></dl><p class="review-note">Confirme que o objeto já está na biblioteca. Ficará disponível para um novo empréstimo a partir de 13/11/2026.</p><div class="modal-actions"><button class="secondary-button" data-modal="cancel">Cancelar</button><button class="primary-button" data-modal="confirm-return">Confirmar devolução</button></div>`);
    dialog.showModal();
    if (kind==='loan') $('#person').focus(); else $('#dialog-title').focus();
  }
  function closeDialog() {
    dialog.close(); pending = null;
    if (opener && opener.isConnected) opener.focus(); else $('#detail-title').focus({preventScroll:true});
  }
  $('#search').addEventListener('input', event=> { query=event.target.value;renderList(); });
  $('#filters').addEventListener('click', event=> {
    const button = event.target.closest('[data-filter]'); if (!button) return;
    filter=button.dataset.filter; renderFilters();renderList();
    $(`[data-filter="${filter}"]`).focus({preventScroll:true});
  });
  $('#object-list').addEventListener('click', event=> { const row=event.target.closest('[data-object]'); if(row) openObject(row.dataset.object); });
  $('#detail').addEventListener('click', event=> {
    const action=event.target.closest('[data-action]')?.dataset.action;
    if(action==='loan'||action==='return') begin(action);
    if(action==='back') { document.body.classList.remove('detail-open'); $(`[data-object="${selected}"]`)?.focus({preventScroll:true}); }
  });
  $('#clear-search').addEventListener('click',()=> { query='';filter='all';$('#search').value='';renderFilters();renderList();$('#search').focus(); });
  $('#undo').addEventListener('click',()=> {
    if(!state.lastOperation||readOnly)return;
    const operation=state.lastOperation;
    selected=operation.id;
    if(commit(M.undo(state),`Última operação desfeita: ${operation.label}.`)) {
      const target = window.matchMedia('(max-width:760px)').matches && !document.body.classList.contains('detail-open') ? $(`[data-object="${selected}"]`) || $('#search') : $('#detail-title');
      target.focus({preventScroll:true});
    }
  });
  dialog.addEventListener('submit', event=> {
    if(event.target.id!=='loan-form')return;
    event.preventDefault();
    pending.person=$('#person').value.trim(); pending.due=$('#due').value;
    const errors=M.validateLoan(pending.person,pending.due);
    if(Object.keys(errors).length) showLoanForm(errors); else showLoanReview();
  });
  dialog.addEventListener('click', event=> {
    const action=event.target.closest('[data-modal]')?.dataset.modal;
    if(action==='cancel') closeDialog();
    else if(action==='edit') showLoanForm();
    else if(action==='confirm-loan'||action==='confirm-return') {
      const operation=pending;
      if(!operation)return;
      try {
        const next=M.transact(state,operation.id,operation.kind,operation);
        const name=state.objects.find(item=>item.id===operation.id).name;
        if(commit(next,`${operation.kind==='loan'?'Empréstimo':'Devolução'} de ${name} ${operation.kind==='loan'?'registado':'registada'}.`)) closeDialog();
      } catch(error) {
        $('#dialog-content').insertAdjacentHTML('beforeend',`<p class="modal-error" role="alert">${escape(error.message)}</p>`);
      }
    }
  });
  dialog.addEventListener('cancel', event=> {event.preventDefault();closeDialog();});
  render();
  if (state.lastOperation) $('#feedback').textContent = `${state.lastOperation.label} · guardado neste navegador.`;
})();
