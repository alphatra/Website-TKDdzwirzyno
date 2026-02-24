import { load } from "jsr:@std/dotenv";
import PocketBase from "npm:pocketbase@0.21.3";
const env = await load();
const PB_URL = "https://tkddzwirzyno.pl"\; 
const PB_ADMIN_EMAIL = Deno.env.get("PB_ADMIN_EMAIL") || env["PB_ADMIN_EMAIL"];
const PB_ADMIN_PASSWORD = Deno.env.get("PB_ADMIN_PASSWORD") || env["PB_ADMIN_PASSWORD"];
const pb = new PocketBase(PB_URL);
try {
  const authData = await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log("Logged in:", authData.admin.email);
  const result = await pb.collection("news").getList(1, 10);
  console.log("Got news:", result.items.length);
} catch (e) {
  console.error("Auth failed:", e);
}
