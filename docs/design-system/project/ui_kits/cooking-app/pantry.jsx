// pantry.jsx — Pantry screen: segmented tabs, search, ingredient + equipment rows.

function ExpiryBadge({ item }) {
  if (item.expiry === 'soon') return <span className="tag tag--soon"><Icon name="Clock" size={14} />{item.expiryLabel}</span>;
  if (item.expiry === 'expired') return <span className="tag tag--expired"><Icon name="AlertTriangle" size={14} />{item.expiryLabel}</span>;
  return null;
}

function PantryRow({ item, onDelete }) {
  // lightweight swipe-to-delete affordance
  const [open, setOpen] = React.useState(false);
  const start = React.useRef(0);
  return (
    <div className="swiperow">
      <div className="swipe-reveal" onClick={() => onDelete(item.id)}><Icon name="Trash2" size={20} /></div>
      <div
        className="prow front"
        style={{ transform: open ? 'translateX(-76px)' : 'translateX(0)' }}
        onTouchStart={(e) => (start.current = e.touches[0].clientX)}
        onTouchEnd={(e) => setOpen(e.changedTouches[0].clientX - start.current < -30)}
        onClick={() => open && setOpen(false)}
      >
        <span className={'pname' + (item.expiry === 'expired' ? ' faded' : '')}>{item.name}</span>
        <span className="pqty">{item.qty}</span>
        <span className="pright">
          <span className="tag tag--category">{item.cat}</span>
          <ExpiryBadge item={item} />
        </span>
      </div>
    </div>
  );
}

function EquipmentRow({ item }) {
  return (
    <div className="prow">
      <span className="mark" style={{ color: item.have ? 'var(--success)' : 'var(--text-tertiary)', display: 'flex' }}>
        <Icon name={item.have ? 'Check' : 'Minus'} size={20} />
      </span>
      <span className="pname" style={item.have ? null : { color: 'var(--text-tertiary)' }}>{item.name}</span>
      <span className="pright">{item.have ? <span className="tag tag--have">Есть</span> : <span className="tag">Нет</span>}</span>
    </div>
  );
}

function PantryScreen({ onToast }) {
  const [tab, setTab] = React.useState('ing');
  const [items, setItems] = React.useState(PANTRY);
  const [query, setQuery] = React.useState('');
  const del = (id) => { setItems((x) => x.filter((i) => i.id !== id)); onToast('Удалено из кладовой'); };
  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <React.Fragment>
      <div className="seg">
        <button className={tab === 'ing' ? 'active' : ''} onClick={() => setTab('ing')}>Ингредиенты</button>
        <button className={tab === 'eq' ? 'active' : ''} onClick={() => setTab('eq')}>Оборудование</button>
      </div>
      <div className="appmain">
        {tab === 'ing' ? (
          <React.Fragment>
            <div style={{ padding: '12px 16px 0' }}>
              <div className="search"><Icon name="Search" size={18} /><input placeholder="Искать в кладовой" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
            </div>
            <div className="section-label">{filtered.length} продуктов</div>
            {filtered.length === 0 ? (
              <div className="empty">Ничего не найдено</div>
            ) : (
              <div className="surface-list">
                {filtered.map((it) => <PantryRow key={it.id} item={it} onDelete={del} />)}
              </div>
            )}
            <div style={{ height: 80 }} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="section-label">Моё оборудование</div>
            <div className="surface-list">
              {EQUIPMENT.map((it) => <EquipmentRow key={it.id} item={it} />)}
            </div>
            <div style={{ height: 80 }} />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { PantryScreen });
