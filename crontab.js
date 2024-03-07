import { createClient } from "redis";
import { switchOn } from "services/getProductPrice";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();
const crontabs = await client.keys("*-crontab");
// make a for over all the keys
for (const key of crontabs) {
  const productUrl = key.split("-crontab")[0];
  const productSeller = productUrl.split(".")[1];
  const finalPrice = await switchOn(productSeller, productUrl);
  await client.set(key, finalPrice, { EX: 60 * 60 });
}

// 0 * * * * /home/bigtogu/.nvm/versions/node/v21.6.2/bin/node /home/bigtogu/code/scraping_Ecommerce/crontab.js
