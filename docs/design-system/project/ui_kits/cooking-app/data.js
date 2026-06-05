/* Mock data for the Су-шеф UI kit. Russian product strings. */
window.PANTRY = [
  { id: 1, name: 'Куриное бедро', qty: '600 г', cat: 'Мясо', state: 'ok' },
  { id: 2, name: 'Рис басмати', qty: '2 ст.', cat: 'Бакалея', state: 'ok' },
  { id: 3, name: 'Молоко', qty: '1 л', cat: 'Молочное', state: 'soon', exp: '2 дня' },
  { id: 4, name: 'Яйца', qty: '10 шт.', cat: 'Молочное', state: 'ok' },
  { id: 5, name: 'Лук репчатый', qty: '4 шт.', cat: 'Овощи', state: 'ok' },
  { id: 6, name: 'Сметана', qty: '200 г', cat: 'Молочное', state: 'expired' },
  { id: 7, name: 'Чеснок', qty: '1 головка', cat: 'Овощи', state: 'soon', exp: '4 дня' },
  { id: 8, name: 'Оливковое масло', qty: '500 мл', cat: 'Бакалея', state: 'ok' },
];

window.EQUIPMENT = [
  { id: 1, name: 'Казан', cat: 'Посуда' },
  { id: 2, name: 'Сковорода 28 см', cat: 'Посуда' },
  { id: 3, name: 'Блендер', cat: 'Техника' },
  { id: 4, name: 'Духовка', cat: 'Техника' },
];

window.RECIPE = {
  title: 'Плов с курицей',
  time: '45 мин',
  difficulty: 'Средне',
  servings: 4,
  ingredients: [
    { name: 'Куриное бедро', qty: '600 г', have: true },
    { name: 'Рис басмати', qty: '2 ст.', have: true },
    { name: 'Морковь', qty: '2 шт.', have: false },
    { name: 'Лук репчатый', qty: '2 шт.', have: true },
    { name: 'Чеснок', qty: '1 головка', have: true },
    { name: 'Зира', qty: '1 ч.л.', have: false },
  ],
  steps: [
    { text: 'Нарежьте лук полукольцами, морковь — крупной соломкой.', timer: null },
    { text: 'Разогрейте масло в казане и обжарьте лук до золотистого цвета, помешивая.', timer: null },
    { text: 'Добавьте курицу и обжаривайте до румяной корочки со всех сторон.', timer: 420 },
    { text: 'Всыпьте морковь и зиру, готовьте ещё 5 минут.', timer: 300 },
    { text: 'Выложите промытый рис ровным слоем, залейте кипятком на 2 см выше риса.', timer: null },
    { text: 'Накройте крышкой и тушите на медленном огне до готовности.', timer: 1200 },
  ],
};

window.SAVED = [
  { title: 'Плов с курицей', time: '45 мин', missing: 2 },
  { title: 'Омлет с зеленью', time: '10 мин', missing: 0 },
  { title: 'Паста карбонара', time: '20 мин', missing: 3 },
  { title: 'Сырники', time: '25 мин', missing: 1 },
];

window.CHAT_SEED = [
  { from: 'user', text: 'Что приготовить из курицы и риса на ужин?' },
  { from: 'assistant', text: 'Давайте сделаем плов с курицей — это как раз под то, что у вас есть. Сначала проверю кладовую.' },
  { from: 'tool', text: 'Проверяю кладовую…', done: 'Нашёл 4 из 6 ингредиентов' },
  { from: 'assistant', text: 'Почти всё есть! Не хватает моркови и зиры. Вот рецепт — можно начать прямо сейчас.' },
  { from: 'recipe' },
];
