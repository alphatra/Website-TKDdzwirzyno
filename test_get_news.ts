import PocketBase from "npm:pocketbase@0.26.5";
const pb = new PocketBase("https://tkddzwirzyno.pl");
const allNews = await pb.collection("news").getFullList();
console.log("Got news:", allNews.length);
