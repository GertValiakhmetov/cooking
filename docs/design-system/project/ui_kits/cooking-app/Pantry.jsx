/* Pantry screen — tabs (Ingredients / Equipment), search, expiry badges, swipe-to-delete. */
function PantryRow({ item, onDelete }) {
  const [open, setOpen] = React.useState(false);
  const startX = React.useRef(0);
  return (
    <div className="swipe">
      <div className="swipe-del" onClick={() => onDelete(item.id)}><Icon name="trash-2" size={22} color="#fff" /></div>
      <div
        className="prow swipe-fg"
        style={{ transform: open ? 'translateX(-88px)' : 'translateX(0)' }}
        onClick={() => setOpen((o) => !o)}
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => setOpen(e.changedTouches[0].clientX - startX.current < -30)}
      >
        <span className={'pname' + (item.state === 'expired' ? ' faded' : '')}>{item.name}</span>
        <span className="pqty">{item.qty}</span>
        <span className="prow-right">
          {item.state === 'ok' && <Badge kind="category">{item.cat}</Badge>}
          {item.state === 'soon' && <Badge kind="soon"><Icon name="clock" size={14} />{item.exp}</Badge>}
          {item.state === 'expired' && <Badge kind="expired"><Icon name="alert-triangle" size={14} />Просрочено</Badge>}
        </span>
      </div>
    </div>
  );
}

function PantryScreen() {
  const [tab, setTab] = React.useState('ing');
  const [items, setItems] = React.useState(window.PANTRY);
  const [q, setQ] = React.useState('');
  const del = (id) => setItems((xs) => xs.filter((x) => x.id !== id));
  const filtered = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="screen">
      <header className="topbar">
        <span className="t-title" style={{ flex: 1 }}>Кладовая</span>
        <button className="icon-btn"><Icon name="plus" size={24} /></button>
      </header>

      <div className="pantry-controls">
        <div className="search">
          <Icon name="search" size={20} color="var(--text-secondary)" />
          <input placeholder="Искать в кладовой" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="tabs">
          <button className={tab === 'ing' ? 'active' : ''} onClick={() => setTab('ing')}>Ингредиенты</button>
          <button className={tab === 'eq' ? 'active' : ''} onClick={() => setTab('eq')}>Оборудование</button>
        </div>
      </div>

      <div className="list-scroll">
        {tab === 'ing' ? (
          filtered.length ? (
            <div className="list">{filtered.map((it) => <PantryRow key={it.id} item={it} onDelete={del} />)}</div>
          ) : (
            <div className="empty">Ничего не найдено. Попробуйте другое название.</div>
          )
        ) : (
          <div className="list">
            {window.EQUIPMENT.map((e) => (
              <div className="prow" key={e.id}>
                <span className="pname">{e.name}</span>
                <span className="prow-right"><Badge kind="category">{e.cat}</Badge></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.PantryScreen = PantryScreen;
