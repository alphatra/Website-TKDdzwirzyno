import PocketBase from "pocketbase";

const url = Deno.env.get("POCKETBASE_URL") || "http://127.0.0.1:8090";
console.log("POCKETBASE_URL:", url);

const pb = new PocketBase(url);

// Globally disable auto-cancellation
pb.autoCancellation(false);

export default pb;
