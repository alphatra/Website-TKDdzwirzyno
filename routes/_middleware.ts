import { FreshContext } from "fresh";
import pb from "../utils/pb.ts";
import { NewsRecord, SiteInfoRecord } from "../utils/pocketbase.ts";

// Simple in-memory cache
let cachedSiteInfo: SiteInfoRecord | null = null;
// deno-lint-ignore no-explicit-any
let cachedMenuPages: any[] = [];
let cachedNews: NewsRecord[] = [];
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function handler(ctx: FreshContext) {
  const req = ctx.req;
  const url = new URL(req.url);

  // Skip PocketBase fetch for static assets, API, and internal routes
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_fresh/")
  ) {
    const res = ctx.next();
    // Cache static assets (images, fonts, css, js) for 1 year
    // This is safe because Vite/Fresh hashes filenames in production build
    // For local dev, this might be annoying so you can disable it or just clear cache
    // But for production performance it's crucial
    if (
      url.pathname.match(
        /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/,
      )
    ) {
      const resp = await res;
      const headers = new Headers(resp.headers);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return new Response(resp.body, { status: resp.status, headers });
    }
    return res;
  }

  // Check cache
  const now = Date.now();
  if (now - lastCacheTime > CACHE_TTL_MS) {
    try {
      const [infoRes, pagesRes, newsRes] = await Promise.all([
        pb.collection("site_info").getList<SiteInfoRecord>(1, 1),
        pb.collection("pages").getList(1, 20, {
          filter: "visible=true",
          sort: "menu_order",
        }),
        pb.collection("news").getList<NewsRecord>(1, 3, {
          filter: "published=true",
          sort: "-created",
        }),
      ]);

      if (infoRes.items.length > 0) {
        cachedSiteInfo = infoRes.items[0];
      }
      cachedMenuPages = pagesRes.items;
      cachedNews = newsRes.items;
      lastCacheTime = now;
    } catch (_e) {
      // Keep old cache on error or just log
    }
  }

  ctx.state.siteInfo = cachedSiteInfo;
  ctx.state.menuPages = cachedMenuPages;
  ctx.state.news = cachedNews;

  const resp = await ctx.next();
  const newHeaders = new Headers(resp.headers);

  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  newHeaders.set("X-Frame-Options", "DENY");

  // Security Headers
  newHeaders.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  // Basic CSP (adjust as needed if you use external scripts like Analytics or Maps)
  // "Content-Security-Policy",
  // "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com;"
  // );

  // Only force no-cache for HTML pages if needed, but definitely NOT for everything
  // newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: newHeaders,
  });
}
