import puppeteer from "puppeteer";
import { setKeyValue } from "../utils/redis.js";
import {
  getPriceFromUrlAliexpress,
  getPriceFromUrlWithCookies,
} from "../services/puppeteerService.js";

export const switchOn = async (productSeller, productUrl) => {
  switch (productSeller) {
    case "mediamarkt":
      const productPriceMediamark = await getPriceFromUrlWithCookies(
        productUrl,
        ".sc-4615157e-13.hPIYBS [data-test='pwa-consent-layer-deny-all']",
        ".gDdWDo",
        ".kOaCal"
      );

      const finalPrice = productPriceMediamark.split("€")[1];

    case "elcorteingles":
      const productPriceElCorteIngles = await getPriceFromUrlWithCookies(
        productUrl,
        "#onetrust-reject-all-handler",
        ".product_detail-aside--price_color_selector",
        ".price-container"
      );
      await setKeyValue(productUrl, productPriceElCorteIngles, 3600);

      return res.json({
        productSeller: "elcorteingles",
        productPriceElCorteIngles,
      });

    case "aliexpress":
      const productPriceAliexpress = await getPriceFromUrlAliexpress(
        productUrl
      );

      await setKeyValue(productUrl, productPriceAliexpress, 3600);

      return res.json({ productSeller: "aliexpress", productPriceAliexpress });

    case "pccomponentes":
      const productPricePcComponents = await getPriceFromUrlWithCookies(
        productUrl,
        "#cookiesrejectAll",
        "#pdp-price-current-integer",
        "#pdp-price-current-integer"
      );

      const newProductPrice = productPricePcComponents;
      await setKeyValue(productUrl, newProductPrice, 3600);

      return res.json({
        productSeller: "pccomponentes",
        newProductPrice,
      });
    default:
      return res.json({ productSeller: "not found" });
  }
};

export async function getProductPrice(req, res) {
  const { productUrl } = req.body;
  const productSeller = productUrl.split(".")[1];

  switch (productSeller) {
    case "mediamarkt":
      const productPriceMediamark = await getPriceFromUrlWithCookies(
        productUrl,
        ".sc-4615157e-13.hPIYBS [data-test='pwa-consent-layer-deny-all']",
        ".gDdWDo",
        ".kOaCal"
      );

      const finalPrice = productPriceMediamark.split("€")[1];
      await setKeyValue(productUrl, finalPrice, 3600);

      return res.json({ productSeller: "mediamarkt", finalPrice });

    case "elcorteingles":
      const productPriceElCorteIngles = await getPriceFromUrlWithCookies(
        productUrl,
        "#onetrust-reject-all-handler",
        ".product_detail-aside--price_color_selector",
        ".price-container"
      );
      await setKeyValue(productUrl, productPriceElCorteIngles, 3600);

      return res.json({
        productSeller: "elcorteingles",
        productPriceElCorteIngles,
      });

    case "aliexpress":
      const productPriceAliexpress = await getPriceFromUrlAliexpress(
        productUrl
      );

      await setKeyValue(productUrl, productPriceAliexpress, 3600);

      return res.json({ productSeller: "aliexpress", productPriceAliexpress });

    case "pccomponentes":
      const productPricePcComponents = await getPriceFromUrlWithCookies(
        productUrl,
        "#cookiesrejectAll",
        "#pdp-price-current-integer",
        "#pdp-price-current-integer"
      );

      const newProductPrice = productPricePcComponents;
      await setKeyValue(productUrl, newProductPrice, 3600);

      return res.json({
        productSeller: "pccomponentes",
        newProductPrice,
      });
    default:
      return res.json({ productSeller: "not found" });
  }
  const finalPrice = await switchOn(productSeller, productUrl);
  return res.json({ productSeller: "mediamarkt", finalPrice });
}
