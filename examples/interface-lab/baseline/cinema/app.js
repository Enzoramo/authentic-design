(() => {
  'use strict';
  const { films, days, price } = window.CINEMA_DATA;
  const filmList = document.getElementById('film-list');
  const filmDialog = document.getElementById('film-dialog');
  const bookingDialog = document.getElementById('booking-dialog');
  const bookingContent = document.getElementById('booking-content');
  let currentDay = 'thu';
  let currentBooking = null;
  let dialogTrigger = null;
  const reservations = new Map();
  const occupiedSeats = ['A1', 'A2', 'B4', 'C3', 'D5', 'D6'];
  const sessionKey = (day, film, time) => `${day}-${film}-${time}`;
  const availableSessions = (day, film) => days[day].sessions.filter(session => session.film === film);

  function renderProgramme() {
    const day = days[currentDay];
    document.getElementById('selected-day-label').textContent = day.label;
    document.querySelectorAll('.day-button').forEach(button => {
      const active = button.dataset.day === currentDay;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const filmIds = [...new Set(day.sessions.map(session => session.film))];
    filmList.innerHTML = filmIds.map(id => {
      const film = films[id];
      return `<article class="film-row" aria-labelledby="title-${id}">
        <img class="film-poster" src="${film.poster}" alt="" width="180" height="240">
        <div class="film-copy"><p class="film-category"><span>${film.number}</span> ${film.genre}</p>
          <h3 id="title-${id}">${film.title}</h3>
          <p class="film-meta">${film.duration} min${film.language ? ` <span aria-hidden="true">/</span> ${film.language}` : ''}</p>
          <button class="text-button film-info" type="button" data-film="${id}" aria-label="Ficha do filme ${film.title}">Ficha do filme <span aria-hidden="true">↗</span></button>
        </div>
        <div class="film-sessions"><p class="sessions-label">SESSÕES</p><div class="session-buttons">${availableSessions(currentDay, id).map(session => `<button class="session-button${session.soldOut ? ' sold-out' : ''}" type="button" data-film="${id}" data-time="${session.time}" ${session.soldOut ? 'disabled' : ''} aria-label="${film.title}, ${day.label}, ${session.time}${session.soldOut ? ', esgotado' : ', escolher lugar'}"><span>${session.time}</span>${session.soldOut ? '<small>Esgotado</small>' : '<span class="session-arrow" aria-hidden="true">↗</span>'}</button>`).join('')}</div><p class="session-hint">${availableSessions(currentDay, id).every(session => session.soldOut) ? 'Escolha outro dia para este filme.' : 'Escolha um horário para reservar.'}</p></div>
      </article>`;
    }).join('');
    document.getElementById('programme-status').textContent = `${day.label}: ${filmIds.length} filmes, ${day.sessions.length} sessões.`;
  }

  function openDialog(dialog, trigger) {
    dialogTrigger = trigger;
    document.body.classList.add('dialog-open');
    dialog.showModal();
  }

  function openFilm(id, trigger) {
    const film = films[id];
    document.getElementById('film-dialog-content').innerHTML = `<img class="detail-poster" src="${film.poster}" alt="Cartaz tipográfico de ${film.title}" width="180" height="240"><div class="film-detail-copy"><p class="eyebrow">FICHA DO FILME / ${film.number}</p><h2 id="film-dialog-title">${film.title}</h2><dl class="film-facts"><div><dt>Género</dt><dd>${film.genre}</dd></div><div><dt>Duração</dt><dd>${film.duration} minutos</dd></div>${film.language ? `<div><dt>Idioma</dt><dd>${film.language}</dd></div>` : ''}</dl><p class="detail-note">Filme fictício da programação de demonstração. Cartaz gráfico original; não é uma imagem do filme.</p><button type="button" class="primary-button" data-close="film-dialog">Voltar à programação <span aria-hidden="true">↗</span></button></div>`;
    openDialog(filmDialog, trigger);
  }

  function openBooking(film, time, trigger) {
    const session = days[currentDay].sessions.find(item => item.film === film && item.time === time);
    if (!session || session.soldOut) return;
    currentBooking = { film, time, day: currentDay, seat: null };
    const selectedFilm = films[film];
    const key = sessionKey(currentDay, film, time);
    const taken = new Set([...occupiedSeats, ...(reservations.get(key) || [])]);
    bookingContent.innerHTML = `<div class="booking-heading"><p class="eyebrow">RESERVA DE DEMONSTRAÇÃO</p><h2 id="booking-title">O seu lugar na sala.</h2><p class="booking-film">${selectedFilm.title}</p><p class="booking-session">${days[currentDay].label} <span aria-hidden="true">·</span> ${time}</p></div>
      <div class="booking-layout"><section class="room" aria-labelledby="seat-heading"><h3 id="seat-heading" class="sr-only">Escolha um lugar disponível</h3><div class="screen" aria-hidden="true"><span>ECRÃ</span></div><div class="seat-map" role="group" aria-label="Sala com quatro filas e seis lugares por fila">${['A', 'B', 'C', 'D'].map(row => `<div class="seat-row"><span class="row-label" aria-hidden="true">${row}</span>${[1, 2, 3, 4, 5, 6].map(column => { const seat = `${row}${column}`; return `<button type="button" class="seat${taken.has(seat) ? ' occupied' : ''}" data-seat="${seat}" aria-label="Fila ${row}, lugar ${column}, ${taken.has(seat) ? 'ocupado' : 'disponível'}" aria-pressed="false" ${taken.has(seat) ? 'disabled' : ''}>${taken.has(seat) ? '<span aria-hidden="true">×</span>' : column}</button>`; }).join('')}</div>`).join('')}</div><div class="seat-legend"><span><i></i>Disponível</span><span><i class="selected"></i>Escolhido</span><span><i class="occupied">×</i>Ocupado</span></div><p class="room-instruction">Selecione um lugar. Pode mudar antes de confirmar.</p></section>
      <section class="booking-review" aria-labelledby="review-heading"><h3 id="review-heading">A sua sessão</h3><dl><div><dt>Filme</dt><dd>${selectedFilm.title}</dd></div><div><dt>Data e hora</dt><dd>${days[currentDay].short} · ${time}</dd></div><div><dt>Lugar</dt><dd id="selected-seat" aria-live="polite">Por escolher</dd></div></dl><div class="booking-total"><span>1 entrada</span><strong>${price} €</strong></div><button type="button" id="confirm-booking" class="primary-button" disabled>Simular reserva <span aria-hidden="true">↗</span></button><p class="booking-disclaimer">Sem pagamento. Sem bilhete real.</p></section></div>`;
    openDialog(bookingDialog, trigger);
  }

  function chooseSeat(button) {
    if (!currentBooking || button.disabled) return;
    currentBooking.seat = button.dataset.seat;
    bookingContent.querySelectorAll('.seat').forEach(seat => {
      const isSelected = seat === button;
      seat.classList.toggle('selected', isSelected);
      seat.setAttribute('aria-pressed', String(isSelected));
      if (!seat.disabled) seat.setAttribute('aria-label', `Fila ${seat.dataset.seat[0]}, lugar ${seat.dataset.seat[1]}, ${isSelected ? 'escolhido' : 'disponível'}`);
    });
    document.getElementById('selected-seat').textContent = `Fila ${currentBooking.seat[0]} · Lugar ${currentBooking.seat[1]}`;
    document.getElementById('confirm-booking').disabled = false;
  }

  function confirmBooking() {
    if (!currentBooking?.seat) return;
    const { day, film, time, seat } = currentBooking;
    const key = sessionKey(day, film, time);
    const taken = reservations.get(key) || [];
    taken.push(seat);
    reservations.set(key, taken);
    bookingContent.innerHTML = `<div class="confirmation"><div class="confirmation-icon" aria-hidden="true">✓</div><p class="eyebrow">EXPERIÊNCIA CONCLUÍDA</p><h2 id="booking-title" tabindex="-1">Reserva simulada.</h2><p class="confirmation-copy">O seu lugar está escolhido — nesta demonstração.</p><div class="demo-ticket"><div class="ticket-top"><span>MARGEM / DEMO</span><span>1 ENTRADA</span></div><h3>${films[film].title}</h3><p>${days[day].label} · ${time}</p><div class="ticket-bottom"><span>FILA <strong>${seat[0]}</strong></span><span>LUGAR <strong>${seat[1]}</strong></span><span>VALOR ILUSTRATIVO <strong>${price} €</strong></span></div></div><p class="confirmation-disclaimer">Não foi feita uma reserva real, cobrado qualquer valor ou emitido um bilhete.</p><button class="primary-button" type="button" data-close="booking-dialog">Voltar à programação <span aria-hidden="true">↗</span></button></div>`;
    document.getElementById('booking-title').focus();
  }

  document.querySelectorAll('.day-button').forEach(button => button.addEventListener('click', () => {
    currentDay = button.dataset.day;
    renderProgramme();
  }));
  filmList.addEventListener('click', event => {
    const info = event.target.closest('.film-info');
    const session = event.target.closest('.session-button');
    if (info) openFilm(info.dataset.film, info);
    if (session && !session.disabled) openBooking(session.dataset.film, session.dataset.time, session);
  });
  bookingContent.addEventListener('click', event => {
    const seat = event.target.closest('.seat');
    if (seat) chooseSeat(seat);
    if (event.target.closest('#confirm-booking')) confirmBooking();
  });
  document.addEventListener('click', event => {
    const close = event.target.closest('[data-close]');
    if (close) document.getElementById(close.dataset.close).close();
  });
  [filmDialog, bookingDialog].forEach(dialog => {
    dialog.addEventListener('click', event => {
      const rectangle = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rectangle.left || event.clientX > rectangle.right || event.clientY < rectangle.top || event.clientY > rectangle.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      currentBooking = null;
      if (dialogTrigger?.isConnected) dialogTrigger.focus();
    });
  });
  renderProgramme();
})();
