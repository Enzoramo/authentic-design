'use strict';
const assert = require('node:assert/strict');
const P = require('./practice.js');
let checks = 0;
function test(name, fn) { fn(); checks++; console.log(`PASS ${name}`); }
function complete(s, answerFor) {
  while (['practice', 'review'].includes(s.phase)) {
    const item = P.current(s);
    assert.equal(P.choose(s, answerFor(item, s.cursor)), true);
    assert.equal(P.check(s), true);
    assert.equal(P.advance(s), true);
  }
}
const expected = {
  bonjour: ['Bonjour', 'Olá', ['Olá', 'Obrigado', 'Adeus']],
  merci: ['Merci', 'Obrigado', ['Obrigado', 'Desculpe', 'Bom dia']],
  gare: ['La gare', 'A estação', ['A estação', 'O hotel', 'A rua']],
  billet: ['Un billet', 'Um bilhete', ['Um bilhete', 'Uma mala', 'Um mapa']],
  gauche: ['À gauche', 'À esquerda', ['À esquerda', 'À direita', 'Em frente']],
  droite: ['À droite', 'À direita', ['À direita', 'À esquerda', 'Atrás']]
};
test('All six supplied expressions, translations and distractors are exact', () => {
  assert.equal(P.items.length, 6);
  for (const item of P.items) {
    assert.equal(item.phrase, expected[item.id][0]);
    assert.equal(item.answer, expected[item.id][1]);
    assert.deepEqual([...item.choices].sort(), [...expected[item.id][2]].sort());
  }
});
test('Unselected, invalid and unchecked actions cannot advance or score', () => {
  const s = P.createSession();
  assert.equal(P.check(s), false);
  assert.equal(P.advance(s), false);
  assert.equal(P.choose(s, 'unknown'), false);
  assert.equal(P.startReview(s), false);
  assert.equal(s.cursor, 0);
  assert.equal(P.score(s), 0);
});
test('Selection can change before checking but a checked wrong answer stays recorded', () => {
  const s = P.createSession();
  const item = P.current(s);
  const wrong = item.choices.find(choice => choice !== item.answer);
  P.choose(s, item.answer);
  P.choose(s, wrong);
  P.check(s);
  assert.equal(P.choose(s, item.answer), false);
  assert.equal(P.check(s), false);
  assert.deepEqual(s.attempts[item.id], { selected: wrong, correct: false });
  assert.equal(P.score(s), 0);
});
test('Perfect session returns 6/6, no missed items and no review', () => {
  const s = P.createSession();
  complete(s, item => item.answer);
  assert.equal(s.phase, 'results');
  assert.equal(P.score(s), 6);
  assert.equal(Object.keys(s.attempts).length, 6);
  assert.deepEqual(P.missed(s), []);
  assert.equal(P.startReview(s), false);
  assert.equal(P.check(s), false);
  assert.equal(P.advance(s), false);
});
test('Zero correct preserves all six wrong choices and all six review items', () => {
  const s = P.createSession();
  complete(s, item => item.choices.find(choice => choice !== item.answer));
  assert.equal(P.score(s), 0);
  assert.equal(P.missed(s).length, 6);
  assert.equal(P.startReview(s), true);
  assert.equal(s.reviewItems.length, 6);
  complete(s, item => item.answer);
  assert.equal(s.phase, 'review-results');
  assert.equal(P.score(s), 0);
  assert.equal(Object.values(s.reviewAttempts).filter(x => x.correct).length, 6);
});
test('Mixed result stays 3/6 through two reviews and retains exact original choices', () => {
  const s = P.createSession();
  complete(s, (item, i) => i % 2 === 0 ? item.answer : item.choices.find(choice => choice !== item.answer));
  assert.equal(P.score(s), 3);
  const original = JSON.stringify(s.attempts);
  assert.deepEqual(P.missed(s).map(x => x.id), ['merci', 'billet', 'droite']);
  P.startReview(s);
  complete(s, item => item.choices.find(choice => choice !== item.answer));
  assert.equal(P.score(s), 3);
  P.startReview(s);
  complete(s, item => item.answer);
  assert.equal(P.score(s), 3);
  assert.equal(JSON.stringify(s.attempts), original);
});
test('New shuffled session resets all state and keeps exactly the original content', () => {
  const s = P.createSession(true, () => 0.3);
  assert.equal(s.phase, 'practice');
  assert.equal(s.cursor, 0);
  assert.equal(s.selected, null);
  assert.equal(s.checked, false);
  assert.deepEqual(s.attempts, {});
  assert.deepEqual(s.reviewAttempts, {});
  assert.equal(P.score(s), 0);
  assert.deepEqual(s.questions.map(x => x.id).sort(), P.items.map(x => x.id).sort());
  for (const item of s.questions) assert.deepEqual([...item.choices].sort(), [...expected[item.id][2]].sort());
});
console.log(`\n${checks} checks passed. These test the state model, not browser rendering or DOM interaction.`);
