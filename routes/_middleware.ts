import { FreshContext } from "fresh";
import pb from "../utils/pb.ts";

interface SiteInfo {
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
}

// Simple in-memory cache
let cachedSiteInfo: SiteInfo | null = null;
let cachedMenuPages: any[] = [];
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function handler(ctx: FreshContext) {
  const req = ctx.req;
  const url = new URL(req.url);

  // Skip PocketBase fetch for static assets, API, and internal routes
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_fresh/") ||
    url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)
  ) {
    return ctx.next();
  }

  // Check cache
  const now = Date.now();
  if (now - lastCacheTime > CACHE_TTL_MS) {
    try {
      const [infoRes, pagesRes] = await Promise.all([
        pb.collection("site_info").getList<SiteInfo>(1, 1),
        pb.collection("pages").getList(1, 20, {
          filter: "visible=true",
          sort: "menu_order",
        }),
      ]);

      if (infoRes.items.length > 0) {
        cachedSiteInfo = infoRes.items[0];
      }
      cachedMenuPages = pagesRes.items;
      lastCacheTime = now;
    } catch (e) {
      // Keep old cache on error or just log
      // console.warn("Middleware fetch error:", e);
    }
  }

  ctx.state.siteInfo = cachedSiteInfo;
  ctx.state.menuPages = cachedMenuPages;

  const resp = await ctx.next();
  const newHeaders = new Headers(resp.headers);
  
  newHeaders.set("Permissions-Policy", "unload=(self)");
  
  // Only force no-cache for HTML pages if needed, but definitely NOT for everything
  // newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: newHeaders,
  });
}
