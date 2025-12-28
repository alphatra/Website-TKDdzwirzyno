import { App, fsRoutes, staticFiles, trailingSlashes } from "jsr:@fresh/core";
import { renderToString } from "npm:preact-render-to-string";
import { join, extname } from "$std/path/mod.ts";
import { contentType } from "$std/media_types/mod.ts";
import type { State } from "./routes/_middleware.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

export const app = new App<State>({ ...config, mode: "development" });

console.log("App Config:", app.config);
console.log("Manifest BaseURL:", manifest.baseUrl);
console.log("Manifest Keys Sample:", Object.keys(manifest.routes).slice(0, 5));
console.log("Zawodnicy Module:", manifest.routes["./routes/zawodnicy.tsx"]);

// app.get("/manual-test", () => new Response("Manual OK"));

// Custom Static File Server
// Custom Static File Server
app.use(async (ctx) => {
  if (ctx.req.method !== "GET" && ctx.req.method !== "HEAD") return ctx.next();
  const url = new URL(ctx.req.url);
  const path = url.pathname;
  if (path === "/") return ctx.next();

  const filePath = join(Deno.cwd(), "static", path);
  try {
    const file = await Deno.open(filePath, { read: true });
    const stat = await file.stat();
    if (stat.isDirectory) {
      file.close();
      return ctx.next();
    }

    const mime = contentType(extname(filePath)) || "application/octet-stream";
    return new Response(file.readable, {
      headers: { "content-type": mime }
    });
  } catch {
    return ctx.next();
  }
});

// fsRoutes failure fallback: Manual Route Registration
for (const [path, mod] of Object.entries(manifest.routes)) {
  let routePath = path.replace(/^\.\/routes/, "").replace(/\.tsx?$/, "");
  if (routePath.endsWith("/index")) routePath = routePath.slice(0, -6);
  if (routePath === "/index") routePath = "/";
  if (!routePath.startsWith("/")) routePath = "/" + routePath;
  routePath = routePath.replace(/\[([^\]]+)\]/g, ":$1");

  app.all(routePath, async (ctx) => {
    // Skip static files in manual router (let them fall through to 404 if staticFiles missed)
    const url = new URL(ctx.req.url);
    if (url.pathname.match(/\.(css|js|map|json|ico|svg|png|jpg|jpeg|woff|woff2)$/)) {
      return ctx.next();
    }

    let data = undefined;
    let isMockResponse = false;

    // Mock ctx.render to capture data
    const mockCtx = new Proxy(ctx, {
      get(target, prop) {
        if (prop === 'render') {
          return (d: any) => {
            data = d;
            isMockResponse = true; // Flag that we captured data
            return new Response(null, { status: 200 }); // Placeholder
          }
        }
        return Reflect.get(target, prop);
      }
    });

    try {
      if (mod.handler) {
        let resp;
        if (typeof mod.handler === 'function') {
          resp = await mod.handler(mockCtx);
        } else {
          const method = ctx.req.method as keyof typeof mod.handler;
          if (mod.handler[method]) resp = await mod.handler[method](mockCtx);
        }

        // If handler returned our placeholder, it means it called ctx.render
        if (isMockResponse && resp && resp.status === 200 && resp.body === null) {
          // Proceed to render
          // data is captured
        } else if (resp) {
          // Real response (redirect, 404, etc)
          return resp;
        }
      }

      if (mod.default) {
        // Attempt to find _app wrapper in manifest
        const appMod = manifest.routes["./routes/_app.tsx"];
        const AppComponent = appMod?.default;

        let vnode = mod.default({ data, route: routePath, ...ctx.params });

        // If we have an App wrapper, use it to wrap the page
        if (AppComponent) {
          const state = {
            siteInfo: { name: "TKD Dzwirzyno" },
            menuPages: []
          };

          // Render App with the Page Component as child/prop
          // In Fresh we typically pass Component that renders the page
          vnode = AppComponent({
            Component: () => mod.default({ data, route: routePath, ...ctx.params }),
            state,
            url: new URL(`http://localhost${routePath}`),
            route: routePath,
            params: ctx.params,
            data
          });
        }

        const html = renderToString(vnode);
        return new Response("<!DOCTYPE html>" + html, {
          headers: { "content-type": "text/html; charset=utf-8" },
          status: 200
        });
      }
    } catch (e) {
      console.error(`[ManualRouter] Error in route ${routePath}:`, e);
      return new Response(`Internal Server Error: ${e.message}`, { status: 500 });
    }
    return new Response("Not Found", { status: 404 });
  });
}
// await app.fsRoutes(manifest);


app.use(trailingSlashes("never"));

app.all("*", (ctx) => {
  console.log(`Fallthrough: ${ctx.req.method} ${ctx.req.url}`);
  return new Response("Fallthrough 404", { status: 404 });
});


if (import.meta.main) {
  await app.listen();
}
