// data.jsx — mock Russian content for the Су-шеф UI kit.

const PANTRY = [
  { id: 'p1', name: 'Куриное бедро', qty: '600 г', cat: 'Мясо', expiry: null },
  { id: 'p2', name: 'Рис басмати', qty: '2 ст.', cat: 'Бакалея', expiry: null },
  { id: 'p3', name: 'Молоко', qty: '1 л', cat: 'Молочное', expiry: 'soon', expiryLabel: '2 дня' },
  { id: 'p4', name: 'Сметана', qty: '200 г', cat: 'Молочное', expiry: 'expired', expiryLabel: 'Просрочено' },
  { id: 'p5', name: 'Лук репчатый', qty: '4 шт.', cat: 'Овощи', expiry: null },
  { id: 'p6', name: 'Чеснок', qty: '1 головка', cat: 'Овощи', expiry: null },
  { id: 'p7', name: 'Помидоры черри', qty: '250 г', cat: 'Овощи', expiry: 'soon', expiryLabel: '3 дня' },
  { id: 'p8', name: 'Оливковое масло', qty: '500 мл', cat: 'Бакалея', expiry: null },
];

const EQUIPMENT = [
  { id: 'e1', name: 'Казан', have: true },
  { id: 'e2', name: 'Сковорода 28 см', have: true },
  { id: 'e3', name: 'Блендер', have: true },
  { id: 'e4', name: 'Кухонные весы', have: false },
];

const RECIPE = {
  id: 'r1',
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
  ],
  steps: [
    { text: 'Нарежьте лук тонкими полукольцами, морковь — соломкой.', timer: null },
    { text: 'Обжарьте лук до золотистого цвета, помешивая.', timer: null },
    { text: 'Добавьте курицу и обжаривайте до румяной корочки.', timer: '08:00' },
    { text: 'Всыпьте рис, залейте кипятком на 2 см выше риса.', timer: null },
    { text: 'Тушите под крышкой на медленном огне до готовности.', timer: '20:00' },
    { text: 'Дайте плову настояться под крышкой перед подачей.', timer: '10:00' },
  ],
  note: 'Можно заменить курицу на баранину. Рис промывайте до прозрачной воды.',
};

const SAVED = [
  { id: 's1', title: 'Плов с курицей', time: '45 мин', missing: 1 },
  { id: 's2', title: 'Паста с томатами и базиликом', time: '25 мин', missing: 0 },
  { id: 's3', title: 'Овощное рагу', time: '40 мин', missing: 3 },
  { id: 's4', title: 'Сырники со сметаной', time: '20 мин', missing: 0 },
];

const CAT_COLORS = {
  'Овощи': 'category', 'Молочное': 'category', 'Мясо': 'category',
  'Бакалея': 'neutral', 'Специи': 'category',
};

Object.assign(window, { PANTRY, EQUIPMENT, RECIPE, SAVED, CAT_COLORS });
