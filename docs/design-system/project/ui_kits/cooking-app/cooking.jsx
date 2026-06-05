// cooking.jsx — Full-screen cooking mode: one step, big type, big timer.

function CookingMode({ recipe, onClose }) {
  const [i, setI] = React.useState(0);
  const step = recipe.steps[i];
  const last = i === recipe.steps.length - 1;
  return (
    <div className="cook">
      <div className="cook-top">
        <span className="cook-prog">ШАГ {i + 1} ИЗ {recipe.steps.length}</span>
        <button className="icon-btn" onClick={onClose} aria-label="Закрыть"><Icon name="X" size={26} /></button>
      </div>
      <div className="cook-progressbar">
        <div className="fill" style={{ width: ((i + 1) / recipe.steps.length * 100) + '%' }} />
      </div>
      <div className="cook-body">
        <div className="cook-num">{i + 1}</div>
        <div className="t-cooking">{step.text}</div>
        {step.timer && (
          <div><TimerButton label={step.timer} size="lg" /></div>
        )}
      </div>
      <div className="cook-nav">
        <button className="btn btn--secondary" style={{ flex: 1 }} disabled={i === 0} onClick={() => setI(i - 1)}>
          <Icon name="ArrowLeft" size={20} />Назад
        </button>
        {last ? (
          <button className="btn btn--primary" style={{ flex: 2 }} onClick={onClose}>
            <Icon name="Check" size={20} />Готово
          </button>
        ) : (
          <button className="btn btn--primary" style={{ flex: 2 }} onClick={() => setI(i + 1)}>
            Дальше<Icon name="ArrowRight" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

window.CookingMode = CookingMode;
