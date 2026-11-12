"use strict";

const products = {
  small: { name: "Pequena", diameter: "12 cm", capacity: "350 ml", price: 24 },
  medium: { name: "Média", diameter: "17 cm", capacity: "700 ml", price: 34 }
};
const storageKey = "barro-demo-bag-v1";
const currency = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const bagDialog = document.getElementById("bag-dialog");
const bagContent = document.getElementById("bag-content");
const announcement = document.getElementById("announcement");
let bag = {};
let returnFocus = null;

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (saved && typeof saved === "object" && !Array.isArray(saved)) {
    for (const id of Object.keys(products)) {
      if (Number.isInteger(saved[id]) && saved[id] > 0 && saved[id] <= 99) bag[id] = saved[id];
    }
  }
} catch (_) {
  // The demo also works when storage is unavailable or contains invalid data.
}

function announce(message) {
  announcement.textContent = "";
  requestAnimationFrame(() => { announcement.textContent = message; });
}

function saveBag() {
  try { localStorage.setItem(storageKey, JSON.stringify(bag)); } catch (_) { /* Keep the current session usable. */ }
}

function renderBag() {
  const items = Object.entries(bag);
  const count = items.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = items.reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
  document.getElementById("bag-count").textContent = `(${count})`;
  document.getElementById("dialog-count").textContent = count ? `(${count})` : "";
  document.getElementById("bag-total").textContent = currency.format(total);
  document.getElementById("bag-total-row").hidden = count === 0;
  if (!count) {
    bagContent.innerHTML = `<div class="empty-bag"><svg width="42" height="50" viewBox="0 0 42 50" fill="none" aria-hidden="true"><path d="M5 16h32l3 31H2l3-31Z" stroke="currentColor"/><path d="M12 20V12a9 9 0 0 1 18 0v8" stroke="currentColor"/></svg><h3>Ainda por preencher.</h3><p>Escolha o tamanho da sua taça e adicione-o ao saco.</p></div>`;
    return;
  }
  bagContent.innerHTML = items.map(([id, quantity]) => {
    const product = products[id];
    return `<article class="bag-item" data-product="${id}">
      <img class="bag-item-image" src="assets/bowls.png" alt="" width="87" height="110">
      <div><div class="bag-item-heading"><h3>Taça — ${product.name}</h3><span class="line-price">${currency.format(product.price * quantity)}</span></div>
      <p>Vidrado aveia · ${currency.format(product.price)} / un.</p><p>Ø ${product.diameter} · ${product.capacity}</p>
      <div class="bag-item-actions"><div class="quantity-controls" role="group" aria-label="Quantidade de taças ${product.name.toLowerCase()}s"><button type="button" data-action="decrease" data-id="${id}" aria-label="Diminuir quantidade de taças ${product.name.toLowerCase()}s" ${quantity === 1 ? "disabled" : ""}>−</button><output aria-label="Quantidade">${quantity}</output><button type="button" data-action="increase" data-id="${id}" aria-label="Aumentar quantidade de taças ${product.name.toLowerCase()}s" ${quantity === 99 ? "disabled" : ""}>+</button></div><button type="button" class="remove-item" data-action="remove" data-id="${id}" aria-label="Remover taça ${product.name.toLowerCase()} do saco">Remover</button></div></div>
    </article>`;
  }).join("");
}

function openBag() {
  returnFocus = document.activeElement;
  renderBag();
  bagDialog.showModal();
  document.body.classList.add("bag-open");
  document.getElementById("close-bag").focus();
}

function closeBag() { bagDialog.close(); }

bagDialog.addEventListener("close", () => {
  document.body.classList.remove("bag-open");
  if (returnFocus && returnFocus.isConnected) returnFocus.focus();
});

bagDialog.addEventListener("click", (event) => {
  if (event.target !== bagDialog) return;
  const bounds = bagDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeBag();
});

document.getElementById("open-bag").addEventListener("click", openBag);
document.getElementById("close-bag").addEventListener("click", closeBag);
document.getElementById("continue-shopping").addEventListener("click", closeBag);

document.getElementById("product-form").addEventListener("change", (event) => {
  const product = products[event.target.value];
  if (!product) return;
  document.getElementById("selected-price").textContent = currency.format(product.price);
  document.getElementById("selection-note").textContent = `${product.name} · Ø ${product.diameter} · ${product.capacity}`;
});

document.getElementById("product-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = new FormData(event.currentTarget).get("size");
  if (!Object.hasOwn(products, id)) return;
  if ((bag[id] || 0) >= 99) {
    openBag();
    announce("O saco já tem 99 taças deste tamanho, o limite desta demonstração.");
    return;
  }
  bag[id] = (bag[id] || 0) + 1;
  saveBag();
  openBag();
  announce(`Taça ${products[id].name.toLowerCase()} adicionada ao saco.`);
});

bagContent.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { id, action } = button.dataset;
  if (!Object.hasOwn(bag, id)) return;
  if (action === "remove") delete bag[id];
  else if (action === "increase" && bag[id] < 99) bag[id] += 1;
  else if (action === "decrease" && bag[id] > 1) bag[id] -= 1;
  saveBag();
  renderBag();
  if (action === "remove") {
    announce(`Taça ${products[id].name.toLowerCase()} removida do saco.`);
    const nextControl = bagContent.querySelector("button:not(:disabled)") || document.getElementById("continue-shopping");
    nextControl.focus();
  } else {
    announce(`Quantidade de taças ${products[id].name.toLowerCase()}s: ${bag[id]}. Total: ${document.getElementById("bag-total").textContent}.`);
    const sameControl = bagContent.querySelector(`[data-id="${id}"][data-action="${action}"]`);
    const oppositeAction = action === "increase" ? "decrease" : "increase";
    const alternative = bagContent.querySelector(`[data-id="${id}"][data-action="${oppositeAction}"]`);
    (sameControl && !sameControl.disabled ? sameControl : alternative).focus();
  }
});

renderBag();
