<script lang="ts">
  import { goto } from "$app/navigation";
  import { ArrowLeft, ArrowRight, Check, MessageCircle, Moon, Pencil, Plus, Sun, X } from "lucide-svelte";
  import { api } from "$lib/api";
  import { conversations } from "$lib/conversations.svelte";
  import { theme } from "$lib/theme.svelte";

  // Redeem (step 1, with the «Как тебя зовут?» field + error views) lives on /redeem.
  // This route is the post-redeem setup: equipment → pantry seeding.
  const EQUIPMENT_OPTIONS = [
    "Духовка", "Плита", "Микроволновка", "Аэрогриль", "Блендер", "Миксер",
    "Мультиварка", "Гриль-сковорода", "Казан", "Пароварка", "Тостер", "Кофемолка",
  ];
  const BUILTIN = new Set(["Духовка", "Плита"]);
  const POSUDA = new Set(["Гриль-сковорода", "Казан", "Пароварка"]);
  function equipType(name: string): string {
    if (BUILTIN.has(name)) return "Встроенная";
    if (POSUDA.has(name)) return "Посуда";
    return "Техника";
  }

  let step = $state<"equipment" | "seeding">("equipment");
  let selected = $state<string[]>([]);
  let custom = $state<string[]>([]);
  let draft = $state("");
  let busy = $state(false);

  const total = $derived(selected.length + custom.length);

  function toggle(name: string): void {
    selected = selected.includes(name) ? selected.filter((x) => x !== name) : [...selected, name];
  }
  function addCustom(): void {
    const v = draft.trim();
    if (v && !custom.includes(v) && !EQUIPMENT_OPTIONS.includes(v)) custom = [...custom, v];
    draft = "";
  }
  function removeCustom(name: string): void {
    custom = custom.filter((x) => x !== name);
  }

  async function toSeeding(): Promise<void> {
    if (busy) return;
    busy = true;
    // Best-effort: a failed item shouldn't block onboarding (skip is always valid).
    await Promise.allSettled(
      [...selected, ...custom].map((name) => api.equipment.create(name, equipType(name))),
    );
    busy = false;
    step = "seeding";
  }

  async function choosePath(path: "chat" | "self" | "skip"): Promise<void> {
    if (path === "self") {
      await goto("/pantry");
      return;
    }
    if (path === "chat") {
      const c = await conversations.create();
      await goto(`/chat?c=${c.id}&seed=pantry`);
      return;
    }
    await goto("/chat"); // skip
  }
</script>

<div class="onb-stage">
  <div class="onb">
    <div class="onb-top">
      <span class="onb-back">
        {#if step === "seeding"}
          <button class="icon-btn" aria-label="Назад" onclick={() => (step = "equipment")}>
            <ArrowLeft size={22} />
          </button>
        {/if}
      </span>
      <div class="onb-steps">
        <span class="onb-step-dot" class:current={step === "equipment"} class:done={step === "seeding"}></span>
        <span class="onb-step-dot" class:current={step === "seeding"}></span>
      </div>
      <button class="icon-btn" aria-label="Тема" onclick={() => theme.toggle()}>
        {#if theme.current === "light"}<Moon size={22} />{:else}<Sun size={22} />{/if}
      </button>
    </div>

    {#if step === "equipment"}
      <div class="onb-scroll">
        <div class="onb-body">
          <div class="onb-head">
            <div class="onb-eyebrow">Шаг 1 из 2</div>
            <div class="onb-title">Что есть на твоей кухне?</div>
            <div class="onb-sub">
              Отметь технику и посуду — так я буду точнее с рецептами. Можно пропустить и добавить позже.
            </div>
          </div>

          <div class="eq-grid">
            {#each EQUIPMENT_OPTIONS as name (name)}
              <button class="eq-chip" class:on={selected.includes(name)} aria-pressed={selected.includes(name)} onclick={() => toggle(name)}>
                <span class="eq-check"><Check size={15} /></span>
                <span class="eq-name">{name}</span>
              </button>
            {/each}
          </div>

          <div class="eq-custom">
            <input
              class="field"
              bind:value={draft}
              placeholder="Своё — например, тажин"
              onkeydown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
            />
            <button class="btn btn--secondary add" aria-label="Добавить своё" onclick={addCustom}>
              <Plus size={20} />
            </button>
          </div>
          {#if custom.length > 0}
            <div class="eq-mine">
              {#each custom as c (c)}
                <span class="tag tag--category">{c}<button aria-label="Убрать" onclick={() => removeCustom(c)}><X size={14} /></button></span>
              {/each}
            </div>
          {/if}

          <div class="eq-count">{total > 0 ? `Выбрано: ${total}` : "Ничего не выбрано — это тоже нормально"}</div>
        </div>
      </div>

      <div class="onb-foot">
        <button class="btn btn--primary" disabled={busy} onclick={toSeeding}>
          {busy ? "Сохраняю…" : "Дальше"}
        </button>
      </div>
    {:else}
      <div class="onb-scroll">
        <div class="onb-body">
          <div class="onb-head">
            <div class="onb-eyebrow">Шаг 2 из 2</div>
            <div class="onb-title">Что есть из продуктов?</div>
            <div class="onb-sub">
              Чтобы я предлагал рецепты из того, что у тебя реально есть. Выбери, как удобнее.
            </div>
          </div>

          <div class="seed-paths">
            <button class="seed-card seed-card--primary" onclick={() => choosePath("chat")}>
              <span class="seed-ic"><MessageCircle size={26} /></span>
              <span class="seed-body">
                <span class="seed-title">Расскажи ассистенту</span>
                <span class="seed-desc">Просто напиши списком — я разберу и запишу в кладовку сам</span>
              </span>
              <span class="seed-chev"><ArrowRight size={20} /></span>
            </button>

            <button class="seed-card seed-card--secondary" onclick={() => choosePath("self")}>
              <span class="seed-ic"><Pencil size={24} /></span>
              <span class="seed-body">
                <span class="seed-title">Заполню сам</span>
                <span class="seed-desc">Добавить продукты вручную в кладовой</span>
              </span>
              <span class="seed-chev"><ArrowRight size={20} /></span>
            </button>
          </div>

          <div class="seed-skip">
            <button onclick={() => choosePath("skip")}>Пропустить пока</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
