import { FreshContext } from "fresh";

export async function handler(ctx: FreshContext) {
  const req = ctx.req;
  // Pobierz login i hasło ze zmiennych środowiskowych lub użyj domyślnych
  const validUser = Deno.env.get("ADMIN_USER") || "admin";
  const validPass = Deno.env.get("ADMIN_PASSWORD") || "changeme";

  const auth = req.headers.get("Authorization");

  // Jeśli brak nagłówka auth, poproś o niego (przeglądarka wyświetli okienko logowania)
  if (!auth) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
    });
  }

  // Weryfikacja hasła
  const match = auth.match(/^Basic\s+(.*)$/);
  if (match) {
    const [user, pass] = atob(match[1]).split(":");
    if (user === validUser && pass === validPass) {
      return await ctx.next();
    }
  }

  return new Response("Forbidden: Invalid credentials", { status: 403 });
}
