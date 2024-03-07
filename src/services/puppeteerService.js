import puppeteer from "puppeteer";

export const launchBrowser = async () => {
  return await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--disable-notifications"],
  });
};

export const closeBrowser = async (browser) => {
  await browser.close();
};

export const getPriceFromUrlAliexpress = async (productUrl) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.goto(productUrl);

    // Wait for the required DOM to be rendered
    await page.waitForSelector("div");
    let heading = await page.evaluate(() => {
      const div = document.body.querySelector(".es--wrap--erdmPRe");
      return div.innerText;
    });

    await closeBrowser(browser);
    console.log(heading);
    return heading;
  } catch (err) {
    console.error(err);
  }
};

export const getPriceFromUrlWithCookies = async (
  productUrl,
  classNameDenyBtn,
  classNamePriceSelector,
  classNamePrice
) => {
  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    });

    await page.goto(productUrl);

    await page.setBypassCSP(true);

    await page.waitForSelector(classNameDenyBtn, { visible: true });
    const form = await page.$(classNameDenyBtn);
    await form.evaluate((form) => form.click());

    // Esperar a que el selector específico esté presente en la página
    await page.waitForSelector(classNamePriceSelector, {
      visible: true,
      timeout: 30000,
    });

    let heading = await page.evaluate((classNamePrice) => {
      // Aquí classNamePrice se pasa como un argumento
      const div = document.body.querySelector(classNamePrice);
      return div ? div.innerText : null;
    }, classNamePrice);

    await closeBrowser(browser);

    return heading;
  } catch (err) {
    console.error(err);
  }
};
