(function () {
  'use strict';
  const P = window.PalavraPractice;
  const activity = document.getElementById('activity');
  let session = P.createSession();
  const icon = (kind) => kind === 'correct' ? '<span aria-hidden="true">✓</span>' : '<span aria-hidden="true">↻</span>';
  const plural = (count, singular, many) => count === 1 ? singular : many;
  function statusMarkup() {
    const reviewing = session.phase === 'review';
    const active = ['practice', 'review'].includes(session.phase);
    const queue = reviewing ? session.reviewItems : session.questions;
    const records = reviewing ? session.reviewAttempts : session.attempts;
    const title = active ? `${reviewing ? 'Revisão' : 'Pergunta'} <strong>${session.cursor + 1} de ${queue.length}</strong>` : 'Sessão concluída';
    return `<div class="session-status"><div class="status-copy"><span>${title}</span><span class="status-note">${reviewing ? `Resultado inicial: ${P.score(session)}/6` : active ? 'Uma expressão de cada vez' : '6 expressões de viagem'}</span></div><ol class="progress-track" aria-label="${reviewing ? 'Progresso da revisão' : 'Progresso da sessão'}">${queue.map((item, i) => {
      const record = records[item.id];
      const state = record ? record.correct ? 'correct' : 'missed' : i === session.cursor && active ? 'current' : 'waiting';
      const label = record ? record.correct ? 'resposta certa' : 'resposta errada' : i === session.cursor && active ? 'atual' : 'por responder';
      return `<li class="step ${state}" ${state === 'current' ? 'aria-current="step"' : ''}><span class="sr-only">${i + 1}: ${label}</span><span aria-hidden="true">${record ? record.correct ? '✓' : '↻' : i + 1}</span></li>`;
    }).join('')}</ol></div>`;
  }
  function renderQuestion(moveFocus = false) {
    const item = P.current(session);
    const reviewing = session.phase === 'review';
    activity.innerHTML = `${statusMarkup()}<section class="practice-board" aria-label="${reviewing ? 'Rever uma expressão' : 'Traduzir uma expressão'}">
      <div class="phrase-panel">
        <div class="phrase-label"><span class="language-code" lang="fr">FR</span><span>Leia em francês</span></div>
        <p class="phrase" id="source-phrase" lang="fr">${item.phrase}</p>
        <p class="phrase-context">${item.context}</p>
      </div>
      <div class="answer-panel">
        <h1 id="question-title" tabindex="-1" aria-describedby="source-phrase">Qual é a tradução?</h1>
        <p class="question-subtitle">Escolha a expressão em português.</p>
        <form id="answer-form">
          <fieldset id="choices" aria-labelledby="question-title" aria-describedby="source-phrase">
            <legend class="sr-only">Tradução de ${item.phrase}</legend>
            ${item.choices.map((choice, i) => `<label class="choice" for="answer-${i}"><input type="radio" name="answer" id="answer-${i}" value="${choice}"><span class="choice-text">${choice}</span><span class="choice-state" aria-hidden="true"></span></label>`).join('')}
          </fieldset>
          <div id="response" class="response-space" aria-live="polite" aria-atomic="true"><p id="answer-hint" class="answer-hint">${reviewing ? 'Esta revisão não altera a pontuação inicial.' : 'Só a primeira resposta conta para a pontuação.'}</p></div>
          <button id="main-action" class="button primary" type="submit" disabled>Verificar resposta <span aria-hidden="true">→</span></button>
        </form>
      </div>
    </section>`;
    document.getElementById('answer-form').addEventListener('change', event => {
      if (!P.choose(session, event.target.value)) return;
      document.querySelectorAll('.choice').forEach(label => label.classList.toggle('selected', label.querySelector('input').checked));
      document.getElementById('main-action').disabled = false;
    });
    document.getElementById('answer-form').addEventListener('submit', event => {
      event.preventDefault();
      if (session.checked) {
        P.advance(session);
        render(true);
      } else if (P.check(session)) showFeedback();
    });
    if (moveFocus) document.getElementById('question-title').focus();
  }
  function showFeedback() {
    const item = P.current(session);
    const correct = session.selected === item.answer;
    const reviewing = session.phase === 'review';
    document.querySelectorAll('.choice').forEach(label => {
      const input = label.querySelector('input');
      input.disabled = true;
      label.classList.remove('selected');
      if (input.value === item.answer) {
        label.classList.add('is-correct');
        label.querySelector('.choice-state').textContent = '✓ Correta';
      } else if (input.checked) {
        label.classList.add('is-wrong');
        label.querySelector('.choice-state').textContent = '× Escolheu';
      }
    });
    const title = correct ? 'Resposta certa.' : 'Resposta incorreta.';
    const context = correct ? (reviewing ? 'A pontuação inicial mantém-se.' : 'Conta como certa à primeira tentativa.') : (reviewing ? 'A pontuação inicial mantém-se.' : 'A primeira resposta fica registada para a revisão.');
    const response = document.getElementById('response');
    response.innerHTML = `<div class="feedback ${correct ? 'success' : 'correction'}" id="feedback" tabindex="-1"><p class="feedback-title">${icon(correct ? 'correct' : 'missed')} ${title}</p><p><span lang="fr">${item.phrase}</span> significa <strong>«${item.answer}»</strong>.</p><p class="feedback-detail">${context}</p></div>`;
    const button = document.getElementById('main-action');
    button.innerHTML = `${session.cursor === P.queue(session).length - 1 ? reviewing ? 'Concluir revisão' : 'Ver resultado' : 'Continuar'} <span aria-hidden="true">→</span>`;
    document.querySelector('.session-status').outerHTML = statusMarkup();
    document.getElementById('feedback').focus();
  }
  function renderResults(moveFocus = false) {
    const score = P.score(session);
    const missed = P.missed(session);
    const afterReview = session.phase === 'review-results';
    const reviewCorrect = Object.values(session.reviewAttempts).filter(attempt => attempt.correct).length;
    const title = afterReview ? 'Revisão concluída.' : missed.length ? 'Prática concluída.' : 'Tudo certo à primeira.';
    const subtitle = afterReview ? `${reviewCorrect} de ${missed.length} ${plural(missed.length, 'resposta certa', 'respostas certas')} nesta revisão. O resultado inicial mantém-se.` : missed.length ? `${missed.length} ${plural(missed.length, 'expressão para rever', 'expressões para rever')}. Pode voltar a praticá-las sem alterar a pontuação inicial.` : 'Acertou nas seis expressões. Não há respostas erradas para rever.';
    const rows = missed.length ? missed : session.questions;
    activity.innerHTML = `${statusMarkup()}<section class="results-board">
      <div class="score-panel"><p class="score-label">${afterReview ? 'Resultado inicial' : 'O seu resultado'}</p><p class="score-number" aria-hidden="true"><strong>${score}</strong><span>de 6</span></p><p class="score-caption" id="score-summary"><span class="sr-only">${score} de 6 </span>${plural(score, 'certa', 'certas')} à primeira<br>tentativa</p><div class="score-note">${afterReview ? 'A revisão é prática extra. As suas primeiras respostas continuam guardadas.' : 'Cada expressão contou uma vez, na primeira resposta verificada.'}</div></div>
      <div class="summary-panel"><h1 id="results-title" tabindex="-1" aria-describedby="score-summary">${title}</h1><p class="results-description">${subtitle}</p>
        <h2>${missed.length ? 'As expressões para rever' : 'As seis expressões'}</h2>
        <ul class="review-list">${rows.map(item => `<li><div class="translation-pair"><span lang="fr">${item.phrase}</span><span class="translation-arrow" aria-hidden="true">→</span><strong>${item.answer}</strong></div>${missed.length ? `<p>Primeira resposta: <span>${session.attempts[item.id].selected}</span></p>` : ''}</li>`).join('')}</ul>
        <div class="result-actions">${missed.length ? `<button class="button primary" id="start-review">${afterReview ? 'Rever novamente' : `Rever ${missed.length} ${plural(missed.length, 'expressão', 'expressões')}`} <span aria-hidden="true">↻</span></button>` : ''}<button class="button ${missed.length ? 'secondary' : 'primary'}" id="new-session">Começar nova sessão <span aria-hidden="true">→</span></button></div>
        <p class="restart-note">A nova sessão começa do zero e baralha as seis expressões.</p>
      </div></section>`;
    const reviewButton = document.getElementById('start-review');
    if (reviewButton) reviewButton.addEventListener('click', () => { P.startReview(session); render(true); });
    document.getElementById('new-session').addEventListener('click', () => { session = P.createSession(true); render(true); });
    if (moveFocus) document.getElementById('results-title').focus();
  }
  function render(moveFocus = false) {
    if (['practice', 'review'].includes(session.phase)) renderQuestion(moveFocus);
    else renderResults(moveFocus);
  }
  render();
})();
