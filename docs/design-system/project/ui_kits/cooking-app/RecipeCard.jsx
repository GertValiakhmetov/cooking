/* RecipeCard — inline in chat and on the recipes screen. */
function Stepper({ value, onChange }) {
  return (
    <span className="stepper">
      <Icon name="users" size={18} color="var(--text-secondary)" />
      <button onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <span className="n">{value}</span>
      <button onClick={() => onChange(value + 1)}>+</button>
    </span>
  );
}

function IngredientRow({ ing }) {
  return (
    <div className={'ing' + (ing.have ? '' : ' missing')}>
      <span className="mark" style={{ color: ing.have ? 'var(--success)' : 'var(--warning)' }}>
        <Icon name={ing.have ? 'check' : 'plus'} size={20} />
      </span>
      {ing.name}
      <span className="qty">{ing.qty}</span>
    </div>
  );
}

function RecipeCard({ onCook }) {
  const r = window.RECIPE;
  const [servings, setServings] = React.useState(r.servings);
  const missing = r.ingredients.filter((i) => !i.have).length;
  return (
    <div className="card rc">
      <div className="rc-head">
        <div className="t-title">{r.title}</div>
        <div className="rc-meta">
          <span className="row"><Icon name="clock" size={16} />{r.time}</span>
          <span className="row"><Icon name="flame" size={16} />{r.difficulty}</span>
          <Stepper value={servings} onChange={setServings} />
        </div>
      </div>
      <div className="rc-body">
        <div className="rc-section-label">
          Ингредиенты
          {missing > 0 && <Badge kind="missing">Не хватает {missing}</Badge>}
        </div>
        {r.ingredients.map((ing, i) => <IngredientRow key={i} ing={ing} />)}
      </div>
      <div className="rc-actions">
        <button className="btn btn--primary" style={{ flex: 1 }} onClick={onCook}>
          <Icon name="chef-hat" size={18} />Готовить
        </button>
        <button className="btn btn--secondary"><Icon name="bookmark" size={18} /></button>
      </div>
    </div>
  );
}

window.RecipeCard = RecipeCard;
