<script lang="ts">
  import { goto } from "$app/navigation";
  import { AlertTriangle, ArrowLeft, Bookmark, Check, Clock, MessageCircle, Search, UtensilsCrossed, Users } from "lucide-svelte";
  import { type SavedRecipe, api } from "$lib/api";
  import CookingMode from "$lib/CookingMode.svelte";
  import RecipeCard from "$lib/RecipeCard.svelte";
  import type { Recipe } from "$lib/recipe";

  let recipes = $state<SavedRecipe[]>([]);
  let q = $state("");
  let detail = $state<SavedRecipe | null>(null);
  let cooking = $state<Recipe | null>(null);
  // recipeId → set of missing ingredient names (from POST /recipes/:id/check)
  let missingMap = $state<Record<string, Set<string>>>({});
  let toasts = $state<{ id: number; text: string; undo?: () => void }[]>([]);

  let seq = 0;
  function toast(text: string, undo?: () => void): void {
    const id = ++seq;
    toasts.push({ id, text, undo });
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
    }, 3200);
  }

  $effect(() => {
    void api.recipes
      .list()
      .then(({ recipes: rs }) => {
        recipes = rs;
        for (const r of rs) {
          api.recipes
            .check(r.id)
            .then(({ missing }) => {
              missingMap = { ...missingMap, [r.id]: new Set(missing) };
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  });

  const ql = $derived(q.trim().toLowerCase());
  const list = $derived(recipes.filter((r) => r.title.toLowerCase().includes(ql)));

  async function del(r: SavedRecipe): Promise<void> {
    recipes = recipes.filter((x) => x.id !== r.id);
    detail = null;
    try {
      await api.recipes.remove(r.id);
      toast(`«${r.title}» удалён`, async () => {
        const restored = await api.recipes.save(r);
        recipes = [restored, ...recipes];
      });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Не удалось удалить");
    }
  }
</script>

<div class="screen">
  {#if detail}
    <header class="topbar-plain">
      <button class="icon-btn" aria-label="Назад" onclick={() => (detail = null)}><ArrowLeft size={24} /></button>
      <span class="tp-title">{detail.title}</span>
    </header>
    <div class="detail-scroll">
      <div class="detail-inner">
        <RecipeCard
          recipe={detail}
          missing={missingMap[detail.id]}
          ondelete={() => detail && del(detail)}
          oncook={() => (cooking = detail)}
        />
      </div>
    </div>
  {:else}
    <header class="topbar-plain"><span class="tp-title">Рецепты</span></header>

    {#if recipes.length === 0}
      <div class="list-scroll">
        <div class="list-inner">
          <div class="empty">
            <div class="empty-ic"><Bookmark size={28} /></div>
            <div class="empty-text">Сохраняй рецепты из чата — они появятся здесь.</div>
            <button class="btn btn--primary" onclick={() => goto("/chat")}><MessageCircle size={20} />Перейти в чат</button>
          </div>
        </div>
      </div>
    {:else}
      <div class="screen-controls">
        <div class="search">
          <Search size={20} color="var(--text-secondary)" />
          <input placeholder="Искать в рецептах" bind:value={q} />
        </div>
      </div>
      <div class="list-scroll">
        <div class="list-inner">
          {#if list.length === 0}
            <div class="empty"><div class="empty-text">Ничего не найдено. Попробуй другое название.</div></div>
          {:else}
            <div class="saved-grid">
              {#each list as r (r.id)}
                <button class="saved-card" onclick={() => (detail = r)}>
                  <div class="saved-thumb"><UtensilsCrossed size={28} /></div>
                  <div class="saved-body">
                    <div class="saved-title">{r.title}</div>
                    <div class="saved-meta">
                      {#if r.totalMinutes != null}<span class="row"><Clock size={15} />{r.totalMinutes} мин</span>{/if}
                      <span class="row"><Users size={15} />{r.servings} порц.</span>
                    </div>
                    <div class="saved-badge">
                      {#if missingMap[r.id]}
                        {#if missingMap[r.id].size === 0}
                          <span class="tag tag--have"><Check size={14} />Всё есть</span>
                        {:else}
                          <span class="tag tag--missing"><AlertTriangle size={14} />Не хватает {missingMap[r.id].size}</span>
                        {/if}
                      {/if}
                    </div>
                  </div>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/if}

  {#if cooking}
    <CookingMode
      recipe={cooking}
      onclose={() => (cooking = null)}
      ondone={() => { cooking = null; toast("Готово! Приятного аппетита"); }}
    />
  {/if}

  {#if toasts.length > 0}
    <div class="toast-wrap">
      {#each toasts as t (t.id)}
        <div class="toast">
          <span>{t.text}</span>
          {#if t.undo}<button class="toast-action" onclick={() => { t.undo?.(); toasts = toasts.filter((x) => x.id !== t.id); }}>Вернуть</button>{/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
