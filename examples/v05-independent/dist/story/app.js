(function () {
  'use strict';
  const S = window.VeredaStory;
  const persistence = window.VeredaPersistence;
  const stored = persistence.read();
  let state = S.normalize(stored.value);
  const resumeScroll = state.scroll;
  const $ = id => document.getElementById(id);
  const pathDialog = $('path-dialog');
  const restartDialog = $('restart-dialog');
  let saveAvailable = stored.available;
  let scrollTimer;

  function announce(message) { $('announcements').textContent = message; }
  function save() {
    saveAvailable = persistence.write(state);
    const label = saveAvailable ? 'Leitura guardada neste navegador' : 'Não foi possível guardar. Mantenha esta aba aberta para preservar a leitura.';
    if ($('save-status').textContent !== label) $('save-status').textContent = label;
    $('save-status').classList.toggle('failed', !saveAvailable);
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function renderMargin() {
    $('margin-path').replaceChildren();
    state.path.forEach((id, index) => {
      const isCurrent = index === state.path.length - 1;
      const item = element('li', isCurrent ? 'current' : '', S.passages[id].title);
      if (isCurrent) {
        item.setAttribute('aria-current', 'step');
        item.append(element('span', 'current-label', 'Você está aqui.'));
      }
      $('margin-path').append(item);
    });
  }
  function render() {
    const passage = S.current(state);
    const isEnding = passage.choices.length === 0;
    document.title = `${passage.title} · Vereda`;
    document.documentElement.style.setProperty('--scale', state.size / 100);
    $('text-size').value = String(state.size);
    $('passage-position').textContent = `Passagem ${state.path.length}`;
    $('passage-title').textContent = passage.title;
    $('passage-text').textContent = passage.text;
    $('ending-label').hidden = !isEnding;
    $('decisions').hidden = isEnding;
    $('ending-actions').hidden = !isEnding;
    $('back').disabled = state.path.length === 1;
    $('path-count').textContent = state.path.length;
    $('open-path').setAttribute('aria-label', `Consultar percurso: ${state.path.length} ${state.path.length === 1 ? 'passagem' : 'passagens'}`);
    $('choices').replaceChildren();
    passage.choices.forEach(choice => {
      const button = element('button', 'choice');
      button.type = 'button';
      button.append(element('span', '', choice.label));
      const arrow = element('span', 'choice-arrow', '→');
      arrow.setAttribute('aria-hidden', 'true');
      button.append(arrow);
      button.addEventListener('click', () => navigate(S.choose(state, choice.to)));
      $('choices').append(button);
    });
    renderMargin();
  }
  function navigate(next) {
    clearTimeout(scrollTimer);
    state = next;
    render();
    save();
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('passage-title').focus({ preventScroll: true });
  }
  function openPath() {
    $('history-list').replaceChildren();
    state.path.forEach((id, index) => {
      const passage = S.passages[id];
      const isCurrent = index === state.path.length - 1;
      const item = element('li', isCurrent ? 'current' : '');
      const details = element('details');
      details.open = isCurrent;
      const summary = element('summary');
      summary.append(element('span', 'history-index', String(index + 1)), element('span', '', passage.title));
      if (isCurrent) summary.append(element('span', 'history-current', 'Passagem atual'));
      details.append(summary, element('p', 'history-text', passage.text));
      if (!isCurrent) {
        const choice = passage.choices.find(option => option.to === state.path[index + 1]);
        const decision = element('p', 'history-choice', 'Você escolheu');
        decision.append(element('span', '', choice.label));
        details.append(decision);
      }
      item.append(details);
      $('history-list').append(item);
    });
    pathDialog.showModal();
    pathDialog.scrollTop = 0;
  }
  $('back').addEventListener('click', () => navigate(S.back(state)));
  $('text-size').addEventListener('change', event => {
    const size = Number(event.target.value);
    if (!S.sizes.includes(size)) return;
    state = { ...state, size };
    document.documentElement.style.setProperty('--scale', state.size / 100);
    save();
    announce(`Tamanho do texto: ${event.target.selectedOptions[0].textContent}.`);
  });
  $('open-path').addEventListener('click', openPath);
  $('inspect-path').addEventListener('click', openPath);
  $('close-path').addEventListener('click', () => pathDialog.close());
  $('resume').addEventListener('click', () => {
    pathDialog.close();
    $('passage-title').focus({ preventScroll: true });
  });
  $('open-restart').addEventListener('click', () => restartDialog.showModal());
  $('cancel-restart').addEventListener('click', () => restartDialog.close());
  $('confirm-restart').addEventListener('click', () => {
    restartDialog.close();
    navigate(S.restart(state));
    announce('Novo percurso iniciado. O tamanho do texto foi mantido.');
  });
  [pathDialog, restartDialog].forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });
  function saveScroll() {
    state.scroll = window.scrollY;
    save();
  }
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(saveScroll, 180);
  }, { passive: true });
  window.addEventListener('pagehide', saveScroll);
  render();
  save();
  $('recovery-notice').hidden = !stored.recovered;
  requestAnimationFrame(() => {
    window.scrollTo({ top: resumeScroll, behavior: 'instant' });
    if (stored.value && state.path.length > 1) announce(`Leitura retomada em ${S.current(state).title}.`);
  });
})();
