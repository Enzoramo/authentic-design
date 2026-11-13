import { INGREDIENTS, STEPS, initialState, normaliseState, quantities, updateState } from './model.mjs';

const $ = id => document.getElementById(id);
const storageKey = 'panela-arroz-de-cogumelos-v1:' + location.pathname.replace(/index\.html$/, '');
let state = initialState();
let recoveryNotice = '';
try {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (!parsed || parsed.version !== 1) recoveryNotice = 'O progresso anterior não era compatível. A receita está pronta para recomeçar.';
    state = normaliseState(parsed);
  }
} catch {
  recoveryNotice = 'Não foi possível recuperar o progresso anterior.';
}
let mobilePanel = state.phase === 'gather' ? 'ingredients' : 'method';
let quantityChanged = false;
let storageAvailable = true;
const formatter = new Intl.NumberFormat('pt-PT');

function announce(message) { $('announcement').textContent = message; }
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); storageAvailable = true; }
  catch { storageAvailable = false; }
  $('save-status').classList.toggle('warning', !storageAvailable || Boolean(recoveryNotice));
  $('save-copy').textContent = !storageAvailable
    ? 'Não foi possível guardar o progresso. Mantenha esta página aberta.'
    : recoveryNotice || 'Progresso guardado neste dispositivo.';
}
function renderIngredients() {
  $('ingredient-progress').textContent = `${state.checked.length} de ${INGREDIENTS.length} preparados`;
  $('mobile-count').textContent = `${state.checked.length}/${INGREDIENTS.length}`;
  document.querySelectorAll('input[name="servings"]').forEach(input => { input.checked = Number(input.value) === state.servings; });
  $('ingredients-list').innerHTML = quantities(state.servings).map(ingredient => {
    const checked = state.checked.includes(ingredient.id);
    return `<label class="ingredient${checked ? ' is-checked' : ''}" for="ingredient-${ingredient.id}">
      <input type="checkbox" id="ingredient-${ingredient.id}" data-ingredient="${ingredient.id}" ${checked ? 'checked' : ''}>
      <span class="ingredient-name">${ingredient.name}</span><span class="ingredient-quantity">${formatter.format(ingredient.amount)} ${ingredient.unit}</span>
    </label>`;
  }).join('');
  $('quantity-note').textContent = quantityChanged && state.checked.length
    ? `Quantidades para ${state.servings} pessoas. Confirme os ingredientes já assinalados.`
    : state.checked.length === INGREDIENTS.length ? 'Tudo reunido. Pode seguir para a preparação.' : 'Assinale os ingredientes que já tem preparados.';
}
function renderMethod() {
  const card = $('cooking-card');
  const cooking = state.phase === 'cook';
  const done = state.phase === 'done';
  $('method-progress').textContent = done ? '4 de 4 concluídos' : cooking ? `Passo ${state.step + 1} de 4` : 'Por começar';
  $('mobile-step').textContent = done ? 'Concluída' : cooking ? `${state.step + 1}/4` : '4 passos';
  $('mobile-continue').innerHTML = `${done ? 'Ver receita concluída' : cooking ? 'Retomar a preparação' : 'Ir para a preparação'} <span aria-hidden="true">→</span>`;
  card.className = `cooking-card${done ? ' card-done' : !cooking ? ' card-start' : ''}`;
  if (done) {
    card.innerHTML = `<div class="card-topline"><span>Preparação concluída</span><span>${state.servings} pessoas</span></div>
      <div class="done-mark" aria-hidden="true">✓</div>
      <h3 id="current-step-heading" tabindex="-1">Arroz pronto.</h3>
      <p>Concluiu os 4 passos.<br>Está na hora de levar à mesa.</p>
      <div class="card-actions"><button class="back-button" data-action="review" type="button">← Rever o último passo</button><button class="primary-button" data-action="restart" type="button">Preparar de novo</button></div>`;
  } else if (!cooking) {
    card.innerHTML = `<div class="card-topline"><span class="card-stage">Antes de começar</span><span>${state.servings} pessoas</span></div>
      <h3 id="current-step-heading" tabindex="-1">Tudo à mão?</h3>
      <p class="start-copy">Reúna os ingredientes e acompanhe a receita, um passo de cada vez.</p>
      <div class="readiness"><div class="readiness-ticks" aria-hidden="true">${INGREDIENTS.map((_, i) => `<span class="${i < state.checked.length ? 'filled' : ''}"></span>`).join('')}</div><span>${state.checked.length} de 7 preparados</span></div>
      <div class="card-actions"><button class="primary-button" data-action="start" type="button">Começar preparação <span class="arrow" aria-hidden="true">→</span></button></div>`;
  } else {
    const step = STEPS[state.step];
    const revisiting = state.step < state.completed;
    const actionLabel = state.step === 3 ? 'Concluir receita' : revisiting ? 'Próximo passo' : 'Passo concluído';
    card.innerHTML = `<div class="card-topline"><span class="card-stage">${revisiting ? 'A rever' : 'Em preparação'}</span>${step.time ? `<span>${step.time}</span>` : `<span>${state.servings} pessoas</span>`}</div>
      <div class="card-heading"><span class="step-number" aria-hidden="true">${String(state.step + 1).padStart(2, '0')}</span><h3 id="current-step-heading" tabindex="-1">${step.title}</h3></div>
      <div class="method-copy"><p>${step.text}</p></div>
      <div class="card-actions"><button class="back-button" data-action="back" type="button" ${state.step === 0 ? 'disabled' : ''}>← Anterior</button><button class="primary-button" data-action="advance" type="button">${actionLabel} <span class="arrow" aria-hidden="true">${state.step === 3 ? '✓' : '→'}</span></button></div>`;
  }
  $('step-list').innerHTML = STEPS.map((step, index) => {
    const active = cooking && state.step === index;
    const complete = index < state.completed;
    const accessible = state.phase !== 'gather' && index <= Math.min(state.completed, 3);
    const status = active ? (complete ? 'A rever' : 'Passo atual') : complete ? 'Concluído' : 'Por fazer';
    return `<li class="step-item${active ? ' active' : complete ? ' complete' : ''}"><button type="button" data-step="${index}" ${accessible ? '' : 'disabled'} ${active ? 'aria-current="step"' : ''} aria-label="Passo ${index + 1}: ${step.title}. ${status}${accessible && !active ? '. Rever' : ''}"><span class="step-label"><span class="step-symbol" aria-hidden="true">${complete && !active ? '✓' : index + 1}</span>${step.title}</span><span class="step-state">${status}</span></button></li>`;
  }).join('');
}
function renderPanel() {
  $('workspace').dataset.panel = mobilePanel;
  $('show-ingredients').setAttribute('aria-pressed', String(mobilePanel === 'ingredients'));
  $('show-method').setAttribute('aria-pressed', String(mobilePanel === 'method'));
}
function render(focusHeading = false) {
  const oldFocus = document.activeElement?.id;
  renderIngredients(); renderMethod(); renderPanel();
  $('restart-button').disabled = state.phase === 'gather' && state.checked.length === 0;
  if (focusHeading) $('current-step-heading').focus({ preventScroll: true });
  else if (oldFocus && $(oldFocus)) $(oldFocus).focus({ preventScroll: true });
}
function dispatch(action, focusHeading = false) {
  state = updateState(state, action);
  recoveryNotice = '';
  save(); render(focusHeading);
}
function switchPanel(panel, focus = false) {
  mobilePanel = panel; renderPanel();
  if (focus) {
    const target = panel === 'method' ? $('current-step-heading') : $('ingredients-title');
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    $('workspace').scrollIntoView({ block: 'start' });
  }
}
function askRestart() {
  $('restart-description').textContent = `Os ingredientes e os passos serão desmarcados. Mantemos as quantidades para ${state.servings} pessoas.`;
  $('restart-dialog').returnValue = 'cancel';
  $('restart-dialog').showModal();
}
$('ingredients-list').addEventListener('change', event => {
  const id = event.target.dataset.ingredient;
  if (!id) return;
  dispatch({ type: 'ingredient', id });
  announce(`${state.checked.length} de 7 ingredientes preparados.`);
});
document.querySelector('.servings-options').addEventListener('change', event => {
  quantityChanged = true;
  dispatch({ type: 'servings', value: Number(event.target.value) });
  announce(`Quantidades ajustadas para ${state.servings} pessoas.${state.checked.length ? ' Confirme os ingredientes já assinalados.' : ''}`);
});
$('cooking-card').addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'restart') return askRestart();
  if (action === 'review') dispatch({ type: 'visit', step: 3 }, true);
  else dispatch({ type: action }, true);
  announce(state.phase === 'done' ? 'Receita concluída. Os quatro passos estão concluídos.' : `Passo ${state.step + 1} de 4: ${STEPS[state.step].title}.`);
});
$('step-list').addEventListener('click', event => {
  const button = event.target.closest('[data-step]');
  if (!button || button.disabled) return;
  dispatch({ type: 'visit', step: Number(button.dataset.step) }, true);
  announce(`Passo ${state.step + 1} de 4: ${STEPS[state.step].title}.`);
});
$('show-ingredients').addEventListener('click', () => switchPanel('ingredients'));
$('show-method').addEventListener('click', () => switchPanel('method'));
$('mobile-continue').addEventListener('click', () => switchPanel('method', true));
$('restart-button').addEventListener('click', askRestart);
$('restart-dialog').addEventListener('close', () => {
  if ($('restart-dialog').returnValue !== 'restart') return;
  quantityChanged = false; mobilePanel = 'ingredients';
  dispatch({ type: 'restart' });
  if (matchMedia('(max-width: 760px)').matches) $('show-ingredients').focus({ preventScroll: true });
  else $('ingredient-arroz').focus({ preventScroll: true });
  announce('Preparação reiniciada. Os ingredientes e os passos foram desmarcados.');
});
save(); render();
