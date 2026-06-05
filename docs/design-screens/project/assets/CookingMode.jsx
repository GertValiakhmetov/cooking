/* CookingMode — the at-the-stove screen. One step per view, readable from ~1 m.
   - persistent per-step timers (keep running across steps; floating chips jump back)
   - giant left/right tap zones switch steps; buttons are the visible affordance
   - keep-awake toggle (real wake-lock when available), ingredients pull-up drawer
   - confirm before leaving while a timer runs; arrow keys + Esc on desktop. Informal «ты». */

function cookFmt(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + ':' + String(r).padStart(2, '0');
}

function CookingMode({ recipe, mode, onClose, onDone }) {
  const steps = recipe.steps;
  const last = steps.length - 1;

  const [idx, setIdx] = React.useState(0);
  const [ingOpen, setIngOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [awake, setAwake] = React.useState(false);
  const wakeRef = React.useRef(null);

  // per-step timer state, keyed by step index (only steps that have a timer)
  const [timers, setTimers] = React.useState(() => {
    const o = {};
    steps.forEach((s, i) => { if (s.timer) o[i] = { total: s.timer, left: s.timer, running: false, done: false }; });
    return o;
  });

  const anyRunning = Object.values(timers).some((t) => t.running && !t.done);

  // single ticking loop for all running timers
  React.useEffect(() => {
    if (!anyRunning) return;
    const id = setInterval(() => {
      setTimers((prev) => {
        let changed = false;
        const next = {};
        for (const k in prev) {
          const t = prev[k];
          if (t.running && !t.done) {
            const left = t.left - 1;
            changed = true;
            if (left <= 0) {
              next[k] = { ...t, left: 0, running: false, done: true };
              if (navigator.vibrate) { try { navigator.vibrate([220, 120, 220]); } catch (e) {} }
            } else {
              next[k] = { ...t, left };
            }
          } else next[k] = t;
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [anyRunning]);

  // wake-lock cleanup
  React.useEffect(() => () => { if (wakeRef.current) { try { wakeRef.current.release(); } catch (e) {} } }, []);
  // re-acquire wake-lock if the page is hidden then shown again
  React.useEffect(() => {
    if (!awake) return;
    const onVis = async () => {
      if (document.visibilityState === 'visible' && !wakeRef.current && navigator.wakeLock) {
        try { wakeRef.current = await navigator.wakeLock.request('screen'); } catch (e) {}
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [awake]);

  function go(delta) {
    setIdx((i) => Math.max(0, Math.min(last, i + delta)));
  }
  function next() { if (idx === last) onDone(); else go(1); }

  function toggleTimer() {
    setTimers((prev) => {
      const t = prev[idx];
      if (!t) return prev;
      if (t.done) return { ...prev, [idx]: { ...t, left: t.total, running: false, done: false } }; // tap to dismiss/reset
      return { ...prev, [idx]: { ...t, running: !t.running } };
    });
  }

  async function toggleAwake() {
    if (!awake) {
      if (navigator.wakeLock) { try { wakeRef.current = await navigator.wakeLock.request('screen'); } catch (e) {} }
      setAwake(true);
    } else {
      if (wakeRef.current) { try { wakeRef.current.release(); } catch (e) {} wakeRef.current = null; }
      setAwake(false);
    }
  }

  function attemptClose() { if (anyRunning) setConfirm(true); else onClose(); }

  // keyboard (desktop): ←/→ navigate, Esc closes
  React.useEffect(() => {
    const onKey = (e) => {
      if (confirm) { if (e.key === 'Escape') setConfirm(false); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'Escape') { e.preventDefault(); attemptClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, confirm, anyRunning]);

  const step = steps[idx];
  const timer = timers[idx];
  const offscreenTimers = Object.keys(timers)
    .map(Number)
    .filter((i) => i !== idx && (timers[i].running || timers[i].done));

  const timerCls = 'cook-timer' + (timer ? (timer.done ? ' cook-timer--alarm' : timer.running ? ' cook-timer--running' : '') : '');

  return (
    <div className="cook-overlay">
      <div className="cooking">
        {/* top: close · progress · keep-awake */}
        <div className="cook-top">
          <button className="icon-btn" onClick={attemptClose} aria-label="Закрыть"><Icon name="x" size={24} /></button>
          <div className="cook-progress">
            <span className="cook-count">Шаг {idx + 1} из {steps.length}</span>
            <div className="cook-dots">
              {steps.map((s, i) => (
                <span
                  key={i}
                  className={'cook-dot' + (s.timer ? ' has-timer' : '') + (i === idx ? ' current' : i < idx ? ' done' : '') + (timers[i] && timers[i].done ? ' done' : '')}
                ></span>
              ))}
            </div>
          </div>
          <button className={'cook-awake' + (awake ? ' on' : '')} onClick={toggleAwake} aria-pressed={awake}>
            <Icon name={awake ? 'lightbulb' : 'lightbulb-off'} size={18} />
            <span className="lbl">Не гаснуть</span>
          </button>
        </div>

        {/* floating chips for timers running on other steps */}
        {offscreenTimers.length > 0 && (
          <div className="cook-chips">
            {offscreenTimers.map((i) => (
              <button key={i} className={'cook-chip' + (timers[i].done ? ' alarm' : '')} onClick={() => setIdx(i)}>
                <span className="chip-ic"><Icon name={timers[i].done ? 'bell-ring' : 'timer'} size={16} /></span>
                Шаг {i + 1} · {timers[i].done ? 'Готово' : cookFmt(timers[i].left)}
              </button>
            ))}
          </div>
        )}

        {/* body: hero step + tap zones */}
        <div className="cook-body">
          <button className="cook-tap left" onClick={() => go(-1)} disabled={idx === 0} aria-label="Предыдущий шаг"></button>
          <button className="cook-tap right" onClick={next} aria-label="Следующий шаг"></button>

          <div className="cook-content">
            <div className="cook-stepnum">Шаг {idx + 1}</div>
            {step.title && <div className="cook-steptitle">{step.title}</div>}
            <div className="cook-text">{step.text}</div>

            {timer && (
              <button className={timerCls} onClick={toggleTimer}>
                <Icon name={timer.done ? 'bell-ring' : timer.running ? 'pause' : 'timer'} size={26} />
                <span className="time">{timer.done ? 'Готово' : cookFmt(timer.left)}</span>
                <span className="t-hint">
                  {timer.done ? 'Нажми, чтобы сбросить' : timer.running ? 'Идёт' : timer.left === timer.total ? 'Запустить' : 'Продолжить'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ingredients pull-up drawer */}
        <div className="cook-ing" data-open={ingOpen}>
          <button className="cook-ing-handle" onClick={() => setIngOpen((o) => !o)} aria-expanded={ingOpen}>
            <span className="cook-ing-grip"></span>
            <span className="cook-ing-label">
              Ингредиенты
              <span className="cook-ing-chev"><Icon name="chevron-up" size={16} /></span>
            </span>
          </button>
          <div className="cook-ing-list">
            <div className="cook-ing-inner">
              {recipe.ingredients.map((ing, i) => (
                <div className={'ing' + (ing.have ? '' : ' missing')} key={i}>
                  <span className="mark" style={{ color: ing.have ? 'var(--success)' : 'var(--warning)' }}>
                    <Icon name={ing.have ? 'check' : 'x'} size={20} />
                  </span>
                  {ing.name}
                  <span className="qty">{ing.amount == null ? 'по вкусу' : ing.amount + (ing.unit ? ' ' + ing.unit : '')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom nav */}
        <div className="cook-nav">
          <button className="btn btn--secondary" onClick={() => go(-1)} disabled={idx === 0}>
            <Icon name="arrow-left" size={20} />Назад
          </button>
          {idx === last ? (
            <button className="btn btn--primary btn--done" onClick={onDone}>
              <Icon name="party-popper" size={20} />Готово
            </button>
          ) : (
            <button className="btn btn--primary" onClick={next}>
              Дальше<Icon name="arrow-right" size={20} />
            </button>
          )}
        </div>

        {/* confirm leave while timer running */}
        {confirm && (
          <div className="cook-confirm-scrim" onClick={() => setConfirm(false)}>
            <div className="cook-confirm" onClick={(e) => e.stopPropagation()}>
              <div className="cook-confirm-title">Таймер ещё идёт</div>
              <div className="cook-confirm-text">Если выйдешь, отсчёт сбросится. Точно закрыть режим готовки?</div>
              <div className="cook-confirm-actions">
                <button className="btn btn--secondary" onClick={() => setConfirm(false)}>Остаться</button>
                <button className="btn btn--primary" onClick={() => { setConfirm(false); onClose(); }}>Выйти</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.CookingMode = CookingMode;
