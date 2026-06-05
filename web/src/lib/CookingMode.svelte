<script lang="ts">
  import {
    ArrowLeft,
    ArrowRight,
    BellRing,
    ChevronUp,
    Lightbulb,
    LightbulbOff,
    PartyPopper,
    Pause,
    Timer,
    X,
  } from "lucide-svelte";
  import { hasScalableSteps, portionsWord, type Recipe, scaleAmount, scaleStepSegments } from "./recipe";

  let {
    recipe,
    servings = recipe.servings,
    onclose,
    ondone,
  }: {
    recipe: Recipe;
    /** Порции, выбранные степпером карточки; по умолчанию — базовые из рецепта. */
    servings?: number;
    onclose: () => void;
    ondone: () => void;
  } = $props();

  const steps = recipe.steps;
  const last = steps.length - 1;
  const ratio = $derived(recipe.servings > 0 ? servings / recipe.servings : 1);
  const scalableSteps = $derived(hasScalableSteps(recipe));

  let idx = $state(0);
  let ingOpen = $state(false);
  let confirm = $state(false);
  let awake = $state(false);
  // Finish screen («Приятного аппетита!») shown after the last step, before ondone().
  let finished = $state(false);

  type TimerState = { total: number; left: number; running: boolean; done: boolean };
  const timers = $state<Record<number, TimerState>>(
    Object.fromEntries(
      steps.flatMap((s, i) =>
        s.timerSeconds
          ? [[i, { total: s.timerSeconds, left: s.timerSeconds, running: false, done: false }]]
          : [],
      ),
    ),
  );

  const anyRunning = $derived(Object.values(timers).some((t) => t.running && !t.done));
  const offscreen = $derived(
    Object.keys(timers)
      .map(Number)
      .filter((i) => i !== idx && (timers[i].running || timers[i].done)),
  );

  function clock(s: number): string {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  // Дисплейный кегль рассчитан на короткие команды; плотные многосоставные шаги
  // читаются легче меньшим размером и обычным начертанием.
  function textTier(content: string): string {
    if (content.length <= 90) return "";
    return content.length <= 200 ? "cook-text--m" : "cook-text--l";
  }

  // One ticking loop drives every running timer (they keep running across steps).
  $effect(() => {
    if (!anyRunning) return;
    const handle = setInterval(() => {
      for (const k of Object.keys(timers)) {
        const t = timers[Number(k)];
        if (!t || !t.running || t.done) continue;
        const left = t.left - 1;
        if (left <= 0) {
          t.left = 0;
          t.running = false;
          t.done = true;
          if ("vibrate" in navigator) navigator.vibrate([220, 120, 220]);
        } else {
          t.left = left;
        }
      }
    }, 1000);
    return () => clearInterval(handle);
  });

  // Keyboard: ←/→ navigate, Esc closes. Registered once; reads live state on each key.
  $effect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirm) {
        if (e.key === "Escape") confirm = false;
        return;
      }
      if (finished) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          finished = false;
        } else if (e.key === "ArrowRight" || e.key === "Enter") {
          e.preventDefault();
          ondone();
        } else if (e.key === "Escape") {
          e.preventDefault();
          attemptClose();
        }
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        attemptClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Wake lock — best-effort; the API may be absent or rejected.
  type WakeSentinel = { release: () => Promise<void> };
  let wake: WakeSentinel | null = null;
  function wakeApi() {
    return (navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeSentinel> } })
      .wakeLock;
  }
  async function toggleAwake(): Promise<void> {
    if (!awake) {
      try {
        wake = (await wakeApi()?.request("screen")) ?? null;
      } catch {
        wake = null;
      }
      awake = true;
    } else {
      try {
        await wake?.release();
      } catch {
        /* already released */
      }
      wake = null;
      awake = false;
    }
  }
  $effect(() => () => {
    wake?.release().catch(() => {});
  });

  function go(delta: number): void {
    idx = Math.max(0, Math.min(last, idx + delta));
  }
  function next(): void {
    if (idx === last) finished = true;
    else go(1);
  }
  function attemptClose(): void {
    if (anyRunning) confirm = true;
    else onclose();
  }
  function toggleTimer(): void {
    const t = timers[idx];
    if (!t) return;
    if (t.done) {
      t.left = t.total;
      t.done = false;
      t.running = false;
    } else {
      t.running = !t.running;
    }
  }

</script>

