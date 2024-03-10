import puppeteer from "puppeteer";

const launchBrowser = async () => {
  try {
    console.log("Lanzando el navegador...");
    return await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ["--disable-notifications", "--no-sandbox"],
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
    await page.screenshot({ path: "before-click.png" });
    await page.waitForSelector(classNameDenyBtn, { visible: true });
    const form = await page.$(classNameDenyBtn);
    await form.evaluate((form) => form.click());
    await page.screenshot({ path: "after-click.png" });

    // Esperar a que el selector de precio esté presente en la página
    await page.waitForSelector(classNamePriceSelector, {
      visible: true,
      timeout: 10000,
    });
    await page.screenshot({ path: "info.png" });

    // Obtener el precio utilizando el selector proporcionado
    const price = await page.$eval(classNamePrice, (element) =>
      element ? element.innerText : null
    );
    console.log(price, "--------price");

    await closeBrowser(browser);

    return price;
  } catch (err) {
    console.error(err);
  }
};
