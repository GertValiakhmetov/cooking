/* Chat screen — feed, scripted send flow (user bubble → tool-call → streamed reply),
   word-by-word streaming, and scroll-follow with a "к новым сообщениям" pill. */

let CHAT_UID = 0;
const cuid = () => ++CHAT_UID;

function ToolCall({ status, text, done }) {
  const isDone = status === 'done';
  return (
    <div className={'toolcall' + (isDone ? ' toolcall--done' : '')}>
      {isDone ? <Icon name="check" size={16} color="var(--success)" /> : <span className="spinner"></span>}
      {isDone ? done : text}
    </div>
  );
}

function MsgRow({ side, text, streaming, mode, onCopy }) {
  return (
    <div className={'msg msg--' + side}>
      <div className={'bubble bubble--' + side}>
        {text}{streaming && <span className="caret"></span>}
      </div>
      {mode !== 'mobile' && !streaming && text && (
        <div className="msg-actions">
          <button className="msg-act" onClick={() => onCopy(text)} title="Копировать">
            <Icon name="copy" size={14} />Копировать
          </button>
        </div>
      )}
    </div>
  );
}

/* Confirmation card for the onboarding pantry-seeding demo. */
function PantryAddedCard({ items, onEdit }) {
  return (
    <div className="padd">
      <div className="padd-head">
        <span className="padd-badge"><Icon name="check" size={16} /></span>
        <span className="padd-title">Добавлено в кладовку</span>
        <span className="padd-count">{items.length}</span>
      </div>
      <div className="padd-list">
        {items.map((it) => (
          <div className="padd-item" key={it.id}>
            <span className="pi-check"><Icon name="check" size={18} /></span>
            <span className="pi-name">{it.name}</span>
            <span className="pi-qty">{it.amount == null ? 'по вкусу' : it.amount + (it.unit ? ' ' + it.unit : '')}</span>
          </div>
        ))}
      </div>
      <div className="padd-foot">
        <button className="btn btn--secondary" onClick={onEdit}><Icon name="pencil" size={16} />Изменить в кладовой</button>
      </div>
    </div>
  );
}

