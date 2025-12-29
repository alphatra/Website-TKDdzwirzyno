import { FreshContext } from "fresh";
import pb from "../utils/pb.ts";

interface SiteInfo {
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
}

export async function handler(ctx: FreshContext) {
  const req = ctx.req;
  console.log(`[Middleware] ${req.method} ${req.url}`);
  let siteInfo: SiteInfo | null = null;
  let menuPages: any[] = [];
  try {
    const [infoRes, pagesRes] = await Promise.all([
      pb.collection("site_info").getList<SiteInfo>(1, 1),
      pb.collection("pages").getList(1, 20, {
        filter: "visible=true",
        sort: "menu_order",
      }),
    ]);

    if (infoRes.items.length > 0) {
      siteInfo = infoRes.items[0];
    }
    menuPages = pagesRes.items;
    console.log(
      "Middleware Menu Pages:",
      menuPages.map((p) => `${p.title} (${p.slug}):${p.visible}`),
    );
  } catch (e) {
    // console.warn("Middleware fetch error:", e);
  }

  ctx.state.siteInfo = siteInfo;
  ctx.state.menuPages = menuPages;

  const resp = await ctx.next();

  const newHeaders = new Headers(resp.headers);
  newHeaders.set(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';",
  );
  newHeaders.set("Permissions-Policy", "unload=(self)");
  newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: newHeaders,
  });
}
