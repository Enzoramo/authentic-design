/* Run with node verify.cjs. No browser or third-party packages required. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const C = require('./core.js');
let checks = 0;
function test(name, run) { run(); checks++; console.log('✓ ' + name); }
const initialTime = 1800000000000;
const start = () => C.initial(initialTime);
function act(s, type, extra = {}, now = initialTime + 10000) {
  const result = C.apply(s, {type, ...extra}, now);
  assert.equal(result.ok, true, JSON.stringify(result));
  return result.state;
}
test('Primeira carreira e sequência de quatro passos', () => {
  let s = start();
  for (let row = 1; row <= 48; row++) {
    const v = C.view(s);
    assert.equal(v.row, row);
    assert.equal(v.step, ((row - 1) % 4) + 1);
    assert.equal(v.cycle, Math.ceil(row / 4));
    assert.equal(v.instruction, C.PATTERN[v.step - 1]);
    if (row < 48) s = act(s, 'advance', {}, initialTime + row * 2000);
  }
});
test('Toque duplo e limite exato da proteção de 1,4 segundos', () => {
  let s = act(start(), 'advance');
  assert.equal(C.apply(s, {type: 'advance'}, initialTime + 10001).code, 'debounced');
  assert.equal(C.apply(s, {type: 'advance'}, initialTime + 11399).code, 'debounced');
  s = act(s, 'advance', {}, initialTime + 11400);
  assert.equal(s.completed, 2);
});
test('Última carreira exige confirmação explícita', () => {
  let s = act(start(), 'jump', {row: 48});
  assert.equal(C.apply(s, {type: 'advance'}).code, 'confirm-finish');
  s = act(s, 'finish');
  assert.equal(s.completed, 48);
  assert.equal(C.view(s).row, null);
  assert.equal(C.apply(s, {type: 'advance'}).code, 'already-done');
  s = act(s, 'undo');
  assert.equal(C.view(s).row, 48);
});
test('Saltar para uma carreira marca só as anteriores; desfazer recupera', () => {
  let s = act(start(), 'jump', {row: 24});
  assert.equal(s.completed, 23);
  s = act(s, 'jump', {row: 7});
  assert.equal(C.view(s).step, 3);
  s = act(s, 'undo');
  assert.equal(C.view(s).row, 24);
  for (const row of [0, 49, -1, 1.2, NaN, '', '7', Infinity]) {
    assert.equal(C.apply(s, {type: 'jump', row}).code, 'invalid-row');
  }
});
test('Reinício, conclusão e mudança de posição podem ser desfeitos', () => {
  let s = act(start(), 'jump', {row: 28});
  s = act(s, 'finish');
  s = act(s, 'restart');
  assert.equal(s.completed, 0);
  s = act(s, 'undo'); assert.equal(s.completed, 48);
  s = act(s, 'undo'); assert.equal(s.completed, 27);
  s = act(s, 'undo'); assert.equal(s.completed, 0);
  assert.equal(C.apply(s, {type: 'undo'}).code, 'no-history');
});
test('Serialização conserva posição, histórico e proteção após recarregar', () => {
  const s = act(start(), 'advance');
  const restored = C.parse(JSON.stringify(s));
  assert.deepEqual(restored, s);
  assert.equal(C.apply(restored, {type: 'advance'}, initialTime + 10500).code, 'debounced');
  assert.equal(act(restored, 'undo').completed, 0);
  for (const invalid of ['bad', '{}', 'null', '{"version":8}', JSON.stringify({...s, completed: 49}), JSON.stringify({...s, history: [{completed: 0, kind: 'unknown'}]})]) assert.equal(C.parse(invalid), null);
});
test('Todas as 48 carreiras podem ser desfeitas individualmente', () => {
  let s = start();
  for (let row = 1; row < 48; row++) s = act(s, 'advance', {}, initialTime + row * 2000);
  s = act(s, 'finish');
  for (let count = 47; count >= 0; count--) {
    s = act(s, 'undo');
    assert.equal(s.completed, count);
  }
});

// Minimal DOM substitute: verifies wiring and persistence logic, not browser layout,
// native dialog focus trapping, pointer events, or accessibility rendering.
class FakeElement {
  constructor(id = '') {
    this.id = id; this.textContent = ''; this.children = []; this.hidden = false;
    this.disabled = false; this.value = ''; this.dataset = {}; this.attrs = {};
    this.style = {}; this.listeners = {}; this.title = ''; this.open = false;
    this.lastChild = {textContent: ''};
    const classes = new Set();
    this.classList = {add: v => classes.add(v), remove: v => classes.delete(v),
      toggle: (v, active) => active ? classes.add(v) : classes.delete(v), contains: v => classes.has(v)};
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  removeAttribute(k) { delete this.attrs[k]; }
  append(el) { this.children.push(el); }
  replaceChildren(...children) { this.children = children; }
  querySelector() { return this.caption; }
  addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
  emit(name, event = {}) { for (const fn of this.listeners[name] || []) fn({target: this, preventDefault(){}, ...event}); }
  click() { if (!this.disabled) this.emit('click'); }
  focus() { this.document.activeElement = this; }
  select() {}
  closest() { return this; }
  showModal() { this.open = true; }
  close() { this.open = false; this.emit('close'); }
}
function boot({backing = {}, failStorage = false} = {}) {
  const nodes = {};
  const ids = [...fs.readFileSync(__dirname + '/index.html', 'utf8').matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  for (const id of ids) nodes[id] = new FakeElement(id);
  const patterns = [1,2,3,4].map(step => { const e = new FakeElement(); e.dataset.step = String(step); e.caption = new FakeElement(); return e; });
  const document = {getElementById: id => nodes[id], createElement: () => new FakeElement(),
    querySelectorAll: () => patterns, addEventListener(){}, activeElement: null};
  Object.values(nodes).forEach(e => e.document = document);
  nodes['row-input'].value = '1';
  const window = {MalhaCore: C, addEventListener(){}, localStorage: {
    getItem: key => { if (failStorage) throw Error('blocked'); return backing[key] || null; },
    setItem: (key, value) => { if (failStorage) throw Error('blocked'); backing[key] = value; }
  }};
  const context = {window, document, console, Date, setTimeout: () => 1, clearTimeout(){}};
  vm.runInNewContext(fs.readFileSync(__dirname + '/app.js', 'utf8'), context);
  return {nodes, backing, patterns, row: () => Number(nodes['row-number'].textContent), click: id => nodes[id].click(), submit: () => nodes['dialog-form'].emit('submit')};
}
test('Interface: avanço, toque duplo, recarga e desfazer persistido', () => {
  const app = boot();
  assert.equal(app.row(), 1);
  app.click('advance-button'); assert.equal(app.row(), 2);
  app.click('advance-button'); assert.equal(app.row(), 2);
  const reload = boot({backing: app.backing});
  assert.equal(reload.row(), 2);
  reload.click('undo-button'); assert.equal(reload.row(), 1);
  assert.equal(boot({backing: reload.backing}).row(), 1);
});
test('Interface: salto válido, erro no campo e cancelamento sem alteração', () => {
  const app = boot();
  app.click('jump-button');
  assert.equal(app.nodes['progress-dialog'].open, true);
  app.nodes['row-input'].value = '49'; app.submit();
  assert.equal(app.nodes['row-error'].hidden, false); assert.equal(app.row(), 1);
  app.nodes['row-input'].value = '7'; app.submit();
  assert.equal(app.row(), 7); assert.equal(app.nodes['progress-dialog'].open, false);
  assert.equal(app.patterns[2].attrs['aria-current'], 'step');
  app.click('restart-button'); app.click('dialog-cancel'); assert.equal(app.row(), 7);
});
test('Interface: concluir, reiniciar e desfazer restauram os estados', () => {
  const app = boot();
  app.click('finish-button'); assert.equal(app.row(), 1);
  app.submit(); assert.equal(app.nodes['row-total'].textContent, 'concluídas');
  assert.equal(app.nodes['finish-button'].hidden, true);
  app.click('advance-button'); app.submit(); assert.equal(app.row(), 1);
  app.click('undo-button'); assert.equal(app.nodes['row-total'].textContent, 'concluídas');
  app.click('undo-button'); assert.equal(app.row(), 1);
});
test('Interface: armazenamento bloqueado comunica a falha e permite sessão', () => {
  const app = boot({failStorage: true});
  assert.equal(app.nodes['storage-warning'].hidden, false);
  app.click('advance-button'); assert.equal(app.row(), 2);
  assert.match(app.nodes.feedback.textContent, /não ficou guardada/);
});
test('Interface: dados inválidos são sinalizados e salto recupera a posição', () => {
  const app = boot({backing: {'malha.cachecol-miguel.v1': 'corrupt'}});
  assert.equal(app.nodes['storage-warning'].hidden, false);
  app.click('jump-button'); app.nodes['row-input'].value = '20'; app.submit();
  assert.equal(app.row(), 20); assert.equal(app.nodes['storage-warning'].hidden, true);
});
console.log('\n' + checks + ' verificações passaram. Nenhum navegador foi operado.');
