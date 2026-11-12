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
      <span class="vehicle-main"><span class="route-badge">${route.id}</span><span><span class="route-origin">${route.id === "07" ? "Circular" : `${route.origin} →`}</span><span class="vehicle-destination">${route.destination}</span><span class="vehicle-id">AUTOCARRO ${route.bus}</span></span></span>
      <span class="passenger-count" aria-hidden="true">${route.passengers}</span>
      <span class="vehicle-state">${route.delay ? `<span class="delay-label">+${route.delay} min</span>` : `<span class="ontime-label">${icon("check")}A horas</span>`}${state.assignments[route.id] ? `<span class="assigned-tiny">+ ${state.assignments[route.id]}</span>` : `<span class="delay-sub">${route.delay ? "de atraso" : "no horário"}</span>`}</span>
    </button></li>`).join("");
  document.getElementById("available-count").textContent = String(spareBuses.length - Object.keys(state.assignments).length).padStart(2,"0");
}

function diagram(route) {
  const points = [[74,223],[223,223],[398,113],[548,113],[694,113]];
  const stopLabels = points.map(([x,y], index) => {
    const above = index > 1;
    return `<g><circle cx="${x}" cy="${y}" r="8" fill="#fff" stroke="#c84324" stroke-width="4"/><circle cx="${x}" cy="${y}" r="2.5" fill="#c84324"/><text x="${x}" y="${above ? y-48 : y+38}" text-anchor="middle" class="stop-number">0${index+1}</text><text x="${x}" y="${above ? y-30 : y+56}" text-anchor="middle" class="stop-name">${route.stops[index]}</text>${index === 0 || index === 4 ? `<text x="${x}" y="${above ? y-13 : y+73}" text-anchor="middle" class="stop-caption">${index === 0 ? "Origem" : "Destino"}</text>` : ""}</g>`;
  }).join("");
  const summary = `Esquema fictício da linha ${route.id}, sem correspondência geográfica. Paragens, por ordem: ${route.stops.join(", ")}. Autocarro ${route.bus} entre ${route.stops[1]} e ${route.stops[2]}. ${route.delay ? `${route.delay} minutos de atraso.` : "A horas."}`;
  const tag = `${route.bus} · ${route.delay ? `+${route.delay} min` : "a horas"}`;
  const mobileStops = route.stops.map((stop,i) => `<g><circle cx="33" cy="${40+i*66}" r="7" fill="#fff" stroke="#c84324" stroke-width="3.5"/><text x="58" y="${45+i*66}" class="stop-name">${stop}</text><text x="300" y="${44+i*66}" class="stop-number" text-anchor="end">0${i+1}</text></g>`).join("");
  return `<div class="schematic"><div class="schematic-heading"><h3>PERCURSO ESQUEMÁTICO</h3><span>5 paragens · sentido de ida</span></div>
    <svg class="route-svg schematic-desktop" viewBox="0 0 768 320" role="img" aria-labelledby="diagram-title-desktop diagram-desc-desktop"><title id="diagram-title-desktop">Percurso da linha ${route.id}</title><desc id="diagram-desc-desktop">${summary}</desc>
      <path d="M74 223H223C260 223 275 203 302 175L326 150C352 123 365 113 398 113H694" fill="none" stroke="#f8e6dc" stroke-width="22" stroke-linecap="round"/>
      <path d="M74 223H223C260 223 275 203 302 175L326 150C352 123 365 113 398 113H694" fill="none" stroke="#c84324" stroke-width="5" stroke-linecap="round"/>
      <path d="m484 107 6 6-6 6M151 217l6 6-6 6" fill="none" stroke="#c84324" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${stopLabels}
      <g transform="translate(294 179)"><circle r="24" fill="#fff"/><rect x="-18" y="-18" width="36" height="36" rx="7" fill="#17372f"/><svg x="-12" y="-13" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-bus"/></svg></g>
      <g transform="translate(323 178)"><rect width="124" height="32" rx="4" fill="#17372f"/><text x="62" y="21" class="vehicle-tag-text" text-anchor="middle">${tag}</text></g>
    </svg>
    <svg class="route-svg schematic-mobile" viewBox="0 0 326 340" role="img" aria-labelledby="diagram-title-mobile diagram-desc-mobile"><title id="diagram-title-mobile">Percurso da linha ${route.id}</title><desc id="diagram-desc-mobile">${summary}</desc><path d="M33 40V304" stroke="#f8e6dc" stroke-width="17" stroke-linecap="round"/><path d="M33 40V304" stroke="#c84324" stroke-width="4" stroke-linecap="round"/>${mobileStops}<g transform="translate(33 139)"><rect x="-16" y="-15" width="32" height="30" rx="6" fill="#17372f"/><svg x="-10" y="-11" width="20" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-bus"/></svg><rect x="25" y="-13" width="119" height="26" rx="4" fill="#17372f"/><text x="84" y="4" class="vehicle-tag-text" text-anchor="middle">${tag}</text></g></svg>
    <div class="diagram-footer"><span class="legend-dot" aria-hidden="true"></span><p>${route.bus} entre ${route.stops[1]} e ${route.stops[2]} · posição fictícia</p><span class="schematic-label">SEM ESCALA GEOGRÁFICA</span></div></div>`;
}

function renderReserve(route) {
  const assigned = state.assignments[route.id];
  const available = spareBuses.filter(spare => !ownerOf(spare));
  let body;
  if (assigned) {
    body = `<div class="assignment-result">${icon("check")}<div><h4>Reserva ${assigned} atribuída à linha ${route.id}</h4><p>Simulação concluída. ${assigned} reforça o autocarro ${route.bus}. O atraso observado de ${route.delay} min mantém-se; não foi enviada nenhuma ordem.</p><button type="button" class="undo-button" id="undo-assignment">${icon("undo")}Desfazer atribuição</button></div></div>`;
  } else if (!route.delay) {
    body = `<div class="normal-state">${icon("check")}<div><strong>Serviço dentro do horário</strong><p>Neste exercício, a atribuição de reservas está disponível para os veículos com atraso. Selecione a linha 24 ou 31.</p></div></div>`;
  } else {
    body = `<form id="reserve-form"><p class="reserve-copy">Atribua uma reserva à linha ${route.id} para reforçar o serviço. O autocarro ${route.bus} mantém o seu percurso.</p><fieldset class="spare-options"><legend>Escolher autocarro de reserva</legend>${spareBuses.map(spare => `<label class="spare-option"><input type="radio" name="spare" value="${spare}" ${ownerOf(spare) ? "disabled" : ""} ${spare === available[0] ? "checked" : ""} required><strong>${spare}</strong><small>${ownerOf(spare) ? `Na linha ${ownerOf(spare)}` : "Disponível"}</small></label>`).join("")}</fieldset>${available.length ? "" : `<p class="no-spares">Sem reservas livres. Desfaça uma atribuição para libertar um autocarro.</p>`}<div class="assign-footer"><p>Pode desfazer a atribuição a qualquer momento.</p><button class="primary-button" type="submit" id="assign-button" ${available.length ? "" : "disabled"}>Simular atribuição ${icon("arrow")}</button></div></form>`;
  }
  return `<section class="reserve-panel" aria-labelledby="reserve-title"><div class="reserve-heading"><div><p class="eyebrow">03 / PREPARAR RESPOSTA</p><h3 id="reserve-title">Reforço de serviço</h3></div>${icon("bus")}</div>${body}</section>`;
}

function renderDetail() {
  const route = selectedRoute();
  detail.innerHTML = `<div class="route-header"><div class="selected-route-badge" aria-label="Linha ${route.id}">${route.id}</div><div class="route-title-block"><p class="eyebrow">02 / INSPECIONAR PERCURSO</p><h2>${route.id === "07" ? "Circular Centro" : `${route.origin} <span aria-label="para">→</span> ${route.destination}`}</h2><p class="route-description">${icon("bus")}Autocarro ${route.bus}<span aria-hidden="true">·</span>${state.assignments[route.id] ? `Reforço ${state.assignments[route.id]} simulado` : "Em serviço"}</p></div><span class="inspection-tag">LINHA ${route.id}</span></div>
    <div class="detail-stats"><div class="detail-stat"><span>SITUAÇÃO ATUAL</span><strong class="${route.delay ? "delay" : "ontime"}">${route.delay ? `+${route.delay} min de atraso` : "A horas"}</strong></div><div class="detail-stat"><span>A BORDO</span><strong>${route.passengers}<small>passageiros</small></strong></div><div class="detail-stat"><span>PERCURSO</span><strong>5<small>paragens</small></strong></div></div>
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
  if (window.matchMedia("(max-width: 900px)").matches) detail.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"start"});
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
