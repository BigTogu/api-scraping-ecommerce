import { getPriceFromUrl } from "./playwrightService.js";

const Selectors = {
  mediamarkt: {
    denyBtn: ".sc-4615157e-13.hPIYBS [data-test='pwa-consent-layer-deny-all']",
    price: "div.sc-a2b334e5-2",
  },
  elcorteingles: {
    denyBtn: "#onetrust-reject-all-handler",
    price: "span.price-sale",
  },
  aliexpress: {
    denyBtn: ".btn-accept",
    price: "div.product-price-current",
  },
  pccomponentes: {
    denyBtn: "#cookiesrejectAll",
    price: "span#pdp-price-current-integer",
  },
};

const getProductPrice = async (productUrl, selectors) => {
  try {
    const productPrice = await getPriceFromUrl(
      productUrl,
      selectors.denyBtn,
      selectors.price
    );
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
