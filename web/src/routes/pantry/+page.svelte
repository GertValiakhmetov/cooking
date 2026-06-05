<script lang="ts">
  import {
    AlertTriangle,
    Check,
    ChevronDown,
    Clock,
    CookingPot,
    Plus,
    Refrigerator,
    Search,
    Trash2,
    X,
  } from "lucide-svelte";
  import { type EquipmentItem, type InventoryItem, api } from "$lib/api";

  const CATEGORIES = ["Мясо", "Овощи", "Молочное", "Бакалея", "Специи", "Фрукты", "Заморозка", "Напитки", "Другое"];
  const UNITS = ["г", "кг", "мл", "л", "шт", "ст.л.", "ч.л.", "головка"];
  const APPLIANCE_TYPES = ["Техника", "Посуда", "Инвентарь", "Встроенная", "Другое"];

  let tab = $state<"prod" | "tech">("prod");
  let products = $state<InventoryItem[]>([]);
  let appliances = $state<EquipmentItem[]>([]);
  let q = $state("");
  let openId = $state<string | null>(null);
  let adding = $state(false);
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
    void api.inventory.list().then((r) => (products = r.items)).catch(() => {});
    void api.equipment.list().then((r) => (appliances = r.items)).catch(() => {});
  });

  function num(q: string | null): number | null {
    if (q == null) return null;
    const n = Number(q);
    return Number.isFinite(n) ? n : null;
  }
  function stepFor(unit: string | null): number {
    return unit === "г" || unit === "мл" ? 100 : 1;
  }
  function fmtQty(it: InventoryItem): string {
    const n = num(it.quantity);
    if (n == null) return "";
    return it.unit ? `${n} ${it.unit}` : String(n);
  }
  function expiry(it: InventoryItem): { state: "ok" | "soon" | "expired"; label: string } {
    if (!it.expiresOn) return { state: "ok", label: "" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(`${it.expiresOn}T00:00:00`);
    const days = Math.round((d.getTime() - today.getTime()) / 86_400_000);
    if (days < 0) return { state: "expired", label: "Просрочено" };
    const label = days === 0 ? "сегодня" : days === 1 ? "завтра" : `${days} дн.`;
    return { state: days <= 3 ? "soon" : "ok", label };
  }

  const ql = $derived(q.trim().toLowerCase());
  const filteredProducts = $derived(products.filter((p) => p.name.toLowerCase().includes(ql)));
  const filteredAppliances = $derived(appliances.filter((a) => a.name.toLowerCase().includes(ql)));
  const groups = $derived(
    CATEGORIES.map((cat) => ({
      cat,
      items: filteredProducts.filter((p) => (p.category ?? "Другое") === cat),
    })).filter((g) => g.items.length > 0),
  );

  async function changeQty(it: InventoryItem, amount: number): Promise<void> {
    const next = Math.max(0, amount);
    try {
      const updated = await api.inventory.update(it.id, { quantity: next });
      products = products.map((p) => (p.id === it.id ? updated : p));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Не удалось обновить");
    }
  }

  async function delProduct(it: InventoryItem): Promise<void> {
    products = products.filter((p) => p.id !== it.id);
    openId = null;
    try {
      await api.inventory.remove(it.id);
      toast(`${it.name} удалён`, async () => {
        const restored = await api.inventory.create({
          name: it.name,
          quantity: num(it.quantity),
          unit: it.unit,
          category: it.category,
          expiresOn: it.expiresOn,
        });
        products = [restored, ...products];
      });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Не удалось удалить");
    }
  }

  async function delAppliance(it: EquipmentItem): Promise<void> {
    appliances = appliances.filter((a) => a.id !== it.id);
    try {
      await api.equipment.remove(it.id);
      toast(`${it.name} удалён`, async () => {
        const restored = await api.equipment.create(it.name, it.type);
        appliances = [restored, ...appliances];
      });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Не удалось удалить");
    }
  }

  // ---- add sheet ----
  let sName = $state("");
  let sAmount = $state("");
  let sUnit = $state("г");
  let sCat = $state("Овощи");
  let sType = $state("Техника");
  let sExp = $state("");

  function openAdd(): void {
    sName = "";
    sAmount = "";
    sUnit = "г";
    sCat = "Овощи";
    sType = "Техника";
    sExp = "";
    adding = true;
  }

  async function submitAdd(): Promise<void> {
    const name = sName.trim();
    if (!name) return;
    try {
      if (tab === "prod") {
        const created = await api.inventory.create({
          name,
          quantity: sAmount === "" ? null : Number(sAmount),
          unit: sUnit,
          category: sCat,
          expiresOn: sExp || null,
        });
        products = [created, ...products];
        toast("Продукт добавлен");
      } else {
        const created = await api.equipment.create(name, sType);
        appliances = [created, ...appliances];
        toast("Техника добавлена");
      }
      adding = false;
    } catch (e) {
      toast(e instanceof Error ? e.message : "Не удалось добавить");
    }
  }
</script>

<div class="screen">
  <header class="topbar-plain"><span class="tp-title">Кладовая</span></header>

  <div class="screen-controls">
    <div class="search">
      <Search size={20} color="var(--text-secondary)" />
      <input placeholder={tab === "prod" ? "Искать продукт" : "Искать технику"} bind:value={q} />
    </div>
    <div class="seg">
      <button class:active={tab === "prod"} onclick={() => { tab = "prod"; q = ""; }}>Продукты</button>
      <button class:active={tab === "tech"} onclick={() => { tab = "tech"; q = ""; }}>Техника</button>
    </div>
    <button class="btn btn--primary add-btn" onclick={openAdd}>
      <Plus size={20} />{tab === "prod" ? "Добавить продукт" : "Добавить технику"}
    </button>
  </div>

  <div class="list-scroll">
    <div class="list-inner">
      {#if tab === "prod"}
        {#if products.length === 0}
          <div class="empty">
            <div class="empty-ic"><Refrigerator size={28} /></div>
            <div class="empty-text">Здесь пока пусто. Добавь первый продукт.</div>
            <button class="btn btn--primary" onclick={openAdd}><Plus size={20} />Добавить</button>
          </div>
        {:else if groups.length === 0}
          <div class="empty"><div class="empty-text">Ничего не найдено. Попробуй другое название.</div></div>
        {:else}
          {#each groups as g (g.cat)}
            <div class="cat-group">
              <div class="cat-head">{g.cat}<span class="cat-count">{g.items.length}</span></div>
              <div class="list">
                {#each g.items as it (it.id)}
                  {@const ex = expiry(it)}
                  <div
                    class="prow"
                    data-open={openId === it.id}
                    role="button"
                    tabindex="0"
                    onclick={() => (openId = openId === it.id ? null : it.id)}
                    onkeydown={(e) => { if (e.key === "Enter") openId = openId === it.id ? null : it.id; }}
                  >
                    <div class="prow-main">
                      <span class="pname" class:faded={ex.state === "expired"}>{it.name}</span>
                      {#if num(it.quantity) != null}<span class="pqty">{fmtQty(it)}</span>{/if}
                    </div>
                    <div class="prow-right">
                      {#if ex.state === "soon"}<span class="tag tag--soon"><Clock size={14} />{ex.label}</span>{/if}
                      {#if ex.state === "expired"}<span class="tag tag--expired"><AlertTriangle size={14} />Просрочено</span>{/if}
                      <span class="chev"><ChevronDown size={18} /></span>
                    </div>
                  </div>
                  {#if openId === it.id}
                    <div class="pedit">
                      {#if num(it.quantity) != null}
                        {@const step = stepFor(it.unit)}
                        <div class="pedit-row">
                          <span class="pedit-now">{fmtQty(it)}</span>
                          <button class="qchip" onclick={() => changeQty(it, (num(it.quantity) ?? 0) - step)}>−{step} {it.unit}</button>
                          <button class="qchip" onclick={() => changeQty(it, (num(it.quantity) ?? 0) + step)}>+{step} {it.unit}</button>
                        </div>
                      {/if}
                      <div class="pedit-actions">
                        <button class="pedit-del" onclick={() => delProduct(it)}><Trash2 size={17} />Удалить</button>
                        <button class="btn btn--ghost" style="min-height: 40px" onclick={() => (openId = null)}>Готово</button>
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>
          {/each}
        {/if}
      {:else if appliances.length === 0}
        <div class="empty">
          <div class="empty-ic"><CookingPot size={28} /></div>
          <div class="empty-text">Здесь пока пусто. Добавь технику.</div>
          <button class="btn btn--primary" onclick={openAdd}><Plus size={20} />Добавить</button>
        </div>
      {:else if filteredAppliances.length === 0}
        <div class="empty"><div class="empty-text">Ничего не найдено. Попробуй другое название.</div></div>
      {:else}
        <div class="list">
          {#each filteredAppliances as it (it.id)}
            <div class="prow">
              <div class="prow-main"><span class="pname">{it.name}</span></div>
              <div class="prow-right">
                <span class="tag tag--category">{it.type}</span>
                <button class="icon-btn" aria-label="Удалить" onclick={() => delAppliance(it)}><Trash2 size={18} /></button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  {#if adding}
    <div
      class="sheet-scrim"
      role="presentation"
      onclick={(e) => { if (e.target === e.currentTarget) adding = false; }}
    >
      <div class="sheet">
        <div class="sheet-grip"></div>
        <div class="sheet-head">
          <div class="sheet-title">{tab === "prod" ? "Добавить продукт" : "Добавить технику"}</div>
          <button class="icon-btn" aria-label="Закрыть" onclick={() => (adding = false)}><X size={22} /></button>
        </div>

        <div class="sheet-body">
          <div class="fgroup">
            <label class="flabel" for="add-name">Название</label>
            <input id="add-name" class="field" bind:value={sName} placeholder={tab === "prod" ? "Например, морковь" : "Например, мультиварка"} />
          </div>

          {#if tab === "prod"}
            <div class="fgroup">
              <span class="flabel">Количество</span>
              <div class="frow">
                <input class="field" type="number" inputmode="numeric" bind:value={sAmount} placeholder="—" />
                <select class="field field--unit" bind:value={sUnit}>
                  {#each UNITS as u (u)}<option value={u}>{u}</option>{/each}
                </select>
              </div>
            </div>
            <div class="fgroup">
              <span class="flabel">Категория</span>
              <div class="chips-wrap">
                {#each CATEGORIES.slice(0, 7) as c (c)}
                  <button class="selch" class:on={sCat === c} onclick={() => (sCat = c)}>{c}</button>
                {/each}
              </div>
            </div>
            <div class="fgroup">
              <label class="flabel" for="add-exp">Срок годности · необязательно</label>
              <input id="add-exp" class="field" type="date" bind:value={sExp} />
            </div>
          {:else}
            <div class="fgroup">
              <span class="flabel">Тип</span>
              <div class="chips-wrap">
                {#each APPLIANCE_TYPES as t (t)}
                  <button class="selch" class:on={sType === t} onclick={() => (sType = t)}>{t}</button>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="sheet-foot">
          <button class="btn btn--secondary" onclick={() => (adding = false)}>Отмена</button>
          <button class="btn btn--primary" disabled={!sName.trim()} onclick={submitAdd}>Добавить</button>
        </div>
      </div>
    </div>
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
