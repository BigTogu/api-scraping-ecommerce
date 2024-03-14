import playwright from "playwright";
import * as cheerio from "cheerio";

export const getPriceFromUrl = async (
  productUrl,
  classNameDenyBtn,
  classNamePrice
) => {
  try {
    const browser = await launchBrowser();

    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      userAgent: "Chrome/94.0.4606.81",
      extraHTTPHeaders: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      },
    });
    const page = await context.newPage();

    await page.goto(productUrl);
    await page.screenshot({ path: "myntra.png", fullPage: true });
    await page.click(classNameDenyBtn);

    // Get the updated HTML content after the navigation
    let html = await page.content();

    // Use cheerio after the content has been updated
    const $ = cheerio.load(html);

    const price = $(classNamePrice).text();

    await closeBrowser(browser);

    return price;
  } catch (err) {
    console.error(err);
  }
};

const launchBrowser = async () => {
  try {
    console.log("Lanzando el navegador...");
    return await playwright.chromium.launch({
      headless: true,
      slowMo: 300,
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
