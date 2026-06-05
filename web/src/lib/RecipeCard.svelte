<script lang="ts">
  import { Bookmark, ChefHat, Check, Clock, Pause, Timer, Trash2, Users, X } from "lucide-svelte";
  import type { Recipe } from "./recipe";

  let {
    recipe,
    onsave,
    oncook,
    ondelete,
    saved = false,
    missing,
  }: {
    recipe: Recipe;
    onsave?: () => void;
    oncook?: () => void;
    ondelete?: () => void;
    saved?: boolean;
    // Set of ingredient names not in the pantry (from POST /recipes/:id/check).
    // When provided, ingredients show ✓/✗ marks and a "Не хватает N" badge.
    missing?: Set<string>;
  } = $props();

  const missingCount = $derived(
    missing ? recipe.ingredients.filter((i) => missing.has(i.name)).length : 0,
  );

  let servings = $state(recipe.servings);
  const ratio = $derived(recipe.servings > 0 ? servings / recipe.servings : 1);

  // Scale a base amount by the servings ratio, formatted the Russian way (comma decimals).
  function scaleAmount(amount: number | null, unit: string | null): string {
    if (amount == null) return "по вкусу";
    const v = amount * ratio;
    let out: number;
    if (unit === "г" || unit === "мл") {
      out = v >= 100 ? Math.round(v / 10) * 10 : Math.round(v);
    } else {
      out = Math.round(v * 2) / 2;
    }
    const str = Number.isInteger(out) ? String(out) : String(out).replace(".", ",");
    return unit ? `${str} ${unit}` : str;
  }

  function clock(total: number): string {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  // Live countdowns, keyed per step index.
  type TimerState = { left: number; running: boolean; handle: ReturnType<typeof setInterval> | null };
  const timers = $state<Record<number, TimerState>>({});

  function timerLabel(i: number, seconds: number): string {
    const t = timers[i];
    if (!t) return clock(seconds);
    if (t.left === 0) return "Готово";
    return clock(t.left);
  }

  function toggleTimer(i: number, seconds: number): void {
    const cur = timers[i] ?? { left: seconds, running: false, handle: null };
    if (cur.left === 0) {
      timers[i] = { left: seconds, running: false, handle: null };
      return;
    }
    if (cur.running) {
      if (cur.handle) clearInterval(cur.handle);
      timers[i] = { left: cur.left, running: false, handle: null };
      return;
    }
    const handle = setInterval(() => {
      const t = timers[i];
      if (!t) return;
      const left = Math.max(0, t.left - 1);
      if (left === 0 && t.handle) clearInterval(t.handle);
      timers[i] = { left, running: left > 0, handle: left > 0 ? t.handle : null };
    }, 1000);
    timers[i] = { left: cur.left, running: true, handle };
  }
</script>

<div class="card rc rc-enter">
  <div class="rc-head">
    <div class="rc-title">{recipe.title}</div>
    <div class="rc-meta">
      {#if recipe.totalMinutes != null}
        <span class="row"><Clock size={16} />{recipe.totalMinutes} мин</span>
      {/if}
      <span class="stepper">
        <Users size={18} color="var(--text-secondary)" />
        <button type="button" aria-label="Меньше порций" onclick={() => (servings = Math.max(1, servings - 1))}>−</button>
        <span class="n">{servings}</span>
        <button type="button" aria-label="Больше порций" onclick={() => (servings = Math.min(24, servings + 1))}>+</button>
      </span>
    </div>
  </div>

  <div class="rc-body">
    <div class="rc-col rc-col--ing">
      <div class="rc-section-label">
        Ингредиенты
        {#if missingCount > 0}<span class="tag tag--missing">Не хватает {missingCount}</span>{/if}
      </div>
      {#each recipe.ingredients as ing (ing.name)}
        <div class="ing" class:missing={missing?.has(ing.name)}>
          {#if missing}
            <span class="mark" style="color: {missing.has(ing.name) ? 'var(--warning)' : 'var(--success)'}">
              {#if missing.has(ing.name)}<X size={20} />{:else}<Check size={20} />{/if}
            </span>
          {/if}
          {ing.name}
          <span class="qty">{scaleAmount(ing.amount, ing.unit)}</span>
        </div>
      {/each}
    </div>

    <div class="rc-col rc-col--steps">
      <div class="rc-section-label">Приготовление</div>
      <div class="steps">
        {#each recipe.steps as step, i (i)}
          <div class="step">
            <span class="step-n">{i + 1}</span>
            <div class="step-main">
              <div class="step-text">
                {#if step.title}<div class="step-title">{step.title}</div>{/if}
                {step.content}
              </div>
              {#if step.timerSeconds}
                <button
                  type="button"
                  class="step-timer"
                  class:step-timer--running={timers[i]?.running}
                  class:step-timer--done={timers[i]?.left === 0}
                  onclick={() => toggleTimer(i, step.timerSeconds ?? 0)}
                >
                  {#if timers[i]?.running}<Pause size={18} />{:else}<Timer size={18} />{/if}
                  <span class="time">{timerLabel(i, step.timerSeconds)}</span>
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    {#if recipe.notes.length > 0}
      <div class="rc-notes">
        <div class="rc-section-label">Заметки</div>
        <div class="notes">
          {#each recipe.notes as note (note)}
            <div class="note"><span>{note}</span></div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div class="rc-actions">
    {#if ondelete}
      <button type="button" class="btn btn--destructive" onclick={() => ondelete?.()}>
        <Trash2 size={18} />Удалить
      </button>
    {:else}
      <button type="button" class="btn btn--secondary" onclick={() => onsave?.()} disabled={saved}>
        <Bookmark size={18} />{saved ? "Сохранено" : "Сохранить рецепт"}
      </button>
    {/if}
    <button type="button" class="btn btn--primary" onclick={() => oncook?.()}>
      <ChefHat size={18} />Готовить
    </button>
  </div>
</div>
