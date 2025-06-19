const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function checkStock(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--start-maximized',
      ],
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/114.0.0.0 Safari/537.36'
    );

    // stealth mode
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      Object.defineProperty(navigator, 'plugins',   { get: () => [1,2,3] });
      Object.defineProperty(navigator, 'platform',  { get: () => 'MacIntel' });
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate(() => window.scrollBy(0, 400));
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: 'debug.png', fullPage: true });

    const inStock = await page.evaluate(() => {
      const text = document.body.innerText;

      if (/Shipping\s*Arrives by/i.test(text)) {
        console.log('Stock check: shipping available');
        return true;
      }
      if (/Shipping\s*Not available/i.test(text)) {
        console.log('Stock check: shipping not available');
        return false;
      }

      const mainBtn = document.querySelector('[data-test="add-to-cart-button"]');
      if (mainBtn) {
        const style = window.getComputedStyle(mainBtn);
        const cssDisabled    = style.pointerEvents === 'none' || parseFloat(style.opacity) < 0.5;
        const ariaDisabled   = mainBtn.getAttribute('aria-disabled') === 'true';
        const nativeDisabled = mainBtn.disabled === true;
        const visible        = mainBtn.offsetWidth > 0 && mainBtn.offsetHeight > 0;

        console.log('Stock check: main button state →',
          { visible, nativeDisabled, ariaDisabled, cssDisabled }
        );
        return visible && !nativeDisabled && !ariaDisabled && !cssDisabled;
      }

      const outOfStock = /out of stock/i.test(text);
      const soldOut    = /sold out/i.test(text);
      console.log('Stock check fallback →', { outOfStock, soldOut });
      return !(outOfStock || soldOut);
    });

    console.log('Final inStock:', inStock);
    return { inStock, lastChecked: new Date() };

  } catch (err) {
    console.error('Puppeteer error in checkStock:', err);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = checkStock;

