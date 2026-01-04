import pb from "../utils/pb.ts";
import { NewsRecord, PageRecord } from "../utils/pocketbase.ts";
import { Handlers } from "fresh/compat";

const SITE_URL = Deno.env.get("SITE_URL") || "https://tkddzwirzyno.pl";

export const handler: Handlers = {
  async GET() {
    const staticRoutes = [
      "",
      "/kontakt",
      "/kadra",
      "/zawodnicy",
      "/aktualnosci",
    ];

    const urls = staticRoutes.map((route) => ({
      loc: `${SITE_URL}${route}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: route === "" ? 1.0 : 0.8,
    }));

    // Dynamic Pages
    try {
      const pages = await pb.collection("pages").getFullList<PageRecord>({
        filter: "visible = true",
      });
      for (const page of pages) {
        urls.push({
          loc: `${SITE_URL}/${page.slug}`,
          lastmod: page.updated
            ? new Date(page.updated).toISOString()
            : new Date().toISOString(),
          changefreq: "weekly",
          priority: 0.7,
        });
      }
    } catch (e) {
      console.error("Sitemap pages fetch error:", e);
    }

    // Dynamic News
    try {
      const news = await pb.collection("news").getList<NewsRecord>(1, 50, {
        filter: "published = true",
        sort: "-created",
      });
      for (const item of news.items) {
        urls.push({
          loc: `${SITE_URL}/aktualnosci/${item.id}`,
          lastmod: item.updated
            ? new Date(item.updated).toISOString()
            : new Date().toISOString(),
          changefreq: "monthly",
          priority: 0.6,
        });
      }
    } catch (e) {
      console.error("Sitemap news fetch error:", e);
    }

    // Dynamic Galleries
    try {
      // Create a simplified type since we don't need full Record types here
      const albums = await pb.collection("albums").getList(1, 100, {
        sort: "-date",
      });
      for (const album of albums.items) {
        urls.push({
          loc: `${SITE_URL}/galeria/${album.id}`,
          lastmod: album.updated
            ? new Date(album.updated).toISOString()
            : new Date().toISOString(),
          changefreq: "monthly",
          priority: 0.6,
        });
      }
    } catch (e) {
      console.error("Sitemap albums fetch error:", e);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${
      urls
        .map(
          (url) =>
            `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
        )
        .join("\n")
    }
</urlset>`;

    return new Response(sitemap, {
      headers: { "Content-Type": "application/xml" },
    });
  },
};
