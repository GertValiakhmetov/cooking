<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { ArrowDown, ArrowUp, Check, Copy, Menu, Moon, Sun } from "lucide-svelte";
  import { type StoredMessage, api } from "$lib/api";
  import { streamChat } from "$lib/chat-stream";
  import { conversations } from "$lib/conversations.svelte";
  import CookingMode from "$lib/CookingMode.svelte";
  import { renderMarkdown } from "$lib/markdown";
  import RecipeCard from "$lib/RecipeCard.svelte";
  import { asRecipe, type Recipe } from "$lib/recipe";
  import { theme } from "$lib/theme.svelte";
  import { ui } from "$lib/ui.svelte";

  type Entry =
    | { id: number; kind: "user"; text: string }
    | { id: number; kind: "assistant"; text: string; streaming: boolean }
    | { id: number; kind: "tool"; label: string; doneLabel: string; running: boolean }
    | { id: number; kind: "recipe"; recipe: Recipe; saved: boolean };

  const TOOL_LABELS: Record<string, [string, string]> = {
    get_inventory: ["Заглядываю в кладовку…", "Заглянул в кладовку"],
    search_inventory: ["Ищу в кладовке…", "Поискал в кладовке"],
    add_inventory_item: ["Добавляю в кладовку…", "Добавил в кладовку"],
    update_inventory_item: ["Обновляю кладовку…", "Обновил кладовку"],
    remove_inventory_item: ["Убираю из кладовки…", "Убрал из кладовки"],
    get_equipment: ["Смотрю оборудование…", "Посмотрел оборудование"],
    present_recipe: ["Составляю рецепт…", "Рецепт готов"],
    save_recipe: ["Сохраняю рецепт…", "Сохранил рецепт"],
  };

  let feed = $state<Entry[]>([]);
  // True while a switched-to conversation's history is being fetched; keeps the
  // "Чем могу помочь?" stub from flashing before the messages arrive.
  let loadingHistory = $state(false);
  let draft = $state("");
  let busy = $state(false);
  let following = $state(true);
  let showPill = $state(false);
  let toasts = $state<{ id: number; text: string }[]>([]);
  let cooking = $state<{ recipe: Recipe; servings: number } | null>(null);

  let scrollEl: HTMLDivElement | undefined;
  let taEl: HTMLTextAreaElement | undefined;

  let seq = 0;
  const nextId = () => ++seq;
  let lastLoadedId: string | null | undefined;
  let seeded = false;

  // Onboarding "Расскажи ассистенту" path lands here with ?seed=pantry — prefill a
  // starter so the user just lists products; the assistant records them via tools.
  $effect(() => {
    if (page.url.searchParams.get("seed") === "pantry" && !seeded) {
      seeded = true;
      draft = "Запиши, что у меня есть из продуктов: ";
      requestAnimationFrame(() => taEl?.focus());
    }
  });

  // The agent is working but has nothing on screen yet: before the first token,
  // after a tool finished (model is digesting the result), while a recipe builds.
  const thinking = $derived.by(() => {
    if (!busy) return false;
    const last = feed[feed.length - 1];
    if (!last) return false;
    if (last.kind === "tool") return !last.running;
    if (last.kind === "assistant") return !last.streaming;
    return true; // user message or recipe block
  });

  // Cooking-themed «thinking» verbs, claude.ai-style: a curated list rotated at
  // random — not model-generated (that would add latency to mask latency).
  const THINKING_PHRASES = [
    "Думаю…",
    "Помешиваю…",
    "Довожу до кипения…",
    "Шинкую…",
    "Мариную…",
    "Взбиваю…",
    "Томлю на медленном огне…",
    "Пробую на соль…",
    "Разогреваю сковородку…",
    "Заглядываю в поваренную книгу…",
    "Точу ножи…",
    "Завязываю фартук…",
    "Карамелизую…",
    "Снимаю пробу…",
    "Колдую над плитой…",
    "Сервирую мысли…",
  ];
  let thinkingPhrase = $state(THINKING_PHRASES[0]);
  $effect(() => {
    if (!thinking) return;
    // `current` is a plain local: the effect must not READ thinkingPhrase, or it
    // would depend on the very state it writes and loop (effect_update_depth_exceeded).
    let current = "";
    const pick = () => {
      let next = current;
      while (next === current) {
        next = THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)];
      }
      current = next;
      thinkingPhrase = next;
    };
    pick();
    const handle = setInterval(pick, 2500);
    return () => clearInterval(handle);
  });

  const convId = $derived(page.url.searchParams.get("c"));
  const conv = $derived(conversations.list.find((c) => c.id === convId));
  const title = $derived.by(() => {
    if (conv) return conv.title ?? "Новый чат";
    // An id is in the URL but the conversation list hasn't loaded yet — keep the
    // header blank instead of flashing «Новый чат» before the real title arrives.
    return convId && !conversations.loaded ? "" : "Новый чат";
  });

  function push<T extends Entry>(e: T): T {
    feed.push(e);
    return feed[feed.length - 1] as T;
  }

  function toast(text: string): void {
    const id = nextId();
    toasts.push({ id, text });
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
    }, 2600);
  }

  function buildFeed(messages: StoredMessage[]): Entry[] {
    const out: Entry[] = [];
    for (const m of messages) {
      const text = m.content
        .filter((b) => b.type === "text")
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("")
        .trim();
      if (m.role === "user") {
        if (text) out.push({ id: nextId(), kind: "user", text });
      } else {
        if (text) out.push({ id: nextId(), kind: "assistant", text, streaming: false });
        for (const b of m.content) {
          if (b.type === "tool_use" && b.name === "present_recipe") {
            const r = asRecipe(b.input);
            if (r) out.push({ id: nextId(), kind: "recipe", recipe: r, saved: false });
          }
        }
      }
    }
    return out;
  }

  async function loadHistory(id: string): Promise<void> {
    try {
      const { messages } = await api.conversations.messages(id);
      if (convId !== id) return; // stale response — the user switched again mid-flight
      feed = buildFeed(messages);
      scrollDown();
    } catch {
      /* transient — leave feed as-is */
    } finally {
      if (convId === id) loadingHistory = false;
    }
  }

  // Load history when the conversation changes (skip the id we just created ourselves).
  $effect(() => {
    const id = convId;
    if (id === lastLoadedId) return;
    lastLoadedId = id;
    feed = [];
    loadingHistory = id != null;
    if (id) void loadHistory(id);
  });

  function scrollDown(): void {
    requestAnimationFrame(() => {
      if (scrollEl && following) scrollEl.scrollTop = scrollEl.scrollHeight;
    });
  }

  function onScroll(): void {
    if (!scrollEl) return;
    const dist = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
    following = dist < 60;
    showPill = !following;
  }

  function toBottom(): void {
    if (scrollEl) scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
    following = true;
    showPill = false;
  }

  function autoresize(): void {
    if (!taEl) return;
    taEl.style.height = "auto";
    // scrollHeight = content + padding (no border); with box-sizing: border-box the
    // height must include the border too, or a single line gets clipped and scrolls.
    const border = taEl.offsetHeight - taEl.clientHeight;
    taEl.style.height = `${Math.min(taEl.scrollHeight + border, 120)}px`;
  }

  async function copy(text: string): Promise<void> {
    try {
      await navigator.clipboard?.writeText(text);
      toast("Скопировано");
    } catch {
      /* clipboard blocked */
    }
  }

  async function saveRecipe(entry: Entry): Promise<void> {
    if (entry.kind !== "recipe" || entry.saved) return;
    try {
      await api.recipes.save(entry.recipe);
      entry.saved = true;
      toast("Рецепт сохранён");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Не удалось сохранить");
    }
  }

  async function send(): Promise<void> {
    const text = draft.trim();
    if (!text || busy) return;
    draft = "";
    if (taEl) taEl.style.height = "auto";
    busy = true;
    following = true;
    showPill = false;

    let id = convId;
    if (!id) {
      const created = await conversations.create();
      id = created.id;
      lastLoadedId = id; // prevent the load effect from wiping the feed
      await goto(`/chat?c=${id}`, { replaceState: true });
    }

    push({ id: nextId(), kind: "user", text });
    scrollDown();

    let assistant: Extract<Entry, { kind: "assistant" }> | null = null;
    let openTool: Extract<Entry, { kind: "tool" }> | null = null;
    const closeTool = () => {
      if (openTool) {
        openTool.running = false;
        openTool = null;
      }
    };

    try {
      for await (const ev of streamChat(id, text)) {
        if (ev.type === "text") {
          closeTool();
          if (!assistant) {
            assistant = push({ id: nextId(), kind: "assistant", text: "", streaming: true });
          }
          assistant.text += ev.text;
        } else if (ev.type === "tool") {
          if (ev.phase === "start") {
            closeTool();
            const [label, doneLabel] = TOOL_LABELS[ev.name] ?? ["Работаю…", "Готово"];
            openTool = push({ id: nextId(), kind: "tool", label, doneLabel, running: true });
          } else {
            closeTool();
          }
        } else if (ev.type === "recipe") {
          closeTool();
          if (assistant) assistant.streaming = false;
          assistant = null;
          push({ id: nextId(), kind: "recipe", recipe: ev.recipe, saved: false });
        } else if (ev.type === "error") {
          closeTool();
          toast(ev.message);
        }
        scrollDown();
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Ошибка соединения");
    } finally {
      closeTool();
      if (assistant) assistant.streaming = false;
      busy = false;
      void conversations.reload(); // pick up the server-side auto-title + new order
    }
  }
</script>

<div class="screen">
  {#if ui.mode === "mobile"}
    <header class="topbar">
      <button class="icon-btn" aria-label="Чаты" onclick={() => (ui.drawerOpen = true)}><Menu size={24} /></button>
      <div class="topbar-title">
        <span class="tt-eyebrow">Су-шеф</span>
        <span class="tt-name">{title}</span>
      </div>
      <button class="icon-btn" title="Тема" onclick={() => theme.toggle()}>
        {#if theme.current === "light"}<Moon size={22} />{:else}<Sun size={22} />{/if}
      </button>
    </header>
  {:else}
    <header class="main-header">
      <div class="main-header-inner">
        <div>
          <div class="mh-eyebrow">Су-шеф</div>
          <span class="mh-title">{title}</span>
        </div>
      </div>
    </header>
  {/if}

  <div class="chat-scroll" bind:this={scrollEl} onscroll={onScroll}>
    {#if feed.length === 0 && !loadingHistory}
      <div class="stub" style="padding-top: var(--space-12)">
        <img class="stub-gif" src="/img/chef-cooking.gif" alt="" />
        <div class="stub-title">Чем могу помочь?</div>
        <div class="stub-sub">Спроси, что приготовить из того, что есть — я загляну в твою кладовку.</div>
      </div>
    {:else}
      <div class="chat">
        {#each feed as entry (entry.id)}
          {#if entry.kind === "user"}
            <div class="msg msg--user">
              <div class="bubble bubble--user">{entry.text}</div>
              {#if ui.mode !== "mobile"}
                <div class="msg-actions">
                  <button class="msg-act" onclick={() => copy(entry.text)}><Copy size={14} />Копировать</button>
                </div>
              {/if}
            </div>
          {:else if entry.kind === "assistant"}
            <div class="msg msg--assistant">
              <!-- eslint-disable-next-line svelte/no-at-html-tags — sanitized in renderMarkdown -->
              <div class="bubble bubble--assistant bubble--md" class:streaming={entry.streaming}>
                {@html renderMarkdown(entry.text)}
              </div>
              {#if ui.mode !== "mobile" && !entry.streaming && entry.text}
                <div class="msg-actions">
                  <button class="msg-act" onclick={() => copy(entry.text)}><Copy size={14} />Копировать</button>
                </div>
              {/if}
            </div>
          {:else if entry.kind === "tool"}
            <div class="toolcall" class:toolcall--done={!entry.running}>
              {#if entry.running}<span class="spinner"></span>{entry.label}
              {:else}<Check size={16} color="var(--success)" />{entry.doneLabel}{/if}
            </div>
          {:else if entry.kind === "recipe"}
            <RecipeCard
              recipe={entry.recipe}
              saved={entry.saved}
              onsave={() => saveRecipe(entry)}
              oncook={(servings) => (cooking = { recipe: entry.recipe, servings })}
            />
          {/if}
        {/each}
        {#if thinking}
          <div class="toolcall">
            <span class="spinner"></span>{#key thinkingPhrase}<span class="thinking-phrase">{thinkingPhrase}</span>{/key}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <button class="scroll-pill" class:show={showPill} onclick={toBottom}>
    <ArrowDown size={16} />К новым сообщениям
  </button>

  <div class="chatbar">
    <div class="chatbar-inner">
      <textarea
        bind:this={taEl}
        bind:value={draft}
        oninput={autoresize}
        onkeydown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void send();
          }
        }}
        placeholder="Спроси что-нибудь…"
        rows={1}
      ></textarea>
      <button class="send" disabled={!draft.trim() || busy} onclick={send} aria-label="Отправить">
        <ArrowUp size={24} />
      </button>
    </div>
  </div>

  {#if toasts.length > 0}
    <div class="toast-wrap">
      {#each toasts as t (t.id)}
        <div class="toast"><span>{t.text}</span></div>
      {/each}
    </div>
  {/if}

  {#if cooking}
    <CookingMode
      recipe={cooking.recipe}
      servings={cooking.servings}
      onclose={() => (cooking = null)}
      ondone={() => (cooking = null)}
    />
  {/if}
</div>