<div class="cook-overlay">
  <div class="cooking">
    <div class="cook-top">
      <button class="icon-btn" aria-label="Закрыть" onclick={attemptClose}><X size={24} /></button>
      <div class="cook-progress">
        <span class="cook-count">Шаг {idx + 1} из {steps.length}</span>
        <div class="cook-dots">
          {#each steps as step, i (i)}
            <span
              class="cook-dot"
              class:has-timer={!!step.timerSeconds}
              class:current={i === idx}
              class:done={i < idx || timers[i]?.done}
            ></span>
          {/each}
        </div>
      </div>
      <button class="cook-awake" class:on={awake} aria-pressed={awake} onclick={toggleAwake}>
        {#if awake}<Lightbulb size={18} />{:else}<LightbulbOff size={18} />{/if}
        <span class="lbl">Не гаснуть</span>
      </button>
    </div>

    {#if offscreen.length > 0}
      <div class="cook-chips">
        {#each offscreen as i (i)}
          <button class="cook-chip" class:alarm={timers[i].done} onclick={() => (idx = i)}>
            <span class="chip-ic">{#if timers[i].done}<BellRing size={16} />{:else}<Timer size={16} />{/if}</span>
            Шаг {i + 1} · {timers[i].done ? "Готово" : clock(timers[i].left)}
          </button>
        {/each}
      </div>
    {/if}

    {#if finished}
      <div class="cook-body cook-body--finish">
        <div class="cook-finish">
          <img class="cook-finish-gif" src="/img/bon-appetit.gif" alt="" />
          <div class="cook-finish-title">Приятного аппетита!</div>
          <div class="cook-finish-sub">{recipe.title} — готово</div>
        </div>
      </div>

      <div class="cook-nav">
        <button class="btn btn--secondary" onclick={() => (finished = false)}>
          <ArrowLeft size={20} />К шагам
        </button>
        <button class="btn btn--primary btn--done" onclick={ondone}>
          <PartyPopper size={20} />Завершить
        </button>
      </div>
    {:else}
      <div class="cook-body">
        <button class="cook-tap left" aria-label="Предыдущий шаг" disabled={idx === 0} onclick={() => go(-1)}></button>
        <button class="cook-tap right" aria-label="Следующий шаг" onclick={next}></button>

        <div class="cook-content">
          <div class="cook-stepnum">Шаг {idx + 1}</div>
          {#if steps[idx].title}<div class="cook-steptitle">{steps[idx].title}</div>{/if}
          <div class="cook-text {textTier(steps[idx].content)}">
            {#each scaleStepSegments(steps[idx].content, ratio) as seg, si (si)}{#if seg.qty}<span class="qty-em">{seg.text}</span>{:else}{seg.text}{/if}{/each}
          </div>

          {#if timers[idx]}
            {@const t = timers[idx]}
            <button
              class="cook-timer"
              class:cook-timer--running={t.running}
              class:cook-timer--alarm={t.done}
              onclick={toggleTimer}
            >
              {#if t.done}<BellRing size={26} />{:else if t.running}<Pause size={26} />{:else}<Timer size={26} />{/if}
              <span class="time">{t.done ? "Готово" : clock(t.left)}</span>
              <span class="t-hint">
                {t.done ? "Нажми, чтобы сбросить" : t.running ? "Идёт" : t.left === t.total ? "Запустить" : "Продолжить"}
              </span>
            </button>
          {/if}
        </div>
      </div>

      <div class="cook-ing" data-open={ingOpen}>
        <button class="cook-ing-handle" aria-expanded={ingOpen} onclick={() => (ingOpen = !ingOpen)}>
          <span class="cook-ing-grip"></span>
          <span class="cook-ing-label">Ингредиенты<span class="cook-ing-chev"><ChevronUp size={16} /></span></span>
        </button>
        <div class="cook-ing-list">
          <div class="cook-ing-inner">
            {#if servings !== recipe.servings && !scalableSteps}
              <div class="rc-steps-note">
                Количества в шагах — на {recipe.servings} {portionsWord(recipe.servings)}
              </div>
            {/if}
            {#each recipe.ingredients as ing (ing.name)}
              <div class="ing">
                {ing.name}<span class="qty">{scaleAmount(ing.amount, ing.unit, ratio)}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="cook-nav">
        <button class="btn btn--secondary" disabled={idx === 0} onclick={() => go(-1)}>
          <ArrowLeft size={20} />Назад
        </button>
        {#if idx === last}
          <button class="btn btn--primary btn--done" onclick={next}><PartyPopper size={20} />Готово</button>
        {:else}
          <button class="btn btn--primary" onclick={next}>Дальше<ArrowRight size={20} /></button>
        {/if}
      </div>
    {/if}

    {#if confirm}
      <!-- dismiss via «Остаться» or Esc (handled by the window keydown effect) -->
      <div class="cook-confirm-scrim">
        <div class="cook-confirm">
          <div class="cook-confirm-title">Таймер ещё идёт</div>
          <div class="cook-confirm-text">Если выйдешь, отсчёт сбросится. Точно закрыть режим готовки?</div>
          <div class="cook-confirm-actions">
            <button class="btn btn--secondary" onclick={() => (confirm = false)}>Остаться</button>
            <button class="btn btn--primary" onclick={() => { confirm = false; onclose(); }}>Выйти</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
