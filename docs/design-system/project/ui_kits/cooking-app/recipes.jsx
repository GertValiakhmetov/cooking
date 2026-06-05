// recipes.jsx — Saved recipes list with have-everything / missing-N badges.

function SavedCard({ recipe, onOpen }) {
  return (
    <button className="saved-card" onClick={onOpen}>
      <div className="saved-main">
        <div className="saved-title">{recipe.title}</div>
        <div className="saved-meta"><Icon name="Clock" size={15} />{recipe.time}</div>
      </div>
      {recipe.missing === 0 ? (
        <span className="tag tag--have"><Icon name="Check" size={14} />Всё есть</span>
      ) : (
        <span className="tag tag--missing">Не хватает {recipe.missing}</span>
      )}
      <Icon name="ChevronRight" size={20} color="var(--text-tertiary)" />
    </button>
  );
}

function RecipesScreen({ onOpen }) {
  return (
    <div className="appmain">
      <div className="section-label">{SAVED.length} сохранённых рецепта</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 80px' }}>
        {SAVED.map((r) => <SavedCard key={r.id} recipe={r} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

Object.assign(window, { RecipesScreen, SavedCard });
