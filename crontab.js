import { createClient } from "redis";
import { switchOn } from "./src/services/getProductPrice.js";
import dotenv from "dotenv";

dotenv.config();

// Definición de la función para actualizar la información del precio del enlace
export async function updateLinkPriceInfo() {
  let client;

  // Verifica el entorno de ejecución
  if (process.env.NODE_ENV === "production") {
    client = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    });
  } else {
    // Si no está en producción, se conecta a la URL de Redis local
    client = createClient({
      url: process.env.REDIS_URL,
    });
  }

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  // Obtiene todas las claves que terminan con "-crontab" desde Redis
  const crontabs = await client.keys("*-crontab");

  // Itera sobre las claves obtenidas
  for (const key of crontabs) {
    // Obtiene la URL del producto
    const productUrl = key.split("-crontab")[0];
    console.log("Making request to:", productUrl);
    const productSeller = productUrl.split(".")[1];
    console.log("Product Seller:", productSeller);

    // Obtiene el precio final del producto
    const finalPrice = await switchOn(productSeller, productUrl);

    if (!finalPrice) {
      console.error("Error getting price for:", productUrl);
      continue;
    }

    // Almacena el precio final en Redis con una expiración de 1 hora
    await client.set(productUrl, finalPrice, { EX: 60 * 60 });
  }
  await client.quit();
}

// 0 * * * * /home/bigtogu/.nvm/versions/node/v21.6.2/bin/node /home/bigtogu/code/scraping_Ecommerce/crontab.js
