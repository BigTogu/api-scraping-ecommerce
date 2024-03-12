import playwright from "playwright";
import * as cheerio from "cheerio";

export const getPriceFromUrl = async (
  productUrl,
  classNameDenyBtn,
  classNamePrice
) => {
  try {
    const browser = await launchBrowser();

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(productUrl);

    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 4000 + 1000))
    );

    // Scroll the page to load additional content
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));

    // Add another random delay of 1 to 5 seconds
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 4000 + 1000))
    );

    await page.screenshot({ path: "myntra.png", fullPage: true });
    let htmlVerify = await page.content();
    console.log(htmlVerify, "-----------------");
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
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
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
