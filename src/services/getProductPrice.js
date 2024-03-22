import { getPriceFromUrl } from "./playwrightService.js";

// Define un objeto Selectors que contiene los selectores CSS para diferentes vendedores
const Selectors = {
  mediamarkt: {
    denyBtn: ".sc-4615157e-13.hPIYBS [data-test='pwa-consent-layer-deny-all']",
    price: "div.sc-a2b334e5-2",
  },
  elcorteingles: {
    denyBtn: "#onetrust-reject-all-handler",
    price: "span.price-unit--normal",
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

// Función para obtener el precio del producto
const fetchProductPrice = async (productUrl, selectors) => {
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

// Función principal que selecciona el vendedor y obtiene el precio del producto
export const fetchProductPriceFromSeller = async (
  productSeller,
  productUrl
) => {
  // Obtiene los selectores para el vendedor proporcionado
  const selectors = Selectors[productSeller];

  if (!selectors) {
    console.error("Vendedor no válido:", productSeller);
    return null;
  }

  // Obtiene el precio del producto del vendedor proporcionado
  switch (productSeller) {
    case "mediamarkt":
    case "elcorteingles":
    case "aliexpress":
    case "pccomponentes":
      return fetchProductPrice(productUrl, selectors);

    default:
      return null;
  }
};
