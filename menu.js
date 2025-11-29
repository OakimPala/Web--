// menu.js
// Загружает блюда, рендерит, сохраняет выбор в localStorage (order),
// показывает sticky-панель с суммой и ссылкой на оформление.

const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
const STORAGE_KEY = "order"; // сохраняем объект { soup: "keyword", "main-course": "...", ... }

let dishes = [];
// orderObj: объект категории -> keyword
let orderObj = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

// Категории и id контейнеров
const categories = {
  soup: { container: "soups", displayName: "Суп" },
  "main-course": { container: "mains", displayName: "Главное блюдо" },
  salad: { container: "salads", displayName: "Салат/стартер" },
  drink: { container: "drinks", displayName: "Напиток" },
  dessert: { container: "desserts", displayName: "Десерт" },
};

// вспомогательная нормализация, если API возвращает 'main'
function normalizeCategory(cat) {
  if (!cat) return cat;
  if (cat === "main") return "main-course";
  return cat;
}

document.addEventListener("DOMContentLoaded", () => {
  loadDishes();
});

// --- загрузка блюд ---
async function loadDishes() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Ошибка сети: " + res.status);
    const data = await res.json();
    dishes = Array.isArray(data) ? data : (data.dishes || []);
    // нормализуем category в объектах (чтобы была единая система)
    dishes.forEach(d => { d.category = normalizeCategory(d.category); });

    initFiltersAndRender();
    restoreSelectionsUI(); // подсветить выбранные карточки и обновить панель
    ensureCheckoutPanel();
    updateCheckoutPanel();
  } catch (e) {
    console.error("Ошибка загрузки блюд:", e);
    // Вставляем сообщение в секцию меню (если есть)
    const menuSection = document.getElementById("menu-section");
    if (menuSection) menuSection.innerHTML = "<p>Не удалось загрузить меню. Повторите позже.</p>";
  }
}

// --- инициализация фильтров и рендер всех категорий ---
function initFiltersAndRender() {
  Object.entries(categories).forEach(([category, meta]) => {
    const section = document.getElementById(meta.container);
    if (!section) return;
    // удалим старые фильтры (если повторная инициализация)
    const existing = section.parentNode.querySelector(".filters");
    if (existing) existing.remove();

    const filterBlock = document.createElement("div");
    filterBlock.className = "filters";
    // Подбираем фильтры по типу kind, можно изменить по вкусу
    const filtersMap = {
      soup: { fish: "Рыбные", meat: "Мясные", veg: "Овощные" },
      "main-course": { fish: "Рыбные", meat: "Мясные", veg: "Овощные" },
      salad: { fish: "С рыбой", meat: "С мясом", veg: "Овощные", cheese: "С сыром" },
      drink: { cold: "Холодные", hot: "Горячие" },
      dessert: { small: "Маленькие", medium: "Средние", large: "Большие" },
    };
    const filters = filtersMap[category] || {};
    Object.entries(filters).forEach(([kind, label]) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.type = "button";
      btn.addEventListener("click", () => renderCategory(category, kind));
      filterBlock.appendChild(btn);
    });
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Сбросить фильтр";
    resetBtn.type = "button";
    resetBtn.addEventListener("click", () => renderCategory(category));
    filterBlock.appendChild(resetBtn);

    section.parentNode.insertBefore(filterBlock, section);
    // рендер самой категории
    renderCategory(category);
  });
}

