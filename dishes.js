let dishes = [];

async function loadDishes() {
  const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    dishes = await response.json();

    console.log("Блюда загружены:", dishes);

  
    if (typeof renderCategory === "function") {
      renderCategory("soup");
      renderCategory("main");
      renderCategory("salad");
      renderCategory("dessert");
      renderCategory("drink");
    }

  } catch (err) {
    console.error("Ошибка при загрузке блюд:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadDishes);
