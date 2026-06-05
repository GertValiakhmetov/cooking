/* RecipeCard — inline in the chat feed.
   Servings stepper rescales ingredient amounts; two steps have live-countdown timers;
   "Сохранить рецепт" raises a toast. "Готовить" is a stub for the next screen. */

function fmtClock(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + ':' + String(r).padStart(2, '0');
}

/* Scale a base amount by servings ratio and format it the Russian way (comma decimals). */
function scaleAmount(amount, unit, ratio) {
  if (amount == null) return 'по вкусу';
  const v = amount * ratio;
  let out;
  if (unit === 'г' || unit === 'мл') {
    // round grams/ml to a tidy step
    out = v >= 100 ? Math.round(v / 10) * 10 : Math.round(v);
  } else {
    // counts / spoons — allow halves
    out = Math.round(v * 2) / 2;
  }
  const str = Number.isInteger(out) ? String(out) : String(out).replace('.', ',');
  return unit ? str + ' ' + unit : str;
}

function Stepper({ value, onChange, min = 1, max = 12 }) {
  return (
    <span className="stepper">
      <Icon name="users" size={18} color="var(--text-secondary)" />
      <button aria-label="Меньше порций" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <span className="n">{value}</span>
      <button aria-label="Больше порций" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </span>
  );
}

function IngredientRow({ ing, ratio }) {
  return (
    <div className={'ing' + (ing.have ? '' : ' missing')}>
      <span className="mark" style={{ color: ing.have ? 'var(--success)' : 'var(--warning)' }}>
        <Icon name={ing.have ? 'check' : 'x'} size={20} />
      </span>
      {ing.name}
      <span className="qty">{scaleAmount(ing.amount, ing.unit, ratio)}</span>
    </div>
  );
}

/* Live countdown attached to a step. Tap to start/pause; hits 0 → "Готово". */
function StepTimer({ seconds }) {
  const [left, setLeft] = React.useState(seconds);
  const [running, setRunning] = React.useState(false);
  const done = left <= 0;

  React.useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running, done]);

  React.useEffect(() => { if (done) setRunning(false); }, [done]);

  const cls = 'step-timer' + (done ? ' step-timer--done' : running ? ' step-timer--running' : '');
  return (
    <button
      className={cls}
      onClick={() => { if (done) { setLeft(seconds); } else { setRunning((r) => !r); } }}
    >
      <Icon name={done ? 'check' : running ? 'pause' : 'timer'} size={18} />
      <span className="time">{done ? 'Готово' : fmtClock(left)}</span>
    </button>
  );
}

function RecipeCard({ recipe, onCook, onSave, onDelete }) {
  const r = recipe || window.RECIPE;
  const [servings, setServings] = React.useState(r.servings);
  const ratio = servings / r.servings;
  const missing = r.ingredients.filter((i) => !i.have).length;

  return (
    <div className="card rc rc-enter">
      <div className="rc-head">
        <div className="rc-title">{r.title}</div>
        <div className="rc-meta">
          <span className="row"><Icon name="clock" size={16} />{r.time}</span>
          <span className="row"><Icon name="flame" size={16} />{r.difficulty}</span>
          <Stepper value={servings} onChange={setServings} />
        </div>
      </div>

      <div className="rc-body">
        <div className="rc-col rc-col--ing">
          <div className="rc-section-label">
            Ингредиенты
            {missing > 0 && <Badge kind="missing">Не хватает {missing}</Badge>}
          </div>
          {r.ingredients.map((ing, i) => <IngredientRow key={i} ing={ing} ratio={ratio} />)}
        </div>

        <div className="rc-col rc-col--steps">
          <div className="rc-section-label">Приготовление</div>
          <div className="steps">
            {r.steps.map((s, i) => (
              <div className="step" key={i}>
                <span className="step-n">{i + 1}</span>
                <div className="step-main">
                  <div className="step-text">{s.text}</div>
                  {s.timer && <StepTimer seconds={s.timer} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {r.notes && r.notes.length > 0 && (
          <div className="rc-notes">
            <div className="rc-section-label">Заметки</div>
            <div className="notes">
              {r.notes.map((n, i) => (
                <div className="note" key={i}>
                  <span className="note-ic"><Icon name="lightbulb" size={16} /></span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rc-actions">
        {onDelete ? (
          <button className="btn btn--destructive" onClick={onDelete}>
            <Icon name="trash-2" size={18} />Удалить
          </button>
        ) : (
          <button className="btn btn--secondary" onClick={onSave}>
            <Icon name="bookmark" size={18} />Сохранить рецепт
          </button>
        )}
        <button className="btn btn--primary" onClick={onCook}>
          <Icon name="chef-hat" size={18} />Готовить
        </button>
      </div>
    </div>
  );
}

window.RecipeCard = RecipeCard;
