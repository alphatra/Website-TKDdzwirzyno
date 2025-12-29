import { App, fsRoutes, staticFiles, trailingSlashes } from "jsr:@fresh/core";
import type { State } from "./routes/_middleware.ts";

import config from "./fresh.config.ts";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const app = new App<State>({ ...config, mode: "development" });

app.use(staticFiles("./static"));
// app.use(trailingSlashes("never"));

const baseDir = dirname(fileURLToPath(import.meta.url));
const routesDir = join(baseDir, "routes");
console.log(`[Main] CWD: ${Deno.cwd()}`);
console.log(`[Main] Loading routes from: ${routesDir}`);

try {
  for await (const dirEntry of Deno.readDir(routesDir)) {
    console.log(`[Main] Found file: ${dirEntry.name}`);
  }
} catch (err) {
  console.error(`[Main] Error reading routes dir:`, err);
}

app.get("/manual_test", (_req) => new Response("Manual Route Working"));

await app.fsRoutes(routesDir);

if (import.meta.main) {
  await app.listen();
}
