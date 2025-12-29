import pb from "../utils/pb.ts";
import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  async GET(_ctx) {
    const baseUrl = "https://tkddzwirzyno.pl";
    const staticRoutes = [
      "/",
      "/zawodnicy",
      "/galeria",
      "/osiagniecia",
      "/grafik",
      "/kontakt",
    ];

    let newsUrls = "";
    try {
      // Fetch all news IDs
      const news = await pb.collection("news").getFullList({
        fields: "id,updated",
      });
      newsUrls = news.map((item) => `
  <url>
    <loc>${baseUrl}/aktualnosci/${item.id}</loc>
    <lastmod>${
        item.updated
          ? new Date(item.updated).toISOString()
          : new Date().toISOString()
      }</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");
    } catch (e) {
      console.warn("Sitemap news fetch error:", e);
    }

    const staticXml = staticRoutes.map((route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`).join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}${newsUrls}
</urlset>`;

    return new Response(sitemap, {
      headers: { "Content-Type": "application/xml" },
    });
  },
};
