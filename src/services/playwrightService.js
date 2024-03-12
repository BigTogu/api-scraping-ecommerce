import playwright from "playwright";
import * as cheerio from "cheerio";

export const getPriceFromUrl = async (
  productUrl,
  classNameDenyBtn,
  classNamePrice
) => {
  try {
    const browser = await launchBrowser();
    const userAgentStrings = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2227.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.3497.92 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    ];
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      userAgent:
        userAgentStrings[Math.floor(Math.random() * userAgentStrings.length)],
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
    return await playwright.chromium.launch({ headless: true });
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
