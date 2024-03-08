import { getPriceFromUrl } from "../services/puppeteerService.js";

const Selectors = {
  mediamarkt: {
    denyBtn: ".sc-4615157e-13.hPIYBS [data-test='pwa-consent-layer-deny-all']",
    price: ".sc-a2b334e5-0",
  },
  elcorteingles: {
    denyBtn: "#onetrust-reject-all-handler",
    price: ".product_detail-aside--price_color_selector",
  },
  aliexpress: {
    denyBtn: ".btn-accept",
    price: ".es--wrap--erdmPRe",
  },
  pccomponentes: {
    denyBtn: "#cookiesrejectAll",
    price: "#pdp-price-current-integer",
  },
};

const getProductPrice = async (productUrl, selectors) => {
  try {
    const productPrice = await getPriceFromUrl(
      productUrl,
      selectors.denyBtn,
      selectors.price,
      selectors.price
    );
    console.log(productPrice, "--------productPrice");
    return productPrice;
  } catch (error) {
    console.error("Error al obtener el precio del producto:", error);
    return null;
  }
};

export const switchOn = async (productSeller, productUrl) => {
  const selectors = Selectors[productSeller];

  if (!selectors) {
    console.error("Vendedor no válido:", productSeller);
    return null;
  }

  switch (productSeller) {
    case "mediamarkt":
      return getProductPrice(productUrl, selectors);

    case "elcorteingles":
    case "aliexpress":
    case "pccomponentes":
      return getProductPrice(productUrl, selectors);

    default:
      return null;
  }
};
