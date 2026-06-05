<script lang="ts">
  import "../app.css";
  import { page } from "$app/state";
  import { BookOpen, MessageCircle, Refrigerator } from "lucide-svelte";

  let { children } = $props();

  const tabs = [
    { href: "/chat", label: "Чат", icon: MessageCircle },
    { href: "/pantry", label: "Кладовая", icon: Refrigerator },
    { href: "/recipes", label: "Рецепты", icon: BookOpen },
  ];

  // Тема: следуем системной настройке (ручной переключатель добавим позже).
  $effect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  });

  const showNav = $derived(!page.url.pathname.startsWith("/redeem"));
</script>

<div class="app">
  <div class="app-body">
    {@render children()}
  </div>
  {#if showNav}
    <nav class="bottomnav">
      {#each tabs as tab (tab.href)}
        {@const TabIcon = tab.icon}
        <a href={tab.href} class:active={page.url.pathname.startsWith(tab.href)}>
          <TabIcon size={24} />
          <span>{tab.label}</span>
        </a>
      {/each}
    </nav>
  {/if}
</div>
