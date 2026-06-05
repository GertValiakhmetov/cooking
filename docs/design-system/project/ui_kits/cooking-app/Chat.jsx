/* Chat screen — conversation, streaming assistant, tool-call indicator, pinned input. */
function ToolCall({ msg }) {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={'toolcall' + (done ? ' toolcall--done' : '')}>
      {done ? <Icon name="check" size={16} /> : <span className="spinner"></span>}
      {done ? msg.done : msg.text}
    </div>
  );
}

function Typing() {
  return <div className="bubble bubble--assistant"><span className="typing"><i></i><i></i><i></i></span></div>;
}

function ChatScreen({ onCook }) {
  const [msgs, setMsgs] = React.useState(window.CHAT_SEED);
  const [draft, setDraft] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: 'user', text }]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: 'assistant', text: 'Хорошо! Дайте проверю, что можно приготовить из этого.' }]);
    }, 1400);
  }

  return (
    <div className="screen">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">С</span><span className="t-title">Су-шеф</span></div>
        <button className="icon-btn"><Icon name="square-pen" size={22} /></button>
      </header>

      <div className="chat-scroll" ref={scrollRef}>
        <div className="chat">
          {msgs.map((m, i) => {
            if (m.from === 'user') return <div key={i} className="bubble bubble--user">{m.text}</div>;
            if (m.from === 'assistant') return <div key={i} className="bubble bubble--assistant">{m.text}</div>;
            if (m.from === 'tool') return <ToolCall key={i} msg={m} />;
            if (m.from === 'recipe') return <RecipeCard key={i} onCook={onCook} />;
            return null;
          })}
          {typing && <Typing />}
        </div>
      </div>

      <div className="chatbar">
        <textarea
          placeholder="Спросите что-нибудь…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={1}
        ></textarea>
        <button className="send" disabled={!draft.trim()} onClick={send}>
          <Icon name="arrow-up" size={24} />
        </button>
      </div>
    </div>
  );
}

window.ChatScreen = ChatScreen;
