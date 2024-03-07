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

      return productPriceMediamark.split("€")[1];

    case "elcorteingles":
      const productPriceElCorteIngles = await getPriceFromUrlWithCookies(
        productUrl,
        "#onetrust-reject-all-handler",
        ".product_detail-aside--price_color_selector",
        ".price-container"
      );
      return productPriceElCorteIngles;

    case "aliexpress":
      const productPriceAliexpress = await getPriceFromUrlAliexpress(
        productUrl
      );
      return productPriceAliexpress;

    case "pccomponentes":
      const productPricePcComponents = await getPriceFromUrlWithCookies(
        productUrl,
        "#cookiesrejectAll",
        "#pdp-price-current-integer",
        "#pdp-price-current-integer"
      );

      return productPricePcComponents;
    default:
      return null;
  }
};
