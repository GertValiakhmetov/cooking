/* Pantry (Кладовая) — two tabs: Продукты (grouped, inline-edit qty, swipe-delete)
   and Техника. Add via bottom-sheet (mobile) / dialog (desktop). Undo on delete. */

function stepFor(unit) { return (unit === 'г' || unit === 'мл') ? 100 : 1; }
function fmtQty(it) {
  if (it.amount == null) return '';
  return it.amount + (it.unit ? ' ' + it.unit : '');
}

/* ---- Add form (product or appliance) ---- */
function AddSheet({ kind, onClose, onAdd }) {
  const isProd = kind === 'product';
  const [name, setName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [unit, setUnit] = React.useState('г');
  const [cat, setCat] = React.useState('Овощи');
  const [type, setType] = React.useState('Техника');
  const [exp, setExp] = React.useState('');

  function submit() {
    const nm = name.trim();
    if (!nm) return;
    if (isProd) {
      onAdd({
        id: 'p' + Date.now(), name: nm,
        amount: amount === '' ? null : Number(amount), unit,
        cat, state: exp.trim() ? 'soon' : 'ok', exp: exp.trim() || undefined,
      });
    } else {
      onAdd({ id: 'a' + Date.now(), name: nm, type });
    }
    onClose();
  }

  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip"></div>
        <div className="sheet-head">
          <div className="sheet-title">{isProd ? 'Добавить продукт' : 'Добавить технику'}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть"><Icon name="x" size={22} /></button>
        </div>

        <div className="sheet-body">
          <div className="fgroup">
            <label className="flabel">Название</label>
            <input className="field" autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder={isProd ? 'Например, морковь' : 'Например, мультиварка'} />
          </div>

          {isProd ? (
            <React.Fragment>
              <div className="fgroup">
                <label className="flabel">Количество</label>
                <div className="frow">
                  <input className="field" type="number" inputMode="numeric" value={amount}
                    onChange={(e) => setAmount(e.target.value)} placeholder="—" />
                  <select className="field field--unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    {window.PANTRY_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="fgroup">
                <label className="flabel">Категория</label>
                <div className="chips-wrap">
                  {window.PANTRY_CATEGORIES.slice(0, 6).map((c) => (
                    <button key={c} className={'selch' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="fgroup">
                <label className="flabel">Срок годности · необязательно</label>
                <input className="field" value={exp} onChange={(e) => setExp(e.target.value)} placeholder="Например, 3 дня" />
              </div>
            </React.Fragment>
          ) : (
            <div className="fgroup">
              <label className="flabel">Тип</label>
              <div className="chips-wrap">
                {window.APPLIANCE_TYPES.map((t) => (
                  <button key={t} className={'selch' + (type === t ? ' on' : '')} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sheet-foot">
          <button className="btn btn--secondary" onClick={onClose}>Отмена</button>
          <button className="btn btn--primary" onClick={submit} aria-disabled={!name.trim()}>Добавить</button>
        </div>
      </div>
    </div>
  );
}

/* ---- one product row: swipe to reveal delete, tap to inline-edit ---- */
function ProductRow({ item, open, onToggle, onChange, onDelete }) {
  const [slid, setSlid] = React.useState(false);
  const startX = React.useRef(0);
  const step = stepFor(item.unit);

  return (
    <div className="swipe">
      <button className="swipe-del" onClick={() => onDelete(item.id)} aria-label="Удалить"><Icon name="trash-2" size={22} color="#fff" /></button>
      <div className="swipe-fg" style={{ transform: slid ? 'translateX(-88px)' : 'translateX(0)' }}>
        <div className="prow" data-open={open}
          onClick={() => { if (slid) { setSlid(false); } else { onToggle(item.id); } }}
          onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - startX.current; if (d < -30) setSlid(true); else if (d > 30) setSlid(false); }}>
          <div className="prow-main">
            <span className={'pname' + (item.state === 'expired' ? ' faded' : '')}>{item.name}</span>
            {item.amount != null && <span className="pqty">{fmtQty(item)}</span>}
          </div>
          <div className="prow-right">
            {item.state === 'soon' && <span className="tag tag--soon"><Icon name="clock" size={14} />{item.exp}</span>}
            {item.state === 'expired' && <span className="tag tag--expired"><Icon name="alert-triangle" size={14} />Просрочено</span>}
            <span className="chev"><Icon name="chevron-down" size={18} /></span>
          </div>
        </div>

        {open && item.amount != null && (
          <div className="pedit" onClick={(e) => e.stopPropagation()}>
            <div className="pedit-row">
              <span className="pedit-now">{fmtQty(item)}</span>
              <button className="qchip" onClick={() => onChange(item.id, Math.max(0, item.amount - step))}>−{step} {item.unit}</button>
              <button className="qchip" onClick={() => onChange(item.id, item.amount + step)}>+{step} {item.unit}</button>
            </div>
            <div className="pedit-actions">
              <button className="pedit-del" onClick={() => onDelete(item.id)}><Icon name="trash-2" size={17} />Удалить</button>
              <button className="btn btn--ghost" style={{ minHeight: 40 }} onClick={() => onToggle(item.id)}>Готово</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ApplianceRow({ item, onDelete }) {
  const [slid, setSlid] = React.useState(false);
  const startX = React.useRef(0);
  return (
    <div className="swipe">
      <button className="swipe-del" onClick={() => onDelete(item.id)} aria-label="Удалить"><Icon name="trash-2" size={22} color="#fff" /></button>
      <div className="swipe-fg" style={{ transform: slid ? 'translateX(-88px)' : 'translateX(0)' }}
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - startX.current; if (d < -30) setSlid(true); else if (d > 30) setSlid(false); }}>
        <div className="prow" onClick={() => slid && setSlid(false)}>
          <div className="prow-main"><span className="pname">{item.name}</span></div>
          <div className="prow-right"><span className="tag tag--category">{item.type}</span></div>
        </div>
      </div>
    </div>
  );
}

function PantryScreen({ toast, seedProducts, seedAppliances, autoAddKind, onAutoAddConsumed }) {
  const [tab, setTab] = React.useState('prod');
  const [products, setProducts] = React.useState(() => {
    const extra = (seedProducts || []).map((p) => ({ ...p }));
    return extra.concat(window.PANTRY_PRODUCTS.map((p) => ({ ...p })));
  });
  const [appliances, setAppliances] = React.useState(() =>
    (seedAppliances && seedAppliances.length ? seedAppliances : window.PANTRY_APPLIANCES).map((a) => ({ ...a }))
  );
  const [q, setQ] = React.useState('');
  const [openId, setOpenId] = React.useState(null);
  const [adding, setAdding] = React.useState(!!autoAddKind);

  // consume the one-shot auto-open-add flag after first mount
  React.useEffect(() => { if (autoAddKind && onAutoAddConsumed) onAutoAddConsumed(); }, []);

  const ql = q.trim().toLowerCase();
  const fProd = products.filter((p) => p.name.toLowerCase().includes(ql));
  const fApp = appliances.filter((a) => a.name.toLowerCase().includes(ql));

  function changeQty(id, amount) { setProducts((xs) => xs.map((x) => (x.id === id ? { ...x, amount } : x))); }

  function delProduct(id) {
    const idx = products.findIndex((x) => x.id === id);
    if (idx < 0) return;
    const item = products[idx];
    setProducts((xs) => xs.filter((x) => x.id !== id));
    setOpenId(null);
    toast(item.name + ' удалён', { label: 'Вернуть', fn: () => setProducts((xs) => { const c = [...xs]; c.splice(Math.min(idx, c.length), 0, item); return c; }) });
  }
  function delAppliance(id) {
    const idx = appliances.findIndex((x) => x.id === id);
    if (idx < 0) return;
    const item = appliances[idx];
    setAppliances((xs) => xs.filter((x) => x.id !== id));
    toast(item.name + ' удалён', { label: 'Вернуть', fn: () => setAppliances((xs) => { const c = [...xs]; c.splice(Math.min(idx, c.length), 0, item); return c; }) });
  }
  function addItem(it) {
    if (tab === 'prod') setProducts((xs) => [it, ...xs]);
    else setAppliances((xs) => [it, ...xs]);
    toast((tab === 'prod' ? 'Продукт' : 'Техника') + ' добавлен' + (tab === 'prod' ? '' : 'а'));
  }

  // group products by category (only non-empty groups, in canonical order)
  const groups = window.PANTRY_CATEGORIES
    .map((cat) => ({ cat, items: fProd.filter((p) => p.cat === cat) }))
    .filter((g) => g.items.length);

  const totalCount = tab === 'prod' ? products.length : appliances.length;

  return (
    <div className="screen">
      <div className="screen-controls">
        <div className="search">
          <Icon name="search" size={20} color="var(--text-secondary)" />
          <input placeholder={tab === 'prod' ? 'Искать продукт' : 'Искать технику'} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="seg">
          <button className={tab === 'prod' ? 'active' : ''} onClick={() => { setTab('prod'); setQ(''); }}>Продукты</button>
          <button className={tab === 'tech' ? 'active' : ''} onClick={() => { setTab('tech'); setQ(''); }}>Техника</button>
        </div>
        <button className="btn btn--primary add-btn" onClick={() => setAdding(true)}>
          <Icon name="plus" size={20} />{tab === 'prod' ? 'Добавить продукт' : 'Добавить технику'}
        </button>
      </div>

      <div className="list-scroll">
        <div className="list-inner">
          {totalCount === 0 ? (
            <div className="empty">
              <div className="empty-ic"><Icon name={tab === 'prod' ? 'refrigerator' : 'cooking-pot'} size={28} /></div>
              <div className="empty-text">{tab === 'prod' ? 'Здесь пока пусто. Добавь первый продукт.' : 'Здесь пока пусто. Добавь технику.'}</div>
              <button className="btn btn--primary" onClick={() => setAdding(true)}><Icon name="plus" size={20} />Добавить</button>
            </div>
          ) : tab === 'prod' ? (
            groups.length ? groups.map((g) => (
              <div className="cat-group" key={g.cat}>
                <div className="cat-head">{g.cat}<span className="cat-count">{g.items.length}</span></div>
                <div className="list">
                  {g.items.map((it) => (
                    <ProductRow key={it.id} item={it} open={openId === it.id}
                      onToggle={(id) => setOpenId((o) => (o === id ? null : id))}
                      onChange={changeQty} onDelete={delProduct} />
                  ))}
                </div>
              </div>
            )) : <div className="empty"><div className="empty-text">Ничего не найдено. Попробуй другое название.</div></div>
          ) : (
            fApp.length ? (
              <div className="list">{fApp.map((it) => <ApplianceRow key={it.id} item={it} onDelete={delAppliance} />)}</div>
            ) : <div className="empty"><div className="empty-text">Ничего не найдено. Попробуй другое название.</div></div>
          )}
        </div>
      </div>

      {adding && <AddSheet kind={tab === 'prod' ? 'product' : 'appliance'} onClose={() => setAdding(false)} onAdd={addItem} />}
    </div>
  );
}

window.PantryScreen = PantryScreen;
