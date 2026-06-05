/* Recipes (Рецепты) — saved list with pantry-match badges + search, and a
   full-page detail that reuses the chat RecipeCard (Готовить + delete). */

function SavedCard({ r, onOpen }) {
  const missing = window.recipeMissing(r);
  return (
    <button className="saved-card" onClick={() => onOpen(r)}>
      <div className="saved-thumb"><Icon name="utensils-crossed" size={28} color="var(--accent)" /></div>
      <div className="saved-body">
        <div className="saved-title">{r.title}</div>
        <div className="saved-meta">
          <span className="row"><Icon name="clock" size={15} />{r.time}</span>
          <span className="row"><Icon name="users" size={15} />{r.servings} порц.</span>
        </div>
        <div className="saved-badge">
          {missing === 0
            ? <span className="tag tag--have"><Icon name="check" size={14} />Всё есть</span>
            : <span className="tag tag--missing"><Icon name="alert-triangle" size={14} />Не хватает {missing}</span>}
        </div>
      </div>
    </button>
  );
}

function RecipesScreen({ recipes, onOpen, onGoChat }) {
  const [q, setQ] = React.useState('');
  const ql = q.trim().toLowerCase();
  const list = recipes.filter((r) => r.title.toLowerCase().includes(ql));

  if (recipes.length === 0) {
    return (
      <div className="screen">
        <div className="list-scroll">
          <div className="list-inner">
            <div className="empty">
              <div className="empty-ic"><Icon name="bookmark" size={28} /></div>
              <div className="empty-text">Сохраняй рецепты из чата — они появятся здесь.</div>
              <button className="btn btn--primary" onClick={onGoChat}><Icon name="message-circle" size={20} />Перейти в чат</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-controls">
        <div className="search">
          <Icon name="search" size={20} color="var(--text-secondary)" />
          <input placeholder="Искать в рецептах" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="list-scroll">
        <div className="list-inner">
          {list.length ? (
            <div className="saved-grid">
              {list.map((r) => <SavedCard key={r.id} r={r} onOpen={onOpen} />)}
            </div>
          ) : (
            <div className="empty"><div className="empty-text">Ничего не найдено. Попробуй другое название.</div></div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecipeDetail({ recipe, onCook, onDelete }) {
  return (
    <div className="screen">
      <div className="detail-scroll">
        <div className="detail-inner">
          <RecipeCard recipe={recipe} onCook={onCook} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}

window.RecipesScreen = RecipesScreen;
window.RecipeDetail = RecipeDetail;
