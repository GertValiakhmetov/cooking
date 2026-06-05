/* App shell — adaptive across three breakpoints:
   <768 mobile (top bar + burger drawer + bottom nav),
   768–1023 icon rail, ≥1024 persistent sidebar. Same screen, restructured. */

const NAV = [
  { id: 'chat', icon: 'message-circle', label: 'Чат' },
  { id: 'pantry', icon: 'refrigerator', label: 'Кладовая' },
  { id: 'recipes', icon: 'book-open', label: 'Рецепты' },
];

function useMode() {
  const get = () => {
    // verification override: ?mode=desktop|rail|mobile
    const forced = new URLSearchParams(location.search).get('mode');
    if (forced) return forced;
    const w = window.innerWidth;
    if (w >= 1024) return 'desktop';
    if (w >= 768) return 'rail';
    return 'mobile';
  };
  const [mode, setMode] = React.useState(get);
  React.useEffect(() => {
    const on = () => setMode(get());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return mode;
}

/* ---- Desktop sidebar conversation row (title + hover rename/delete) ---- */
function ConvRow({ c, active, editing, onSelect, onStartEdit, onCommit, onDelete }) {
  const [val, setVal] = React.useState(c.title);
  React.useEffect(() => { setVal(c.title); }, [c.title, editing]);

  if (editing) {
    return (
      <div className="conv conv--editing">
        <span className="conv-ic"><Icon name="message-circle" size={18} /></span>
        <input
          className="conv-edit"
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onCommit(val.trim() || c.title);
            if (e.key === 'Escape') onCommit(c.title);
          }}
          onBlur={() => onCommit(val.trim() || c.title)}
        />
      </div>
    );
  }
  return (
    <div className={'conv' + (active ? ' active' : '')} role="button" tabIndex={0} onClick={onSelect}>
      <span className="conv-ic"><Icon name="message-circle" size={18} /></span>
      <span className="conv-title">{c.title}</span>
      <span className="conv-actions">
        <button className="conv-act" title="Переименовать" onClick={(e) => { e.stopPropagation(); onStartEdit(); }}>
          <Icon name="pencil" size={15} />
        </button>
        <button className="conv-act danger" title="Удалить" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Icon name="trash-2" size={15} />
        </button>
      </span>
    </div>
  );
}

