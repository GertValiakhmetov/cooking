/* CookingMode — full-screen recipe step, readable from ~1 m. Timer countdown. */
function fmt(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function CookTimer({ seconds }) {
  const [left, setLeft] = React.useState(seconds);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => { setLeft(seconds); setRunning(false); }, [seconds]);
  React.useEffect(() => {
    if (!running) return;
    if (left <= 0) { setRunning(false); return; }
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running, left]);
  return (
    <button
      className={'timer-btn cook-timer' + (running ? ' timer-btn--running' : '')}
      onClick={() => setRunning((r) => !r)}
    >
      <Icon name={running ? 'pause' : 'timer'} size={26} />
      <span className="time">{fmt(left)}</span>
    </button>
  );
}

function CookingMode({ onExit }) {
  const r = window.RECIPE;
  const [i, setI] = React.useState(0);
  const step = r.steps[i];
  const last = r.steps.length - 1;

  return (
    <div className="cooking">
      <header className="cook-top">
        <button className="icon-btn" onClick={onExit}><Icon name="x" size={26} color="var(--text-primary)" /></button>
        <span className="cook-title">{r.title}</span>
        <span className="cook-count">{i + 1} / {r.steps.length}</span>
      </header>

      <div className="cook-progress"><span style={{ width: `${((i + 1) / r.steps.length) * 100}%` }}></span></div>

      <div className="cook-body">
        <div className="cook-stepnum">Шаг {i + 1}</div>
        <div className="t-cooking cook-text">{step.text}</div>
        {step.timer && <CookTimer seconds={step.timer} />}
      </div>

      <div className="cook-nav">
        <button className="btn btn--secondary" disabled={i === 0} onClick={() => setI((x) => x - 1)}>
          <Icon name="chevron-left" size={22} />Назад
        </button>
        {i < last ? (
          <button className="btn btn--primary" style={{ flex: 1 }} onClick={() => setI((x) => x + 1)}>
            Далее<Icon name="chevron-right" size={22} />
          </button>
        ) : (
          <button className="btn btn--primary" style={{ flex: 1 }} onClick={onExit}>
            <Icon name="check" size={22} />Готово
          </button>
        )}
      </div>
    </div>
  );
}

window.CookingMode = CookingMode;
