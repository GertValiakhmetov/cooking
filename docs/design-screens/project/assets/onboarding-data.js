/* Onboarding data — invite redemption + first-run setup. Russian, «ты» voice. */

/* Equipment quick-setup chips (pre-select nothing). */
window.EQUIPMENT_OPTIONS = [
  'Духовка', 'Плита', 'Микроволновка', 'Аэрогриль', 'Блендер', 'Миксер',
  'Мультиварка', 'Гриль-сковорода', 'Казан', 'Пароварка', 'Тостер', 'Кофемолка',
];

/* map a chosen equipment name to a Техника-tab type */
window.equipType = function (name) {
  const posuda = ['Гриль-сковорода', 'Казан', 'Пароварка'];
  const builtin = ['Духовка', 'Плита'];
  if (builtin.indexOf(name) !== -1) return 'Встроенная';
  if (posuda.indexOf(name) !== -1) return 'Посуда';
  return 'Техника';
};

/* The casual message the user "sends" in the chat-seeding demo, and the items
   the assistant parses out of it (shown in the confirmation card + written to
   the pantry's Продукты tab). */
window.ONB = {
  tagline: 'Твой кухонный ассистент. Подскажет, что приготовить из того, что есть — и проведёт по шагам.',
  assistantPrompt: 'Привет! Я Су-шеф. Расскажи, что у тебя есть из продуктов, — я всё запишу в кладовку. Можно просто списком, как удобно.',
  userExample: 'Есть макароны, банка томатов, сыр грамм 200, пара луковиц и оливковое масло',
  pantryDonePhrase: 'Готово, записал. Вот что добавил в кладовку:',
  pantryGeneric: 'Записал. Если что-то ещё вспомнишь — просто напиши, я допишу в кладовку.',
};

window.TOOLCALL_PANTRY = { running: 'Записываю в кладовку…', done: 'Записал в кладовку' };

/* Parsed pantry items (with categories so they slot into the Продукты groups). */
window.PANTRY_PARSE = [
  { id: 'op1', name: 'Макароны',        amount: 400,  unit: 'г',     cat: 'Бакалея',  state: 'ok' },
  { id: 'op2', name: 'Томаты в банке',  amount: 1,    unit: 'банка', cat: 'Бакалея',  state: 'ok' },
  { id: 'op3', name: 'Сыр',             amount: 200,  unit: 'г',     cat: 'Молочное', state: 'ok' },
  { id: 'op4', name: 'Лук репчатый',    amount: 2,    unit: 'шт.',   cat: 'Овощи',    state: 'ok' },
  { id: 'op5', name: 'Оливковое масло', amount: null, unit: '',      cat: 'Бакалея',  state: 'ok' },
];
