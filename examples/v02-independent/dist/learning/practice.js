/* Local session model. First attempts are written only by the practice phase. */
(function (root) {
  'use strict';
  const items = [
    { id: 'bonjour', phrase: 'Bonjour', answer: 'Olá', choices: ['Obrigado', 'Olá', 'Adeus'], context: 'Cumprimentar' },
    { id: 'merci', phrase: 'Merci', answer: 'Obrigado', choices: ['Obrigado', 'Desculpe', 'Bom dia'], context: 'Agradecer' },
    { id: 'gare', phrase: 'La gare', answer: 'A estação', choices: ['O hotel', 'A rua', 'A estação'], context: 'Na estação' },
    { id: 'billet', phrase: 'Un billet', answer: 'Um bilhete', choices: ['Uma mala', 'Um bilhete', 'Um mapa'], context: 'Na estação' },
    { id: 'gauche', phrase: 'À gauche', answer: 'À esquerda', choices: ['À esquerda', 'Em frente', 'À direita'], context: 'Pedir direções' },
    { id: 'droite', phrase: 'À droite', answer: 'À direita', choices: ['Atrás', 'À esquerda', 'À direita'], context: 'Pedir direções' }
  ];
  function shuffled(values, random) {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function createSession(shuffle = false, random = Math.random) {
    const questions = items.map(item => ({ ...item, choices: shuffle ? shuffled(item.choices, random) : [...item.choices] }));
    return { phase: 'practice', questions: shuffle ? shuffled(questions, random) : questions, cursor: 0, selected: null, checked: false, attempts: {}, reviewItems: [], reviewAttempts: {} };
  }
  function queue(session) { return session.phase === 'review' ? session.reviewItems : session.questions; }
  function current(session) { return queue(session)[session.cursor]; }
  function choose(session, value) {
    if (!['practice', 'review'].includes(session.phase) || session.checked || !current(session).choices.includes(value)) return false;
    session.selected = value;
    return true;
  }
  function check(session) {
    if (!['practice', 'review'].includes(session.phase) || session.checked || session.selected === null) return false;
    const item = current(session);
    const attempt = { selected: session.selected, correct: session.selected === item.answer };
    if (session.phase === 'practice') {
      if (Object.hasOwn(session.attempts, item.id)) return false;
      session.attempts[item.id] = attempt;
    } else session.reviewAttempts[item.id] = attempt;
    session.checked = true;
    return true;
  }
  function advance(session) {
    if (!['practice', 'review'].includes(session.phase) || !session.checked) return false;
    if (session.cursor === queue(session).length - 1) session.phase = session.phase === 'review' ? 'review-results' : 'results';
    else session.cursor++;
    session.selected = null;
    session.checked = false;
    return true;
  }
  function score(session) { return Object.values(session.attempts).filter(attempt => attempt.correct).length; }
  function missed(session) { return session.questions.filter(item => session.attempts[item.id] && !session.attempts[item.id].correct); }
  function startReview(session) {
    if (!['results', 'review-results'].includes(session.phase) || !missed(session).length) return false;
    session.reviewItems = missed(session);
    session.reviewAttempts = {};
    session.cursor = 0;
    session.selected = null;
    session.checked = false;
    session.phase = 'review';
    return true;
  }
  const api = { items, createSession, queue, current, choose, check, advance, score, missed, startReview };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PalavraPractice = api;
})(typeof window !== 'undefined' ? window : globalThis);
