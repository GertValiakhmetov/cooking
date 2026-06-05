<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { BookOpen, MessageCircle, Moon, Pencil, Refrigerator, Sun, Trash2 } from "lucide-svelte";
  import { type Conversation, api } from "$lib/api";
  import { auth } from "$lib/auth.svelte";
  import { conversations } from "$lib/conversations.svelte";
  import { theme } from "$lib/theme.svelte";
  import { modeForWidth, ui } from "$lib/ui.svelte";

  let { children } = $props();

  const tabs = [
    { href: "/chat", label: "Чат", icon: MessageCircle },
    { href: "/pantry", label: "Кладовая", icon: Refrigerator },
    { href: "/recipes", label: "Рецепты", icon: BookOpen },
  ];

  // Режим раскладки: <768 mobile, 768–1023 rail, ≥1024 desktop (как в прототипе).
  $effect(() => {
    const apply = () => {
      ui.mode = modeForWidth(window.innerWidth);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  });

  // Тема: системная по умолчанию, ручной выбор перекрывает.
  $effect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      theme.system = mq.matches ? "dark" : "light";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  });
  $effect(() => {
    document.documentElement.setAttribute("data-theme", theme.current);
  });

  // Профиль: невалидный токен сбросится сам (401 -> logout в api-клиенте).
  $effect(() => {
    if (auth.token && !auth.user) {
      api
        .me()
        .then((user) => {
          auth.user = user;
        })
        .catch(() => {});
    }
  });

  // Диалоги для сайдбара — общий стор (страница чата обновляет его после отправки).
  $effect(() => {
    if (auth.token) void conversations.reload();
  });

  const onRedeem = $derived(page.url.pathname.startsWith("/redeem"));
  const onOnboarding = $derived(page.url.pathname.startsWith("/onboarding"));
  const activeConvId = $derived(page.url.searchParams.get("c"));
  const isActiveTab = (href: string) => page.url.pathname.startsWith(href);
  const convTitle = (c: Conversation) => c.title ?? "Новый чат";

  // ---- sidebar conversation rename / delete ----
  let editingId = $state<string | null>(null);
  let editDraft = $state("");

  function focusInput(node: HTMLInputElement) {
    node.focus();
    node.select();
  }
  function startRename(c: Conversation) {
    editingId = c.id;
    editDraft = c.title ?? "";
  }
  async function commitRename(c: Conversation) {
    const v = editDraft.trim();
    editingId = null;
    if (v && v !== c.title) await conversations.rename(c.id, v).catch(() => {});
  }
  async function removeConv(c: Conversation) {
    const wasActive = activeConvId === c.id;
    await conversations.remove(c.id).catch(() => {});
    if (wasActive) await goto("/chat");
  }
</script>

<div class="app app--{ui.mode}">
  {#if onRedeem}
    <div class="main">
      {@render children()}
    </div>
  {:else if !auth.token}
    <!-- Гард: без сессии приложение закрыто — вход только по инвайт-ссылке. -->
    <div class="main">
      <div class="gate">
        <span class="brand-mark gate-mark">С</span>
        <h1 class="t-title">Су-шеф</h1>
        <p class="t-body-large">Это приложение по приглашениям.</p>
        <p class="t-caption">Открой инвайт-ссылку, которую тебе прислали, чтобы войти.</p>
      </div>
    </div>
  {:else if onOnboarding}
    <!-- Авторизован, но в онбординге — полноэкранный флоу без навигации. -->
    <div class="main">
      {@render children()}
    </div>
  {:else}
    {#if ui.mode === "desktop"}
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-mark">С</span><span class="brand-name">Су-шеф</span>
        </div>
        <nav class="sidebar-nav">
          {#each tabs as tab (tab.href)}
            {@const TabIcon = tab.icon}
            <a href={tab.href} class="nav-item" class:active={isActiveTab(tab.href)}>
              <TabIcon size={20} />{tab.label}
            </a>
          {/each}
        </nav>
        <div class="sidebar-convs">
          <div class="sidebar-convs-head">
            <span>Чаты</span>
          </div>
          <div class="conv-list">
            {#each conversations.list as c (c.id)}
              {#if editingId === c.id}
                <div class="conv">
                  <span class="conv-ic"><MessageCircle size={18} /></span>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <input
                    class="conv-edit"
                    bind:value={editDraft}
                    use:focusInput
                    onkeydown={(e) => {
                      if (e.key === "Enter") commitRename(c);
                      else if (e.key === "Escape") editingId = null;
                    }}
                    onblur={() => commitRename(c)}
                  />
                </div>
              {:else}
                <div
                  class="conv"
                  class:active={isActiveTab("/chat") && activeConvId === c.id}
                  role="button"
                  tabindex="0"
                  onclick={() => goto(`/chat?c=${c.id}`)}
                  onkeydown={(e) => { if (e.key === "Enter") goto(`/chat?c=${c.id}`); }}
                >
                  <span class="conv-ic"><MessageCircle size={18} /></span>
                  <span class="conv-title">{convTitle(c)}</span>
                  <span class="conv-actions">
                    <button class="conv-act" title="Переименовать" onclick={(e) => { e.stopPropagation(); startRename(c); }}>
                      <Pencil size={15} />
                    </button>
                    <button class="conv-act danger" title="Удалить" onclick={(e) => { e.stopPropagation(); removeConv(c); }}>
                      <Trash2 size={15} />
                    </button>
                  </span>
                </div>
              {/if}
            {/each}
          </div>
        </div>
        <div class="sidebar-foot">
          <button class="theme-row" onclick={() => theme.toggle()}>
            {#if theme.current === "light"}<Moon size={20} />Тёмная тема
            {:else}<Sun size={20} />Светлая тема{/if}
          </button>
        </div>
      </aside>
    {:else if ui.mode === "rail"}
      <aside class="rail">
        <span class="brand-mark">С</span>
        <nav class="rail-nav">
          {#each tabs as tab (tab.href)}
            {@const TabIcon = tab.icon}
            <a
              href={tab.href}
              class="rail-item"
              class:active={isActiveTab(tab.href)}
              title={tab.label}
            >
              <TabIcon size={24} />
            </a>
          {/each}
        </nav>
        <div class="rail-foot">
          <button class="icon-btn" title="Тема" onclick={() => theme.toggle()}>
            {#if theme.current === "light"}<Moon size={22} />{:else}<Sun size={22} />{/if}
          </button>
        </div>
      </aside>
    {/if}

    <div class="main">
      {@render children()}
      {#if ui.mode === "mobile"}
        <nav class="bottomnav">
          {#each tabs as tab (tab.href)}
            {@const TabIcon = tab.icon}
            <a href={tab.href} class:active={isActiveTab(tab.href)}>
              <TabIcon size={24} />
              <span>{tab.label}</span>
            </a>
          {/each}
        </nav>
      {/if}
    </div>
  {/if}
</div>
