
let dishes = [];

const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

const categories = {
  soup: { container: "soups", filters: { fish: "Рыбные", meat: "Мясные", veg: "Овощные" } },
  "main-course": { container: "mains", filters: { fish: "Рыбные", meat: "Мясные", veg: "Овощные" } },
  salad: { container: "salads", filters: { fish: "С рыбой", meat: "С мясом", veg: "Овощные" } },
  drink: { container: "drinks", filters: { cold: "Холодные", hot: "Горячие" } },
  dessert: { container: "desserts", filters: { small: "Маленькие", medium: "Средние", large: "Большие" } },
};


async function loadDishes() {
  const res = await fetch(API_URL);
  dishes = await res.json();

  console.log("Блюда загружены:", dishes);

  initFilters();
  Object.keys(categories).forEach(c => renderCategory(c));
}

document.addEventListener("DOMContentLoaded", loadDishes);


function initFilters() {
  Object.entries(categories).forEach(([category, { container, filters }]) => {
    const section = document.getElementById(container);
    if (!section) return;

    const filterBlock = document.createElement("div");
    filterBlock.classList.add("filters");

    Object.entries(filters).forEach(([kind, label]) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.dataset.kind = kind;
      btn.addEventListener("click", () => applyFilter(category, kind));
      filterBlock.appendChild(btn);
    });

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Сбросить";
    resetBtn.addEventListener("click", () => renderCategory(category));
    filterBlock.appendChild(resetBtn);

    section.parentNode.insertBefore(filterBlock, section);
  });
}


function renderCategory(category, filterKind = null) {
  const containerId = categories[category].container;
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  let list = dishes.filter(d => d.category === category);
  if (filterKind) list = list.filter(d => d.kind === filterKind);

  list.forEach(dish => {
    const card = document.createElement("div");
    card.classList.add("dish-card");
    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <p><strong>${dish.price}₽</strong></p>
      <p>${dish.name}</p>
      <p>${dish.count}</p>
      <button type="button" class="add-btn" data-key="${dish.keyword}" data-category="${dish.category}">
        Добавить
      </button>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToOrder(btn.dataset.key, btn.dataset.category));
  });
}

function applyFilter(category, kind) {
  renderCategory(category, kind);
}


function addToOrder(keyword, category) {
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  const displayMap = {
    soup: "order-soup",
    "main-course": "order-main",
    salad: "order-salad",
    drink: "order-drink",
    dessert: "order-dessert",
  };

  const target = document.getElementById(displayMap[category]);
  target.textContent = `${dish.name} — ${dish.price}₽`;

  highlightCard(keyword, category);
}

function highlightCard(keyword, category) {
  document.querySelectorAll(".dish-card").forEach(c => c.classList.remove("selected"));

  const btn = document.querySelector(`.add-btn[data-key="${keyword}"][data-category="${category}"]`);
  if (btn) btn.closest(".dish-card").classList.add("selected");
}


document.querySelector(".order-form")?.addEventListener("submit", handleOrderSubmit);

function handleOrderSubmit(e) {
  e.preventDefault();

  const items = getSelectedDishes();
  const counts = { soup: 0, "main-course": 0, salad: 0, drink: 0 };
  items.forEach(i => counts[i.category]++);

  const { soup, "main-course": main, salad, drink } = counts;
  const total = soup + main + salad + drink;

  if (total === 0) {
    notify("Ничего не выбрано. Выберите блюда для заказа");
    return;
  }

  if (total > 0 && drink === 0) {
    notify("Выберите напиток");
    return;
  }

  if (soup > 0 && main === 0 && salad === 0) {
    notify("Выберите главное блюдо или салат");
    return;
  }

  if (salad > 0 && soup === 0 && main === 0) {
    notify("Выберите суп или главное блюдо");
    return;
  }

  if (drink > 0 && soup === 0 && main === 0 && salad === 0) {
    notify("Выберите главное блюдо");
    return;
  }

  const data = {
    name: e.target.username.value,
    phone: e.target.phone.value,
    items,
    total_price: document.querySelector(".price")?.textContent || "0₽"
  };

  fetch("https://httpbin.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(() => notify("Заказ успешно оформлен!"))
  .catch(() => notify("Ошибка отправки заказа"));
}


function getSelectedDishes() {
  const map = {
    soup: "order-soup",
    "main-course": "order-main",
    salad: "order-salad",
    drink: "order-drink",
    dessert: "order-dessert"
  };

  const selected = [];

  Object.entries(map).forEach(([category, id]) => {
    const el = document.getElementById(id);
    if (!el || !el.textContent.includes("₽")) return;

    const [name, priceText] = el.textContent.split(" — ");
    const price = parseInt(priceText);
    const dish = dishes.find(d => d.name === name && d.price === price);

    if (dish) selected.push(dish);
  });

  return selected;
}



function notify(text) {
  const old = document.querySelector(".alert-box");
  if (old) old.remove();

  const box = document.createElement("div");
  box.className = "alert-box";
  box.innerHTML = `
    <div class="alert-content">
      <p>${text}</p>
      <button id="alert-ok">Окей 👌</button>
    </div>
  `;
  document.body.appendChild(box);

  document.getElementById("alert-ok").onclick = () => box.remove();
}









