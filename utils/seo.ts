export function absUrl(
  path: string,
  site = Deno.env.get("SITE_URL") || "https://tkddzwirzyno.pl",
) {
  if (path.startsWith("http")) return path;
  return site.replace(/\/$/, "") + path;
}
