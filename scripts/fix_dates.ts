import { load } from "jsr:@std/dotenv";
import { parse } from "jsr:@std/csv/parse";

const env = await load();
const PB_URL = Deno.env.get("POCKETBASE_URL") || env["POCKETBASE_URL"] || "http://127.0.0.1:8090";
const PB_ADMIN_EMAIL = Deno.env.get("PB_ADMIN_EMAIL") || env["PB_ADMIN_EMAIL"];
const PB_ADMIN_PASSWORD = Deno.env.get("PB_ADMIN_PASSWORD") || env["PB_ADMIN_PASSWORD"];

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("Missing PocketBase admin credentials in .env");
  Deno.exit(1);
}

console.log(`Connecting to PocketBase at: ${PB_URL}`);

let token = "";

try {
  const authResp = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: PB_ADMIN_EMAIL, password: PB_ADMIN_PASSWORD })
  });

  if (!authResp.ok) {
    throw new Error(`Auth failed with status ${authResp.status}: ${await authResp.text()}`);
  }

  const authData = await authResp.json();
  token = authData.token;
  console.log("Authenticated as Admin successfully.");
} catch (e) {
  console.error("Failed to authenticate as admin:", e);
  Deno.exit(1);
}

// --- Parse CSV ---
const csvText = await Deno.readTextFile("./static/Posts - Arkusz1.csv");
const records = parse(csvText, { skipFirstRow: true });

// Build a map: title -> ISO 8601 date from CSV
const titleToCreated = new Map<string, string>();

for (const rawRecord of records) {
  const r = rawRecord as Record<string, string>;
  const createdTime = r["Created Time"];
  const message = r["Message"] || r["Post Story"];

  if (!message || message.trim() === "") continue;

  // Replicate exact same title generation as migrate script
  let title = message.split("\n")[0].substring(0, 60).trim();
  if (title.length >= 60) title += "...";

  if (createdTime) {
    // Validate it's a real date
    const d = new Date(createdTime);
    if (!isNaN(d.getTime())) {
      titleToCreated.set(title, d.toISOString());
    }
  }
}

console.log(`Parsed ${titleToCreated.size} valid dates from CSV.`);

// --- Fetch ALL news from PocketBase ---
try {
  let allNews: any[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    console.log(`Fetching page ${page} of news items...`);
    const listResp = await fetch(
      `${PB_URL}/api/collections/news/records?page=${page}&perPage=${perPage}&sort=-created`,
      {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!listResp.ok) {
      throw new Error(`Failed to fetch news: ${listResp.status} ${await listResp.text()}`);
    }

    const listData = await listResp.json();
    const items = listData.items || [];
    allNews = allNews.concat(items);

    console.log(`  Got ${items.length} items (total so far: ${allNews.length})`);

    if (items.length < perPage) break;
    page++;
  }

  console.log(`\nFetched ${allNews.length} news items from PocketBase.`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of allNews) {
    const correctDate = titleToCreated.get(item.title);
    if (correctDate) {
      // Check if the date already matches (avoid unnecessary updates)
      const existingDate = new Date(item.created).toISOString();
      if (existingDate === correctDate) {
        skipped++;
        continue;
      }

      try {
        const updateResp = await fetch(
          `${PB_URL}/api/collections/news/records/${item.id}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ created: correctDate })
          }
        );

        const body = await updateResp.text();

        if (!updateResp.ok) {
          throw new Error(`Status ${updateResp.status}: ${body}`);
        }

        console.log(`[UPDATED] "${item.title}" → ${correctDate}`);
        updated++;
      } catch (e) {
        console.error(`[ERROR] Failed to update "${item.title}" (${item.id}):`, e);
        errors++;
      }
    } else {
      console.warn(`[NO MATCH] No CSV date found for: "${item.title}"`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Fix dates complete!`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (already correct): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  No CSV match: ${allNews.length - updated - skipped - errors}`);
  console.log(`========================================`);

} catch (e) {
  console.error("Process failed:", e);
}

Deno.exit(0);
