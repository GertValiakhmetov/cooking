// chrome.jsx — TopBar, BottomNav, ThemeToggle for the Су-шеф app.

function TopBar({ title, leading, trailing }) {
  return (
    <div className="appbar">
      {leading}
      <div className="ttl">{title}</div>
      {trailing}
    </div>
  );
}

function BrandBar({ onToggleTheme, dark }) {
  return (
    <div className="appbar">
      <div className="lead">
        <span className="brand"><Icon name="ChefHat" size={18} /></span>
        <span className="ttl" style={{ flex: 'none' }}>Су-шеф</span>
      </div>
      <button className="icon-btn" onClick={onToggleTheme} aria-label="Тема">
        <Icon name={dark ? 'Sun' : 'Moon'} size={22} />
      </button>
    </div>
  );
}

const NAV_ITEMS = [
  { id: 'chat', label: 'Чат', icon: 'MessageCircle' },
  { id: 'pantry', label: 'Кладовая', icon: 'Refrigerator' },
  { id: 'recipes', label: 'Рецепты', icon: 'BookOpen' },
];

function BottomNav({ active, onChange }) {
  return (
    <div className="tabbar">
      {NAV_ITEMS.map((it) => (
        <button
          key={it.id}
          className={'item' + (active === it.id ? ' active' : '')}
          onClick={() => onChange(it.id)}
        >
          <Icon name={it.icon} size={22} stroke={active === it.id ? 2.4 : 2} />
          {it.label}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { TopBar, BrandBar, BottomNav });