function Sidebar({ convs, activeId, tab, setTab, onSelect, onNew, theme, onToggleTheme, editingId, setEditingId, onRename, onDelete, onReset }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><span className="brand-mark">С</span><span className="brand-name">Су-шеф</span></div>

      <nav className="sidebar-nav">
        {NAV.map((it) => (
          <button key={it.id} className={'nav-item' + (tab === it.id ? ' active' : '')} onClick={() => setTab(it.id)}>
            <Icon name={it.icon} size={20} />{it.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-convs">
        <div className="sidebar-convs-head">
          <span>Чаты</span>
          <button className="icon-btn sm" title="Новый чат" onClick={onNew}><Icon name="square-pen" size={18} /></button>
        </div>
        <div className="conv-list">
          {convs.map((c) => (
            <ConvRow
              key={c.id}
              c={c}
              active={c.id === activeId}
              editing={editingId === c.id}
              onSelect={() => onSelect(c)}
              onStartEdit={() => setEditingId(c.id)}
              onCommit={(name) => { onRename(c.id, name); setEditingId(null); }}
              onDelete={() => onDelete(c.id)}
            />
          ))}
        </div>
      </div>

      <div className="sidebar-foot">
        <button className="theme-row" onClick={onToggleTheme}>
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} />
          {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        </button>
        <button className="theme-row reset-row" onClick={onReset} title="Запустить онбординг заново">
          <Icon name="rotate-ccw" size={20} />Сбросить онбординг
        </button>
      </div>
    </aside>
  );
}

function Rail({ tab, setTab, onNew, theme, onToggleTheme }) {
  return (
    <aside className="rail">
      <span className="brand-mark">С</span>
      <button className="rail-new" title="Новый чат" onClick={onNew}><Icon name="square-pen" size={22} /></button>
      <nav className="rail-nav">
        {NAV.map((it) => (
          <button key={it.id} className={'rail-item' + (tab === it.id ? ' active' : '')} title={it.label} onClick={() => setTab(it.id)}>
            <Icon name={it.icon} size={24} />
          </button>
        ))}
      </nav>
      <div className="rail-foot">
        <button className="icon-btn" title="Тема" onClick={onToggleTheme}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={22} /></button>
      </div>
    </aside>
  );
}

function Drawer({ open, onClose, convs, activeId, onSelect, onNew, onReset }) {
  return (
    <React.Fragment>
      <div className={'scrim' + (open ? ' open' : '')} onClick={onClose}></div>
      <aside className={'drawer' + (open ? ' open' : '')}>
        <div className="drawer-head">
          <span className="brand-mark">С</span>
          <span className="brand-name">Су-шеф</span>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть"><Icon name="x" size={22} /></button>
        </div>
        <div className="drawer-new">
          <button className="btn btn--primary btn--block" onClick={onNew}><Icon name="square-pen" size={18} />Новый чат</button>
        </div>
        <div className="drawer-section">Недавние</div>
        <div className="drawer-list">
          {convs.map((c) => (
            <button key={c.id} className={'conv-rich' + (c.id === activeId ? ' active' : '')} onClick={() => onSelect(c)}>
              <span className="conv-ic"><Icon name="message-circle" size={18} /></span>
              <span className="conv-body">
                <span className="conv-title">{c.title}</span>
                <span className="conv-prev">{c.preview}</span>
              </span>
              <span className="conv-time">{c.time}</span>
            </button>
          ))}
        </div>
        <div className="drawer-foot">
          <button className="theme-row reset-row" onClick={onReset}>
            <Icon name="rotate-ccw" size={20} />Сбросить онбординг
          </button>
        </div>
      </aside>
    </React.Fragment>
  );
}

function BottomNav({ tab, setTab }) {
  return (
    <nav className="bottomnav">
      {NAV.map((it) => (
        <button key={it.id} className={tab === it.id ? 'active' : ''} onClick={() => setTab(it.id)}>
          <Icon name={it.icon} size={24} /><span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Stub({ icon, title, sub }) {
  return (
    <div className="screen">
      <div className="stub">
        <div className="stub-ic"><Icon name={icon} size={30} /></div>
        <div className="stub-title">{title}</div>
        <div className="stub-sub">{sub}</div>
      </div>
    </div>
  );
}

function App() {
  const mode = useMode();
  const [theme, setTheme] = React.useState('light');
  const [tab, setTab] = React.useState('chat');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // ---- onboarding gate ----
  const params = new URLSearchParams(location.search);
  const inviteError = (() => { const v = params.get('invite'); return (v === 'expired' || v === 'used') ? v : null; })();
  const forceOnb = params.get('onboarding');
  const [phase, setPhase] = React.useState(() => {
    if (forceOnb === '1' || inviteError) return 'onboarding';
    if (forceOnb === '0') return 'app';
    try { if (localStorage.getItem('souschef_onb') === 'done') return 'app'; } catch (e) {}
    return 'onboarding';
  });
  const [userName, setUserName] = React.useState('');
  const [seedAppliances, setSeedAppliances] = React.useState(null); // equipment from onboarding
  const [seedProducts, setSeedProducts] = React.useState([]);       // pantry items parsed/added
  const [pantryAutoAdd, setPantryAutoAdd] = React.useState(null);   // one-shot: open add form
  const [chatScenario, setChatScenario] = React.useState(null);     // 'pantry' for the seeding demo

  const [convs, setConvs] = React.useState(() => window.CONVERSATIONS.map((c) => ({ ...c })));
  const [activeId, setActiveId] = React.useState(window.CONVERSATIONS[0].id);
  const [title, setTitle] = React.useState(window.CONVERSATIONS[0].title);
  const [editingId, setEditingId] = React.useState(null);

  const [chatKey, setChatKey] = React.useState(1);
  const [chatFresh, setChatFresh] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const [cooking, setCooking] = React.useState(false);
  const [cookRecipe, setCookRecipe] = React.useState(window.RECIPE);

  // saved recipes (Рецепты), recent-first. Pasta is NOT pre-saved — it appears
  // here once you tap «Сохранить рецепт» in chat (the end-to-end walkthrough).
  const [saved, setSaved] = React.useState(() => {
    const byId = {}; window.ALL_RECIPES.forEach((r) => (byId[r.id] = r));
    return window.SAVED_SEED.map((id) => byId[id]).filter(Boolean);
  });
  const [detail, setDetail] = React.useState(null);        // open recipe, or null = list
  const [pendingDelete, setPendingDelete] = React.useState(null);

  React.useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  if (phase === 'onboarding') {
    return <Onboarding inviteError={inviteError} theme={theme} onToggleTheme={toggleTheme} onComplete={completeOnboarding} />;
  }

  function pushToast(text, action) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }
  function dismissToast(id) { setToasts((t) => t.filter((x) => x.id !== id)); }

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // ---- onboarding completion + replay ----
  function completeOnboarding({ name, equipment, pantryPath }) {
    setUserName(name);
    if (equipment && equipment.length) {
      setSeedAppliances(equipment.map((nm, i) => ({ id: 'oe' + i, name: nm, type: window.equipType(nm) })));
    }
    try { localStorage.setItem('souschef_onb', 'done'); } catch (e) {}
    setPhase('app');
    setDetail(null);
    if (pantryPath === 'self') {
      setPantryAutoAdd('product');
      setTab('pantry');
    } else if (pantryPath === 'chat') {
      setChatScenario('pantry');
      setChatFresh(false);
      setChatKey((k) => k + 1);
      setTab('chat');
    } else {
      setChatScenario(null);
      setChatFresh(true);
      setChatKey((k) => k + 1);
      setTab('chat');
    }
  }
  function resetOnboarding() {
    try { localStorage.removeItem('souschef_onb'); } catch (e) {}
    setDrawerOpen(false);
    setSeedAppliances(null);
    setSeedProducts([]);
    setChatScenario(null);
    setPhase('onboarding');
  }
  function seedPantryFromChat(items) {
    setSeedProducts((xs) => { const have = new Set(xs.map((x) => x.id)); return items.filter((it) => !have.has(it.id)).concat(xs); });
    setChatScenario(null); // demo done — a later return to chat starts clean
  }

  function navTab(id) { setDetail(null); setTab(id); }
  function openCooking(recipe) { setCookRecipe(recipe || window.RECIPE); setCooking(true); }

  function saveRecipe(recipe) {
    const already = saved.some((r) => r.id === recipe.id);
    if (already) { pushToast('Уже в рецептах'); return; }
    setSaved((xs) => [recipe, ...xs]);
    pushToast('Рецепт сохранён', { label: 'Отменить', fn: () => setSaved((xs) => xs.filter((r) => r.id !== recipe.id)) });
  }
  function confirmDeleteRecipe() {
    const recipe = pendingDelete; if (!recipe) return;
    const idx = saved.findIndex((r) => r.id === recipe.id);
    setSaved((xs) => xs.filter((r) => r.id !== recipe.id));
    setPendingDelete(null);
    setDetail(null);
    pushToast('Рецепт удалён', { label: 'Вернуть', fn: () => setSaved((xs) => { const c = [...xs]; c.splice(Math.min(idx, c.length), 0, recipe); return c; }) });
  }

  function selectConv(c) {
    setActiveId(c.id);
    setTitle(c.title);
    setChatFresh(false);
    setChatKey((k) => k + 1);
    setTab('chat');
    setDrawerOpen(false);
  }
  function newChat() {
    setActiveId(null);
    setTitle('Новый чат');
    setChatFresh(true);
    setChatKey((k) => k + 1);
    setTab('chat');
    setDrawerOpen(false);
  }
  function renameConv(id, name) {
    setConvs((cs) => cs.map((c) => (c.id === id ? { ...c, title: name } : c)));
    if (id === activeId) setTitle(name);
  }
  function deleteConv(id) {
    setConvs((cs) => {
      const next = cs.filter((c) => c.id !== id);
      if (id === activeId) {
        if (next.length) { setActiveId(next[0].id); setTitle(next[0].title); setChatKey((k) => k + 1); }
        else { newChat(); }
      }
      return next;
    });
  }

  const inDetail = tab === 'recipes' && !!detail;
  const headerTitle = inDetail ? detail.title : (tab === 'chat' ? title : (NAV.find((n) => n.id === tab) || {}).label);

  return (
    <div className={'app app--' + mode}>
      {mode === 'desktop' && (
        <Sidebar
          convs={convs} activeId={activeId} tab={tab} setTab={navTab}
          onSelect={selectConv} onNew={newChat}
          theme={theme} onToggleTheme={toggleTheme}
          editingId={editingId} setEditingId={setEditingId}
          onRename={renameConv} onDelete={deleteConv}
          onReset={resetOnboarding}
        />
      )}
      {mode === 'rail' && (
        <Rail tab={tab} setTab={navTab} onNew={newChat} theme={theme} onToggleTheme={toggleTheme} />
      )}

      <div className="main">
        {mode === 'mobile' && tab === 'chat' && (
          <header className="topbar">
            <button className="icon-btn" onClick={() => setDrawerOpen(true)} aria-label="Меню"><Icon name="menu" size={24} /></button>
            <div className="topbar-title">
              <span className="tt-eyebrow">Су-шеф</span>
              <span className="tt-name">{title}</span>
            </div>
            <button className="icon-btn" onClick={toggleTheme} aria-label="Тема"><Icon name={theme === 'light' ? 'moon' : 'sun'} size={22} /></button>
          </header>
        )}
        {mode === 'mobile' && tab !== 'chat' && (
          <header className="topbar-plain">
            {inDetail && (
              <button className="icon-btn" onClick={() => setDetail(null)} aria-label="Назад"><Icon name="arrow-left" size={24} /></button>
            )}
            <span className="tp-title">{headerTitle}</span>
            <button className="icon-btn" onClick={toggleTheme} aria-label="Тема"><Icon name={theme === 'light' ? 'moon' : 'sun'} size={22} /></button>
          </header>
        )}
        {mode !== 'mobile' && (
          <header className="main-header">
            <div className="main-header-inner">
              {inDetail && (
                <button className="icon-btn" style={{ marginLeft: 'calc(-1 * var(--space-2))', marginRight: 'var(--space-1)' }} onClick={() => setDetail(null)} aria-label="Назад"><Icon name="arrow-left" size={22} /></button>
              )}
              <div>
                {tab === 'chat' && <div className="mh-eyebrow">Су-шеф</div>}
                <span className="mh-title">{headerTitle}</span>
              </div>
            </div>
          </header>
        )}

        {tab === 'chat' && (
          <ChatScreen
            key={chatKey}
            fresh={chatFresh}
            mode={mode}
            scenario={chatScenario}
            onCook={() => openCooking(window.RECIPE)}
            onSave={() => saveRecipe(window.RECIPE)}
            onCopy={() => pushToast('Скопировано')}
            onSeedPantry={seedPantryFromChat}
            onEditPantry={() => navTab('pantry')}
          />
        )}
        {tab === 'pantry' && (
          <PantryScreen
            toast={pushToast}
            seedProducts={seedProducts}
            seedAppliances={seedAppliances}
            autoAddKind={pantryAutoAdd}
            onAutoAddConsumed={() => setPantryAutoAdd(null)}
          />
        )}
        {tab === 'recipes' && (detail
          ? <RecipeDetail recipe={detail} onCook={() => openCooking(detail)} onDelete={() => setPendingDelete(detail)} />
          : <RecipesScreen recipes={saved} onOpen={(r) => setDetail(r)} onGoChat={() => navTab('chat')} />
        )}

        {mode === 'mobile' && <BottomNav tab={tab} setTab={navTab} />}

        <div className="toast-wrap">
          {toasts.map((t) => (
            <div className="toast" key={t.id}>
              <span>{t.text}</span>
              {t.action && (
                <button className="toast-action" onClick={() => { t.action.fn(); dismissToast(t.id); }}>{t.action.label}</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {mode === 'mobile' && (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} convs={convs} activeId={activeId} onSelect={selectConv} onNew={newChat} onReset={resetOnboarding} />
      )}

      {cooking && (
        <CookingMode
          recipe={cookRecipe}
          mode={mode}
          onClose={() => setCooking(false)}
          onDone={() => { setCooking(false); pushToast('Готово. Приятного аппетита'); }}
        />
      )}

      {pendingDelete && (
        <div className="cook-confirm-scrim" onClick={() => setPendingDelete(null)}>
          <div className="cook-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="cook-confirm-title">Удалить рецепт?</div>
            <div className="cook-confirm-text">«{pendingDelete.title}» исчезнет из сохранённых. Это можно отменить.</div>
            <div className="cook-confirm-actions">
              <button className="btn btn--secondary" onClick={() => setPendingDelete(null)}>Отмена</button>
              <button className="btn btn--destructive" onClick={confirmDeleteRecipe}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
