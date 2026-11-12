"use strict";

const routes = [
  { id:"24", origin:"Ribeira", destination:"Hospital", bus:"142", delay:8, passengers:42, stops:["Ribeira", "Alfândega", "Praça Nova", "Jardim do Norte", "Hospital"] },
  { id:"12", origin:"Estação", destination:"Universidade", bus:"108", delay:0, passengers:27, stops:["Estação", "Avenida Central", "Biblioteca", "Polo Norte", "Universidade"] },
  { id:"31", origin:"Mercado", destination:"Parque", bus:"167", delay:4, passengers:18, stops:["Mercado", "Largo da Fonte", "Museu", "Jardim Sul", "Parque"] },
  { id:"07", origin:"Circular", destination:"Centro", bus:"115", delay:0, passengers:33, stops:["Centro", "Câmara", "Correios", "Teatro", "Centro"] }
];
const spareBuses = ["R01", "R02"];
const state = { filter:"all", selected:"24", assignments:{}, history:[] };
const list = document.getElementById("fleet-list");
const detail = document.getElementById("route-detail");
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
const selectedRoute = () => routes.find(route => route.id === state.selected);
const ownerOf = spare => Object.keys(state.assignments).find(id => state.assignments[id] === spare);
const announce = message => { document.getElementById("announcement").textContent = message; };

function routeName(route) {
  return route.id === "07" ? "Circular Centro" : `${route.origin} → ${route.destination}`;
}

function renderList() {
  const visible = routes.filter(route => state.filter !== "delayed" || route.delay > 0);
  list.innerHTML = visible.map(route => `
    <li><button class="vehicle-row" type="button" data-route="${route.id}" aria-pressed="${state.selected === route.id}" aria-label="Linha ${route.id}, ${routeName(route)}, autocarro ${route.bus}, ${route.passengers} passageiros, ${route.delay ? `${route.delay} minutos de atraso` : "a horas"}${state.assignments[route.id] ? `, reserva ${state.assignments[route.id]} atribuída` : ""}">
      <span class="vehicle-main"><span class="route-badge">${route.id}</span><span><span class="route-origin">${route.id === "07" ? "Circular" : `${route.origin} →`}</span><span class="vehicle-destination">${route.destination}</span><span class="vehicle-id">Autocarro ${route.bus}</span></span></span>
      <span class="passenger-count" aria-hidden="true">${route.passengers}</span>
      <span class="vehicle-state">${route.delay ? `<span class="delay-label">+${route.delay} min</span>` : `<span class="ontime-label">${icon("check")}A horas</span>`}${state.assignments[route.id] ? `<span class="assigned-tiny">+ ${state.assignments[route.id]}</span>` : (route.delay ? `<span class="delay-sub">de atraso</span>` : "")}</span>
    </button></li>`).join("");
  document.getElementById("available-count").textContent = String(spareBuses.length - Object.keys(state.assignments).length);
}

