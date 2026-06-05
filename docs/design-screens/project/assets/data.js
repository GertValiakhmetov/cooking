/* Mock data for the Су-шеф Chat screen. Russian product strings.
   Quantities are stored as {amount, unit} so the servings stepper can rescale. */

window.RECIPE = {
  title: 'Паста с курицей в сливочном соусе',
  time: '25 мин',
  difficulty: 'Просто',
  servings: 2,           // base servings the amounts below are written for
  ingredients: [
    { name: 'Спагетти',          amount: 350,  unit: 'г',      have: true },
    { name: 'Куриное филе',      amount: 400,  unit: 'г',      have: true },
    { name: 'Сливки 20%',        amount: 200,  unit: 'мл',     have: false },
    { name: 'Пармезан',          amount: 60,   unit: 'г',      have: false },
    { name: 'Чеснок',            amount: 2,    unit: 'зубч.',  have: true },
    { name: 'Лук репчатый',      amount: 1,    unit: 'шт.',    have: true },
    { name: 'Оливковое масло',   amount: 2,    unit: 'ст.л.',  have: true },
    { name: 'Соль, перец',       amount: null, unit: '',       have: true },
  ],
  steps: [
    { title: 'Отвари пасту',        text: 'Отвари спагетти в подсоленной воде до состояния аль денте, затем откинь на дуршлаг.', timer: 480 },
    { title: 'Обжарь курицу',       text: 'Нарежь куриное филе кубиками и обжарь на оливковом масле до золотистой корочки.', timer: null },
    { title: 'Добавь лук и чеснок', text: 'Добавь измельчённые лук и чеснок, готовь до мягкости лука.', timer: null },
    { title: 'Влей сливки',         text: 'Влей сливки, доведи до лёгкого кипения и туши, пока соус не загустеет.', timer: 300 },
    { title: 'Собери блюдо',        text: 'Смешай пасту с соусом, добавь тёртый пармезан и сразу подавай.', timer: null },
  ],
  notes: [
    'Аль денте — паста должна слегка пружинить при укусе. Не переваривай.',
    'Нет сливок? Возьми 10%-е молоко и ложку сметаны — соус всё равно получится.',
  ],
};

/* Feed starts with one existing exchange (1 user + 1 assistant). */
window.CHAT_SEED = [
  { from: 'user', text: 'Привет! Не знаю, что приготовить на ужин. Есть курица, паста и немного овощей.' },
  { from: 'assistant', text: 'Привет! Давайте придумаем что-нибудь из этого. Напишите, что ещё есть под рукой, или просто попросите идею — я загляну в вашу кладовку.' },
];

/* Past conversations for the burger drawer. */
window.CONVERSATIONS = [
  { id: 'c1', title: 'Ужин из того, что есть', preview: 'Паста с курицей в сливочном…', time: 'Сейчас' },
  { id: 'c2', title: 'Что приготовить из фарша?', preview: 'Тефтели в томатном соусе', time: 'Вчера' },
  { id: 'c3', title: 'Быстрый завтрак на двоих', preview: 'Омлет с сыром и зеленью', time: 'Пн' },
  { id: 'c4', title: 'Ужин для гостей', preview: 'Запечённая курица с овощами', time: '2 нояб.' },
];

/* Canned, scripted assistant replies (streamed word-by-word). */
window.SCRIPT = {
  // first send → 3 dinner options
  options: 'Из того, что есть, на ужин подойдут три варианта. Первый — паста с курицей в сливочном соусе, готова за 25 минут. Второй — куриное филе с рисом и овощами. Третий — лёгкий омлет с курицей и зеленью. Что приготовим?',
  // second send → short phrase, then the recipe card pops in
  beforeRecipe: 'Отличный выбор! Вот рецепт пасты с курицей — как раз на две порции.',
  // any further send → gentle generic reply
  generic: 'Посмотрите рецепт выше или напишите, какие продукты добавить, — подберу другой вариант.',
};

/* Tool-call copy. */
window.TOOLCALL = {
  running: 'Проверяю твою кладовку…',
  done: 'Кладовка проверена — почти всё есть',
};
