import { Handlers } from "$fresh/server.ts";
import PocketBase from "pocketbase";

// Configure these safely in Deno Deploy / environment variables
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");
const PB_ADMIN_EMAIL = Deno.env.get("PB_ADMIN_EMAIL");
const PB_ADMIN_PASSWORD = Deno.env.get("PB_ADMIN_PASSWORD");
const PB_URL = Deno.env.get("POCKETBASE_URL") || "http://127.0.0.1:8090";

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

interface FacebookWebhookPayload {
  message?: string;
  picture?: string;
  link?: string;
  created_time?: string;
}

export const handler: Handlers = {
  async POST(req, _ctx) {
    // 1. Authenticate the Webhook Request via Secret Header
    const requestSecret = req.headers.get("x-webhook-secret");
    
    if (!WEBHOOK_SECRET) {
      console.error("WEBHOOK_SECRET is not configured on the server.");
      return new Response("Server configuration error", { status: 500 });
    }

    if (requestSecret !== WEBHOOK_SECRET) {
      console.warn("Unauthorized webhook attempt blocked.");
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      // 2. Parse the payload coming from Zapier/Make
      const payload: FacebookWebhookPayload = await req.json();

      if (!payload.message && !payload.picture) {
        return new Response("No content to publish", { status: 400 });
      }

      // 3. Authenticate as Admin with PocketBase
      if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
        throw new Error("Missing PB admin credentials in environment.");
      }
      
      await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);

      // 4. Prepare data for the `news` collection
      // Extract a title from the message (first 50 chars or similar)
      const rawText = payload.message || "Nowy post na naszym fanpage'u!";
      const firstLine = rawText.split('\n')[0].trim();
      
      // Clean up title (remove hashtags for title)
      let title = firstLine.substring(0, 60);
      if (title.length === 60) title += "...";
      
      // Basic formatting for content (very simple HTML conversion for line breaks)
      let contentHtml = `<p>${rawText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
      
      if (payload.link) {
          contentHtml += `<p><a href="${payload.link}" target="_blank" rel="noopener noreferrer"><strong>Zobacz orginalny post na Facebooku &rarr;</strong></a></p>`;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("summary", rawText.substring(0, 150) + (rawText.length > 150 ? "..." : ""));
      formData.append("content", contentHtml);

      // 5. Handle Image Download & Attachment
      if (payload.picture) {
        console.log(`Downloading image from: ${payload.picture}`);
        const imageResponse = await fetch(payload.picture);
        
        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          // Provide a generic filename with correct extension
          formData.append("image", imageBlob, "facebook-auto.jpg");
        } else {
          console.warn("Failed to fetch image from Facebook URL.", imageResponse.status);
        }
      }

      // 6. Create Record in PocketBase
      const record = await pb.collection("news").create(formData);
      
      // 7. Clear admin auth state
      pb.authStore.clear();

      console.log(`Successfully created news article from FB: ${record.id}`);
      return new Response(JSON.stringify({ success: true, id: record.id }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error("Error processing Facebook webhook:", error);
      
      // Make sure to clear auth state even on failure
      pb.authStore.clear();

      return new Response(JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },
};
