import { createClient } from "redis";
import { switchOn } from "./src/services/getProductPrice.js";
import dotenv from "dotenv";

dotenv.config();

let client;

if (process.env.NODE_ENV === "production") {
  client = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });
} else {
  client = createClient({
    url: process.env.REDIS_URL,
  });
}

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();
const crontabs = await client.keys("*-crontab");
// make a for over all the keys
for (const key of crontabs) {
  const productUrl = key.split("-crontab")[0];
  console.log("Making request to:", productUrl);
  const productSeller = productUrl.split(".")[1];
  console.log("Product Seller:", productSeller);
  const finalPrice = await switchOn(productSeller, productUrl);
  await client.set(productUrl, finalPrice, { EX: 60 * 60 });
}
await client.quit();
// crontab -e
// 0 * * * * /home/bigtogu/.nvm/versions/node/v21.6.2/bin/node /home/bigtogu/code/scraping_Ecommerce/crontab.js
