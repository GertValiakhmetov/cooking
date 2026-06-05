// chat.jsx — Chat screen: bubbles, tool-call indicator, typing, inline recipe card.

function Bubble({ role, children }) {
  return <div className={'bubble bubble--' + role}>{children}</div>;
}

function Typing() {
  return <div className="bubble bubble--assistant"><span className="typing"><i></i><i></i><i></i></span></div>;
}

function ToolCall({ done, label, result }) {
  return done ? (
    <div className="toolcall toolcall--done"><Icon name="Check" size={16} />{result}</div>
  ) : (
    <div className="toolcall"><span className="spinner"></span>{label}</div>
  );
}

// Stream text in word-by-word for the "alive" assistant feel.
function StreamingText({ text, onDone }) {
  const [shown, setShown] = React.useState('');
  React.useEffect(() => {
    const words = text.split(' ');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(words.slice(0, i).join(' '));
      if (i >= words.length) { clearInterval(id); onDone && onDone(); }
    }, 55);
    return () => clearInterval(id);
  }, []);
  return <span>{shown}</span>;
}

const GREETING = 'Здравствуйте! Что приготовить сегодня? Подскажу рецепт из того, что есть в кладовой.';

function ChatScreen({ onOpenCook, onToast }) {
  const [items, setItems] = React.useState([
    { kind: 'assistant', text: GREETING },
  ]);
  const [draft, setDraft] = React.useState('Что приготовить из курицы и риса?');
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [items]);

  const send = () => {
    if (!draft.trim() || busy) return;
    const q = draft.trim();
    setDraft('');
    setBusy(true);
    setItems((x) => [...x, { kind: 'user', text: q }]);
    // 1) tool-call spinner
    setTimeout(() => setItems((x) => [...x, { kind: 'tool', done: false, label: 'Проверяю кладовую…' }]), 450);
    // 2) collapse to checkmark
    setTimeout(() => setItems((x) => x.map((m, i) => i === x.length - 1 ? { ...m, done: true, result: 'Нашёл 4 из 5 ингредиентов' } : m)), 1900);
    // 3) typing
    setTimeout(() => setItems((x) => [...x, { kind: 'typing' }]), 2200);
    // 4) streamed reply + recipe card
    setTimeout(() => setItems((x) => [
      ...x.filter((m) => m.kind !== 'typing'),
      { kind: 'stream', text: 'Давайте сделаем плов — не хватает только моркови. Вот рецепт:' },
    ]), 3000);
    setTimeout(() => { setItems((x) => [...x, { kind: 'recipe' }]); setBusy(false); }, 3900);
  };

  return (
    <div className="chat-screen">
      <div className="appmain" ref={scrollRef}>
        <div className="chat-scroll">
          <div className="day-label t-caption">СЕГОДНЯ</div>
          {items.map((m, i) => {
            if (m.kind === 'user') return <Bubble key={i} role="user">{m.text}</Bubble>;
            if (m.kind === 'assistant') return <Bubble key={i} role="assistant">{m.text}</Bubble>;
            if (m.kind === 'stream') return <Bubble key={i} role="assistant"><StreamingText text={m.text} onDone={() => scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight)} /></Bubble>;
            if (m.kind === 'typing') return <Typing key={i} />;
            if (m.kind === 'tool') return <ToolCall key={i} done={m.done} label={m.label} result={m.result} />;
            if (m.kind === 'recipe') return <RecipeCard key={i} recipe={RECIPE} onCook={onOpenCook} onSave={() => onToast('Рецепт сохранён')} />;
            return null;
          })}
        </div>
      </div>
      <div className="chatbar">
        <textarea
          rows={1}
          placeholder="Спросите что-нибудь…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button className="send" onClick={send} disabled={!draft.trim() || busy} aria-label="Отправить">
          <Icon name="ArrowUp" size={22} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ChatScreen, Bubble });
