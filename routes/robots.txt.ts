import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  GET() {
    const robots = `User-agent: *
Allow: /
Sitemap: https://tkddzwirzyno.pl/sitemap.xml
`;
    return new Response(robots, {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
