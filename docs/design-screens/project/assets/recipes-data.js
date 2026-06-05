/* Extra mock data for the Pantry + Recipes screens.
   Loaded after data.js (which defines window.RECIPE — the chicken pasta).
   All product strings Russian, «ты» voice in steps to match the rest. */

/* ---- promote the chat's pasta recipe to a full saveable record ---- */
window.RECIPE.id = 'pasta';
window.RECIPE.match = 'pantry'; // missing computed from ingredients

/* ---- four more full recipes (ingredients + steps so detail + cooking work) ---- */
window.RECIPES_EXTRA = [
  {
    id: 'omelet',
    title: 'Омлет с сыром и зеленью',
    time: '10 мин', difficulty: 'Просто', servings: 2,
    ingredients: [
      { name: 'Яйца',             amount: 4,  unit: 'шт.',  have: true },
      { name: 'Молоко',           amount: 50, unit: 'мл',   have: true },
      { name: 'Сыр',              amount: 60, unit: 'г',    have: true },
      { name: 'Зелень',           amount: 10, unit: 'г',    have: true },
      { name: 'Сливочное масло',  amount: 10, unit: 'г',    have: true },
      { name: 'Соль',             amount: null, unit: '',   have: true },
    ],
    steps: [
      { title: 'Взбей яйца',     text: 'Взбей яйца с молоком и щепоткой соли до однородности.', timer: null },
      { title: 'Обжарь',         text: 'Растопи масло на сковороде, вылей яйца и готовь на среднем огне.', timer: 180 },
      { title: 'Добавь начинку', text: 'Посыпь тёртым сыром и зеленью, сложи омлет пополам и подавай.', timer: null },
    ],
    notes: ['Не перегревай сковороду — омлет должен остаться нежным.'],
  },
  {
    id: 'meatballs',
    title: 'Тефтели в томатном соусе',
    time: '45 мин', difficulty: 'Средне', servings: 4,
    ingredients: [
      { name: 'Фарш говяжий',    amount: 500, unit: 'г',    have: true },
      { name: 'Рис',             amount: 50,  unit: 'г',    have: true },
      { name: 'Лук репчатый',    amount: 1,   unit: 'шт.',  have: true },
      { name: 'Яйцо',            amount: 1,   unit: 'шт.',  have: true },
      { name: 'Томатная паста',  amount: 3,   unit: 'ст.л.', have: false },
      { name: 'Морковь',         amount: 1,   unit: 'шт.',  have: false },
      { name: 'Соль, перец',     amount: null, unit: '',    have: true },
    ],
    steps: [
      { title: 'Смешай фарш',       text: 'Смешай фарш с отваренным рисом, тёртым луком и яйцом, посоли.', timer: null },
      { title: 'Сформируй тефтели', text: 'Скатай небольшие шарики и обжарь до корочки со всех сторон.', timer: 360 },
      { title: 'Сделай соус',       text: 'Спассеруй морковь, добавь томатную пасту и стакан воды.', timer: null },
      { title: 'Туши',              text: 'Залей тефтели соусом и туши под крышкой до готовности.', timer: 1200 },
    ],
    notes: ['Нет томатной пасты? Возьми протёртые помидоры.'],
  },
  {
    id: 'soup',
    title: 'Куриный суп с лапшой',
    time: '50 мин', difficulty: 'Просто', servings: 4,
    ingredients: [
      { name: 'Куриное филе', amount: 400, unit: 'г',   have: true },
      { name: 'Лапша',        amount: 150, unit: 'г',   have: true },
      { name: 'Картофель',    amount: 3,   unit: 'шт.', have: true },
      { name: 'Морковь',      amount: 1,   unit: 'шт.', have: true },
      { name: 'Лук репчатый', amount: 1,   unit: 'шт.', have: true },
      { name: 'Соль, зелень', amount: null, unit: '',   have: true },
    ],
    steps: [
      { title: 'Свари бульон', text: 'Отвари курицу с луком до готовности, посоли бульон.', timer: 1500 },
      { title: 'Добавь овощи', text: 'Достань курицу, заложи картофель и морковь, вари 15 минут.', timer: 900 },
      { title: 'Заложи лапшу', text: 'Верни нарезанную курицу, всыпь лапшу и вари до мягкости.', timer: 420 },
      { title: 'Подавай',      text: 'Сними с огня, добавь зелень и дай настояться.', timer: null },
    ],
    notes: ['Лапшу клади в самом конце — иначе разварится.'],
  },
  {
    id: 'ratatouille',
    title: 'Овощное рагу',
    time: '35 мин', difficulty: 'Просто', servings: 3,
    ingredients: [
      { name: 'Кабачок',          amount: 1, unit: 'шт.',   have: true },
      { name: 'Баклажан',         amount: 1, unit: 'шт.',   have: false },
      { name: 'Перец болгарский', amount: 1, unit: 'шт.',   have: true },
      { name: 'Помидоры',         amount: 3, unit: 'шт.',   have: true },
      { name: 'Лук репчатый',     amount: 1, unit: 'шт.',   have: true },
      { name: 'Чеснок',           amount: 2, unit: 'зубч.', have: true },
      { name: 'Оливковое масло',  amount: null, unit: '',   have: true },
    ],
    steps: [
      { title: 'Нарежь овощи',  text: 'Нарежь все овощи крупными кубиками.', timer: null },
      { title: 'Обжарь основу', text: 'Спассеруй лук и чеснок на оливковом масле.', timer: null },
      { title: 'Туши',          text: 'Добавь остальные овощи и туши под крышкой до мягкости.', timer: 1200 },
      { title: 'Заправь',       text: 'Посоли, поперчи, посыпь зеленью и подавай.', timer: null },
    ],
    notes: ['Рагу вкуснее на следующий день.'],
  },
];

