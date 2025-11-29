// order.js - логика страницы "Оформить заказ"
const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
const STORAGE_KEY = "order"; // тот же ключ, что и в menu.js

let dishes = [];
let orderObj = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

// helper
function normalizeCategory(cat) {
  if (!cat) return cat;
  if (cat === "main") return "main-course";
  return cat;
}

document.addEventListener("DOMContentLoaded", () => {
  loadDishesAndRender();
  document.getElementById("order-form")?.addEventListener("submit", onSubmit);
});

async function loadDishesAndRender() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Ошибка сети " + res.status);
    const data = await res.json();
    dishes = Array.isArray(data) ? data : (data.dishes || []);
    dishes.forEach(d => d.category = normalizeCategory(d.category));
    renderSelectedList();
    updateTotalsAndSlots();
  } catch (e) {
    console.error(e);
    const container = document.getElementById("order-items");
    if (container) container.innerHTML = "<p>Не удалось загрузить данные о блюдах.</p>";
  }
}

// Рендер списка выбранных блюд (левая часть)
function renderSelectedList() {
  const container = document.getElementById("order-items");
  if (!container) return;
  container.innerHTML = "";

  const keys = Object.values(orderObj);
  if (!keys || keys.length === 0) {
    container.innerHTML = `<p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="index.html">Собрать ланч</a>.</p>`;
    return;
  }

  keys.forEach(kw => {
    const dish = dishes.find(d => d.keyword === kw);
    if (!dish) return;
    const card = document.createElement("div");
    card.className = "dish-card order-card";
    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <p><strong>${dish.price}₽</strong></p>
      <p>${dish.name}</p>
      <p>${dish.count || ""}</p>
      <button type="button" class="remove-btn" data-key="${dish.keyword}">Удалить</button>
    `;
    container.appendChild(card);
  });

  // добавляем обработчики удаления
  container.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const key = e.currentTarget.dataset.key;
      removeFromOrder(key);
    });
  });
}

// Удаляем блюдо и обновляем localStorage + UI
function removeFromOrder(keyword) {
  // удалим все вхождения (но по нашей схеме ключ уникален)
  Object.keys(orderObj).forEach(cat => {
    if (orderObj[cat] === keyword) delete orderObj[cat];
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orderObj));
  renderSelectedList();
  updateTotalsAndSlots();
}

// Обновление левой колонки со слотами и общей суммы
function updateTotalsAndSlots() {
  const slots = {
    soup: document.getElementById("order-soup"),
    "main-course": document.getElementById("order-main"),
    salad: document.getElementById("order-salad"),
    drink: document.getElementById("order-drink"),
    dessert: document.getElementById("order-dessert")
  };

  // заполняем "Не выбрано"
  Object.values(slots).forEach(el => { if (el) el.textContent = "Блюдо не выбрано"; });

  const selectedDishes = Object.values(orderObj)
    .map(k => dishes.find(d => d.keyword === k))
    .filter(Boolean);

  let total = 0;
  selectedDishes.forEach(d => {
    const slotEl = slots[d.category] || slots[normalizeCategory(d.category)];
    if (slotEl) slotEl.textContent = `${d.name} ${d.price}₽`;
    total += Number(d.price) || 0;
  });

  const totalEl = document.getElementById("order-total-sum");
  if (totalEl) totalEl.textContent = `${total}₽`;
}

// Проверка соответствия доступным комбо (те же правила, что и в menu.js)
function validateCombo(items) {
  const counts = { soup: 0, "main-course": 0, salad: 0, drink: 0 };
  items.forEach(i => {
    const cat = normalizeCategory(i.category);
    if (counts[cat] !== undefined) counts[cat]++;
  });
  const soup = counts.soup, main = counts["main-course"], salad = counts.salad, drink = counts.drink;
  const total = soup + main + salad + drink;
  if (total === 0) return false;
  if (drink === 0) return false;
  if (soup > 0 && main === 0 && salad === 0) return false;
  if (salad > 0 && soup === 0 && main === 0) return false;
  if (drink > 0 && soup === 0 && main === 0 && salad === 0) return false;
  return true;
}

// Отправка формы
async function onSubmit(e) {
  e.preventDefault();
  const form = e.target;

  // собираем выбранные блюда
  const selectedItems = Object.values(orderObj).map(k => dishes.find(d => d.keyword === k)).filter(Boolean);

  if (!validateCombo(selectedItems)) {
    alert("Состав заказа не соответствует доступным комбо. Проверьте выбор.");
    return;
  }

  const payload = {
    username: (form.querySelector("#name")?.value || ""),
    phone: (form.querySelector("#phone")?.value || ""),
    email: (form.querySelector("#email")?.value || ""),
    address: (form.querySelector("#address")?.value || ""),
    items: selectedItems.map(d => ({ keyword: d.keyword, price: d.price })),
    total_price: selectedItems.reduce((s, d) => s + Number(d.price || 0), 0)
  };

  try {
    // По умолчанию используем тестовый endpoint. Для реальной отправки
    // замени URL на production (lab8-api) и добавь api_key в query string.
    const res = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Ошибка при отправке: " + res.status);
    const result = await res.json();
    console.log("Успешно отправлено:", result);

    // при успехе очищаем localStorage
    localStorage.removeItem(STORAGE_KEY);
    orderObj = {};
    renderSelectedList();
    updateTotalsAndSlots();
    alert("Заказ успешно оформлен!");
  } catch (err) {
    console.error(err);
    alert("Ошибка при оформлении заказа. Попробуйте позже.");
    // localStorage не очищаем
  }
}
