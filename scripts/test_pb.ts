import PocketBase from "npm:pocketbase@0.26.5";

const pb = new PocketBase("https://tkddzwirzyno.pl");

try {
  const result = await pb.collection("news").getList(1, 10, {
    sort: "-created",
  });
  console.log("Success! Items:", result.items.length);
} catch (e) {
  console.error("Error fetching news:", e.message);
  console.error(e);
}