/* All recipes available in the app (pasta first). */
window.ALL_RECIPES = [window.RECIPE].concat(window.RECIPES_EXTRA);

/* Saved-recipes seed for the Рецепты screen. Pasta is intentionally NOT here —
   it gets added when you tap "Сохранить рецепт" in chat, so the end-to-end
   walkthrough (chat → save → appears here) is demonstrable. Recent first. */
window.SAVED_SEED = ['omelet', 'soup', 'meatballs', 'ratatouille'];

/* ---- Pantry: products (grouped by category) ---- */
window.PANTRY_PRODUCTS = [
  { id: 'p1',  name: 'Куриное филе',    amount: 600, unit: 'г',       cat: 'Мясо',     state: 'ok' },
  { id: 'p2',  name: 'Спагетти',        amount: 500, unit: 'г',       cat: 'Бакалея',  state: 'ok' },
  { id: 'p3',  name: 'Оливковое масло', amount: 500, unit: 'мл',      cat: 'Бакалея',  state: 'ok' },
  { id: 'p4',  name: 'Молоко',          amount: 1,   unit: 'л',       cat: 'Молочное', state: 'soon', exp: '2 дня' },
  { id: 'p5',  name: 'Яйца',            amount: 10,  unit: 'шт.',     cat: 'Молочное', state: 'ok' },
  { id: 'p6',  name: 'Сливки 20%',      amount: 200, unit: 'мл',      cat: 'Молочное', state: 'expired' },
  { id: 'p7',  name: 'Пармезан',        amount: 150, unit: 'г',       cat: 'Молочное', state: 'ok' },
  { id: 'p8',  name: 'Лук репчатый',    amount: 4,   unit: 'шт.',     cat: 'Овощи',    state: 'ok' },
  { id: 'p9',  name: 'Чеснок',          amount: 1,   unit: 'головка', cat: 'Овощи',    state: 'soon', exp: '4 дня' },
  { id: 'p10', name: 'Помидоры',        amount: 5,   unit: 'шт.',     cat: 'Овощи',    state: 'ok' },
  { id: 'p11', name: 'Соль',            amount: 1,   unit: 'кг',      cat: 'Специи',   state: 'ok' },
  { id: 'p12', name: 'Чёрный перец',    amount: 50,  unit: 'г',       cat: 'Специи',   state: 'ok' },
];

/* category display order */
window.PANTRY_CATEGORIES = ['Мясо', 'Овощи', 'Молочное', 'Бакалея', 'Специи', 'Фрукты', 'Заморозка', 'Другое'];
/* units offered in the add form */
window.PANTRY_UNITS = ['г', 'кг', 'мл', 'л', 'шт.', 'головка', 'ст.л.', 'ч.л.'];

/* ---- Pantry: appliances / equipment ---- */
window.PANTRY_APPLIANCES = [
  { id: 'a1', name: 'Духовка',                  type: 'Встроенная' },
  { id: 'a2', name: 'Чугунная сковорода 26 см', type: 'Посуда' },
  { id: 'a3', name: 'Аэрогриль',                type: 'Техника' },
  { id: 'a4', name: 'Блендер',                  type: 'Техника' },
  { id: 'a5', name: 'Казан',                    type: 'Посуда' },
  { id: 'a6', name: 'Венчик',                   type: 'Инвентарь' },
];
window.APPLIANCE_TYPES = ['Техника', 'Посуда', 'Инвентарь', 'Встроенная', 'Другое'];

/* helper: missing-ingredient count for a recipe */
window.recipeMissing = (r) => (r.ingredients || []).filter((i) => !i.have).length;
