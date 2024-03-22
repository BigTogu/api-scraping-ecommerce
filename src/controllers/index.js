import {
  setKeyValue,
  setKeyValueCrontab,
  getKeyValue,
} from "../utils/redis.js";
import { fetchProductPriceFromSeller } from "../services/getProductPrice.js";

export async function getProductPrice(req, res) {
  const { productUrl } = req.body;

  // Verifica si la URL del producto ya está almacenada en Redis
  const productSeller = productUrl.split(".")[1];
  const cachedPrice = await getKeyValue(productUrl);

  // Si el precio está almacenado en Redis, lo devuelve
  if (cachedPrice) {
    // Almacena en una nueva linea de la tabla la key que es la url--crontab y el valor que es el precio
    setKeyValueCrontab(`${productUrl}-crontab`, cachedPrice);
    return res.json({
      productSeller: "cached",
      finalPrice: cachedPrice,
    });
  }

  // Si el precio no está almacenado en Redis, lo busca en la web con el scraping
  const finalPrice = await fetchProductPriceFromSeller(
    productSeller,
    productUrl
  );
  if (!finalPrice) {
    return res.json({ productSeller: "not found" });
  }

  // Almacena el precio en Redis
  await setKeyValue(productUrl, finalPrice, 3600);
  return res.json({ productSeller: productSeller, finalPrice });
}
