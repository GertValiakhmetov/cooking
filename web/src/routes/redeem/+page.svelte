<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { ApiError, api } from "$lib/api";
  import { auth } from "$lib/auth.svelte";

  // Тёплый персональный вход (тебя пригласили), не SaaS-регистрация:
  // одно поле «Как тебя зовут?» — токен в URL, пользователь его не видит.
  let status = $state<"form" | "working" | "error">("form");
  let message = $state("");
  let name = $state("");

  const token = $derived(page.url.searchParams.get("token"));

  $effect(() => {
    if (!token) {
      status = "error";
      message = "В ссылке нет токена приглашения.";
    }
  });

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!token || status === "working") return;
    status = "working";
    try {
      const { jwt } = await api.redeem(token, name.trim() || undefined);
      auth.setToken(jwt);
      // First run after redeeming the invite → equipment + pantry setup, then chat.
      await goto("/onboarding", { replaceState: true });
    } catch (err) {
      status = "error";
      message =
        err instanceof ApiError ? err.message : "Не удалось войти. Проверь соединение с сервером.";
    }
  }
</script>

<div class="gate">
  <span class="brand-mark gate-mark">С</span>
  <h1 class="t-title">Су-шеф</h1>

  {#if status === "error"}
    <p class="t-body-large">{message}</p>
    <p class="t-caption">Попроси новую ссылку у того, кто тебя пригласил, и открой её ещё раз.</p>
  {:else}
    <p class="t-body-large">Твой кухонный ассистент. Тебя пригласили — заходи.</p>
    <form class="gate-form" onsubmit={submit}>
      <!-- svelte-ignore a11y_autofocus -->
      <input
        class="field"
        placeholder="Как тебя зовут?"
        autocomplete="name"
        autofocus
        bind:value={name}
        disabled={status === "working"}
      />
      <button class="btn btn--primary btn--block" type="submit" disabled={status === "working"}>
        {#if status === "working"}Входим…{:else}Войти{/if}
      </button>
    </form>
  {/if}
</div>
