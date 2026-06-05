// recipe.jsx — Timer + RecipeCard.

// Countdown timer button: idle -> running -> paused. Parses "MM:SS".
function TimerButton({ label, size = 'md' }) {
  const parse = (s) => {
    const [m, sec] = s.split(':').map(Number);
    return m * 60 + sec;
  };
  const [secs, setSecs] = React.useState(parse(label));
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const done = secs === 0;
  return (
    <button
      className={'timer-btn' + (running || done ? ' timer-btn--running' : '')}
      onClick={() => setRunning((r) => !r)}
      style={size === 'lg' ? { fontSize: 22, minHeight: 60, padding: '0 24px', gap: 12 } : null}
    >
      <Icon name={done ? 'Check' : running ? 'Pause' : 'Timer'} size={size === 'lg' ? 24 : 18} />
      <span className="time">{mm}:{ss}</span>
    </button>
  );
}

function Stepper({ value, onChange }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
      <Icon name="Users" size={18} color="var(--text-secondary)" />
      <button className="step-btn" onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <span style={{ fontWeight: 600, minWidth: 18, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <button className="step-btn" onClick={() => onChange(value + 1)}>+</button>
    </span>
  );
}

function RecipeCard({ recipe, onCook, onSave, saved }) {
  const [servings, setServings] = React.useState(recipe.servings);
  const missing = recipe.ingredients.filter((i) => !i.have).length;
  return (
    <div className="card recipe-card">
      <div className="rc-head">
        <div className="t-title" style={{ marginBottom: 8 }}>{recipe.title}</div>
        <div className="rc-meta">
          <span className="m"><Icon name="Clock" size={17} />{recipe.time}</span>
          <span className="m"><Icon name="Flame" size={17} />{recipe.difficulty}</span>
          <Stepper value={servings} onChange={setServings} />
        </div>
      </div>
      <div className="rc-body">
        {missing > 0 && (
          <div style={{ marginBottom: 4 }}>
            <span className="tag tag--missing">Не хватает {missing}</span>
          </div>
        )}
        {recipe.ingredients.map((ing, i) => (
          <div className={'ing' + (ing.have ? '' : ' missing')} key={i}>
            <span className="mark" style={{ color: ing.have ? 'var(--success)' : 'var(--warning)' }}>
              <Icon name={ing.have ? 'Check' : 'Plus'} size={20} />
            </span>
            {ing.name}
            <span className="qty">{ing.qty}</span>
          </div>
        ))}
        <div className="rc-divider" />
        {recipe.steps.slice(0, 2).map((st, i) => (
          <div className="step" key={i}>
            <span className="num">{i + 1}</span>
            <div className="txt">
              {st.text}
              {st.timer && <div style={{ marginTop: 8 }}><TimerButton label={st.timer} /></div>}
            </div>
          </div>
        ))}
        <button className="btn btn--ghost" onClick={onCook} style={{ alignSelf: 'flex-start', paddingLeft: 8 }}>
          Открыть режим готовки <Icon name="ArrowRight" size={18} />
        </button>
      </div>
      <div className="rc-actions">
        <button className="btn btn--primary" style={{ flex: 1 }} onClick={onSave}>
          <Icon name={saved ? 'Check' : 'Bookmark'} size={18} />{saved ? 'Сохранено' : 'Сохранить'}
        </button>
        <button className="btn btn--destructive"><Icon name="Trash2" size={18} /></button>
      </div>
    </div>
  );
}

Object.assign(window, { TimerButton, Stepper, RecipeCard });
