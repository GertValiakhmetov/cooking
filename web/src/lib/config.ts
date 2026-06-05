/** Базовый URL API. В dev — локальный бэкенд; в проде задаётся VITE_API_URL при сборке. */
export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
