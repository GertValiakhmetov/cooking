/* Onboarding — invite redeem → equipment quick-setup → pantry seeding.
   Token is implicitly in the URL (?invite=expired|used drives error views).
   Informal «ты». Calls onComplete({ name, equipment, pantryPath }). */

function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="icon-btn" onClick={onToggle} aria-label="Тема">
      <Icon name={theme === 'light' ? 'moon' : 'sun'} size={22} />
    </button>
  );
}

/* ---- Error views (separate, never dead-end) ---- */
function InviteError({ kind, theme, onToggle }) {
  const copy = kind === 'used'
    ? { title: 'Ссылкой уже воспользовались', text: 'Эта ссылка-приглашение одноразовая и её уже активировали.' }
    : { title: 'Ссылка устарела', text: 'Срок действия этого приглашения истёк.' };
  return (
    <div className="onb-stage">
      <div className="onb">
        <div className="onb-top">
          <span className="onb-back"></span>
          <div className="onb-steps"></div>
          <ThemeToggle theme={theme} onToggle={onToggle} />
        </div>
        <div className="onb-scroll">
          <div className="onb-error">
            <div className="onb-error-ic"><Icon name={kind === 'used' ? 'link-2-off' : 'clock-alert'} size={30} /></div>
            <div className="onb-error-title">{copy.title}</div>
            <div className="onb-error-text">{copy.text}</div>
            <div className="onb-error-hint"><Icon name="message-circle" size={18} />Попроси новую ссылку у того, кто тебя пригласил</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Step 1: Redeem ---- */
function Redeem({ name, setName, onSubmit, theme, onToggle }) {
  return (
    <div className="onb">
      <div className="onb-top">
        <span className="onb-back"></span>
        <div className="onb-steps">
          <span className="onb-step-dot current"></span>
          <span className="onb-step-dot"></span>
          <span className="onb-step-dot"></span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>

      <div className="onb-scroll">
        <div className="onb-body">
          <div className="onb-brand">
            <div className="onb-mark">С</div>
            <div className="onb-appname">Су-шеф</div>
            <div className="onb-tagline">{window.ONB.tagline}</div>
          </div>

          <div className="onb-invitedby">
            <span className="av">М</span>
            Тебя пригласил Миша
          </div>

          <div className="onb-field-group">
            <label className="onb-flabel">Как тебя зовут?</label>
            <input className="field" autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Имя" onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onSubmit(); }} />
          </div>
        </div>
      </div>

      <div className="onb-foot">
        <button className="btn btn--primary" onClick={onSubmit} aria-disabled={!name.trim()}>Войти</button>
        <div className="onb-hint">Без регистрации и паролей — ты уже в списке приглашённых</div>
      </div>
    </div>
  );
}

/* ---- Step 2: Equipment ---- */
function Equipment({ selected, toggle, custom, addCustom, removeCustom, onNext, onBack, theme, onToggle }) {
  const [draft, setDraft] = React.useState('');
  function commit() { const v = draft.trim(); if (v) { addCustom(v); setDraft(''); } }
  const total = selected.length + custom.length;

  return (
    <div className="onb">
      <div className="onb-top">
        <button className="icon-btn onb-back" onClick={onBack} aria-label="Назад"><Icon name="arrow-left" size={22} /></button>
        <div className="onb-steps">
          <span className="onb-step-dot done"></span>
          <span className="onb-step-dot current"></span>
          <span className="onb-step-dot"></span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>

      <div className="onb-scroll">
        <div className="onb-body">
          <div className="onb-head">
            <div className="onb-eyebrow">Шаг 1 из 2</div>
            <div className="onb-title">Что есть на твоей кухне?</div>
            <div className="onb-sub">Отметь технику и посуду — так я буду точнее с рецептами. Можно пропустить и добавить позже.</div>
          </div>

          <div className="eq-grid">
            {window.EQUIPMENT_OPTIONS.map((name) => {
              const on = selected.indexOf(name) !== -1;
              return (
                <button key={name} className={'eq-chip' + (on ? ' on' : '')} onClick={() => toggle(name)} aria-pressed={on}>
                  <span className="eq-check"><Icon name="check" size={15} /></span>
                  <span className="eq-name">{name}</span>
                </button>
              );
            })}
          </div>

          <div className="eq-custom">
            <input className="field" value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder="Своё — например, тажин" onKeyDown={(e) => { if (e.key === 'Enter') commit(); }} />
            <button className="btn btn--secondary add" onClick={commit} aria-label="Добавить своё"><Icon name="plus" size={20} /></button>
          </div>
          {custom.length > 0 && (
            <div className="eq-mine">
              {custom.map((c) => (
                <span className="tag tag--category" key={c}>{c}<button onClick={() => removeCustom(c)} aria-label="Убрать"><Icon name="x" size={14} /></button></span>
              ))}
            </div>
          )}

          <div className="eq-count">{total > 0 ? `Выбрано: ${total}` : 'Ничего не выбрано — это тоже нормально'}</div>
        </div>
      </div>

      <div className="onb-foot">
        <button className="btn btn--primary" onClick={onNext}>Дальше</button>
      </div>
    </div>
  );
}

/* ---- Step 3: Pantry seeding ---- */
function Seeding({ onPath, onBack, theme, onToggle }) {
  return (
    <div className="onb">
      <div className="onb-top">
        <button className="icon-btn onb-back" onClick={onBack} aria-label="Назад"><Icon name="arrow-left" size={22} /></button>
        <div className="onb-steps">
          <span className="onb-step-dot done"></span>
          <span className="onb-step-dot done"></span>
          <span className="onb-step-dot current"></span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>

      <div className="onb-scroll">
        <div className="onb-body">
          <div className="onb-head">
            <div className="onb-eyebrow">Шаг 2 из 2</div>
            <div className="onb-title">Что есть из продуктов?</div>
            <div className="onb-sub">Чтобы я предлагал рецепты из того, что у тебя реально есть. Выбери, как удобнее.</div>
          </div>

          <div className="seed-paths">
            <button className="seed-card seed-card--primary" onClick={() => onPath('chat')}>
              <span className="seed-ic"><Icon name="message-circle" size={26} /></span>
              <span className="seed-body">
                <span className="seed-title">Расскажи ассистенту</span>
                <span className="seed-desc">Просто напиши списком — я разберу и запишу в кладовку сам</span>
              </span>
              <span className="seed-chev"><Icon name="arrow-right" size={20} /></span>
            </button>

            <button className="seed-card seed-card--secondary" onClick={() => onPath('self')}>
              <span className="seed-ic"><Icon name="pencil" size={24} /></span>
              <span className="seed-body">
                <span className="seed-title">Заполню сам</span>
                <span className="seed-desc">Добавить продукты вручную в кладовой</span>
              </span>
              <span className="seed-chev"><Icon name="arrow-right" size={20} /></span>
            </button>
          </div>

          <div className="seed-skip">
            <button onClick={() => onPath('skip')}>Пропустить пока</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Onboarding({ inviteError, theme, onToggleTheme, onComplete }) {
  const [step, setStep] = React.useState('redeem');
  const [name, setName] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [custom, setCustom] = React.useState([]);

  if (inviteError) return <InviteError kind={inviteError} theme={theme} onToggle={onToggleTheme} />;

  function toggle(n) { setSelected((s) => (s.indexOf(n) !== -1 ? s.filter((x) => x !== n) : [...s, n])); }
  function addCustom(n) { if (custom.indexOf(n) === -1 && window.EQUIPMENT_OPTIONS.indexOf(n) === -1) setCustom((c) => [...c, n]); }
  function removeCustom(n) { setCustom((c) => c.filter((x) => x !== n)); }

  function finish(pantryPath) {
    onComplete({ name: name.trim() || 'Шеф', equipment: selected.concat(custom), pantryPath });
  }

  return (
    <div className="onb-stage">
      {step === 'redeem' && (
        <Redeem name={name} setName={setName} onSubmit={() => name.trim() && setStep('equipment')} theme={theme} onToggle={onToggleTheme} />
      )}
      {step === 'equipment' && (
        <Equipment selected={selected} toggle={toggle} custom={custom} addCustom={addCustom} removeCustom={removeCustom}
          onNext={() => setStep('seed')} onBack={() => setStep('redeem')} theme={theme} onToggle={onToggleTheme} />
      )}
      {step === 'seed' && (
        <Seeding onPath={finish} onBack={() => setStep('equipment')} theme={theme} onToggle={onToggleTheme} />
      )}
    </div>
  );
}

window.Onboarding = Onboarding;