// --- рендер карточек категории ---
function renderCategory(category, filterKind = null) {
  const meta = categories[category];
  if (!meta) return;
  const container = document.getElementById(meta.container);
  if (!container) return;
  container.innerHTML = "";

  let list = dishes.filter(d => normalizeCategory(d.category) === category);
  if (filterKind) list = list.filter(d => d.kind === filterKind);

  if (list.length === 0) {
    container.innerHTML = `<p class="empty">Ничего не найдено</p>`;
    return;
  }

  list.forEach(dish => {
    const card = document.createElement("div");
    card.className = "dish-card";
    // если блюдо выбрано — подсветим
    const isSelected = orderObj[category] === dish.keyword;
    if (isSelected) card.classList.add("selected");

    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <p><strong>${dish.price}₽</strong></p>
      <p>${dish.name}</p>
      <p class="dish-count">${dish.count || ""}</p>
      <button type="button" class="add-btn">${isSelected ? "Удалить" : "Добавить"}</button>
    `;
    const btn = card.querySelector(".add-btn");
    btn.addEventListener("click", () => {
      // выбираем/удаляем блюдо именно в этой категории (по спецификации одно блюдо на категорию)
      if (orderObj[category] === dish.keyword) {
        // удалить
        delete orderObj[category];
      } else {
        orderObj[category] = dish.keyword;
      }
      persistOrder();
      // перерендерить категорию, чтобы обновить кнопки
      renderCategory(category);
      restoreSelectionsUI();
      updateCheckoutPanel();
    });

    container.appendChild(card);
  });
}

// --- сохраняем в localStorage ---
function persistOrder() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orderObj));
}

// --- подсветить выбранные карточки по всему меню ---
function restoreSelectionsUI() {
  document.querySelectorAll(".dish-card").forEach(card => {
    const btn = card.querySelector(".add-btn");
    if (!btn) return;
    const name = card.querySelector("p:nth-of-type(2)")?.textContent || ""; // may be brittle
    // лучше: берем keyword по поиску блюда по имени+price — но проще: dataset not set here
    // вместо этого — перепроверим кнопку text при рендере, и просто обновим панели
  });
  // проще: при renderCategory уже добавляем класс selected, а кнопке текст — поэтому можно оставить
  updateCheckoutPanel();
}


// ----------------- STICKY CHECKOUT PANEL -----------------
let checkoutPanel = null;

function ensureCheckoutPanel() {
  if (document.getElementById("checkout-panel")) return;
  checkoutPanel = document.createElement("div");
  checkoutPanel.id = "checkout-panel";
  checkoutPanel.className = "checkout-panel";
  // контент
  checkoutPanel.innerHTML = `
    <div class="checkout-row">
      <div>Стоимость: <span id="checkout-sum">0</span>₽</div>
      <a id="checkout-link" href="order.html" class="checkout-link disabled" aria-disabled="true">Перейти к оформлению</a>
    </div>
  `;
  // Вставим в конец body
  document.body.appendChild(checkoutPanel);
  // Можно стилизовать в CSS
}

function updateCheckoutPanel() {
  const sumEl = document.getElementById("checkout-sum");
  const link = document.getElementById("checkout-link");
  if (!sumEl || !link) return;
  // считаем сумму выбранных блюд
  let sum = 0;
  Object.entries(orderObj).forEach(([cat, kw]) => {
    const dish = dishes.find(d => d.keyword === kw);
    if (dish) sum += Number(dish.price) || 0;
  });
  sumEl.textContent = sum;

  // Проверяем валидность состава (ту же логику, что и в форме)
  const items = getSelectedObjects();
  const valid = validateCombo(items);

  if (Object.keys(orderObj).length === 0 || !valid) {
    link.classList.add("disabled");
    link.setAttribute("aria-disabled", "true");
    link.style.pointerEvents = "none";
  } else {
    link.classList.remove("disabled");
    link.setAttribute("aria-disabled", "false");
    link.style.pointerEvents = "";
  }

  // скрываем панель если ничего не выбрано
  if (Object.keys(orderObj).length === 0) {
    checkoutPanel.style.display = "none";
  } else {
    checkoutPanel.style.display = "block";
  }
}


function getSelectedObjects() {
  return Object.entries(orderObj)
    .map(([cat, kw]) => dishes.find(d => d.keyword === kw))
    .filter(Boolean);
}


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

