import { serve } from "@hono/node-server";
import { env } from "./env";
import { createApp } from "./http/app";

serve({ fetch: createApp().fetch, port: env.PORT }, (info) => {
  console.log(`backend listening on http://localhost:${info.port} (${env.NODE_ENV})`);
});