function diagram(route) {
  const points = [[65,166],[214,166],[398,81],[548,81],[700,81]];
  const stops = points.map(([x,y], index) => `<g><circle cx="${x}" cy="${y}" r="7" class="stop-dot"/><text x="${x}" y="${index > 1 ? y-24 : y+34}" text-anchor="middle" class="stop-name">${route.stops[index]}</text></g>`).join("");
  const summary = `Esquema fictício da linha ${route.id}, sem correspondência geográfica. Paragens, por ordem: ${route.stops.join(", ")}. Autocarro ${route.bus} entre ${route.stops[1]} e ${route.stops[2]}. ${route.delay ? `${route.delay} minutos de atraso.` : "A horas."}`;
  const mobileStops = route.stops.map((stop,i) => `<g><circle cx="29" cy="${33+i*62}" r="7" class="stop-dot"/><text x="55" y="${38+i*62}" class="stop-name">${stop}</text></g>`).join("");
  return `<div class="schematic"><div class="schematic-heading"><h3>Percurso esquemático</h3><span>Sem escala geográfica</span></div>
    <svg class="route-svg schematic-desktop" viewBox="0 0 768 230" role="img" aria-labelledby="diagram-title-desktop diagram-desc-desktop"><title id="diagram-title-desktop">Percurso da linha ${route.id}</title><desc id="diagram-desc-desktop">${summary}</desc>
      <path d="M65 166H214C253 166 278 143 302 124L326 104C351 84 370 81 398 81H700" class="route-track-halo"/>
      <path d="M65 166H214C253 166 278 143 302 124L326 104C351 84 370 81 398 81H700" class="route-track"/>
      ${stops}
      <g transform="translate(294 130)"><circle r="23" fill="#fff"/><rect x="-17" y="-17" width="34" height="34" rx="6" class="vehicle-marker"/><svg x="-11" y="-12" width="22" height="23" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-bus"/></svg></g>
      <g transform="translate(320 129)"><rect width="54" height="29" rx="4" class="vehicle-marker"/><text x="27" y="20" class="vehicle-tag-text" text-anchor="middle">${route.bus}</text></g>
    </svg>
    <svg class="route-svg schematic-mobile" viewBox="0 0 304 315" role="img" aria-labelledby="diagram-title-mobile diagram-desc-mobile"><title id="diagram-title-mobile">Percurso da linha ${route.id}</title><desc id="diagram-desc-mobile">${summary}</desc><path d="M29 33V281" class="route-track-halo"/><path d="M29 33V281" class="route-track"/>${mobileStops}<g transform="translate(29 126)"><rect x="-16" y="-15" width="32" height="30" rx="6" class="vehicle-marker"/><svg x="-10" y="-11" width="20" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-bus"/></svg><rect x="25" y="-13" width="52" height="26" rx="4" class="vehicle-marker"/><text x="51" y="5" class="vehicle-tag-text" text-anchor="middle">${route.bus}</text></g></svg>
    <p class="diagram-footer">Entre ${route.stops[1]} e ${route.stops[2]} · posição fictícia</p></div>`;
}

function renderReserve(route) {
  const assigned = state.assignments[route.id];
  const available = spareBuses.filter(spare => !ownerOf(spare));
  let body;
  if (assigned) {
    body = `<div class="assignment-result">${icon("check")}<div><h4>Reserva ${assigned} atribuída à linha ${route.id}</h4><p>${assigned} reforça o autocarro ${route.bus}. O atraso observado de ${route.delay} min mantém-se. Nenhuma ordem foi enviada.</p><button type="button" class="undo-button" id="undo-assignment">${icon("undo")}Desfazer atribuição</button></div></div>`;
  } else if (!route.delay) {
    body = `<div class="normal-state">${icon("check")}<div><strong>Serviço dentro do horário</strong><p>Neste exercício, só os veículos com atraso podem receber uma reserva. Selecione a linha 24 ou 31.</p></div></div>`;
  } else {
    body = `<form id="reserve-form"><p class="reserve-copy">Reserva adicional para esta linha. O autocarro ${route.bus} mantém o seu percurso.</p><div class="reserve-form-controls"><fieldset class="spare-options"><legend>Autocarro de reserva</legend>${spareBuses.map(spare => `<label class="spare-option"><input type="radio" name="spare" value="${spare}" ${ownerOf(spare) ? "disabled" : ""} ${spare === available[0] ? "checked" : ""} required><strong>${spare}</strong><small>${ownerOf(spare) ? `Na linha ${ownerOf(spare)}` : "Disponível"}</small></label>`).join("")}</fieldset><button class="primary-button" type="submit" id="assign-button" ${available.length ? "" : "disabled"}>Simular atribuição ${icon("arrow")}</button></div>${available.length ? "" : `<p class="no-spares">Sem reservas livres. Desfaça uma atribuição para libertar um autocarro.</p>`}<p class="simulation-footnote">Atribuição reversível. Recarregar a página reinicia a simulação.</p></form>`;
  }
  return `<section class="reserve-panel" aria-labelledby="reserve-title"><div class="reserve-heading"><h3 id="reserve-title">Reforço de serviço</h3></div>${body}</section>`;
}

