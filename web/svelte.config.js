import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // SPA: the API is a separate service (decisions log / §10),
    // so we ship static files with an index.html fallback behind Caddy.
    adapter: adapter({ fallback: "index.html" }),
  },
};

export default config;