function ChatScreen({ fresh, mode, scenario, onCook, onSave, onCopy, onSeedPantry, onEditPantry }) {
  const [msgs, setMsgs] = React.useState(() => {
    if (scenario === 'pantry') return [{ id: cuid(), from: 'assistant', text: window.ONB.assistantPrompt }];
    return fresh ? [] : window.CHAT_SEED.map((m) => ({ ...m, id: cuid() }));
  });
  const [draft, setDraft] = React.useState(scenario === 'pantry' ? window.ONB.userExample : '');
  const seededRef = React.useRef(false);
  const [busy, setBusy] = React.useState(false);
  const [following, setFollowing] = React.useState(true);
  const [showPill, setShowPill] = React.useState(false);

  const scrollRef = React.useRef(null);
  const taRef = React.useRef(null);
  const sendCount = React.useRef(0);

  /* autofocus the input on desktop / rail (not mobile — avoids popping the keyboard) */
  React.useEffect(() => {
    if (mode !== 'mobile' && taRef.current) taRef.current.focus();
  }, [mode]);

  function copy(text) {
    try { navigator.clipboard && navigator.clipboard.writeText(text); } catch (e) {}
    if (onCopy) onCopy(text);
  }

  /* auto-scroll while the feed is being followed */
  React.useEffect(() => {
    if (following && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, following]);

  /* word-by-word streaming driver — advances the single active streaming message */
  React.useEffect(() => {
    const idx = msgs.findIndex((m) => m.streaming);
    if (idx === -1) return;
    const m = msgs[idx];

    if (m.shown >= m.words.length) {
      setMsgs((prev) => prev.map((x, i) => (i === idx ? { ...x, streaming: false } : x)));
      if (m.then === 'recipe') {
        setTimeout(() => setMsgs((prev) => [...prev, { id: cuid(), from: 'recipe' }]), 320);
      } else if (m.then === 'pantry') {
        if (!seededRef.current) { seededRef.current = true; if (onSeedPantry) onSeedPantry(window.PANTRY_PARSE); }
        setTimeout(() => setMsgs((prev) => [...prev, { id: cuid(), from: 'pantry-added' }]), 320);
      }
      setBusy(false);
      return;
    }
    const t = setTimeout(() => {
      setMsgs((prev) => prev.map((x, i) => (i === idx ? { ...x, shown: x.shown + 1 } : x)));
    }, 62);
    return () => clearTimeout(t);
  }, [msgs]);

  function addStream(text, then) {
    setMsgs((prev) => [...prev, { id: cuid(), from: 'assistant', words: text.split(' '), shown: 0, streaming: true, then }]);
  }

  function send() {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft('');
    if (taRef.current) taRef.current.style.height = 'auto';
    setBusy(true);
    setFollowing(true);
    setShowPill(false);

    const no = sendCount.current + 1;
    sendCount.current = no;

    // 1. my bubble appears immediately
    setMsgs((prev) => [...prev, { id: cuid(), from: 'user', text }]);

    const pantryFirst = scenario === 'pantry' && no === 1;

    // 2. tool-call indicator with spinner (~1.5s) → collapses to a quiet checkmark line
    const T = pantryFirst ? window.TOOLCALL_PANTRY : window.TOOLCALL;
    setTimeout(() => {
      setMsgs((prev) => [...prev, { id: cuid(), from: 'tool', status: 'running', text: T.running, done: T.done }]);
    }, 450);
    setTimeout(() => {
      setMsgs((prev) => prev.map((m) => (m.from === 'tool' && m.status === 'running' ? { ...m, status: 'done' } : m)));
    }, 450 + 1500);

    // 3. assistant reply streams in
    setTimeout(() => {
      const S = window.SCRIPT;
      if (scenario === 'pantry') {
        if (no === 1) addStream(window.ONB.pantryDonePhrase, 'pantry'); // parse → confirmation card
        else addStream(window.ONB.pantryGeneric, null);
      } else if (no === 1) addStream(S.options, null);          // first send → 3 dinner options
      else if (no === 2) addStream(S.beforeRecipe, 'recipe'); // second send → phrase + recipe card
      else addStream(S.generic, null);
    }, 450 + 1500 + 420);
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = dist < 60;
    setFollowing(atBottom);
    setShowPill(!atBottom);
  }

  function toBottom() {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setFollowing(true);
    setShowPill(false);
  }

  function onInput(e) {
    setDraft(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  return (
    <div className="screen">
      <div className="chat-scroll" ref={scrollRef} onScroll={onScroll}>
        {msgs.length === 0 ? (
          <div className="stub" style={{ paddingTop: 'var(--space-16)' }}>
            <div className="stub-ic"><Icon name="chef-hat" size={30} /></div>
            <div className="stub-title">Чем могу помочь?</div>
            <div className="stub-sub">Спросите, что приготовить из того, что есть, — я загляну в вашу кладовку.</div>
          </div>
        ) : (
          <div className="chat">
            {msgs.map((m) => {
              if (m.from === 'user') return <MsgRow key={m.id} side="user" text={m.text} mode={mode} onCopy={copy} />;
              if (m.from === 'assistant') {
                const text = m.words ? m.words.slice(0, m.shown).join(' ') : m.text;
                return <MsgRow key={m.id} side="assistant" text={text} streaming={m.streaming} mode={mode} onCopy={copy} />;
              }
              if (m.from === 'tool') return <ToolCall key={m.id} {...m} />;
              if (m.from === 'recipe') return <RecipeCard key={m.id} onCook={onCook} onSave={onSave} />;
              if (m.from === 'pantry-added') return <PantryAddedCard key={m.id} items={window.PANTRY_PARSE} onEdit={onEditPantry} />;
              return null;
            })}
          </div>
        )}
      </div>

      <button className={'scroll-pill' + (showPill ? ' show' : '')} onClick={toBottom}>
        <Icon name="arrow-down" size={16} />К новым сообщениям
      </button>

      <div className="chatbar">
        <div className="chatbar-inner">
          <textarea
            ref={taRef}
            placeholder="Спросите что-нибудь…"
            value={draft}
            onChange={onInput}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
          ></textarea>
          <button className="send" disabled={!draft.trim() || busy} onClick={send} aria-label="Отправить">
            <Icon name="arrow-up" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

window.ChatScreen = ChatScreen;