function renderDetail() {
  const route = selectedRoute();
  detail.innerHTML = `<button type="button" class="return-to-fleet" id="return-to-fleet">${icon("arrow")}Voltar aos veículos</button><div class="route-header"><div class="selected-route-badge" aria-label="Linha ${route.id}">${route.id}</div><div class="route-title-block"><h2>${route.id === "07" ? "Circular Centro" : `${route.origin} <span aria-label="para">→</span> ${route.destination}`}</h2><p class="route-description">${icon("bus")}Autocarro ${route.bus}${state.assignments[route.id] ? `<span aria-hidden="true">·</span>Reforço ${state.assignments[route.id]} simulado` : ""}</p></div><div class="route-state"><strong class="${route.delay ? "delay" : "ontime"}">${route.delay ? `+${route.delay} min de atraso` : "A horas"}</strong><span>${route.passengers} passageiros</span></div></div>
    ${diagram(route)}${renderReserve(route)}`;
}

function renderHistory() {
  document.getElementById("activity-list").innerHTML = state.history.length ? state.history.slice(-3).reverse().map((event,i) => `<li><span class="activity-marker" aria-hidden="true"></span><div><span class="activity-time">AÇÃO ${String(state.history.length-i).padStart(2,"0")} / SIMULAÇÃO</span><p>${event}</p></div></li>`).join("") : `<li><span class="activity-marker" aria-hidden="true"></span><div><span class="activity-time">INÍCIO DO EXERCÍCIO</span><p>Cenário carregado. Nenhuma reserva atribuída.</p></div></li>`;
}

list.addEventListener("click", event => {
  const button = event.target.closest("[data-route]");
  if (!button) return;
  state.selected = button.dataset.route;
  renderList();
  renderDetail();
  list.querySelector(`[data-route="${state.selected}"]`).focus({preventScroll:true});
  announce(`Linha ${state.selected} selecionada. ${routeName(selectedRoute())}. Detalhes do percurso atualizados.`);
  if (window.matchMedia("(max-width: 1100px)").matches) {
    document.getElementById("return-to-fleet").focus({preventScroll:true});
    detail.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"start"});
  }
});

document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  state.filter = button.dataset.filter;
  if (state.filter === "delayed" && !selectedRoute().delay) state.selected = "24";
  document.querySelectorAll("[data-filter]").forEach(filter => filter.setAttribute("aria-pressed", String(filter === button)));
  renderList();
  renderDetail();
  announce(state.filter === "delayed" ? "2 veículos com atraso: linhas 24 e 31." : "4 veículos apresentados.");
}));

detail.addEventListener("submit", event => {
  if (event.target.id !== "reserve-form") return;
  event.preventDefault();
  const form = event.target;
  const spare = new FormData(form).get("spare");
  const route = selectedRoute();
  if (!spareBuses.includes(spare) || ownerOf(spare) || !route.delay || state.assignments[route.id]) return;
  state.assignments[route.id] = spare;
  state.history.push(`${spare} atribuída à linha ${route.id}, em reforço do autocarro ${route.bus}.`);
  renderList();
  renderDetail();
  renderHistory();
  document.getElementById("undo-assignment").focus({preventScroll:true});
  announce(`Simulação concluída: reserva ${spare} atribuída à linha ${route.id}. O atraso observado mantém-se. Pode desfazer a atribuição.`);
});

detail.addEventListener("click", event => {
  if (event.target.closest("#return-to-fleet")) {
    list.querySelector(`[data-route="${state.selected}"]`).focus({preventScroll:true});
    document.getElementById("fleet").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"start"});
    return;
  }
  if (!event.target.closest("#undo-assignment")) return;
  const route = selectedRoute();
  const spare = state.assignments[route.id];
  if (!spare) return;
  delete state.assignments[route.id];
  state.history.push(`Atribuição à linha ${route.id} desfeita. ${spare} está novamente disponível.`);
  renderList();
  renderDetail();
  renderHistory();
  document.getElementById("assign-button").focus({preventScroll:true});
  announce(`Atribuição desfeita. ${spare} está novamente disponível.`);
});

renderList();
renderDetail();
