document.addEventListener("DOMContentLoaded", () => {
  const soupsContainer = document.getElementById("soups");
  const mainsContainer = document.getElementById("mains");
  const drinksContainer = document.getElementById("drinks");

  
  const soups = dishes.filter(d => d.category === "soup").sort((a, b) => a.name.localeCompare(b.name, "ru"));
  const mains = dishes.filter(d => d.category === "main").sort((a, b) => a.name.localeCompare(b.name, "ru"));
  const drinks = dishes.filter(d => d.category === "drink").sort((a, b) => a.name.localeCompare(b.name, "ru"));

 
  renderCategory(soups, soupsContainer, "orange");
  renderCategory(mains, mainsContainer, "apple");
  renderCategory(drinks, drinksContainer, "cherry");
});

function renderCategory(categoryArray, container, colorClass) {
  categoryArray.forEach(dish => {
    const card = document.createElement("div");
    card.classList.add("dish-card", colorClass);
    card.setAttribute("data-dish", dish.keyword);
    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <p><strong>${dish.price}₽</strong></p>
      <p>${dish.name}</p>
      <p>${dish.count}</p>
      <button type="button" class="add-btn">Добавить</button>
    `;

    container.appendChild(card);
    card.querySelector(".add-btn").addEventListener("click", () => selectDish(dish));
  });
}


let selected = { soup: null, main: null, drink: null };

function selectDish(dish) {
  selected[dish.category] = dish;

  
  document.querySelectorAll(`[data-dish]`).forEach(el => {
    const elDish = dishes.find(d => d.keyword === el.dataset.dish);
    if (elDish && elDish.category === dish.category) {
      el.classList.remove("selected");
    }
  });

  
  const card = document.querySelector(`[data-dish="${dish.keyword}"]`);
  if (card) card.classList.add("selected");

  updateOrder();
}


function updateOrder() {
  const soupEl = document.getElementById("order-soup");
  const mainEl = document.getElementById("order-main");
  const drinkEl = document.getElementById("order-drink");
  const totalEl = document.getElementById("order-total");

  soupEl.innerHTML = `Суп: ${selected.soup ? selected.soup.name + " — " + selected.soup.price + "₽" : "<span class='none'>Блюдо не выбрано</span>"}`;
  mainEl.innerHTML = `Главное блюдо: ${selected.main ? selected.main.name + " — " + selected.main.price + "₽" : "<span class='none'>Блюдо не выбрано</span>"}`;
  drinkEl.innerHTML = `Напиток: ${selected.drink ? selected.drink.name + " — " + selected.drink.price + "₽" : "<span class='none'>Напиток не выбран</span>"}`;

  const total = [selected.soup, selected.main, selected.drink]
    .filter(Boolean)
    .reduce((sum, d) => sum + d.price, 0);

  if (total > 0) {
    totalEl.style.display = "block";
    totalEl.textContent = `Стоимость заказа: ${total}₽`;
  } else {
    totalEl.style.display = "none";
  }

  
  document.getElementById("input-soup").value = selected.soup ? selected.soup.keyword : "";
  document.getElementById("input-main").value = selected.main ? selected.main.keyword : "";
  document.getElementById("input-drink").value = selected.drink ? selected.drink.keyword : "";
}
