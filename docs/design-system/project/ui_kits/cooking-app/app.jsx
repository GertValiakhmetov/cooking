// app.jsx — Su-shef app root: theme, navigation, cooking overlay, toast.
const { useState, useCallback } = React;

function AppHeader({ tab, dark, onToggleTheme, onAdd }) {
  const titles = { chat: 'Су-шеф', pantry: 'Кладовая', recipes: 'Рецепты' };
  return (
    <div className="appbar">
      {tab === 'chat' ? (
        <div className="lead">
          <span className="brand"><Icon name="ChefHat" size={18} /></span>
          <span className="ttl" style={{ flex: 'none' }}>Су-шеф</span>
        </div>
      ) : (
        <div className="ttl">{titles[tab]}</div>
      )}
      {tab === 'pantry' && (
        <button className="icon-btn" onClick={onAdd} aria-label="Добавить"><Icon name="Plus" size={24} /></button>
      )}
      <button className="icon-btn" onClick={onToggleTheme} aria-label="Сменить тему">
        <Icon name={dark ? 'Sun' : 'Moon'} size={22} />
      </button>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState('light');
  const [tab, setTab] = useState('chat');
  const [cook, setCook] = useState(false);
  const [toast, setToast] = useState(null);
  const [scale, setScale] = useState(1);
  const dark = theme === 'dark';

  React.useEffect(() => {
    const fit = () => {
      const pad = 32;
      setScale(Math.min(1, (window.innerHeight - pad) / 874, (window.innerWidth - pad) / 402));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e9e2d6', overflow: 'hidden' }}>
      <div style={{ width: 402 * scale, height: 874 * scale }}>
      <div style={{ width: 402, height: 874, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <IOSDevice dark={dark}>
        <div className="app" data-theme={theme}>
          <AppHeader tab={tab} dark={dark} onToggleTheme={() => setTheme(dark ? 'light' : 'dark')} onAdd={() => showToast('Добавление ингредиента')} />

          {tab === 'chat' && <ChatScreen onOpenCook={() => setCook(true)} onToast={showToast} />}
          {tab === 'pantry' && <PantryScreen onToast={showToast} />}
          {tab === 'recipes' && <RecipesScreen onOpen={() => setCook(true)} />}

          <BottomNav active={tab} onChange={setTab} />

          {toast && (
            <div className="toast-wrap">
              <div className="toast"><Icon name="CheckCircle2" size={20} color="var(--success)" />{toast}</div>
            </div>
          )}

          {cook && <CookingMode recipe={RECIPE} onClose={() => setCook(false)} />}
        </div>
      </IOSDevice>
      </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
