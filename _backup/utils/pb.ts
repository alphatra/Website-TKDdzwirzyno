import PocketBase from "npm:pocketbase";

const pb = new PocketBase(
  Deno.env.get("POCKETBASE_URL") || "http://127.0.0.1:8090",
);

// Globally disable auto-cancellation
pb.autoCancellation(false);

export default pb;
