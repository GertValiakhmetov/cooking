/* App shell — phone frame, bottom nav, screen routing, theme toggle, cooking-mode overlay. */
function BottomNav({ tab, setTab }) {
  const items = [
    { id: 'chat', icon: 'message-circle', label: 'Чат' },
    { id: 'pantry', icon: 'refrigerator', label: 'Кладовая' },
    { id: 'recipes', icon: 'book-open', label: 'Рецепты' },
  ];
  return (
    <nav className="bottomnav">
      {items.map((it) => (
        <button key={it.id} className={tab === it.id ? 'active' : ''} onClick={() => setTab(it.id)}>
          <Icon name={it.icon} size={24} />
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [tab, setTab] = React.useState('chat');
  const [cooking, setCooking] = React.useState(false);
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <div className="device-wrap">
      <button className="theme-toggle" onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
        <Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} />
        {theme === 'light' ? 'Тёмная' : 'Светлая'}
      </button>

      <div className="device">
        <div className="statusbar">
          <span>21:30</span>
          <span className="sb-icons"><Icon name="signal" size={16} /><Icon name="wifi" size={16} /><Icon name="battery-full" size={18} /></span>
        </div>

        <div className="app-body">
          {cooking ? (
            <CookingMode onExit={() => setCooking(false)} />
          ) : (
            <React.Fragment>
              {tab === 'chat' && <ChatScreen onCook={() => setCooking(true)} />}
              {tab === 'pantry' && <PantryScreen />}
              {tab === 'recipes' && <RecipesScreen onOpen={() => setCooking(true)} />}
              <BottomNav tab={tab} setTab={setTab} />
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
