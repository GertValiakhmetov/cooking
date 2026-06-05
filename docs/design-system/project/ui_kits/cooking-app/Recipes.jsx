/* Recipes screen — saved recipe cards with have/missing badges. */
function SavedCard({ r, onOpen }) {
  return (
    <button className="saved-card" onClick={onOpen}>
      <div className="saved-thumb"><Icon name="utensils-crossed" size={28} color="var(--accent)" /></div>
      <div className="saved-body">
        <div className="saved-title">{r.title}</div>
        <div className="saved-meta"><Icon name="clock" size={15} />{r.time}</div>
      </div>
      {r.missing === 0
        ? <Badge kind="have"><Icon name="check" size={14} />Всё есть</Badge>
        : <Badge kind="missing">Не хватает {r.missing}</Badge>}
    </button>
  );
}

function RecipesScreen({ onOpen }) {
  return (
    <div className="screen">
      <header className="topbar">
        <span className="t-title" style={{ flex: 1 }}>Рецепты</span>
        <button className="icon-btn"><Icon name="search" size={24} /></button>
      </header>
      <div className="list-scroll">
        <div className="saved-grid">
          {window.SAVED.map((r, i) => <SavedCard key={i} r={r} onOpen={onOpen} />)}
        </div>
      </div>
    </div>
  );
}

window.RecipesScreen = RecipesScreen;
