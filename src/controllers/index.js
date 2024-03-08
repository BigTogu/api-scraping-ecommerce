import {
  setKeyValue,
  setKeyValueCrontab,
  getKeyValue,
} from "../utils/redis.js";
import { switchOn } from "../services/getProductPrice.js";

export async function getProductPrice(req, res) {
  console.log(req.body);
  const { productUrl } = req.body;
  const productSeller = productUrl.split(".")[1];
  const cachedPrice = await getKeyValue(productUrl);

  if (cachedPrice) {
    setKeyValueCrontab(`${productUrl}-crontab`, cachedPrice);
    return res.json({
      productSeller: "cached",
      finalPrice: cachedPrice,
    });
  }

  const finalPrice = await switchOn(productSeller, productUrl);
  if (!finalPrice) {
    return res.json({ productSeller: "not found" });
  }
  await setKeyValue(productUrl, finalPrice, 3600);
  return res.json({ productSeller: productSeller, finalPrice });
}
