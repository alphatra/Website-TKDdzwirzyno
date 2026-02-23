import { load } from "jsr:@std/dotenv";
import { parse } from "jsr:@std/csv/parse";
import PocketBase from "npm:pocketbase";

const env = await load();
const PB_URL = Deno.env.get("POCKETBASE_URL") || env["POCKETBASE_URL"] || "http://127.0.0.1:8090";
const PB_ADMIN_EMAIL = Deno.env.get("PB_ADMIN_EMAIL") || env["PB_ADMIN_EMAIL"];
const PB_ADMIN_PASSWORD = Deno.env.get("PB_ADMIN_PASSWORD") || env["PB_ADMIN_PASSWORD"];

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("Missing PocketBase admin credentials in .env");
  Deno.exit(1);
}

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

try {
  // Manual fetch to support older PocketBase server versions (<0.23)
  const authResp = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: PB_ADMIN_EMAIL, password: PB_ADMIN_PASSWORD })
  });

  if (!authResp.ok) {
    throw new Error(`Auth failed with status ${authResp.status}: ${await authResp.text()}`);
  }

  const authData = await authResp.json();
  pb.authStore.save(authData.token, authData.admin);
  
  console.log("Authenticated as Admin successfully.");
} catch (e) {
  console.error("Failed to authenticate as admin:", e);
  Deno.exit(1);
}

const csvText = await Deno.readTextFile("./static/Posts - Arkusz1.csv");
const records = parse(csvText, { skipFirstRow: true });

function parseDate(dateStr: string) {
  if (!dateStr) return new Date().toISOString();
  try {
    // Expected format: DD.MM.YYYY, HH:MM:SS
    const parts = dateStr.split(", ");
    if (parts.length !== 2) return new Date().toISOString();
    const [datePart, timePart] = parts;
    const dateParts = datePart.split(".");
    if (dateParts.length !== 3) return new Date().toISOString();
    const [day, month, year] = dateParts;
    // Assume PL time usually, but Z will work as an approximation and PocketBase will store it
    const d = new Date(`${year}-${month}-${day}T${timePart}Z`);
    return d.toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
}

function processContent(message: string) {
  let content = message.replace(/\n/g, "<br>");
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  content = content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-bold">$1</a>');
  return content;
}

let imported = 0;
let errors = 0;

for (const rawRecord of records) {
  const r = rawRecord as Record<string, string>;
  const createdTime = r["Created Time"];
  const fullPictureUrl = r["Full Picture URL"] || r["Picture URL"];
  const message = r["Message"] || r["Post Story"];

  if (!message || message.trim() === "") continue; // Skip empty posts
  
  // Clean titles by taking first sentence or short snippet
  let title = message.split("\n")[0].substring(0, 60).trim();
  if (title.length >= 60) title += "...";

  const summary = message.substring(0, 150).replace(/\n/g, " ") + (message.length > 150 ? "..." : "");
  const content = processContent(message);
  const createdStr = parseDate(createdTime);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("summary", summary);
  formData.append("content", content);
  formData.append("published", "true");
  // Try to override created date. PocketBase admin can override this on create.
  formData.append("created", createdStr);

  if (fullPictureUrl) {
    try {
      const resp = await fetch(fullPictureUrl);
      if (resp.ok) {
        const blob = await resp.blob();
        // Determine extension
        const urlObj = new URL(fullPictureUrl);
        let ext = urlObj.pathname.split('.').pop() || "jpg";
        if (ext.length > 4 || ext.includes("/")) ext = "jpg";
        formData.append("image", blob, `image.${ext}`);
      }
    } catch (_e) {
        console.warn(`Failed to fetch image for post: ${title}`);
    }
  }

  try {
    await pb.collection("news").create(formData);
    console.log(`[ SUCCESS ] ${title}`);
    imported++;
  } catch (e: any) {
    console.error(`[ ERROR ] ${title}`, e?.data || e.message);
    errors++;
  }
}

console.log(`\nMigration complete! Imported: ${imported}, Errors: ${errors}`);
Deno.exit(0);
