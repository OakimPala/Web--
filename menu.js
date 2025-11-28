let dishes = []; 

document.addEventListener("DOMContentLoaded", () => {
  loadDishes(); 

  const categories = {
    soup: { container: "soups", filters: { fish: "Восточная кухня", meat: "Русская кухня", veg: "Овощные" } },
    main: { container: "mains", filters: { fish: "Рыбные", meat: "Мясные", veg: "Овощные" } },
    salad: { container: "salads", filters: { fish: "С рыбой", meat: "С мясом", cheese: "С сыром", veg: "Овощные" } },
    drink: { container: "drinks", filters: { cold: "Холодные", hot: "Горячие" } },
    dessert: { container: "desserts", filters: { small: "Маленькие", medium: "Средние", large: "Большие" } },
  };

  window.categories = categories;

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
  });

  const orderForm = document.querySelector(".order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", handleOrderSubmit);
  }
});


async function loadDishes() {
  try {
    const response = await fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/dishes"); 
    const data = await response.json();

  
    dishes = data || [];

   
    Object.keys(categories).forEach(cat => renderCategory(cat));

  } catch (e) {
    console.error("Ошибка загрузки блюд:", e);
    showNotification("Ошибка загрузки меню. Попробуйте обновить страницу.");
    console.log("Блюда загружены:", dishes);
    console.log("Категории:", [...new Set(dishes.map(d => d.category))]);
  }
}



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
    card.classList.add("dish-card");
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
    soup: "soups-list",
    main: "mains-list",
    salad: "salads-list",
    drink: "drinks-list",
    dessert: "desserts-list",
  }[category];
}


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
  highlightCard(keyword, category);
}

function highlightCard(keyword, category) {
  document.querySelectorAll(".dish-card").forEach(card => {
    card.classList.remove('selected');
  });

  const targetBtn = document.querySelector(`.add-btn[data-key="${keyword}"][data-category="${category}"]`);
  if (targetBtn) {
    const targetCard = targetBtn.closest('.dish-card');
    targetCard.classList.add('selected');
  }
}


function handleOrderSubmit(e) {
  e.preventDefault();

  const selectedDishes = getSelectedDishesFromDisplay();
  
  const counts = { soup: 0, main: 0, salad: 0, drink: 0 };
  selectedDishes.forEach(item => {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  });

  const { soup, main, salad, drink } = counts;
  const totalItems = soup + main + salad + drink;

  if (totalItems === 0) {
    showNotification("Ничего не выбрано. Выберите блюда для заказа");
    return;
  }

  if (totalItems > 0 && drink === 0) {
    showNotification("Выберите напиток");
    return;
  }

  if (soup > 0 && main === 0 && salad === 0) {
    showNotification("Выберите главное блюдо или салат");
    return;
  }

  if (salad > 0 && soup === 0 && main === 0) {
    showNotification("Выберите суп или главное блюдо");
    return;
  }

  if (drink > 0 && soup === 0 && main === 0 && salad === 0) {
    showNotification("Выберите главное блюдо");
    return;
  }

  const formData = new FormData(e.target);
  const priceEl = document.querySelector(".price");
  
  const data = {
    name: formData.get('username'),
    phone: formData.get('phone'),
    items: selectedDishes,
    total_price: priceEl ? priceEl.textContent : '0₽'
  };

  fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Заказ успешно отправлен:', result);
    showNotification("Заказ успешно оформлен!");
  })
  .catch(error => {
    console.error('Ошибка отправки заказа:', error);
    showNotification("Ошибка при оформлении заказа. Попробуйте еще раз.");
  });
}


function getSelectedDishesFromDisplay() {
  const selectedDishes = [];
  const displayMap = {
    soup: "order-soup",
    main: "order-main", 
    salad: "order-salad",
    drink: "order-drink",
    dessert: "order-dessert"
  };

  Object.entries(displayMap).forEach(([category, elementId]) => {
    const element = document.getElementById(elementId);
    if (element && element.textContent.includes("₽")) {
      const text = element.textContent;
      const name = text.split(" — ")[0];
      const price = text.split(" — ")[1].replace("₽", "");
      const dish = dishes.find(d => d.name === name && d.price.toString() === price);
      if (dish) {
        selectedDishes.push({
          keyword: dish.keyword,
          category: dish.category,
          name: dish.name,
          price: dish.price
        });
      }
    }
  });

  return selectedDishes;
}

function showNotification(text) {
  const old = document.querySelector(".alert-box");
  if (old) old.remove();

  const alertBox = document.createElement("div");
  alertBox.className = "alert-box";
  alertBox.innerHTML = `
    <div class="alert-content">
      <p>${text}</p>
      <button id="alert-ok">Окей 👌</button>
    </div>
  `;
  document.body.appendChild(alertBox);

  document.getElementById("alert-ok").addEventListener("click", () => {
    alertBox.remove();
  });
}


