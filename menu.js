document.addEventListener("DOMContentLoaded", () => {
  const categories = {
    soup: { container: "soups", filters: { fish: "Восточная кухня", meat: "Русская кухня", veg: "Овощные" } },
    main: { container: "mains", filters: { fish: "Рыбные", meat: "Мясные", veg: "Овощные" } },
    salad: { container: "salads", filters: { fish: "С рыбой", meat: "С мясом", cheese: "С сыром", veg: "Овощные" } },
    drink: { container: "drinks", filters: { cold: "Холодные", hot: "Горячие" } },
    dessert: { container: "desserts", filters: { small: "Маленькие", medium: "Средние", large: "Большие" } },
  };

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
    resetBtn.textContent = "Сбросить фильтр";
    resetBtn.classList.add("reset-btn");
    resetBtn.addEventListener("click", () => renderCategory(category));
    filterBlock.appendChild(resetBtn);

    section.parentNode.insertBefore(filterBlock, section);
    renderCategory(category);
  });
});

function renderCategory(category, filterKind = null) {
  const container = document.getElementById(getContainerId(category));
  if (!container) return;
  container.innerHTML = "";

  let items = dishes.filter(d => d.category === category);
  if (filterKind) {
    items = items.filter(d => d.kind === filterKind);
  }

  items.forEach(dish => {
    const card = document.createElement("div");
    card.classList.add("drink-card");
    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <p><strong>${dish.price}₽</strong></p>
      <p>${dish.name}</p>
      <p>${dish.count}</p>
      <button type="button" class="add-btn" data-key="${dish.keyword}" data-category="${dish.category}">Добавить</button>
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

function getContainerId(category) {
  return {
    soup: "soups",
    main: "mains",
    salad: "salads",
    drink: "drinks",
    dessert: "desserts",
  }[category];
}

// === Добавление блюда в заказ ===
function addToOrder(keyword, category) {
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  const displayMap = {
    soup: "order-soup",
    main: "order-main",
    salad: "order-salad",
    drink: "order-drink",
    dessert: "order-dessert",
  };

  const orderElement = document.getElementById(displayMap[category]);
  if (orderElement) {
    orderElement.textContent = `${dish.name} — ${dish.price}₽`;
  }
}

