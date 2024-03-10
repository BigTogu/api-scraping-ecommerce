import puppeteer from "puppeteer";

const launchBrowser = async () => {
  try {
    return await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
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

export const getPriceFromUrl = async (
  productUrl,
  classNameDenyBtn,
  classNamePriceSelector,
  classNamePrice
) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();

    // Configurar encabezados HTTP
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    });

    // Navegar a la URL del producto
    await page.goto(productUrl);

    // Esperar a que el botón de denegar esté presente y hacer clic en él
    await page.waitForSelector(classNameDenyBtn, { visible: true });
    const form = await page.$(classNameDenyBtn);
    await form.evaluate((form) => form.click());

    // Esperar a que el selector de precio esté presente en la página
    await page.waitForSelector(classNamePriceSelector, {
      visible: true,
      timeout: 10000,
    });

    // Obtener el precio utilizando el selector proporcionado
    const price = await page.$eval(classNamePrice, (element) =>
      element ? element.innerText : null
    );

    await closeBrowser(browser);

    return price;
  } catch (err) {
    console.error(err);
  }
};
