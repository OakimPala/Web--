
// === Массив всех блюд ===
const dishes = [
  // 🥣 Супы
  { keyword: "borsch", name: "Борщ", price: 109, category: "soup", kind: "meat", count: "300 мл", image: "https://prostokvashino.ru/upload/resize_cache/iblock/5e1/800_800_0/5e17b58e5a12db3624b168644414b70d.jpg" },
  { keyword: "solyanka", name: "Солянка", price: 149, category: "soup", kind: "meat", count: "300 мл", image: "https://s.myspar.ru/upload/img/10/1000/100071295.jpg?1721035848" },
  { keyword: "harcho", name: "Харчо", price: 149, category: "soup", kind: "fish", count: "300 мл", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzBjI7ew6jgRB9mTzv4Icxq-ePMN6bCPfb6Q&s" },
  { keyword: "shurpa", name: "Шурпа", price: 149, category: "soup", kind: "fish", count: "300 мл", image: "https://anor24.ru/wp-content/uploads/2020/06/ANOR3261.jpg" },
  { keyword: "veg-soup1", name: "Овощной суп", price: 120, category: "soup", kind: "veg", count: "300 мл", image: "https://img.povar.ru/mobile/99/e0/7c/ff/ovoshnoi_sup_klassicheskii-327375.JPG" },
  { keyword: "veg-soup2", name: "Гаспачо", price: 130, category: "soup", kind: "veg", count: "300 мл", image: "https://api.syrovarnya.com/sites/default/files/styles/image_468x468/public/catalog/100009006N.jpg?itok=YmeDJc2v" },

  // 🍛 Основные блюда
  { keyword: "plov", name: "Плов", price: 150, category: "main", kind: "meat", count: "300 гр", image: "https://img09.rl0.ru/afisha/e1200x1200i/daily.afisha.ru/uploads/images/9/29/929a072cc910f5b436b4608e8f25530e.jpg" },
  { keyword: "kebabs", name: "Казан кебаб", price: 240, category: "main", kind: "meat", count: "300 гр", image: "https://caravellacatering.com/wp-content/uploads/2023/10/kazan-kebab.jpg" },
  { keyword: "cutlets", name: "Рыбные котлеты с пюре", price: 240, category: "main", kind: "fish", count: "300 гр", image: "https://club.mysamson.ru/upload/resize_cache/webp/resize_cache/iblock/70d/480_480_2/zdk6s5bokxrxbxtbtebr7gh85dbvpq6t.webp" },
  { keyword: "free", name: "Картошка с грибами", price: 240, category: "main", kind: "veg", count: "300 гр", image: "https://menunedeli.ru/wp-content/uploads/2015/05/45/zharenaja-kartoshka-s-gribami-i-lukom-%D0%BE_opt.jpg" },
  { keyword: "veg-main1", name: "Рагу овощное", price: 200, category: "main", kind: "veg", count: "300 гр", image: "https://lafoy.ru/photo_l/ovoshchnoe-ragu-s-myasom-recepty-1412-57093.jpg" },
  { keyword: "veg-main2", name: "Каша гречневая с овощами", price: 180, category: "main", kind: "veg", count: "300 гр", image: "https://static.1000.menu/img/content-v2/31/32/19266/grechka-s-ovoschami-v-multivarke_1748607371_0_z2dbwcx_max.jpg" },

  // 🥗 Салаты и стартеры
  { keyword: "fish-salad", name: "Салат с тунцом", price: 180, category: "salad", kind: "fish", count: "200 гр", image: "https://dikoed.ru/upload/iblock/1ce/15545-ovoshchnoy-salat-s-tuntsom.jpg" },
  { keyword: "meat-salad", name: "Цезарь с курицей", price: 200, category: "salad", kind: "meat", count: "200 гр", image: "https://ferma-m2.ru/images/shop/recipe_image/crop_shutterstock_1505620307.jpg" },
  { keyword: "veg-salad1", name: "Греческий салат", price: 150, category: "salad", kind: "cheese", count: "200 гр", image: "https://terki-na-kuhne.ru/wp-content/uploads/2023/07/grecheskii-salat.jpg" },
  { keyword: "veg-salad2", name: "Овощной микс", price: 130, category: "salad", kind: "veg", count: "200 гр", image: "https://surmullet.ru/wp-content/uploads/2020/10/389.jpg" },
  { keyword: "veg-salad3", name: "Винегрет", price: 140, category: "salad", kind: "veg", count: "200 гр", image: "https://tsx.x5static.net/i/800x800-fit/xdelivery/files/5a/74/7f6863fd0f73f46b1f2fb978b73e.jpg" },
  { keyword: "veg-salad4", name: "Салат из свеклы с брынзой", price: 130, category: "salad", kind: "cheese", count: "200 гр", image: "https://cdn.lifehacker.ru/wp-content/uploads/2022/01/Depositphotos_132493922_XL_1643292066-scaled.jpg" },

  // 🍰 Десерты
  { keyword: "cake1", name: "Чизкейк", price: 160, category: "dessert", kind: "medium", count: "150 гр", image: "https://annatomilchik.ru/wp-content/uploads/2021/07/chizkejk-nyu-jork.jpg" },
  { keyword: "cake2", name: "Медовик", price: 150, category: "dessert", kind: "small", count: "120 гр", image: "https://cafe-milfei.ru/wp-content/uploads/2020/06/medovik.jpg" },
  { keyword: "cake3", name: "Наполеон", price: 150, category: "dessert", kind: "small", count: "120 гр", image: "https://media.ovkuse.ru/images/recipes/00dd49ad-83ee-41f5-841e-868f4e007cc0/00dd49ad-83ee-41f5-841e-868f4e007cc0_420_420.webp" },
  { keyword: "cake4", name: "Пирожное картошка", price: 120, category: "dessert", kind: "small", count: "100 гр", image: "https://cheese-cake.ru/DesertImg/pirozhnoe-kartoshka-0.jpg" },
  { keyword: "cake5", name: "Шоколадный торт", price: 220, category: "dessert", kind: "large", count: "200 гр", image: "https://n1s1.hsmedia.ru/ae/d2/ec/aed2ecfde65b702070787c74794f109b/1706x1280_0xxc0jt2Ks_9272380379954763853.jpg" },
  { keyword: "cake6", name: "Фруктовое желе", price: 130, category: "dessert", kind: "medium", count: "150 гр", image: "https://img.7dach.ru/image/600/17/79/12/2017/06/30/4742ff.jpg" },

  // 🍹 Напитки
  { keyword: "orange", name: "Апельсиновый сок", price: 120, category: "drink", kind: "cold", count: "300 мл", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE2c96ckaH2aSZm89Jxenx-RKTVeXg8TOkhw&s" },
  { keyword: "apple", name: "Яблочный сок", price: 90, category: "drink", kind: "cold", count: "300 мл", image: "https://eda.ru/images/RecipePhoto/930x622/domashniy-yablochnyy-sok_173985_photo_181327.webp" },
  { keyword: "cherry", name: "Вишнёвый сок", price: 110, category: "drink", kind: "cold", count: "300 мл", image: "https://m.dom-eda.com/uploads/topics/preview/00/00/09/92/8ee3f425c3_1000.jpg" },
  { keyword: "tea", name: "Чай", price: 70, category: "drink", kind: "hot", count: "300 мл", image: "https://patisson.shop/wp-content/uploads/2019/09/%D0%A7%D0%B0%D0%B9_%D0%B2_%D0%B0%D1%81%D1%81%D0%BE%D1%80%D1%82%D0%B8%D0%BC%D0%B5%D0%BD%D1%82%D0%B5.jpeg" },
  { keyword: "coffee", name: "Американо", price: 100, category: "drink", kind: "hot", count: "300 мл", image: "https://cdn.sae-shop.ru/image/product/additional_images/3001.jpg" },
  { keyword: "cocoa", name: "Какао", price: 90, category: "drink", kind: "hot", count: "300 мл", image: "https://kubnews.ru/upload/dev2fun.imagecompress/webp/resize_cache/iblock/287/1200_800_2/gnd576gz2uyhnqt8b16ek3jfm6rgsz0o.webp" },
];
