<script lang="ts">
  import "../app.css";
  import { page } from "$app/state";
  import { BookOpen, MessageCircle, Moon, Refrigerator, Sun } from "lucide-svelte";
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
              <a
                href={`/chat?c=${c.id}`}
                class="conv"
                class:active={isActiveTab("/chat") && activeConvId === c.id}
              >
                <span class="conv-ic"><MessageCircle size={18} /></span>
                <span class="conv-title">{convTitle(c)}</span>
              </a>
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
