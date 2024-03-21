import playwright from "playwright";
import * as cheerio from "cheerio";

// Función para obtener el precio desde una URL
export const getPriceFromUrl = async (
  productUrl,
  classNameDenyBtn, // Clase del botón para cerrar ventanas emergentes o modales
  classNamePrice // Clase del precio del producto
) => {
  try {
    // Inicia un navegador usando Playwright
    const browser = await launchBrowser();

    // Crea un nuevo contexto de navegación en el navegador
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      userAgent: "Chrome/94.0.4606.81",
      extraHTTPHeaders: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      },
    });

    // Crea una nueva página en el contexto de navegación
    const page = await context.newPage();

    // Navega a la URL del producto
    await page.goto(productUrl);

    // Toma una captura de pantalla de la página para ver porque está fallando, parece ser que se ve el cloudflare
    await page.screenshot({ path: "myntra.png", fullPage: true });

    // Espera a que el botón de denegar aparezca en la página
    await page.click(classNameDenyBtn);

    // Espera a que la página cargue completamente
    let html = await page.content();

    // Carga el HTML en Cheerio
    const $ = cheerio.load(html);

    // Obtiene el precio del producto
    const price = $(classNamePrice).text();

    // Cierra el navegador
    await closeBrowser(browser);

    return price;
  } catch (err) {
    console.error(err);
  }
};

const launchBrowser = async () => {
  try {
    console.log("Lanzando el navegador...");

    // Lanza el navegador Chromium de Playwright
    return await playwright.chromium.launch({
      headless: true, // Cambiar a false para ver el navegador en acción
      slowMo: 300, // Añade un retraso de 300 ms entre cada acción
    });
  } catch (error) {
    console.error("Error al lanzar el navegador:", error);
    throw error;
  }
};

const closeBrowser = async (browser) => {
  try {
    await browser.close();
  } catch (error) {
    console.error("Error al cerrar el navegador:", error);
  }
};
