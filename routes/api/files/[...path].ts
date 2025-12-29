import { define } from "../../../utils.ts";

const POCKETBASE_URL = Deno.env.get("POCKETBASE_URL") || "http://127.0.0.1:8090";

export const handler = define.handlers({
  async GET(ctx) {
    return handleProxy(ctx);
  },
  async HEAD(ctx) {
    return handleProxy(ctx);
  },
});

async function handleProxy(ctx: any) { // Using explicit function for shared logic
  const rawPath = ctx.params.path;
  const segments = Array.isArray(rawPath) ? rawPath : String(rawPath).split("/");

  // Security: Prevent directory traversal
  if (segments.some((s: string) => s.includes(".."))) {
    return new Response("Bad path", { status: 400 });
  }

  const path = segments.map((s: string) => encodeURIComponent(s)).join("/");
    
  const reqUrl = new URL(ctx.req.url);

  // Construct target URL with query parameters
  const targetUrl = new URL(`${POCKETBASE_URL}/api/files/${path}`);
  targetUrl.search = reqUrl.search;

  // console.log(`[Proxy] Request for: ${path}`);
  // console.log(`[Proxy] Proxying to: ${targetUrl.toString()}`);

  try {
    // Forward Request Headers (Range, Cache, etc.)
    const requestHeaders = new Headers();
    const headersToForwardRequest = [
      "range",
      "if-none-match",
      "if-modified-since",
      "accept" 
    ];
    for (const h of headersToForwardRequest) {
      const v = ctx.req.headers.get(h);
      if (v) requestHeaders.set(h, v);
    }

    const response = await fetch(targetUrl.toString(), {
      method: ctx.req.method,
      headers: requestHeaders
    });

    if (!response.ok) {
        // If 404/500, we might still want to return the body for debugging, 
        // but for images usually just status is enough.
        // Forwarding PB error directly.
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
             headers: response.headers // Forward all headers from error response
        });
    }

    const responseHeaders = new Headers();
    const headersToForward = [
      "content-type",
      "content-length",
      "cache-control",
      "etag",
      "last-modified",
      "accept-ranges",
      "content-range",
      "date",
      "content-encoding" // Important if upstream is compressed
    ];

    for (const [key, value] of response.headers.entries()) {
      if (headersToForward.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    }
    // responseHeaders.set("Access-Control-Allow-Origin", "*"); // Removed for stricter security
    responseHeaders.set("Access-Control-Expose-Headers", "Content-Range, ETag");

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[Proxy] Fetch failed:`, error);
    return new Response(
      `Internal Proxy Exception: ${error.message}`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      },
    );
  }
}
